import { prisma } from "@/lib/prisma.js";
import { redis } from "@/lib/redis.js";

import {
    hashRefreshToken,
    generateRefreshToken
} from "../utils/token.service.js";

import { generateAccessToken } from "./jwt.service.js";
import { AppError } from "@/common/errors/app-error.js";


export async function refreshSession(
    refreshToken: string
) {

    const tokenHash = hashRefreshToken(refreshToken);


    const storedToken =
        await prisma.refreshToken.findUnique({
            where:{
                tokenHash
            },
            include:{
                user:true
            }
        });


    if(!storedToken){
        throw new AppError(
            "Invalid refresh token",
            401,
            "INVALID_REFRESH_TOKEN"
        );
    }


    if(
        storedToken.revokedAt ||
        storedToken.expiresAt < new Date()
    ){

        throw new AppError(
            "Refresh token expired",
            401,
            "REFRESH_TOKEN_EXPIRED"
        );
    }


    const redisSession =
        await redis.get(
            `session:${tokenHash}`
        );


    if(!redisSession){

        throw new AppError(
            "Session expired",
            401,
            "SESSION_EXPIRED"
        );
    }


    /*
        Generate new access token
    */

    const accessToken =
        generateAccessToken(
            storedToken.userId
        );


    /*
        Rotate refresh token
    */

    const newRefreshToken = generateRefreshToken();


    const newTokenHash = hashRefreshToken(newRefreshToken);


    await prisma.refreshToken.update({
        where:{
            id:storedToken.id
        },
        data:{
            tokenHash:newTokenHash
        }
    });


    await redis.del(
        `session:${tokenHash}`
    );


    await redis.set(
        `session:${newTokenHash}`,
        JSON.stringify({
            userId:storedToken.userId,
            deviceId:storedToken.deviceId
        }),
        "EX",
        60 * 60 * 24 * 30
    );


    return {
        accessToken,
        refreshToken:newRefreshToken
    };
}