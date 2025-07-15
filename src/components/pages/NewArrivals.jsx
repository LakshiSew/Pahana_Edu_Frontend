import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    { categoryId: "0", categoryName: "All Categories", description: "All products", status: "Active" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:8080"; // Replace with your backend URL

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/getallcategories`);
        const activeCategories = response.data.filter((cat) => cat.status === "Active");
        setCategories([
          { categoryId: "0", categoryName: "All Categories", description: "All products", status: "Active" },
          ...activeCategories,
        ]);
      } catch (err) {
        setError(err.message || "Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  // Fetch newest products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const [booksResponse, accessoriesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/auth/getallbooks`),
          axios.get(`${API_BASE_URL}/auth/getallaccessories`),
        ]);

        const books = booksResponse.data
          .filter((book) => book.status === "Active")
          .map((book) => ({
            id: book.bookId,
            categoryId: book.categoryId,
            name: book.title,
            author: book.author,
            aboutAuthor: book.aboutAuthor || "N/A",
            pages: book.pages || "N/A",
            publisherName: book.publisherName || "N/A",
            language: book.language || "N/A",
            publicationYear: book.publicationYear || "N/A",
            price: book.price,
            discount: book.discount || 0,
            description: book.description || "N/A",
            image: book.image || "https://via.placeholder.com/400",
            stockQty: book.stockQty || 0,
            status: book.status === "Active" ? "Available" : "Out of Stock",
            type: "Book",
            pdf: book.pdf || null,
            createdAt: book.createdAt || new Date().toISOString(),
            updatedAt: book.updatedAt || new Date().toISOString(),
          }));

        const accessories = accessoriesResponse.data
          .filter((acc) => acc.status === "Active")
          .map((acc) => ({
            id: acc.id,
            categoryId: acc.categoryId,
            name: acc.itemName,
            brand: acc.brand || "N/A",
            price: acc.price,
            discount: acc.discount || 0,
            description: acc.description || "N/A",
            image: acc.image || "https://via.placeholder.com/400",
            stockQty: acc.stockQty || 0,
            status: acc.status === "Active" ? "Available" : "Out of Stock",
            type: "Accessory",
            createdAt: acc.createdAt || new Date().toISOString(),
            updatedAt: acc.updatedAt || new Date().toISOString(),
          }));

        const newArrivals = [...books, ...accessories]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6)
          .filter((product) => product.status === "Available");

        setProducts(newArrivals);
      } catch (err) {
        setError(err.message || "Failed to load new arrivals.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSeeMore = (product) => {
    navigate(`/productDetails/${product.id}`, { state: { product } });
  };

  const getDiscountedPrice = (price, discount) => {
    return discount > 0 ? price * (1 - discount / 100) : price;
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/add`,
        {
          userId,
          productId: product.id,
          productType: product.type,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Add to cart response:", response.data);
      setCartMessage(`${product.name} has been added to your cart!`);
      setTimeout(() => setCartMessage(""), 3000);
      triggerStarAnimation(product.id);
      setTimeout(() => {
        const cartUpdateEvent = new Event("cartUpdated");
        window.dispatchEvent(cartUpdateEvent);
        console.log("Dispatched cartUpdated event");
      }, 1000);
    } catch (err) {
      console.error("Failed to add to cart:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to add product to cart.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const triggerStarAnimation = (productId) => {
    const addButton = document.querySelector(`#add-to-cart-${productId}`);
    const cartIcon = document.querySelector(".cart-icon");

    if (!addButton || !cartIcon) {
      console.error("Add button or cart icon not found");
      return;
    }

    const star = document.createElement("div");
    star.className = "star-animation";
    document.body.appendChild(star);

    const buttonRect = addButton.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    star.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
    star.style.top = `${buttonRect.top + buttonRect.height / 2}px`;

    const deltaX = cartRect.left + cartRect.width / 2 - (buttonRect.left + buttonRect.width / 2);
    const deltaY = cartRect.top + cartRect.height / 2 - (buttonRect.top + buttonRect.height / 2);

    star.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${deltaX / 2}px, ${deltaY - 100}px) scale(0.7)`, opacity: 0.7, offset: 0.5 },
        { transform: `translate(${deltaX}px, ${deltaY}px) scale(0.5)`, opacity: 0.5 },
      ],
      {
        duration: 1000,
        easing: "ease-in-out",
        fill: "forwards",
      }
    );

    setTimeout(() => {
      star.remove();
    }, 1000);

    cartIcon.classList.add("shake");
    setTimeout(() => {
      cartIcon.classList.remove("shake");
    }, 200);
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-b from-blue-50 to-white [clip-path:polygon(0_0,100%_0,100%_85%,0_100%)]"></div>
      </div>

      <div className="relative z-10 bg-transparent text-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {cartMessage && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
              {cartMessage}
            </div>
          )}
          {error && (
            <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
              {error}
            </div>
          )}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              New Arrivals
            </h2>
            <p className="mt-4 text-lg md:text-xl text-gray-600 font-sans max-w-2xl mx-auto">
              Check out the latest additions to our collection of books and stationery!
            </p>
          </div>

          {loading ? (
            <div className="text-center text-gray-600 font-sans text-lg">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-600 font-sans text-lg">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-600 font-sans text-lg">
              No new arrivals available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  className="relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-yellow-600/50 flex flex-col h-[480px]"
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-600 to-amber-900 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                      {product.discount > 0 ? (
                        <>
                          <span className="line-through mr-2">Rs. {Number(product.price).toFixed(2)}</span>
                          <span>Rs. {getDiscountedPrice(product.price, product.discount).toFixed(2)}</span>
                          <span className="ml-2 text-xs">({product.discount}% off)</span>
                        </>
                      ) : (
                        <span>Rs. {Number(product.price).toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col flex-grow p-6">
                    <div className="flex-grow space-y-2">
                      <h3 className="text-xl font-bold text-black truncate font-sans">{product.name}</h3>
                      <p className="text-sm text-gray-600 font-sans">
                        {product.type === "Book" ? `by ${product.author}` : `Brand: ${product.brand}`}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-sans">Category:</span>
                          <span className="font-medium text-black font-sans">
                            {categories.find((cat) => cat.categoryId === product.categoryId)?.categoryName || "Unknown"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-sans">Stock:</span>
                          <span className="font-medium text-green-600 font-sans">
                            {product.stockQty > 0 ? `${product.stockQty} Available` : "Out of Stock"}
                          </span>
                        </div>
                        {product.type === "Book" && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 font-sans">Pages:</span>
                              <span className="font-medium text-black font-sans">{product.pages || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 font-sans">Publisher:</span>
                              <span className="font-medium text-black font-sans">{product.publisherName || "N/A"}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 mt-4">
                      <button
                        onClick={() => handleSeeMore(product)}
                        className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-900 text-white font-sans py-2 px-4 rounded-full font-semibold text-md hover:bg-gradient-to-r hover:from-yellow-700 hover:to-amber-950 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Eye className="w-5 h-5" /> See More
                      </button>
                      <button
                        id={`add-to-cart-${product.id}`}
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-sans py-2 px-4 rounded-full font-semibold text-md hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center justify-center gap-2"
                        disabled={product.stockQty === 0}
                      >
                        <ShoppingCart className="w-5 h-5" /> Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .star-animation {
          position: fixed;
          width: 20px;
          height: 20px;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="yellow"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>') no-repeat center;
          background-size: contain;
          z-index: 1000;
        }
        .shake {
          animation: shake 0.2s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-5px); }
        }
      `}</style>
    </div>
  );
};

export default NewArrivals;