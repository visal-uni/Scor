import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../hooks/useAuth";
import apiClient from "../api/api";

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();

    // 1. Get current user (Auto-runs on page load)
    const {
        data: user,
        isLoading,
        isFetching,
        isError: isAuthError,
    } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const { data } = await apiClient.get("/auth/me");
                return data ?? null;
            } catch (err) {
                // Treat 401 as "not logged in", not a real error
                if (err?.response?.status === 401) return null;
                throw err;
            }
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false, // Avoid surprise refetches
        placeholderData: null,       // Avoid undefined flicker on first load
    });

    // 2. Login Mutation
    const loginMutation = useMutation({
        mutationFn: (credentials) => apiClient.post("/auth/login", credentials),
        onSuccess: (res) => {
            queryClient.setQueryData(["authUser"], res.data.user);
        },
        onError: (err) => {
            console.error("[Auth] Login failed:", err?.response?.data?.message ?? err.message);
        },
    });

    // 3. Logout Mutation
    const logoutMutation = useMutation({
        mutationFn: () => apiClient.post("/auth/logout"),
        onSuccess: () => {
            queryClient.setQueryData(["authUser"], null);
            queryClient.clear();
        },
        onError: (err) => {
            // Still clear local state even if server logout fails
            console.error("[Auth] Logout failed:", err?.response?.data?.message ?? err.message);
            queryClient.setQueryData(["authUser"], null);
            queryClient.clear();
        },
    });

    // 4. Register Mutation (common pattern missing from original)
    const registerMutation = useMutation({
        mutationFn: (userData) => apiClient.post("/auth/register", userData),
        onSuccess: (res) => {
            queryClient.setQueryData(["authUser"], res.data.user);
        },
        onError: (err) => {
            console.error("[Auth] Registration failed:", err?.response?.data?.message ?? err.message);
        },
    });

    //5. Request Mutation
    const requestMutation = useMutation({
        mutationFn: (email) => apiClient.post("/auth/request-code", email),
        onSuccess: (res) => {
            queryClient.setQueryData(["authUser"], res.data.user);
        },
        onError: (err) => {
            console.error("[Auth] Request failed:", err?.response?.data?.message ?? err.message);
        },
    });

    //6. Verify Mutation
    const verifyMutation = useMutation({
        mutationFn: (verifyData) => apiClient.post("/auth/verify-code", verifyData),
        onSuccess: (res) => {
            queryClient.setQueryData(["authUser"], res.data.user);
        },
        onError: (err) => {
            console.error("[Auth] Verify failed:", err?.response?.message?.data ?? err.message);
        }
    });

    // Derived state — avoids pushing raw booleans to consumers
    const isAuthenticated = !!user;
    const isInitializing = isLoading && !isAuthError; // True only on very first load

    const value = {
        // User state
        user: user ?? null,
        isAuthenticated,
        isInitializing,
        isLoading: isLoading || isFetching,

        // Auth actions
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutate,
        register: registerMutation.mutateAsync,
        verify: verifyMutation.mutateAsync,
        request: requestMutation.mutateAsync,

        // Status objects
        loginStatus: {
            isPending: loginMutation.isPending,
            isSuccess: loginMutation.isSuccess,
            error: loginMutation.error?.response?.data?.message ?? null,
            reset: loginMutation.reset, // Let components clear error state
        },
        logoutStatus: {
            isPending: logoutMutation.isPending,
            error: logoutMutation.error?.response?.data?.message ?? null,
        },
        registerStatus: {
            isPending: registerMutation.isPending,
            isSuccess: registerMutation.isSuccess,
            error: registerMutation.error?.response?.data?.message ?? null,
            reset: registerMutation.reset,
        },
        requestStatus: {
            isPendingReq: requestMutation.isPending,
            isSuccessReq: requestMutation.isSuccess,
            errorReq: requestMutation.error?.response?.data?.message ?? null,
            resetReq: registerMutation.reset,
        },
        verifyStatus: {
            isPending: verifyMutation.isPending,
            isSuccess: verifyMutation.isSuccess,
            error: verifyMutation.isError,
            reset: verifyMutation.reset,
        },
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};