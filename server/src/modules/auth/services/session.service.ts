import { prisma } from "@/lib/prisma.js";
import { redis } from "@/lib/redis.js";
import { generateRefreshToken, hashRefreshToken } from "../utils/token.service.js";


const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export async function createSession(
    userId: string,
    deviceId: string
): Promise<string> {

    const refreshToken = generateRefreshToken();
    const tokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date(
        Date.now() + SESSION_TTL_SECONDS * 1000
    );

    await prisma.refreshToken.create({
        data: {
            userId,
            deviceId,
            tokenHash,
            expiresAt
        }
    });

    await redis.set(
        `session:${tokenHash}`,
        JSON.stringify({
            userId,
            deviceId
        }),
        "EX",
        SESSION_TTL_SECONDS
    );

    return refreshToken;
}

export async function findSession(refreshToken: string) {

    const tokenHash = hashRefreshToken(refreshToken);

    return prisma.refreshToken.findUnique({
        where: {
            tokenHash
        },
        include: {
            user: true
        }
    });
}

export async function deleteSession(refreshToken: string) {

    const tokenHash = hashRefreshToken(refreshToken);

    await prisma.refreshToken.delete({
        where: {
            tokenHash
        }
    });

    await redis.del(
        `session:${tokenHash}`
    );
}