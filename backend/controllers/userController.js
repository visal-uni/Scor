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

        if(!username || !displayname || !email || !password)
            return res.status(400).json({message: "[Auth] All fields are required"});

        const existingUser = await User.findOne({ $or: [{email}, {username}]});

        if(existingUser)
            return res.status(409).json({message: "[Auth] Email or username already taken"});

        const hashPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            username: username,
            displayname: displayname,
            email: email,
            password: hashPassword
        });

        res.status(201).json({
            message: "Sing up successful",
            userId: user._id,
            displayname: user.displayname,
            email: user.email
        });
    }
    catch(err){
        res.status(500).json({message: "[Auth] Failed register"});
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "[Auth] Email and password is required" });

        const user = await User.findOne({ email });

        if (!user)
            return res.status(404).json({ message: "[Auth] User not found" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return res.status(401).json({ message: "Wrong password" });

        res.json({
            message: "Login successful",
            userId: user._id
        });
    } catch (err) {
        res.status(500).json({ message: "[Auth] Failed login" });
    }
};