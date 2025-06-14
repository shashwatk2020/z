
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg font-bold text-xl inline-block mb-4">
              ZipConvert
            </div>
            <p className="text-gray-300 mb-4">
              Your all-in-one toolkit for file conversion, image editing, PDF manipulation, and more. 
              Trusted by millions of users worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-sm">
                Contact us: <a href="mailto:contact@zipconvert.com" className="text-blue-400 hover:text-blue-300">contact@zipconvert.com</a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
              <li>
                {user ? (
                  <Link to="/tool-request" className="text-gray-300 hover:text-white transition-colors">
                    Tool Request
                  </Link>
                ) : (
                  <Link to="/auth" className="text-gray-400 cursor-not-allowed" title="Sign in to request tools">
                    Tool Request (Sign in required)
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ZipConvert. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
