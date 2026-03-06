import User from "../models/User.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
    try{
        const {
            username,
            displayname,
            email,
            password
        } = req.body;

        if(!username && !displayname && !email && !password)
            return res.json({message: "[Auth] Form required"});

        const hashPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            username: username,
            displayname: displayname,
            email: email,
            password: hashPassword
        });

        res.json({
            userId: user._id,
            displayname: user.displayname,
            email: user.email
        })

        res.json({message: "Register successful"});
    }
    catch(err){
        res.json({message: "[Auth] Failed register"});
    }
}