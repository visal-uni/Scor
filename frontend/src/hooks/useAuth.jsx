import { createContext, useContext } from "react";

export const AuthContext = createContext({
    user: null,
    isAuthenticated:false,
    isInitializing: true,
    isLoading: false,

    login: async () => {},
    logout: () => {},
    register: async () => {},

    loginStatus: {
        isPending: false,
        isSuccess: false,
        error: null,
        reset: () => {},
    },

    logoutStatus: {
        isPending: false,
        error: null,
    },

    registerStatus: {
        isPending: false,
        isSuccess: false,
        error: null,
        reset: () => {},
    },
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context)
        throw new Error("useAuth must be used within an AuthProvider");

    return context;
}