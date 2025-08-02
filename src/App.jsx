import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/common/Header";
import StickyHeader from "./components/common/StickyHeader";
import Hero from "./components/home/Hero";
import Delivery from "./components/home/Delivery";
import AboutShop from "./components/home/AboutShop";
import Services from "./components/home/Services";
import TopCategory from "./components/home/TopCategory";
import Product from "./components/home/Product";
import BookApp from "./components/home/BookApp";
import Feedback from "./components/home/Feedback";
import Footer from "./components/common/Footer";
import ProductList from "./components/pages/ProductList";
import SignUp from "./authentication/SignUp";
import Login from "./authentication/Login";
import NewArrivals from "./components/pages/NewArrivals";
import Offers from "./components/pages/Offers";
import ProductDetails from "./components/pages/ProductDetails";
import CartPage from "./components/pages/CartPage";
import CheckoutDetails from "./components/pages/CheckoutDetails";
import SuggestABook from "./components/pages/SuggestABook";
import AboutBookShop from "./components/pages/AboutBookShop";
import FAQ from "./components/pages/FAQ";
import ContactUs from "./components/pages/ContactUs";
import CustomerDashboard from "./components/pages/CustomerDashboard";
import AdminRoutes from "./components/admin/AdminRoutes";
import StaffRoutes from "./components/staff/StaffRoutes";
import FeedbackForm from "./components/pages/FeedbackForm";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import TermsOfService from "./components/pages/TermsOfService";
import ForgotPassword from "./authentication/ForgotPassword";
import ResetPassword from "./authentication/ResetPassword";
import HelpSection from "./components/common/HelpSection";

function App() {
  const location = useLocation();
  const [isSticky, setSticky] = useState(false);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isStaffRoute = location.pathname.startsWith("/staff");

  const hideHeaderFooter = isAdminRoute || isStaffRoute;

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return (
    <>
      {!hideHeaderFooter && isSticky && <StickyHeader />}
      {!hideHeaderFooter && <Header />}
      <div className="app-container min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Delivery />
                <AboutShop />
                <Services />
                <TopCategory />
                <Product />
                <BookApp />
                <Feedback />
              </>
            }
          />
          <Route path="/productList" element={<ProductList />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/newArraivals" element={<NewArrivals />} />
          <Route path="/offer" element={<Offers />} />
          <Route path="/productDetails/:id" element={<ProductDetails />} />
          <Route path="/cartpage" element={<CartPage />} />
          <Route path="/check" element={<CheckoutDetails />} />
          <Route path="/suggestBook" element={<SuggestABook />} />
          <Route path="/about" element={<AboutBookShop />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/feedbackform" element={<FeedbackForm />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/customerDashboard" element={<CustomerDashboard />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/termsofservice" element={<TermsOfService />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/helpsection" element={<HelpSection />} />

          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/staff/*" element={<StaffRoutes />} />

          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin/*" element={<div>Admin Dashboard Placeholder</div>} /> */}
        </Routes>
      </div>

      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
