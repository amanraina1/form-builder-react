import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../stores/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Alert from "../Mini/Alert";
import { errorHandler, successHandler } from "../../helpers/responseHandler";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginInput) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", values);
      setSession(res.data.data);
      successHandler(res.data.message);
      const redirect = searchParams.get("redirect") || "/";
      navigate(redirect);
    } catch (e) {
      errorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <Alert />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="auth-card bg-white p-6 rounded-xl shadow"
      >
        <h2 className="font-bold text-2xl mb-4">Sign in</h2>

        <label className="block mb-2 text-sm font-semibold">Email</label>
        <input
          type="email"
          autoComplete="email"
          {...register("email")}
          className="w-full border rounded-md py-1.5 px-2 mb-1 outline-1 outline-gray-300 focus:outline-indigo-600"
        />
        {errors.email && (
          <p className="text-red-600 text-xs mb-2">{errors.email.message}</p>
        )}

        <label className="block mb-2 text-sm font-semibold mt-2">
          Password
        </label>
        <input
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className="w-full border rounded-md py-1.5 px-2 mb-1 outline-1 outline-gray-300 focus:outline-indigo-600"
        />
        {errors.password && (
          <p className="text-red-600 text-xs mb-2">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 rounded-xl disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-sm text-gray-500 mt-3">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-700 hover:underline">
            Create one
          </Link>
        </p>
      </form>

      <style>{`
        .auth-wrapper { max-width: 420px; margin: 4rem auto; padding: 0 1rem; }
      `}</style>
    </div>
  );
}
