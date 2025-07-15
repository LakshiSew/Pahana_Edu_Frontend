import { useState, useEffect } from "react";
import { SearchIcon, EyeIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const CustomerHelp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    const fetchHelpRequests = async () => {
      try {
        const response = await axios.get("http://localhost:8080/auth/getall");
        const mappedRequests = response.data.map((req) => ({
          id: req.id,
          customerName: req.fullName,
          email: req.email,
          message: req.message,
          status: req.reply ? "Sent" : "Pending",
        }));
        setHelpRequests(mappedRequests);
      } catch (err) {
        toast.error("Failed to fetch help requests: " + (err.response?.data?.message || err.message), {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchHelpRequests();
  }, []);

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error("Reply message cannot be empty", { position: "top-right", autoClose: 3000 });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to send a reply");
      }

      await axios.post(
        `http://localhost:8080/help/${selectedRequest.id}`,
        { reply: replyMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      setHelpRequests(
        helpRequests.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: "Sent" } : req
        )
      );
      setShowReplyModal(false);
      setSelectedRequest(null);
      setReplyMessage("");
      toast.success("Reply sent successfully!", { position: "top-right", autoClose: 3000 });
    } catch (err) {
      toast.error("Failed to send reply: " + (err.response?.data?.message || err.message), {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const filteredRequests = helpRequests.filter((request) =>
    (request.customerName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (request.id?.toString().toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (request.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (request.message?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-400/20 text-yellow-400";
      case "Sent":
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
          Customer Help
        </h1>
        <p className="text-yellow-400/70 font-sans">
          Manage and respond to customer help requests
        </p>
      </header>

      <main className="flex-1 p-6 z-[2]">
        <div className="bg-black/70 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/50 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search help requests..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-yellow-400/50 rounded-lg w-full text-white placeholder-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <motion.div
          className="bg-black/70 backdrop-blur-xl rounded-xl border border-yellow-400/50 shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-4 border-b border-yellow-400/30">
            <h2 className="text-xl font-bold text-white font-sans bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              All Help Requests
            </h2>
          </div>
          <div className="overflow-x-auto">
            {filteredRequests.length === 0 ? (
              <div className="p-8 text-center text-white font-sans">
                No help requests found.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-yellow-400/30">
                <thead className="bg-black/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider font-sans">
                      Customer Message
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
                  {filteredRequests.map((request, index) => (
                    <motion.tr
                      key={request.id}
                      className="hover:bg-yellow-400/10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white font-sans">
                        {request.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {request.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {request.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {request.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex gap-2 justify-end">
                          <motion.button
                            className="text-blue-400 hover:text-blue-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowReplyModal(true);
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

      {showReplyModal && selectedRequest && (
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
              Respond to Help Request
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Customer Name
                </label>
                <p className="text-sm text-white font-sans">
                  {selectedRequest.customerName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Email
                </label>
                <p className="text-sm text-white font-sans">
                  {selectedRequest.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Customer Message
                </label>
                <p className="text-sm text-white font-sans">
                  {selectedRequest.message}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Reply
                </label>
                <textarea
                  className="w-full p-2 bg-white/10 border border-yellow-400/50 rounded-lg text-white font-sans focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Status
                </label>
                <p className="text-sm text-white font-sans">
                  {selectedRequest.status}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <motion.button
                type="button"
                onClick={() => {
                  setShowReplyModal(false);
                  setSelectedRequest(null);
                  setReplyMessage("");
                }}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              {selectedRequest.status === "Pending" && (
                <motion.button
                  type="button"
                  onClick={handleSendReply}
                  className="px-4 py-2 bg-green-400 text-black rounded-lg font-sans font-semibold hover:bg-green-500 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!replyMessage.trim()}
                >
                  Send Reply
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CustomerHelp;