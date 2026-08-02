import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-white">Welcome Back</h1>
        <p className="mb-6 text-sm text-zinc-400">
          Sign in to continue chatting.
        </p>

        <LoginForm />

        <p className="mt-6 text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-500 hover:underline"
          >
            Register
          </Link>
        </p>

        <RegisterForm />
      </div>
    </div>
  );
}