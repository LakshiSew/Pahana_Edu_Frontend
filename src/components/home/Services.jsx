import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// ServiceCard Component
const ServiceCard = ({ title, description, image, bookImage }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  // Map title to navigation path
  const getNavigationPath = (title) => {
    switch (title) {
      case "Books":
      case "Accessories":
        return "/productList";
      case "Suggest a Book":
        return "/suggestBook";
      default:
        return "/";
    }
  };

  return (
    <motion.div
      className={`relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl overflow-hidden transition-all duration-700 hover:shadow-2xl`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-1000 hover:scale-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
        <img
          src={bookImage}
          alt="Book Icon"
          className="absolute bottom-2 left-2 w-24 md:w-28 drop-shadow-xl animate-pulse-slow"
        />
      </div>
      <div className="p-6 text-left">
        <h3 className="text-xl font-extrabold text-gray-800 mb-2 font-sans tracking-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-sm font-sans mb-4 leading-relaxed">
          {description}
        </p>
        <Link
          to={getNavigationPath(title)}
          className="px-5 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-lg text-sm font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300"
        >
          Explore Now
        </Link>
      </div>
    </motion.div>
  );
};

// Prop Validation for ServiceCard
ServiceCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  bookImage: PropTypes.string.isRequired,
};

// Services Component
const Services = () => {
  const services = [
    {
      title: "Books",
      description:
        "Explore a wide range of books for all ages and interests, from novels to textbooks.",
      image: "/src/assets/images/main/books.jpg",
      bookImage: "/src/assets/images/pahana_EDU.svg",
    },
    {
      title: "Accessories",
      description:
        "Find essential learning accessories, including pencils, notebooks, and more.",
      image: "/src/assets/images/main/Accessories.png",
      bookImage: "/src/assets/images/pahana_EDU.svg",
    },
    {
      title: "Suggest a Book",
      description:
        "Can’t find your favorite book? Suggest it, and we’ll do our best to stock it!",
      image: "/src/assets/images/main/Suggest.png",
      bookImage: "/src/assets/images/pahana_EDU.svg",
    },
  ];

  return (
    <div className="relative py-16 overflow-hidden">
      {/* Background Section */}
      <div className="absolute inset-0">
        {/* Top Half: Hero Image */}
        <div
          className="absolute top-0 left-0 w-full h-1/2 bg-cover bg-center opacity-90"
          style={{ backgroundImage: "url(/src/assets/images/main/bookService.jpeg)" }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        {/* Bottom Half: White Color */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-5 left-5 w-32 h-32 bg-yellow-200 rounded-full opacity-20 blur-3xl animate-float"></div>
      <div className="absolute bottom-5 right-10 w-48 h-48 bg-yellow-200 rounded-full opacity-20 blur-3xl animate-float-delayed"></div>

      {/* Section Content */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-yellow-400 text-xl md:text-2xl font-bold font-sans mb-3 tracking-widest uppercase">
          Our Offerings
        </h2>
        <p className="text-white text-3xl md:text-4xl font-extrabold font-sans mb-6 leading-tight">
          Discover Your Next <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-blue-600">
            Reading Adventure
          </span>
        </p>
        <p className="text-gray-100 text-base md:text-lg max-w-2xl mx-auto font-sans mb-12 leading-relaxed">
          From books to accessories, we provide everything you need for learning and creativity.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 relative">
          {services.map((service, idx) => (
            <div
              key={idx}
              className={`transform ${
                idx === 0
                  ? "md:translate-y-8"
                  : idx === 1
                  ? "md:-translate-y-8"
                  : "md:translate-y-8"
              } transition-all duration-1000`}
            >
              <ServiceCard
                title={service.title}
                description={service.description}
                image={service.image}
                bookImage={service.bookImage}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25px); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Services;