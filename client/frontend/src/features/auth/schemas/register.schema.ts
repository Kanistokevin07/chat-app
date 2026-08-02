import { z } from "zod";

export const registerSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username is too long"),

    email: z
        .email("Invalid email address")
        .trim(),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
        .string()
}).refine(
    data => data.password === data.confirmPassword,
    {
        path: ["confirmPassword"],
        message: "Passwords do not match"
    }
);

export type RegisterFormData =
    z.infer<typeof registerSchema>;