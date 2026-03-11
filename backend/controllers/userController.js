import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.js";
import { setAuthCookies, clearAuthCookies, REFRESH_COOKIE } from "../utils/cookie.js";
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

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = await bcrypt.hash(refreshToken, 12);
        await user.save();

        setAuthCookies(res, accessToken, refreshToken);

        res.status(200).json({
            user:{
                id: user._id,
                name: user.username,
                displayname: user.displayname,
                email: user.email
            }
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

        const user = await User.findOne({ email }).select("+password +refreshToken");

        if (!user)
            return res.status(404).json({ message: "[Auth] Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return res.status(401).json({ message: "Wrong password" });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = await bcrypt.hash(refreshToken, 12);
        await user.save();

        setAuthCookies(res, accessToken, refreshToken);

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                displayname: user.displayname,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: "[Auth] Failed login" });
    }
};

export const refreshToken = async (req, res) => {
    try{
        const token = req.cookies?.[REFRESH_COOKIE];

        if(!token)
            return res.status(401).json({message: "No access token"});

        let payload;

        try{
            payload = verifyRefreshToken(token);
        }
        catch{
            return res.status(401).json({message: "Invalid or expired refresh token."});
        }

        const user = await User.findById(payload.sub).select("+refreshToken");
        if(!user)
            return res.status(401).json({message: "User not found."});

        const tokenMatch = bcrypt.compare(token, user.refreshToken);
        if(!tokenMatch){
            clearAuthCookies(res);
            user.refreshToken = null;
            await user.save();
            return res.status(401).json({message: "Token reuse detected. Please log in again."});
        }

        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        user.refreshToken = await bcrypt.hash(newRefreshToken, 12);
        await user.save();

        setAuthCookies(res, newAccessToken, newRefreshToken);

        return res.status(200).json({ ok: true });
    }
    catch(err){
        res.status(500).json({message: "[Auth] Failed refresh token"});
    }
}

export const logout = async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];

    if(token){
        const user = await User.findById(req.userId).select("+refreshToken");
        if(user){
            user.refreshToken = null;
            await user.save();
        }
    }

    clearAuthCookies(res);
    return res.status(200).json({ ok: true });
}

export const me = async (req, res) => {
    try{
        const user = await User.findById(req.userId).select("-password -refreshToken");
        if(!user)
            return res.status(404).json({message: "User not found"});
        
        return res.status(200).json(user);
    }
    catch(err){
        res.status(500).json({message: "Failed get user"});
    }
}