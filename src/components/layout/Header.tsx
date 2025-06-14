
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from './SearchBar';
import MegaMenu from './MegaMenu';

const Header = () => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg font-bold text-xl">
                ZipConvert
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mega Menu Bar */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12">
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Menu className="h-5 w-5" />
              <span className="font-medium">All Tools</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Quick Tool Categories */}
            <div className="hidden lg:flex items-center space-x-6 ml-8">
              <Link to="/tools/text" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Text Tools
              </Link>
              <Link to="/tools/web" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Web Tools
              </Link>
              <Link to="/tools/image" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Image Tools
              </Link>
              <Link to="/tools/calculators" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Calculators
              </Link>
              <Link to="/tools/productivity" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Productivity
              </Link>
              <Link to="/tools/archive" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Archive Tools
              </Link>
              <Link to="/tools/security" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      {isMegaMenuOpen && <MegaMenu onClose={() => setIsMegaMenuOpen(false)} />}
    </header>
  );
};

export default Header;
