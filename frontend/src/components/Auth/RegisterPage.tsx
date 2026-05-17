import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../stores/auth";
import { errorHandler, successHandler } from "../../helpers/responseHandler";
import Alert from "../Mini/Alert";

const registerSchema = z.object({
  name: z.string().optional(),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterInput) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name || undefined,
        email: values.email,
        password: values.password,
      };
      const res = await axios.post("/api/auth/register", payload);
      setSession(res.data.data);
      successHandler(res.data.message);
      navigate("/");
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
        <h2 className="font-bold text-2xl mb-4">Create account</h2>

        <label className="block mb-2 text-sm font-semibold">
          Name (optional)
        </label>
        <input
          type="text"
          autoComplete="name"
          {...register("name")}
          className="w-full border rounded-md py-1.5 px-2 mb-3 outline-1 outline-gray-300 focus:outline-indigo-600"
        />

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

        <label className="block mb-2 mt-2 text-sm font-semibold">
          Password
        </label>
        <input
          type="password"
          autoComplete="new-password"
          {...register("password")}
          className="w-full border rounded-md py-1.5 px-2 mb-1 outline-1 outline-gray-300 focus:outline-indigo-600"
        />
        {errors.password && (
          <p className="text-red-600 text-xs mb-2">{errors.password.message}</p>
        )}
        <p className="text-xs text-gray-500 mb-3">At least 8 characters.</p>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 rounded-xl disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="text-sm text-gray-500 mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-700 hover:underline">
            Sign in
          </Link>
        </p>
      </form>

      <style>{`
        .auth-wrapper { max-width: 420px; margin: 4rem auto; padding: 0 1rem; }
      `}</style>
    </div>
  );
}
