import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const Product = () => {
  const [active, setActive] = useState({
    id: 0,
    product: "all",
  });

  const productTitle = [
    { id: 0, title: "All", product: "all" },
    { id: 1, title: "Newest", product: "newest" },
    { id: 2, title: "Best Seller", product: "best seller" },
    { id: 3, title: "Offers", product: "offers" },
  ];

const products = [
  {
    title: "The Alchemist",
    status: "New",
    price: "LKR 1,200",
    image: "https://images.pexels.com/photos/1005324/pexels-photo-1005324.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    currentPrice: "LKR 1,000",
    product: "newest",
  },
  {
    title: "Matilda",
    status: "New",
    price: "LKR 800",
    image: "https://images.pexels.com/photos/159711/books-reading-book-reading-education-159711.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    product: "newest",
  },
  {
    title: "Oxford English Dictionary",
    status: "New",
    price: "LKR 2,500",
    image: "https://images.pexels.com/photos/256405/pexels-photo-256405.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    currentPrice: "LKR 2,200",
    product: "newest",
  },
  {
    title: "Fountain Pen",
    status: "New",
    price: "LKR 500",
    image: "https://images.pexels.com/photos/6256/pen-writing-notes-studying.jpg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    product: "newest",
  },
  {
    title: "1984",
    status: "Best Seller",
    price: "LKR 1,300",
    image: "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    product: "best seller",
  },
  {
    title: "The Very Hungry Caterpillar",
    status: "Best Seller",
    price: "LKR 900",
    image: "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    product: "best seller",
  },
  {
    title: "Grade 10 Science Textbook",
    status: "Best Seller",
    price: "LKR 1,800",
    image: "https://images.pexels.com/photos/256405/pexels-photo-256405.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    product: "best seller",
  },
  {
    title: "Notebook Set",
    status: "Best Seller",
    price: "LKR 600",
    image: "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    product: "best seller",
  },
  {
    title: "To Kill a Mockingbird",
    status: "Offer",
    price: "LKR 1,100",
    image: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    currentPrice: "LKR 900",
    product: "offers",
  },
  {
    title: "Charlotte's Web",
    status: "Offer",
    price: "LKR 700",
    image: "https://images.pexels.com/photos/1053689/pexels-photo-1053689.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    currentPrice: "LKR 600",
    product: "offers",
  },
  {
    title: "A/L Physics Textbook",
    status: "Offer",
    price: "LKR 2,000",
    image: "https://images.pexels.com/photos/256405/pexels-photo-256405.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    currentPrice: "LKR 1,800",
    product: "offers",
  },
  {
    title: "Bookmark Set",
    status: "Offer",
    price: "LKR 300",
    image: "https://images.pexels.com/photos/276781/pexels-photo-276781.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    currentPrice: "LKR 250",
    product: "offers",
  },
];


  const productFilter =
    active?.product === "all"
      ? products
      : products.filter((product) => product.product === active?.product);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <div className="lg:container mx-auto px-6 py-16 bg-gradient-to-b from-white to-blue-50 relative">

      {/* Decorative Shapes */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-400 rounded-full opacity-10 blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-20 w-60 h-60 bg-blue-600 rounded-full opacity-10 blur-3xl animate-float-delayed"></div>

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-5">Our Products</h2>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {productTitle?.map((title) => (
            <button
              key={title?.id}
              onClick={() =>
                setActive({ id: title?.id, product: title?.product })
              }
              className={`text-base font-bold uppercase px-4 py-1 rounded-full transition-colors duration-300 ${
                active?.id === title?.id
                  ? "bg-yellow-400 text-black"
                  : "text-gray-400 hover:text-yellow-500"
              }`}
            >
              {title?.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productFilter?.map((product, index) => (
          <motion.div
            key={index}
            className="p-4 bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl shadow-xl"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <div className="relative mb-4">
                    <img
            className="w-full h-40 rounded-md object-cover"
            src={product.image}
            alt={product.title}
            />

              {product?.status && (
                <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2 py-1 rounded-lg shadow">
                  <span className="text-xs font-bold">{product?.status}</span>
                </div>
              )}
            </div>
            <div className="p-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base text-gray-900 font-bold">{product?.title}</h4>
              </div>
              <p className="text-lg flex items-center gap-2 text-gray-800 font-semibold mb-3">
                {product?.price}
                {product?.currentPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {product?.currentPrice}
                  </span>
                )}
              </p>
              <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-yellow-400 text-black rounded-md font-semibold hover:bg-yellow-500 transition duration-300 shadow">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Custom CSS for Floating Shapes */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-30px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Product;













