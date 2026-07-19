import { NextFunction, Request, Response } from "express";
import { register } from "./auth.service.js";
import { login } from "./auth.service.js";
import { refreshCookieOptions } from "@/config/cookies.js";
import { refreshSession } from "./services/refresh.service.js";
import { logoutSession } from "./services/logout.service.js";


export async function registerController(
    req:Request,
    res:Response
){

    const user = await register(req.body);

    res.status(201).json({
        success:true,
        data:user
    });
}

export async function loginController(
    req: Request,
    res: Response
) {

    const result = await login(req.body);
    res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

    res.status(200).json({
        success: true,
        data: {
            user: result.user,
            accessToken: result.accessToken
        }
    });
}

export async function refreshController(
    req: Request,
    res: Response,
    next: NextFunction
){

    try{
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({
                success:false,
                message:"No refresh token"
            });
        }

        const result =
            await refreshSession(
                refreshToken
            );

        res.cookie(
            "refreshToken",
            result.refreshToken,
            refreshCookieOptions
        );

        res.status(200).json({
            success:true,
            data:{
                accessToken: result.accessToken
            }
        });

    }catch(error){
        next(error);
    }
}

export async function logoutController(
    req: Request,
    res: Response
){

    const refreshToken = req.cookies.refreshToken;

    if(refreshToken){
        await logoutSession(
            refreshToken
        );
    }

    res.clearCookie(
        "refreshToken",
        refreshCookieOptions
    );

    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    });
}