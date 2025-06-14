
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface MegaMenuProps {
  activeCategory: string;
  onClose: () => void;
}

const toolsData = {
  text: [
    { name: 'Case Converter', link: '/tools/text/case-converter' },
    { name: 'Sentence Case Converter', link: '/tools/text/sentence-case-converter' },
    { name: 'Binary ⇄ Text Converter', link: '/tools/text/binary-text-converter' },
    { name: 'Text to Hex Converter', link: '/tools/text/text-to-hex-converter' },
    { name: 'Hex to Text Converter', link: '/tools/text/hex-to-text-converter' },
    { name: 'Text to ASCII', link: '/tools/text/text-to-ascii-converter' },
    { name: 'ASCII to Text', link: '/tools/text/ascii-to-text-converter' },
    { name: 'Reverse Text Generator', link: '/tools/text/reverse-text-generator' },
    { name: 'Text to Speech Converter', link: '/tools/text/text-to-speech-converter' },
    { name: 'Unicode Character Converter', link: '/tools/text/unicode-character-converter' },
    { name: 'Number to Words Converter', link: '/tools/text/number-to-words-converter' },
  ],
  web: [
    { name: 'URL Encoder/Decoder', link: '/tools/web/url-encoder' },
    { name: 'HTML Encoder/Decoder', link: '/tools/web/html-encoder' },
    { name: 'Base64 Encoder/Decoder', link: '/tools/web/base64-encoder' },
    { name: 'JSON Formatter', link: '/tools/web/json-formatter' },
    { name: 'CSS Minifier', link: '/tools/web/css-minifier' },
    { name: 'JavaScript Minifier', link: '/tools/web/js-minifier' },
  ],
  image: [
    { name: 'Image Converter', link: '/tools/image/converter' },
    { name: 'Image Resizer', link: '/tools/image/resizer' },
    { name: 'Image Compressor', link: '/tools/image/compressor' },
    { name: 'Image Cropper', link: '/tools/image/cropper' },
    { name: 'Image Filter', link: '/tools/image/filter' },
  ],
  calculators: [
    { name: 'Basic Calculator', link: '/tools/calculators/basic' },
    { name: 'Scientific Calculator', link: '/tools/calculators/scientific' },
    { name: 'Percentage Calculator', link: '/tools/calculators/percentage' },
    { name: 'BMI Calculator', link: '/tools/calculators/bmi' },
    { name: 'Loan Calculator', link: '/tools/calculators/loan' },
  ],
  productivity: [
    { name: 'QR Code Generator', link: '/tools/productivity/qr-generator' },
    { name: 'Barcode Generator', link: '/tools/productivity/barcode-generator' },
    { name: 'Color Picker', link: '/tools/productivity/color-picker' },
    { name: 'Unit Converter', link: '/tools/productivity/unit-converter' },
    { name: 'Password Generator', link: '/tools/productivity/password-generator' },
  ],
  archive: [
    { name: 'ZIP Compressor', link: '/tools/archive/zip-compressor' },
    { name: 'ZIP Extractor', link: '/tools/archive/zip-extractor' },
    { name: 'RAR Extractor', link: '/tools/archive/rar-extractor' },
    { name: 'TAR Extractor', link: '/tools/archive/tar-extractor' },
  ],
  security: [
    { name: 'Password Generator', link: '/tools/security/password-generator' },
    { name: 'Hash Generator', link: '/tools/security/hash-generator' },
    { name: 'Encryption Tool', link: '/tools/security/encryption' },
    { name: 'Password Strength Checker', link: '/tools/security/password-checker' },
  ],
  video: [
    { name: 'Video Converter', link: '/tools/video/converter' },
    { name: 'Video Compressor', link: '/tools/video/compressor' },
    { name: 'Video Trimmer', link: '/tools/video/trimmer' },
    { name: 'Video to GIF', link: '/tools/video/to-gif' },
  ],
  audio: [
    { name: 'Audio Converter', link: '/tools/audio/converter' },
    { name: 'Audio Compressor', link: '/tools/audio/compressor' },
    { name: 'Audio Trimmer', link: '/tools/audio/trimmer' },
    { name: 'Audio Merger', link: '/tools/audio/merger' },
  ],
  pdf: [
    { name: 'PDF Merger', link: '/tools/pdf/merger' },
    { name: 'PDF Splitter', link: '/tools/pdf/splitter' },
    { name: 'PDF Converter', link: '/tools/pdf/converter' },
    { name: 'PDF Compressor', link: '/tools/pdf/compressor' },
  ],
};

const MegaMenu: React.FC<MegaMenuProps> = ({ activeCategory, onClose }) => {
  const tools = toolsData[activeCategory as keyof typeof toolsData] || [];

  return (
    <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              to={tool.link}
              onClick={onClose}
              className="block group"
            >
              <Card className="h-full p-4 hover:shadow-md hover:border-blue-500 transition-all duration-300">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm">
                  {tool.name}
                </h3>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            to={`/tools/${activeCategory}`}
            onClick={onClose}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View all {activeCategory} tools →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
