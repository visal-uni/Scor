import { useState } from "react"
import { Link } from "react-router-dom";

export default function Login(){
    const [dataForm, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
       setFormData((prev) => ({...prev, [e.target.name]: e.target.value})); 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

    }

    return(
        <div
            className="flex min-h-screen items-center justify-center text-base"
        >
            <form
                onSubmit={handleSubmit}
                className="w-md border border-gray-300 p-10 rounded-lg shadow shadow-gray-200"
            >
                <div>
                    <h1 className="text-2xl font-semibold text-center">Welcome back!</h1>
                    <p className="text-sm text-center mt-2.5 text-gray-500">We are so excited to see you again!</p>
                </div>
                <div
                    className="flex flex-col"
                >
                    <label htmlFor="email" className="mt-6">Email</label>
                    <input 
                        className="p-2 mt-1.5 ring ring-gray-300 rounded-lg shadow shadow-gray-200 outline-none focus:ring-gray-500"
                        type="email" 
                        name="email" 
                        placeholder="Email"
                        autoComplete="new-email"
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div
                    className="flex flex-col"
                >
                    <label htmlFor="password" className="mt-6">Password</label>
                    <input
                        className="p-2 mt-1.5 ring ring-gray-300 rounded-lg shadow shadow-gray-200 outline-none focus:ring-gray-500" 
                        type="password" 
                        name="password" 
                        placeholder="Password"
                        autoComplete="off"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="mt-12 ring bg-black text-white w-full text-center p-3 rounded-lg cursor-pointer"
                    >
                        Login
                    </button>
                </div>
                <div className="mt-6">
                    <Link to="/sign-up" className="text-sm"> <span className="text-gray-500">Need an account?</span> <span className="underline">Register</span></Link>
                </div>
            </form>
        </div>
    )
}