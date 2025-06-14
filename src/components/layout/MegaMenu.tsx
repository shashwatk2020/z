
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Image, 
  FileText, 
  Video, 
  Music,
  Type,
  Zap,
  Calculator,
  Globe,
  Archive,
  Shield,
  Users,
  BookOpen,
  Briefcase
} from 'lucide-react';

interface MegaMenuProps {
  activeCategory?: string;
  onClose: () => void;
}

const MegaMenu = ({ activeCategory, onClose }: MegaMenuProps) => {
  const toolCategories = [
    {
      key: 'text',
      title: 'Text Tools',
      icon: Type,
      tools: [
        // Conversion & Case
        { name: 'Case Converter (All Cases)', url: '/tools/case-converter-all', category: 'Conversion & Case' },
        { name: 'Sentence Case Converter', url: '/tools/sentence-case', category: 'Conversion & Case' },
        { name: 'Binary ⇄ Text Converter', url: '/tools/binary-text', category: 'Conversion & Case' },
        { name: 'Text to Hex Converter', url: '/tools/text-to-hex', category: 'Conversion & Case' },
        { name: 'Hex to Text Converter', url: '/tools/hex-to-text', category: 'Conversion & Case' },
        { name: 'Text to ASCII', url: '/tools/text-to-ascii', category: 'Conversion & Case' },
        { name: 'ASCII to Text', url: '/tools/ascii-to-text', category: 'Conversion & Case' },
        { name: 'Reverse Text Generator', url: '/tools/reverse-text', category: 'Conversion & Case' },
        { name: 'Text to Speech Converter', url: '/tools/text-to-speech', category: 'Conversion & Case' },
        { name: 'Unicode Character Converter', url: '/tools/unicode-converter', category: 'Conversion & Case' },
        { name: 'Number to Words Converter', url: '/tools/number-to-words', category: 'Conversion & Case' },
        
        // Generation
        { name: 'Random Password Generator', url: '/tools/random-password', category: 'Generation' },
        { name: 'Advanced Lorem Ipsum', url: '/tools/lorem-ipsum-advanced', category: 'Generation' },
        { name: 'Advanced Slug Generator', url: '/tools/slug-generator', category: 'Generation' },
        { name: 'Random Word Generator', url: '/tools/random-word', category: 'Generation' },
        { name: 'Random Letter Generator', url: '/tools/random-letter', category: 'Generation' },
        { name: 'Text Repeater', url: '/tools/text-repeater', category: 'Generation' },
        { name: 'Hashtag Generator', url: '/tools/hashtag-generator', category: 'Generation' },
        { name: 'Blog Title Generator', url: '/tools/blog-title-generator', category: 'Generation' },
        { name: 'Strong Password Generator with Rules', url: '/tools/strong-password-rules', category: 'Generation' },
        { name: 'Article Title Generator', url: '/tools/article-title-generator', category: 'Generation' },
        { name: 'Username Generator', url: '/tools/username-generator', category: 'Generation' },
        { name: 'Business Name Generator', url: '/tools/business-name-generator', category: 'Generation' },
        
        // Analysis & Utilities
        { name: 'Online Word Counter', url: '/tools/word-counter', category: 'Analysis & Utilities' },
        { name: 'Character Counter', url: '/tools/character-counter', category: 'Analysis & Utilities' },
        { name: 'Duplicate Line Remover', url: '/tools/duplicate-line-remover', category: 'Analysis & Utilities' },
        { name: 'Advanced Whitespace Remover', url: '/tools/whitespace-remover', category: 'Analysis & Utilities' },
        { name: 'Text Compare (Diff Checker)', url: '/tools/text-diff-checker', category: 'Analysis & Utilities' },
        { name: 'Find and Replace Text', url: '/tools/find-replace-text', category: 'Analysis & Utilities' },
        { name: 'Keyword Density Checker', url: '/tools/keyword-density-checker', category: 'Analysis & Utilities' },
        { name: 'Meta Description Generator', url: '/tools/meta-description-generator', category: 'Analysis & Utilities' },
        { name: 'Text Summarizer', url: '/tools/text-summarizer', category: 'Analysis & Utilities' },
        { name: 'Plagiarism Checker (Basic)', url: '/tools/plagiarism-checker', category: 'Analysis & Utilities' },
        { name: 'Reading Time Calculator', url: '/tools/reading-time-calculator', category: 'Analysis & Utilities' },
        { name: 'Language Detector', url: '/tools/language-detector', category: 'Analysis & Utilities' },
        
        // Styling & Fun
        { name: 'Bold Text Generator', url: '/tools/bold-text-generator', category: 'Styling & Fun' },
        { name: 'Italic Text Generator', url: '/tools/italic-text-generator', category: 'Styling & Fun' },
        { name: 'Fancy Text Generator', url: '/tools/fancy-text-generator', category: 'Styling & Fun' },
        { name: 'Zalgo Glitch Text', url: '/tools/zalgo-glitch-text', category: 'Styling & Fun' },
        { name: 'Big Text (ASCII) Generator', url: '/tools/big-text-ascii', category: 'Styling & Fun' },
        { name: 'ASCII Art Generator', url: '/tools/ascii-art-generator', category: 'Styling & Fun' },
        { name: 'Yoda Translator', url: '/tools/yoda-translator', category: 'Styling & Fun' },
        { name: 'Morse Code Translator', url: '/tools/morse-code-translator', category: 'Styling & Fun' },
        { name: 'Emoji Text Generator', url: '/tools/emoji-text-generator', category: 'Styling & Fun' },
        { name: 'Text Art Generator', url: '/tools/text-art-generator', category: 'Styling & Fun' },
        { name: 'Upside Down Text Generator', url: '/tools/upside-down-text', category: 'Styling & Fun' },
      ]
    },
    {
      key: 'web',
      title: 'Web Tools',
      icon: Globe,
      tools: [
        // Converters & Encoders
        { name: 'HTML Entity Encode/Decode', url: '/tools/html-entity-encoder', category: 'Converters & Encoders' },
        { name: 'URL Encode/Decode', url: '/tools/url-encoder-decoder', category: 'Converters & Encoders' },
        { name: 'Advanced Base64 Encode/Decode', url: '/tools/base64-encoder-advanced', category: 'Converters & Encoders' },
        { name: 'CSV to JSON Converter', url: '/tools/csv-to-json', category: 'Converters & Encoders' },
        { name: 'JSON to CSV Converter', url: '/tools/json-to-csv', category: 'Converters & Encoders' },
        { name: 'XML to JSON Converter', url: '/tools/xml-to-json', category: 'Converters & Encoders' },
        { name: 'YAML to JSON Converter', url: '/tools/yaml-to-json', category: 'Converters & Encoders' },
        { name: 'Color Code Converter (Hex/RGB/HSL)', url: '/tools/color-code-converter', category: 'Converters & Encoders' },
        { name: 'Markdown to HTML Converter', url: '/tools/markdown-to-html', category: 'Converters & Encoders' },
        { name: 'HTML to Markdown Converter', url: '/tools/html-to-markdown', category: 'Converters & Encoders' },
        { name: 'SQL to JSON Converter', url: '/tools/sql-to-json', category: 'Converters & Encoders' },
        { name: 'Excel to JSON Converter', url: '/tools/excel-to-json', category: 'Converters & Encoders' },
        
        // Generators
        { name: 'QR Code Generator', url: '/tools/qr-generator', category: 'Generators' },
        { name: 'Favicon Generator', url: '/tools/favicon-generator', category: 'Generators' },
        { name: 'UUID Generator', url: '/tools/uuid-generator', category: 'Generators' },
        { name: 'Hash Generator (MD5/SHA)', url: '/tools/hash-generator', category: 'Generators' },
        { name: 'Meta Tag Generator', url: '/tools/meta-tag-generator', category: 'Generators' },
        { name: 'Open Graph (OG) Generator', url: '/tools/og-generator', category: 'Generators' },
        { name: 'UTM Builder', url: '/tools/utm-builder', category: 'Generators' },
        { name: 'HTTP Header Generator', url: '/tools/http-header-generator', category: 'Generators' },
        { name: 'API Documentation Generator', url: '/tools/api-doc-generator', category: 'Generators' },
        { name: 'Robots.txt Generator', url: '/tools/robots-txt-generator', category: 'Generators' },
        { name: 'Htaccess Generator', url: '/tools/htaccess-generator', category: 'Generators' },
        { name: 'Schema Markup Generator', url: '/tools/schema-markup-generator', category: 'Generators' },
        
        // Validators & Formatters
        { name: 'Advanced XML Validator', url: '/tools/xml-validator-advanced', category: 'Validators & Formatters' },
        { name: 'Advanced SQL Formatter', url: '/tools/sql-formatter-advanced', category: 'Validators & Formatters' },
        { name: 'Adv. CSS Minifier/Beautifier', url: '/tools/css-minifier-beautifier', category: 'Validators & Formatters' },
        { name: 'JSON Validator & Formatter', url: '/tools/json-formatter', category: 'Validators & Formatters' },
        { name: 'HTML Validator', url: '/tools/html-validator', category: 'Validators & Formatters' },
        { name: 'CSS Validator', url: '/tools/css-validator', category: 'Validators & Formatters' },
        { name: 'Robots.txt Validator', url: '/tools/robots-txt-validator', category: 'Validators & Formatters' },
        { name: 'Sitemap Generator', url: '/tools/sitemap-generator', category: 'Validators & Formatters' },
        { name: 'JavaScript Minifier/Beautifier', url: '/tools/js-minifier-beautifier', category: 'Validators & Formatters' },
        { name: 'YAML Validator', url: '/tools/yaml-validator', category: 'Validators & Formatters' },
        { name: 'Email Validator', url: '/tools/email-validator', category: 'Validators & Formatters' },
        { name: 'Credit Card Validator', url: '/tools/credit-card-validator', category: 'Validators & Formatters' },
        
        // Utilities & Dev
        { name: 'HTML Previewer', url: '/tools/html-previewer', category: 'Utilities & Dev' },
        { name: 'XML Viewer, Editor & Validator', url: '/tools/xml-viewer-editor', category: 'Utilities & Dev' },
        { name: 'Advanced Regex Tester', url: '/tools/regex-tester-advanced', category: 'Utilities & Dev' },
        { name: 'Basic JavaScript Obfuscator', url: '/tools/js-obfuscator-basic', category: 'Utilities & Dev' },
        { name: 'CSS Animator', url: '/tools/css-animator', category: 'Utilities & Dev' },
        { name: 'Query String Parser', url: '/tools/query-string-parser', category: 'Utilities & Dev' },
        { name: 'User-Agent Parser', url: '/tools/user-agent-parser', category: 'Utilities & Dev' },
        { name: 'IP Address Viewer', url: '/tools/ip-address-viewer', category: 'Utilities & Dev' },
        { name: 'Website Screenshot Tool', url: '/tools/website-screenshot', category: 'Utilities & Dev' },
        { name: 'Broken Link Checker', url: '/tools/broken-link-checker', category: 'Utilities & Dev' },
        { name: 'CSS Grid Generator', url: '/tools/css-grid-generator', category: 'Utilities & Dev' },
        { name: 'Flexbox Generator', url: '/tools/flexbox-generator', category: 'Utilities & Dev' },
        { name: 'Lorem Pixel Image Generator', url: '/tools/lorem-pixel-generator', category: 'Utilities & Dev' },
      ]
    },
    {
      key: 'image',
      title: 'Image Tools',
      icon: Image,
      tools: [
        // Converters
        { name: 'Convert to JPG', url: '/tools/convert-to-jpg', category: 'Converters' },
        { name: 'Convert to PNG', url: '/tools/convert-to-png', category: 'Converters' },
        { name: 'Convert to WebP', url: '/tools/convert-to-webp', category: 'Converters' },
        { name: 'Convert to GIF', url: '/tools/convert-to-gif', category: 'Converters' },
        { name: 'Image to Base64', url: '/tools/image-to-base64', category: 'Converters' },
        { name: 'Base64 to Image', url: '/tools/base64-to-image', category: 'Converters' },
        { name: 'PDF to Image Converter', url: '/tools/pdf-to-image', category: 'Converters' },
        { name: 'SVG to PNG Converter', url: '/tools/svg-to-png', category: 'Converters' },
        { name: 'ICO to PNG Converter', url: '/tools/ico-to-png', category: 'Converters' },
        
        // Editors & Resizers
        { name: 'Image Resizer', url: '/tools/image-resizer', category: 'Editors & Resizers' },
        { name: 'Image Cropper', url: '/tools/image-cropper', category: 'Editors & Resizers' },
        { name: 'Rotate Image', url: '/tools/rotate-image', category: 'Editors & Resizers' },
        { name: 'Flip Image', url: '/tools/flip-image', category: 'Editors & Resizers' },
        { name: 'Add Text to Image', url: '/tools/add-text-to-image', category: 'Editors & Resizers' },
        { name: 'Social Media Image Resizer', url: '/tools/social-media-resizer', category: 'Editors & Resizers' },
        { name: 'Image Filters (Basic)', url: '/tools/image-filters-basic', category: 'Editors & Resizers' },
        { name: 'Background Remover', url: '/tools/background-remover', category: 'Editors & Resizers' },
        { name: 'Image Border Generator', url: '/tools/image-border-generator', category: 'Editors & Resizers' },
        { name: 'Watermark Generator', url: '/tools/watermark-generator', category: 'Editors & Resizers' },
        { name: 'Image Brightness/Contrast Adjuster', url: '/tools/image-brightness-contrast', category: 'Editors & Resizers' },
        
        // Generators & Effects
        { name: 'GIF Maker (from images)', url: '/tools/gif-maker-images', category: 'Generators & Effects' },
        { name: 'Meme Generator', url: '/tools/meme-generator', category: 'Generators & Effects' },
        { name: 'Color Picker (from image/screen)', url: '/tools/color-picker-image', category: 'Generators & Effects' },
        { name: 'Gradient Generator', url: '/tools/gradient-generator', category: 'Generators & Effects' },
        { name: 'Pixel Art Generator', url: '/tools/pixel-art-generator', category: 'Generators & Effects' },
        { name: 'Zoom Background Maker', url: '/tools/zoom-background-maker', category: 'Generators & Effects' },
        { name: 'Business Card Designer', url: '/tools/business-card-designer', category: 'Generators & Effects' },
        { name: 'QR Code to Image Generator', url: '/tools/qr-code-to-image', category: 'Generators & Effects' },
        { name: 'Avatar Generator', url: '/tools/avatar-generator', category: 'Generators & Effects' },
        { name: 'Placeholder Image Generator', url: '/tools/placeholder-image-generator', category: 'Generators & Effects' },
        { name: 'Instagram Story Creator', url: '/tools/instagram-story-creator', category: 'Generators & Effects' },
        { name: 'Logo Maker (Basic)', url: '/tools/logo-maker-basic', category: 'Generators & Effects' },
        
        // Optimization & Utilities
        { name: 'Image Compressor (JPG/PNG/WebP)', url: '/tools/image-compressor-multi', category: 'Optimization & Utilities' },
        { name: 'PNG Compressor', url: '/tools/png-compressor', category: 'Optimization & Utilities' },
        { name: 'JPG Compressor', url: '/tools/jpg-compressor', category: 'Optimization & Utilities' },
        { name: 'EXIF/Metadata Remover', url: '/tools/exif-metadata-remover', category: 'Optimization & Utilities' },
        { name: 'Bulk Image Resizer', url: '/tools/bulk-image-resizer', category: 'Optimization & Utilities' },
        { name: 'Image Format Analyzer', url: '/tools/image-format-analyzer', category: 'Optimization & Utilities' },
        { name: 'Duplicate Image Finder', url: '/tools/duplicate-image-finder', category: 'Optimization & Utilities' },
        { name: 'Image Color Palette Extractor', url: '/tools/image-color-palette-extractor', category: 'Optimization & Utilities' },
      ]
    },
    {
      key: 'calculators',
      title: 'Calculators',
      icon: Calculator,
      tools: [
        // Math Calculators
        { name: 'Standard Calculator', url: '/tools/standard-calculator', category: 'Math Calculators' },
        { name: 'Percentage Calculator', url: '/tools/percentage-calculator', category: 'Math Calculators' },
        { name: 'Fraction Calculator', url: '/tools/fraction-calculator', category: 'Math Calculators' },
        { name: 'Average Calculator', url: '/tools/average-calculator', category: 'Math Calculators' },
        { name: 'Scientific Calculator', url: '/tools/scientific-calculator', category: 'Math Calculators' },
        { name: 'Math Equation Solver (Basic)', url: '/tools/math-equation-solver', category: 'Math Calculators' },
        { name: 'Grade Calculator', url: '/tools/grade-calculator', category: 'Math Calculators' },
        { name: 'Mortgage Calculator', url: '/tools/mortgage-calculator', category: 'Math Calculators' },
        { name: 'Statistics Calculator', url: '/tools/statistics-calculator', category: 'Math Calculators' },
        { name: 'Matrix Calculator', url: '/tools/matrix-calculator', category: 'Math Calculators' },
        { name: 'Loan Payment Calculator', url: '/tools/loan-payment-calculator', category: 'Math Calculators' },
        
        // Unit Converters
        { name: 'Length Converter', url: '/tools/length-converter', category: 'Unit Converters' },
        { name: 'Weight Converter', url: '/tools/weight-converter', category: 'Unit Converters' },
        { name: 'Temperature Converter', url: '/tools/temperature-converter', category: 'Unit Converters' },
        { name: 'Area Converter', url: '/tools/area-converter', category: 'Unit Converters' },
        { name: 'Volume Converter', url: '/tools/volume-converter', category: 'Unit Converters' },
        { name: 'Time Zone Converter', url: '/tools/time-zone-converter', category: 'Unit Converters' },
        { name: 'Data Storage Converter', url: '/tools/data-storage-converter', category: 'Unit Converters' },
        { name: 'Speed Converter', url: '/tools/speed-converter', category: 'Unit Converters' },
        { name: 'Energy Converter', url: '/tools/energy-converter', category: 'Unit Converters' },
        { name: 'Pressure Converter', url: '/tools/pressure-converter', category: 'Unit Converters' },
        { name: 'Angle Converter', url: '/tools/angle-converter', category: 'Unit Converters' },
        { name: 'Currency Converter (Live Rates)', url: '/tools/currency-converter-live', category: 'Unit Converters' },
        
        // Finance Calculators
        { name: 'Tip Calculator', url: '/tools/tip-calculator', category: 'Finance Calculators' },
        { name: 'Loan EMI Calculator', url: '/tools/loan-emi-calculator', category: 'Finance Calculators' },
        { name: 'Compound Interest Calculator', url: '/tools/compound-interest-calculator', category: 'Finance Calculators' },
        { name: 'VAT/GST Calculator', url: '/tools/vat-gst-calculator', category: 'Finance Calculators' },
        { name: 'Currency Converter', url: '/tools/currency-converter', category: 'Finance Calculators' },
        { name: 'Salary Converter (Hourly/Annual)', url: '/tools/salary-converter', category: 'Finance Calculators' },
        { name: 'Retirement Savings Estimator', url: '/tools/retirement-savings-estimator', category: 'Finance Calculators' },
        { name: 'Investment Return Calculator', url: '/tools/investment-return-calculator', category: 'Finance Calculators' },
        { name: 'Tax Calculator', url: '/tools/tax-calculator', category: 'Finance Calculators' },
        { name: 'Budget Planner', url: '/tools/budget-planner', category: 'Finance Calculators' },
        { name: 'ROI Calculator', url: '/tools/roi-calculator', category: 'Finance Calculators' },
        
        // Health & Lifestyle
        { name: 'Age Calculator', url: '/tools/age-calculator', category: 'Health & Lifestyle' },
        { name: 'Date Difference Calculator', url: '/tools/date-difference-calculator', category: 'Health & Lifestyle' },
        { name: 'BMI Calculator', url: '/tools/bmi-calculator', category: 'Health & Lifestyle' },
        { name: 'Calorie Calculator (BMR/TDEE)', url: '/tools/calorie-calculator', category: 'Health & Lifestyle' },
        { name: 'Body Fat Percentage Estimator', url: '/tools/body-fat-percentage', category: 'Health & Lifestyle' },
        { name: 'Pregnancy Due Date Calculator', url: '/tools/pregnancy-due-date', category: 'Health & Lifestyle' },
        { name: 'Recipe Nutrition Calculator', url: '/tools/recipe-nutrition-calculator', category: 'Health & Lifestyle' },
        { name: 'Water Intake Calculator', url: '/tools/water-intake-calculator', category: 'Health & Lifestyle' },
        { name: 'Sleep Calculator', url: '/tools/sleep-calculator', category: 'Health & Lifestyle' },
        { name: 'Ideal Weight Calculator', url: '/tools/ideal-weight-calculator', category: 'Health & Lifestyle' },
        { name: 'Macro Calculator', url: '/tools/macro-calculator', category: 'Health & Lifestyle' },
      ]
    },
    {
      key: 'productivity',
      title: 'Productivity',
      icon: Zap,
      tools: [
        // Time & Productivity
        { name: 'Online Notepad', url: '/tools/online-notepad', category: 'Time & Productivity' },
        { name: 'Pomodoro Timer 🍅', url: '/tools/pomodoro-timer', category: 'Time & Productivity' },
        { name: 'Countdown Timer', url: '/tools/countdown-timer', category: 'Time & Productivity' },
        { name: 'Online Stopwatch', url: '/tools/online-stopwatch', category: 'Time & Productivity' },
        { name: 'Daily Planner Generator', url: '/tools/daily-planner-generator', category: 'Time & Productivity' },
        { name: 'Meeting Cost Calculator', url: '/tools/meeting-cost-calculator', category: 'Time & Productivity' },
        { name: 'World Clock', url: '/tools/world-clock', category: 'Time & Productivity' },
        { name: 'Time Tracker', url: '/tools/time-tracker', category: 'Time & Productivity' },
        { name: 'Habit Tracker', url: '/tools/habit-tracker', category: 'Time & Productivity' },
        { name: 'Goal Setting Template', url: '/tools/goal-setting-template', category: 'Time & Productivity' },
        { name: 'Invoice Generator', url: '/tools/invoice-generator', category: 'Time & Productivity' },
        
        // Data & File Tools
        { name: 'CSV Viewer', url: '/tools/csv-viewer', category: 'Data & File Tools' },
        { name: 'JSON Viewer', url: '/tools/json-viewer', category: 'Data & File Tools' },
        { name: 'Excel to HTML Table', url: '/tools/excel-to-html-table', category: 'Data & File Tools' },
        { name: 'Diff Checker (Text Compare)', url: '/tools/diff-checker-text', category: 'Data & File Tools' },
        { name: 'Periodic Table Explorer', url: '/tools/periodic-table-explorer', category: 'Data & File Tools' },
        { name: 'PDF Tools Suite (Merge, Split, Compress)', url: '/tools/pdf-tools-suite', category: 'Data & File Tools' },
        { name: 'File Hash Checker', url: '/tools/file-hash-checker', category: 'Data & File Tools' },
        { name: 'Duplicate File Finder', url: '/tools/duplicate-file-finder', category: 'Data & File Tools' },
        { name: 'File Size Calculator', url: '/tools/file-size-calculator', category: 'Data & File Tools' },
        { name: 'Backup Reminder Generator', url: '/tools/backup-reminder-generator', category: 'Data & File Tools' },
        
        // Communication & Social
        { name: 'Email Template Generator', url: '/tools/email-template-generator', category: 'Communication & Social' },
        { name: 'Social Media Post Scheduler', url: '/tools/social-media-post-scheduler', category: 'Communication & Social' },
        { name: 'WhatsApp Link Generator', url: '/tools/whatsapp-link-generator', category: 'Communication & Social' },
        { name: 'Mailto Link Generator', url: '/tools/mailto-link-generator', category: 'Communication & Social' },
        { name: 'Contact Form Generator', url: '/tools/contact-form-generator', category: 'Communication & Social' },
        { name: 'Survey Creator (Basic)', url: '/tools/survey-creator-basic', category: 'Communication & Social' },
        
        // Fun & Random Tools
        { name: 'Coin Flipper', url: '/tools/coin-flipper', category: 'Fun & Random Tools' },
        { name: 'Dice Roller', url: '/tools/dice-roller', category: 'Fun & Random Tools' },
        { name: 'Random Number Generator', url: '/tools/random-number-generator', category: 'Fun & Random Tools' },
        { name: 'Random Country Generator', url: '/tools/random-country-generator', category: 'Fun & Random Tools' },
        { name: 'Band Name Generator', url: '/tools/band-name-generator', category: 'Fun & Random Tools' },
        { name: 'Riddle Generator', url: '/tools/riddle-generator', category: 'Fun & Random Tools' },
        { name: 'Tarot Card Reader (Fun)', url: '/tools/tarot-card-reader', category: 'Fun & Random Tools' },
        { name: 'Decision Maker Wheel', url: '/tools/decision-maker-wheel', category: 'Fun & Random Tools' },
        { name: 'Random Quote Generator', url: '/tools/random-quote-generator', category: 'Fun & Random Tools' },
        { name: 'Name Generator (Various Types)', url: '/tools/name-generator-various', category: 'Fun & Random Tools' },
        { name: 'Color Palette Generator', url: '/tools/color-palette-generator', category: 'Fun & Random Tools' },
        { name: 'Fake Data Generator', url: '/tools/fake-data-generator', category: 'Fun & Random Tools' },
      ]
    },
    {
      key: 'archive',
      title: 'Archive Tools',
      icon: Archive,
      tools: [
        { name: 'ZIP File Creator', url: '/tools/zip-file-creator', category: 'Archive Tools' },
        { name: 'ZIP File Extractor/Viewer', url: '/tools/zip-file-extractor', category: 'Archive Tools' },
        { name: 'RAR File Extractor', url: '/tools/rar-file-extractor', category: 'Archive Tools' },
        { name: '7Z File Creator', url: '/tools/7z-file-creator', category: 'Archive Tools' },
        { name: '7Z File Extractor', url: '/tools/7z-file-extractor', category: 'Archive Tools' },
        { name: 'TAR File Creator', url: '/tools/tar-file-creator', category: 'Archive Tools' },
        { name: 'TAR.GZ Extractor', url: '/tools/tar-gz-extractor', category: 'Archive Tools' },
        { name: 'Archive File Converter (ZIP⇄RAR⇄7Z)', url: '/tools/archive-file-converter', category: 'Archive Tools' },
        { name: 'Compressed File Password Remover', url: '/tools/compressed-file-password-remover', category: 'Archive Tools' },
        { name: 'Archive File Inspector', url: '/tools/archive-file-inspector', category: 'Archive Tools' },
        { name: 'Bulk File Compressor', url: '/tools/bulk-file-compressor', category: 'Archive Tools' },
        { name: 'Split Archive Creator', url: '/tools/split-archive-creator', category: 'Archive Tools' },
        { name: 'Archive Integrity Checker', url: '/tools/archive-integrity-checker', category: 'Archive Tools' },
        { name: 'Password Protected ZIP Creator', url: '/tools/password-protected-zip-creator', category: 'Archive Tools' },
        { name: 'Multi-Format Archive Extractor', url: '/tools/multi-format-archive-extractor', category: 'Archive Tools' },
      ]
    },
    {
      key: 'security',
      title: 'Security',
      icon: Shield,
      tools: [
        { name: 'Password Strength Checker', url: '/tools/password-strength-checker', category: 'Security & Privacy' },
        { name: 'Privacy Policy Generator (Basic)', url: '/tools/privacy-policy-generator', category: 'Security & Privacy' },
        { name: 'Terms of Service Generator (Basic)', url: '/tools/terms-of-service-generator', category: 'Security & Privacy' },
        { name: 'Temporary Email Generator', url: '/tools/temporary-email-generator', category: 'Security & Privacy' },
        { name: 'Email Signature Generator', url: '/tools/email-signature-generator', category: 'Security & Privacy' },
        { name: 'Two-Factor Auth QR Generator', url: '/tools/two-factor-auth-qr-generator', category: 'Security & Privacy' },
        { name: 'Secure Note Generator', url: '/tools/secure-note-generator', category: 'Security & Privacy' },
        { name: 'VPN Speed Test', url: '/tools/vpn-speed-test', category: 'Security & Privacy' },
        { name: 'Password Leak Checker', url: '/tools/password-leak-checker', category: 'Security & Privacy' },
        { name: 'Anonymous File Sharing', url: '/tools/anonymous-file-sharing', category: 'Security & Privacy' },
        
        // Developer Tools
        { name: 'API Tester', url: '/tools/api-tester', category: 'Developer Tools' },
        { name: 'HTTP Status Code Checker', url: '/tools/http-status-code-checker', category: 'Developer Tools' },
        { name: 'Domain Age Checker', url: '/tools/domain-age-checker', category: 'Developer Tools' },
        { name: 'SSL Certificate Checker', url: '/tools/ssl-certificate-checker', category: 'Developer Tools' },
        { name: 'Website Speed Test', url: '/tools/website-speed-test', category: 'Developer Tools' },
        { name: 'Responsive Design Tester', url: '/tools/responsive-design-tester', category: 'Developer Tools' },
        { name: 'WHOIS Lookup', url: '/tools/whois-lookup', category: 'Developer Tools' },
        { name: 'DNS Lookup', url: '/tools/dns-lookup', category: 'Developer Tools' },
        { name: 'Port Scanner', url: '/tools/port-scanner', category: 'Developer Tools' },
        { name: 'Hex Color Picker', url: '/tools/hex-color-picker', category: 'Developer Tools' },
      ]
    },
    {
      key: 'video',
      title: 'Video Tools',
      icon: Video,
      tools: [
        { name: 'Video Compressor', url: '/tools/video-compressor', category: 'Video Tools' },
        { name: 'GIF Maker', url: '/tools/gif-maker', category: 'Video Tools' },
        { name: 'MP4 Converter', url: '/tools/mp4-converter', category: 'Video Tools' },
        { name: 'Video to Audio', url: '/tools/video-to-audio', category: 'Video Tools' },
        { name: 'Screen Recorder', url: '/tools/screen-recorder', category: 'Video Tools' },
        { name: 'Video Trimmer', url: '/tools/video-trimmer', category: 'Video Tools' },
        { name: 'Video Converter', url: '/tools/video-converter', category: 'Video Tools' },
        { name: 'Video Editor', url: '/tools/video-editor', category: 'Video Tools' },
        { name: 'Subtitle Generator', url: '/tools/subtitle-generator', category: 'Video Tools' },
        { name: 'Video Merger', url: '/tools/video-merger', category: 'Video Tools' },
        { name: 'Video Stabilizer', url: '/tools/video-stabilizer', category: 'Video Tools' },
        { name: 'Slow Motion Video', url: '/tools/slow-motion-video', category: 'Video Tools' },
      ]
    },
    {
      key: 'audio',
      title: 'Audio Tools',
      icon: Music,
      tools: [
        { name: 'Audio Converter', url: '/tools/audio-converter', category: 'Audio Tools' },
        { name: 'MP3 Converter', url: '/tools/mp3-converter', category: 'Audio Tools' },
        { name: 'Audio Compressor', url: '/tools/audio-compressor', category: 'Audio Tools' },
        { name: 'Audio Trimmer', url: '/tools/audio-trimmer', category: 'Audio Tools' },
        { name: 'Volume Booster', url: '/tools/volume-booster', category: 'Audio Tools' },
        { name: 'Audio Recorder', url: '/tools/audio-recorder', category: 'Audio Tools' },
        { name: 'Voice Enhancer', url: '/tools/voice-enhancer', category: 'Audio Tools' },
        { name: 'Noise Remover', url: '/tools/noise-remover', category: 'Audio Tools' },
        { name: 'Audio Merger', url: '/tools/audio-merger', category: 'Audio Tools' },
        { name: 'Pitch Changer', url: '/tools/pitch-changer', category: 'Audio Tools' },
        { name: 'Karaoke Maker', url: '/tools/karaoke-maker', category: 'Audio Tools' },
        { name: 'Audio Normalizer', url: '/tools/audio-normalizer', category: 'Audio Tools' },
      ]
    },
    {
      key: 'pdf',
      title: 'PDF Tools',
      icon: FileText,
      tools: [
        { name: 'PDF Merger', url: '/tools/pdf-merger', category: 'PDF Tools' },
        { name: 'PDF Splitter', url: '/tools/pdf-splitter', category: 'PDF Tools' },
        { name: 'PDF Compressor', url: '/tools/pdf-compressor', category: 'PDF Tools' },
        { name: 'JPG to PDF', url: '/tools/jpg-to-pdf', category: 'PDF Tools' },
        { name: 'Word to PDF', url: '/tools/word-to-pdf', category: 'PDF Tools' },
        { name: 'Excel to PDF', url: '/tools/excel-to-pdf', category: 'PDF Tools' },
        { name: 'PDF to Word', url: '/tools/pdf-to-word', category: 'PDF Tools' },
        { name: 'PDF to Excel', url: '/tools/pdf-to-excel', category: 'PDF Tools' },
        { name: 'PDF to PowerPoint', url: '/tools/pdf-to-powerpoint', category: 'PDF Tools' },
        { name: 'PDF Password Remover', url: '/tools/pdf-password-remover', category: 'PDF Tools' },
        { name: 'OCR Scanner', url: '/tools/ocr-scanner', category: 'PDF Tools' },
        { name: 'PDF Editor', url: '/tools/pdf-editor', category: 'PDF Tools' },
      ]
    },
    {
      key: 'educational',
      title: 'Educational',
      icon: BookOpen,
      tools: [
        { name: 'Unit Circle Calculator', url: '/tools/unit-circle-calculator', category: 'Educational & Reference' },
        { name: 'Conversion Tables Generator', url: '/tools/conversion-tables-generator', category: 'Educational & Reference' },
        { name: 'Chemical Formula Balancer', url: '/tools/chemical-formula-balancer', category: 'Educational & Reference' },
        { name: 'Roman Numeral Converter', url: '/tools/roman-numeral-converter', category: 'Educational & Reference' },
        { name: 'Coordinate Converter', url: '/tools/coordinate-converter', category: 'Educational & Reference' },
        { name: 'Timezone Database', url: '/tools/timezone-database', category: 'Educational & Reference' },
        { name: 'Country Information Lookup', url: '/tools/country-information-lookup', category: 'Educational & Reference' },
        { name: 'Language Code Reference', url: '/tools/language-code-reference', category: 'Educational & Reference' },
      ]
    },
    {
      key: 'business',
      title: 'Business',
      icon: Briefcase,
      tools: [
        { name: 'Business Card Generator', url: '/tools/business-card-generator', category: 'Business & Marketing' },
        { name: 'Press Release Template', url: '/tools/press-release-template', category: 'Business & Marketing' },
        { name: 'Marketing Calendar', url: '/tools/marketing-calendar', category: 'Business & Marketing' },
        { name: 'Competitor Analysis Tool', url: '/tools/competitor-analysis-tool', category: 'Business & Marketing' },
        { name: 'Keyword Research Helper', url: '/tools/keyword-research-helper', category: 'Business & Marketing' },
        { name: 'Social Media Analytics', url: '/tools/social-media-analytics', category: 'Business & Marketing' },
        { name: 'Lead Magnet Creator', url: '/tools/lead-magnet-creator', category: 'Business & Marketing' },
        { name: 'Email Subject Line Tester', url: '/tools/email-subject-line-tester', category: 'Business & Marketing' },
      ]
    }
  ];

  // If activeCategory is specified, only show that category's tools
  const categoriesToShow = activeCategory 
    ? toolCategories.filter(cat => cat.key === activeCategory)
    : toolCategories;

  // Group tools by category for multi-column layout
  const groupToolsByCategory = (tools: any[]) => {
    const grouped = tools.reduce((acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = [];
      }
      acc[tool.category].push(tool);
      return acc;
    }, {} as Record<string, any[]>);
    return grouped;
  };

  return (
    <div className="bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categoriesToShow.map((category, index) => (
          <div key={index} className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <category.icon className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
              <span className="text-sm text-gray-500">({category.tools.length} tools)</span>
            </div>
            
            {/* Multi-column layout grouped by subcategories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Object.entries(groupToolsByCategory(category.tools)).map(([subcategory, tools]) => (
                <div key={subcategory} className="space-y-3">
                  <h4 className="font-semibold text-gray-800 text-sm border-b border-gray-200 pb-1">
                    {subcategory}
                  </h4>
                  <ul className="space-y-2">
                    {tools.map((tool, toolIndex) => (
                      <li key={toolIndex}>
                        <Link
                          to={tool.url}
                          onClick={onClose}
                          className="flex items-center justify-between text-sm text-gray-600 hover:text-blue-600 transition-colors group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform">
                            {tool.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            All tools are completely free to use! 🎉
          </p>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
