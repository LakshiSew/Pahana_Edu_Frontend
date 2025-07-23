// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ShoppingCart } from "lucide-react";
// import axios from "axios";

// const Product = () => {
//   const [active, setActive] = useState({ id: 0, product: "all" });
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [cartMessage, setCartMessage] = useState("");
//   const navigate = useNavigate();

//   const productTitle = [
//     { id: 0, title: "All", product: "all" },
//     { id: 1, title: "Newest", product: "newest" },
//     { id: 2, title: "Best Seller", product: "best seller" },
//     { id: 3, title: "Offers", product: "offers" },
//   ];

//   const API_BASE_URL = "http://localhost:8080"; // Replace with your backend URL

//   // Fetch products based on the active filter
//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         let fetchedProducts = [];

//         if (active.product === "all") {
//           const [booksResponse, accessoriesResponse] = await Promise.all([
//             axios.get(`${API_BASE_URL}/auth/getallbooks`),
//             axios.get(`${API_BASE_URL}/auth/getallaccessories`),
//           ]);

//           const books = booksResponse.data
//             .filter((book) => book.status === "Active")
//             .map((book) => ({
//               title: book.title,
//               status: book.status,
//               price: `LKR ${book.price.toFixed(2)}`,
//               image: book.image || "https://via.placeholder.com/150",
//               currentPrice: book.discount
//                 ? `LKR ${(book.price * (1 - book.discount / 100)).toFixed(2)}`
//                 : null,
//               product: "all",
//               type: "Book",
//               id: book.bookId,
//               stockQty: book.stockQty || 0,
//             }));

//           const accessories = accessoriesResponse.data
//             .filter((accessory) => accessory.status === "Active")
//             .map((accessory) => ({
//               title: accessory.itemName,
//               status: accessory.status,
//               price: `LKR ${accessory.price.toFixed(2)}`,
//               image: accessory.image || "https://via.placeholder.com/150",
//               currentPrice: accessory.discount
//                 ? `LKR ${(accessory.price * (1 - accessory.discount / 100)).toFixed(2)}`
//                 : null,
//               product: "all",
//               type: "Accessory",
//               id: accessory.id,
//               stockQty: accessory.stockQty || 0,
//             }));

//           fetchedProducts = [...books, ...accessories];

//         } else if (active.product === "newest") {
//           const [booksResponse, accessoriesResponse] = await Promise.all([
//             axios.get(`${API_BASE_URL}/auth/getallbooks`),
//             axios.get(`${API_BASE_URL}/auth/getallaccessories`),
//           ]);

//           const books = booksResponse.data
//             .filter((book) => book.status === "Active")
//             .map((book) => ({
//               title: book.title,
//               status: book.status,
//               price: `LKR ${book.price.toFixed(2)}`,
//               image: book.image || "https://via.placeholder.com/150",
//               currentPrice: book.discount
//                 ? `LKR ${(book.price * (1 - book.discount / 100)).toFixed(2)}`
//                 : null,
//               product: "newest",
//               type: "Book",
//               id: book.bookId,
//               createdAt: book.createdAt,
//               stockQty: book.stockQty || 0,
//             }));

//           const accessories = accessoriesResponse.data
//             .filter((accessory) => accessory.status === "Active")
//             .map((accessory) => ({
//               title: accessory.itemName,
//               status: accessory.status,
//               price: `LKR ${accessory.price.toFixed(2)}`,
//               image: accessory.image || "https://via.placeholder.com/150",
//               currentPrice: accessory.discount
//                 ? `LKR ${(accessory.price * (1 - accessory.discount / 100)).toFixed(2)}`
//                 : null,
//               product: "newest",
//               type: "Accessory",
//               id: accessory.id,
//               createdAt: accessory.createdAt,
//               stockQty: accessory.stockQty || 0,
//             }));

//           fetchedProducts = [...books, ...accessories]
//             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//             .slice(0, 8);

//         } else if (active.product === "best seller") {
//           const response = await axios.get(`${API_BASE_URL}/auth/getbestsellers`);
//           fetchedProducts = response.data
//             .filter((item) => item.status === "Active")
//             .slice(0, 8)
//             .map((item) => ({
//               title: item.title,
//               status: item.status,
//               price: `LKR ${item.price.toFixed(2)}`,
//               image: item.image || "https://via.placeholder.com/150",
//               currentPrice: item.discount
//                 ? `LKR ${(item.price * (1 - item.discount / 100)).toFixed(2)}`
//                 : null,
//               product: "best seller",
//               type: item.type,
//               id: item.id,
//               stockQty: item.stockQty || 0,
//             }));

//         } else if (active.product === "offers") {
//           const [booksResponse, accessoriesResponse] = await Promise.all([
//             axios.get(`${API_BASE_URL}/auth/getallbooks`),
//             axios.get(`${API_BASE_URL}/auth/getallaccessories`),
//           ]);

//           const books = booksResponse.data
//             .filter((book) => book.discount && book.discount > 0 && book.status === "Active")
//             .map((book) => ({
//               title: book.title,
//               status: book.status,
//               price: `LKR ${book.price.toFixed(2)}`,
//               image: book.image || "https://via.placeholder.com/150",
//               currentPrice: `LKR ${(book.price * (1 - book.discount / 100)).toFixed(2)}`,
//               product: "offers",
//               type: "Book",
//               id: book.bookId,
//               stockQty: book.stockQty || 0,
//             }));

//           const accessories = accessoriesResponse.data
//             .filter((accessory) => accessory.discount && accessory.discount > 0 && accessory.status === "Active")
//             .map((accessory) => ({
//               title: accessory.itemName,
//               status: accessory.status,
//               price: `LKR ${accessory.price.toFixed(2)}`,
//               image: accessory.image || "https://via.placeholder.com/150",
//               currentPrice: `LKR ${(accessory.price * (1 - accessory.discount / 100)).toFixed(2)}`,
//               product: "offers",
//               type: "Accessory",
//               id: accessory.id,
//               stockQty: accessory.stockQty || 0,
//             }));

//           fetchedProducts = [...books, ...accessories];
//         }

//         setProducts(fetchedProducts);
//       } catch (err) {
//         setError("Failed to fetch products. Please try again later.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [active.product]);

//   const handleAddToCart = async (product) => {
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userId");
//     if (!token || !userId) {
//       navigate("/login");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/add`,
//         {
//           userId,
//           productId: product.id,
//           productType: product.type,
//           quantity: 1,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("Add to cart response:", response.data);
//       setCartMessage(`${product.title} has been added to your cart!`);
//       setTimeout(() => setCartMessage(""), 3000);
//       triggerStarAnimation(product.id);
//       setTimeout(() => {
//         const cartUpdateEvent = new Event("cartUpdated");
//         window.dispatchEvent(cartUpdateEvent);
//         console.log("Dispatched cartUpdated event");
//       }, 1000);
//     } catch (err) {
//       console.error("Failed to add to cart:", err.response?.data || err.message);
//       setError(err.response?.data?.message || "Failed to add product to cart.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const triggerStarAnimation = (productId) => {
//     const addButton = document.querySelector(`#add-to-cart-${productId}`);
//     const cartIcon = document.querySelector(".cart-icon");

//     if (!addButton || !cartIcon) {
//       console.error("Add button or cart icon not found");
//       return;
//     }

//     const star = document.createElement("div");
//     star.className = "star-animation";
//     document.body.appendChild(star);

//     const buttonRect = addButton.getBoundingClientRect();
//     const cartRect = cartIcon.getBoundingClientRect();

//     star.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
//     star.style.top = `${buttonRect.top + buttonRect.height / 2}px`;

//     const deltaX = cartRect.left + cartRect.width / 2 - (buttonRect.left + buttonRect.width / 2);
//     const deltaY = cartRect.top + cartRect.height / 2 - (buttonRect.top + buttonRect.height / 2);

//     star.animate(
//       [
//         { transform: "translate(0, 0) scale(1)", opacity: 1 },
//         { transform: `translate(${deltaX / 2}px, ${deltaY - 100}px) scale(0.7)`, opacity: 0.7, offset: 0.5 },
//         { transform: `translate(${deltaX}px, ${deltaY}px) scale(0.5)`, opacity: 0.5 },
//       ],
//       {
//         duration: 1000,
//         easing: "ease-in-out",
//         fill: "forwards",
//       }
//     );

//     setTimeout(() => {
//       star.remove();
//     }, 1000);

//     cartIcon.classList.add("shake");
//     setTimeout(() => {
//       cartIcon.classList.remove("shake");
//     }, 200);
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
//     hover: { scale: 1.05, transition: { duration: 0.3 } },
//   };

//   return (
//     <div className="lg:container mx-auto px-6 py-16 bg-gradient-to-b from-white to-blue-50 relative">
//       {/* Decorative Shapes */}
//       <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-400 rounded-full opacity-10 blur-3xl animate-float"></div>
//       <div className="absolute bottom-10 right-20 w-60 h-60 bg-blue-600 rounded-full opacity-10 blur-3xl animate-float-delayed"></div>

//       {/* Cart Message and Error */}
//       {cartMessage && (
//         <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
//           {cartMessage}
//         </div>
//       )}
//       {error && (
//         <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
//           {error}
//         </div>
//       )}

//       <div className="flex flex-col items-center justify-center">
//         <h2 className="text-3xl font-bold text-yellow-400 text-center mb-5">Our Products</h2>

//         <div className="flex flex-wrap justify-center gap-4 mb-10">
//           {productTitle?.map((title) => (
//             <button
//               key={title?.id}
//               onClick={() => setActive({ id: title?.id, product: title?.product })}
//               className={`text-base font-bold uppercase px-4 py-1 rounded-full transition-colors duration-300 ${
//                 active?.id === title?.id
//                   ? "bg-yellow-400 text-black"
//                   : "text-gray-400 hover:text-yellow-500"
//               }`}
//             >
//               {title?.title}
//             </button>
//           ))}
//         </div>
//       </div>

//       {loading && <p className="text-center text-gray-600">Loading...</p>}
//       {error && !cartMessage && <p className="text-center text-red-500">{error}</p>}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {products?.map((product, index) => (
//           <motion.div
//             key={index}
//             className="p-4 bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl shadow-xl"
//             variants={cardVariants}
//             initial="hidden"
//             animate="visible"
//             whileHover="hover"
//           >
//             <div className="relative mb-4">
//               <img
//                 className="w-full h-40 rounded-md object-cover"
//                 src={product.image}
//                 alt={product.title}
//               />
//               {product?.status && (
//                 <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2 py-1 rounded-lg shadow">
//                   <span className="text-xs font-bold">{product?.status}</span>
//                 </div>
//               )}
//             </div>
//             <div className="p-1">
//               <div className="flex items-center justify-between mb-2">
//                 <h4 className="text-base text-gray-900 font-bold">{product?.title}</h4>
//               </div>
//               <p className="text-lg flex items-center gap-2 text-gray-800 font-semibold mb-3">
//                 {product?.currentPrice || product?.price}
//                 {product?.currentPrice && (
//                   <span className="text-sm text-gray-400 line-through">
//                     {product?.price}
//                   </span>
//                 )}
//               </p>
//               <button
//                 id={`add-to-cart-${product.id}`}
//                 onClick={() => handleAddToCart(product)}
//                 className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-yellow-400 text-black rounded-md font-semibold hover:bg-yellow-500 transition duration-300 shadow"
//                 disabled={product.stockQty === 0}
//               >
//                 <ShoppingCart className="w-5 h-5" />
//                 Add to Cart
//               </button>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       <style jsx>{`
//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-20px);
//           }
//         }
//         @keyframes float-delayed {
//           0%,
//           100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-30px);
//           }
//         }
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }
//         .animate-float-delayed {
//           animation: float-delayed 8s ease-in-out infinite;
//         }
//         .star-animation {
//           position: fixed;
//           width: 20px;
//           height: 20px;
//           background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="yellow"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>') no-repeat center;
//           background-size: contain;
//           z-index: 1000;
//         }
//         .shake {
//           animation: shake 0.2s ease-in-out;
//         }
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           50% { transform: translateX(-5px); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Product;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import axios from "axios";

const Product = () => {
  const [active, setActive] = useState({ id: 0, product: "all" });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const navigate = useNavigate();

  const productTitle = [
    { id: 0, title: "All", product: "all" },
    { id: 1, title: "Newest", product: "newest" },
    { id: 2, title: "Best Seller", product: "best seller" },
    { id: 3, title: "Offers", product: "offers" },
  ];

  const API_BASE_URL = "http://localhost:8080"; // Replace with your backend URL

  // Fetch products based on the active filter
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let fetchedProducts = [];

        if (active.product === "all") {
          const booksResponse = await axios.get(`${API_BASE_URL}/auth/getallbooks`);

          fetchedProducts = booksResponse.data
            .filter((book) => book.status === "Active")
            .map((book) => ({
              title: book.title,
              status: book.status,
              price: `LKR ${book.price.toFixed(2)}`,
              image: book.image || "https://via.placeholder.com/150",
              currentPrice: book.discount
                ? `LKR ${(book.price * (1 - book.discount / 100)).toFixed(2)}`
                : null,
              product: "all",
              type: "Book",
              id: book.bookId,
              stockQty: book.stockQty || 0,
            }));

        } else if (active.product === "newest") {
          const booksResponse = await axios.get(`${API_BASE_URL}/auth/getallbooks`);

          fetchedProducts = booksResponse.data
            .filter((book) => book.status === "Active")
            .map((book) => ({
              title: book.title,
              status: book.status,
              price: `LKR ${book.price.toFixed(2)}`,
              image: book.image || "https://via.placeholder.com/150",
              currentPrice: book.discount
                ? `LKR ${(book.price * (1 - book.discount / 100)).toFixed(2)}`
                : null,
              product: "newest",
              type: "Book",
              id: book.bookId,
              createdAt: book.createdAt,
              stockQty: book.stockQty || 0,
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4);

        } else if (active.product === "best seller") {
          const response = await axios.get(`${API_BASE_URL}/auth/getbestsellers`);
          fetchedProducts = response.data
            .filter((item) => item.type === "Book" && item.status === "Active")
            .slice(0, 4)
            .map((item) => ({
              title: item.title,
              status: item.status,
              price: `LKR ${item.price.toFixed(2)}`,
              image: item.image || "https://via.placeholder.com/150",
              currentPrice: item.discount
                ? `LKR ${(item.price * (1 - item.discount / 100)).toFixed(2)}`
                : null,
              product: "best seller",
              type: "Book",
              id: item.id,
              stockQty: item.stockQty || 0,
            }));

        } else if (active.product === "offers") {
          const booksResponse = await axios.get(`${API_BASE_URL}/auth/getallbooks`);

          fetchedProducts = booksResponse.data
            .filter((book) => book.discount && book.discount > 0 && book.status === "Active")
            .map((book) => ({
              title: book.title,
              status: book.status,
              price: `LKR ${book.price.toFixed(2)}`,
              image: book.image || "https://via.placeholder.com/150",
              currentPrice: `LKR ${(book.price * (1 - book.discount / 100)).toFixed(2)}`,
              product: "offers",
              type: "Book",
              id: book.bookId,
              stockQty: book.stockQty || 0,
            }));
        }

        setProducts(fetchedProducts);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [active.product]);

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
      setCartMessage(`${product.title} has been added to your cart!`);
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

      {/* Cart Message and Error */}
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

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-5">Our Books</h2>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {productTitle?.map((title) => (
            <button
              key={title?.id}
              onClick={() => setActive({ id: title?.id, product: title?.product })}
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

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && !cartMessage && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.map((product, index) => (
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
                {product?.currentPrice || product?.price}
                {product?.currentPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {product?.price}
                  </span>
                )}
              </p>
              <button
                id={`add-to-cart-${product.id}`}
                onClick={() => handleAddToCart(product)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-yellow-400 text-black rounded-md font-semibold hover:bg-yellow-500 transition duration-300 shadow"
                disabled={product.stockQty === 0}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>

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

export default Product;
