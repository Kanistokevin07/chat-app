import { create } from "zustand";
import type { User } from "@/features/auth/types";

interface AuthState {
    user: User | null;
    accessToken: string | null;

    isAuthenticated: boolean;
    isLoading: boolean;

    setUser: (user: User | null) => void;
    setAccessToken: (token: string | null) => void;

    login: (user: User, token: string) => void;

    logout: () => void;

    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,

    isAuthenticated: false,
    isLoading: false,

    setUser: (user) =>
        set({
            user
        }),

    setAccessToken: (token) =>
        set({
            accessToken: token
        }),

    login: (user, token) =>
        set({
            user,
            accessToken: token,
            isAuthenticated: true
        }),

    logout: () =>
        set({
            user: null,
            accessToken: null,
            isAuthenticated: false
        }),

    setLoading: (loading) =>
        set({
            isLoading: loading
        })

}));