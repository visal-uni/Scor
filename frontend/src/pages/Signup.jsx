import { useState } from "react";

export default function SignUp(){

    const [formData, setFormData] = useState({fullName: "", email: ""});

    const handleChange = (e) => {
        e.preventDefault();
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return(
        <div className="min-h-screen flex flex-col items-center justify-center text-gray-950 font-poppins">
            <span className="text-2xl font-semibold">Create an Account</span>
            <span className="text-base text-gray-500">Please enter your details to create an account.</span>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <label htmlFor="fullName">Full Name</label>
                <input 
                    type="text" 
                    name="fullName" 
                    id="fullName"
                    placeholder="Enter your full name"
                    autoComplete="family-name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="email">Email</label>
                <input
                    type="email" 
                    name="email" 
                    id="email"
                    placeholder="Enter your Email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Send email code</button>
            </form>
        </div> 
    );
}