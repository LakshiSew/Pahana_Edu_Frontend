import { useState, useEffect } from "react";
import {
  SearchIcon,
  EyeIcon,
  CheckCircleIcon,
  Trash2Icon,
} from "lucide-react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AdminCustomer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [verifiedCustomers, setVerifiedCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);

  // Base URL for backend API
  const API_URL = "http://localhost:8080/auth";

  // Fetch all customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(`${API_URL}/getallcustomers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Map backend fields to frontend fields
        const customers = response.data.map((customer) => ({
          id: customer.customerId,
          customerName: customer.customerName,
          email: customer.customerEmail,
          address: customer.address,
          mobile: customer.customerPhone,
          status: customer.status,
          profileImage: customer.profileImage, // Include profileImage for view modal
        }));

        setPendingCustomers(customers.filter((c) => c.status === "PENDING"));
        setVerifiedCustomers(customers.filter((c) => c.status === "VERIFIED"));
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch customers");
        setLoading(false);
        toast.error(err.message || "Failed to fetch customers", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchCustomers();
  }, []);

  // Handle verifying a customer
  const handleVerifyCustomer = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.put(
        `${API_URL}/admin/verifycustomer/${selectedCustomer.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedCustomer = {
        ...selectedCustomer,
        status: response.data.status, // Update status to VERIFIED
      };

      setVerifiedCustomers([...verifiedCustomers, updatedCustomer]);
      setPendingCustomers(pendingCustomers.filter((c) => c.id !== selectedCustomer.id));
      setShowVerifyModal(false);
      setSelectedCustomer(null);
      toast.success("Customer verified successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      const errorMessage = err.response?.status === 404 ? "Customer not found" : "Failed to verify customer";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handle deleting a customer
  const handleDeleteCustomer = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.delete(`${API_URL}/deletecustomer/${selectedCustomer.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (selectedCustomer.status === "PENDING") {
        setPendingCustomers(pendingCustomers.filter((c) => c.id !== selectedCustomer.id));
      } else {
        setVerifiedCustomers(verifiedCustomers.filter((c) => c.id !== selectedCustomer.id));
      }
      setShowDeleteModal(false);
      setSelectedCustomer(null);
      toast.success("Customer deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      const errorMessage = err.response?.status === 404 ? "Customer not found" : "Failed to delete customer";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Filter customers
  const filteredPending = pendingCustomers.filter((customer) =>
    (customer.customerName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (customer.id?.toString().toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (customer.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const filteredVerified = verifiedCustomers.filter((customer) =>
    (customer.customerName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (customer.id?.toString().toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (customer.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const getStatusStyles = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-400/20 text-yellow-400";
      case "VERIFIED":
        return "bg-green-400/20 text-green-400";
      default:
        return "bg-gray-400/20 text-gray-400";
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
          Customer Management
        </h1>
        <p className="text-yellow-400/70 font-sans">
          Manage all customers and verify new registrations
        </p>
      </header>

      <main className="flex-1 p-6 z-[2]">
        <motion.div
          className="bg-black/70 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/50 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-yellow-400/50 rounded-lg w-full text-white placeholder-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Pending Customers Table */}
        <motion.div
          className="bg-black/70 backdrop-blur-xl rounded-xl border border-yellow-400/50 shadow-lg mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-4 border-b border-yellow-400/30">
            <h2 className="text-xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Pending Customers
            </h2>
          </div>
          <div className="overflow-x-auto">
            {filteredPending.length === 0 ? (
              <div className="p-8 text-center text-white font-sans">
                No pending customers found.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-yellow-400/30">
                <thead className="bg-black/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Mobile
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
                  {filteredPending.map((customer, index) => (
                    <motion.tr
                      key={customer.id}
                      className="hover:bg-yellow-400/10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white font-sans">
                        {customer.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {customer.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {customer.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {customer.mobile}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
                            customer.status
                          )}`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex gap-2 justify-end">
                          <motion.button
                            className="text-blue-400 hover:text-blue-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedCustomer(customer);
                            }}
                          >
                            <EyeIcon className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            className="text-green-400 hover:text-green-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setShowVerifyModal(true);
                            }}
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            className="text-red-400 hover:text-red-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedCustomer(customer);
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

        {/* Verified Customers Table */}
        <motion.div
          className="bg-black/70 backdrop-blur-xl rounded-xl border border-yellow-400/50 shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-4 border-b border-yellow-400/30">
            <h2 className="text-xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Verified Customers
            </h2>
          </div>
          <div className="overflow-x-auto">
            {filteredVerified.length === 0 ? (
              <div className="p-8 text-center text-white font-sans">
                No verified customers found.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-yellow-400/30">
                <thead className="bg-black/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Mobile
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
                  {filteredVerified.map((customer, index) => (
                    <motion.tr
                      key={customer.id}
                      className="hover:bg-yellow-400/10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white font-sans">
                        {customer.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {customer.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {customer.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {customer.mobile}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
                            customer.status
                          )}`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex gap-2 justify-end">
                          <motion.button
                            className="text-blue-400 hover:text-blue-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedCustomer(customer);
                            }}
                          >
                            <EyeIcon className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            className="text-red-400 hover:text-red-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedCustomer(customer);
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

      {/* Verify Customer Modal */}
      {showVerifyModal && selectedCustomer && (
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
              Verify Customer
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  {selectedCustomer.profileImage ? (
                    <img
                      src={selectedCustomer.profileImage}
                      alt={selectedCustomer.customerName}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-medium text-black">
                      {selectedCustomer.customerName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="ml-4">
                  <div className="text-lg font-medium text-white font-sans">{selectedCustomer.customerName}</div>
                  <div className="text-sm text-yellow-400/70 font-sans">{selectedCustomer.email}</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">ID</label>
                <p className="text-sm text-white font-sans">{selectedCustomer.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">Email</label>
                <p className="text-sm text-white font-sans">{selectedCustomer.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">Address</label>
                <p className="text-sm text-white font-sans">{selectedCustomer.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">Mobile</label>
                <p className="text-sm text-white font-sans">{selectedCustomer.mobile}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <motion.button
                type="button"
                onClick={() => {
                  setShowVerifyModal(false);
                  setSelectedCustomer(null);
                }}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={handleVerifyCustomer}
                className="px-4 py-2 bg-green-400 text-black rounded-lg font-sans font-semibold hover:bg-green-500 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Verify
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Customer Modal */}
      {showDeleteModal && selectedCustomer && (
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
              Delete Customer
            </h2>
            <p className="text-sm text-white font-sans mb-6">
              Are you sure you want to delete {selectedCustomer.customerName} ({selectedCustomer.email})? This action cannot be undone.
            </p>
            <div className="flex justify-end mt-6 gap-2">
              <motion.button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCustomer(null);
                }}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={handleDeleteCustomer}
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

      {/* View Customer Modal */}
      {selectedCustomer && !showVerifyModal && !showDeleteModal && (
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
              Customer Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  {selectedCustomer.profileImage ? (
                    <img
                      src={selectedCustomer.profileImage}
                      alt={selectedCustomer.customerName}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-medium text-black">
                      {selectedCustomer.customerName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="ml-4">
                  <div className="text-lg font-medium text-white font-sans">{selectedCustomer.customerName}</div>
                  <div className="text-sm text-yellow-400/70 font-sans">{selectedCustomer.email}</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">ID</label>
                <p className="text-sm text-white font-sans">{selectedCustomer.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">Email</label>
                <p className="text-sm text-white font-sans">{selectedCustomer.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">Address</label>
                <p className="text-sm text-white font-sans">{selectedCustomer.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">Mobile</label>
                <p className="text-sm text-white font-sans">{selectedCustomer.mobile}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">Status</label>
                <p className="text-sm text-white font-sans">{selectedCustomer.status}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <motion.button
                type="button"
                onClick={() => setSelectedCustomer(null)}
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

export default AdminCustomer;