
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Image, 
  FileText, 
  Video, 
  Music,
  Type,
  Zap,
  Shield,
  Star,
  Lock
} from 'lucide-react';

interface MegaMenuProps {
  onClose: () => void;
}

const MegaMenu = ({ onClose }: MegaMenuProps) => {
  const toolCategories = [
    {
      title: 'Image Tools',
      icon: Image,
      tools: [
        { name: 'JPG to PNG Converter', url: '/tools/jpg-to-png', premium: false },
        { name: 'PNG to JPG Converter', url: '/tools/png-to-jpg', premium: false },
        { name: 'Image Resizer', url: '/tools/image-resizer', premium: false },
        { name: 'Image Compressor', url: '/tools/image-compressor', premium: false },
        { name: 'WebP Converter', url: '/tools/webp-converter', premium: false },
        { name: 'HEIC to JPG', url: '/tools/heic-to-jpg', premium: false },
        { name: 'Background Remover', url: '/tools/background-remover', premium: true },
        { name: 'Image Enhancer', url: '/tools/image-enhancer', premium: true },
        { name: 'Watermark Remover', url: '/tools/watermark-remover', premium: true },
        { name: 'Photo Editor', url: '/tools/photo-editor', premium: true },
        { name: 'Image Upscaler', url: '/tools/image-upscaler', premium: true },
        { name: 'Cartoon Effect', url: '/tools/cartoon-effect', premium: true },
      ]
    },
    {
      title: 'PDF Tools',
      icon: FileText,
      tools: [
        { name: 'PDF Merger', url: '/tools/pdf-merger', premium: false },
        { name: 'PDF Splitter', url: '/tools/pdf-splitter', premium: false },
        { name: 'PDF Compressor', url: '/tools/pdf-compressor', premium: false },
        { name: 'JPG to PDF', url: '/tools/jpg-to-pdf', premium: false },
        { name: 'Word to PDF', url: '/tools/word-to-pdf', premium: false },
        { name: 'Excel to PDF', url: '/tools/excel-to-pdf', premium: false },
        { name: 'PDF to Word', url: '/tools/pdf-to-word', premium: true },
        { name: 'PDF to Excel', url: '/tools/pdf-to-excel', premium: true },
        { name: 'PDF to PowerPoint', url: '/tools/pdf-to-powerpoint', premium: true },
        { name: 'PDF Password Remover', url: '/tools/pdf-password-remover', premium: true },
        { name: 'OCR Scanner', url: '/tools/ocr-scanner', premium: true },
        { name: 'PDF Editor', url: '/tools/pdf-editor', premium: true },
      ]
    },
    {
      title: 'Video Tools',
      icon: Video,
      tools: [
        { name: 'Video Compressor', url: '/tools/video-compressor', premium: false },
        { name: 'GIF Maker', url: '/tools/gif-maker', premium: false },
        { name: 'MP4 Converter', url: '/tools/mp4-converter', premium: false },
        { name: 'Video to Audio', url: '/tools/video-to-audio', premium: false },
        { name: 'Screen Recorder', url: '/tools/screen-recorder', premium: false },
        { name: 'Video Trimmer', url: '/tools/video-trimmer', premium: false },
        { name: 'Video Converter', url: '/tools/video-converter', premium: true },
        { name: 'Video Editor', url: '/tools/video-editor', premium: true },
        { name: 'Subtitle Generator', url: '/tools/subtitle-generator', premium: true },
        { name: 'Video Merger', url: '/tools/video-merger', premium: true },
        { name: 'Video Stabilizer', url: '/tools/video-stabilizer', premium: true },
        { name: 'Slow Motion Video', url: '/tools/slow-motion-video', premium: true },
      ]
    },
    {
      title: 'Audio Tools',
      icon: Music,
      tools: [
        { name: 'Audio Converter', url: '/tools/audio-converter', premium: false },
        { name: 'MP3 Converter', url: '/tools/mp3-converter', premium: false },
        { name: 'Audio Compressor', url: '/tools/audio-compressor', premium: false },
        { name: 'Audio Trimmer', url: '/tools/audio-trimmer', premium: false },
        { name: 'Volume Booster', url: '/tools/volume-booster', premium: false },
        { name: 'Audio Recorder', url: '/tools/audio-recorder', premium: false },
        { name: 'Voice Enhancer', url: '/tools/voice-enhancer', premium: true },
        { name: 'Noise Remover', url: '/tools/noise-remover', premium: true },
        { name: 'Audio Merger', url: '/tools/audio-merger', premium: true },
        { name: 'Pitch Changer', url: '/tools/pitch-changer', premium: true },
        { name: 'Karaoke Maker', url: '/tools/karaoke-maker', premium: true },
        { name: 'Audio Normalizer', url: '/tools/audio-normalizer', premium: true },
      ]
    },
    {
      title: 'Text Tools',
      icon: Type,
      tools: [
        { name: 'Word Counter', url: '/tools/word-counter', premium: false },
        { name: 'Text Formatter', url: '/tools/text-formatter', premium: false },
        { name: 'Case Converter', url: '/tools/case-converter', premium: false },
        { name: 'Text to Speech', url: '/tools/text-to-speech', premium: false },
        { name: 'Lorem Ipsum Generator', url: '/tools/lorem-ipsum', premium: false },
        { name: 'Text Diff Checker', url: '/tools/text-diff-checker', premium: false },
        { name: 'Grammar Checker', url: '/tools/grammar-checker', premium: true },
        { name: 'Plagiarism Checker', url: '/tools/plagiarism-checker', premium: true },
        { name: 'Text Summarizer', url: '/tools/text-summarizer', premium: true },
        { name: 'Paraphrasing Tool', url: '/tools/paraphrasing-tool', premium: true },
        { name: 'Language Translator', url: '/tools/language-translator', premium: true },
        { name: 'Keyword Density Checker', url: '/tools/keyword-density-checker', premium: true },
      ]
    },
    {
      title: 'Productivity Tools',
      icon: Zap,
      tools: [
        { name: 'QR Code Generator', url: '/tools/qr-generator', premium: false },
        { name: 'URL Shortener', url: '/tools/url-shortener', premium: false },
        { name: 'Password Generator', url: '/tools/password-generator', premium: false },
        { name: 'Hash Generator', url: '/tools/hash-generator', premium: false },
        { name: 'Base64 Encoder/Decoder', url: '/tools/base64-encoder', premium: false },
        { name: 'JSON Formatter', url: '/tools/json-formatter', premium: false },
        { name: 'Color Palette Generator', url: '/tools/color-palette', premium: true },
        { name: 'Favicon Generator', url: '/tools/favicon-generator', premium: true },
        { name: 'Barcode Generator', url: '/tools/barcode-generator', premium: true },
        { name: 'Unit Converter', url: '/tools/unit-converter', premium: true },
        { name: 'Currency Converter', url: '/tools/currency-converter', premium: true },
        { name: 'CSS Minifier', url: '/tools/css-minifier', premium: true },
      ]
    }
  ];

  return (
    <div className="bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
          {toolCategories.map((category, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center space-x-2">
                <category.icon className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">{category.title}</h3>
              </div>
              <ul className="space-y-2">
                {category.tools.map((tool, toolIndex) => (
                  <li key={toolIndex}>
                    <Link
                      to={tool.url}
                      onClick={onClose}
                      className="flex items-center justify-between text-sm text-gray-600 hover:text-blue-600 transition-colors group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        {tool.name}
                      </span>
                      {tool.premium && (
                        <Lock className="h-3 w-3 text-yellow-600" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            <Lock className="inline h-4 w-4 text-yellow-600 mr-1" />
            Premium features available with Pro subscription
          </p>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
