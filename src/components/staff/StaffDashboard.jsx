import { Users, Package, Book, DollarSign, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "http://localhost:8080";

// Axios instance with token interceptor
const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const StaffDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalAccessories: 0,
    totalBooks: 0,
    totalCategories: 0,
    totalRevenues: 0,
  });
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchDashboardData();
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in as a staff member to view the dashboard");
        toast.error("Please log in as a staff member", { position: "top-right", autoClose: 3000 });
        setLoading(false);
        return;
      }

      // Fetch customers
      const customersRes = await api.get("/auth/getallcustomers");
      const customers = customersRes.data || [];
      const totalCustomers = customers.length;

      // Fetch accessories
      const accessoriesRes = await api.get("/auth/getallaccessories");
      const totalAccessories = accessoriesRes.data?.length || 0;

      // Fetch books
      const booksRes = await api.get("/auth/getallbooks");
      const totalBooks = booksRes.data?.length || 0;

      // Fetch categories
      const categoriesRes = await api.get("/auth/getallcategories");
      const totalCategories = categoriesRes.data?.length || 0;

      // Fetch orders for total revenues and pending orders
      let totalRevenues = 0;
      let pendingOrdersData = [];
      try {
        const ordersRes = await api.get("/allorders");
        const orders = ordersRes.data || [];
        totalRevenues = orders.reduce(
          (sum, order) => sum + (order.totalPrice || 0),
          0
        );
        pendingOrdersData = orders
          .filter((order) => order.status === "Pending")
          .map((order, index) => ({
            id: order.id,
            serial: index + 1,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            orderDate: order.orderDate,
            totalPrice: order.totalPrice,
            status: order.status,
          }));
      } catch (err) {
        console.warn("Failed to fetch orders:", err.response?.status, err.message);
      }

      setStats({
        totalCustomers,
        totalAccessories,
        totalBooks,
        totalCategories,
        totalRevenues: totalRevenues.toFixed(2),
      });
      setPendingOrders(pendingOrdersData);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Unauthorized: Please log in again");
        toast.error("Unauthorized: Please log in again", { position: "top-right", autoClose: 3000 });
      } else {
        setError("Failed to load dashboard data: " + err.message);
        toast.error("Failed to load dashboard data", { position: "top-right", autoClose: 3000 });
      }
      setLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-400/20 text-yellow-400";
      case "Confirmed":
        return "bg-green-400/20 text-green-400";
      case "Canceled":
        return "bg-red-400/20 text-red-400";
      default:
        return "bg-gray-400/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 font-sans">
        <svg className="animate-spin h-8 w-8 mx-auto mb-2" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-sans">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <ToastContainer />

      <svg
        className="absolute top-0 left-0 w-full h-[200px] z-[1] opacity-20"
        viewBox="0 0 1440 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#FBBF24"
          d="M0,128L60,138.7C120,149,240,171,360,170.7C480,171,600,149,720,133.3C840,117,960,107,1080,117.3C1200,128,1320,160,1380,176L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        />
      </svg>

      <header className="bg-black/70 backdrop-blur-xl border-b border-yellow-400/30 p-4 flex justify-between items-center z-[2]">
        <h1 className="text-2xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
          Staff Dashboard
        </h1>
        <p className="text-sm text-white/80">
          {currentTime.toLocaleString()}
        </p>
      </header>

      <main className="flex-1 p-6 z-[2] space-y-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-3xl text-black font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-10">
 Stay on top of key metrics and manage orders efficiently to ensure smooth operations.
</p>
<p className="text-xl text-gray-600 font-sans mb-10">
Your commitment plays a vital role in delivering outstanding service and creating a memorable experience for every customer at Pahana Edu Bookshop. Let’s continue raising the standard together!
</p>

        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              title: "Total Customers",
              value: stats.totalCustomers.toLocaleString(),
              change: "+10.2%",
              icon: <Users className="w-6 h-6 text-white" />,
              bgFrom: "from-indigo-500",
              bgTo: "to-violet-600",
            },
            {
              title: "Total Books",
              value: stats.totalBooks.toLocaleString(),
              change: "+8.7%",
              icon: <Book className="w-6 h-6 text-white" />,
              bgFrom: "from-cyan-500",
              bgTo: "to-sky-600",
            },
            {
              title: "Total Accessories",
              value: stats.totalAccessories.toLocaleString(),
              change: "+5.3%",
              icon: <Package className="w-6 h-6 text-white" />,
              bgFrom: "from-green-400",
              bgTo: "to-emerald-600",
            },
            {
              title: "Total Categories",
              value: stats.totalCategories.toLocaleString(),
              change: "+3.1%",
              icon: <Package className="w-6 h-6 text-white" />,
              bgFrom: "from-amber-500",
              bgTo: "to-orange-600",
            },
            {
              title: "Total Revenues",
              value: `Rs. ${stats.totalRevenues.toLocaleString()}`,
              change: "+7.5%",
              icon: <DollarSign className="w-6 h-6 text-white" />,
              bgFrom: "from-purple-500",
              bgTo: "to-pink-600",
            },
          ].map((stat, index) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              bgFrom={stat.bgFrom}
              bgTo={stat.bgTo}
              index={index}
            />
          ))}
        </div>

        {/* Pending Orders Table */}
        <motion.div
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-yellow-400/50 shadow-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-4 border-b border-yellow-400/30 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Pending Orders
            </h2>
            <motion.button
              className="px-3 py-1 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center gap-2 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/staff/orders")}
            >
              Manage Orders <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
          <div className="overflow-x-auto">
            {pendingOrders.length === 0 ? (
              <div className="p-6 text-center text-white/80 font-sans">
                No pending orders found.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-yellow-400/30">
                <thead className="bg-black/50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      No.
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Order ID
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Customer Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Customer Email
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Order Date
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Total Price
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-400/30">
                  {pendingOrders.slice(0, 5).map((order, index) => (
                    <motion.tr
                      key={order.id}
                      className="hover:bg-yellow-400/10 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <td className="px-3 py-2 text-xs text-white/90 font-sans">{order.serial}</td>
                      <td className="px-3 py-2 text-xs text-white/90 font-sans">{order.id}</td>
                      <td className="px-3 py-2 text-xs text-white/90 font-sans">{order.customerName}</td>
                      <td className="px-3 py-2 text-xs text-white/90 font-sans">{order.customerEmail}</td>
                      <td className="px-3 py-2 text-xs text-white/90 font-sans">{order.orderDate}</td>
                      <td className="px-3 py-2 text-xs text-white/90 font-sans">Rs. {order.totalPrice.toFixed(2)}</td>
                      <td className="px-3 py-2 font-sans">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
};

const StatCard = ({ title, value, change, icon, bgFrom, bgTo, index }) => {
  return (
    <motion.div
      className={`bg-gradient-to-br ${bgFrom} ${bgTo} p-5 rounded-xl text-white shadow-md hover:shadow-xl transition-all cursor-pointer border border-yellow-400/50`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-sm font-medium font-sans">{title}</p>
          <h3 className="text-xl font-bold mt-1 font-sans">{value}</h3>
          <p className="text-xs mt-1 text-white/80 font-sans">{change}</p>
        </div>
        <div className="p-2 bg-yellow-500/30 rounded-lg">{icon}</div>
      </div>
    </motion.div>
  );
};

const getStatusStyles = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-400/20 text-yellow-400";
    case "Confirmed":
      return "bg-green-400/20 text-green-400";
    case "Canceled":
      return "bg-red-400/20 text-red-400";
    default:
      return "bg-gray-400/20 text-gray-400";
  }
};

export default StaffDashboard;