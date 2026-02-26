import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp';
import Login from './pages/Login';

export default function App(){
  return(
    <Routes>
      <Route path='/' element={<Navigate to="/sign-up"/>} />
      <Route path='/sign-up' element={<SignUp/>}/>
      <Route path='/login' element={<Login/>} />
    </Routes>
  );
}