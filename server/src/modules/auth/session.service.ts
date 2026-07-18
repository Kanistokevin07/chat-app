import crypto from "crypto";
import { prisma } from "@/lib/prisma.js";
import { redis } from "@/lib/redis.js";


export async function createSession(userId:string){

    const refreshToken = crypto.randomBytes(64).toString("hex");

    const tokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");


    const expiresAt = new Date();

    expiresAt.setDate(
        expiresAt.getDate() + 30
    );


    await prisma.refreshToken.create({
        data:{
            userId,
            tokenHash,
            expiresAt
        }
    });


    await redis.set(
        `session:${refreshToken}`,
        userId,
        "EX",
        60 * 60 * 24 * 30
    );


    return refreshToken;
}