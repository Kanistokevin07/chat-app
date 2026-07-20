import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "@/config/env.js";

export function generateAccessToken(userId: string) {
    const options: SignOptions = {
        expiresIn: "15m"
    };

    return jwt.sign(
        { sub:userId },
        env.JWT_SECRET,
        options
    );
}

export function verifyAccessToken(
    token:string
){
    return jwt.verify(
        token,
        env.JWT_SECRET
    );
}