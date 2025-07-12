import React, { useState } from 'react';
import { Book, User, Mail, Send } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:8080';

const SuggestABook = () => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    email: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Please enter a valid email address', {
        position: 'top-right',
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }
    if (!form.name.trim()) {
      toast.error('Please enter your name', {
        position: 'top-right',
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      const suggestion = {
        name: form.name,
        email: form.email,
        bookTitle: form.title,
        authorName: form.author,
        status: 'PENDING'
      };

      const response = await axios.post(`${API_URL}/auth/createsuggestion`, suggestion);
      console.log('Suggestion response:', response.data);
      toast.success('Thank you for your suggestion! We will review it soon.', {
        position: 'top-right',
        autoClose: 3000,
      });
      setForm({ title: '', author: '', email: '', name: '' });
    } catch (err) {
      console.error('Failed to submit suggestion:', err.response?.data || err.message);
      toast.error(
        err.response?.data?.message || 'Failed to submit suggestion. Please try again.',
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-black"
      style={{
        backgroundImage:
          "url('https://t3.ftcdn.net/jpg/07/93/51/08/360_F_793510820_ERDrJAZQrfTimnVE5MZQDPFBPnP4spuG.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-60"></div>

      {/* Form Container */}
      <div className="relative z-10 max-w-xl w-full p-8 bg-black/40 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/30">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6 drop-shadow">
          📚 Suggest a Book
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5 text-white">
          {/* Book Title */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <Book className="w-4 h-4" />
              Book Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full bg-white/80 text-gray-800 border-none rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-600"
              placeholder="Enter the book title"
            />
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <User className="w-4 h-4" />
              Author Name
            </label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              required
              className="w-full bg-white/80 text-gray-800 border-none rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-600"
              placeholder="Enter the author's name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-white/80 text-gray-800 border-none rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-600"
              placeholder="Enter your email"
            />
          </div>

          {/* Your Name */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <User className="w-4 h-4" />
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-white/80 text-gray-800 border-none rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-600"
              placeholder="Enter your name"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Submit Suggestion'}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default SuggestABook;