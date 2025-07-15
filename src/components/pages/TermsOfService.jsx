import { Link } from "react-router-dom";
import {
  FileText,
  ShoppingCart,
  Package,
  Shield,
  Globe,
  User,
  AlertCircle,
  Mail,
} from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-8 md:py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center font-sans bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text">
          Terms of Service
        </h1>
        <p className="text-gray-600 text-center mb-12 font-sans text-lg leading-relaxed max-w-3xl mx-auto">
          Welcome to Pahana Edu Book Shop. These Terms of Service govern your
          use of our website and services. By accessing or using our website,
          you agree to be bound by these terms.
        </p>

        <section className="space-y-8">
          {/* Section 1: Acceptance of Terms */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <FileText className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                By accessing or using the Pahana Edu Book Shop website, you
                agree to comply with these Terms of Service and all applicable
                laws. If you do not agree, please do not use our website. We may
                update these terms periodically, and changes will be posted on
                this page.
              </p>
            </div>
          </div>

          {/* Section 2: Use of the Website */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <Globe className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                2. Use of the Website
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                You may use our website for lawful purposes only. You agree not
                to:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 font-sans text-base">
                <li>
                  Use the website in any way that violates applicable laws or
                  regulations.
                </li>
                <li>
                  Engage in unauthorized access, data scraping, or distribution
                  of malicious software.
                </li>
                <li>
                  Impersonate any person or entity or provide false information.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Purchases and Payments */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <ShoppingCart className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                3. Purchases and Payments
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                When you make a purchase, you agree to:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 font-sans text-base">
                <li>Provide accurate billing and shipping information.</li>
                <li>
                  Pay all applicable fees, including taxes and shipping costs.
                </li>
                <li>
                  Accept that all sales are final unless otherwise stated in our
                  return policy.
                </li>
              </ul>
              <p className="text-gray-600 font-sans text-base mt-2">
                We reserve the right to refuse or cancel orders due to pricing
                errors, stock issues, or suspected fraud.
              </p>
            </div>
          </div>

          {/* Section 4: Returns and Refunds */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <Package className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                4. Returns and Refunds
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                We offer returns and refunds for eligible products within 14
                days of delivery. To be eligible, items must be unused and in
                their original condition. Please contact{" "}
                <a
                  href="mailto:support@pahanaedu.com"
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  support@pahanaedu.com
                </a>{" "}
                for return instructions.
              </p>
            </div>
          </div>

          {/* Section 5: Intellectual Property */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <Shield className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                5. Intellectual Property
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                All content on the Pahana Edu Book Shop website, including text,
                images, logos, and designs, is our property or licensed to us
                and is protected by copyright and trademark laws. You may not
                reproduce, distribute, or use this content without our
                permission.
              </p>
            </div>
          </div>

          {/* Section 6: User-Generated Content */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <User className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                6. User-Generated Content
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                By submitting feedback, reviews, or other content (e.g., via our
                feedback form), you grant Pahana Edu Book Shop a non-exclusive,
                royalty-free license to use, display, and reproduce this content
                for promotional purposes. You are responsible for ensuring your
                content is accurate and does not infringe on third-party rights.
              </p>
            </div>
          </div>

          {/* Section 7: Limitation of Liability */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <AlertCircle className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                7. Limitation of Liability
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                Pahana Edu Book Shop is not liable for any indirect, incidental,
                or consequential damages arising from your use of our website or
                services. Our liability is limited to the amount paid for your
                purchase. We do not guarantee the accuracy or availability of
                website content.
              </p>
            </div>
          </div>

          {/* Section 8: Contact Us */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <Mail className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                8. Contact Us
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                If you have questions about these Terms of Service, please
                contact us at:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 font-sans text-base">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:support@pahanaedu.com"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    support@pahanaedu.com
                  </a>
                </li>
                <li>
                  Address: Pahana Edu Book Shop, 123 Book Street, Colombo, Sri
                  Lanka
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
