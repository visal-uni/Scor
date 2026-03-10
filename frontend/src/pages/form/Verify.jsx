import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

export default function Verify(){
    const navigate = useNavigate();
    const location = useLocation();
    const {email} = location.state || {};

    const {
        verify,
        verifyStatus: {isPending, isSuccess, error, reset},
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
            setOtp(new Array(6).fill(""));
        }
        catch(err){
            console.error(err?.response?.message?.data ?? error);
        }
    };

    useEffect(() => {
        if(isSuccess) return navigate("/home", {replace: false});
    }, [isSuccess, navigate]);


    return(
        <div
            className="flex min-h-screen items-center justify-center"
        >
            <form
                className="w-md border border-gray-300 p-10 rounded-lg shadow shadow-gray-200"
            >
                <div>
                    <h1 className="text-2xl font-semibold text-center" >Check your email</h1>
                    <p className="text-sm text-center mt-2.5 text-gray-500">Enter the code sent to your email</p>
                </div>
                {otp.map((data, index) => (
                    <input
                        className="rounded-lg text-center outline outline-gray-300 h-15 w-11 text-2xl m-2 mt-7 mb-5 focus:outline-gray-400 focus:outline-2"
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
                        disabled={isPending}
                    />
                ))}
                <div>
                    <p className="text-sm text-center mt-2.5 text-gray-500">Can't find the email? Check your spam folder</p>
                </div>
            </form>
        </div>
    );
}