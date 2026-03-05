import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/form/Signup";
import Login from "./pages/form/Login";
import Verify from "./pages/form/Verify";

export default function App(){
  return(
    <Routes>

      { /*Public routes*/ }
      <Route path="/" element={<Navigate to="/sign-up"/>}/>
      <Route path="/sign-up" element={<Signup/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/verify" element={<Verify/>}/>

       
    </Routes>
  );
};