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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <motion.div
      className="h-full bg-black/70 backdrop-blur-xl border-r border-yellow-400/50 shadow-lg flex flex-col justify-between"
      initial={{ width: collapsed ? 64 : 256 }}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top - Brand & Toggle */}
      <div className="p-3 flex items-center justify-between border-b border-yellow-400/30">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold">
            P
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Pahana Book Shop Admin
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
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-semibold">
            A
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-medium text-white font-sans">
                Staff Name
              </p>
              <p className="text-xs text-yellow-400 font-sans">Monitor</p>
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
