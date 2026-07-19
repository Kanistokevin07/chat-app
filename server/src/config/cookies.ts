import { CookieOptions } from "express";

export const refreshCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/refresh",
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
};