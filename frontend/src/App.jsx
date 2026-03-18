import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Signup from "./pages/form/Signup";
import Login from "./pages/form/Login";
import Verify from "./pages/form/Verify";
import Home from "./pages/home";
export default function App(){
  const { isInitializing } = useAuth();

  if(isInitializing){
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }
  return(
    <Routes>
      {/*Default Route*/}
      <Route path="/" element={<Navigate to="/home"/>}/>

      {/*Public Routes*/}
      <Route element={<PublicRoute/>}>  
        <Route path="/sign-up" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/verify" element={<Verify/>}/>
      </Route>
 
      {/*Protected Routes*/}
      <Route element={<ProtectedRoute/>}>
        <Route path="/home" element={<Home/>}/>
      </Route>

      {/*404 Route*/}
    </Routes>
  );
};