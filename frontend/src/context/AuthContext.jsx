import { useContext, createContext, useState } from "react";
import apiClient from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);

    const signup = async (data) => {
        await apiClient.post("/auth/request-code", {email: data.email});
        setUser(data);
    }

    return(
        <AuthContext.Provider value={{user, signup}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);