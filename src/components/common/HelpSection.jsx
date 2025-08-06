import { useState, Component } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  User,
  ShoppingCart,
  MessageSquare,
  Star,
  FileText,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

// Import available video
import LoginTutorial from "../../assets/videos/login.mp4";
// Other video imports (uncomment when videos are available)
import RegisterTutorial from "../../assets/videos/register.mp4";
import ForgetPassword from "../../assets/videos/forget password.mp4";

import PlaceOrderTutorial from "../../assets/videos/place order.mp4";
import AskQuestionsTutorial from "../../assets/videos/ask question.mp4";
import FeedbackTutorial from "../../assets/videos/Add feedback.mp4";
// import ManageProfileTutorial from "../../assets/videos/manage-profile-tutorial.mp4";

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-4 text-red-600">
          <p>Something went wrong while loading this section.</p>
          <p>Please try again later or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const HelpSection = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const helpTopics = [
    {
      id: "login",
      title: "How to Log In the Pahana Edu web site",
      icon: <User className="w-6 h-6 text-yellow-400" />,
      description:
        "Access your Pahana Edu account to manage orders and profile details.",
      steps: [
        "Navigate to the Login page via the top-right user icon.",
        "Enter your registered username and password.",
        "Click 'Login' to access your account.",
        "If you forget your password, use the 'Forgot Password' link to reset it.",
      ],
      videoUrl: LoginTutorial,
    },
    {
      id: "register",
      title: "How to Register with the pahana Edu system",
      icon: <User className="w-6 h-6 text-yellow-400" />,
      description: "Create a new account to start shopping with Pahana Edu.",
      steps: [
        "Click the user icon and select 'Register'.",
        "Fill in your details: name, email, password, address, and phone number.",
        "Submit the form to create your account.",
        "Verify your email (if required) to activate your account.",
      ],
      videoUrl: RegisterTutorial, // Placeholder until video is available
    },
    {
      id: "place-order",
      title: "How to Place Orders",
      icon: <ShoppingCart className="w-6 h-6 text-yellow-400" />,
      description: "Browse and purchase books or accessories seamlessly.",
      steps: [
        "Go to the Product List page via 'Shop Now' or navigation links.",
        "Filter by category or search for a product.",
        "Click 'Add to Cart' on desired items.",
        "Proceed to checkout, enter shipping details, and confirm payment.",
      ],
      videoUrl: PlaceOrderTutorial, // Placeholder until video is available
    },
    {
      id: "ask-questions",
      title: "How to Ask Questions",
      icon: <MessageSquare className="w-6 h-6 text-yellow-400" />,
      description:
        "Get assistance by submitting inquiries to our support team.",
      steps: [
        "Navigate to the Help Section from the footer.",
        "Click the 'Contact Us' link or form.",
        "Fill out the inquiry form with your question and details.",
        "Submit to send your query to our team via the /auth/submit endpoint.",
      ],
      videoUrl: AskQuestionsTutorial, // Placeholder until video is available
    },
    {
      id: "add-feedback",
      title: "How to Add Feedback",
      icon: <Star className="w-6 h-6 text-yellow-400" />,
      description: "Share your experience to help us improve.",
      steps: [
        "Go to the Feedback section from the homepage or footer.",
        "Click 'Submit Feedback' to access the form.",
        "Enter your feedback, rating, and optional image.",
        "Submit to share your review via the /auth/createfeedback endpoint.",
      ],
      videoUrl: FeedbackTutorial, // Placeholder until video is available
    },
    {
      id: "manage-profile",
      title: "How to Manage Your Profile",
      icon: <FileText className="w-6 h-6 text-yellow-400" />,
      description: "Update your details and manage billing information.",
      steps: [
        "Log in and go to 'My Profile' from the user menu.",
        "Update details like name, address, or phone number.",
        "View order history and select a bill to download or print.",
        "Use the browser’s print function to print bills.",
      ],
      videoUrl: null, // Placeholder until video is available
    },
    {
      id: "Forget Password",
      title: "How to reset your password if forget",
      icon: <FileText className="w-6 h-6 text-yellow-400" />,
      description: "Update your password with easy way.",
      steps: [
        "Log in and go to 'My Profile' from the user menu.",
        "Update details like name, address, or phone number.",
        "View order history and select a bill to download or print.",
        "Use the browser’s print function to print bills.",
      ],
      videoUrl: ForgetPassword, // Placeholder until video is available
    },
  ];

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#FBBF24"
              fillOpacity="0.3"
              d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,128C672,107,768,117,864,149.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128V320H0Z"
            />
          </svg>
        </div>

        {/* Main Content */}
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-amber-900 tracking-tight">
              Help & Support
            </h2>
            <p className="mt-4 text-lg md:text-xl text-gray-600 font-sans max-w-2xl mx-auto">
              Learn how to use the Pahana Edu Bookshop system with our
              step-by-step guides and video tutorials.
            </p>
          </div>

          {/* Help Topics */}
          <div className="space-y-6">
            {helpTopics.map((topic) => (
              <motion.div
                key={topic.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-yellow-600/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={() => toggleSection(topic.id)}
                  className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-yellow-100 to-white text-left"
                >
                  <div className="flex items-center gap-3">
                    {topic.icon}
                    <h3 className="text-xl font-bold text-black font-sans">
                      {topic.title}
                    </h3>
                  </div>
                  <ArrowRight
                    className={`w-6 h-6 text-yellow-400 transform transition-transform duration-300 ${
                      activeSection === topic.id ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {activeSection === topic.id && (
                  <div className="p-6 border-t border-yellow-200">
                    <p className="text-gray-600 font-sans mb-4">
                      {topic.description}
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 font-sans">
                      {topic.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <div className="bg-gray-100 p-4 rounded-md flex items-center justify-center">
                        {topic.videoUrl ? (
                          <video
                            controls
                            className="w-full max-w-md mx-auto rounded-md"
                            aria-label={`Tutorial video for ${topic.title}`}
                          >
                            <source src={topic.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <p className="text-gray-600 font-sans flex items-center gap-2">
                            <HelpCircle className="w-8 h-8 text-yellow-400" />
                            Video tutorial coming soon!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-10 bg-yellow-100 py-6 px-8 rounded-lg flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-black">Still Need Help?</h3>
              <p className="text-gray-600">
                Contact our support team for personalized assistance.
              </p>
            </div>
            <Link
              to="/contact"
              className="mt-4 md:mt-0 bg-yellow-400 text-black font-semibold px-6 py-2 rounded-md hover:bg-yellow-500 transition-colors duration-300 flex items-center gap-2"
            >
              Contact Us <MessageSquare className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default HelpSection;
