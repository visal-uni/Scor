import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Signup(){
    const navigate = useNavigate();
    const {
        register,
        registerStatus: {isPending, isSuccess, error, reset},
    } = useAuth();

    const [form, setForm] = useState({
        username: "",
        displayname: "",
        email: "",
        password: "",
    });

    // const [localError, setLocalError] = useState(null);
    // const [formRequired, setFormRequired] = useState()

    const handleChange = (e) => {
        // setLocalError(null);
        reset(); 
        setForm((prev) => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await register({
                username: form.username.trim(),
                displayname: form.displayname.trim(),
                email: form.email.trim(),
                password: form.password,
            });
            setForm({
                username: "",
                displayname: "",
                email: "",
                password: "",
            });
        }
        catch(err){
            console.error(err?.respones?.data?.message ?? error);
        }
    }

    if(isSuccess){
        return navigate("/verify", {state: form}); 
    }

    return(
        <div
            className="flex items-center justify-center min-h-screen text-base"
        >
            <form
                onSubmit={handleSubmit}
                className="w-md border border-gray-300 p-10 rounded-lg shadow shadow-gray-200" 
            >
                <div>
                    <h1 className="text-2xl font-semibold text-center">Create an Account</h1>
                </div>
                <div 
                    className="flex flex-col"
                >
                    <label htmlFor="username" className="mt-6   ">Username</label>
                    <input
                        className="p-2 mt-1.5 ring ring-gray-300 rounded-lg shadow shadow-gray-200 outline-none focus:ring-gray-500"
                        type="text" 
                        name="username" 
                        id="username"
                        value={form.username}
                        placeholder="Uername"
                        onChange={handleChange}
                        disabled={isPending}
                        autoComplete="new-name"
                        required
                    />
                </div>
                <div
                    className="flex flex-col"
                >
                    <label htmlFor="displayname" className="mt-6">Display Name</label>
                    <input 
                        className="p-2 mt-1.5 ring ring-gray-300 rounded-lg shadow shadow-gray-200 outline-none focus:ring-gray-500"
                        type="text" 
                        name="displayname" 
                        id="displayname"
                        value={form.displayname}
                        placeholder="Displayname"
                        onChange={handleChange}
                        disabled={isPending}
                        autoComplete="new-name"
                        required
                    />
                </div>
                <div
                    className="flex flex-col"
                >
                    <label htmlFor="email" className="mt-6">Email</label>
                    <input 
                        className="p-2 mt-1.5 ring ring-gray-300 rounded-lg shadow shadow-gray-200 outline-none focus:ring-gray-500"
                        type="email" 
                        name="email" 
                        id="email"
                        value={form.email}
                        placeholder="Email"
                        onChange={handleChange}
                        disabled={isPending}
                        autoComplete="new-email"
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
                        id="password"
                        value={form.password}
                        placeholder="Password"
                        onChange={handleChange}
                        disabled={isPending}
                        autoComplete="off"
                        required
                    />
                </div>
                <div>
                    <button 
                        type="submit"
                        disabled={isPending}
                        className="mt-12 ring bg-black text-white w-full text-center p-3 rounded-lg cursor-pointer"
                    >
                        {isPending ? "Loading..." : "Create Account"}
                    </button>
                </div>
                <div className="mt-6">
                    <Link to="/login" className="text-sm"><span className="text-gray-500">Already have an account?</span> <span className="underline">Login</span></Link>
                </div>
            </form>
        </div>
    )    
}