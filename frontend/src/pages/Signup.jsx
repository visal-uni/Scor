import { useState } from "react";
import apiClient from "../../api/api";

export default function SignUp(){

    const [formData, setFormData] = useState({fullName: "", email: ""});
    const [formRequired, setFormRequired] = useState({fullName: false, email: false});

    const handleChange = (e) => {
        e.preventDefault();
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
        
        if(formData.fullName){
            setFormRequired({fullName: false})
        }

        if(formData.email){
            setFormRequired({email: false});
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(formData.email === "" && formData.fullName === ""){
            setFormRequired({fullName: true, email: true});
        }
        else if(formData.email === ""){
            setFormRequired({email: true});
        }
        else if(formData.fullName === ""){
            setFormRequired({fullName: true}); 
        }

        try{
            await apiClient.post("/auth/request-code", {email: formData.email});
            setFormData({fullName: "", email: ""});
        }
        catch(err){
            console.error(err.message);
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center text-gray-950 font-poppins">
            <form onSubmit={handleSubmit} className="flex flex-col">
                <h1 className="text-2xl text-center font-semibold mb-2">Create an Account</h1>
                <p className="text-base text-center text-gray-500 mb-5">Please enter your details to create an account.</p>
                <label className="text-sm font-medium" htmlFor="fullName">Full Name</label>
                <input
                    className="text-sm p-2.5 rounded-lg outline-none ring-1 ring-gray-400 focus:ring-1 focus:ring-gray-950 mt-1 mb-1"  
                    type="text" 
                    name="fullName" 
                    id="fullName"
                    placeholder="Full name"
                    autoComplete="family-name"
                    value={formData.fullName}
                    onChange={handleChange}
                />
                <span className="text-red-600 text-sm">{formRequired.fullName && "Required"}</span>
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
                />
                <span className="text-red-600 text-sm">{formRequired.email && "Required"}</span>
                <button
                    className="text-base text-white text-center font-medium bg-gray-950 p-2.5 rounded-lg ring-1 ring-black cursor-pointer hover:bg-gray-800 mt-8"
                    type="submit"
                >
                    Send email code
                </button>
            </form>
        </div> 
    );
}