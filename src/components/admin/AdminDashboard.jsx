// import { Users, DollarSign, Book, TrendingUp, Clock3 } from "lucide-react";
// import { useState, useEffect } from "react";

// const AdminDashboard = () => {
//   const [currentTime, setCurrentTime] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="p-6 bg-white space-y-6">
//       {/* Stats Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Users"
//           value="2,543"
//           change="+12.5%"
//           icon={<Users className="w-6 h-6 text-white" />}
//           bgFrom="from-indigo-500"
//           bgTo="to-violet-600"
//         />
//         <StatCard
//           title="Total Sales"
//           value="$45,234"
//           change="+8.2%"
//           icon={<DollarSign className="w-6 h-6 text-white" />}
//           bgFrom="from-green-400"
//           bgTo="to-emerald-600"
//         />
//         <StatCard
//           title="Books Sold"
//           value="1,234"
//           change="+23.1%"
//           icon={<Book className="w-6 h-6 text-white" />}
//           bgFrom="from-cyan-500"
//           bgTo="to-sky-600"
//         />
//         <StatCard
//           title="Customer Growth"
//           value="18.5%"
//           change="+4.3%"
//           icon={<TrendingUp className="w-6 h-6 text-white" />}
//           bgFrom="from-amber-500"
//           bgTo="to-orange-600"
//         />
//       </div>

//       {/* Charts and Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Chart Placeholder */}
//         <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-yellow-400/30">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-black">📊 Sales Overview</h2>
//             <select className="border border-gray-300 rounded-md px-3 py-1 text-sm text-black focus:outline-none">
//               <option>This Week</option>
//               <option>This Month</option>
//               <option>This Year</option>
//             </select>
//           </div>
//           <div className="h-[300px] flex flex-col justify-center items-center bg-gray-50 rounded-md border-dashed border-2 border-yellow-400/40">
//             <TrendingUp className="text-yellow-500" size={100} />
//             <p className="text-gray-600 mt-4 text-sm">Chart Coming Soon</p>
//           </div>
//         </div>

//         {/* Activity Feed */}
//         <div className="bg-white p-6 rounded-xl shadow-md border border-yellow-400/30">
//           <h2 className="text-xl font-semibold text-black mb-4">📋 Recent Activity</h2>
//           <div className="space-y-5">
//             {activities.map((activity, index) => (
//               <ActivityItem key={index} {...activity} />
//             ))}
//           </div>
//           <p className="text-sm text-gray-600 mt-4">
//             Last Updated: {currentTime.toLocaleString("en-US", {
//               timeZone: "Asia/Kolkata",
//               hour12: true,
//             })}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ title, value, change, icon, bgFrom, bgTo }) => {
//   return (
//     <div
//       className={`bg-gradient-to-br ${bgFrom} ${bgTo} p-5 rounded-xl text-white shadow-md hover:shadow-lg transition-all cursor-pointer`}
//     >
//       <div className="flex justify-between items-center">
//         <div className="flex flex-col">
//           <p className="text-sm font-medium">{title}</p>
//           <h3 className="text-2xl font-bold mt-1">{value}</h3>
//           <p className="text-sm mt-1 text-white/80">{change}</p>
//         </div>
//         <div className="p-2 bg-yellow-500/30 rounded-lg">{icon}</div>
//       </div>
//     </div>
//   );
// };

// const ActivityItem = ({ user, action, time }) => {
//   return (
//     <div className="flex items-start gap-3">
//       <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
//         {user.charAt(0)}
//       </div>
//       <div>
//         <p className="text-sm text-gray-700">
//           <span className="font-medium text-black">{user}</span> {action}
//         </p>
//         <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
//           <Clock3 size={12} /> {time}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Dummy Activity Feed Data
// const activities = [
//   { user: "John Doe", action: "added a new book", time: "2 minutes ago" },
//   { user: "Sarah Smith", action: "approved a book suggestion", time: "15 minutes ago" },
//   { user: "Mike Johnson", action: "updated book details", time: "1 hour ago" },
//   { user: "Anna Brown", action: "deleted a product", time: "2 hours ago" },
//   { user: "David Wilson", action: "generated a sales report", time: "3 hours ago" },
// ];

// export default AdminDashboard;

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

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalAccessories: 0,
    totalBooks: 0,
    totalCategories: 0,
    totalRevenues: 0,
  });
  const [suggestions, setSuggestions] = useState([]);
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
        setError("Please log in as an admin to view the dashboard");
        toast.error("Please log in as an admin", { position: "top-right", autoClose: 3000 });
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

      // Fetch orders for total revenues
      let totalRevenues = 0;
      try {
        const ordersRes = await api.get("/allorders");
        const orders = ordersRes.data || [];
        totalRevenues = orders.reduce(
          (sum, order) => sum + (order.totalPrice || 0),
          0
        );
      } catch (err) {
        console.warn("Failed to fetch orders:", err.response?.status, err.message);
      }

      // Fetch suggestions
      let suggestionsData = [];
      try {
        const suggestionsRes = await api.get("/getsuggestions");
        suggestionsData = suggestionsRes.data.map((suggestion, index) => ({
          id: suggestion.id,
          serial: index + 1,
          name: suggestion.name,
          email: suggestion.email,
          bookTitle: suggestion.bookTitle,
          authorName: suggestion.authorName,
          status: suggestion.status,
        }));
      } catch (err) {
        console.warn("Failed to fetch suggestions:", err.response?.status, err.message);
      }

      setStats({
        totalCustomers,
        totalAccessories,
        totalBooks,
        totalCategories,
        totalRevenues: totalRevenues.toFixed(2),
      });
      setSuggestions(suggestionsData);
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
      case "PENDING":
        return "bg-yellow-400/20 text-yellow-400";
      case "MARK_AS_READ":
        return "bg-green-400/20 text-green-400";
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
    <div className="p-6 bg-gray-50 space-y-8 font-sans">
      <ToastContainer />
      {/* Welcome Message */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600 drop-shadow-lg">
          Welcome, Admin! Manage Your Bookstore with Ease
        </h1>
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          Monitor key metrics and review book suggestions below.
        </p>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          change="+10.2%"
          icon={<Users className="w-6 h-6 text-white" />}
          bgFrom="from-indigo-500"
          bgTo="to-violet-600"
        />
        <StatCard
          title="Total Books"
          value={stats.totalBooks.toLocaleString()}
          change="+8.7%"
          icon={<Book className="w-6 h-6 text-white" />}
          bgFrom="from-cyan-500"
          bgTo="to-sky-600"
        />
        <StatCard
          title="Total Accessories"
          value={stats.totalAccessories.toLocaleString()}
          change="+5.3%"
          icon={<Package className="w-6 h-6 text-white" />}
          bgFrom="from-green-400"
          bgTo="to-emerald-600"
        />
        <StatCard
          title="Total Categories"
          value={stats.totalCategories.toLocaleString()}
          change="+3.1%"
          icon={<Package className="w-6 h-6 text-white" />}
          bgFrom="from-amber-500"
          bgTo="to-orange-600"
        />
        <StatCard
          title="Total Revenues"
          value={`Rs. ${stats.totalRevenues.toLocaleString()}`}
          change="+7.5%"
          icon={<DollarSign className="w-6 h-6 text-white" />}
          bgFrom="from-purple-500"
          bgTo="to-pink-600"
        />
      </div>

      {/* Book Suggestions Table */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-yellow-400/50 shadow-xl">
        <div className="p-4 border-b border-yellow-400/30 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            Book Suggestions
          </h2>
          <motion.button
            className="px-3 py-1 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/suggestions")}
          >
            Manage Suggestions <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
        <div>
          {suggestions.length === 0 ? (
            <div className="p-6 text-center text-white/80">
              No suggestions found.
            </div>
          ) : (
            <table className="w-full table-auto">
              <thead className="bg-black/50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                    No.
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider max-w-xs">
                    Book Title
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider max-w-xs">
                    Author Name
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-400/30">
                {suggestions.slice(0, 5).map((suggestion, index) => (
                  <motion.tr
                    key={suggestion.id}
                    className="hover:bg-yellow-400/10 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <td className="px-3 py-2 text-xs text-white/90">{suggestion.serial}</td>
                    <td className="px-3 py-2 text-xs text-white/90">{suggestion.name}</td>
                    <td className="px-3 py-2 text-xs text-white/90">{suggestion.email}</td>
                    <td className="px-3 py-2 text-xs text-white/90 whitespace-normal break-words max-w-xs">
                      {suggestion.bookTitle}
                    </td>
                    <td className="px-3 py-2 text-xs text-white/90 whitespace-normal break-words max-w-xs">
                      {suggestion.authorName}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
                          suggestion.status
                        )}`}
                      >
                        {suggestion.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon, bgFrom, bgTo }) => {
  return (
    <motion.div
      className={`bg-gradient-to-br ${bgFrom} ${bgTo} p-5 rounded-xl text-white shadow-md hover:shadow-xl transition-all cursor-pointer`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-sm font-medium">{title}</p>
          <h3 className="text-xl font-bold mt-1">{value}</h3>
          <p className="text-xs mt-1 text-white/80">{change}</p>
        </div>
        <div className="p-2 bg-yellow-500/30 rounded-lg">{icon}</div>
      </div>
    </motion.div>
  );
};

const getStatusStyles = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-400/20 text-yellow-400";
    case "MARK_AS_READ":
      return "bg-green-400/20 text-green-400";
    default:
      return "bg-gray-400/20 text-gray-400";
  }
};

export default AdminDashboard;