import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
export default function PublicRoute(){
    const {isAuthenticated, isInitializing} = useAuth();
    
    if(isInitializing) return <div>Loading...</div>;
    return isAuthenticated ? <Navigate to="/home" replace/> : <Outlet/>;
}