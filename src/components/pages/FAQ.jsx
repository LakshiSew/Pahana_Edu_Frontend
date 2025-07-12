import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquareText } from 'lucide-react';

const faqData = [
  {
    question: 'What is your return policy?',
    answer:
      'We accept returns within 14 days of delivery. Items must be unused and in their original packaging.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Standard shipping takes 3-5 business days. Express options are also available at checkout.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Currently, we only ship within Sri Lanka. We plan to expand internationally soon.',
  },
  {
    question: 'How can I track my order?',
    answer:
      'After placing an order, you’ll receive an email with a tracking link once your order is shipped.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We accept Visa, Mastercard, PayHere, and other major Sri Lankan payment gateways.',
  },
  {
    question: 'Can I change my order after placing it?',
    answer:
      'Yes, you can change your order within 2 hours of placing it by contacting our support team.',
  },
  {
    question: 'Is it safe to use my credit card on your site?',
    answer:
      'Absolutely. Our site is secured with SSL encryption and we use trusted payment gateways.',
  },
  {
    question: 'Do you offer gift wrapping?',
    answer:
      'Yes, we offer gift wrapping at checkout for a small additional charge.',
  },
];

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-800">
        📚 Frequently Asked Questions
      </h2>

      <div className="space-y-6">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md border border-gray-200 rounded-xl transition-all duration-300"
          >
            {/* Question */}
            <button
              onClick={() => toggleIndex(index)}
              className="flex justify-between items-center w-full text-left px-6 py-5 text-lg font-bold text-black hover:bg-gray-50 rounded-t-xl"
            >
              <span>{item.question}</span>
              {activeIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {/* Answer */}
            {activeIndex === index && (
              <div className="px-6 py-4 text-gray-600 bg-gray-50 rounded-b-xl animate-fadeIn">
                <div className="flex items-start gap-3">
                  <MessageSquareText className="w-5 h-5 text-orange-400 mt-1" />
                  <p className="leading-relaxed">{item.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
