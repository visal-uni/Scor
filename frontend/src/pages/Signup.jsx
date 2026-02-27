import { useState } from "react";
import apiClient from "../../api/api";
import Login from "./Login";
import {Link} from "react-router-dom";

export default function SignUp(){

    const [formData, setFormData] = useState({fullName: "", email: ""});
    const [formRequired, setFormRequired] = useState({fullName: false, email: false});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));

        if(value.trim()){
            setFormRequired(prev => ({...prev, [name]: false}));
        }

        setError("");
    }

    const validateForm = () => {
        const newError = {
            fullName: !formData.fullName.trim(),
            email: !formData.email.trim()
        }

        setFormRequired(newError);
        return !newError.fullName && !newError.email;
    }

    const isValidatEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validateForm()) return;

        if(!isValidatEmail(formData.email)){
            setError("Please enter a vaild email address");
            return;
        }

        setLoading(true);
        setError("");

        try{
            await apiClient.post("/auth/request-code", {email: formData.email});
            setFormData({fullName: "", email: ""});
            setFormRequired({fullName: false, email: false});
        }
        catch(err){
            setError(err.message);
            setError(err.response?.data?.message || "Failed to send code. Please try again.");
        }
        finally{
            setLoading(false);
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center text-gray-950 font-poppins bg-gray-50">
            <form onSubmit={handleSubmit} className="flex flex-col p-[70px_20px_50px_20px] ring ring-gray-300 rounded-lg shadow-2xl shadow-gray-350 bg-white">
                <h1 className="text-2xl text-center font-semibold mb-2">Create an Account</h1>
                <p className="text-base text-center text-gray-500 mb-5">Please enter your details to create an account.</p>
                <label className="text-sm font-medium" htmlFor="fullName">Full Name</label>
                <input
                    className="text-sm p-2.5 rounded-lg outline-none ring-1 ring-gray-400 focus:ring-1 focus:ring-gray-950 mt-1 mb-1"  
                    type="text" 
                    name="fullName" 
                    id="fullName"
                    placeholder="Full name"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleChange}
                    maxLength={100}
                />
                <span className="text-red-600 text-sm">{formRequired.fullName && "Full name is required"}</span>
                <label className="text-sm font-medium mt-3.5" htmlFor="email">Email</label>
                <input
                    className="text-sm p-2.5 rounded-lg outline-none ring-1 ring-gray-400 focus:ring-1 focus:ring-gray-950 mt-1 mb-1"
                    type="email" 
                    name="email" 
                    id="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={225}
                />
                <span className="text-red-600 text-sm">{formRequired.email && "Email is required"}</span>
                <button
                    className="text-base text-white text-center font-medium bg-gray-950 p-2.5 rounded-lg ring-1 ring-black cursor-pointer hover:bg-gray-800 mt-8 mb-15"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send email code"}
                </button>
                <Login/>
                <span className="text-base text-center text-gray-500 mb-5">Already have an account? <Link className="text-black font-semibold underline" to="/sign-in">Sign in</Link></span>
            </form>
        </div> 
    );
}