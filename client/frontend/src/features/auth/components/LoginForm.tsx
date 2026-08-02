import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginFormData } from "../schemas/login.schema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useLogin } from "../hooks/useLogin";

import { useNavigate } from "react-router-dom";


export default function LoginForm(){

    const navigate = useNavigate();
    const loginMutation = useLogin();

    const {
        register,
        handleSubmit,
        formState:{
            errors
        }
    } = useForm<LoginFormData>({
        resolver:zodResolver(loginSchema)
    });


    function onSubmit(data:LoginFormData){
        loginMutation.mutate(
            data,
            {
                onSuccess:()=>{
                    navigate("/home");
                }
            }
        );
    }


    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <div>
                <Input
                    placeholder="Email"
                    {...register("email")}
                />
                {
                    errors.email &&
                    <p className="text-sm text-red-500">
                        {errors.email.message}
                    </p>
                }

            </div>

            <div>
                <Input
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                />
                {
                    errors.password &&
                    <p className="text-sm text-red-500">
                        {errors.password.message}
                    </p>
                }

            </div>

            {
                loginMutation.error &&
                <p className="text-sm text-red-500">
                    Login failed
                </p>
            }

            <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full"
            >

                {
                    loginMutation.isPending
                    ?
                    "Logging in..."
                    :
                    "Login"
                }

            </Button>

        </form>
    );
}