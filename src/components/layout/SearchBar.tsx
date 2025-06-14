
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const tools = [
  { name: 'JPG to PNG Converter', category: 'Image Tools', url: '/tools/jpg-to-png' },
  { name: 'PDF Merger', category: 'PDF Tools', url: '/tools/pdf-merger' },
  { name: 'Video Compressor', category: 'Video Tools', url: '/tools/video-compressor' },
  { name: 'Audio Converter', category: 'Audio Tools', url: '/tools/audio-converter' },
  { name: 'Text Formatter', category: 'Text Tools', url: '/tools/text-formatter' },
  { name: 'Image Resizer', category: 'Image Tools', url: '/tools/image-resizer' },
  { name: 'PDF to Word', category: 'PDF Tools', url: '/tools/pdf-to-word' },
  { name: 'GIF Maker', category: 'Video Tools', url: '/tools/gif-maker' },
  { name: 'MP3 Converter', category: 'Audio Tools', url: '/tools/mp3-converter' },
  { name: 'Word Counter', category: 'Text Tools', url: '/tools/word-counter' },
];

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredTools, setFilteredTools] = useState(tools);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const filtered = tools.filter(tool =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTools(filtered);
      setIsOpen(true);
    } else {
      setFilteredTools(tools);
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search tools..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {filteredTools.length > 0 ? (
            <>
              {query.trim() && (
                <div className="px-4 py-2 text-sm text-gray-500 border-b">
                  {filteredTools.length} tools found
                </div>
              )}
              {filteredTools.map((tool, index) => (
                <Link
                  key={index}
                  to={tool.url}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{tool.name}</div>
                      <div className="text-sm text-gray-500">{tool.category}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              No tools found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
