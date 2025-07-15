import React from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Eye,
  Target,
  Users,
  Quote,
} from 'lucide-react';

const AboutBookShop = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-purple-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-10">
    <img
  src="/src/assets/images/Pahana_EDU.svg"
  alt="Founder"
  className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg border-4 border-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-110 hover:shadow-2xl transition-all duration-300 ease-in-out"
/>

        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome to <span className="text-blue-600">Pahana EDU</span> Book Shop
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          At Pahana EDU, we believe in the power of books to enlighten, empower, and transform lives. Our goal is to serve every learner, educator, and reader with a wide variety of educational materials.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-12 px-4">
        <div>
          <h3 className="flex items-center text-2xl font-semibold text-gray-800 mb-2">
            <Eye className="w-5 h-5 text-blue-500 mr-2" />
            Our Vision
          </h3>
          <p className="text-gray-700">
            To become the leading educational bookstore that inspires lifelong learning and intellectual curiosity across Sri Lanka.
          </p>
        </div>

        <div>
          <h3 className="flex items-center text-2xl font-semibold text-gray-800 mb-2">
            <Target className="w-5 h-5 text-orange-500 mr-2" />
            Our Mission
          </h3>
          <p className="text-gray-700">
            To provide a comprehensive selection of quality books and learning materials that empower students, teachers, and families.
          </p>
        </div>
      </div>

      {/* Contact & Staff Info */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-12 px-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center"><MapPin className="w-5 h-5 text-red-500 mr-2" /> 120 Galle Road, Colombo, Sri Lanka</li>
            <li className="flex items-center"><Mail className="w-5 h-5 text-green-500 mr-2" /> pahanedu@gmail.com</li>
            <li className="flex items-center"><Phone className="w-5 h-5 text-purple-500 mr-2" /> +94 77 327 4601</li>
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">About Our Staff</h3>
          <p className="text-gray-700">
            Our passionate and knowledgeable team is here to help you find the perfect book. From children’s literature to university textbooks, they are committed to providing a delightful customer experience.
          </p>
        </div>
      </div>

      {/* Founder Quote */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="bg-blue-100 rounded-xl p-6">
          <p className="flex items-start gap-2 text-gray-800 italic text-lg">
            <Quote className="w-6 h-6 text-blue-400 mt-1" />
            Our mission is not only to sell books, but to build a culture of curiosity and wisdom. Thank you for being part of our journey.
          </p>
          <p className="mt-4 text-right font-semibold text-gray-700">– Founder, Pahana EDU Bookshop</p>
        </div>
      </div>

      {/* Google Map */}
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Location</h3>
        <div className="w-full h-[300px]">
          <iframe
            title="Pahana EDU Location"
            src="https://www.google.com/maps?q=Colombo%2C%20Sri%20Lanka&output=embed"
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            className="rounded-lg border"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default AboutBookShop;
