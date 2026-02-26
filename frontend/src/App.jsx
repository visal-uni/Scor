import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/Signup';
import Login from './pages/Login';

export default function App(){
  return(
    <Routes>
      <Route path='/' element={<Navigate to="/signup"/>} />
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/login' element={<Login/>} />
    </Routes>
  );
}