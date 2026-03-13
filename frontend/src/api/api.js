import axios from "axios";

// ── Constants ──────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const TIMEOUT  = 10_000; // 10s — 5s is too tight for slow connections

// ── Instance ───────────────────────────────────────────────────────────────
const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: TIMEOUT,
    headers: {
        "Content-Type": "application/json",
        "Accept":        "application/json",
    },
});

// ── Request Interceptor ────────────────────────────────────────────────────
apiClient.interceptors.request.use(
    (config) => {
        // 1. Attach CSRF token if present in the DOM (e.g. set by the server)
        const csrf = document?.cookie
            .split("; ")
            .find((row) => row.startsWith("csrf-token="))
            ?.split("=")[1];

        if (csrf) config.headers["X-CSRF-Token"] = csrf;

        // 2. Strip accidental double slashes in the URL (except https://)
        config.url = config.url?.replace(/([^:]\/)\/+/g, "$1");

        // 3. Abort duplicate in-flight requests (e.g. rapid button clicks)
        const controller = new AbortController();
        config.signal = controller.signal;

        // 4. Log outgoing requests in dev only
        if (import.meta.env.DEV) {
            console.debug(`[API →] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
                params:  config.params,
                payload: config.data,
            });
        }

        return config;
    },
    (error) => {
        console.error("[API] Request setup error:", error.message);
        return Promise.reject(error);
    }
);

// ── Response Interceptor ───────────────────────────────────────────────────

// Track if a token refresh is already in progress to avoid refresh loops
let isRefreshing  = false;
let refreshQueue  = []; // Queued requests waiting on the refresh

const processQueue = (error) => {
    refreshQueue.forEach(({ resolve, reject }) =>
        error ? reject(error) : resolve()
    );
    refreshQueue = [];
};

apiClient.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.debug(
                `[API ←] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
                response.data
            );
        }
        return response;
    },

    async (error) => {
        const { response, config } = error;
        const status  = response?.status;
        const message = response?.data?.message ?? error.message;

        // ── 401: Session expired → attempt silent token refresh ────────────
        if (status === 401 && !config?._retried) {
            if (isRefreshing) {
                // Queue this request until the refresh resolves
                return new Promise((resolve, reject) => {
                    refreshQueue.push({ resolve, reject });
                }).then(() => apiClient(config))
                  .catch(Promise.reject.bind(Promise));
            }

            config._retried  = true;
            isRefreshing     = true;

            try {
                await apiClient.post("/auth/refresh"); // Your refresh endpoint
                processQueue(null);
                return apiClient(config); // Replay the original request
            } catch (refreshError) {
                processQueue(refreshError);
                console.error("[Auth] Session expired. Please log in again.");
                // Optionally redirect: window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // ── 403: Forbidden ─────────────────────────────────────────────────
        if (status === 403) {
            console.warn("[Auth] Access denied:", config?.url);
        }

        // ── 404: Not found ─────────────────────────────────────────────────
        if (status === 404) {
            console.warn(`[API] Resource not found: ${config?.url}`);
        }

        // ── 429: Rate limited → surface wait time from header ──────────────
        if (status === 429) {
            const retryAfter = response?.headers?.["retry-after"];
            console.warn(`[API] Rate limited. Retry after ${retryAfter ?? "?"}s`);
        }

        // ── 5xx: Server error ──────────────────────────────────────────────
        if (status >= 500) {
            console.error(`[API] Server error (${status}):`, message);
        }

        // ── Network / timeout ──────────────────────────────────────────────
        if (!response) {
            if (error.code === "ECONNABORTED") {
                console.error("[API] Request timed out:", config?.url);
            } else {
                console.error("[API] Network error — server unreachable.");
            }
        }

        // Normalize the error shape so every consumer gets a consistent object
        const normalizedError = {
            status: status ?? null,
            message,
            url: config?.url ?? null,
            raw: error,
        };

        return Promise.reject(normalizedError);
    }
);

export default apiClient;