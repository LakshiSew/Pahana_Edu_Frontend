import { useState, useEffect, useRef } from "react";
import {
  Check,
  Facebook,
  Instagram,
  Linkedin,
  Menu,
  ShoppingCart,
  User,
  Info,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080";

const Header = ({ showOnlyNav = false }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const categoryRef = useRef(null);
  const userRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch cart count
  const fetchCartCount = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      try {
        const response = await axios.get(`${API_URL}/count/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Cart count response:", response.data);
        setCartCount(response.data.count || 0);
      } catch (err) {
        console.error("Failed to fetch cart count:", err.message);
        setCartCount(0);
      }
    } else {
      console.warn("No token or userId found for cart count fetch");
      setCartCount(0);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!token);

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/getallcategories`);
        const activeCategories = response.data.filter(category => category.status === "Active");
        setCategories(activeCategories);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load categories:", err.message);
        setLoading(false);
      }
    };

    fetchCategories();
    fetchCartCount();

    // Handle cartUpdated event
    const handleCartUpdate = () => {
      console.log("Received cartUpdated event");
      fetchCartCount(); // Immediately fetch cart count
      // Fallback polling for slow backend
      const pollInterval = setInterval(() => {
        fetchCartCount();
      }, 1000);
      // Stop polling after 3 seconds
      setTimeout(() => clearInterval(pollInterval), 3000);
    };
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Handle click outside for dropdowns
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setIsUserOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [location]);

  const handleCategoryClick = (categoryName, event) => {
    event.stopPropagation();
    setIsCategoryOpen(false);
    navigate(`/productList?category=${encodeURIComponent(categoryName)}`);
  };

  const handleCartClick = () => {
    navigate('/cartpage');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setIsUserOpen(false);
    setCartCount(0);
    navigate("/login");
  };

  if (showOnlyNav) {
    return (
      <nav className="bg-yellow-500 text-white px-4 py-3 flex justify-between items-center shadow-md font-sans w-full max-w-full sticky top-0 z-50">
        <div className="flex items-center gap-6 text-md font-medium">
          {["/", "/productList", "/newArraivals", "/offer", "suggestBook", "/about"].map((path, i) => {
            const labels = ["Home", "Products", "New Arrivals", "Offers", "Suggest Book", "About"];
            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `hover:underline ${isActive ? "font-bold" : ""}`
                }
              >
                {labels[i]}
              </NavLink>
            );
          })}
          <div className="relative popup-container" ref={categoryRef}>
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-amber-800 text-white px-4 py-1.5 rounded-md hover:from-yellow-700 hover:to-amber-900 transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation();
                setIsCategoryOpen(!isCategoryOpen);
              }}
            >
              <Menu className="h-5 w-5" /> Shop Categories
            </button>
            {isCategoryOpen && (
              <ul className="absolute left-0 top-10 bg-white text-gray-800 rounded-md shadow-lg w-40 max-h-60 overflow-y-auto z-50 border border-yellow-200">
                {loading ? (
                  <li className="px-3 py-1 text-sm text-gray-500">Loading...</li>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <li key={category.categoryId}>
                      <button
                        onClick={(e) => handleCategoryClick(category.categoryName, e)}
                        className="block w-full text-left px-3 py-1 text-sm text-black hover:bg-yellow-100 hover:text-yellow-600 hover:underline cursor-pointer transition-colors duration-200"
                      >
                        {category.categoryName}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-1 text-sm text-gray-500">No categories available</li>
                )}
              </ul>
            )}
          </div>
        </div>
        <div className="flex justify-end items-center gap-3">
          <button
            onClick={handleCartClick}
            className="cart-icon flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-amber-800 text-white px-4 py-1.5 rounded-xl hover:from-yellow-700 hover:to-amber-900 transition-colors duration-300 shadow-md"
          >
            <ShoppingCart className="h-5 w-5" />
            Cart
            <span className="bg-yellow-400 text-black text-xs font-semibold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          </button>
        </div>
      </nav>
    );
  }

//   return (
//     <div className="font-sans">
//       <div className="flex items-center bg-yellow-100 h-12 w-full text-black shadow-md">
//         <div className="w-full max-w-full flex justify-between items-center px-4 md:pr-2 md:pl-8">
//           <p className="flex items-center gap-2 text-sm font-medium tracking-wide">
//             <Check className="h-5 w-5 text-yellow-400" />
//             Serving Sri Lanka’s Learning Needs with Pride
//           </p>
//           <div className="flex justify-end items-center gap-3">
//             {!isLoggedIn && (
//               <>
//                 <Link
//                   to="/login"
//                   className="text-sm font-medium capitalize hover:text-yellow-400 transition-colors duration-300"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className="text-sm font-medium capitalize hover:text-yellow-400 transition-colors duration-300"
//                 >
//                   Sign Up
//                 </Link>
//                 <Link
//                   to="/faq"
//                   className="text-sm font-medium capitalize hover:text-yellow-400 transition-colors duration-300"
//                 >
//                   FAQ
//                 </Link>
//                 <Link
//                   to="/contactus"
//                   className="flex items-center gap-1 text-sm font-medium capitalize hover:text-yellow-400 transition-colors duration-300"
//                 >
//                   <Info className="h-5 w-5" /> Need Help
//                 </Link>
//               </>
//             )}
//             <div className="flex space-x-3">
//               <Facebook
//                 className="cursor-pointer hover:text-yellow-600 transition-colors duration-300"
//                 size={18}
//               />
//               <Twitter
//                 className="cursor-pointer hover:text-yellow-600 transition-colors duration-300"
//                 size={18}
//               />
//               <Instagram
//                 className="cursor-pointer hover:text-yellow-600 transition-colors duration-300"
//                 size={18}
//               />
//               <Linkedin
//                 className="cursor-pointer hover:text-yellow-600 transition-colors duration-300"
//                 size={18}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center bg-white w-full h-15 shadow-lg">
//         <div className="w-full max-w-full flex justify-between items-center px-4 md:pr-2 md:pl-8">
//           <div className="logo_wrapper">
//             <Link
//               to="/"
//               className="flex items-center gap-2 text-3xl font-bold text-black tracking-tight"
//             >
//               <img
//                 src="/src/assets/images/pahana_EDU.svg"
//                 alt="Pahana Edu Logo"
//                 className="h-12 w-12"
//               />
//               Pahana Edu
//             </Link>
//           </div>
//           <div className="flex justify-end items-center gap-3">
//             <button
//               onClick={handleCartClick}
//               className="cart-icon flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-amber-800 text-white px-4 py-1.5 rounded-xl hover:from-yellow-700 hover:to-amber-900 transition-colors duration-300 shadow-md"
//             >
//               <ShoppingCart className="h-5 w-5" />
//               Cart
//               <span className="bg-yellow-400 text-black text-xs font-semibold px-2 py-0.5 rounded-full">
//                 {cartCount}
//               </span>
//             </button>
//             {isLoggedIn && (
//               <div className="relative" ref={userRef}>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setIsUserOpen(!isUserOpen);
//                   }}
//                   className="flex items-center gap-2 bg-gray-100 text-black px-4 py-1.5 rounded-xl hover:bg-gray-200 transition-colors duration-300 shadow-md"
//                 >
//                   <User className="h-5 w-5" />
//                 </button>
//                 {isUserOpen && (
//                   <ul className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-yellow-200 z-10">
//                     <li>
//                       <Link
//                         to="/customerDashboard"
//                         className="block px-3 py-1 text-sm text-black hover:bg-yellow-50 hover:text-yellow-600 hover:underline cursor-pointer transition-colors duration-200"
//                         onClick={() => setIsUserOpen(false)}
//                       >
//                         Account
//                       </Link>
//                     </li>
//                     <li>
//                       <Link
//                         to="/"
//                         className="block px-3 py-1 text-sm text-black hover:bg-yellow-50 hover:text-yellow-600 hover:underline cursor-pointer transition-colors duration-200"
//                         onClick={handleLogout}
//                       >
//                         Logout
//                       </Link>
//                     </li>
//                   </ul>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center bg-yellow-400 w-full h-16">
//         <div className="w-full max-w-full flex justify-between items-center px-4 md:pr-2 md:pl-8">
//           <div className="flex items-center gap-6">
//             <div className="relative" ref={categoryRef}>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setIsCategoryOpen(!isCategoryOpen);
//                 }}
//                 className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-amber-800 text-white px-4 py-1.5 rounded-xl hover:from-yellow-700 hover:to-amber-900 transition-colors duration-300 shadow-md"
//               >
//                 <Menu className="h-5 w-5" /> All Categories
//               </button>
//               {isCategoryOpen && (
//                 <ul className="absolute left-0 top-10 bg-white text-gray-800 rounded-md shadow-lg w-40 max-h-60 overflow-y-auto z-50 border border-yellow-200">
//                   {loading ? (
//                     <li className="px-3 py-1 text-sm text-gray-500">Loading...</li>
//                   ) : categories.length > 0 ? (
//                     categories.map((category) => (
//                       <li key={category.categoryId}>
//                         <button
//                           onClick={(e) => handleCategoryClick(category.categoryName, e)}
//                           className="block w-full text-left px-3 py-1 text-sm text-black hover:bg-yellow-100 hover:text-yellow-600 hover:underline cursor-pointer transition-colors duration-200"
//                         >
//                           {category.categoryName}
//                         </button>
//                       </li>
//                     ))
//                   ) : (
//                     <li className="px-3 py-1 text-sm text-gray-500">No categories available</li>
//                   )}
//                 </ul>
//               )}
//             </div>
//             <nav className="flex flex-wrap items-center gap-4 md:gap-6">
//               {["/", "/productList", "/newArraivals", "/offer", "suggestBook", "/about"].map((path, i) => {
//                 const labels = ["Home", "Products", "New Arrivals", "Offers", "Suggest Book", "About"];
//                 return (
//                   <NavLink
//                     key={path}
//                     to={path}
//                     className={({ isActive }) =>
//                       `text-sm font-medium capitalize ${
//                         isActive ? "text-yellow-600 font-bold" : "text-gray-800"
//                       } hover:text-yellow-600 transition-colors duration-300`
//                     }
//                   >
//                     {labels[i]}
//                   </NavLink>
//                 );
//               })}
//             </nav>
//           </div>
//           <div className="flex justify-end items-center gap-3 text-sm font-normal text-gray-800">
//             <p className="flex items-center gap-1">
//               <Mail className="h-4 w-4 text-yellow-600" />
//               <span className="hover:text-yellow-600 transition-colors duration-300">
//                 info@pahanaedu.lk
//               </span>
//             </p>
//             <p className="flex items-center gap-1">
//               <MapPin className="h-4 w-4 text-yellow-600" />
//               <span className="hover:text-yellow-600 transition-colors duration-300">
//                 Colombo, Sri Lanka
//               </span>
//             </p>
//             <p className="flex items-center gap-1">
//               <Phone className="h-4 w-4 text-yellow-600" />
//               <span className="hover:text-yellow-600 transition-colors duration-300">
//                 (808) 555-0111
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;