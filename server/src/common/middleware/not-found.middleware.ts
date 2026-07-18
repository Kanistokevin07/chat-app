import { Request, Response } from "express";


export function notFoundMiddleware(
    req:Request,
    res:Response
){

    res.status(404)
    .json({

        success:false,

        error:{
            code:"NOT_FOUND",
            message:"Route does not exist"
        }

    });

}