import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    quote: "",
    name: "",
    email: "",
    rating: 0,
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.quote || !formData.name || !formData.email) {
      toast.error("Quote, name, and email are required");
      return;
    }

    if (formData.rating < 1 || formData.rating > 5) {
      toast.error("Please select a rating between 1 and 5");
      return;
    }

    const data = new FormData();
    data.append("quote", formData.quote);
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("rating", formData.rating);
    if (image) {
      data.append("image", image);
    }

    try {
      await axios.post("http://localhost:8080/auth/createfeedback", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Feedback submitted successfully!", {
        onClose: () => navigate("/"),
      });
      setFormData({ quote: "", name: "", email: "", rating: 0 });
      setImage(null);
    } catch (err) {
      toast.error("Failed to submit feedback. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Share Your Feedback
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We value your opinion! Let us know your thoughts.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="quote"
                className="block text-sm font-medium text-gray-700"
              >
                Your Feedback
              </label>
              <textarea
                id="quote"
                name="quote"
                required
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows="4"
                value={formData.quote}
                onChange={handleChange}
                placeholder="Tell us about your experience..."
              />
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
              />
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Image (Optional)
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={handleImageChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <div className="mt-2 flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, rating: star }))
                    }
                    className={`text-2xl ${
                      formData.rating >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={formData.rating === 0}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              Submit Feedback
            </button>
          </div>
        </form>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default FeedbackForm;
