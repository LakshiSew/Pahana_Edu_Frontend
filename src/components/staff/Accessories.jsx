import { useState, useEffect } from "react";
import {
  SearchIcon,
  EyeIcon,
  PackageIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Accessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base URL for API requests
  const API_BASE_URL = "http://localhost:8080/auth";

  // Fetch accessories and accessory categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fetch accessories
        const accessoriesResponse = await axios.get(
          `${API_BASE_URL}/getallaccessories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Fetch accessory categories
        const categoriesResponse = await axios.get(
          `${API_BASE_URL}/getaccessorycategories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setAccessories(accessoriesResponse.data);
        setCategories(categoriesResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        setLoading(false);
        toast.error(err.message || "Failed to fetch data", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchData();
  }, []);

  // Handle category filter change
  const handleCategoryFilterChange = async (e) => {
    const selectedCategoryId = e.target.value;
    setCategoryFilter(selectedCategoryId);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        selectedCategoryId === "all"
          ? `${API_BASE_URL}/getallaccessories`
          : `${API_BASE_URL}/getaccessoriesbycategoryid/${selectedCategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAccessories(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to fetch accessories by category";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Filter accessories by search term and status
  const filteredAccessories = accessories.filter(
    (acc) =>
      acc.itemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" ||
        acc.status.toLowerCase() === statusFilter.toLowerCase())
  );

  // Stats for dashboard
  const stats = [
    {
      id: "Total",
      name: "Total Items",
      count: accessories.length,
      icon: <PackageIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-yellow-500",
      bgTo: "to-amber-600",
    },
    {
      id: "InStock",
      name: "Items In Stock",
      count: accessories.filter((acc) => acc.stockQty > 0).length,
      icon: <PackageIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-green-400",
      bgTo: "to-emerald-600",
    },
    {
      id: "OutOfStock",
      name: "Out of Stock",
      count: accessories.filter((acc) => acc.stockQty === 0).length,
      icon: <PackageIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-red-400",
      bgTo: "to-red-600",
    },
    {
      id: "Active",
      name: "Active Items",
      count: accessories.filter((acc) => acc.status === "Active").length,
      icon: <CheckIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-blue-400",
      bgTo: "to-blue-600",
    },
    {
      id: "Inactive",
      name: "Inactive Items",
      count: accessories.filter((acc) => acc.status === "Inactive").length,
      icon: <XIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-gray-400",
      bgTo: "to-gray-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 font-sans">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 font-sans">
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


      <header className="bg-black/70 backdrop-blur-xl border-b border-yellow-400/30 p-4 flex justify-between items-center z-[2]">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
            Book Accessories
          </h1>
          <p className="text-yellow-400/70 font-sans">
             View All Accessories
          </p>
        </div>
      </header>

      <main className="flex-1 p-6 z-[2]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
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

        <div className="bg-black/70 backdrop-blur-xl rounded-xl border border-yellow-400/50 p-4 mb-6 flex flex-wrap justify-between items-center">
          <div className="relative w-full md:w-96">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search accessories..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-yellow-400/50 rounded-lg w-full text-white placeholder-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <select
              className="bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              className="bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
              value={categoryFilter}
              onChange={handleCategoryFilterChange}
            >
              <option value="all" className="text-black" >All Categories</option>
              {categories.map((category) => (
                <option className="text-black" key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <motion.div
          className="bg-black/70 backdrop-blur-xl rounded-xl border border-yellow-400/50 shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="overflow-x-auto">
            {filteredAccessories.length === 0 ? (
              <div className="p-8 text-center text-white font-sans">
                No accessories found.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-yellow-400/30 table-fixed">
                <thead className="bg-black/50">
                  <tr>
                    <th className="w-16 px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      S.No
                    </th>
                    <th className="w-80 px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Item
                    </th>
                    <th className="w-32 px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Brand
                    </th>
                    <th className="w-32 px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Price (LKR)
                    </th>
                    <th className="w-24 px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Stock Qty
                    </th>
                    <th className="w-24 px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Discount
                    </th>
                    <th className="w-24 px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Status
                    </th>
                    <th className="w-32 px-6 py-3 text-right text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-400/30">
                  {filteredAccessories.map((acc, index) => (
                    <motion.tr
                      key={acc.id}
                      className="hover:bg-yellow-400/10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                            {acc.image ? (
                              <img
                                src={acc.image}
                                alt={acc.itemName}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-medium text-black">
                                {acc.itemName.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="ml-4 max-w-[220px]">
                            <div className="text-sm font-medium text-white font-sans truncate">
                              {acc.itemName}
                            </div>
                            <div className="text-sm text-yellow-300 font-sans truncate">
                              {categories.find(
                                (cat) => cat.categoryId === acc.categoryId
                              )?.categoryName || "Unknown"}
                            </div>
                            <div className="text-sm text-yellow-400/70 font-sans line-clamp-2">
                              {acc.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans truncate">
                        {acc.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        LKR {acc.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {acc.stockQty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {acc.discount ? `${acc.discount.toFixed(2)}%` : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-sans">
                        {acc.status === "Active" ? (
                          <CheckIcon className="h-5 w-5 text-green-400" />
                        ) : (
                          <XIcon className="h-5 w-5 text-red-400" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex gap-2 justify-end">
                          <motion.button
                            onClick={() => setSelectedAccessory(acc)}
                            className="text-blue-400 hover:text-blue-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <EyeIcon className="h-5 w-5" />
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

      {selectedAccessory && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-md border border-yellow-400/50 max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
              Accessory Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  {selectedAccessory.image ? (
                    <img
                      src={selectedAccessory.image}
                      alt={selectedAccessory.itemName}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-medium text-black">
                      {selectedAccessory.itemName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="ml-4">
                  <div className="text-lg font-medium text-white font-sans">
                    {selectedAccessory.itemName}
                  </div>
                  <div className="text-sm text-yellow-300 font-sans">
                    {categories.find(
                      (cat) => cat.categoryId === selectedAccessory.categoryId
                    )?.categoryName || "Unknown"}
                  </div>
                  <div className="text-sm text-yellow-400/70 font-sans">
                    by {selectedAccessory.brand}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Brand
                </label>
                <p className="text-sm text-white font-sans">
                  {selectedAccessory.brand}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Price
                </label>
                <p className="text-sm text-white font-sans">
                  LKR {selectedAccessory.price.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Stock Quantity
                </label>
                <p className="text-sm text-white font-sans">
                  {selectedAccessory.stockQty}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Discount
                </label>
                <p className="text-sm text-white font-sans">
                  {selectedAccessory.discount
                    ? `${selectedAccessory.discount.toFixed(2)}%`
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Description
                </label>
                <p className="text-sm text-white font-sans">
                  {selectedAccessory.description || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Status
                </label>
                <p className="text-sm text-white font-sans">
                  {selectedAccessory.status}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Created At
                </label>
                <p className="text-sm text-white font-sans">
                  {new Date(selectedAccessory.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Updated At
                </label>
                <p className="text-sm text-white font-sans">
                  {new Date(selectedAccessory.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <motion.button
                type="button"
                onClick={() => setSelectedAccessory(null)}
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


export default Accessories;