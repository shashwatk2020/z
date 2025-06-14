
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import SearchBar from './SearchBar';
import MegaMenu from './MegaMenu';

const Header = () => {
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  const toolCategories = [
    { name: 'Text Tools', key: 'text' },
    { name: 'Web Tools', key: 'web' },
    { name: 'Image Tools', key: 'image' },
    { name: 'Calculators', key: 'calculators' },
    { name: 'Productivity', key: 'productivity' },
    { name: 'Archive Tools', key: 'archive' },
    { name: 'Security', key: 'security' },
    { name: 'Video Tools', key: 'video' },
    { name: 'Audio Tools', key: 'audio' },
    { name: 'PDF Tools', key: 'pdf' },
  ];

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
            {user ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard">
                    <User className="h-4 w-4 mr-1" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Tool Categories Navigation Bar */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-12 overflow-x-auto">
            <div className="flex items-center space-x-8">
              {toolCategories.map((category) => (
                <div
                  key={category.key}
                  className="relative"
                  onMouseEnter={() => setActiveMegaMenu(category.key)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link
                    to={`/tools/${category.key}`}
                    className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap py-3"
                  >
                    <span>{category.name}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      {activeMegaMenu && (
        <div
          onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
          onMouseLeave={() => setActiveMegaMenu(null)}
        >
          <MegaMenu 
            activeCategory={activeMegaMenu} 
            onClose={() => setActiveMegaMenu(null)} 
          />
        </div>
      )}
    </header>
  );
};

export default Header;
