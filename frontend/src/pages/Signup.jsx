import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignUp(){
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [dataForm, setDataForm] = useState({
        email: "",
        displayname: "",
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setDataForm(prev => ({...prev, [name]: value}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await signup(dataForm);
            setDataForm({
                email: "",
                displayname: "",
                username: "",
                password: ""
            });
        }
        catch(err){
            console.error(err.response?.data);
        }
        finally{
            navigate("/verify");
        }
    }
    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input 
                type="email" 
                name="email" 
                id="email"
                onChange={handleChange}
            />
            <label htmlFor="displayname">Display Name</label>
            <input 
                type="text" 
                name="displayname" 
                id="displayname" 
                onChange={handleChange}
            />
            <label htmlFor="username">User Name</label>
            <input 
                type="text" 
                name="username" 
                id="username" 
                onChange={handleChange}
            />
            <label htmlFor="password">Password</label>
            <input 
                type="password" 
                name="password" 
                id="password" 
                onChange={handleChange}
            />
            <button
                type="submit"
            >
                Create Account
            </button>
        </form>
    );
}