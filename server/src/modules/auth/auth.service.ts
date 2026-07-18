import bcrypt from "bcrypt";
import {prisma} from "@/lib/prisma.js";
import {RegisterInput} from "./auth.schema.js";
import { AppError } from "@/common/errors/app-error.js";

import { LoginInput } from "./auth.schema.js";
import { generateAccessToken } from "./jwt.service.js";

import { createSession } from "./session.service.js";

export async function register(
    data:RegisterInput
){
    const existingUser =
    await prisma.user.findUnique({
        where:{
            email:data.email
        }
    });

    if(existingUser){
        throw new AppError(
            "Email already exists",
            409,
            "EMAIL_EXISTS"
        );
    }

    const passwordHash =
    await bcrypt.hash(
        data.password,
        10
    );

    const user =
    await prisma.user.create({

        data:{
            username:data.username,
            email:data.email,
            passwordHash
        },

        select:{
            id:true,
            username:true,
            email:true,
            createdAt:true
        }

    });

    return user;
}

export async function login(data: LoginInput) {

    const user = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    });

    if (!user) {
        throw new AppError(
            "Invalid credentials",
            401,
            "INVALID_CREDENTIALS"
        );
    }


    const passwordMatch = await bcrypt.compare(
        data.password,
        user.passwordHash
    );


    if (!passwordMatch) {
        throw new AppError(
            "Invalid credentials",
            401,
            "INVALID_CREDENTIALS"
        );
    }


    const token = generateAccessToken(user.id);
    const refreshToken = await createSession(user.id);


    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        },
        token,
        refreshToken
    };
}