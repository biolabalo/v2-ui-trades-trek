import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import DashboardLayout from "../../components/dashboardLayout";
import { Bell, Eye, ChevronDown, PlusCircle, Trophy } from "lucide-react";

const DashboardHome = () => {
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
    <DashboardLayout>
      {isLoading ? (
        <p> Loading....</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {" "}
          <div className="flex justify-end mb-6">
            <Bell className="w-6 h-6" />
          </div>
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="flex items-center mb-2">
                  <span className="mr-2">Wallet Balance</span>
                  <Eye className="w-4 h-4" />
                </div>
                <h2 className="text-3xl font-bold">
                  {userData?.wallet?.currency_code} {userData?.wallet?.balance}
                </h2>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <span className="mr-2">Trek coin balance</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <h2 className="text-3xl font-bold">
                  {userData?.trek_coin_balance}
                </h2>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm text-gray-400">Total followers </span>
                <span className="text-green-400 ml-2">
                  {" "}
                  {userData?.total_followers}
                </span>
              </div>
              <button className="text-purple-400 hover:text-purple-300">
                Portfolio Details
              </button>
            </div>
          </div>
          {/* Account Summary */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="flex items-center mb-2">
                  <span className="mr-2">Account Value</span>
                  <Eye className="w-4 h-4" />
                </div>
                <h2 className="text-3xl font-bold">₦ 500,000</h2>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <span className="mr-2">Cash Value</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <h2 className="text-3xl font-bold">₦ 0.00</h2>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-green-400 mr-2">↑ ₦ 0.00 (0.00%)</span>
                <span className="text-sm text-gray-400">Today</span>
              </div>
              <button className="text-purple-400 hover:text-purple-300">
                Portfolio Details
              </button>
            </div>
          </div>
          {/* Trades Trek */}
          <div className="bg-gray-800 rounded-lg p-4 mb-8 flex justify-between items-center">
            <div className="flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
              <span className="font-semibold">Trades Trek</span>
            </div>
            <ChevronDown className="w-6 h-6" />
          </div>
          {/* Watchlist */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Watchlist</h3>
            <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
              <span className="text-gray-400 mr-2">
                No watchlist created at this time.
              </span>
              <button className="text-purple-400 hover:text-purple-300 flex items-center">
                <PlusCircle className="w-4 h-4 mr-1" /> Add New
              </button>
            </div>
          </div>
          {/* Top Gainers & Losers */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <TopMovers title="Top Gainers" stocks={topGainers} />
            <TopMovers title="Top Losers" stocks={topLosers} />
          </div>
          {/* Stock List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Stock List</h3>
              <button className="text-purple-400 hover:text-purple-300">
                See All
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg">
              {stockList.map((stock, index) => (
                <StockItem key={index} {...stock} />
              ))}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

const TopMovers = ({ title, stocks }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <button className="text-purple-400 hover:text-purple-300">See All</button>
    </div>
    <div className="grid grid-cols-3 gap-4">
      {stocks.map((stock, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4">
          <img
            src="/api/placeholder/30/30"
            alt={stock.symbol}
            className="mb-2"
          />
          <div className="font-semibold">{stock.symbol}</div>
          <div
            className={`text-sm ${
              stock.change > 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            ₦ {stock.price}
          </div>
          <div
            className={`text-xs ${
              stock.change > 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {stock.change > 0 ? "↑" : "↓"} {Math.abs(stock.change)}%
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StockItem = ({ logo, name, symbol, change }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0">
    <div className="flex items-center">
      <img src="/api/placeholder/30/30" alt={name} className="w-8 h-8 mr-3" />
      <div>
        <div className="font-semibold">{symbol}</div>
        <div className="text-sm text-gray-400">{name}</div>
      </div>
    </div>
    <div
      className={`text-sm ${change > 0 ? "text-green-400" : "text-red-400"}`}
    >
      {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
    </div>
  </div>
);

// Sample data
const topGainers = [
  { symbol: "AAPL", price: 19.0, change: 0.48 },
  { symbol: "AAPL", price: 0.88, change: 0.88 },
  { symbol: "AAPL", price: 0.88, change: 0.88 },
];

const topLosers = [
  { symbol: "GOOGL", price: 19.0, change: -0.48 },
  { symbol: "GOOGL", price: 19.0, change: -0.48 },
  { symbol: "GOOGL", price: 19.0, change: -0.48 },
];

const stockList = [
  { logo: "AMZN", name: "Amazon.com INC", symbol: "AMZN", change: 0.88 },
  { logo: "MSFT", name: "Microsoft Corp", symbol: "MSFT", change: -1.09 },
  { logo: "AMZN", name: "Amazon.com INC", symbol: "AMZN", change: -1.09 },
  { logo: "AIICO", name: "AIICO Insurance", symbol: "AIICO", change: 0.84 },
];

export default DashboardHome;
