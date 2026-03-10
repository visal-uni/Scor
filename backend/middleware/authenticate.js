import { verifyAccessToken } from "../utils/token";
import { ACCESS_COOKIE } from "../utils/cookie";

export const authenticate = (req, res, next) => {
    const token = req.token?.[ACCESS_COOKIE];

    if(!token){
        return res.status(401).json({message: "No access token."});
    }

    try{
        const playload = verifyAccessToken(token);
        req.userId = playload.sub;
        next();
    }
    catch(err){
        if(err.name = "TokenExpiredError"){
            return res.status(401).json({message: "Access token expired."});
        }
        return res.status(401).json({message: "Invalid access token."});
    }
}