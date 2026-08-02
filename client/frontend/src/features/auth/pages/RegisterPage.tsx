import { Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-white">Create Account</h1>
        <p className="mb-6 text-sm text-zinc-400">
          Register to start chatting.
        </p>

        <RegisterForm />

        <p className="mt-6 text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-500 hover:underline"
          >
            Login
          </Link>
        </p>

        <LoginForm />
      </div>
    </div>
  );
}