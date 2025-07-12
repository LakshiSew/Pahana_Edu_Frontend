import { useState, useEffect } from "react";
import { SearchIcon, EyeIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ManageSuggestions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // New state for status filter
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const API_URL = "http://localhost:8080";

  // Fetch suggestions from backend
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(`${API_URL}/getsuggestions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Map backend fields to frontend, including serial number and backend ID
        const mappedSuggestions = response.data.map((suggestion, index) => ({
          id: suggestion.id, // Store backend ID
          serial: index + 1, // Add serial number for display
          name: suggestion.name,
          email: suggestion.email,
          bookTitle: suggestion.bookTitle,
          authorName: suggestion.authorName,
          status: suggestion.status,
        }));

        setSuggestions(mappedSuggestions);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch suggestions");
        setLoading(false);
        toast.error(err.message || "Failed to fetch suggestions", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchSuggestions();
  }, []);

  // Handle marking suggestion as read
  const handleMarkAsDone = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        `${API_URL}/marksuggestion/${selectedSuggestion.id}`, // Use backend ID
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuggestions(
        suggestions.map((s) =>
          s.id === selectedSuggestion.id
            ? { ...s, status: response.data.status }
            : s
        )
      );
      setShowDetailsModal(false);
      setSelectedSuggestion(null);
      toast.success("Suggestion mark as read successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      const errorMessage = err.response?.status === 404 ? "Suggestion not found" : "Failed to mark suggestion as read";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Filter suggestions by search term and status
  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      ((suggestion.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (suggestion.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (suggestion.bookTitle?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (suggestion.authorName?.toLowerCase() || "").includes(searchTerm.toLowerCase())) &&
      (statusFilter === "All" || suggestion.status === statusFilter)
  );

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
          Customer Book Suggestions
        </h1>
        <p className="text-yellow-400/70 font-sans">
          Manage and add suggested books to the store
        </p>
      </header>

      <main className="flex-1 p-6 z-[2]">
        <motion.div
          className="bg-black/70 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/50 mb-6 flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search suggestions..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-yellow-400/50 rounded-lg w-full text-white placeholder-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-40">
            <select
              className="pr-4 py-2 bg-white/10 border border-yellow-400/50 rounded-lg w-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All" className="bg-black text-white">All</option>
              <option value="PENDING" className="bg-black text-white">Pending</option>
              <option value="MARK_AS_READ" className="bg-black text-white">Mark as Read</option>
            </select>
          </div>
        </motion.div>

        <motion.div
          className="bg-black/70 backdrop-blur-xl rounded-xl border border-yellow-400/50 shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-4 border-b border-yellow-400/30">
            <h2 className="text-xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              All Book Suggestions
            </h2>
          </div>
          <div>
            {filteredSuggestions.length === 0 ? (
              <div className="p-8 text-center text-white font-sans">
                No suggestions found.
              </div>
            ) : (
              <table className="w-full table-auto">
                <thead className="bg-black/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans max-w-xs">
                      Book Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans max-w-xs">
                      Author Name
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
                  {filteredSuggestions.map((suggestion, index) => (
                    <motion.tr
                      key={suggestion.id}
                      className="hover:bg-yellow-400/10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-white font-sans">
                        {suggestion.serial}
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-sans">
                        {suggestion.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-sans">
                        {suggestion.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-sans whitespace-normal break-words max-w-xs">
                        {suggestion.bookTitle}
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-sans whitespace-normal break-words max-w-xs">
                        {suggestion.authorName}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
                            suggestion.status
                          )}`}
                        >
                          {suggestion.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <motion.button
                            className="text-blue-400 hover:text-blue-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedSuggestion(suggestion);
                              setShowDetailsModal(true);
                            }}
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

      {/* View Suggestion Details Modal */}
      {showDetailsModal && selectedSuggestion && (
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
              Suggestion Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Serial No.
                </label>
                <p className="text-sm text-white font-sans">
                  {selectedSuggestion.serial}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Name
                </label>
                <p className="text-sm text-white font-sans">
                  {selectedSuggestion.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Email
                </label>
                <p className="text-sm text-white font-sans">
                  {selectedSuggestion.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Book Title
                </label>
                <p className="text-sm text-white font-sans">
                  {selectedSuggestion.bookTitle}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Author Name
                </label>
                <p className="text-sm text-white font-sans">
                  {selectedSuggestion.authorName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Status
                </label>
                <p className="text-sm text-white font-sans">
                  {selectedSuggestion.status}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <motion.button
                type="button"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedSuggestion(null);
                }}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
              {selectedSuggestion.status === "PENDING" && (
                <motion.button
                  type="button"
                  onClick={handleMarkAsDone}
                  className="px-4 py-2 bg-green-400 text-black rounded-lg font-sans font-semibold hover:bg-green-500 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Mark as Read
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManageSuggestions;