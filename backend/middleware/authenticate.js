import { ACCESS_COOKIE } from "../utils/cookie.js"
import { verifyAccessToken } from "../utils/token.js";

export const authenticate = async (req, res, next) => {
    const token = req.cookies?.[ACCESS_COOKIE];
    if(!token)
        return res.status(401).json({message: "No access token"});

    try{
        const payload = verifyAccessToken(token);
        req.userId = payload.sub;
        next();
    }
    catch(err){
        if(err.name = "TokenExpiredError"){
            return res.status(401).json({message: "Access token expired."});
        }
        return res.status(401).json({message: "Invalid access token"});
    }
}