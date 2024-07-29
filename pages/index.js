import React from "react";
import { ArrowLeft } from "lucide-react";
import axiosInstance from "../axios";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router';

const CreateAccountForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      alert(response?.data?.data?.message)
      localStorage.setItem('email', data?.email)
      router.push('/otp')
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button className="mr-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Create Account</h1>
        </div>

        <p className="mb-6">
          Kindly provide the following details to get started
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block mb-2">
              First Name
            </label>
            <input
              id="firstName"
              {...register("first_name", { required: "First Name is required" })}
              placeholder="Enter first Name"
              className="w-full p-2 bg-gray-800 rounded"
            />

            {errors.first_name && <p  className="text-red-600">{errors.first_name.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="last_name" className="block mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              {...register("last_name", { required: "Last Name is required" })}
              placeholder="Enter Last Name"
              className="w-full p-2 bg-gray-800 rounded"
            />
            {errors.last_name && <p className="text-red-600">{errors.last_name.message}</p>}
          </div>

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

          <div className="mb-4">
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

          <div className="mb-6">
            <label htmlFor="referralCode" className="block mb-2">
              Referral Code (Optional)
            </label>
            <input
              type="text"
              id="referralCode"
              {...register("referralCode")}
              placeholder="Enter code here"
              className="w-full p-2 bg-gray-800 rounded"
            />
          </div>

          <p className="mb-4 text-sm">
            By clicking proceed, you agree to our{" "}
            <a href="#" className="text-emerald-400">
              terms of service
            </a>{" "}
            and{" "}
            <a href="#" className="text-emerald-400">
              privacy policy
            </a>
          </p>

          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded mb-4"
          >
            Proceed
          </button>
        </form>

        <p className="text-center">
          Are you an existing user?{" "}
          <a href="#" className="text-purple-400">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default CreateAccountForm;
