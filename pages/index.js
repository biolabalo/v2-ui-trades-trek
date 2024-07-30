import React from "react";
import { ArrowLeft } from "lucide-react";
import axiosInstance from "../axios";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Link from 'next/link';

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/auth/login", data);
      console.log(response, '> >>')
      toast.success("Login successful");
      // Handle successful login (e.g., store token, redirect)
      router.push('/dashboard');
    } catch (error) {
      console.error("Error:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button className="mr-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Login</h1>
        </div>

        <p className="mb-6">
          Please enter your email and password to login
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email Address is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              placeholder="youremail@example.com"
              className="w-full p-2 bg-gray-800 rounded"
            />
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Enter Password"
              className="w-full p-2 bg-gray-800 rounded"
            />
            {errors.password && <p className="text-red-600">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded mb-4"
          >
            Login
          </button>
        </form>

        <p className="text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-purple-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;