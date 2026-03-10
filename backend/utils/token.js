import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateAccessToken = (userId) => {
    return jwt.sign({sub: userId}, process.env.JWT_SECRET_ACCESSTOKEN, {expiresIn: "15m"});
}

export const generateRefreshToken = (userId) => {
    return jwt.sign({sub: userId}, process.env.JWT_SECRET_REFRESHTOKEN, {expiresIn: "7d"});
}

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_ACCESSTOKEN);
}

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_REFRESHTOKEN);
}