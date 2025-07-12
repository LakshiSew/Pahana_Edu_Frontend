import { useState } from "react";
import {
  SearchIcon,
  EyeIcon,
  PackageIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Accessories = () => {
  const [accessories, setAccessories] = useState([
    { id: "1", ItemName: "Headphones", CategoryId: "1", Brand: "Sony", Price: 99.99, StockQty: 50, Image: null, Description: "High-quality audio headphones", Status: "available", createdAt: "2025-06-15", updatedAt: "2025-06-20" },
    { id: "2", ItemName: "Mouse", CategoryId: "2", Brand: "Logitech", Price: 29.99, StockQty: 0, Image: null, Description: "Ergonomic wireless mouse", Status: "out of stock", createdAt: "2025-06-10", updatedAt: "2025-06-18" },
    { id: "3", ItemName: "Keyboard", CategoryId: "2", Brand: "Dell", Price: 59.99, StockQty: 30, Image: null, Description: "Mechanical gaming keyboard", Status: "available", createdAt: "2025-06-12", updatedAt: "2025-06-19" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAccessory, setSelectedAccessory] = useState(null);

  // Filter accessories by search term and status
  const filteredAccessories = accessories.filter((acc) =>
    acc.ItemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === "all" || acc.Status.toLowerCase() === statusFilter)
  );

  // Stats for dashboard
  const stats = [
    {
      id: "Total",
      name: "Total Items",
      count: accessories.length,
      change: "+5%",
      icon: <PackageIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-indigo-500",
      bgTo: "to-violet-600",
    },
    {
      id: "InStock",
      name: "Items In Stock",
      count: accessories.filter((acc) => acc.Status === "available").length,
      change: "+3%",
      icon: <PackageIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-green-400",
      bgTo: "to-emerald-600",
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-white flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Toast Container */}
      <ToastContainer />

      {/* Background Shapes */}
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

      {/* Header */}
      <header className="bg-black/70 backdrop-blur-xl border-b border-yellow-400/30 p-4 flex justify-between items-center z-[2]">
        <div>
          <h1 className="text-2xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-600">
            View Accessory Products
          </h1>
          <p className="text-white/70 font-sans">Browse and Monitor Accessory Products</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 z-[2]">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ml-80">
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
                  <p className="text-sm font-medium text-white font-sans">{stat.name}</p>
                  <h3 className="text-2xl font-bold mt-1 font-sans">{stat.count}</h3>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Accessory Table */}
        <motion.div
          className="bg-black/70 backdrop-blur-xl rounded-xl border border-yellow-400/50 shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Search and Filter Bar */}
          <div className="p-4 border-b border-yellow-400/30 flex justify-between items-center">
            <div className="relative w-full md:w-96">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
              <input
                type="text"
                placeholder="Search accessories..."
                className="pl-10 pr-4 py-2 bg-white/10 border border-yellow-400/50 rounded-lg w-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ml-4">
              <select
                className="bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="available">In Stock</option>
                <option value="out of stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Accessory Table */}
          <div className="overflow-x-auto">
            {filteredAccessories.length === 0 ? (
              <div className="p-8 text-center text-white font-sans">
                No accessories found.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-yellow-400/30">
                <thead className="bg-gradient-to-br from-indigo-500 to-violet-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Stock Qty
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-400/30">
                  {filteredAccessories.map((acc, index) => (
                    <motion.tr
                      key={acc.id}
                      className="hover:bg-indigo-500/10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                            {acc.Image ? (
                              <img
                                src={acc.Image}
                                alt={acc.ItemName}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-medium text-white">
                                {acc.ItemName.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white font-sans">{acc.ItemName}</div>
                            <div className="text-sm text-white/70 font-sans">{acc.Description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {acc.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {acc.Brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        ${acc.Price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {acc.StockQty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex gap-2 justify-end">
                          <motion.button
                            onClick={() => setSelectedAccessory(acc)}
                            className="text-green-400 hover:text-green-500 transition-colors"
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

      {/* View Accessory Modal */}
      {selectedAccessory && (
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
            <h2 className="text-xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-600 mb-4">
              Accessory Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  {selectedAccessory.Image ? (
                    <img
                      src={selectedAccessory.Image}
                      alt={selectedAccessory.ItemName}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-medium text-white">
                      {selectedAccessory.ItemName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="ml-4">
                  <div className="text-lg font-medium text-white font-sans">{selectedAccessory.ItemName}</div>
                  <div className="text-sm text-white/70 font-sans">by {selectedAccessory.Brand}</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 font-sans">ID</label>
                <p className="text-sm text-white font-sans">{selectedAccessory.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 font-sans">Brand</label>
                <p className="text-sm text-white font-sans">{selectedAccessory.Brand}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 font-sans">Price</label>
                <p className="text-sm text-white font-sans">${selectedAccessory.Price}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 font-sans">Stock Quantity</label>
                <p className="text-sm text-white font-sans">{selectedAccessory.StockQty}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 font-sans">Description</label>
                <p className="text-sm text-white font-sans">{selectedAccessory.Description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 font-sans">Status</label>
                <p className="text-sm text-white font-sans">{selectedAccessory.Status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 font-sans">Created At</label>
                <p className="text-sm text-white font-sans">{selectedAccessory.createdAt}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 font-sans">Updated At</label>
                <p className="text-sm text-white font-sans">{selectedAccessory.updatedAt}</p>
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