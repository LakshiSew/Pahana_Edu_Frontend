// import {
//   LayoutDashboard,
//   Book,
//   Tag,
//   ShoppingBag,
//   Users,
//   FileText,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// const menuItems = [
//   { icon: LayoutDashboard, label: "Dashboard", path: "/staff" },
//   { icon: Book, label: "Books", path: "/staff/books" },
//   { icon: FileText, label: "Accessories", path: "/staff/accessories" },
//   { icon: Tag, label: "Categories", path: "/staff/categories" },
//   { icon: ShoppingBag, label: "Orders", path: "/staff/orders" },
 
// ];

// const StaffSidebar = ({ collapsed, setCollapsed }) => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   return (
//     <motion.div
//       className="h-full bg-black/70 backdrop-blur-xl border-r border-yellow-400/50 shadow-lg flex flex-col justify-between"
//       initial={{ width: collapsed ? 64 : 256 }}
//       animate={{ width: collapsed ? 64 : 256 }}
//       transition={{ duration: 0.3 }}
//     >
//       {/* Top - Brand & Toggle */}
//       <div className="p-3 flex items-center justify-between border-b border-yellow-400/30">
//         <div className="flex items-center space-x-2">
//           <div className="h-8 w-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold">
//             P
//           </div>
//           {!collapsed && (
//             <span className="text-lg font-semibold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
//               Pahana Book Shop Admin
//             </span>
//           )}
//         </div>
//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="text-yellow-400 hover:text-yellow-500 transition-colors"
//           aria-label="Toggle sidebar"
//         >
//           {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//         </button>
//       </div>

//       {/* Menu */}
//       <nav className="flex-1 p-3">
//         <ul className="space-y-2">
//           {menuItems.map(({ icon: Icon, label, path }) => (
//             <motion.li
//               key={label}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Link
//                 to={path}
//                 className={`flex items-center p-2 rounded-lg transition-colors ${
//                   location.pathname === path
//                     ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/50"
//                     : "text-white hover:bg-yellow-400/10 hover:text-yellow-400"
//                 }`}
//               >
//                 <Icon size={20} className="min-w-[20px] text-yellow-400" />
//                 {!collapsed && <span className="ml-3 font-sans">{label}</span>}
//               </Link>
//             </motion.li>
//           ))}
//         </ul>
//       </nav>

//       {/* Bottom - Profile & Logout */}
//       <div className="p-3 border-t border-yellow-400/30">
//         <div className="flex items-center space-x-3 mb-3">
//           <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-semibold">
//             A
//           </div>
//           {!collapsed && (
//             <div>
//               <p className="text-sm font-medium text-white font-sans">
//                 Staff Name
//               </p>
//               <p className="text-xs text-yellow-400 font-sans">Monitor</p>
//             </div>
//           )}
//         </div>
//         <motion.button
//           onClick={handleLogout}
//           className="w-full flex items-center p-2 rounded-lg text-white hover:bg-yellow-400/10 hover:text-yellow-400 transition-colors"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           aria-label="Logout"
//         >
//           <LogOut size={20} className="min-w-[20px] text-yellow-400" />
//           {!collapsed && <span className="ml-3 font-sans">Log Out</span>}
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// };

// export default StaffSidebar;


import {
  LayoutDashboard,
  Book,
  Tag,
  ShoppingBag,
  Users,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
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

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/staff" },
  { icon: Book, label: "Books", path: "/staff/books" },
  { icon: FileText, label: "Accessories", path: "/staff/accessories" },
  { icon: Tag, label: "Categories", path: "/staff/categories" },
  { icon: ShoppingBag, label: "Orders", path: "/staff/orders" },
];

const StaffSidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [staffDetails, setStaffDetails] = useState({
    userName: "Staff Name",
    adminImage: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        if (!userId || !token) {
          toast.error("Please log in to view staff details", {
            position: "top-right",
            autoClose: 3000,
          });
          setLoading(false);
          return;
        }

        const response = await api.get(`/getadminbyid/${userId}`);
        const admin = response.data;

        if (admin.position !== "Staff") {
          toast.error("Access denied: Not a staff member", {
            position: "top-right",
            autoClose: 3000,
          });
          setLoading(false);
          return;
        }

        setStaffDetails({
          userName: admin.userName || "Staff Name",
          adminImage: admin.adminImage || null,
        });
        setLoading(false);
      } catch (err) {
        console.warn("Failed to fetch staff details:", err.response?.status, err.message);
        if (err.response?.status === 401) {
          toast.error("Unauthorized: Please log in again", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error("Failed to load staff details", {
            position: "top-right",
            autoClose: 3000,
          });
        }
        setLoading(false);
      }
    };

    fetchStaffDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <motion.div
      className="h-full bg-black/70 backdrop-blur-xl border-r border-yellow-400/50 shadow-lg flex flex-col justify-between"
      initial={{ width: collapsed ? 64 : 256 }}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3 }}
    >
      <ToastContainer />

      {/* Top - Brand & Toggle */}
      {/* <div className="p-3 flex items-center justify-between border-b border-yellow-400/30">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold">
            P
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Pahana Book Shop Staff
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-yellow-400 hover:text-yellow-500 transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div> */}

      <div className="p-3 flex items-center justify-between border-b border-yellow-400/30">
  <div className="flex items-center space-x-2">
<div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">      {/* Logo Image */}
      <img
        src="/src/assets/images/Pahana_EDU.svg" // Update this with the correct path to your logo file
        alt="Pahana Edu Logo"
        className="h-6 w-6 object-contain" // Adjust size to fit within the circle
      />
    </div>
    {!collapsed && (
      <span className="text-lg font-semibold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Pahana Book Shop Staff
      </span>
    )}
  </div>
  <button
    onClick={() => setCollapsed(!collapsed)}
    className="text-yellow-400 hover:text-yellow-500 transition-colors"
    aria-label="Toggle sidebar"
  >
    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
  </button>
</div>


      {/* Menu */}
      <nav className="flex-1 p-3">
        <ul className="space-y-2">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <motion.li
              key={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={path}
                className={`flex items-center p-2 rounded-lg transition-colors ${
                  location.pathname === path
                    ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/50"
                    : "text-white hover:bg-yellow-400/10 hover:text-yellow-400"
                }`}
              >
                <Icon size={20} className="min-w-[20px] text-yellow-400" />
                {!collapsed && <span className="ml-3 font-sans">{label}</span>}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Bottom - Profile & Logout */}
      <div className="p-3 border-t border-yellow-400/30">
        <div className="flex items-center space-x-3 mb-3">
          {loading ? (
            <div className="h-10 w-10 rounded-full bg-gray-500/30 animate-pulse"></div>
          ) : (
            <img
              src={staffDetails.adminImage || "https://via.placeholder.com/40?text=A"}
              alt="Staff Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
          )}
          {!collapsed && (
            <div>
              <p className="text-sm font-medium text-white font-sans">
                {loading ? "Loading..." : staffDetails.userName}
              </p>
              <p className="text-xs text-yellow-400 font-sans">Staff</p>
            </div>
          )}
        </div>
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center p-2 rounded-lg text-white hover:bg-yellow-400/10 hover:text-yellow-400 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Logout"
        >
          <LogOut size={20} className="min-w-[20px] text-yellow-400" />
          {!collapsed && <span className="ml-3 font-sans">Log Out</span>}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default StaffSidebar;