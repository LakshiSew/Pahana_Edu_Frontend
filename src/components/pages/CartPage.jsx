// import React, { useState, useEffect } from "react";
// import { X, Minus, Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const API_URL = "http://localhost:8080";

// const CartPage = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userId");
//     if (!token || !userId) {
//       toast.warn("Please log in to view your cart", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       navigate("/login");
//       return;
//     }

//     const fetchCart = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const cartItemsRaw = response.data.items || [];

//         // Fetch product details for each cart item
//         const cartItemsWithDetails = await Promise.all(
//           cartItemsRaw.map(async (item) => {
//             try {
//               let product;
//               if (item.productType === "Book") {
//                 product = await axios.get(
//                   `${API_URL}/auth/getbookbyid/${item.productId}`,
//                   {
//                     headers: { Authorization: `Bearer ${token}` },
//                   }
//                 );
//               } else if (item.productType === "Accessory") {
//                 product = await axios.get(
//                   `${API_URL}/auth/getaccessorybyid/${item.productId}`,
//                   {
//                     headers: { Authorization: `Bearer ${token}` },
//                   }
//                 );
//               } else {
//                 console.warn(
//                   `Invalid product type for item: ${item.productId}`
//                 );
//                 return null;
//               }
//               const discount = product.data.discount || 0;
//               const discountedPrice = product.data.price * (1 - discount / 100);
//               return {
//                 id: item.id,
//                 productId: item.productId,
//                 name:
//                   item.productType === "Book"
//                     ? product.data.title
//                     : product.data.itemName,
//                 price: discountedPrice, // Apply discount
//                 originalPrice: product.data.price, // Store original price
//                 discount: discount, // Store discount percentage
//                 quantity: item.quantity,
//                 productType: item.productType,
//                 image: product.data.image || "https://via.placeholder.com/80",
//               };
//             } catch (err) {
//               console.error(
//                 `Failed to fetch product ${item.productId}:`,
//                 err.response?.data || err.message
//               );
//               return null;
//             }
//           })
//         );

//         const validItems = cartItemsWithDetails.filter(
//           (item) => item && item.name && item.price
//         );
//         if (validItems.length === 0) {
//           setError("Cart empty");
//           console.warn("All cart items filtered out due to missing data");
//         }
//         setCartItems(validItems);
//         setLoading(false);
//       } catch (err) {
//         console.error("Cart fetch error:", err.response?.data || err.message);
//         setError(
//           err.response?.status === 401
//             ? "Session expired. Please log in again."
//             : err.message || "Failed to load cart."
//         );
//         if (err.response?.status === 401) navigate("/login");
//         setLoading(false);
//       }
//     };

//     fetchCart();
//   }, [navigate]);

//   const handleQtyChange = async (id, delta) => {
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userId");
//     try {
//       const item = cartItems.find((item) => item.id === id);
//       const newQuantity = Math.max(item.quantity + delta, 1);
//       const response = await axios.put(
//         `${API_URL}/update`,
//         {
//           userId,
//           productId: item.productId,
//           productType: item.productType,
//           quantity: newQuantity,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCartItems((prev) =>
//         prev.map((item) =>
//           item.id === id ? { ...item, quantity: newQuantity } : item
//         )
//       );
//       toast.success("Quantity updated", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     } catch (err) {
//       console.error(
//         "Quantity update error:",
//         err.response?.data || err.message
//       );
//       toast.error(
//         err.response?.status === 401
//           ? "Session expired. Please log in again."
//           : err.message || "Failed to update quantity.",
//         { position: "top-right", autoClose: 3000 }
//       );
//       if (err.response?.status === 401) navigate("/login");
//     }
//   };

//   const handleRemove = async (id) => {
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userId");
//     try {
//       await axios.delete(`${API_URL}/remove/${userId}/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCartItems((prev) => prev.filter((item) => item.id !== id));
//       toast.success("Item removed from cart", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     } catch (err) {
//       console.error("Remove item error:", err.response?.data || err.message);
//       toast.error(
//         err.response?.status === 401
//           ? "Session expired. Please log in again."
//           : err.message || "Failed to remove item.",
//         { position: "top-right", autoClose: 3000 }
//       );
//       if (err.response?.status === 401) navigate("/login");
//     }
//   };

//   const handleClearCart = async () => {
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userId");
//     try {
//       await axios.delete(`${API_URL}/clear/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCartItems([]);
//       toast.success("Cart cleared successfully", {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     } catch (err) {
//       console.error("Clear cart error:", err.response?.data || err.message);
//       toast.error(
//         err.response?.status === 401
//           ? "Session expired. Please log in again."
//           : err.message || "Failed to clear cart.",
//         { position: "top-right", autoClose: 3000 }
//       );
//       if (err.response?.status === 401) navigate("/login");
//     }
//   };

//   const subtotal = cartItems
//     .reduce((sum, item) => sum + item.price * item.quantity, 0)
//     .toFixed(2);

//   if (loading) {
//     return (
//       <div className="text-center text-gray-600 font-sans text-lg">
//         Loading...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-600 font-sans text-lg">{error}</div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 mt-6">
//       <ToastContainer />
//       <h2 className="text-2xl font-bold mb-4">🛒 Shopping Cart</h2>

//       <div className="grid md:grid-cols-3 gap-8">
//         <div className="md:col-span-2 space-y-6">
//           {cartItems.length === 0 ? (
//             <div className="text-center text-gray-600 font-sans text-lg">
//               Your cart is empty.
//             </div>
//           ) : (
//             <>
//               {cartItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex gap-4 items-center border-b pb-4"
//                 >
//                   <button
//                     onClick={() => handleRemove(item.id)}
//                     className="text-gray-500 hover:text-red-500"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                   <img
//                     src={item.image || "https://via.placeholder.com/80"}
//                     alt={item.name || "Product"}
//                     className="w-20 h-24 object-cover rounded"
//                   />
//                   <div className="flex-1">
//                     <h4 className="font-semibold">
//                       {item.name || "Unknown Product"}
//                     </h4>
//                     <div className="text-sm mt-1">
//                       Price:{" "}
//                       <span className="font-medium text-gray-800">
//                         Rs. {item.price.toFixed(2)}
//                       </span>
//                       {item.discount > 0 && (
//                         <span className="text-gray-500 line-through ml-2">
//                           Rs. {item.originalPrice.toFixed(2)}
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex items-center mt-2 space-x-2">
//                       <button
//                         className="p-1 border rounded hover:bg-gray-100"
//                         onClick={() => handleQtyChange(item.id, -1)}
//                       >
//                         <Minus className="w-4 h-4" />
//                       </button>
//                       <span>{item.quantity}</span>
//                       <button
//                         className="p-1 border rounded hover:bg-gray-100"
//                         onClick={() => handleQtyChange(item.id, 1)}
//                       >
//                         <Plus className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                   <div className="font-semibold text-right w-24">
//                     Rs. {(item.price * item.quantity).toFixed(2)}
//                     {item.discount > 0 && (
//                       <span className="text-gray-500 line-through block">
//                         Rs. {(item.originalPrice * item.quantity).toFixed(2)}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               <button
//                 onClick={handleClearCart}
//                 className="mt-4 text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-100 transition"
//               >
//                 Clear Cart
//               </button>
//             </>
//           )}

//           <button
//             onClick={() => navigate("/productList")}
//             className="mt-6 text-orange-600 border border-orange-600 px-4 py-2 rounded hover:bg-orange-100 transition"
//           >
//             ← Continue Shopping
//           </button>
//         </div>

//         <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
//           <h3 className="text-xl font-semibold border-b pb-2">Cart Totals</h3>
//           <div className="flex justify-between">
//             <span>Subtotal</span>
//             <span className="font-semibold">Rs. {subtotal}</span>
//           </div>

//           <div className="mt-4">
//             <span className="block font-medium mb-2">Shipping</span>
//             <label className="block mb-2">
//               <input
//                 type="radio"
//                 name="shipping"
//                 defaultChecked
//                 className="mr-2"
//               />
//               Free shipping (3–5 days)
//             </label>
//             <label className="block">
//               <input type="radio" name="shipping" className="mr-2" />
//               Pickup from Warehouse (Nugegoda): FREE
//             </label>
//           </div>

//           <div className="flex justify-between font-bold text-lg border-t pt-2">
//             <span>Total</span>
//             <span>Rs. {subtotal}</span>
//           </div>

//           <button
//             onClick={() => navigate("/check")}
//             className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-2 rounded transition mt-2"
//             disabled={cartItems.length === 0}
//           >
//             PROCEED TO CHECKOUT
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartPage;

import React, { useState, useEffect } from "react";
import { X, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:8080";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const fetchCart = async () => {
      try {
        const response = await axios.get(`${API_URL}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartItemsRaw = response.data.items || [];

        const cartItemsWithDetails = await Promise.all(
          cartItemsRaw.map(async (item) => {
            try {
              let product;
              if (item.productType === "Book") {
                product = await axios.get(
                  `${API_URL}/auth/getbookbyid/${item.productId}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
              } else if (item.productType === "Accessory") {
                product = await axios.get(
                  `${API_URL}/auth/getaccessorybyid/${item.productId}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
              } else {
                console.warn(
                  `Invalid product type for item: ${item.productId}`
                );
                return null;
              }
              const discount = product.data.discount || 0;
              const discountedPrice = product.data.price * (1 - discount / 100);
              return {
                id: item.id,
                productId: item.productId,
                name:
                  item.productType === "Book"
                    ? product.data.title
                    : product.data.itemName,
                price: discountedPrice,
                originalPrice: product.data.price,
                discount: discount,
                quantity: item.quantity,
                productType: item.productType,
                image: product.data.image || "https://via.placeholder.com/80",
              };
            } catch (err) {
              console.error(
                `Failed to fetch product ${item.productId}:`,
                err.response?.data || err.message
              );
              return null;
            }
          })
        );

        const validItems = cartItemsWithDetails.filter(
          (item) => item && item.name && item.price
        );
        if (validItems.length === 0 && cartItemsRaw.length > 0) {
          setError("No valid items found in cart");
        }
        setCartItems(validItems);
        setLoading(false);
        const cartUpdateEvent = new Event("cartUpdated");
        window.dispatchEvent(cartUpdateEvent);
        console.log("Dispatched cartUpdated event after fetchCart");
      } catch (err) {
        console.error("Cart fetch error:", err.response?.data || err.message);
        setError(
          err.response?.status === 401
            ? "Session expired. Please log in again."
            : err.message || "Failed to load cart."
        );
        if (err.response?.status === 401) navigate("/login");
        setLoading(false);
      }
    };

    setLoading(true);
    if (!token || !userId) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCartItems(
        guestCart.map((item) => ({
          ...item,
          id: item.productId,
        }))
      );
      setLoading(false);
      const cartUpdateEvent = new Event("cartUpdated");
      window.dispatchEvent(cartUpdateEvent);
      console.log("Dispatched cartUpdated event for guest cart");
      return;
    }

    // Merge guest cart for logged-in users
    const mergeGuestCart = async () => {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      if (guestCart.length > 0) {
        try {
          await Promise.all(
            guestCart.map((item) =>
              axios.post(
                `${API_URL}/add`,
                {
                  userId,
                  productId: item.productId,
                  productType: item.productType,
                  quantity: item.quantity,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              )
            )
          );
          localStorage.removeItem("guestCart");
          toast.success("Guest cart items merged into your account!", {
            position: "top-right",
            autoClose: 3000,
          });
        } catch (err) {
          console.error("Merge error:", err.response?.data || err.message);
          toast.error("Failed to merge guest cart items.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    };

    mergeGuestCart().then(fetchCart);
  }, [navigate]);

  const handleQtyChange = async (id, delta) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const isLoggedIn = !!token && !!userId;

    if (isLoggedIn) {
      try {
        const item = cartItems.find((item) => item.id === id);
        const newQuantity = Math.max(item.quantity + delta, 1);
        await axios.put(
          `${API_URL}/update`,
          {
            userId,
            productId: item.productId,
            productType: item.productType,
            quantity: newQuantity,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
        toast.success("Quantity updated", {
          position: "top-right",
          autoClose: 2000,
        });
        const cartUpdateEvent = new Event("cartUpdated");
        window.dispatchEvent(cartUpdateEvent);
        console.log("Dispatched cartUpdated event after quantity update");
      } catch (err) {
        console.error(
          "Quantity update error:",
          err.response?.data || err.message
        );
        toast.error(
          err.response?.status === 401
            ? "Session expired. Please log in again."
            : err.message || "Failed to update quantity.",
          { position: "top-right", autoClose: 3000 }
        );
        if (err.response?.status === 401) navigate("/login");
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const index = guestCart.findIndex((item) => item.productId === id);
      if (index !== -1) {
        const newQuantity = Math.max(guestCart[index].quantity + delta, 1);
        guestCart[index].quantity = newQuantity;
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
        toast.success("Quantity updated", {
          position: "top-right",
          autoClose: 2000,
        });
        const cartUpdateEvent = new Event("cartUpdated");
        window.dispatchEvent(cartUpdateEvent);
        console.log("Dispatched cartUpdated event after guest quantity update");
      }
    }
  };

  const handleRemove = async (id) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const isLoggedIn = !!token && !!userId;

    if (isLoggedIn) {
      try {
        await axios.delete(`${API_URL}/remove/${userId}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        toast.success("Item removed from cart", {
          position: "top-right",
          autoClose: 2000,
        });
        const cartUpdateEvent = new Event("cartUpdated");
        window.dispatchEvent(cartUpdateEvent);
        console.log("Dispatched cartUpdated event after item removal");
      } catch (err) {
        console.error("Remove item error:", err.response?.data || err.message);
        toast.error(
          err.response?.status === 401
            ? "Session expired. Please log in again."
            : err.message || "Failed to remove item.",
          { position: "top-right", autoClose: 3000 }
        );
        if (err.response?.status === 401) navigate("/login");
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const newCart = guestCart.filter((item) => item.productId !== id);
      localStorage.setItem("guestCart", JSON.stringify(newCart));
      setCartItems(
        newCart.map((item) => ({
          ...item,
          id: item.productId,
        }))
      );
      toast.success("Item removed from cart", {
        position: "top-right",
        autoClose: 2000,
      });
      const cartUpdateEvent = new Event("cartUpdated");
      window.dispatchEvent(cartUpdateEvent);
      console.log("Dispatched cartUpdated event after guest item removal");
    }
  };

  const handleClearCart = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const isLoggedIn = !!token && !!userId;

    if (isLoggedIn) {
      try {
        await axios.delete(`${API_URL}/clear/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems([]);
        toast.success("Cart cleared successfully", {
          position: "top-right",
          autoClose: 2000,
        });
        const cartUpdateEvent = new Event("cartUpdated");
        window.dispatchEvent(cartUpdateEvent);
        console.log("Dispatched cartUpdated event after cart clear");
      } catch (err) {
        console.error("Clear cart error:", err.response?.data || err.message);
        toast.error(
          err.response?.status === 401
            ? "Session expired. Please log in again."
            : err.message || "Failed to clear cart.",
          { position: "top-right", autoClose: 3000 }
        );
        if (err.response?.status === 401) navigate("/login");
      }
    } else {
      localStorage.removeItem("guestCart");
      setCartItems([]);
      toast.success("Cart cleared successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      const cartUpdateEvent = new Event("cartUpdated");
      window.dispatchEvent(cartUpdateEvent);
      console.log("Dispatched cartUpdated event after guest cart clear");
    }
  };

  const subtotal = cartItems
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 font-sans text-lg">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-sans text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-6 font-sans">
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
      <h2 className="text-2xl font-bold mb-6 text-black flex items-center gap-2">
        <span>🛒</span> Shopping Cart
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-600 text-lg">
              Your cart is empty.
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-center border-b border-gray-200 pb-4"
                >
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                    aria-label="Remove item"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <img
                    src={item.image || "https://via.placeholder.com/80"}
                    alt={item.name || "Product"}
                    className="w-20 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-black">
                      {item.name || "Unknown Product"}
                    </h4>
                    <div className="text-sm mt-1 text-gray-600">
                      Price:{" "}
                      <span className="font-medium text-gray-800">
                        Rs. {item.price.toFixed(2)}
                      </span>
                      {item.discount > 0 && (
                        <span className="text-gray-500 line-through ml-2">
                          Rs. {item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-2 space-x-2">
                      <button
                        className="p-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => handleQtyChange(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-gray-800">{item.quantity}</span>
                      <button
                        className="p-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => handleQtyChange(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="font-semibold text-right w-24 text-gray-800">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                    {item.discount > 0 && (
                      <span className="text-gray-500 line-through block text-sm">
                        Rs. {(item.originalPrice * item.quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={handleClearCart}
                className="mt-4 text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-100 transition-colors duration-200"
              >
                Clear Cart
              </button>
            </>
          )}
          <button
            onClick={() => navigate("/productList")}
            className="mt-6 text-yellow-600 border border-yellow-600 px-4 py-2 rounded hover:bg-yellow-100 transition-colors duration-200"
          >
            ← Continue Shopping
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
          <h3 className="text-xl font-semibold border-b border-gray-200 pb-2 text-black">
            Cart Totals
          </h3>
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-semibold text-gray-800">Rs. {subtotal}</span>
          </div>
          <div className="mt-4">
            <span className="block font-medium text-gray-600 mb-2">
              Shipping
            </span>
            <label className="block mb-2 text-sm text-gray-600">
              <input
                type="radio"
                name="shipping"
                defaultChecked
                className="mr-2 accent-yellow-600"
              />
              Free shipping (3–5 days)
            </label>
            <label className="block text-sm text-gray-600">
              <input
                type="radio"
                name="shipping"
                className="mr-2 accent-yellow-600"
              />
              Pickup from Warehouse (Nugegoda): FREE
            </label>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 text-gray-800">
            <span>Total</span>
            <span>Rs. {subtotal}</span>
          </div>
          <button
            onClick={() => {
              const token = localStorage.getItem("token");
              const userId = localStorage.getItem("userId");
              if (!token || !userId) {
                navigate("/login?redirect=/check");
              } else {
                navigate("/check");
              }
            }}
            className="w-full bg-gradient-to-r from-yellow-600 to-amber-800 text-white text-lg py-2 rounded transition-colors duration-300 hover:from-yellow-700 hover:to-amber-900 disabled:opacity-50"
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
