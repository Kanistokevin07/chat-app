import {Request,Response} from "express";
import {register} from "./auth.service.js";
import { login } from "./auth.service.js";
import { refreshCookieOptions } from "@/config/cookies.js";

export async function registerController(
    req:Request,
    res:Response
){

    const user =
    await register(req.body);

    res.status(201)
    .json({
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
            accesstoken: result.accesstoken
        }
    });
}