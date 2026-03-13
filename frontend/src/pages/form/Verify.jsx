import { useState, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

export default function Verify(){
    const navigate = useNavigate();
    const location = useLocation();
    const {
        email,
        username,
        displayname,
        password,
    } = location.state || {};

    const {
        verify,
        verifyStatus: {isPending, error, reset},
        register,
        registerStatus: { isPending: isRegisterPending },
    } = useAuth();

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRef = useRef([]);

    const combinedCode = (newOtp) => {
        const code = newOtp.join("");
        if(code.length === 6){
            handleSubmit(code);
        }
    };

    const handleChange = (e, index) => {
        if(isNaN(e.target.value)) return false;
        
        reset();
        
        const newOtp = [...otp];
        newOtp[index] = e.target.value;
        setOtp(newOtp);
        
        if(e.target.value !== "" && index < 5){
            inputRef.current[index + 1].focus();
        }

        combinedCode(newOtp);
    };

    const handlePaste = (e) => {
        const data = e.clipboardData.getData("text").slice(0, 6).split("");
        if(data.length === 6){
            setOtp(data);
            inputRef.current[5].focus();
        }
        combinedCode(data);
    };

    const handleKeyDown = (e, index) => {
        if(e.key === "Backspace" && !otp[index] && index > 0){
            inputRef.current[index - 1].focus();
        }
    };

    const handleSubmit = async (code) => {
        try{
            await verify({
                email: email,
                code: code
            });
            
            // After code is verified, create the account and log the user in
            await register({
                username: username?.trim(),
                displayname: displayname?.trim(),
                email: email?.trim(),
                password,
            });

            setOtp(new Array(6).fill(""));

            // On successful register, they should be authenticated
            return navigate("/home", { replace: false });
        }
        catch(err){
            console.error(err?.response?.message?.data ?? error);
        }
    };


    return(
        <div
            className="flex min-h-screen items-center justify-center px-4 sm:px-6"
        >
            <form
                className="w-full max-w-md border border-gray-300 px-6 py-8 sm:px-8 sm:py-10 rounded-lg shadow shadow-gray-200 bg-white"
            >
                <div>
                    <h1 className="text-2xl font-semibold text-center" >Check your email</h1>
                    <p className="text-sm text-center mt-2.5 text-gray-500">Enter the code sent to your email</p>
                </div>
                <div className="flex flex-wrap justify-center mt-6 mb-4">
                    {otp.map((data, index) => (
                        <input
                            className="rounded-lg text-center outline outline-gray-300 h-12 w-10 text-2xl m-1 sm:m-2 focus:outline-gray-400 focus:outline-2"
                            key={index}
                            type="text"
                            maxLength="1"
                            name={`otp${index}`}
                            value={data}
                            ref={(el) => (inputRef.current[index] = el)}
                            onChange={(e) => handleChange(e, index)}
                            onPaste={handlePaste}
                            onKeyDown={(e) => handleKeyDown(e, index)} 
                            autoComplete="one-time-code"
                            disabled={isPending || isRegisterPending}
                        />
                    ))}
                </div>
                <div>
                    <p className="text-sm text-center mt-2.5 text-gray-500">Can't find the email? Check your spam folder</p>
                </div>
            </form>
        </div>
    );
}