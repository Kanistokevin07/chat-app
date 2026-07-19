import { prisma } from "@/lib/prisma.js";
import { redis } from "@/lib/redis.js";
import { hashRefreshToken } from "../utils/token.service.js";

export async function logoutSession(
    refreshToken: string
){

    const tokenHash = hashRefreshToken(refreshToken);

    await prisma.refreshToken.deleteMany({
        where:{
            tokenHash
        }
    });

    await redis.del(
        `session:${tokenHash}`
    );
}