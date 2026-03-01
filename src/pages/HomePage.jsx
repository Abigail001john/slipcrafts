import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Mail,
  Layout,
  Lock,
  Download,
  Gift,
  ChevronDown,
  ChevronRight,
  Star,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';

export default function HomePage() {
  const { config, faqs, testimonials } = useAppContext();
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const features = [
    {
      icon: FileText,
      title: 'Bank Receipt Generation',
      description: 'Create professional bank receipts that look authentic and official.',
    },
    {
      icon: Mail,
      title: 'Email Delivery',
      description: 'Send receipts automatically to customers via email instantly.',
    },
    {
      icon: Layout,
      title: 'Multiple Templates',
      description: 'Choose from diverse templates and customize them to match your brand.',
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Bank-level encryption keeps your data safe and confidential.',
    },
    {
      icon: Download,
      title: 'Instant Download',
      description: 'Download receipts in PDF format with a single click.',
    },
    {
      icon: Gift,
      title: 'Referral Rewards',
      description: 'Earn rewards by referring friends to SlipCraft.',
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Sign Up',
      description: 'Create your free account in less than a minute.',
    },
    {
      number: 2,
      title: 'Choose Template',
      description: 'Pick a template that fits your business needs.',
    },
    {
      number: 3,
      title: 'Generate & Share',
      description: 'Create receipts and share them with customers instantly.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 text-white overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        {/* Accent elements */}
        <div
          className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-10"
          style={{ backgroundColor: '#f8812d' }}
        ></div>
        <div
          className="absolute bottom-0 left-20 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: '#f8812d' }}
        ></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Craft Perfect Receipts in Minutes
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Professional receipt generation for modern businesses. Fast, secure, and incredibly easy to use.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-3 rounded-lg font-bold text-white text-center transition-transform hover:scale-105"
                style={{ backgroundColor: '#f8812d' }}
              >
                Get Started Free
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 rounded-lg font-bold border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {formatNumber(config.total_users || 0)}+
              </div>
              <p className="text-lg text-gray-600">Happy Users</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {formatNumber(config.total_receipts || 0)}+
              </div>
              <p className="text-lg text-gray-600">Receipts Generated</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {formatNumber(config.total_receipts ? Math.round(config.total_receipts * 0.3) : 0)}+
              </div>
              <p className="text-lg text-gray-600">Emails Sent</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Your Business
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to generate, manage, and share professional receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: '#f8812d' }}
                  >
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4"
                    style={{ backgroundColor: '#f8812d' }}
                  >
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-8 left-full w-full items-center justify-center -ml-4">
                    <ChevronRight
                      size={24}
                      className="text-gray-300"
                      style={{ color: '#f8812d' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied users who trust SlipCraft.
            </p>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max px-4 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:min-w-full md:gap-4">
              {testimonials.map((testimonial, index) => {
                const initials = testimonial.clientName?.split(' ').map(n => n[0]).join('') || 'U';
                return (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md min-w-80 md:min-w-fit"
                  >
                    {/* Star Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.starRating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className="fill-orange-500"
                          style={{ color: '#f8812d' }}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-gray-700 mb-4 line-clamp-4">
                      "{testimonial.content}"
                    </p>

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: '#f8812d' }}
                      >
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {testimonial.clientName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {testimonial.clientCountry}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Find answers to common questions about SlipCraft.
            </p>
          </div>

          <div className="space-y-4">
            {(faqs || []).map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === index ? null : index)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 text-left">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className="flex-shrink-0 transition-transform"
                    style={{
                      color: '#f8812d',
                      transform:
                        expandedFAQ === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                {expandedFAQ === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 text-white"
        style={{ backgroundColor: '#1a1a2e' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Create your free account today and start generating professional receipts.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 rounded-lg font-bold text-white transition-transform hover:scale-105"
            style={{ backgroundColor: '#f8812d' }}
          >
            Create Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
