import {api} from "@/lib/axios";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types";

export async function login(data: LoginRequest){
    const response = await api.post<AuthResponse>(
        "/auth/login",
        data
    );

    return response.data;
}

export async function register(data: RegisterRequest){
    const response = await api.post(
        "/auth/register",
        data
    );

    return response.data
}

export async function logout(){
    await api.post("/auth/logout");
}

export async function refreshSession(){
    const response = await api.post<AuthResponse>(
        "/auth/refresh"
    );

    return response.data;
}