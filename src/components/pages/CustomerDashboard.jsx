// import React, { useState, useEffect } from "react";
// import { User, Edit, ShoppingBag, Download, Upload, LogOut, Printer } from "lucide-react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";

// const CustomerDashboard = () => {
//   const [activeTab, setActiveTab] = useState("details");
//   const [profileImage, setProfileImage] = useState(null);
//   const [customer, setCustomer] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [formData, setFormData] = useState({
//     customerName: "",
//     customerEmail: "",
//     customerPhone: "",
//     address: "",
//   });
//   const [billContent, setBillContent] = useState(null);
//   const [showBillModal, setShowBillModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [billLoading, setBillLoading] = useState(false); // Added for bill fetching UX

//   const navigate = useNavigate();
//   const customerId = localStorage.getItem("userId");
//   const token = localStorage.getItem("token");

//   console.log("Token:", token);
//   console.log("userId:", customerId);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (!token || !customerId) {
//           throw new Error("Not authenticated: token or customerId missing");
//         }

//         console.log("Fetching customer data for ID:", customerId);
//         const customerResponse = await axios.get(`http://localhost:8080/auth/getcustomerbyid/${customerId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log("Customer response:", customerResponse.data);
//         setCustomer(customerResponse.data);
//         setProfileImage(customerResponse.data.profileImage);
//         setFormData({
//           customerName: customerResponse.data.customerName || "",
//           customerEmail: customerResponse.data.customerEmail || "",
//           customerPhone: customerResponse.data.customerPhone || "",
//           address: customerResponse.data.address || "",
//         });

//         console.log("Fetching orders for customer ID:", customerId);
//         const ordersResponse = await axios.get(`http://localhost:8080/getordersbycustomerid/${customerId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log("Orders response:", ordersResponse.data);
//         setOrders(ordersResponse.data);

//         setLoading(false);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.response?.status === 401 ? "Session expired. Please log in again." : err.message || "Failed to fetch data");
//         setLoading(false);
//         if (err.response?.status === 401) {
//           localStorage.removeItem("token");
//           localStorage.removeItem("userId");
//           toast.error("Session expired. Redirecting to login...", { position: "top-right", autoClose: 3000 });
//           setTimeout(() => navigate("/login"), 3000);
//         } else {
//           toast.error(err.response?.data || "Failed to fetch data", { position: "top-right", autoClose: 3000 });
//         }
//       }
//     };

//     fetchData();
//   }, [customerId, token, navigate]);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       try {
//         const formData = new FormData();
//         formData.append("image", file);
//         const response = await axios.post(`http://localhost:8080/auth/updateprofileimage/${customerId}`, formData, {
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
//         });
//         setProfileImage(response.data.profileImage);
//         toast.success("Profile image updated!", { position: "top-right", autoClose: 3000 });
//       } catch (err) {
//         console.error("Image upload error:", err);
//         toast.error(err.response?.data || "Failed to upload image", { position: "top-right", autoClose: 3000 });
//       }
//     }
//   };

//   const handleUpdateDetails = async (e) => {
//     e.preventDefault();
//     if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
//       toast.error("Name, email, and phone are required", { position: "top-right", autoClose: 3000 });
//       return;
//     }
//     try {
//       const response = await axios.put(`http://localhost:8080/auth/updatecustomer/${customerId}`, formData, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       });
//       setCustomer(response.data);
//       toast.success("Details updated successfully!", { position: "top-right", autoClose: 3000 });
//     } catch (err) {
//       console.error("Update details error:", err);
//       toast.error(err.response?.data || "Failed to update details", { position: "top-right", autoClose: 3000 });
//     }
//   };

//   const handleViewBill = async (orderId) => {
//     try {
//       setBillLoading(true);
//       console.log("Fetching bill for order ID:", orderId);
//       const response = await axios.get(`http://localhost:8080/viewbill/${orderId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("Bill response:", response.data);
//       setBillContent(response.data);
//       setShowBillModal(true);
//     } catch (err) {
//       console.error("View bill error:", err);
//       toast.error(err.response?.data || "Failed to load bill", { position: "top-right", autoClose: 3000 });
//     } finally {
//       setBillLoading(false);
//     }
//   };

//   const handleDownloadBill = async (orderId) => {
//     try {
//       console.log("Downloading PDF bill for order ID:", orderId);
//       const response = await axios.get(`http://localhost:8080/generatebillpdf/${orderId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         responseType: "blob",
//       });
//       const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `bill_${orderId}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//       toast.success("Bill downloaded!", { position: "top-right", autoClose: 3000 });
//     } catch (err) {
//       console.error("Download bill error:", err);
//       toast.error(err.response?.data || "Failed to download bill", { position: "top-right", autoClose: 3000 });
//     }
//   };

//   const handlePrintBill = () => {
//     window.print();
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userId");
//     navigate("/login");
//   };

//   // Format price as Rs. with 2 decimal places
//   const formatPrice = (price) => {
//     const numPrice = parseFloat(price);
//     return isNaN(numPrice) ? "N/A" : `Rs. ${numPrice.toFixed(2)}`;
//   };

//   if (loading) {
//     return <div className="flex items-center justify-center h-screen text-gray-600 font-sans">Loading...</div>;
//   }

//   if (error || !customer) {
//     return <div className="flex items-center justify-center h-screen text-red-600 font-sans">{error || "No customer data found"}</div>;
//   }

//   return (
//     <div className="min-h-screen flex font-sans bg-gradient-to-br from-gray-100 to-gray-200 py-3 px-6">
//       <ToastContainer />
//       <aside className="w-64 bg-gradient-to-b from-yellow-400 to-yellow-600 text-white shadow-2xl flex flex-col items-center p-6 space-y-6 rounded-r-2xl">
//         <div className="relative w-32 h-32">
//           <img
//             src={profileImage || "https://via.placeholder.com/150?text=Customer"}
//             alt="Customer"
//             className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
//           />
//           <label
//             htmlFor="upload"
//             className="absolute bottom-0 right-0 bg-blue-800 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all"
//           >
//             <Upload className="w-5 h-5 text-white" />
//           </label>
//           <input
//             type="file"
//             id="upload"
//             className="hidden"
//             onChange={handleImageUpload}
//             accept="image/*"
//           />
//         </div>
//         <nav className="w-full flex-1 space-y-4 mt-8">
//           {[
//             { id: "details", label: "Your Details", icon: <User className="w-5 h-5" /> },
//             { id: "update", label: "Update Account", icon: <Edit className="w-5 h-5" /> },
//             { id: "orders", label: "Orders", icon: <ShoppingBag className="w-5 h-5" /> },
//             { id: "bills", label: "Download Bills", icon: <Download className="w-5 h-5" /> },
//           ].map((item) => (
//             <button
//               key={item.id}
//               onClick={() => setActiveTab(item.id)}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition-all ${
//                 activeTab === item.id
//                   ? "bg-white text-yellow-600 font-semibold shadow-md"
//                   : "hover:bg-white/20"
//               }`}
//             >
//               {item.icon}
//               {item.label}
//             </button>
//           ))}
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-3 bg-white text-yellow-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all"
//           >
//             <LogOut className="w-5 h-5" />
//             Logout
//           </button>
//         </nav>
//       </aside>
//       <main className="flex-1 flex items-start justify-center p-6 overflow-auto">
//         <div className="w-full max-w-5xl space-y-8">
//           {activeTab === "details" && (
//             <section className="bg-gradient-to-r from-yellow-400/20 to-blue-400/20 p-8 rounded-xl shadow-lg">
//               <h2 className="text-4xl font-bold mb-4 text-gray-800 flex items-center gap-2">
//                 <User className="w-8 h-8 text-yellow-600" /> Your Details
//               </h2>
//               <p className="text-lg text-gray-600 mb-6">
//                 Welcome back, {customer.customerName}! Manage your account and explore your orders with ease.
//               </p>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 text-xl">
//                 <div className="flex items-center gap-3">
//                   <span className="font-semibold text-yellow-600">Name:</span>
//                   <p>{customer.customerName}</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="font-semibold text-yellow-600">Email:</span>
//                   <p>{customer.customerEmail}</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="font-semibold text-yellow-600">Phone:</span>
//                   <p>{customer.customerPhone}</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="font-semibold text-yellow-600">Address:</span>
//                   <p>{customer.address || "N/A"}</p>
//                 </div>
//               </div>
//             </section>
//           )}
//           {activeTab === "update" && (
//             <section className="bg-white p-8 rounded-xl shadow-lg">
//               <h2 className="text-4xl font-bold mb-4 text-gray-800 flex items-center gap-2">
//                 <Edit className="w-8 h-8 text-yellow-600" /> Update Your Account
//               </h2>
//               <form onSubmit={handleUpdateDetails} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                   <input
//                     type="text"
//                     value={formData.customerName}
//                     onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
//                     className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <input
//                     type="email"
//                     value={formData.customerEmail}
//                     onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
//                     className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone</label>
//                   <input
//                     type="text"
//                     value={formData.customerPhone}
//                     onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
//                     className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Address</label>
//                   <input
//                     type="text"
//                     value={formData.address}
//                     onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                     className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                   />
//                 </div>
//                 <div className="md:col-span-2 flex justify-end">
//                   <button
//                     type="submit"
//                     className="bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all font-semibold"
//                   >
//                     Update Details
//                   </button>
//                 </div>
//               </form>
//             </section>
//           )}
//           {activeTab === "orders" && (
//             <section className="bg-white p-8 rounded-xl shadow-lg">
//               <h2 className="text-4xl font-bold mb-4 text-gray-800 flex items-center gap-2">
//                 <ShoppingBag className="w-8 h-8 text-yellow-600" /> Your Orders
//               </h2>
//               {orders.length === 0 ? (
//                 <p className="text-gray-600 text-lg">You have no orders yet.</p>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {orders.map((order) => (
//                         <tr key={order.id}>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             {new Date(order.orderDate).toLocaleDateString()}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(order.totalPrice)}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm">
//                             <span
//                               className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                 order.status === "Pending"
//                                   ? "bg-yellow-100 text-yellow-800"
//                                   : order.status === "Confirmed"
//                                   ? "bg-green-100 text-green-800"
//                                   : "bg-red-100 text-red-800"
//                               }`}
//                             >
//                               {order.status}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm">
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={() => handleViewBill(order.id)}
//                                 className="text-blue-600 hover:underline flex items-center gap-1"
//                                 disabled={billLoading}
//                               >
//                                 <Printer className="w-4 h-4" /> View Bill
//                               </button>
//                               <button
//                                 onClick={() => handleDownloadBill(order.id)}
//                                 className="text-blue-600 hover:underline flex items-center gap-1"
//                               >
//                                 <Download className="w-4 h-4" /> Download Bill
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </section>
//           )}
//           {activeTab === "bills" && (
//             <section className="bg-white p-8 rounded-xl shadow-lg">
//               <h2 className="text-4xl font-bold mb-4 text-gray-800 flex items-center gap-2">
//                 <Download className="w-8 h-8 text-yellow-600" /> Download Bills
//               </h2>
//               <p className="text-gray-600 text-lg mb-6">
//                 View or download your billing history for all orders below.
//               </p>
//               {orders.length === 0 ? (
//                 <p className="text-gray-600 text-lg">No bills available.</p>
//               ) : (
//                 <div className="space-y-4">
//                   {orders.map((order) => (
//                     <div key={order.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
//                       <span className="text-gray-800">Order #{order.id} - {new Date(order.orderDate).toLocaleDateString()}</span>
//                       <div className="flex gap-4">
//                         <button
//                           onClick={() => handleViewBill(order.id)}
//                           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
//                           disabled={billLoading}
//                         >
//                           <Printer className="w-4 h-4" /> View Bill
//                         </button>
//                         <button
//                           onClick={() => handleDownloadBill(order.id)}
//                           className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all flex items-center gap-2"
//                         >
//                           <Download className="w-4 h-4" /> Download Bill
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </section>
//           )}
//           {showBillModal && billContent && (
//             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:bg-white">
//               <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg print:shadow-none print:max-w-none print:h-auto bill-modal">
//                 <div className="flex justify-between items-center mb-4 print:hidden">
//                   <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                     <Printer className="w-6 h-6 text-yellow-600" /> Bill for Order #{billContent.orderId}
//                   </h2>
//                   <button
//                     onClick={() => {
//                       setShowBillModal(false);
//                       setBillContent(null);
//                     }}
//                     className="text-gray-600 hover:text-gray-800"
//                   >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//                 <div className="bg-gradient-to-r from-yellow-400/10 to-blue-400/10 p-6 rounded-lg print:bg-white">
//                   <h3 className="text-xl font-semibold text-gray-800 mb-4 print:text-center">Pahana Edu - Order Bill</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <p><strong>Customer:</strong> {billContent.customerName}</p>
//                     <p><strong>Email:</strong> {billContent.customerEmail}</p>
//                     <p><strong>Phone:</strong> {billContent.customerPhone}</p>
//                     <p><strong>Address:</strong> {billContent.address}</p>
//                     <p><strong>Order Date:</strong> {new Date(billContent.orderDate).toLocaleDateString()}</p>
//                     <p><strong>Status:</strong> {billContent.status}</p>
//                   </div>
//                   {billLoading ? (
//                     <p className="text-gray-600 text-center">Loading bill...</p>
//                   ) : (
//                     <table className="min-w-full divide-y divide-gray-200 mb-4">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount (%)</th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Price</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {billContent.products.map((product, index) => (
//                           <tr key={index}>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(product.price)}</td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parseFloat(product.discount).toFixed(2)}</td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(product.finalPrice)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   )}
//                   <div className="text-right">
//                     <p><strong>Total Before Discount:</strong> {formatPrice(billContent.totalPriceBeforeDiscount)}</p>
//                     <p><strong>Total Discount:</strong> {formatPrice(billContent.totalDiscount)}</p>
//                     <p><strong>Final Total:</strong> {formatPrice(billContent.finalTotalPrice)}</p>
//                   </div>
//                   <div className="mt-4 flex justify-end gap-4 print:hidden">
//                     <button
//                       onClick={() => handleDownloadBill(billContent.orderId)}
//                       className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all flex items-center gap-2"
//                     >
//                       <Download className="w-4 h-4" /> Download PDF
//                     </button>
//                     <button
//                       onClick={handlePrintBill}
//                       className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
//                     >
//                       <Printer className="w-4 h-4" /> Print
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//       <style>
//         {`
//           @media print {
//             body * {
//               visibility: hidden;
//             }
//             .print\\:bg-white {
//               background: white !important;
//             }
//             .print\\:shadow-none {
//               box-shadow: none !important;
//             }
//             .print\\:max-w-none {
//               max-width: none !important;
//             }
//             .print\\:h-auto {
//               height: auto !important;
//             }
//             .print\\:hidden {
//               display: none !important;
//             }
//             .fixed, .bg-black\\/50 {
//               position: static !important;
//               background: none !important;
//             }
//             .max-w-4xl, .max-h-\\[90vh\\], .overflow-y-auto {
//               max-width: none !important;
//               max-height: none !important;
//               overflow: visible !important;
//             }
//             .bg-gradient-to-r {
//               background: white !important;
//             }
//             .shadow-lg {
//               box-shadow: none !important;
//             }
//             .text-right {
//               text-align: right !important;
//             }
//             .text-center {
//               text-align: center !important;
//             }
//             .bill-modal, .bill-modal * {
//               visibility: visible;
//             }
//             .bill-modal {
//               position: absolute;
//               top: 0;
//               left: 0;
//               width: 100%;
//               margin: 0;
//               padding: 0;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default CustomerDashboard;



// import React, { useState, useEffect } from "react";
// import { User, Edit, ShoppingBag, Download, Upload, LogOut, Printer } from "lucide-react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";

// const CustomerDashboard = () => {
//   const [activeTab, setActiveTab] = useState("details");
//   const [profileImage, setProfileImage] = useState(null);
//   const [customer, setCustomer] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [formData, setFormData] = useState({
//     customerName: "",
//     customerEmail: "",
//     customerPhone: "",
//     address: "",
//   });
//   const [billContent, setBillContent] = useState(null);
//   const [showBillModal, setShowBillModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [billLoading, setBillLoading] = useState(false);

//   const navigate = useNavigate();
//   const customerId = localStorage.getItem("userId");
//   const token = localStorage.getItem("token");

//   console.log("Token:", token);
//   console.log("userId:", customerId);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (!token || !customerId) {
//           throw new Error("Not authenticated: token or customerId missing");
//         }

//         console.log("Fetching customer data for ID:", customerId);
//         const customerResponse = await axios.get(`http://localhost:8080/auth/getcustomerbyid/${customerId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log("Customer response:", customerResponse.data);
//         setCustomer(customerResponse.data);
//         setProfileImage(customerResponse.data.profileImage);
//         setFormData({
//           customerName: customerResponse.data.customerName || "",
//           customerEmail: customerResponse.data.customerEmail || "",
//           customerPhone: customerResponse.data.customerPhone || "",
//           address: customerResponse.data.address || "",
//         });

//         console.log("Fetching orders for customer ID:", customerId);
//         const ordersResponse = await axios.get(`http://localhost:8080/getordersbycustomerid/${customerId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log("Orders response:", ordersResponse.data);
//         setOrders(ordersResponse.data);

//         setLoading(false);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.response?.status === 401 ? "Session expired. Please log in again." : err.message || "Failed to fetch data");
//         setLoading(false);
//         if (err.response?.status === 401) {
//           localStorage.removeItem("token");
//           localStorage.removeItem("userId");
//           toast.error("Session expired. Redirecting to login...", { position: "top-right", autoClose: 3000 });
//           setTimeout(() => navigate("/login"), 3000);
//         } else {
//           toast.error(err.response?.data || "Failed to fetch data", { position: "top-right", autoClose: 3000 });
//         }
//       }
//     };

//     fetchData();
//   }, [customerId, token, navigate]);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       try {
//         const formData = new FormData();
//         formData.append("image", file);
//         const response = await axios.post(`http://localhost:8080/auth/updateprofileimage/${customerId}`, formData, {
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
//         });
//         setProfileImage(response.data.profileImage);
//         toast.success("Profile image updated!", { position: "top-right", autoClose: 3000 });
//       } catch (err) {
//         console.error("Image upload error:", err);
//         toast.error(err.response?.data || "Failed to upload image", { position: "top-right", autoClose: 3000 });
//       }
//     }
//   };

//   const handleUpdateDetails = async (e) => {
//     e.preventDefault();
//     if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
//       toast.error("Name, email, and phone are required", { position: "top-right", autoClose: 3000 });
//       return;
//     }
//     try {
//       const response = await axios.put(`http://localhost:8080/auth/updatecustomer/${customerId}`, formData, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       });
//       setCustomer(response.data);
//       toast.success("Details updated successfully!", { position: "top-right", autoClose: 3000 });
//     } catch (err) {
//       console.error("Update details error:", err);
//       toast.error(err.response?.data || "Failed to update details", { position: "top-right", autoClose: 3000 });
//     }
//   };

//   const handleViewBill = async (orderId) => {
//     try {
//       setBillLoading(true);
//       console.log("Fetching bill for order ID:", orderId);
//       const response = await axios.get(`http://localhost:8080/viewbill/${orderId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("Bill response:", response.data);
//       setBillContent(response.data);
//       setShowBillModal(true);
//     } catch (err) {
//       console.error("View bill error:", err);
//       toast.error(err.response?.data || "Failed to load bill", { position: "top-right", autoClose: 3000 });
//     } finally {
//       setBillLoading(false);
//     }
//   };

//   const handleDownloadBill = async (orderId) => {
//     try {
//       console.log("Downloading PDF bill for order ID:", orderId);
//       const response = await axios.get(`http://localhost:8080/generatebillpdf/${orderId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         responseType: "blob",
//       });
//       const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `bill_${orderId}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//       toast.success("Bill downloaded!", { position: "top-right", autoClose: 3000 });
//     } catch (err) {
//       console.error("Download bill error:", err);
//       toast.error(err.response?.data || "Failed to download bill", { position: "top-right", autoClose: 3000 });
//     }
//   };

//   const handlePrintBill = () => {
//     window.print();
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userId");
//     navigate("/login");
//   };

//   // Format price as Rs. with 2 decimal places
//   const formatPrice = (price) => {
//     const numPrice = parseFloat(price);
//     return isNaN(numPrice) ? "N/A" : `Rs. ${numPrice.toFixed(2)}`;
//   };

//   if (loading) {
//     return <div className="flex items-center justify-center h-screen text-gray-600 font-sans">Loading...</div>;
//   }

//   if (error || !customer) {
//     return <div className="flex items-center justify-center h-screen text-red-600 font-sans">{error || "No customer data found"}</div>;
//   }

//   return (
//     <div className="min-h-screen flex font-sans bg-gradient-to-br from-gray-100 to-gray-200 py-3 px-6">
//       <ToastContainer />
//       <aside className="w-64 bg-gradient-to-b from-yellow-400 to-yellow-600 text-white shadow-2xl flex flex-col items-center p-6 space-y-6 rounded-r-2xl">
//         <div className="relative w-32 h-32">
//           <img
//             src={profileImage || "https://via.placeholder.com/150?text=Customer"}
//             alt="Customer"
//             className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
//           />
//           <label
//             htmlFor="upload"
//             className="absolute bottom-0 right-0 bg-blue-800 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all"
//           >
//             <Upload className="w-5 h-5 text-white" />
//           </label>
//           <input
//             type="file"
//             id="upload"
//             className="hidden"
//             onChange={handleImageUpload}
//             accept="image/*"
//           />
//         </div>
//         <nav className="w-full flex-1 space-y-4 mt-8">
//           {[
//             { id: "details", label: "Your Details", icon: <User className="w-5 h-5" /> },
//             { id: "update", label: "Update Account", icon: <Edit className="w-5 h-5" /> },
//             { id: "orders", label: "Orders", icon: <ShoppingBag className="w-5 h-5" /> },
//             { id: "bills", label: "Download Bills", icon: <Download className="w-5 h-5" /> },
//           ].map((item) => (
//             <button
//               key={item.id}
//               onClick={() => setActiveTab(item.id)}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition-all ${
//                 activeTab === item.id
//                   ? "bg-white text-yellow-600 font-semibold shadow-md"
//                   : "hover:bg-white/20"
//               }`}
//             >
//               {item.icon}
//               {item.label}
//             </button>
//           ))}
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-3 bg-white text-yellow-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all"
//           >
//             <LogOut className="w-5 h-5" />
//             Logout
//           </button>
//         </nav>
//       </aside>
//       <main className="flex-1 flex items-start justify-center p-6 overflow-auto">
//         <div className="w-full max-w-5xl space-y-8">
//           {activeTab === "details" && (
//             <section className="bg-gradient-to-r from-yellow-400/20 to-blue-400/20 p-8 rounded-xl shadow-lg">
//               <h2 className="text-4xl font-bold mb-4 text-gray-800 flex items-center gap-2">
//                 <User className="w-8 h-8 text-yellow-600" /> Your Details
//               </h2>
//               <p className="text-lg text-gray-600 mb-6">
//                 Welcome back, {customer.customerName}! Manage your account and explore your orders with ease.
//               </p>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 text-xl">
//                 <div className="flex items-center gap-3">
//                   <span className="font-semibold text-yellow-600">Name:</span>
//                   <p>{customer.customerName}</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="font-semibold text-yellow-600">Email:</span>
//                   <p>{customer.customerEmail}</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="font-semibold text-yellow-600">Phone:</span>
//                   <p>{customer.customerPhone}</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="font-semibold text-yellow-600">Address:</span>
//                   <p>{customer.address || "N/A"}</p>
//                 </div>
//               </div>
//             </section>
//           )}
//           {activeTab === "update" && (
//             <section className="bg-white p-8 rounded-xl shadow-lg">
//               <h2 className="text-4xl font-bold mb-4 text-gray-800 flex items-center gap-2">
//                 <Edit className="w-8 h-8 text-yellow-600" /> Update Your Account
//               </h2>
//               <form onSubmit={handleUpdateDetails} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                   <input
//                     type="text"
//                     value={formData.customerName}
//                     onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
//                     className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <input
//                     type="email"
//                     value={formData.customerEmail}
//                     onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
//                     className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone</label>
//                   <input
//                     type="text"
//                     value={formData.customerPhone}
//                     onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
//                     className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Address</label>
//                   <input
//                     type="text"
//                     value={formData.address}
//                     onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                     className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                   />
//                 </div>
//                 <div className="md:col-span-2 flex justify-end">
//                   <button
//                     type="submit"
//                     className="bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all font-semibold"
//                   >
//                     Update Details
//                   </button>
//                 </div>
//               </form>
//             </section>
//           )}
//           {activeTab === "orders" && (
//             <section className="bg-white p-8 rounded-xl shadow-lg">
//               <h2 className="text-4xl font-bold mb-4 text-gray-800 flex items-center gap-2">
//                 <ShoppingBag className="w-8 h-8 text-yellow-600" /> Your Orders
//               </h2>
//               {orders.length === 0 ? (
//                 <p className="text-gray-600 text-lg">You have no orders yet.</p>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {orders.map((order) => (
//                         <tr key={order.id}>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             {new Date(order.orderDate).toLocaleDateString()}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(order.totalPrice)}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm">
//                             <span
//                               className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                 order.status === "Pending"
//                                   ? "bg-yellow-100 text-yellow-800"
//                                   : order.status === "Confirmed"
//                                   ? "bg-green-100 text-green-800"
//                                   : "bg-red-100 text-red-800"
//                               }`}
//                             >
//                               {order.status}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm">
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={() => handleViewBill(order.id)}
//                                 className="text-blue-600 hover:underline flex items-center gap-1"
//                                 disabled={billLoading}
//                               >
//                                 <Printer className="w-4 h-4" /> View Bill
//                               </button>
//                               <button
//                                 onClick={() => handleDownloadBill(order.id)}
//                                 className="text-blue-600 hover:underline flex items-center gap-1"
//                               >
//                                 <Download className="w-4 h-4" /> Download Bill
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </section>
//           )}
//           {activeTab === "bills" && (
//             <section className="bg-white p-8 rounded-xl shadow-lg">
//               <h2 className="text-4xl font-bold mb-4 text-gray-800 flex items-center gap-2">
//                 <Download className="w-8 h-8 text-yellow-600" /> Download Bills
//               </h2>
//               <p className="text-gray-600 text-lg mb-6">
//                 View or download your billing history for all orders below.
//               </p>
//               {orders.length === 0 ? (
//                 <p className="text-gray-600 text-lg">No bills available.</p>
//               ) : (
//                 <div className="space-y-4">
//                   {orders.map((order) => (
//                     <div key={order.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
//                       <span className="text-gray-800">Order #{order.id} - {new Date(order.orderDate).toLocaleDateString()}</span>
//                       <div className="flex gap-4">
//                         <button
//                           onClick={() => handleViewBill(order.id)}
//                           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
//                           disabled={billLoading}
//                         >
//                           <Printer className="w-4 h-4" /> View Bill
//                         </button>
//                         <button
//                           onClick={() => handleDownloadBill(order.id)}
//                           className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all flex items-center gap-2"
//                         >
//                           <Download className="w-4 h-4" /> Download Bill
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </section>
//           )}
//           {showBillModal && billContent && (
//             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:bg-white">
//               <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg print:shadow-none print:max-w-none print:h-auto bill-modal">
//                 <div className="flex justify-between items-center mb-4 print:hidden">
//                   <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                     <Printer className="w-6 h-6 text-yellow-600" /> Bill for Order #{billContent.orderId}
//                   </h2>
//                   <button
//                     onClick={() => {
//                       setShowBillModal(false);
//                       setBillContent(null);
//                     }}
//                     className="text-gray-600 hover:text-gray-800"
//                   >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//                 <div className="bg-gradient-to-r from-yellow-400/10 to-blue-400/10 p-6 rounded-lg print:bg-white">
//                   <h3 className="text-xl font-semibold text-gray-800 mb-4 print:text-center">Pahana Edu - Order Bill</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <p><strong>Customer:</strong> {billContent.customerName}</p>
//                     <p><strong>Email:</strong> {billContent.customerEmail}</p>
//                     <p><strong>Phone:</strong> {billContent.customerPhone}</p>
//                     <p><strong>Address:</strong> {billContent.address}</p>
//                     <p><strong>Order Date:</strong> {new Date(billContent.orderDate).toLocaleDateString()}</p>
//                     <p><strong>Status:</strong> {billContent.status}</p>
//                   </div>
//                   {billLoading ? (
//                     <p className="text-gray-600 text-center">Loading bill...</p>
//                   ) : (
//                     <table className="min-w-full divide-y divide-gray-200 mb-4">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount (%)</th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Price</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {billContent.products.map((product, index) => (
//                           <tr key={index}>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.quantity || 'N/A'}</td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(product.price)}</td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parseFloat(product.discount).toFixed(2)}</td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(product.finalPrice)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   )}
//                   <div className="text-right">
//                     <p><strong>Total Before Discount:</strong> {formatPrice(billContent.totalPriceBeforeDiscount)}</p>
//                     <p><strong>Total Discount:</strong> {formatPrice(billContent.totalDiscount)}</p>
//                     <p><strong>Final Total:</strong> {formatPrice(billContent.finalTotalPrice)}</p>
//                   </div>
//                   <div className="mt-4 flex justify-end gap-4 print:hidden">
//                     <button
//                       onClick={() => handleDownloadBill(billContent.orderId)}
//                       className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all flex items-center gap-2"
//                     >
//                       <Download className="w-4 h-4" /> Download PDF
//                     </button>
//                     <button
//                       onClick={handlePrintBill}
//                       className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
//                     >
//                       <Printer className="w-4 h-4" /> Print
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//       <style>
//         {`
//           @media print {
//             body * {
//               visibility: hidden;
//             }
//             .print\\:bg-white {
//               background: white !important;
//             }
//             .print\\:shadow-none {
//               box-shadow: none !important;
//             }
//             .print\\:max-w-none {
//               max-width: none !important;
//             }
//             .print\\:h-auto {
//               height: auto !important;
//             }
//             .print\\:hidden {
//               display: none !important;
//             }
//             .fixed, .bg-black\\/50 {
//               position: static !important;
//               background: none !important;
//             }
//             .max-w-4xl, .max-h-\\[90vh\\], .overflow-y-auto {
//               max-width: none !important;
//               max-height: none !important;
//               overflow: visible !important;
//             }
//             .bg-gradient-to-r {
//               background: white !important;
//             }
//             .shadow-lg {
//               box-shadow: none !important;
//             }
//             .text-right {
//               text-align: right !important;
//             }
//             .text-center {
//               text-align: center !important;
//             }
//             .bill-modal, .bill-modal * {
//               visibility: visible;
//             }
//             .bill-modal {
//               position: absolute;
//               top: 0;
//               left: 0;
//               width: 100%;
//               margin: 0;
//               padding: 0;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default CustomerDashboard;



import React, { useState, useEffect } from "react";
import { User, Edit, ShoppingBag, Download, Upload, LogOut, Printer, XCircle } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [profileImage, setProfileImage] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
  });
  const [billContent, setBillContent] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billLoading, setBillLoading] = useState(false);

  const navigate = useNavigate();
  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  console.log("Token:", token);
  console.log("userId:", customerId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token || !customerId) {
          throw new Error("Not authenticated: token or customerId missing");
        }

        console.log("Fetching customer data for ID:", customerId);
        const customerResponse = await axios.get(`http://localhost:8080/auth/getcustomerbyid/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Customer response:", customerResponse.data);
        setCustomer(customerResponse.data);
        setProfileImage(customerResponse.data.profileImage);
        setFormData({
          customerName: customerResponse.data.customerName || "",
          customerEmail: customerResponse.data.customerEmail || "",
          customerPhone: customerResponse.data.customerPhone || "",
          address: customerResponse.data.address || "",
        });

        console.log("Fetching orders for customer ID:", customerId);
        const ordersResponse = await axios.get(`http://localhost:8080/getordersbycustomerid/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Orders response:", ordersResponse.data);
        setOrders(ordersResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.status === 401 ? "Session expired. Please log in again." : err.message || "Failed to fetch data");
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          toast.error("Session expired. Redirecting to login...", { position: "top-right", autoClose: 3000 });
          setTimeout(() => navigate("/login"), 3000);
        } else {
          toast.error(err.response?.data || "Failed to fetch data", { position: "top-right", autoClose: 3000 });
        }
      }
    };

    fetchData();
  }, [customerId, token, navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        const response = await axios.post(`http://localhost:8080/auth/updateprofileimage/${customerId}`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        setProfileImage(response.data.profileImage);
        toast.success("Profile image updated!", { position: "top-right", autoClose: 3000 });
      } catch (err) {
        console.error("Image upload error:", err);
        toast.error(err.response?.data || "Failed to upload image", { position: "top-right", autoClose: 3000 });
      }
    }
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      toast.error("Name, email, and phone are required", { position: "top-right", autoClose: 3000 });
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/auth/updatecustomer/${customerId}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      setCustomer(response.data);
      toast.success("Details updated successfully!", { position: "top-right", autoClose: 3000 });
    } catch (err) {
      console.error("Update details error:", err);
      toast.error(err.response?.data || "Failed to update details", { position: "top-right", autoClose: 3000 });
    }
  };

  const handleViewBill = async (orderId) => {
    try {
      setBillLoading(true);
      console.log("Fetching bill for order ID:", orderId);
      const response = await axios.get(`http://localhost:8080/viewbill/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Bill response:", response.data);
      setBillContent(response.data);
      setShowBillModal(true);
    } catch (err) {
      console.error("View bill error:", err);
      toast.error(err.response?.data || "Failed to load bill", { position: "top-right", autoClose: 3000 });
    } finally {
      setBillLoading(false);
    }
  };

  const handleDownloadBill = async (orderId) => {
    try {
      console.log("Downloading PDF bill for order ID:", orderId);
      const response = await axios.get(`http://localhost:8080/generatebillpdf/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bill_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Bill downloaded!", { position: "top-right", autoClose: 3000 });
    } catch (err) {
      console.error("Download bill error:", err);
      toast.error(err.response?.data || "Failed to download bill", { position: "top-right", autoClose: 3000 });
    }
  };

  const handleCancelOrder = async () => {
    try {
      console.log("Canceling order ID:", selectedOrderId);
      const response = await axios.put(
        `http://localhost:8080/update-status/${selectedOrderId}?status=Canceled`,
        {},
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );
      console.log("Cancel order response:", response.data);
      setOrders(
        orders.map((order) =>
          order.id === selectedOrderId ? { ...order, status: "Canceled" } : order
        )
      );
      setShowCancelModal(false);
      setSelectedOrderId(null);
      toast.success("Order canceled successfully! Your Money will be refund soon.", { position: "top-right", autoClose: 3000 });
    } catch (err) {
      console.error("Cancel order error:", err);
      toast.error(err.response?.data || "Failed to cancel order", { position: "top-right", autoClose: 3000 });
      setShowCancelModal(false);
      setSelectedOrderId(null);
    }
  };

  const handlePrintBill = () => {
    window.print();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // Format price as Rs. with 2 decimal places
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? "N/A" : `Rs. ${numPrice.toFixed(2)}`;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-600 font-sans">Loading...</div>;
  }

  if (error || !customer) {
    return <div className="flex items-center justify-center h-screen text-red-600 font-sans">{error || "No customer data found"}</div>;
  }

  return (
    <div className="min-h-screen flex font-sans bg-gradient-to-br from-gray-100 to-gray-200 py-3 px-6">
      <ToastContainer />
      <aside className="w-64 bg-gradient-to-b from-yellow-400 to-yellow-600 text-white shadow-2xl flex flex-col items-center p-6 space-y-6 rounded-r-2xl">
        <div className="relative w-32 h-32">
          <img
            src={profileImage || "https://via.placeholder.com/150?text=Customer"}
            alt="Customer"
            className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
          />
          <label
            htmlFor="upload"
            className="absolute bottom-0 right-0 bg-blue-800 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all"
          >
            <Upload className="w-5 h-5 text-white" />
          </label>
          <input
            type="file"
            id="upload"
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
          />
        </div>
        <nav className="w-full flex-1 space-y-4 mt-8">
          {[
            { id: "details", label: "Your Details", icon: <User className="w-5 h-5" /> },
            { id: "update", label: "Update Account", icon: <Edit className="w-5 h-5" /> },
            { id: "orders", label: "Orders", icon: <ShoppingBag className="w-5 h-5" /> },
            { id: "bills", label: "Download Bills", icon: <Download className="w-5 h-5" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition-all ${
                activeTab === item.id
                  ? "bg-white text-yellow-600 font-semibold shadow-md"
                  : "hover:bg-white/20"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white text-yellow-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 flex items-start justify-center p-6 overflow-auto">
        <div className="w-full max-w-5xl space-y-8">
          {activeTab === "details" && (
            <section className="bg-gradient-to-r from-yellow-400/20 to-blue-400/20 p-8 rounded-xl shadow-lg">
              <h2 className="text-4xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <User className="w-8 h-8 text-yellow-600" /> Your Details
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Welcome back, {customer.customerName}! Manage your account and explore your orders with ease.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 text-xl">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-yellow-600">Name:</span>
                  <p>{customer.customerName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-yellow-600">Email:</span>
                  <p>{customer.customerEmail}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-yellow-600">Phone:</span>
                  <p>{customer.customerPhone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-yellow-600">Address:</span>
                  <p>{customer.address || "N/A"}</p>
                </div>
              </div>
            </section>
          )}
          {activeTab === "update" && (
            <section className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-4xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <Edit className="w-8 h-8 text-yellow-600" /> Update Your Account
              </h2>
              <form onSubmit={handleUpdateDetails} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all font-semibold"
                  >
                    Update Details
                  </button>
                </div>
              </form>
            </section>
          )}
          {activeTab === "orders" && (
            <section className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-4xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <ShoppingBag className="w-8 h-8 text-yellow-600" /> Your Orders
              </h2>
              {orders.length === 0 ? (
                <p className="text-gray-600 text-lg">You have no orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(order.totalPrice)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "Confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewBill(order.id)}
                                className="text-blue-600 hover:underline flex items-center gap-1"
                                disabled={billLoading}
                              >
                                <Printer className="w-4 h-4" /> View Bill
                              </button>
                              <button
                                onClick={() => handleDownloadBill(order.id)}
                                className="text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <Download className="w-4 h-4" /> Download Bill
                              </button>
                              {order.status === "Pending" && (
                                <button
                                  onClick={() => {
                                    setSelectedOrderId(order.id);
                                    setShowCancelModal(true);
                                  }}
                                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all font-semibold"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
          {activeTab === "bills" && (
            <section className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-4xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <Download className="w-8 h-8 text-yellow-600" /> Download Bills
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                View or download your billing history for all orders below.
              </p>
              {orders.length === 0 ? (
                <p className="text-gray-600 text-lg">No bills available.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-800">Order #{order.id} - {new Date(order.orderDate).toLocaleDateString()}</span>
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleViewBill(order.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
                          disabled={billLoading}
                        >
                          <Printer className="w-4 h-4" /> View Bill
                        </button>
                        <button
                          onClick={() => handleDownloadBill(order.id)}
                          className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" /> Download Bill
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
          {showBillModal && billContent && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:bg-white">
              <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg print:shadow-none print:max-w-none print:h-auto bill-modal">
                <div className="flex justify-between items-center mb-4 print:hidden">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Printer className="w-6 h-6 text-yellow-600" /> Bill for Order #{billContent.orderId}
                  </h2>
                  <button
                    onClick={() => {
                      setShowBillModal(false);
                      setBillContent(null);
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="bg-gradient-to-r from-yellow-400/10 to-blue-400/10 p-6 rounded-lg print:bg-white">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 print:text-center">Pahana Edu - Order Bill</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <p><strong>Customer:</strong> {billContent.customerName}</p>
                    <p><strong>Email:</strong> {billContent.customerEmail}</p>
                    <p><strong>Phone:</strong> {billContent.customerPhone}</p>
                    <p><strong>Address:</strong> {billContent.address}</p>
                    <p><strong>Order Date:</strong> {new Date(billContent.orderDate).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {billContent.status}</p>
                  </div>
                  {billLoading ? (
                    <p className="text-gray-600 text-center">Loading bill...</p>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200 mb-4">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount (%)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Price</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {billContent.products.map((product, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.quantity || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(product.price)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parseFloat(product.discount).toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(product.finalPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <div className="text-right">
                    <p><strong>Total Before Discount:</strong> {formatPrice(billContent.totalPriceBeforeDiscount)}</p>
                    <p><strong>Total Discount:</strong> {formatPrice(billContent.totalDiscount)}</p>
                    <p><strong>Final Total:</strong> {formatPrice(billContent.finalTotalPrice)}</p>
                  </div>
                  <div className="mt-4 flex justify-end gap-4 print:hidden">
                    <button
                      onClick={() => handleDownloadBill(billContent.orderId)}
                      className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                    <button
                      onClick={handlePrintBill}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
                    >
                      <Printer className="w-4 h-4" /> Print
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showCancelModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Cancel Order
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to cancel Order #{selectedOrderId}? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      setSelectedOrderId(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    No
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print\\:bg-white {
              background: white !important;
            }
            .print\\:shadow-none {
              box-shadow: none !important;
            }
            .print\\:max-w-none {
              max-width: none !important;
            }
            .print\\:h-auto {
              height: auto !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .fixed, .bg-black\\/50 {
              position: static !important;
              background: none !important;
            }
            .max-w-4xl, .max-h-\\[90vh\\], .overflow-y-auto {
              max-width: none !important;
              max-height: none !important;
              overflow: visible !important;
            }
            .bg-gradient-to-r {
              background: white !important;
            }
            .shadow-lg {
              box-shadow: none !important;
            }
            .text-right {
              text-align: right !important;
            }
            .text-center {
              text-align: center !important;
            }
            .bill-modal, .bill-modal * {
              visibility: visible;
            }
            .bill-modal {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              margin: 0;
              padding: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CustomerDashboard;