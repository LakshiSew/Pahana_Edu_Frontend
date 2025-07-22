import { Link } from "react-router-dom";
import {
  Info,
  User,
  FileText,
  Cookie,
  Share2,
  Shield,
  UserCheck,
  Link as LinkIcon,
  Mail,
} from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-8 md:py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center font-sans bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-center mb-12 font-sans text-lg leading-relaxed max-w-3xl mx-auto">
          At Pahana Edu Book Shop, we are committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you visit our website or make a
          purchase.
        </p>

        <section className="space-y-8">
          {/* Section 1: Introduction */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <Info className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                1. Introduction
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                Welcome to Pahana Edu Book Shop. This Privacy Policy outlines
                our practices regarding the collection, use, and protection of
                your personal information. By using our website, you agree to
                the terms outlined in this policy. We may update this policy
                periodically, and changes will be posted on this page.
              </p>
            </div>
          </div>

          {/* Section 2: Information We Collect */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <User className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                2. Information We Collect
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                We collect information to provide a seamless shopping
                experience. This includes:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 font-sans text-base">
                <li>
                  <strong>Personal Information:</strong> Name, email address,
                  billing/shipping address, and payment details provided during
                  purchases or account creation.
                </li>
                <li>
                  <strong>Feedback Data:</strong> Information you provide in
                  feedback forms, such as name, email, feedback message, and
                  optional profile images.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about your
                  interactions with our website, such as pages visited, products
                  viewed, and time spent.
                </li>
                <li>
                  <strong>Device Information:</strong> IP address, browser type,
                  device type, and operating system.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: How We Use Your Information */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <FileText className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 font-sans text-base">
                <li>
                  Process and fulfill your orders, including delivery and
                  payment processing.
                </li>
                <li>
                  Improve our website and services based on user feedback and
                  analytics.
                </li>
                <li>
                  Send promotional emails about new products, offers, or updates
                  (you can opt out at any time).
                </li>
                <li>Enhance website security and prevent fraud.</li>
                <li>Respond to customer inquiries and provide support.</li>
              </ul>
            </div>
          </div>

          {/* Section 4: Cookies and Tracking */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <Cookie className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                4. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                We use cookies and similar technologies to enhance your browsing
                experience. Cookies help us:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 font-sans text-base">
                <li>Remember your preferences and cart contents.</li>
                <li>Analyze website performance and user behavior.</li>
                <li>Deliver personalized content and advertisements.</li>
              </ul>
              <p className="text-gray-600 font-sans text-base mt-2">
                You can manage cookie preferences through your browser settings.
                Disabling cookies may affect website functionality.
              </p>
            </div>
          </div>

          {/* Section 5: Data Sharing */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <Share2 className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                5. Sharing Your Information
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                We do not sell your personal information. We may share your data
                with:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 font-sans text-base">
                <li>
                  <strong>Service Providers:</strong> Third parties that assist
                  with payment processing, delivery, or website analytics.
                </li>
                <li>
                  <strong>Legal Compliance:</strong> Authorities when required
                  by law or to protect our rights.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 6: Data Security */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <Shield className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                6. Data Security
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                We implement industry-standard security measures to protect your
                data, including encryption and secure servers. However, no
                method of transmission over the internet is 100% secure, and we
                cannot guarantee absolute security.
              </p>
            </div>
          </div>

          {/* Section 7: Your Rights */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <UserCheck className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                7. Your Rights
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-600 font-sans text-base">
                <li>Access, correct, or delete your personal information.</li>
                <li>Opt out of marketing communications.</li>
                <li>Request information about how your data is used.</li>
              </ul>
              <p className="text-gray-600 font-sans text-base mt-2">
                To exercise these rights, contact us at{" "}
                <a
                  href="mailto:support@pahanaedu.com"
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  support@pahanaedu.com
                </a>
                .
              </p>
            </div>
          </div>

          {/* Section 8: Third-Party Links */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <LinkIcon className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                8. Third-Party Links
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                Our website may contain links to third-party sites. We are not
                responsible for the privacy practices or content of these sites.
                Please review their policies before sharing information.
              </p>
            </div>
          </div>

          {/* Section 9: Contact Us */}
          <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <Mail className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                9. Contact Us
              </h2>
              <p className="text-gray-600 font-sans text-base leading-relaxed">
                If you have questions about this Privacy Policy, please contact
                us at:
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

export default PrivacyPolicy;
