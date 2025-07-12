import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "http://localhost:8080";

const CheckoutDetails = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    customerEmail: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    phoneNumber: '',
    confirmPhoneNumber: '',
  });
  const [shippingMethod, setShippingMethod] = useState('free');

  useEffect(() => {
    const fetchCartAndCustomer = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        setError('Please log in to proceed with checkout');
        toast.warn('Please log in to proceed with checkout', {
          position: 'top-right',
          autoClose: 3000,
        });
        navigate('/login');
        return;
      }

      try {
        // Fetch cart items
        const cartResponse = await axios.get(`${API_URL}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(err => {
          throw new Error(`Cart fetch failed: ${err.response?.status} - ${err.response?.data || err.message}`);
        });
        console.log('Cart response:', cartResponse.data);
        const cartItemsRaw = cartResponse.data.items || [];

        if (cartItemsRaw.length === 0) {
          setError('Your cart is empty');
          setLoading(false);
          return;
        }

        // Fetch product details for each cart item
        const cartItemsWithDetails = await Promise.all(
          cartItemsRaw.map(async (item) => {
            try {
              let product;
              if (item.productType === 'Book') {
                product = await axios.get(
                  `${API_URL}/auth/getbookbyid/${item.productId}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
              } else if (item.productType === 'Accessory') {
                product = await axios.get(
                  `${API_URL}/auth/getaccessorybyid/${item.productId}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
              } else {
                console.warn(`Invalid product type for item: ${item.productId}`);
                return null;
              }
              const discount = product.data.discount || 0;
              const discountedPrice = product.data.price * (1 - discount / 100);
              return {
                id: item.id,
                productId: item.productId,
                name:
                  item.productType === 'Book'
                    ? product.data.title
                    : product.data.itemName,
                price: discountedPrice, // Apply discount
                originalPrice: product.data.price, // Store original price for reference
                discount: discount, // Store discount percentage
                quantity: item.quantity,
                productType: item.productType,
                image: product.data.image || 'https://via.placeholder.com/80',
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
        if (validItems.length === 0) {
          setError('Cart contains invalid items');
          console.warn('All cart items filtered out due to missing data');
        }
        setCartItems(validItems);

        // Fetch customer details
        const customerResponse = await axios.get(`${API_URL}/auth/getcustomerbyid/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(err => {
          throw new Error(`Customer fetch failed: ${err.response?.status} - ${err.response?.data || err.message}`);
        });
        console.log('Customer response:', customerResponse.data);
        const customer = customerResponse.data;
        setBillingDetails((prev) => ({
          ...prev,
          customerEmail: customer.customerEmail || '',
          firstName: customer.customerName?.split(' ')[0] || '',
          lastName: customer.customerName?.split(' ').slice(1).join(' ') || '',
          address: customer.address || '',
          phoneNumber: customer.customerPhone || '',
          confirmPhoneNumber: customer.customerPhone || '',
        }));

        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError(
          err.response?.status === 401
            ? 'Session expired. Please log in again.'
            : err.message || 'Failed to load cart or customer details'
        );
        if (err.response?.status === 401) navigate('/login');
        setLoading(false);
      }
    };
    fetchCartAndCustomer();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingChange = (e) => {
    setShippingMethod(e.target.value);
  };

  const calculateTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const price = item.price || 0; // Use discounted price
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const { customerEmail, firstName, lastName, address, city, phoneNumber, confirmPhoneNumber } = billingDetails;
    if (!customerEmail || !firstName || !lastName || !address || !city || !phoneNumber || !confirmPhoneNumber) {
      toast.error('Please fill in all required fields', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      toast.error('Please enter a valid email address', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (phoneNumber !== confirmPhoneNumber) {
      toast.error('Phone numbers do not match', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (!/^\+\d{10,15}$/.test(phoneNumber)) {
      toast.error('Please enter a valid phone number (e.g., +94123456789)', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty or contains invalid items', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      // Construct productTypes map
      const productTypes = cartItems.reduce((map, item) => {
        map[item.productId] = item.productType;
        return map;
      }, {});

      // Fetch categoryId based on the first item's productType
      const categoryId = await (async () => {
        const firstItem = cartItems[0];
        try {
          if (firstItem.productType === 'Book') {
            const book = await axios.get(
              `${API_URL}/auth/getbookbyid/${firstItem.productId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return book.data.categoryId || 'Books';
          } else if (firstItem.productType === 'Accessory') {
            const accessory = await axios.get(
              `${API_URL}/auth/getaccessorybyid/${firstItem.productId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return accessory.data.categoryId || 'Accessories';
          }
        } catch (err) {
          console.error('Failed to fetch categoryId:', err.response?.data || err.message);
          return firstItem.productType === 'Book' ? 'Books' : 'Accessories'; // Fallback
        }
      })();

      const order = {
        customerId: userId,
        customerName: `${firstName} ${lastName}`,
        customerEmail,
        customerPhone: phoneNumber,
        address: `${address}${billingDetails.apartment ? ', ' + billingDetails.apartment : ''}, ${city}`,
        orderDate: new Date().toISOString().split('T')[0],
        categoryId,
        productIds: cartItems.map(item => item.productId),
        productTypes,
        totalPrice: parseFloat(calculateTotalPrice()), // Use discounted total
        status: 'Pending',
      };
      console.log('Order payload:', order);

      const response = await axios.post(`${API_URL}/auth/create`, order, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Order created:', response.data);
      toast.success('Order placed successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });

      await axios.delete(`${API_URL}/clear/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems([]);

      setTimeout(() => {
        const cartUpdateEvent = new Event('cartUpdated');
        window.dispatchEvent(cartUpdateEvent);
        console.log('Dispatched cartUpdated event');
      }, 1000);

      navigate('/customerDashboard');
    } catch (err) {
      console.error('Order creation error:', err.response?.data || err.message);
      toast.error(
        err.response?.status === 401
          ? 'Session expired. Please log in again.'
          : err.response?.data?.message || 'Failed to place order',
        { position: 'top-right', autoClose: 3000 }
      );
      if (err.response?.status === 401) navigate('/login');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-600 font-sans">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-600 font-sans">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-6 grid md:grid-cols-3 gap-8 font-sans">
      <ToastContainer />
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-700 text-white px-6 py-3 rounded-lg shadow-md hover:from-yellow-300 hover:to-amber-800 hover:scale-105 transition-all duration-300 text-base font-semibold mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Cart
      </button>

      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Billing Details</h2>
        <form className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Email address *</label>
            <input
              type="email"
              name="customerEmail"
              value={billingDetails.customerEmail}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="example@gmail.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">First name *</label>
              <input
                type="text"
                name="firstName"
                value={billingDetails.firstName}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Last name *</label>
              <input
                type="text"
                name="lastName"
                value={billingDetails.lastName}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Country / Region *</label>
            <div className="font-semibold text-gray-800 mt-1">Sri Lanka</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Street address *</label>
              <input
                type="text"
                name="address"
                value={billingDetails.address}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="House number and street name"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Apartment, suite, etc. (optional)</label>
              <input
                type="text"
                name="apartment"
                value={billingDetails.apartment}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Apartment, suite, unit, etc. (optional)"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Town / City *</label>
            <input
              type="text"
              name="city"
              value={billingDetails.city}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Phone Number *</label>
              <input
                type="text"
                name="phoneNumber"
                value={billingDetails.phoneNumber}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="e.g., +94123456789"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Re–type Phone Number *</label>
              <input
                type="text"
                name="confirmPhoneNumber"
                value={billingDetails.confirmPhoneNumber}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>
        </form>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
        <h3 className="text-xl font-semibold border-b pb-2">Your Order</h3>
        <div className="space-y-2 text-sm">
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty or contains invalid items</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name || 'Unknown Product'} × {item.quantity}</span>
                <span className="font-medium">
                  Rs. {(item.price * item.quantity).toFixed(2)} {item.discount > 0 && (
                    <span className="text-gray-500 line-through">Rs. {(item.originalPrice * item.quantity).toFixed(2)}</span>
                  )}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold">Rs. {calculateTotalPrice()}</span>
          </div>

          <div>
            <div className="font-medium mb-1">Shipping</div>
            <label className="block">
              <input
                type="radio"
                name="shipping"
                value="pickup"
                checked={shippingMethod === 'pickup'}
                onChange={handleShippingChange}
                className="mr-2"
              />
              Pickup from Warehouse (Nugegoda): FREE
            </label>
            <label className="block">
              <input
                type="radio"
                name="shipping"
                value="free"
                checked={shippingMethod === 'free'}
                onChange={handleShippingChange}
                className="mr-2"
              />
              Free shipping (3–5 days)
            </label>
          </div>

          <div className="flex justify-between font-bold text-base border-t pt-2">
            <span>Total</span>
            <span>Rs. {calculateTotalPrice()}</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-2 rounded transition mt-4"
          disabled={cartItems.length === 0}
        >
          PLACE ORDER
        </button>

        <div className="flex items-center justify-between pt-4">
          <span className="text-sm">Pay Online</span>
          <div className="flex gap-1">
            <img src="https://www.payhere.lk/downloads/images/payhere_long_banner.png" alt="PayHere" className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetails;