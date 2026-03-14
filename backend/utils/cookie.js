export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";

const isProd = process.env.NODE_ENV === "production";

// In dev (http://localhost:5173 ↔ http://localhost:5000), cookies must be:
// - secure: false (otherwise the browser drops them on http)
// - sameSite: "lax" (ports on localhost are same-site, works with XHR)
// In production you should serve over HTTPS and can tighten this.
const base = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
};

export const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie(ACCESS_COOKIE, accessToken, {
        ...base,
        maxAge: 15 * 60 * 1000,
    });

    res.cookie(REFRESH_COOKIE, refreshToken, {
        ...base,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/auth/refresh",
    });
};

export const clearAuthCookies = (res) => {
    res.clearCookie(ACCESS_COOKIE, { ...base });
    res.clearCookie(REFRESH_COOKIE, { ...base, path: "/auth/refresh" });
};