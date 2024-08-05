import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import DashboardLayout from "../../components/dashboardLayout";
import { Search, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { formatDistanceToNow } from 'date-fns';


const Trade = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [competitons, setCompetitons] = useState([]);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [stockListView, setStockListView] = useState(true);
  const [myOrders, setMyOrders] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axiosInstance.get(
          "https://staging-api.tradestrek.com/stock/all"
        );
        setStocks(response.data.data);
        setFilteredStocks(response.data.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch stock data");
        setIsLoading(false);
      }
    };

    fetchStocks();
  }, []);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axiosInstance.get("/competitions");

        setCompetitons(response.data.data.competitions);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStocks();
  }, []);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axiosInstance.get("/orders/my-orders");
        setMyOrders(response.data.data.orders);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStocks();
  }, []);

  useEffect(() => {
    const results = stocks.filter(
      (stock) =>
        stock.Symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStocks(results);
  }, [searchTerm, stocks]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const onSubmit = async (data) => {
    if (!selectedStock) {
      toast.error("Please select a stock to trade.");
      return;
    }
    setTradeLoading(true);

    const tradeData = {
      trade_action: data.trade_action,
      quantity: Number(data.quantity),
      duration: data.duration,
      order_type: data.order_type,
      price: selectedStock.Last,
      competition_id: competitons[0]._id,
    };

    try {
      const response = await axiosInstance.post(
        `/orders/${selectedStock.Symbol}`,
        tradeData
      );

      reset(); // Reset the form
      setSelectedStock(null); // Clear selected stock after submission
      toast.success(response?.data?.data?.message);
      setTradeLoading(false);
    } catch (error) {
      setTradeLoading(false);
      console.error("Failed to submit trade:", error);
      // alert("Failed to submit trade. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      {isLoading ? (
        <p>Loading....</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="flex-1 p-8 overflow-auto">
            <div className="competiton-div w-1/3 ml-auto">
              <label className="block mb-1">Competiton</label>
              <div className="relative">
                <select className="w-full bg-gray-700 text-white p-2 rounded-lg appearance-none">
                  {competitons.map((e) => (
                    <option key={e._id}>{e.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-6">Trade</h2>

            {/* Stock list and Buy stock sections */}
            <div className="flex flex-col lg:flex-row">
              {/* Stock list */}
              <div className="w-full lg:w-1/2 pr-0 lg:pr-4 mb-8 lg:mb-0">
                <div className="flex mb-4">
                  <button
                    onClick={() => {
                      setStockListView(true);
                    }}
                    className={
                      stockListView
                        ? "bg-purple-600 text-white px-4 py-2 rounded-l-lg"
                        : "bg-gray-600 text-white px-4 py-2 rounded-l-lg"
                    }
                  >
                    Stock List
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStock(null)
                      setStockListView(false);
                    }}
                    className={
                      !stockListView
                        ? "bg-purple-600 text-white px-4 py-2 rounded-r-lg"
                        : "bg-gray-600 text-white px-4 py-2 rounded-r-lg"
                    }
                  >
                    Order Status
                  </button>
                </div>

                {stockListView ? (
                  <div className="stockListView">
                    <div className="relative mb-4">
                      <input
                        type="text"
                        placeholder="Search by Symbol or Name"
                        className="w-full bg-gray-800 text-white p-2 pl-10 rounded-lg"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                      <Search className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                    <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-auto">
                      {filteredStocks.map((stock) => (
                        <div
                          key={stock.Symbol}
                          className="flex items-center justify-between bg-gray-800 hover:bg-[#483d8b] p-3 rounded-lg cursor-pointer"
                          onClick={() => setSelectedStock(stock)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg mr-3 flex items-center justify-center">
                              {stock.Symbol[0]}
                            </div>
                            <div>
                              <div className="font-bold">{stock.Symbol}</div>
                              <div className="text-sm text-gray-400">
                                {stock.Name}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div>₦ {stock.Last.toFixed(2)}</div>
                            <div
                              className={
                                stock.PerChange >= 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {stock.PerChange >= 0 ? (
                                <ArrowUp size={12} className="inline" />
                              ) : (
                                <ArrowDown size={12} className="inline" />
                              )}
                              {Math.abs(stock.PerChange).toFixed(2)}% today
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : ( // view orders // if myOrders.length is 0 show a text saying No order has been places yet
                  <OrderStatusView myOrders={myOrders} />
                )}
              </div>

              {/* Buy stock form */}
              {selectedStock && (
                <div className="w-full lg:w-1/2 pl-0 lg:pl-4">
                  <h3 className="text-2xl font-bold mb-4">Trade Stock</h3>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-gray-800 p-4 rounded-lg mb-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-600 rounded-lg mr-3 flex items-center justify-center">
                          {selectedStock.Symbol[0]}
                        </div>
                        <div>
                          <div className="font-bold">
                            {selectedStock.Symbol}
                          </div>
                          <div>₦ {selectedStock.Last.toFixed(2)}</div>
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded ${
                          selectedStock.PerChange >= 0
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {selectedStock.PerChange.toFixed(2)}%
                      </div>
                    </div>
                    <div className="mt-2 text-green-500">Market Opened</div>

                    <div className="space-y-4">
                      <div>
                        <label className="block mb-1">Quantity</label>
                        <input
                          type="number"
                          placeholder={`Enter Minimum of ${selectedStock.Last.toFixed(
                            0
                          )}`}
                          className="w-full bg-gray-700 text-white p-2 rounded-lg"
                          {...register("quantity", { required: true })}
                        />
                        {errors.quantity && (
                          <p className="text-red-500">Quantity is required</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-1">Action</label>
                        <div className="relative">
                          <select
                            className="w-full bg-gray-700 text-white p-2 rounded-lg appearance-none"
                            {...register("trade_action", { required: true })}
                          >
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-3 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block mb-1">Duration</label>
                        <div className="relative">
                          <select
                            className="w-full bg-gray-700 text-white p-2 rounded-lg appearance-none"
                            {...register("duration", { required: true })}
                          >
                            <option value="day_only">Day Only</option>
                            <option value="good_till_cancelled">
                              Good Till Cancelled
                            </option>
                          </select>
                          <ChevronDown className="absolute right-3 top-3 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block mb-1">Order Type</label>
                        <div className="relative">
                          <select
                            className="w-full bg-gray-700 text-white p-2 rounded-lg appearance-none"
                            {...register("order_type", { required: true })}
                          >
                            <option value="limit">Limit</option>
                            <option value="market">Market</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-3 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={tradeLoading}
                      type="submit"
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg mt-4 w-full"
                    >
                      {tradeLoading ? (
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
                          Placing order...
                        </>
                      ) : (
                        "Submit Trade"
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Trade;


const OrderStatusView = ({ myOrders }) => {
  if (myOrders.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No orders have been placed yet.
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-auto">
      {myOrders.map((order) => (
        <div key={order._id} className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-lg">{order.stock_symbol}</span>
            <span className={`px-2 py-1 rounded ${order.status === 'pending' ? 'bg-yellow-600' : order.status === 'completed' ? 'bg-green-600' : 'bg-red-600'}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Type: {order.type}</div>
            <div>Action: {order.trade_action}</div>
            <div>Price: ₦{order.price.toFixed(2)}</div>
            <div>Quantity: {order.quantity}</div>
            <div>Total: ₦{(order.price * order.quantity).toFixed(2)}</div>
            <div>Commission: ₦{order.commission.toFixed(2)}</div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Placed {formatDistanceToNow(new Date(order.createdAt))} ago
          </div>
        </div>
      ))}
    </div>
  );
};

