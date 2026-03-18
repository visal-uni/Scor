import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
    const navigate = useNavigate();
    const {
        logout,
        logoutStatus: { isPending, isSuccess },
    } = useAuth();
    
    const handleLogout = () => {
        logout();
    }

    useEffect(() => {
        if (isSuccess) {
            navigate("/login", { replace: true });
        }
    }, [isSuccess, navigate]);

    return (
        <>
            <h1>Home</h1>
            <button
                onClick={handleLogout}
                disabled={isPending}
            >
                Logout
            </button>
        </>
    );
}