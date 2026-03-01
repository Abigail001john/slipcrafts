import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Footer() {
  const { config } = useAppContext();
  const [newsEmail, setNewsEmail] = useState('');
  const [newsSubscribed, setNewsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsEmail.trim()) {
      setNewsSubscribed(true);
      setNewsEmail('');
      setTimeout(() => setNewsSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">SlipCraft</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional receipt generation made simple. Craft perfect receipts in minutes with our powerful platform.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
                >
                  Help
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${config.email}`}
                  className="text-gray-400 hover:text-orange-500 transition-colors break-all"
                >
                  {config.email}
                </a>
              </li>
              <li className="text-gray-400">
                <span className="font-semibold text-white">Phone:</span> {config.phone}
              </li>
              <li className="text-gray-400">
                <span className="font-semibold text-white">Address:</span> {config.address}
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get the latest updates and tips.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-orange-500 text-sm"
                required
              />
              <button
                type="submit"
                className="w-full px-3 py-2 rounded font-medium text-white transition-colors text-sm"
                style={{ backgroundColor: '#f8812d' }}
              >
                Subscribe
              </button>
            </form>
            {newsSubscribed && (
              <p className="text-green-400 text-sm mt-2">Thanks for subscribing!</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800"></div>

        {/* Copyright Bar */}
        <div className="mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {currentYear} SlipCraft. All rights reserved. | Crafted with{' '}
            <span className="text-orange-500">❤</span> for businesses worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
