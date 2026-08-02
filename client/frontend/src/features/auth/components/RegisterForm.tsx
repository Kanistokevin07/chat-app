import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    registerSchema,
    type RegisterFormData
} from "../schemas/register.schema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRegister } from "../hooks/useRegister";
import { useNavigate } from "react-router-dom";


export default function RegisterForm(){

    const navigate = useNavigate();
    const registerMutation = useRegister();

    const {
        register,
        handleSubmit,
        formState:{
            errors
        }
    } = useForm<RegisterFormData>({
        resolver:zodResolver(registerSchema)
    });

    function onSubmit(data:RegisterFormData){

        const {
            confirmPassword,
            ...payload
        } = data;

        registerMutation.mutate(
            payload,
            {
                onSuccess:()=>{
                    navigate("/login");
                }
            }
        );

    }

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <Input
                placeholder="Username"
                {...register("username")}
            />

            {
                errors.username &&
                <p className="text-red-500 text-sm">
                    {errors.username.message}
                </p>
            }


            <Input
                placeholder="Email"
                {...register("email")}
            />

            {
                errors.email &&
                <p className="text-red-500 text-sm">
                    {errors.email.message}
                </p>
            }


            <Input
                type="password"
                placeholder="Password"
                {...register("password")}
            />

            {
                errors.password &&
                <p className="text-red-500 text-sm">
                    {errors.password.message}
                </p>
            }


            <Input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
            />

            {
                errors.confirmPassword &&
                <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                </p>
            }


            {
                registerMutation.error &&
                <p className="text-red-500 text-sm">
                    Registration failed
                </p>
            }


            <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full"
            >

                {
                    registerMutation.isPending
                    ?
                    "Creating..."
                    :
                    "Register"
                }

            </Button>


        </form>
    );
}