
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const searchData = [
  // Text Tools
  { name: 'Case Converter', category: 'Text', link: '/tools/text/case-converter' },
  { name: 'Sentence Case Converter', category: 'Text', link: '/tools/text/sentence-case-converter' },
  { name: 'Binary Text Converter', category: 'Text', link: '/tools/text/binary-text-converter' },
  { name: 'Text to Hex Converter', category: 'Text', link: '/tools/text/text-to-hex-converter' },
  { name: 'Hex to Text Converter', category: 'Text', link: '/tools/text/hex-to-text-converter' },
  { name: 'Text to ASCII Converter', category: 'Text', link: '/tools/text/text-to-ascii-converter' },
  { name: 'ASCII to Text Converter', category: 'Text', link: '/tools/text/ascii-to-text-converter' },
  { name: 'Reverse Text Generator', category: 'Text', link: '/tools/text/reverse-text-generator' },
  { name: 'Text to Speech Converter', category: 'Text', link: '/tools/text/text-to-speech-converter' },
  { name: 'Unicode Character Converter', category: 'Text', link: '/tools/text/unicode-character-converter' },
  { name: 'Number to Words Converter', category: 'Text', link: '/tools/text/number-to-words-converter' },
  
  // Web Tools
  { name: 'URL Encoder/Decoder', category: 'Web', link: '/tools/web/url-encoder' },
  { name: 'HTML Encoder/Decoder', category: 'Web', link: '/tools/web/html-encoder' },
  { name: 'Base64 Encoder/Decoder', category: 'Web', link: '/tools/web/base64-encoder' },
  { name: 'JSON Formatter', category: 'Web', link: '/tools/web/json-formatter' },
  
  // Image Tools
  { name: 'Image Converter', category: 'Image', link: '/tools/image/converter' },
  { name: 'Image Resizer', category: 'Image', link: '/tools/image/resizer' },
  { name: 'Image Compressor', category: 'Image', link: '/tools/image/compressor' },
  
  // Calculators
  { name: 'Basic Calculator', category: 'Calculator', link: '/tools/calculators/basic' },
  { name: 'Scientific Calculator', category: 'Calculator', link: '/tools/calculators/scientific' },
  { name: 'Percentage Calculator', category: 'Calculator', link: '/tools/calculators/percentage' },
  
  // Productivity
  { name: 'QR Code Generator', category: 'Productivity', link: '/tools/productivity/qr-generator' },
  { name: 'Password Generator', category: 'Productivity', link: '/tools/productivity/password-generator' },
  { name: 'Color Picker', category: 'Productivity', link: '/tools/productivity/color-picker' },
  
  // Security
  { name: 'Hash Generator', category: 'Security', link: '/tools/security/hash-generator' },
  { name: 'Encryption Tool', category: 'Security', link: '/tools/security/encryption' },
  
  // PDF Tools
  { name: 'PDF Merger', category: 'PDF', link: '/tools/pdf/merger' },
  { name: 'PDF Splitter', category: 'PDF', link: '/tools/pdf/splitter' },
  { name: 'PDF Converter', category: 'PDF', link: '/tools/pdf/converter' },
  
  // Video Tools
  { name: 'Video Converter', category: 'Video', link: '/tools/video/converter' },
  { name: 'Video Compressor', category: 'Video', link: '/tools/video/compressor' },
  
  // Audio Tools
  { name: 'Audio Converter', category: 'Audio', link: '/tools/audio/converter' },
  { name: 'Audio Compressor', category: 'Audio', link: '/tools/audio/compressor' },
];

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<typeof searchData>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchData.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 8)); // Limit to 8 results
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (link: string) => {
    setQuery('');
    setIsOpen(false);
    navigate(link);
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search tools..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSelect(item.link)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-gray-50 focus:outline-none"
            >
              <div className="font-medium text-gray-900">{item.name}</div>
              <div className="text-sm text-gray-500">{item.category} Tools</div>
            </button>
          ))}
        </div>
      )}

      {isOpen && results.length === 0 && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <div className="text-gray-500 text-center">No tools found for "{query}"</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
