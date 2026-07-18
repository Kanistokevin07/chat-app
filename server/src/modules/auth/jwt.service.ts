import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "@/config/env.js";

export function generateAccessToken(userId: string) {
    const options: SignOptions = {
        expiresIn: "15m"
    };

    return jwt.sign(
        { userId },
        env.JWT_SECRET,
        options
    );
}