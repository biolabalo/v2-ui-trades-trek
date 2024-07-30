import React, { useState } from "react";
import { ArrowLeft, Loader } from "lucide-react";
import axiosInstance from "../axios";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Link from 'next/link';

const OTPVerificationForm = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);

    if (value.length === 6) {
      handleSubmit(value);
    }
  };

  const handleSubmit = async (value) => {
    setIsLoading(true);
    try {
      const email = localStorage.getItem('signup_email_verification');
      const response = await axiosInstance.post("/auth/verify-otp", { email, otp: value });
      toast.success(response?.data?.data?.message || "OTP verified successfully");
      router.push('/dashboard'); // Adjust this route as needed
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button className="mr-4" onClick={() => router.back()} disabled={isLoading}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Verify OTP</h1>
        </div>

        <p className="mb-6">
          Please enter the 6-digit OTP sent to your email
        </p>

        <div className="mb-6">
          <label htmlFor="otp" className="block mb-2">
            OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleChange}
            placeholder="Enter 6-digit OTP"
            className="w-full p-2 bg-gray-800 rounded text-center text-2xl tracking-widest"
            disabled={isLoading}
            maxLength={6}
          />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center mb-4">
            <Loader className="animate-spin mr-2" size={20} />
            <span>Verifying...</span>
          </div>
        )}

        <p className="text-center mt-4">
          Did not receive the OTP?{" "}
          <Link href="#" className="text-purple-400" onClick={(e) => {
            e.preventDefault();
            // Add logic to resend OTP
            toast.info("OTP resent to your email");
          }}>
            Resend OTP
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OTPVerificationForm;