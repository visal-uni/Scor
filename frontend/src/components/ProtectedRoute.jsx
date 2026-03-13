import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
export default function ProtectedRoute(){
    const {isAuthenticated, isInitializing} = useAuth();
    
    if(isInitializing) return <div>Loading...</div>;
    return isAuthenticated ? <Outlet/> : <Navigate to="/login" replace/>;
}