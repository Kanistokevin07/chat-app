import { Request, Response, NextFunction } from "express";
import { AppError } from "@/common/errors/app-error.js";
import { logger } from "@/config/logger.js";


export function errorMiddleware(
    err:Error,
    req:Request,
    res:Response,
    next:NextFunction
){

    logger.error(err);


    if(err instanceof AppError){

        return res.status(err.statusCode)
        .json({

            success:false,

            error:{
                code:err.code,
                message:err.message
            }

        });

    }


    return res.status(500)
    .json({

        success:false,

        error:{
            code:"INTERNAL_SERVER_ERROR",
            message:"Something went wrong"
        }

    });

}