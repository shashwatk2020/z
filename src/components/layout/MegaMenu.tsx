
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { allTextTools } from '@/data/textToolsData';

interface MegaMenuProps {
  activeCategory: string | null;
  onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ activeCategory, onClose }) => {
  const toolCategories = {
    text: {
      title: 'Text Tools',
      description: 'Transform, analyze, and manipulate text in various ways',
      tools: allTextTools.map(tool => ({ name: tool.name, description: tool.description, path: tool.link }))
    },
    web: {
      title: 'Web Tools',
      description: 'Optimize and manage your website with these utilities',
      tools: [
        { name: 'HTML Editor', description: 'Edit and preview HTML code in real-time.', path: '/tools/web/html-editor' },
        { name: 'CSS Beautifier', description: 'Beautify and format CSS code for readability.', path: '/tools/web/css-beautifier' },
        { name: 'JavaScript Minifier', description: 'Minify JavaScript code to reduce file size.', path: '/tools/web/javascript-minifier' },
        { name: 'JSON Formatter', description: 'Format JSON data for better readability.', path: '/tools/web/json-formatter' },
        { name: 'URL Encoder/Decoder', description: 'Encode or decode URL strings.', path: '/tools/web/url-encoder-decoder' },
      ]
    },
    image: {
      title: 'Image Tools',
      description: 'Edit, convert, and optimize your images online',
      tools: [
        { name: 'Image Resizer', description: 'Resize images to specified dimensions.', path: '/tools/image/image-resizer' },
        { name: 'Image Converter', description: 'Convert images between various formats.', path: '/tools/image/image-converter' },
        { name: 'Image Compressor', description: 'Compress images to reduce file size.', path: '/tools/image/image-compressor' },
        { name: 'Image Editor', description: 'Edit images online with basic editing tools.', path: '/tools/image/image-editor' },
        { name: 'Watermark Tool', description: 'Add watermarks to protect your images.', path: '/tools/image/watermark-tool' },
      ]
    },
    calculators: {
      title: 'Calculators',
      description: 'Perform various calculations with ease',
      tools: [
        { name: 'Percentage Calculator', description: 'Calculate percentages for various scenarios.', path: '/tools/calculators/percentage-calculator' },
        { name: 'EMI Calculator', description: 'Calculate Equated Monthly Installments for loans.', path: '/tools/calculators/emi-calculator' },
        { name: 'Age Calculator', description: 'Calculate age based on date of birth.', path: '/tools/calculators/age-calculator' },
        { name: 'GPA Calculator', description: 'Calculate Grade Point Average.', path: '/tools/calculators/gpa-calculator' },
        { name: 'Unit Converter', description: 'Convert between different units of measurement.', path: '/tools/calculators/unit-converter' },
      ]
    },
    productivity: {
      title: 'Productivity',
      description: 'Boost your productivity with these handy tools',
      tools: [
        { name: 'To-Do List', description: 'Manage your tasks with an online to-do list.', path: '/tools/productivity/to-do-list' },
        { name: 'Calendar', description: 'Keep track of your schedule with an online calendar.', path: '/tools/productivity/calendar' },
        { name: 'Pomodoro Timer', description: 'Use the Pomodoro technique to improve focus.', path: '/tools/productivity/pomodoro-timer' },
        { name: 'Notes', description: 'Take quick notes online.', path: '/tools/productivity/notes' },
        { name: 'Habit Tracker', description: 'Track your habits and stay consistent.', path: '/tools/productivity/habit-tracker' },
      ]
    },
    archive: {
      title: 'Archive Tools',
      description: 'Compress, extract, and manage archive files',
      tools: [
        { name: 'ZIP Extractor', description: 'Extract files from ZIP archives.', path: '/tools/archive/zip-extractor' },
        { name: 'RAR Extractor', description: 'Extract files from RAR archives.', path: '/tools/archive/rar-extractor' },
        { name: '7z Extractor', description: 'Extract files from 7z archives.', path: '/tools/archive/7z-extractor' },
        { name: 'ZIP Compressor', description: 'Compress files into ZIP archives.', path: '/tools/archive/zip-compressor' },
        { name: 'File Archiver', description: 'Create archives from multiple files.', path: '/tools/archive/file-archiver' },
      ]
    },
    security: {
      title: 'Security',
      description: 'Ensure your data is safe and secure',
      tools: [
        { name: 'Password Generator', description: 'Generate strong and secure passwords.', path: '/tools/security/password-generator' },
        { name: 'Password Strength Checker', description: 'Check the strength of your password.', path: '/tools/security/password-strength-checker' },
        { name: 'Encryption Tool', description: 'Encrypt sensitive data.', path: '/tools/security/encryption-tool' },
        { name: 'Decryption Tool', description: 'Decrypt encrypted data.', path: '/tools/security/decryption-tool' },
        { name: 'Data Eraser', description: 'Securely erase sensitive data.', path: '/tools/security/data-eraser' },
      ]
    },
    video: {
      title: 'Video Tools',
      description: 'Edit, convert, and optimize your videos online',
      tools: [
        { name: 'Video Converter', description: 'Convert videos between various formats.', path: '/tools/video/video-converter' },
        { name: 'Video Compressor', description: 'Compress videos to reduce file size.', path: '/tools/video/video-compressor' },
        { name: 'Video Editor', description: 'Edit videos online with basic editing tools.', path: '/tools/video/video-editor' },
        { name: 'Video Resizer', description: 'Resize videos to specified dimensions.', path: '/tools/video/video-resizer' },
        { name: 'Video Trimmer', description: 'Trim videos to remove unwanted segments.', path: '/tools/video/video-trimmer' },
      ]
    },
    audio: {
      title: 'Audio Tools',
      description: 'Edit, convert, and optimize your audio files online',
      tools: [
        { name: 'Audio Converter', description: 'Convert audio files between various formats.', path: '/tools/audio/audio-converter' },
        { name: 'Audio Compressor', description: 'Compress audio files to reduce file size.', path: '/tools/audio/audio-compressor' },
        { name: 'Audio Editor', description: 'Edit audio files online with basic editing tools.', path: '/tools/audio/audio-editor' },
        { name: 'Audio Trimmer', description: 'Trim audio files to remove unwanted segments.', path: '/tools/audio/audio-trimmer' },
        { name: 'Voice Recorder', description: 'Record audio directly from your browser.', path: '/tools/audio/voice-recorder' },
      ]
    },
    pdf: {
      title: 'PDF Tools',
      description: 'Manage and manipulate your PDF documents',
      tools: [
        { name: 'PDF Converter', description: 'Convert PDFs to various formats.', path: '/tools/pdf/pdf-converter' },
        { name: 'PDF Merger', description: 'Merge multiple PDF files into one.', path: '/tools/pdf/pdf-merger' },
        { name: 'PDF Splitter', description: 'Split a PDF file into multiple files.', path: '/tools/pdf/pdf-splitter' },
        { name: 'PDF Compressor', description: 'Compress PDF files to reduce file size.', path: '/tools/pdf/pdf-compressor' },
        { name: 'PDF Editor', description: 'Edit PDF files online.', path: '/tools/pdf/pdf-editor' },
      ]
    },
  };

  const category = toolCategories[activeCategory as keyof typeof toolCategories];

  if (!category) {
    return null;
  }

  return (
    <div className="absolute left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">{category.title}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.tools.map((tool) => (
              <Link key={tool.name} to={tool.path} className="block" onClick={onClose}>
                <div className="p-3 rounded-md hover:bg-gray-50 transition-colors duration-200 border border-gray-100 hover:border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{tool.name}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2">{tool.description}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MegaMenu;
