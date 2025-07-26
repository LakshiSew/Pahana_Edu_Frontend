import { useState } from "react";
import { FiMail, FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginBg from "../assets/images/other/bookback.jpg";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Request code, 2: Enter code, 3: Reset password
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.userName.match(/^[a-zA-Z0-9]{4,}$/)) {
      errors.userName = "Username must be at least 4 characters, alphanumeric only";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => toast.error(error, { autoClose: 3000 }));
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.userName,
          email: formData.email,
        }),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to send reset code");
      }
      toast.success("Reset code sent to your email. Please check your inbox.", { autoClose: 3000 });
      setStep(2); // Move to code entry step
    } catch (error) {
      toast.error(error.message || "Failed to send reset code.", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!formData.code.match(/^\d{4}$/)) {
      toast.error("Code must be a 4-digit number", { autoClose: 3000 });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/auth/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.userName,
          code: formData.code,
        }),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Invalid or expired code");
      }
      toast.success("Code verified successfully!", { autoClose: 2000 });
      setStep(3); // Move to password reset step
    } catch (error) {
      toast.error(error.message || "Invalid or expired code.", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const errors = {};
    if (formData.newPassword.length < 5) {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.userName,
          code: formData.code,
          newPassword: formData.newPassword,
        }),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to reset password");
      }
      toast.success("Password reset successfully!", { autoClose: 2000 });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.message || "Failed to reset password.", { autoClose: 3000 });
    } finally {
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
              {step === 1 ? "Forgot Password" : step === 2 ? "Enter Reset Code" : "Reset Password"}
            </h2>
            <p className="mt-2 text-sm text-gray-600 font-sans">
              {step === 1
                ? "Enter your username and email to receive a reset code"
                : step === 2
                ? "Enter the 4-digit code sent to your email"
                : "Enter your new password"}
            </p>
          </div>
          <form
            onSubmit={
              step === 1 ? handleRequestCode : step === 2 ? handleVerifyCode : handleResetPassword
            }
            className="space-y-6"
          >
            {step === 1 && (
              <>
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
                    htmlFor="email"
                    className="block text-sm font-medium text-black font-sans"
                  >
                    Email Address
                  </label>
                  <div className="mt-1 relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiMail className="w-5 h-5 text-yellow-400" />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-lg focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none transition-colors duration-200 font-sans"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </>
            )}
            {step === 2 && (
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-black font-sans"
                >
                  Reset Code
                </label>
                <div className="mt-1 relative">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-lg focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none transition-colors duration-200 font-sans"
                    placeholder="Enter 4-digit code"
                    maxLength={4}
                  />
                </div>
              </div>
            )}
            {step === 3 && (
              <>
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
              </>
            )}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 font-sans"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-black" />
                    {step === 1 ? "Sending..." : step === 2 ? "Verifying..." : "Resetting..."}
                  </>
                ) : (
                  step === 1 ? "Send Reset Code" : step === 2 ? "Verify Code" : "Reset Password"
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

export default ForgotPassword;