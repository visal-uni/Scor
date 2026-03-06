import { useState, useRef } from "react";

export default function Verify(){

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRef = useRef([]);

    const handleChange = (e, index) => {
        if(isNaN(e.target.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = e.target.value;
        setOtp(newOtp);
        
        if(e.target.value !== "" && index < 5){
            inputRef.current[index + 1].focus();
        }
    }

    const handlePaste = (e) => {
        const data = e.clipboardData.getData("text").slice(0, 6).split("");
        if(data.length === 6){
            setOtp(data);
            inputRef.current[5].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if(e.key === "Backspace" && !otp[index] && index > 0){
            inputRef.current[index - 1].focus();
        }
    }

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
                        autoComplete="new-off"
                    />
                ))}
                <div>
                    <p className="text-sm text-center mt-2.5 text-gray-500">Can't find the email? Check your spam folder</p>
                </div>
            </form>
        </div>
    );
}