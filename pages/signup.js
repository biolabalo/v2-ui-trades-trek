import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import axiosInstance from "../axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Link from "next/link";

const CreateAccountForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/signup", data);

      if(response?.data?.success){
        toast.success(response?.data?.data?.message);
        localStorage.setItem("signup_email_verification", data?.email);
        router.push("/otp");
      }
     
    } catch (error) {
      if (error?.response?.data?.errors) {
        toast.error(error?.response?.data?.errors);
      }
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
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
              {...register("first_name", {
                required: "First Name is required",
              })}
              placeholder="Enter first Name"
              className="w-full p-2 bg-gray-800 rounded"
            />

            {errors.first_name && (
              <p className="text-red-600">{errors.first_name.message}</p>
            )}
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
            {errors.last_name && (
              <p className="text-red-600">{errors.last_name.message}</p>
            )}
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

            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
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
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
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
            className="w-full bg-purple-500 text-white py-2 rounded mb-4 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </>
            ) : (
              "Proceed"
            )}
          </button>
        </form>

        <p className="text-center">
          Are you an existing user?{" "}
          <Link href="/" className="text-purple-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CreateAccountForm;
