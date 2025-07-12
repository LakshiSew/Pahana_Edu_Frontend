import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  Inbox,
  FileText,
  MessageCircle,
} from "lucide-react";

const ContactUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 bg-white">
      <h2 className="text-4xl font-extrabold text-center text-black mb-4 tracking-tight">
        📬 Contact Pahana Edu
      </h2>
      <p className="text-center text-gray-600 text-lg mb-16">
        We’re here to help. Reach out to us through any of the methods below or
        send a message directly.
      </p>

      <div className="grid lg:grid-cols-2 gap-14 items-start">
        {/* Left Side - Contact Info */}
        <div className="space-y-10">
          <div className="flex items-start gap-5">
            <div className="bg-yellow-400/20 p-3 rounded-full">
              <Mail className="text-yellow-500 w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-black mb-1">Email</h4>
              <p className="text-gray-700">support@mybookshop.lk</p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <div className="bg-yellow-400/20 p-3 rounded-full">
              <Phone className="text-yellow-500 w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-black mb-1">Phone</h4>
              <p className="text-gray-700">+94 77 123 4567</p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <div className="bg-yellow-400/20 p-3 rounded-full">
              <MapPin className="text-yellow-500 w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-black mb-1">
                Location
              </h4>
              <p className="text-gray-700">
                123 Book Street, Nugegoda, Sri Lanka
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <form className="space-y-6 w-full ">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-black mb-1 flex items-center gap-2">
                <User className="w-4 h-4 text-yellow-500" />
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border-b-2 border-yellow-400 focus:outline-none focus:border-black px-2 py-2 bg-transparent text-black"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 flex items-center gap-2">
                <Inbox className="w-4 h-4 text-yellow-500" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border-b-2 border-yellow-400 focus:outline-none focus:border-black px-2 py-2 bg-transparent text-black"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-black mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-yellow-500" />
              Subject
            </label>
            <input
              type="text"
              placeholder="Let us know the topic"
              className="w-full border-b-2 border-yellow-400 focus:outline-none focus:border-black px-2 py-2 bg-transparent text-black"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black mb-1 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-yellow-500" />
              Your Message
            </label>
            <textarea
              rows="5"
              placeholder="Type your message here..."
              className="w-full border-b-2 border-yellow-400 focus:outline-none focus:border-black px-2 py-2 bg-transparent text-black resize-none"
            ></textarea>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-black hover:text-yellow-400 text-black px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300"
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
