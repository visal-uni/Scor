import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Signup(){
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        displayname: "",
        email: "",
        password: "",
    });

    const refs = useRef({
        username: null,
        displayname: null,
        email: null,
        password: null,
    });

    const validateForm = () => {

        let isValid = true;

        const setError = (key) => {
            refs.current[key].style.border = "1px solid #ff4d4d";
            refs.current[key].style.backgroundColor = "#fff5f5";
            isValid = false;
        }

        if(form.username.trim().length < 5){
            setError("username");
        }

        if(form.displayname.trim().length < 2){
            setError("displayname");
        }

        const emailPattern = /^[^\s@]+@gmail\.com$/;
        if(!emailPattern.test(form.email)){
            setError("email");
        }

        if(form.password.length < 6){
            setError("password");
        }

        return isValid;
    }
    
    const {
        request,
        requestStatus: {isPending, isSuccess, error, reset},
    } = useAuth();


    const handleChange = (e) => {
        reset(); 
        setForm((prev) => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validateForm()) return;

        try{
            await request({email: form.email.trim()});
        }
        catch(err){
            console.error(err?.respones?.data?.message ?? error);
        }
    }

    useEffect(() => {
        if(isSuccess){
            return navigate("/verify", {state: form, replace: false}); 
        } 
    }, [isSuccess, navigate, form]);

    return(
        <div
            className="flex items-center justify-center min-h-screen text-base px-4 sm:px-6"
        >
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md px-6 py-8 sm:px-8 sm:py-10 rounded-lg border border-gray-200 shadow shadow-gray-300 bg-white" 
            >
                <div>
                    <h1 className="text-2xl font-semibold text-center">Create an Account</h1>
                </div>
                <div 
                    className="flex flex-col"
                >
                    <label htmlFor="username" className="mt-6   ">Username</label>
                    <input
                        ref={(el) => (refs.current.username = el)}
                        className="p-2 mt-1.5 rounded-lg outline-0 border border-gray-200 focus:border focus:border-gray-700"
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
                        ref={(el) => (refs.current.displayname = el)}
                        className="p-2 mt-1.5 rounded-lg outline-0 border border-gray-200 focus:border focus:border-gray-700"
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
                        ref={(el) => (refs.current.email = el)}
                        className="p-2 mt-1.5 rounded-lg outline-0 border border-gray-200 focus:border focus:border-gray-700"
                        type="email" 
                        name="email" 
                        id="email"
                        value={form.email}
                        placeholder="Email"
                        onChange={handleChange}
                        disabled={isPending}
                        autoComplete="new-email"
                    />
                </div>
                <div
                    className="flex flex-col"
                >
                    <label htmlFor="password" className="mt-6">Password</label>
                    <input
                        ref={(el) => refs.current.password = el}
                        className="p-2 mt-1.5 rounded-lg outline-0 border border-gray-200 focus:border focus:border-gray-700"
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
                        {isPending ? "Sending Code..." : "Create Account"}
                    </button>
                </div>
                <div className="mt-6">
                    <Link to="/login" className="text-sm"><span className="text-gray-500">Already have an account?</span> <span className="underline">Login</span></Link>
                </div>
            </form>
        </div>
    )    
}