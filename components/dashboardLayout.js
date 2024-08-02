import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";
import {
  Home,
  BarChart2,
  BookOpen,
  Wallet,
  Trophy,
} from "lucide-react";
import Link from "next/link";



const SidebarItem = ({ icon, text, active,to }) => (
    <Link
    href={to}
      className={`flex items-center p-2 rounded-lg mb-2 ${
        active ? "bg-purple-600" : "hover:bg-gray-700"
      }`}
    >
      {icon}
      <span className="ml-3">{text}</span>
    </Link>
  );

const DashboardLayout = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/auth/user");
        const data = response.data.data?.user;
        setUserData(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4">
        <div className="flex items-center mb-8">
          <img
            src="/api/placeholder/40/40"
            alt="User"
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="font-semibold">Hello {userData?.full_name}</span>
        </div>
        <nav>
          <SidebarItem icon={<Home />} text="Home" active to='/dashboard' />
          <SidebarItem icon={<BarChart2 />} text="Trade" to='/dashboard/trade' />
          <SidebarItem icon={<BookOpen />} text="Learn" to='/dashboard/learn' />
          <SidebarItem icon={<Wallet />} text="Wallet" to='/dashboard/wallet' />
          <SidebarItem icon={<Trophy />} text="Competition" to='/comp' />
        </nav>
      </div>

     
      <div className="flex-1 p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;


  