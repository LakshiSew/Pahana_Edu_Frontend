import { useState, useEffect } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginBg from "../assets/images/other/bookback.jpg";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing token", { autoClose: 3000 });
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const errors = {};
    if (formData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => toast.error(error, { autoClose: 3000 }));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || "Failed to reset password");
      }

      toast.success("Password reset successfully!", { autoClose: 2000 });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Failed to reset password.", { autoClose: 3000 });
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
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-gray-600 font-sans">
              Enter your new password below
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-black font-sans"
              >
                New Password
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiLock className="w-5 h-5 text-yellow-400" />
                </span>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-lg focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none transition-colors duration-200 font-sans"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <FiEyeOff className="w-5 h-5 text-gray-600" />
                  ) : (
                    <FiEye className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-black font-sans"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiLock className="w-5 h-5 text-yellow-400" />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-lg focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none transition-colors duration-200 font-sans"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="w-5 h-5 text-gray-600" />
                  ) : (
                    <FiEye className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 font-sans"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-black" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
            <div className="text-center text-sm text-black font-sans">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-yellow-400 font-medium hover:text-yellow-300 transition-colors duration-200 font-sans"
              >
                Sign in
              </a>
            </div>
          </form>
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

export default ResetPassword;