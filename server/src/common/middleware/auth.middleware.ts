import {Request, Response, NextFunction} from "express";
import {verifyAccessToken} from "@/modules/auth/services/jwt.service.js";


export interface AuthRequest extends Request{
    user?:{
        id:string;
    };
}

export function authMiddleware(
    req:AuthRequest,
    res:Response,
    next:NextFunction
){

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            success:false,
            message:"Missing token"
        });
    }

    const token = authHeader.split(" ")[1];

    try{
        const payload = verifyAccessToken(token);

        req.user = {
            id:(payload as any).sub
        };

        next();

    }catch(error){

        return res.status(401).json({
            success:false,
            message:"Invalid token"
        });

    }
}