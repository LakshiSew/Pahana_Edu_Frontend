import { useState } from "react";

const BookApp = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Bookshop Background */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="/src/assets/images/main/background.png"
          alt="Bookshop Background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10 container mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:ml-12">
            <div className="flex items-center gap-3 text-yellow-400">
              <div className="h-0.5 w-16 bg-yellow-400" />
              <h3 className="text-base font-semibold font-sans uppercase tracking-wider">
                Coming Soon
              </h3>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sans text-white leading-tight">
              Pahana Edu Goes Mobile<br />Stay Tuned!
            </h1>
            <p className="text-lg text-gray-300 font-sans max-w-xl">
              Exciting news! Pahana Edu is bringing your favorite bookshop to your fingertips. Our mobile app is coming soon with a seamless reading and shopping experience!
            </p>
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="flex flex-col items-start space-y-3 p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <img src="/src/assets/images/main/navigator.svg" alt="Search Icon" className="w-12 h-12" />
                <h3 className="font-semibold font-sans text-base text-white">
                  Browse Books<br />Easily!
                </h3>
              </div>
              <div className="flex flex-col items-start space-y-3 p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <img src="/src/assets/images/main/clock.svg" alt="Cart Icon" className="w-12 h-12" />
                <h3 className="font-semibold font-sans text-base text-white">
                  Easy Checkout<br />Anytime!
                </h3>
              </div>
              <div className="flex flex-col items-start space-y-3 p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <img src="/src/assets/images/main/docs.svg" alt="Bookmark Icon" className="w-12 h-12" />
                <h3 className="font-semibold font-sans text-base text-white">
                  Personalized<br />Suggestions!
                </h3>
              </div>
            </div>
            {/* App Store Buttons */}
            <div className="flex gap-4 mt-8">
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transform transition-transform duration-300 hover:scale-105"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-12"
                />
              </a>
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="transform transition-transform duration-300 hover:scale-105"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store"
                  className="h-12"
                />
              </a>
            </div>
          </div>
          {/* Right Content - Images Stack */}
          <div className="relative h-[600px] flex justify-center items-center">
            {/* Phone */}
            <div
              className="absolute right-32 top-16 w-[340px] transform transition-transform duration-500"
              style={{ transform: isHovered ? 'translateY(-10px)' : 'translateY(0)' }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src="/src/assets/images/main/mokup.png"
                alt="Bookshop App Interface"
                className="w-full h-auto shadow-2xl rounded-2xl"
              />
            </div>
            {/* Book */}
            <div className="absolute right-16 bottom-0 w-[500px] z-10">
              <img
                src="/src/assets/images/main/book.png"
                alt="Book Image"
                className="w-full h-auto"
              />
            </div>
            {/* Reader */}
            <div className="absolute right-0 bottom-0 w-[200px] z-20">
              <img
                src="/src/assets/images/main/reader.png"
                alt="Person Reading"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookApp;