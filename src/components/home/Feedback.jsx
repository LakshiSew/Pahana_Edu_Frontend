
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Timer } from "lucide-react";
import { PiQuotesBold } from "react-icons/pi";
import { GrDiamond } from "react-icons/gr";
import { AiFillCar } from "react-icons/ai";

const Feedback = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/auth/getallfeedback"
        );
        setFeedbacks(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load feedback");
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="relative w-full bg-gradient-to-b py-12">
      <div className="absolute inset-0 opacity-20">
        <img
          src="/assets/images/map.jpg"
          alt="Bookshop Background"
          className="w-[800px] h-full object-contain -mt-12"
        />
      </div>
      <div className="relative z-10 flex container mx-auto px-12">
        <div className="flex-1 p-8 ml-4">
          <div className="max-w-xl">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-yellow-400 mb-4">
                <div className="h-px w-12 bg-yellow-400" />
                <h3 className="text-base font-medium tracking-wider font-sans">
                  CUSTOMER FEEDBACK
                </h3>
              </div>
              <h2 className="text-3xl font-bold text-black mb-4 font-sans w-[700px]">
                Pahana Edu Customer Reviews...
              </h2>
              <p className="text-gray-600 font-sans text-base -mt-2 w-[600px]">
                We offer a curated selection of quality books and stationery,
                with exceptional service and fast delivery to enhance your
                reading experience.
              </p>
            </div>
            {loading && <p className="text-center text-gray-600">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && feedbacks.length > 0 && (
              <div className="bg-white rounded-sm shadow-lg p-6 relative mb-6 -mt-6 h-[280px] w-[500px]">
                <div
                  className="absolute right-20 -top-6 w-12 text-center h-10 bg-yellow-400 text-black"
                  style={{
                    clipPath: "polygon(30% 0, 100% 0, 70% 100%, 0 100%)",
                  }}
                >
                  <PiQuotesBold className="text-2xl ml-3 mt-2" />
                </div>
                <div className="transition-opacity duration-300">
                  <p className="text-gray-600 text-lg mb-6 font-sans font-semibold mt-4 leading-8 w-[450px]">
                    {feedbacks[activeSlide].quote}
                  </p>
                  <div className="flex items-center gap-3">
                    {feedbacks[activeSlide].image && (
                      <img
                        src={feedbacks[activeSlide].image}
                        alt={feedbacks[activeSlide].name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-black font-sans text-lg">
                        {feedbacks[activeSlide].name}
                      </h4>
                      <p className="text-gray-500 font-sans text-sm">
                        {feedbacks[activeSlide].email}
                      </p>
                      <div className="flex mt-2">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xl ${
                              i < feedbacks[activeSlide].rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!loading && !error && feedbacks.length === 0 && (
              <p className="text-center text-gray-600">
                No feedback available yet.
              </p>
            )}
            {!loading && feedbacks.length > 0 && (
              <div className="flex gap-2 mb-4">
                {feedbacks.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === activeSlide ? "bg-yellow-400" : "bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
            <button
              onClick={() => navigate("/feedbackform")}
              className="inline-block px-5 py-2 bg-yellow-400 text-black font-semibold font-sans rounded-md hover:bg-yellow-500 transition-colors duration-300"
            >
              Share Your Feedback
            </button>
          </div>
        </div>
        <div className="relative w-[500px] bg-yellow-100 p-8 overflow-hidden">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(45deg, rgba(255,255,255,0.2) 10%, transparent 3%, transparent 50%, rgba(255,255,255,0.6) 10%, rgba(255,255,255,0.2) 60%, transparent 60%, transparent)",
              backgroundSize: "10px 10px",
            }}
          />
          <div className="relative max-w-sm">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-black mb-4 mt-6">
                <div className="h-px w-12 bg-black" />
                <h3 className="text-md font-medium tracking-wider font-sans">
                  WHY CHOOSE US!
                </h3>
              </div>
              <h2 className="text-3xl font-bold text-black mb-4 font-sans w-[400px]">
                Why Shop with Pahana Edu?
              </h2>
              <p className="text-black text-md font-sans w-[400px]">
                We provide a curated selection of books and stationery, with
                fast delivery and excellent customer support.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-2">
                <div className="p-3 rounded-lg">
                  <GrDiamond className="w-10 h-10 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2 font-sans">
                    Quality Books
                  </h3>
                  <p className="text-black font-sans text-sm">
                    Carefully curated books for all ages and interests.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-3 rounded-lg">
                  <AiFillCar className="w-10 h-10 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2 font-sans">
                    Fast Delivery
                  </h3>
                  <p className="text-black font-sans text-sm">
                    Quick and reliable delivery to your doorstep.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-3 rounded-lg">
                  <Timer className="w-10 h-10 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2 font-sans">
                    Great Support
                  </h3>
                  <p className="text-black font-sans text-sm">
                    Responsive customer service for all your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-24 bg-white"></div>
      </div>
    </div>
  );
};

export default Feedback;
