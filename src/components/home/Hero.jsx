import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";


const API_URL = "http://localhost:8080";

const FALLBACK_IMAGE = "/src/assets/images/back.jpg";

const Hero = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/getallcategories`);
        const activeCategories = response.data
          .filter(category => category.status === "Active")
          .slice(0, 6); 
        setCategories(activeCategories);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load categories. Please try again later.");
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500, // Reduced from 4000ms to 2500ms for faster transitions
    pauseOnHover: true,
    fade: true,
    appendDots: dots => (
      <div>
        <ul className="flex justify-center space-x-3">
          {dots.map((dot, index) => (
            <li key={index} className="inline-block">
              {React.cloneElement(dot, {
                className: `w-4 h-4 rounded-full mx-1 cursor-pointer transition-all duration-300 ${
                  dot.props.className.includes("slick-active")
                    ? "bg-yellow-400 scale-150"
                    : "bg-gray-300 opacity-50"
                }`
              })}
            </li>
          ))}
        </ul>
      </div>
    ),
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    },
  };

  const textChildVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, rotate: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 1, ease: "easeOut" }
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[550px] flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[550px] flex items-center justify-center bg-gray-100 text-red-500 text-lg font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[560px] overflow-hidden">
      {/* Background with book pattern */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/src/assets/images/back.jpg)",
        }}
      ></div>

      <div className="slider-container relative z-10">
        <Slider {...settings}>
          {categories.map((category) => (
            <div key={category.categoryId} className="relative">
              <div className="flex flex-col md:flex-row items-center justify-between min-h-[480px] md:min-h-[500px] px-4 md:px-6 lg:px-10">
                {/* Banner Text (Left Side, Wider) */}
                <motion.div
                  className="p-6 md:p-8 text-center md:text-left max-w-[600px] w-full md:ml-10 lg:ml-30"
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  <motion.p
                    variants={textChildVariants}
                    className="text-lg text-yellow-300 uppercase font-semibold tracking-widest mb-3"
                  >
                    Your Journey Starts Here
                  </motion.p>
                  <motion.p
                    variants={textChildVariants}
                    className="text-sm text-yellow-300 uppercase font-semibold tracking-widest bg-black/60 inline-block px-4 py-2 rounded-full mb-4"
                  >
                    {category.type === "book" ? "Literary Collection" : "Stationery Essentials"}
                  </motion.p>
                  <motion.h3
                    variants={textChildVariants}
                    className="text-4xl md:text-6xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-white font-extrabold capitalize leading-tight mb-4 font-serif tracking-tight drop-shadow-lg"
                  >
                    {category.categoryName}
                  </motion.h3>
                  <motion.p
                    variants={textChildVariants}
                    className="text-base text-gray-200 mb-4 font-light max-w-md leading-relaxed"
                  >
                    {category.description || "Dive into a world of imagination, knowledge, and creativity with our hand-picked collections made just for you."}
                  </motion.p>
                  <motion.p
                    variants={textChildVariants}
                    className="text-sm text-gray-300 mb-6 font-light max-w-md italic"
                  >
                    Discover exclusive offers and timeless stories curated for every reader.
                  </motion.p>
                  <motion.div variants={textChildVariants}>
                    <Link
                      to="/productList"
                      className="flex items-center justify-center gap-2 max-w-[180px] w-full h-12 bg-yellow-400 text-black rounded-full font-semibold text-lg shadow-lg hover:shadow-xl"
                      whileHover="hover"
                      variants={buttonVariants}
                    >
                      Shop Now <MoveRight className="h-5 w-5" />
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Banner Image (Right Side, Smaller) */}
                <motion.div
                  className="p-4 md:p-6 relative lg:mr-30"
                  initial="hidden"
                  animate="visible"
                  variants={imageVariants}
                >
                  <div className="relative w-full max-w-[300px] h-[300px] md:h-[340px]">
                    <div className="absolute inset-0 border-6 border-double border-yellow-400 rounded-2xl transform rotate-6 z-0 bg-black/20"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/30 to-transparent rounded-2xl z-0"></div>
                    <img
                      src={category.categoryImg || FALLBACK_IMAGE}
                      alt={category.categoryName}
                      className="relative w-full h-full object-cover rounded-2xl shadow-2xl z-10 transform hover:scale-105 transition-transform duration-300"
                      onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                    />
                    <div className="absolute -bottom-5 -left-5 w-20 h-1.5 bg-yellow-400 rounded-full transform rotate-45"></div>
                    <div className="absolute -top-5 -right-5 w-1.5 h-20 bg-yellow-400 rounded-full transform rotate-45"></div>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Yellow Wave Bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 20L60 26C120 33 240 46.5 360 50.5C480 55 600 51 720 45C840 39 960 31 1080 27.5C1200 24 1320 25 1380 26L1440 26V100H0V20Z"
          fill="url(#paint0_linear)"
        />
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="720"
            y1="20"
            x2="720"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FBBF24" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Hero;