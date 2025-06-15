
import React from 'react';
import { Link } from 'react-router-dom';
import { allTextTools } from '@/data/textToolsData';

interface MegaMenuProps {
  activeCategory: string | null;
  onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ activeCategory, onClose }) => {
  const toolCategories = {
    text: {
      title: 'Text Tools',
      tools: allTextTools.map(tool => ({ name: tool.name, path: tool.link }))
    },
    web: {
      title: 'Web Tools',
      tools: [
        { name: 'HTML Editor', path: '/tools/web/html-editor' },
        { name: 'CSS Beautifier', path: '/tools/web/css-beautifier' },
        { name: 'JavaScript Minifier', path: '/tools/web/javascript-minifier' },
        { name: 'JSON Formatter', path: '/tools/web/json-formatter' },
        { name: 'URL Encoder/Decoder', path: '/tools/web/url-encoder-decoder' },
        { name: 'HTML Validator', path: '/tools/web/html-validator' },
        { name: 'CSS Validator', path: '/tools/web/css-validator' },
        { name: 'JavaScript Validator', path: '/tools/web/javascript-validator' },
        { name: 'XML Formatter', path: '/tools/web/xml-formatter' },
        { name: 'Base64 Encoder/Decoder', path: '/tools/web/base64-encoder-decoder' },
      ]
    },
    image: {
      title: 'Image Tools',
      tools: [
        { name: 'Image Resizer', path: '/tools/image/image-resizer' },
        { name: 'Image Converter', path: '/tools/image/image-converter' },
        { name: 'Image Compressor', path: '/tools/image/image-compressor' },
        { name: 'Image Editor', path: '/tools/image/image-editor' },
        { name: 'Watermark Tool', path: '/tools/image/watermark-tool' },
        { name: 'Image Cropper', path: '/tools/image/image-cropper' },
        { name: 'Image Filter', path: '/tools/image/image-filter' },
        { name: 'Image Background Remover', path: '/tools/image/background-remover' },
        { name: 'Image Color Picker', path: '/tools/image/color-picker' },
        { name: 'Image Format Converter', path: '/tools/image/format-converter' },
      ]
    },
    calculators: {
      title: 'Calculators',
      tools: [
        { name: 'Percentage Calculator', path: '/tools/calculators/percentage-calculator' },
        { name: 'EMI Calculator', path: '/tools/calculators/emi-calculator' },
        { name: 'Age Calculator', path: '/tools/calculators/age-calculator' },
        { name: 'GPA Calculator', path: '/tools/calculators/gpa-calculator' },
        { name: 'Unit Converter', path: '/tools/calculators/unit-converter' },
        { name: 'BMI Calculator', path: '/tools/calculators/bmi-calculator' },
        { name: 'Loan Calculator', path: '/tools/calculators/loan-calculator' },
        { name: 'Tax Calculator', path: '/tools/calculators/tax-calculator' },
        { name: 'Currency Converter', path: '/tools/calculators/currency-converter' },
        { name: 'Date Calculator', path: '/tools/calculators/date-calculator' },
      ]
    },
    productivity: {
      title: 'Productivity',
      tools: [
        { name: 'To-Do List', path: '/tools/productivity/to-do-list' },
        { name: 'Calendar', path: '/tools/productivity/calendar' },
        { name: 'Pomodoro Timer', path: '/tools/productivity/pomodoro-timer' },
        { name: 'Notes', path: '/tools/productivity/notes' },
        { name: 'Habit Tracker', path: '/tools/productivity/habit-tracker' },
        { name: 'Time Tracker', path: '/tools/productivity/time-tracker' },
        { name: 'Task Manager', path: '/tools/productivity/task-manager' },
        { name: 'Goal Tracker', path: '/tools/productivity/goal-tracker' },
        { name: 'Project Planner', path: '/tools/productivity/project-planner' },
        { name: 'Focus Timer', path: '/tools/productivity/focus-timer' },
      ]
    },
    archive: {
      title: 'Archive Tools',
      tools: [
        { name: 'ZIP Extractor', path: '/tools/archive/zip-extractor' },
        { name: 'RAR Extractor', path: '/tools/archive/rar-extractor' },
        { name: '7z Extractor', path: '/tools/archive/7z-extractor' },
        { name: 'ZIP Compressor', path: '/tools/archive/zip-compressor' },
        { name: 'File Archiver', path: '/tools/archive/file-archiver' },
        { name: 'TAR Extractor', path: '/tools/archive/tar-extractor' },
        { name: 'File Compressor', path: '/tools/archive/file-compressor' },
        { name: 'Archive Converter', path: '/tools/archive/archive-converter' },
        { name: 'Bulk Extractor', path: '/tools/archive/bulk-extractor' },
        { name: 'Archive Manager', path: '/tools/archive/archive-manager' },
      ]
    },
    security: {
      title: 'Security',
      tools: [
        { name: 'Password Generator', path: '/tools/security/password-generator' },
        { name: 'Password Strength Checker', path: '/tools/security/password-strength-checker' },
        { name: 'Encryption Tool', path: '/tools/security/encryption-tool' },
        { name: 'Decryption Tool', path: '/tools/security/decryption-tool' },
        { name: 'Data Eraser', path: '/tools/security/data-eraser' },
        { name: 'Hash Generator', path: '/tools/security/hash-generator' },
        { name: 'QR Code Generator', path: '/tools/security/qr-code-generator' },
        { name: 'Secure Notes', path: '/tools/security/secure-notes' },
        { name: 'Two-Factor Auth', path: '/tools/security/two-factor-auth' },
        { name: 'Privacy Checker', path: '/tools/security/privacy-checker' },
      ]
    },
    video: {
      title: 'Video Tools',
      tools: [
        { name: 'Video Converter', path: '/tools/video/video-converter' },
        { name: 'Video Compressor', path: '/tools/video/video-compressor' },
        { name: 'Video Editor', path: '/tools/video/video-editor' },
        { name: 'Video Resizer', path: '/tools/video/video-resizer' },
        { name: 'Video Trimmer', path: '/tools/video/video-trimmer' },
        { name: 'Video Merger', path: '/tools/video/video-merger' },
        { name: 'Video Splitter', path: '/tools/video/video-splitter' },
        { name: 'Video Speed Changer', path: '/tools/video/video-speed-changer' },
        { name: 'Video Frame Extractor', path: '/tools/video/frame-extractor' },
        { name: 'Video Subtitle Editor', path: '/tools/video/subtitle-editor' },
      ]
    },
    audio: {
      title: 'Audio Tools',
      tools: [
        { name: 'Audio Converter', path: '/tools/audio/audio-converter' },
        { name: 'Audio Compressor', path: '/tools/audio/audio-compressor' },
        { name: 'Audio Editor', path: '/tools/audio/audio-editor' },
        { name: 'Audio Trimmer', path: '/tools/audio/audio-trimmer' },
        { name: 'Voice Recorder', path: '/tools/audio/voice-recorder' },
        { name: 'Audio Merger', path: '/tools/audio/audio-merger' },
        { name: 'Audio Splitter', path: '/tools/audio/audio-splitter' },
        { name: 'Audio Normalizer', path: '/tools/audio/audio-normalizer' },
        { name: 'Audio Speed Changer', path: '/tools/audio/audio-speed-changer' },
        { name: 'Noise Reducer', path: '/tools/audio/noise-reducer' },
      ]
    },
    pdf: {
      title: 'PDF Tools',
      tools: [
        { name: 'PDF Converter', path: '/tools/pdf/pdf-converter' },
        { name: 'PDF Merger', path: '/tools/pdf/pdf-merger' },
        { name: 'PDF Splitter', path: '/tools/pdf/pdf-splitter' },
        { name: 'PDF Compressor', path: '/tools/pdf/pdf-compressor' },
        { name: 'PDF Editor', path: '/tools/pdf/pdf-editor' },
        { name: 'PDF Watermark', path: '/tools/pdf/pdf-watermark' },
        { name: 'PDF Password Remover', path: '/tools/pdf/password-remover' },
        { name: 'PDF Password Protector', path: '/tools/pdf/password-protector' },
        { name: 'PDF Page Extractor', path: '/tools/pdf/page-extractor' },
        { name: 'PDF Rotator', path: '/tools/pdf/pdf-rotator' },
      ]
    },
  };

  const category = toolCategories[activeCategory as keyof typeof toolCategories];

  if (!category) {
    return null;
  }

  // Calculate tools per column for better distribution
  const toolsPerColumn = Math.ceil(category.tools.length / 4);

  return (
    <div className="absolute left-0 w-full bg-white shadow-lg border-t z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.title}</h3>
        <div className="grid grid-cols-4 gap-8">
          {Array.from({ length: 4 }, (_, columnIndex) => {
            const startIndex = columnIndex * toolsPerColumn;
            const endIndex = startIndex + toolsPerColumn;
            const columnTools = category.tools.slice(startIndex, endIndex);
            
            return (
              <div key={columnIndex} className="space-y-2">
                {columnTools.map((tool) => (
                  <Link
                    key={tool.name}
                    to={tool.path}
                    className="block text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                    onClick={onClose}
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
