import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Verify(){

    const navigate = useNavigate();
    
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inpuRef = useRef([]);
    const {user, verify} = useAuth();

    const handleChange = (element, index) => {
        if(isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if(element.value !== "" && index < 5){
            inpuRef.current[index + 1].focus();
        }

        const fullCode = newOtp.join("");

        if(fullCode.length === 6){
            verifyApi(fullCode);
        }
    }

    const verifyApi = async (code) => {
        try{
            await verify({email: user.email, code: code});
            navigate("/home");
        }
        catch(err){
            console.error(err.response?.data);
        }
    }

    const handlePaste = (e) => {
        const data = e.clipboardData.getData("text").slice(0, 6).split("");
        if(data.length ===  6){
            setOtp(data);
            inpuRef.current[5].focus(); 
        }
    }

    const handleKeyDown = (e, index) => {
        if(e.key === "Backspace" && !otp[index] && index > 0){
            inpuRef.current[index - 1].focus();
        }
    }
    
    return(
        <>
            {otp.map((data, index) => (
                <input
                    key={index}
                    type="number"
                    name="number" 
                    id="number"
                    maxLength="1"
                    value={data}
                    ref={(el) => (inpuRef.current[index] = el)}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                />
            ))}
        </>
    );
}