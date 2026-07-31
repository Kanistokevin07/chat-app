import api from "@/lib/axios";
import type { User, LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from "../types";

export async function login(data: LoginRequest){
    const response = await api.post<ApiResponse<AuthResponse>>(
        "/auth/login",
        data
    );

    return response.data.data;
}

export async function register(data: RegisterRequest){
    const response = await api.post<ApiResponse<User>>(
        "/auth/register",
        data
    );

    return response.data.data;
}

export async function logout(){
    await api.post("/auth/logout");
}

export async function refreshSession(){
    const response = await api.post<ApiResponse<String>>(
        "/auth/refresh"
    );

    return response.data.data;
}

export async function getMe() {
    const response = await api.get<ApiResponse<User>>("/auth/me");

    return response.data.data;
}