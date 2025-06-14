
import React, { useState, useRef, useEffect } from 'react';
import { Search, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const tools = [
  // Image Tools
  { name: 'JPG to PNG Converter', category: 'Image Tools', url: '/tools/jpg-to-png', premium: false },
  { name: 'PNG to JPG Converter', category: 'Image Tools', url: '/tools/png-to-jpg', premium: false },
  { name: 'Image Resizer', category: 'Image Tools', url: '/tools/image-resizer', premium: false },
  { name: 'Image Compressor', category: 'Image Tools', url: '/tools/image-compressor', premium: false },
  { name: 'WebP Converter', category: 'Image Tools', url: '/tools/webp-converter', premium: false },
  { name: 'HEIC to JPG', category: 'Image Tools', url: '/tools/heic-to-jpg', premium: false },
  { name: 'Background Remover', category: 'Image Tools', url: '/tools/background-remover', premium: true },
  { name: 'Image Enhancer', category: 'Image Tools', url: '/tools/image-enhancer', premium: true },
  { name: 'Watermark Remover', category: 'Image Tools', url: '/tools/watermark-remover', premium: true },
  { name: 'Photo Editor', category: 'Image Tools', url: '/tools/photo-editor', premium: true },
  { name: 'Image Upscaler', category: 'Image Tools', url: '/tools/image-upscaler', premium: true },
  { name: 'Cartoon Effect', category: 'Image Tools', url: '/tools/cartoon-effect', premium: true },

  // PDF Tools
  { name: 'PDF Merger', category: 'PDF Tools', url: '/tools/pdf-merger', premium: false },
  { name: 'PDF Splitter', category: 'PDF Tools', url: '/tools/pdf-splitter', premium: false },
  { name: 'PDF Compressor', category: 'PDF Tools', url: '/tools/pdf-compressor', premium: false },
  { name: 'JPG to PDF', category: 'PDF Tools', url: '/tools/jpg-to-pdf', premium: false },
  { name: 'Word to PDF', category: 'PDF Tools', url: '/tools/word-to-pdf', premium: false },
  { name: 'Excel to PDF', category: 'PDF Tools', url: '/tools/excel-to-pdf', premium: false },
  { name: 'PDF to Word', category: 'PDF Tools', url: '/tools/pdf-to-word', premium: true },
  { name: 'PDF to Excel', category: 'PDF Tools', url: '/tools/pdf-to-excel', premium: true },
  { name: 'PDF to PowerPoint', category: 'PDF Tools', url: '/tools/pdf-to-powerpoint', premium: true },
  { name: 'PDF Password Remover', category: 'PDF Tools', url: '/tools/pdf-password-remover', premium: true },
  { name: 'OCR Scanner', category: 'PDF Tools', url: '/tools/ocr-scanner', premium: true },
  { name: 'PDF Editor', category: 'PDF Tools', url: '/tools/pdf-editor', premium: true },

  // Video Tools
  { name: 'Video Compressor', category: 'Video Tools', url: '/tools/video-compressor', premium: false },
  { name: 'GIF Maker', category: 'Video Tools', url: '/tools/gif-maker', premium: false },
  { name: 'MP4 Converter', category: 'Video Tools', url: '/tools/mp4-converter', premium: false },
  { name: 'Video to Audio', category: 'Video Tools', url: '/tools/video-to-audio', premium: false },
  { name: 'Screen Recorder', category: 'Video Tools', url: '/tools/screen-recorder', premium: false },
  { name: 'Video Trimmer', category: 'Video Tools', url: '/tools/video-trimmer', premium: false },
  { name: 'Video Converter', category: 'Video Tools', url: '/tools/video-converter', premium: true },
  { name: 'Video Editor', category: 'Video Tools', url: '/tools/video-editor', premium: true },
  { name: 'Subtitle Generator', category: 'Video Tools', url: '/tools/subtitle-generator', premium: true },
  { name: 'Video Merger', category: 'Video Tools', url: '/tools/video-merger', premium: true },
  { name: 'Video Stabilizer', category: 'Video Tools', url: '/tools/video-stabilizer', premium: true },
  { name: 'Slow Motion Video', category: 'Video Tools', url: '/tools/slow-motion-video', premium: true },

  // Audio Tools
  { name: 'Audio Converter', category: 'Audio Tools', url: '/tools/audio-converter', premium: false },
  { name: 'MP3 Converter', category: 'Audio Tools', url: '/tools/mp3-converter', premium: false },
  { name: 'Audio Compressor', category: 'Audio Tools', url: '/tools/audio-compressor', premium: false },
  { name: 'Audio Trimmer', category: 'Audio Tools', url: '/tools/audio-trimmer', premium: false },
  { name: 'Volume Booster', category: 'Audio Tools', url: '/tools/volume-booster', premium: false },
  { name: 'Audio Recorder', category: 'Audio Tools', url: '/tools/audio-recorder', premium: false },
  { name: 'Voice Enhancer', category: 'Audio Tools', url: '/tools/voice-enhancer', premium: true },
  { name: 'Noise Remover', category: 'Audio Tools', url: '/tools/noise-remover', premium: true },
  { name: 'Audio Merger', category: 'Audio Tools', url: '/tools/audio-merger', premium: true },
  { name: 'Pitch Changer', category: 'Audio Tools', url: '/tools/pitch-changer', premium: true },
  { name: 'Karaoke Maker', category: 'Audio Tools', url: '/tools/karaoke-maker', premium: true },
  { name: 'Audio Normalizer', category: 'Audio Tools', url: '/tools/audio-normalizer', premium: true },

  // Text Tools
  { name: 'Word Counter', category: 'Text Tools', url: '/tools/word-counter', premium: false },
  { name: 'Text Formatter', category: 'Text Tools', url: '/tools/text-formatter', premium: false },
  { name: 'Case Converter', category: 'Text Tools', url: '/tools/case-converter', premium: false },
  { name: 'Text to Speech', category: 'Text Tools', url: '/tools/text-to-speech', premium: false },
  { name: 'Lorem Ipsum Generator', category: 'Text Tools', url: '/tools/lorem-ipsum', premium: false },
  { name: 'Text Diff Checker', category: 'Text Tools', url: '/tools/text-diff-checker', premium: false },
  { name: 'Grammar Checker', category: 'Text Tools', url: '/tools/grammar-checker', premium: true },
  { name: 'Plagiarism Checker', category: 'Text Tools', url: '/tools/plagiarism-checker', premium: true },
  { name: 'Text Summarizer', category: 'Text Tools', url: '/tools/text-summarizer', premium: true },
  { name: 'Paraphrasing Tool', category: 'Text Tools', url: '/tools/paraphrasing-tool', premium: true },
  { name: 'Language Translator', category: 'Text Tools', url: '/tools/language-translator', premium: true },
  { name: 'Keyword Density Checker', category: 'Text Tools', url: '/tools/keyword-density-checker', premium: true },

  // Productivity Tools
  { name: 'QR Code Generator', category: 'Productivity Tools', url: '/tools/qr-generator', premium: false },
  { name: 'URL Shortener', category: 'Productivity Tools', url: '/tools/url-shortener', premium: false },
  { name: 'Password Generator', category: 'Productivity Tools', url: '/tools/password-generator', premium: false },
  { name: 'Hash Generator', category: 'Productivity Tools', url: '/tools/hash-generator', premium: false },
  { name: 'Base64 Encoder/Decoder', category: 'Productivity Tools', url: '/tools/base64-encoder', premium: false },
  { name: 'JSON Formatter', category: 'Productivity Tools', url: '/tools/json-formatter', premium: false },
  { name: 'Color Palette Generator', category: 'Productivity Tools', url: '/tools/color-palette', premium: true },
  { name: 'Favicon Generator', category: 'Productivity Tools', url: '/tools/favicon-generator', premium: true },
  { name: 'Barcode Generator', category: 'Productivity Tools', url: '/tools/barcode-generator', premium: true },
  { name: 'Unit Converter', category: 'Productivity Tools', url: '/tools/unit-converter', premium: true },
  { name: 'Currency Converter', category: 'Productivity Tools', url: '/tools/currency-converter', premium: true },
  { name: 'CSS Minifier', category: 'Productivity Tools', url: '/tools/css-minifier', premium: true },
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
                      <div className="font-medium text-gray-900 flex items-center">
                        {tool.name}
                        {tool.premium && (
                          <Lock className="h-3 w-3 text-yellow-600 ml-2" />
                        )}
                      </div>
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
