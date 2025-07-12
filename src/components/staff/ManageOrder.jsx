import { useState, useEffect } from "react";
import {
  SearchIcon,
  CalendarIcon,
  CheckIcon,
  XIcon,
  CheckCircleIcon,
  EyeIcon,
  Trash2Icon,
} from "lucide-react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

const ManageOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const getJwtToken = () => localStorage.getItem("token") || "";

  // Fetch orders from backend (commented out, using dummy data instead)
  /* const fetchOrders = async () => {
    try {
      const token = getJwtToken();
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get("http://localhost:8080/auth/getallorders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
      setLoading(false);
      toast.error(err.message || "Failed to fetch orders", { position: "top-right", autoClose: 3000 });
    }
  }; */

  useEffect(() => {
    // Simulate fetching data with dummy data
    const dummyOrders = [
      {
        id: 1,
        customerName: "John Doe",
        email: "john.doe@example.com",
        address: "123 Main St",
        orderDate: "2025-06-30",
        category: "Fiction",
        products: ["The Great Gatsby", "Sapiens"],
        totalPrice: 40.98,
        status: "Pending",
      },
      {
        id: 2,
        customerName: "Jane Smith",
        email: "jane.smith@example.com",
        address: "456 Oak Ave",
        orderDate: "2025-06-29",
        category: "Children",
        products: ["The Cat in the Hat"],
        totalPrice: 9.99,
        status: "Confirmed",
      },
      {
        id: 3,
        customerName: "Bob Johnson",
        email: "bob.johnson@example.com",
        address: "789 Pine Rd",
        orderDate: "2025-06-28",
        category: "Textbooks",
        products: ["Calculus Made Easy"],
        totalPrice: 19.99,
        status: "Canceled",
      },
    ];
    setOrders(dummyOrders);
    setLoading(false);
  }, []);

  // Handle deleting an order (dummy implementation)
  const handleDeleteOrder = () => {
    setOrders(orders.filter((o) => o.id !== selectedOrder.id));
    setShowDeleteModal(false);
    setSelectedOrder(null);
    toast.success("Order deleted successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Handle confirming an order (dummy implementation)
  const handleConfirmOrder = () => {
    setOrders(
      orders.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: "Confirmed" } : o
      )
    );
    setSelectedOrder({ ...selectedOrder, status: "Confirmed" }); // Update selectedOrder status
    setShowConfirmModal(false);
    toast.success("Order confirmed successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Handle canceling an order (dummy implementation)
  const handleCancelOrder = () => {
    setOrders(
      orders.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: "Canceled" } : o
      )
    );
    setSelectedOrder({ ...selectedOrder, status: "Canceled" }); // Update selectedOrder status
    setShowCancelModal(false);
    toast.success("Order canceled successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "All" || order.status === activeTab;
    const matchesSearch =
      (order.customerName?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (order.id?.toString().toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );
    const matchesDate =
      !selectedDate || order.orderDate?.includes(selectedDate) || false;
    return matchesTab && matchesSearch && matchesDate;
  });

  // Stats for dashboard
  const stats = [
    {
      id: "Pending",
      name: "Pending",
      count: orders.filter((o) => o.status === "Pending").length,
      change: "+5%",
      icon: <CalendarIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-yellow-500",
      bgTo: "to-amber-600",
    },
    {
      id: "Confirmed",
      name: "Confirmed",
      count: orders.filter((o) => o.status === "Confirmed").length,
      change: "+10%",
      icon: <CheckIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-green-400",
      bgTo: "to-emerald-600",
    },
    {
      id: "Canceled",
      name: "Canceled",
      count: orders.filter((o) => o.status === "Canceled").length,
      change: "-3%",
      icon: <XIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-red-500",
      bgTo: "to-rose-600",
    },
  ];

  const tabs = [
    { id: "All", label: "All" },
    { id: "Pending", label: "Pending" },
    { id: "Confirmed", label: "Confirmed" },
    { id: "Canceled", label: "Canceled" },
  ];

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "Confirmed":
        return <CheckIcon className="h-4 w-4" />;
      case "Canceled":
        return <XIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white font-sans">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400 font-sans">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-white flex flex-col relative overflow-hidden"
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

      <header className="bg-black/70 backdrop-blur-xl border-b border-yellow-400/30 p-4 z-[2]">
        <h1 className="text-2xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
          Order Dashboard
        </h1>
        <p className="text-yellow-400/70 font-sans">
          Monitor all order activities
        </p>
      </header>

      <main className="flex-1 p-6 z-[2]">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 ml-50">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className={`bg-gradient-to-br ${stat.bgFrom} ${stat.bgTo} p-5 rounded-xl text-white shadow-lg border border-yellow-400/50`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-white font-sans">
                    {stat.name}
                  </p>
                  <h3 className="text-2xl font-bold mt-1 font-sans">
                    {stat.count}
                  </h3>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-black/70 backdrop-blur-xl rounded-xl border border-yellow-400/50 shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-4 border-b border-yellow-400/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-64">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 bg-white/10 border border-yellow-400/50 rounded-lg w-full text-white placeholder-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5" />
                <input
                  type="date"
                  className="pl-10 pr-4 py-2 bg-white/10 border border-yellow-400/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="flex space-x-1 bg-black/50 p-1 rounded-xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`px-3 py-1 text-sm font-medium rounded-lg font-sans ${
                      activeTab === tab.id
                        ? "bg-yellow-400 text-black"
                        : "text-white hover:bg-yellow-400/20"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-white font-sans">
                No orders found matching your criteria.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-yellow-400/30">
                <thead className="bg-black/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Order Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-400/30">
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      className="hover:bg-yellow-400/10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white font-sans">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {order.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {order.orderDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
                            order.status
                          )}`}
                        >
                          <span className="mr-1">
                            {getStatusIcon(order.status)}
                          </span>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex gap-2 justify-end">
                          <motion.button
                            className="text-blue-400 hover:text-blue-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedOrder(order)}
                          >
                            <EyeIcon className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            className="text-red-400 hover:text-red-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDeleteModal(true);
                            }}
                          >
                            <Trash2Icon className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOrder && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-sm border border-yellow-400/50"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
              Delete Order
            </h2>
            <p className="text-sm text-white font-sans mb-6">
              Are you sure you want to delete order{" "}
              <span className="font-semibold">{selectedOrder.id}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <motion.button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={handleDeleteOrder}
                className="px-4 py-2 bg-red-400 text-black rounded-lg font-sans font-semibold hover:bg-red-500 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Confirm Order Modal */}
      {showConfirmModal && selectedOrder && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-sm border border-yellow-400/50"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
              Confirm Order
            </h2>
            <p className="text-sm text-white font-sans mb-6">
              Are you sure you want to confirm order{" "}
              <span className="font-semibold">{selectedOrder.id}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <motion.button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={handleConfirmOrder}
                className="px-4 py-2 bg-green-400 text-black rounded-lg font-sans font-semibold hover:bg-green-500 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Confirm
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && selectedOrder && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-sm border border-yellow-400/50"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
              Cancel Order
            </h2>
            <p className="text-sm text-white font-sans mb-6">
              Are you sure you want to cancel order{" "}
              <span className="font-semibold">{selectedOrder.id}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <motion.button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-400 text-black rounded-lg font-sans font-semibold hover:bg-red-500 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel Order
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* View Order Modal */}
      {selectedOrder &&
        !showDeleteModal &&
        !showConfirmModal &&
        !showCancelModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-md border border-yellow-400/50"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
                Order Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <span className="text-2xl font-medium text-black">
                      {selectedOrder.customerName?.charAt(0) || "N/A"}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-medium text-white font-sans">
                      {selectedOrder.customerName || "N/A"}
                    </div>
                    <div className="text-sm text-yellow-400/70 font-sans">
                      {selectedOrder.email || "N/A"}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    ID
                  </label>
                  <p className="text-sm text-white font-sans">
                    {selectedOrder.id || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    Address
                  </label>
                  <p className="text-sm text-white font-sans">
                    {selectedOrder.address || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    Order Date
                  </label>
                  <p className="text-sm text-white font-sans">
                    {selectedOrder.orderDate || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    Category Booked
                  </label>
                  <p className="text-sm text-white font-sans">
                    {selectedOrder.category || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    Products Booked
                  </label>
                  <p className="text-sm text-white font-sans">
                    {selectedOrder.products?.join(", ") || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    Total Price
                  </label>
                  <p className="text-sm text-white font-sans">
                    Rs. {selectedOrder.totalPrice || 0}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-400 font-sans">
                    Status
                  </label>
                  <p className="text-sm text-white font-sans">
                    {selectedOrder.status || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-6 gap-2">
                {selectedOrder.status !== "Confirmed" && (
                  <motion.button
                    type="button"
                    onClick={handleConfirmOrder}
                    className="px-4 py-2 bg-green-400 text-black rounded-lg font-sans font-semibold hover:bg-green-500 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Confirm
                  </motion.button>
                )}
                {selectedOrder.status !== "Canceled" && (
                  <motion.button
                    type="button"
                    onClick={handleCancelOrder}
                    className="px-4 py-2 bg-red-400 text-black rounded-lg font-sans font-semibold hover:bg-red-500 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                )}
                <motion.button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
    </motion.div>
  );
};

export default ManageOrder;