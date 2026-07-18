import { Request, Response } from "express";

export function healthCheck(
    req: Request,
    res: Response
){

    res.status(200).json({
        success:true,
        data:{
            status:"healthy",
            timestamp:new Date()
        }
    });

}