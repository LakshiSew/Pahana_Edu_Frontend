import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ShoppingCart, BookOpen, ArrowLeft, XCircleIcon } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBookId, setPdfBookId] = useState(null);

  // Fetch product details from backend if not provided in location.state
  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        setLoading(true);
        setError(null);
        try {
          // Try fetching as a book first
          try {
            const response = await axios.get(`http://localhost:8080/auth/getbookbyid/${id}`);
            setProduct({
              id: response.data.bookId,
              name: response.data.title,
              author: response.data.author,
              aboutAuthor: response.data.aboutAuthor || 'N/A',
              price: response.data.price,
              discount: response.data.discount || 0,
              description: response.data.description || 'N/A',
              image: response.data.image || 'https://via.placeholder.com/400',
              stockQty: response.data.stockQty || 0,
              status: response.data.status === 'Active' ? 'Available' : 'Out of Stock',
              type: 'Book',
              pdf: response.data.pdf || null,
              publisher: response.data.publisherName || 'N/A',
              language: response.data.language || 'N/A',
              publicationYear: response.data.publicationYear || 'N/A',
              pages: response.data.pages || 'N/A',
              createdAt: response.data.createdAt || new Date().toISOString(),
              updatedAt: response.data.updatedAt || new Date().toISOString(),
              ratings: response.data.ratings || 'N/A',
            });
            return;
          } catch (bookError) {
            // Try fetching as an accessory
            try {
              const response = await axios.get(`http://localhost:8080/auth/getaccessorybyid/${id}`);
              setProduct({
                id: response.data.id,
                name: response.data.itemName,
                brand: response.data.brand || 'N/A',
                price: response.data.price,
                discount: response.data.discount || 0,
                description: response.data.description || 'N/A',
                image: response.data.image || 'https://via.placeholder.com/400',
                stockQty: response.data.stockQty || 0,
                status: response.data.status === 'Active' ? 'Available' : 'Out of Stock',
                type: 'Accessory',
                createdAt: response.data.createdAt || new Date().toISOString(),
                updatedAt: response.data.updatedAt || new Date().toISOString(),
                ratings: response.data.ratings || 'N/A',
              });
            } catch (accessoryError) {
              throw new Error('Product not found');
            }
          }
        } catch (err) {
          setError(err.message || 'Failed to load product details');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      // Map publisherName to publisher for consistency when using location.state.product
      setProduct({
        ...product,
        publisher: product.publisherName || product.publisher || 'N/A',
      });
    }
  }, [id, product]);

  // Fetch PDF when pdfBookId changes
  useEffect(() => {
    if (pdfBookId) {
      const fetchPdf = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/auth/getpdfbybookid/${pdfBookId}`,
            {
              responseType: 'blob',
            }
          );

          const url = URL.createObjectURL(
            new Blob([response.data], { type: 'application/pdf' })
          );
          setPdfUrl(url);
        } catch (err) {
          toast.error('Failed to load PDF', {
            position: 'top-right',
            autoClose: 3000,
          });
          setShowPdfModal(false);
          setPdfBookId(null);
        }
      };

      fetchPdf();
    }

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
    };
  }, [pdfBookId]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      toast.warn('Please log in to add items to your cart', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    if (product.stockQty === 0) {
      toast.error('This product is out of stock', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/add",
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
      toast.success(`${product.name} has been added to your cart!`, {
        position: 'top-right',
        autoClose: 3000,
      });
      triggerStarAnimation();
      // Dispatch cartUpdated event after a delay to ensure backend sync
      setTimeout(() => {
        const cartUpdateEvent = new Event("cartUpdated");
        window.dispatchEvent(cartUpdateEvent);
        console.log("Dispatched cartUpdated event");
      }, 1000);
    } catch (err) {
      console.error("Failed to add to cart:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to add product to cart', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const triggerStarAnimation = () => {
    const addButton = document.querySelector(`#add-to-cart-${product.id}`);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 font-sans">
        Loading...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 font-sans">
        {error || 'Product not found'}
      </div>
    );
  }

  const discountedPrice = product.discount
    ? (product.price - (product.price * product.discount) / 100).toFixed(2)
    : product.price;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <ToastContainer />
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-700 text-white px-6 py-3 rounded-lg shadow-md hover:from-yellow-300 hover:to-amber-800 hover:scale-105 transition-all duration-300 font-sans text-base font-semibold mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Products
      </button>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Left Section - Image & Buttons */}
        <div className="flex flex-col items-center">
          <img
            src={product.image || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-md"
          />

          {/* Action Buttons */}
          <div className="mt-6 w-full flex flex-col gap-4">
            <button
              id={`add-to-cart-${product.id}`}
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 bg-amber-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-amber-800 hover:scale-105 hover:shadow-lg transition-all duration-300 font-sans focus:outline-none focus:ring-2 focus:ring-yellow-500"
              disabled={product.stockQty === 0}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>

            {product.type === 'Book' && product.pdf && (
              <button
                onClick={() => {
                  setPdfBookId(product.id);
                  setShowPdfModal(true);
                }}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 to-black text-yellow-400 px-4 py-2 rounded-lg shadow-md hover:from-amber-800 hover:to-gray-900 hover:scale-105 transition-all duration-300 font-sans focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <BookOpen className="w-5 h-5" />
                Preview Book
              </button>
            )}
          </div>
        </div>

        {/* Middle Section - Main Info */}
        <div className="md:col-span-2">
          <h2 className="text-4xl font-bold text-gray-800 font-sans">{product.name}</h2>
          <p className="mt-2 text-lg text-gray-600 font-sans">
            <span className="font-semibold">
              {product.type === 'Book' ? 'By:' : 'Brand:'}
            </span>{' '}
            {product.type === 'Book' ? product.author : product.brand}
          </p>

          {/* Price & Stock */}
          <div className="mt-4 text-2xl font-semibold text-gray-800 font-sans">
            Rs.{discountedPrice}
            {product.discount > 0 && (
              <span className="text-gray-500 line-through text-lg ml-2">
                Rs.{Number(product.price).toFixed(2)}
              </span>
            )}
          </div>

          <p
            className={`mt-2 font-medium ${
              product.stockQty > 0 ? 'text-green-600' : 'text-red-600'
            } font-sans`}
          >
            {product.stockQty > 0 ? `In Stock (${product.stockQty})` : 'Out of Stock'}
          </p>

          <p className="mt-2 text-gray-600 text-sm font-sans">
            <strong>Rating:</strong> ⭐ {product.ratings || 'N/A'}
          </p>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-1 font-sans">
              {product.type === 'Book' ? 'About the Book' : 'About the Product'}
            </h3>
            <p className="text-gray-700 font-sans">{product.description || 'N/A'}</p>
          </div>

          {/* Author or Brand Info */}
          {product.type === 'Book' && (
            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-1 font-sans">About the Author</h3>
              <p className="text-gray-700 font-sans">{product.aboutAuthor || 'N/A'}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2 font-sans">Details</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm font-sans">
              {product.type === 'Book' ? (
                <>
                  <p><strong>Publisher:</strong> {product.publisher || 'N/A'}</p>
                  <p><strong>Language:</strong> {product.language || 'N/A'}</p>
                  <p><strong>Publication:</strong> {product.publicationYear || 'N/A'}</p>
                  <p><strong>Pages:</strong> {product.pages || 'N/A'}</p>
                </>
              ) : (
                <p><strong>Brand:</strong> {product.brand || 'N/A'}</p>
              )}
              <p><strong>Status:</strong> {product.status}</p>
              <p><strong>Created:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
              <p><strong>Updated:</strong> {new Date(product.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {showPdfModal && pdfUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/70 backdrop-blur-xl rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-yellow-400/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                PDF Preview
              </h2>
              <button
                onClick={() => {
                  setShowPdfModal(false);
                  setPdfBookId(null);
                  setPdfUrl(null);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <XCircleIcon className="h-7 w-7" />
              </button>
            </div>
            <div className="w-full h-[70vh]">
              <iframe
                src={pdfUrl}
                className="w-full h-full rounded-lg"
                title="PDF Preview"
                onError={() => {
                  toast.error('Failed to load PDF', {
                    position: 'top-right',
                    autoClose: 3000,
                  });
                  setShowPdfModal(false);
                  setPdfBookId(null);
                  setPdfUrl(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;