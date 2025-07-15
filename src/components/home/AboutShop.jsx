import { useEffect, useRef, useState } from "react";

export const AboutShop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing after animation triggers once
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the image is visible
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full min-h-[700px] py-16 px-6 lg:px-20">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left Image Side */}
        <div
          ref={imageRef}
          className={`w-full lg:w-1/2 relative transform transition-all duration-500 ease-out
            ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-24 opacity-0"}`}
        >
          <img
            src="/src/assets/images/main/bookshop.jpg"
            alt="About Pahana Edu"
            className="rounded-3xl shadow-xl object-cover w-full max-h-[480px]"
          />

          {/* Location badge */}
          <div className="absolute bottom-8 right-8 flex items-center gap-3 bg-yellow-400 bg-opacity-90 rounded-full px-5 py-3 shadow-lg cursor-pointer hover:bg-yellow-500 transition-colors">
            <img src="/src/assets/images/pahana_EDU.svg" alt="Book Icon" className="w-10 h-10" />
            <span className="font-semibold text-black text-lg">Serving All of Sri Lanka</span>
          </div>
        </div>

        {/* Right Text Side */}
        <div className="w-full lg:w-1/2 space-y-6">
          <h4 className="text-yellow-400 font-semibold tracking-wide uppercase mb-2">About Us</h4>
          <h2 className="text-4xl font-extrabold text-gray-800 leading-tight">
            Discover Knowledge & Creativity with <br /> Pahana Edu Bookshop
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Pahana Edu is dedicated to enriching lives through books and stationery. 
            We offer a curated selection of novels, children's books, textbooks, and stationery, 
            ensuring quality and accessibility for learners across Sri Lanka.
          </p>

          <div className="flex items-center gap-10 mt-8">
            {/* Founder Info */}
            <div className="flex items-center gap-5">
              <img
                src="/src/assets/images/main/founder.jpg"
                alt="Founder"
                className="w-25 h-25 rounded-full object-cover border-4 border-yellow-400 shadow-md"
              />
              <div>
                <p className="text-gray-800 font-semibold text-lg">Founder & CEO</p>
                <p className="text-2xl font-bold text-yellow-400">Lakshi</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-yellow-100 px-6 py-4 rounded-lg shadow-lg hover:bg-yellow-200 cursor-pointer transition-colors">
              <p className="text-gray-800 font-semibold text-lg mb-1">Contact Us</p>
              <p className="text-1xl font-extrabold text-yellow-400">+94 77 3274601</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutShop;