
import { useState } from "react";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { Loader2, Facebook, Chrome, HelpCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import loginBg from "../assets/images/other/bookback.jpg";

const API_URL = "http://localhost:8080";

const Login = () => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get("redirect") || "/";

  const validateForm = () => {
    const errors = {};
    if (!formData.userName.match(/^[a-zA-Z0-9]{4,}$/)) {
      errors.userName = "Username must be at least 4 characters, alphanumeric only";
    }
    if (formData.password.length < 5) {
      errors.password = "Password must be at least 5 characters";
    }
    return errors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const mergeGuestCart = async (userId, token) => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    if (guestCart.length > 0) {
      try {
        await Promise.all(
          guestCart.map((item) =>
            axios.post(
              `${API_URL}/add`,
              {
                userId,
                productId: item.productId,
                productType: item.productType,
                quantity: item.quantity,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );
        localStorage.removeItem("guestCart");
        const cartUpdateEvent = new Event("cartUpdated");
        window.dispatchEvent(cartUpdateEvent);
        console.log("Dispatched cartUpdated event after guest cart merge");
      } catch (err) {
        console.error("Merge error:", err.response?.data || err.message);
        toast.error("Failed to merge guest cart items.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => toast.error(error, { autoClose: 3000 }));
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: formData.userName,
          password: formData.password,
        }),
      });
      if (!response.ok) {
        throw new Error("Invalid username or password");
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);

      await mergeGuestCart(data.userId, data.token);

      toast.success("Login successful!", { autoClose: 2000 });
      setTimeout(() => {
        setLoading(false);
        switch (data.role) {
          case "ROLE_MANAGER":
            navigate("/admin/");
            break;
          case "ROLE_STAFF":
            navigate("/staff/");
            break;
          case "ROLE_CUSTOMER":
            navigate(redirectTo);
            break;
          default:
            navigate(redirectTo);
        }
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Login failed. Invalid username or password.", {
        autoClose: 3000,
      });
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-black to-yellow-800/30 bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="relative w-full max-w-lg bg-gray-100 rounded-2xl shadow-xl p-6 space-y-6 border border-yellow-400">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black font-sans">
              Login to Pahana Edu
            </h2>
            <p className="mt-2 text-sm text-gray-600 font-sans">
              Access your account to shop for books and stationery
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-black font-sans"
              >
                Username
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiUser className="w-5 h-5 text-yellow-400" />
                </span>
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.userName}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-lg focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none transition-colors duration-200 font-sans"
                  placeholder="johndoe123"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black font-sans"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiLock className="w-5 h-5 text-yellow-400" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-lg focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none transition-colors duration-200 font-sans"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5 text-gray-600" />
                  ) : (
                    <FiEye className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            <div className="text-right text-sm">
              <a
                href="/forgot-password"
                className="text-yellow-400 font-medium hover:text-yellow-300 transition-colors duration-200 font-sans"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 font-sans"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-black" />
                    Logging In...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
              <HelpCircle className="absolute right-2 top-2 w-6 h-6 text-yellow-400 cursor-pointer" />
              <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm rounded-md p-4 w-64 right-0 mt-10 font-sans">
                Enter your username and password to log in. Username must be at least 4 characters, and password must be at least 8 characters. Contact support at info@pahanaedu.lk for assistance.
              </div>
            </div>
            <div className="text-center text-sm text-black font-sans">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-yellow-400 font-medium hover:text-yellow-300 transition-colors duration-200 font-sans"
              >
                Sign up
              </a>
            </div>
          </form>
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-100 text-black font-sans">
                Or continue with
              </span>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              className="flex-1 py-2 bg-white text-black rounded-lg hover:bg-yellow-400 hover:text-black transition-colors duration-200 flex items-center justify-center gap-2 font-sans"
              aria-label="Log in with Google"
            >
              <Chrome className="w-5 h-5 text-yellow-400" />
              Google
            </button>
            <button
              className="flex-1 py-2 bg-white text-black rounded-lg hover:bg-yellow-400 hover:text-black transition-colors duration-200 flex items-center justify-center gap-2 font-sans"
              aria-label="Log in with Facebook"
            >
              <Facebook className="w-5 h-5 text-yellow-400" />
              Facebook
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Login;