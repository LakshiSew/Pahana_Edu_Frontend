import { useState, useEffect } from "react";
import {
  SearchIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
  CheckCircleIcon,
  XCircleIcon,
  FileTextIcon,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [billContent, setBillContent] = useState(null);
  const [billOrderId, setBillOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const ordersResponse = await axios.get(
          "http://localhost:8080/allorders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setOrders(ordersResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch orders");
        setLoading(false);
        toast.error(err.message || "Failed to fetch orders", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchData();
  }, []);

  // Fetch bill when billOrderId changes
  useEffect(() => {
    if (billOrderId) {
      const fetchBill = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No authentication token found");

          const response = await axios.get(
            `http://localhost:8080/generatebill/${billOrderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          setBillContent(response.data);
        } catch (err) {
          toast.error("Failed to load bill", {
            position: "top-right",
            autoClose: 3000,
          });
          setShowBillModal(false);
          setBillOrderId(null);
        }
      };

      fetchBill();
    }

    // Cleanup
    return () => {
      setBillContent(null);
    };
  }, [billOrderId]);

  // Handle updating an order status
  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.put(
        `http://localhost:8080/update-status/${selectedOrder.id}?status=${selectedOrder.status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id ? response.data : order
        )
      );
      setShowUpdateModal(false);
      setSelectedOrder(null);
      toast.success("Order updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.response?.data || "Failed to update order", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handle deleting an order
  const handleDeleteOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.delete(`http://localhost:8080/delete/${selectedOrder.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setOrders(orders.filter((order) => order.id !== selectedOrder.id));
      setShowDeleteModal(false);
      setSelectedOrder(null);
      toast.success("Order deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.response?.data || "Failed to delete order", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.customerName?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (order.id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (order.customerEmail?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats for dashboard
  const stats = [
    {
      id: "Total",
      name: "Total Orders",
      count: orders.length,
      change: "+0%",
      icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-yellow-500",
      bgTo: "to-amber-600",
    },
    {
      id: "Pending",
      name: "Pending",
      count: orders.filter((o) => o.status === "Pending").length,
      change: "+0%",
      icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-green-400",
      bgTo: "to-emerald-600",
    },
    {
      id: "Confirmed",
      name: "Confirmed",
      count: orders.filter((o) => o.status === "Confirmed").length,
      change: "0%",
      icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-blue-400",
      bgTo: "to-blue-600",
    },
    {
      id: "Canceled",
      name: "Canceled",
      count: orders.filter((o) => o.status === "Canceled").length,
      change: "0%",
      icon: <XCircleIcon className="h-6 w-6 text-white" />,
      bgFrom: "from-red-500",
      bgTo: "to-rose-600",
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
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
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
            Manage Orders
          </h1>
          <p className="text-yellow-400/70 font-sans">
            Oversee and Administer Orders
          </p>
        </div>
      </header>

      <main className="flex-1 p-6 z-[2]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className={`bg-gradient-to-br ${stat.bgFrom} ${stat.bgTo} p-5 rounded-xl text-white shadow-lg border border-yellow-400/50`}
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
            </div>
          ))}
        </div>

        <div className="bg-black/70 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/50 mb-6">
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search orders by ID, customer, or email..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-yellow-400/50 rounded-lg w-full text-white placeholder-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-black/70 backdrop-blur-xl rounded-xl border border-yellow-400/50 shadow-lg">
          <div className="p-4 border-b border-yellow-400/30 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white font-sans">
              Orders
            </h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/10 border border-yellow-400/50 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-white font-sans">
                No orders found.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-yellow-400/30">
                <thead className="bg-black/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Order Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Total Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider font-sans">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-400/30">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-yellow-400/10">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white font-sans">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {order.customerEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-sans">
                        ${order.totalPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "Pending"
                              ? "bg-yellow-400/20 text-yellow-400"
                              : order.status === "Confirmed"
                              ? "bg-green-400/20 text-green-400"
                              : "bg-red-400/20 text-red-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowViewModal(true);
                            }}
                            className="bg-gradient-to-br from-green-400 to-emerald-600 text-white px-2 py-1 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowUpdateModal(true);
                            }}
                            className="bg-gradient-to-br from-cyan-500 to-sky-600 text-white px-2 py-1 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <EditIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDeleteModal(true);
                            }}
                            className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-2 py-1 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <Trash2Icon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setBillOrderId(order.id);
                              setShowBillModal(true);
                            }}
                            className="bg-gradient-to-br from-blue-400 to-blue-600 text-white px-2 py-1 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <FileTextIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {selectedOrder && showViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/70 backdrop-blur-xl rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-yellow-400/50">
            <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-600 p-8 text-white">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedOrder(null);
                }}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <XCircleIcon className="h-7 w-7" />
              </button>
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="h-28 w-28 rounded-full bg-yellow-400/20 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                    {selectedOrder.id.charAt(0)}
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl font-semibold text-white font-sans">
                    Order #{selectedOrder.id}
                  </h2>
                  <p className="text-xl font-medium mt-1 text-white/80 font-sans">
                    {selectedOrder.customerName}
                  </p>
                  <p className="text-sm font-medium mt-2 bg-black/50 inline-block px-3 py-1 rounded-full">
                    ${selectedOrder.totalPrice} - {selectedOrder.status}
                  </p>
                  <button
                    onClick={() => {
                      setBillOrderId(selectedOrder.id);
                      setShowBillModal(true);
                    }}
                    className="mt-2 inline-block bg-gradient-to-br from-blue-400 to-blue-600 text-white px-3 py-1 rounded-lg hover:opacity-90 transition-opacity font-sans"
                  >
                    View Bill
                  </button>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6 bg-black/50 p-6 rounded-lg border border-yellow-400/50">
                  <h3 className="text-2xl font-semibold text-yellow-400 font-sans border-b border-yellow-400/30 pb-3">
                    Order Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Order ID:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {selectedOrder.id}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Customer Name:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {selectedOrder.customerName}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Email:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {selectedOrder.customerEmail}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Address:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {selectedOrder.address || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Order Date:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {new Date(selectedOrder.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Total Price:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        ${selectedOrder.totalPrice}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Status:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {selectedOrder.status}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Products:
                      </span>
                      <p className="text-md font-semibold text-white font-sans">
                        {selectedOrder.productIds?.join(", ") || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-yellow-400 w-28 font-sans">
                        Bill:
                      </span>
                      <button
                        onClick={() => {
                          setBillOrderId(selectedOrder.id);
                          setShowBillModal(true);
                        }}
                        className="text-md font-semibold text-blue-400 hover:underline font-sans"
                      >
                        View Bill
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto border border-yellow-400/50">
            <h2 className="text-xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
              Update Order Status
            </h2>
            <form onSubmit={handleUpdateOrder}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-yellow-400 font-sans">
                  Status
                </label>
                <select
                  className="mt-1 block w-full bg-white/10 border border-yellow-400/50 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans"
                  value={selectedOrder.status}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      status: e.target.value,
                    })
                  }
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-sans font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedOrder && showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-sm border border-yellow-400/50">
            <h2 className="text-xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
              Delete Order
            </h2>
            <p className="text-sm text-white font-sans mb-6">
              Are you sure you want to delete Order{" "}
              <span className="font-semibold">#{selectedOrder.id}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-sans"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteOrder}
                className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg font-sans font-semibold hover:opacity-90 transition-opacity"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showBillModal && billContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-yellow-400/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                Bill Preview
              </h2>
              <button
                onClick={() => {
                  setShowBillModal(false);
                  setBillOrderId(null);
                  setBillContent(null);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <XCircleIcon className="h-7 w-7" />
              </button>
            </div>
            <div className="w-full bg-white/10 p-4 rounded-lg">
              <pre className="text-white font-sans whitespace-pre-wrap">
                {billContent}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
