import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

// Category Card Component
const CategoryCard = ({ title, type, image }) => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 12px 24px rgba(234, 179, 8, 0.3)", 
      transition: { duration: 0.3 } 
    },
  };

  return (
    <motion.div
      className="p-4 h-[424px] relative"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="relative bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-lg shadow-lg overflow-hidden h-full">
        <div className="relative w-full h-full">
          <img
            src={image || "/src/assets/images/placeholder.jpg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            style={{ filter: "brightness(1.2) contrast(1.1)" }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70"></div>
          <motion.div
            className="absolute inset-0"
            animate={{ boxShadow: "inset 0 0 20px rgba(234, 179, 8, 0.5)" }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[140px] bg-opacity-80 flex flex-col justify-center p-4 bg-gradient-to-t from-blue-100/80 to-white/80">
          <h4 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 to-blue-800 mb-1 tracking-tight capitalize hover:text-yellow-600 transition-colors duration-300">
            {title}
          </h4>
          <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 to-blue-800 capitalize hover:text-yellow-600 transition-colors duration-300">
            {type}
          </p>
          <Link
            to={`/productList?category=${encodeURIComponent(title)}`}
            className="mt-3 inline-block px-5 py-2 bg-gradient-to-r from-yellow-600 to-amber-900 text-white text-sm font-semibold rounded-md hover:from-yellow-700 hover:to-amber-800 transition-all duration-300 shadow-md text-center"
          >
            View Category
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// TopCategory Component
const TopCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/auth/getallcategories");
        const activeCategories = response.data
          .filter(category => category.status === "Active")
          .slice(0, 10); // Limit to top 10
        console.log("Fetched categories:", activeCategories); // Debug
        setCategories(activeCategories);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "120px",
    slidesToShow: 3,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: "60px",
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerPadding: "30px",
        },
      },
    ],
  };

  return (
    <div className="relative py-20 bg-gradient-to-b from-white via-white via-70% to-blue-50 overflow-hidden">
      {/* Glowing floating shapes */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-yellow-400 rounded-full opacity-10 blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-16 w-72 h-72 bg-blue-600 rounded-full opacity-10 blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full opacity-10 blur-2xl animate-pulse-slow"></div>

      {/* Section Content */}
      <div className="container mx-auto px-4 max-w-[1300px] relative z-10">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 to-blue-800 text-center mb-12 tracking-wide">
          Discover Top Categories
        </h2>
        <div className="slider-container w-full h-[450px]">
          {loading ? (
            <p className="text-center text-gray-500 font-semibold">Loading categories...</p>
          ) : categories.length > 0 ? (
            <Slider {...settings}>
              {categories.map((category, index) => (
                <CategoryCard
                  key={index}
                  title={category.categoryName}
                  type={category.type}
                  image={category.categoryImg}
                />
              ))}
            </Slider>
          ) : (
            <p className="text-center text-gray-500 font-semibold">No categories available</p>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TopCategory;