import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../api/api";

export default function Signup(){
    const [formData, setFormData] = useState({
        email: "",
        displayname: "",
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { signup } = useAuth();

    const handleChange = (e) => {
        const [name, value] = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try{
            await signup(formData);
            
        }
        catch(err){
            console.error(err.response?.data);
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input 
                type="email" 
                name="email"
                onChange={handleChange}
                placeholder="Email"
                autoComplete="email"
                required 
            />
            <label htmlFor="displayname">Display Name</label>
            <input 
                type="text" 
                name="displayname"
                onChange={handleChange}
                placeholder="Display Name"
                autoComplete="off"
                required
            />
            <label htmlFor="username">Username</label>
            <input 
                type="text" 
                name="username"
                onChange={handleChange}
                placeholder="Username"
                autoComplete="name"
                required
            />
            <label htmlFor="password">Password</label>
            <input 
                type="password" 
                name="password"
                onChange={handleChange}
                placeholder="Password"
                required
            />
            <button
                type="submit"
            >
                {loading ? "Creating..." : "Create Account"}
            </button>
        </form>
    );
}