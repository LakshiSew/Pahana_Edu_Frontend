import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribed with:", email);
    setEmail("");
  };

//   return (
//     <footer className="relative bg-gradient-to-b from-blue-50 to-white pt-10 pb-16 overflow-hidden">
//       {/* Decorative Wave Background */}
//       <div className="absolute inset-0 opacity-20">
//         <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
//           <path
//             fill="#FBBF24"
//             fillOpacity="0.3"
//             d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,128C672,107,768,117,864,149.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128V320H0Z"
//           />
//         </svg>
//       </div>

//       {/* Main Footer Content */}
//       <div className="relative container mx-auto px-6 z-10">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Logo & Tagline */}
//           <div className="flex flex-col items-center md:items-start">
//             <img
//               src="/src/assets/images/pahana_EDU.svg"
//               alt="Pahana Edu"
//               className="h-24 w-24 mb-4 transform hover:scale-105 transition-transform duration-300"
//             />
//             <p className="text-sm text-gray-600 max-w-xs text-center md:text-left font-sans">
//               Discover a world of knowledge with Pahana Edu's curated books and stationery, delivered with care.
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="text-lg font-bold text-yellow-400 border-b-2 border-yellow-400 inline-block pb-1 mb-4">
//               Quick Links
//             </h3>
//             <ul className="space-y-2 text-gray-600 font-sans">
//               {["Shop Books", "Stationery", "Privacy Policy", "Terms of Service", "Contact"].map((link) => (
//                 <li key={link}>
//                   <Link
//                     to={`/${link.toLowerCase().replace(/\s/g, "")}`}
//                     className="hover:text-yellow-400 transition-colors duration-200 flex items-center gap-2"
//                   >
//                     <ArrowRight className="w-4 h-4" /> {link}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div>
//             <h3 className="text-lg font-bold text-yellow-400 border-b-2 border-yellow-400 inline-block pb-1 mb-4">
//               Contact Us
//             </h3>
//             <ul className="space-y-3 text-gray-600 font-sans">
//               <li className="flex items-center gap-2">
//                 <Phone className="w-5 h-5 text-yellow-400" />
//                 <span>+94 11 234 5678</span>
//               </li>
//               <li className="flex items-center gap-2">
//                 <Mail className="w-5 h-5 text-yellow-400" />
//                 <span>info@pahanaedu.lk</span>
//               </li>
//               <li className="flex items-center gap-2">
//                 <MapPin className="w-5 h-5 text-yellow-400" />
//                 <span>456 Kandy Road, Colombo, Sri Lanka</span>
//               </li>
//             </ul>
//           </div>

//           {/* Newsletter Signup */}
//           <div>
//             <h3 className="text-lg font-bold text-yellow-400 border-b-2 border-yellow-400 inline-block pb-1 mb-4">
//               Stay Connected
//             </h3>
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 className="w-full px-4 py-2 bg-white/50 border border-yellow-500 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                 required
//               />
//               <button
//                 type="submit"
//                 className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-md hover:bg-yellow-500 transition-colors duration-300 flex items-center justify-center gap-2"
//               >
//                 Subscribe <ArrowRight className="w-5 h-5" />
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* CTA Banner */}
//         <div className="mt-10 bg-yellow-100 py-6 px-8 rounded-lg flex flex-col md:flex-row items-center justify-between">
//           <div className="text-center md:text-left">
//             <h3 className="text-xl font-bold text-black">Need a Book Now?</h3>
//             <p className="text-gray-600">Browse our collection or contact us for personalized recommendations!</p>
//           </div>
//           <a
//             href="/shop"
//             className="mt-4 md:mt-0 bg-yellow-400 text-black font-semibold px-6 py-2 rounded-md hover:bg-yellow-500 transition-colors duration-300 flex items-center gap-2"
//           >
//             Shop Now <Phone className="w-5 h-5" />
//           </a>
//         </div>
//       </div>

//       {/* Fixed Bottom Bar with Centered Text */}
//       <div className="absolute bottom-0 left-0 w-full h-14 bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center px-4 z-20">
//         <p className="text-sm text-black text-center font-sans">
//           © 2025 Pahana Edu. All Rights Reserved. |{" "}
//           <a href="/privacypolicy" className="hover:underline">Privacy Policy</a> |{" "}
//           <a href="/termsofservice" className="hover:underline">Terms of Service</a>
//         </p>
//       </div>
//     </footer>
//   );
// };

export default Footer;