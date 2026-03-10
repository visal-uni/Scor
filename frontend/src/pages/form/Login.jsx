import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login(){
    const navigate = useNavigate();

    const {
        login,
        loginStatus: {isPending, isSuccess, error, reset},
    } = useAuth();

    const [dataForm, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        reset();
        setFormData((prev) => ({...prev, [e.target.name]: e.target.value})); 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await login({
                email: dataForm.email,
                password: dataForm.password
            });

            setFormData({
                email: "",
                password: ""
            });
        }
        catch(err){
            console.error(err?.respones?.data?.message ?? error);
        }
    }

    useEffect(() => {
        if(isSuccess) return navigate("/home", {replace: false});
    });


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
                        className="p-2 mt-1.5 rounded-lg outline-0 border border-gray-200 focus:border focus:border-gray-700"
                        type="email" 
                        name="email" 
                        placeholder="Email"
                        autoComplete="new-email"
                        onChange={handleChange}
                        disabled={isPending}
                        required 
                    />
                </div>
                <div 
                    className="flex flex-col"
                >
                    <label htmlFor="password" className="mt-6">Password</label>
                    <input
                        className="p-2 mt-1.5 rounded-lg outline-0 border border-gray-200 focus:border focus:border-gray-700" 
                        type="password" 
                        name="password" 
                        placeholder="Password"
                        autoComplete="off"
                        onChange={handleChange}
                        disabled={isPending}
                        required
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="mt-12 ring bg-black text-white w-full text-center p-3 rounded-lg cursor-pointer"
                    >
                        {isPending ? "Loading..." : "Login"}
                    </button>
                </div>
                <div className="mt-6">
                    <Link to="/sign-up" className="text-sm"> <span className="text-gray-500">Need an account?</span> <span className="underline">Register</span></Link>
                </div>
            </form>
        </div>
    )
}