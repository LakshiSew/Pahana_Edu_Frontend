import { useState } from "react";
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";
import { Loader2, Facebook, Chrome, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import signupBg from "../assets/images/other/bookback.jpg";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    telephoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    countryCode: "+94",
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const countryCodes = [
    { code: "+94", name: "Sri Lanka" },
    { code: "+91", name: "India" },
    { code: "+44", name: "UK" },
    { code: "+39", name: "Italy" },
    { code: "+1", name: "USA" },
    { code: "+7", name: "Russia" },
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.userName.match(/^[a-zA-Z0-9]{4,}$/)) {
      errors.userName = "Username must be at least 4 characters, alphanumeric only";
    }
    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    }
    if (!formData.address.trim() || formData.address.length < 5) {
      errors.address = "Address must be at least 5 characters";
    }
    if (!formData.telephoneNumber.match(/^\d{9}$/)) {
      errors.telephoneNumber = "Phone number must be 9 digits";
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Invalid email format";
    }
    if (formData.password.length < 5) {
      errors.password = "Password must be at least 5 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!formData.profileImage) {
      errors.profileImage = "Profile image is required";
    }
    return errors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
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
      const formDataToSend = new FormData();
      formDataToSend.append("userName", formData.userName);
      formDataToSend.append("customerName", formData.fullName);
      formDataToSend.append("customerEmail", formData.email);
      formDataToSend.append("customerPhone", `${formData.countryCode}${formData.telephoneNumber}`);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("profileImage", formData.profileImage);

      const response = await axios.post("http://localhost:8080/auth/createcustomer", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Registration successful! Awaiting admin approval for account activation.", { autoClose: 3000 });
      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data || "Failed to register. Please try again.";
      toast.error(errorMessage, { autoClose: 3000 });
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-black to-yellow-800/30 bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{ backgroundImage: `url(${signupBg})` }}
      >
        <div className="relative w-full max-w-3xl bg-gray-100 rounded-2xl shadow-xl p-6 space-y-6 transform transition-all duration-500 hover:scale-105 hover:shadow-yellow-400/50 border border-yellow-400">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black font-sans">
              Join Pahana Edu
            </h2>
            <p className="mt-2 text-sm text-gray-600 font-sans">
              Create your account to start shopping for books and stationery!
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label htmlFor="userName" className="block text-sm font-medium text-black font-sans">
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
            <div className="col-span-1">
              <label htmlFor="fullName" className="block text-sm font-medium text-black font-sans">
                Full Name
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiUser className="w-5 h-5 text-yellow-400" />
                </span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-lg focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none transition-colors duration-200 font-sans"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="telephoneNumber" className="block text-sm font-medium text-black font-sans">
                Phone Number
              </label>
              <div className="flex mt-1">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-l-lg py-2 px-3 text-sm bg-white text-black focus:ring-yellow-400 focus:border-yellow-400 font-sans"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code} className="bg-white text-black">
                      {country.code}
                    </option>
                  ))}
                </select>
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiPhone className="w-5 h-5 text-yellow-400" />
                  </span>
                  <input
                    id="telephoneNumber"
                    name="telephoneNumber"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.telephoneNumber}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 rounded-r-lg focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none transition-colors duration-200 font-sans"
                    placeholder="123456789"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="email" className="block text-sm font-medium text-black font-sans">
                Email
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
            <div className="col-span-1">
              <label htmlFor="password" className="block text-sm font-medium text-black font-sans">
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
                  autoComplete="new-password"
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
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5 text-gray-600" />
                  ) : (
                    <FiEye className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black font-sans">
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
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="w-5 h-5 text-gray-600" />
                  ) : (
                    <FiEye className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="address" className="block text-sm font-medium text-black font-sans">
                Address
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiUser className="w-5 h-5 text-yellow-400" />
                </span>
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-lg focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none transition-colors duration-200 font-sans"
                  placeholder="123 Main St, Colombo"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="profileImage" className="block text-sm font-medium text-black font-sans">
                Profile Image
              </label>
              <div className="mt-1 relative">
                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-lg focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none transition-colors duration-200 font-sans"
                />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 mt-4 relative group">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 font-sans"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-black" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
              <HelpCircle className="absolute right-2 top-2 w-6 h-6 text-yellow-400 cursor-pointer" />
              <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm rounded-md p-4 w-64 right-0 mt-10 font-sans">
                Fill in your details to create a Pahana Edu account. Your username must be unique and at least 4 characters. Upload a profile image. An account number will be assigned by an admin after approval. Contact support at info@pahanaedu.lk for assistance.
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 text-center text-sm text-black font-sans">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-yellow-400 font-medium hover:text-yellow-300 transition-colors duration-200 font-sans"
              >
                Sign in
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
              aria-label="Sign up with Google"
            >
              <Chrome className="w-5 h-5 text-yellow-400" />
              Google
            </button>
            <button
              className="flex-1 py-2 bg-white text-black rounded-lg hover:bg-yellow-400 hover:text-black transition-colors duration-200 flex items-center justify-center gap-2 font-sans"
              aria-label="Sign up with Facebook"
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

export default SignUp;