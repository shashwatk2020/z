
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
  Lock
} from 'lucide-react';

interface MegaMenuProps {
  onClose: () => void;
}

const MegaMenu = ({ onClose }: MegaMenuProps) => {
  const toolCategories = [
    {
      title: 'Text Tools',
      icon: Type,
      tools: [
        // Conversion & Case
        { name: 'Case Converter (All Cases)', url: '/tools/case-converter-all', premium: false },
        { name: 'Sentence Case Converter', url: '/tools/sentence-case', premium: false },
        { name: 'Binary ⇄ Text Converter', url: '/tools/binary-text', premium: false },
        { name: 'Text to Hex Converter', url: '/tools/text-to-hex', premium: false },
        { name: 'Hex to Text Converter', url: '/tools/hex-to-text', premium: false },
        { name: 'Text to ASCII', url: '/tools/text-to-ascii', premium: false },
        { name: 'ASCII to Text', url: '/tools/ascii-to-text', premium: false },
        { name: 'Reverse Text Generator', url: '/tools/reverse-text', premium: false },
        { name: 'Text to Speech Converter', url: '/tools/text-to-speech', premium: false },
        { name: 'Unicode Character Converter', url: '/tools/unicode-converter', premium: false },
        { name: 'Number to Words Converter', url: '/tools/number-to-words', premium: false },
        
        // Generation
        { name: 'Random Password Generator', url: '/tools/random-password', premium: false },
        { name: 'Advanced Lorem Ipsum', url: '/tools/lorem-ipsum-advanced', premium: false },
        { name: 'Advanced Slug Generator', url: '/tools/slug-generator', premium: false },
        { name: 'Random Word Generator', url: '/tools/random-word', premium: false },
        { name: 'Random Letter Generator', url: '/tools/random-letter', premium: false },
        { name: 'Text Repeater', url: '/tools/text-repeater', premium: false },
        { name: 'Hashtag Generator', url: '/tools/hashtag-generator', premium: true },
        { name: 'Blog Title Generator', url: '/tools/blog-title-generator', premium: true },
        { name: 'Strong Password Generator with Rules', url: '/tools/strong-password-rules', premium: false },
        { name: 'Article Title Generator', url: '/tools/article-title-generator', premium: true },
        { name: 'Username Generator', url: '/tools/username-generator', premium: false },
        { name: 'Business Name Generator', url: '/tools/business-name-generator', premium: true },
        
        // Analysis & Utilities
        { name: 'Online Word Counter', url: '/tools/word-counter', premium: false },
        { name: 'Character Counter', url: '/tools/character-counter', premium: false },
        { name: 'Duplicate Line Remover', url: '/tools/duplicate-line-remover', premium: false },
        { name: 'Advanced Whitespace Remover', url: '/tools/whitespace-remover', premium: false },
        { name: 'Text Compare (Diff Checker)', url: '/tools/text-diff-checker', premium: false },
        { name: 'Find and Replace Text', url: '/tools/find-replace-text', premium: false },
        { name: 'Keyword Density Checker', url: '/tools/keyword-density-checker', premium: true },
        { name: 'Meta Description Generator', url: '/tools/meta-description-generator', premium: true },
        { name: 'Text Summarizer', url: '/tools/text-summarizer', premium: true },
        { name: 'Plagiarism Checker (Basic)', url: '/tools/plagiarism-checker', premium: true },
        { name: 'Reading Time Calculator', url: '/tools/reading-time-calculator', premium: false },
        { name: 'Language Detector', url: '/tools/language-detector', premium: true },
        
        // Styling & Fun
        { name: 'Bold Text Generator', url: '/tools/bold-text-generator', premium: false },
        { name: 'Italic Text Generator', url: '/tools/italic-text-generator', premium: false },
        { name: 'Fancy Text Generator', url: '/tools/fancy-text-generator', premium: false },
        { name: 'Zalgo Glitch Text', url: '/tools/zalgo-glitch-text', premium: false },
        { name: 'Big Text (ASCII) Generator', url: '/tools/big-text-ascii', premium: false },
        { name: 'ASCII Art Generator', url: '/tools/ascii-art-generator', premium: true },
        { name: 'Yoda Translator', url: '/tools/yoda-translator', premium: false },
        { name: 'Morse Code Translator', url: '/tools/morse-code-translator', premium: false },
        { name: 'Emoji Text Generator', url: '/tools/emoji-text-generator', premium: false },
        { name: 'Text Art Generator', url: '/tools/text-art-generator', premium: true },
        { name: 'Upside Down Text Generator', url: '/tools/upside-down-text', premium: false },
      ]
    },
    {
      title: 'Web Tools',
      icon: Globe,
      tools: [
        // Converters & Encoders
        { name: 'HTML Entity Encode/Decode', url: '/tools/html-entity-encoder', premium: false },
        { name: 'URL Encode/Decode', url: '/tools/url-encoder-decoder', premium: false },
        { name: 'Advanced Base64 Encode/Decode', url: '/tools/base64-encoder-advanced', premium: false },
        { name: 'CSV to JSON Converter', url: '/tools/csv-to-json', premium: false },
        { name: 'JSON to CSV Converter', url: '/tools/json-to-csv', premium: false },
        { name: 'XML to JSON Converter', url: '/tools/xml-to-json', premium: false },
        { name: 'YAML to JSON Converter', url: '/tools/yaml-to-json', premium: false },
        { name: 'Color Code Converter (Hex/RGB/HSL)', url: '/tools/color-code-converter', premium: false },
        { name: 'Markdown to HTML Converter', url: '/tools/markdown-to-html', premium: false },
        { name: 'HTML to Markdown Converter', url: '/tools/html-to-markdown', premium: false },
        { name: 'SQL to JSON Converter', url: '/tools/sql-to-json', premium: true },
        { name: 'Excel to JSON Converter', url: '/tools/excel-to-json', premium: true },
        
        // Generators
        { name: 'QR Code Generator', url: '/tools/qr-generator', premium: false },
        { name: 'Favicon Generator', url: '/tools/favicon-generator', premium: true },
        { name: 'UUID Generator', url: '/tools/uuid-generator', premium: false },
        { name: 'Hash Generator (MD5/SHA)', url: '/tools/hash-generator', premium: false },
        { name: 'Meta Tag Generator', url: '/tools/meta-tag-generator', premium: true },
        { name: 'Open Graph (OG) Generator', url: '/tools/og-generator', premium: true },
        { name: 'UTM Builder', url: '/tools/utm-builder', premium: true },
        { name: 'HTTP Header Generator', url: '/tools/http-header-generator', premium: true },
        { name: 'API Documentation Generator', url: '/tools/api-doc-generator', premium: true },
        { name: 'Robots.txt Generator', url: '/tools/robots-txt-generator', premium: false },
        { name: 'Htaccess Generator', url: '/tools/htaccess-generator', premium: true },
        { name: 'Schema Markup Generator', url: '/tools/schema-markup-generator', premium: true },
        
        // Validators & Formatters
        { name: 'Advanced XML Validator', url: '/tools/xml-validator-advanced', premium: false },
        { name: 'Advanced SQL Formatter', url: '/tools/sql-formatter-advanced', premium: true },
        { name: 'Adv. CSS Minifier/Beautifier', url: '/tools/css-minifier-beautifier', premium: true },
        { name: 'JSON Validator & Formatter', url: '/tools/json-formatter', premium: false },
        { name: 'HTML Validator', url: '/tools/html-validator', premium: false },
        { name: 'CSS Validator', url: '/tools/css-validator', premium: false },
        { name: 'Robots.txt Validator', url: '/tools/robots-txt-validator', premium: false },
        { name: 'Sitemap Generator', url: '/tools/sitemap-generator', premium: true },
        { name: 'JavaScript Minifier/Beautifier', url: '/tools/js-minifier-beautifier', premium: true },
        { name: 'YAML Validator', url: '/tools/yaml-validator', premium: false },
        { name: 'Email Validator', url: '/tools/email-validator', premium: false },
        { name: 'Credit Card Validator', url: '/tools/credit-card-validator', premium: false },
        
        // Utilities & Dev
        { name: 'HTML Previewer', url: '/tools/html-previewer', premium: false },
        { name: 'XML Viewer, Editor & Validator', url: '/tools/xml-viewer-editor', premium: true },
        { name: 'Advanced Regex Tester', url: '/tools/regex-tester-advanced', premium: true },
        { name: 'Basic JavaScript Obfuscator', url: '/tools/js-obfuscator-basic', premium: true },
        { name: 'CSS Animator', url: '/tools/css-animator', premium: true },
        { name: 'Query String Parser', url: '/tools/query-string-parser', premium: false },
        { name: 'User-Agent Parser', url: '/tools/user-agent-parser', premium: false },
        { name: 'IP Address Viewer', url: '/tools/ip-address-viewer', premium: false },
        { name: 'Website Screenshot Tool', url: '/tools/website-screenshot', premium: true },
        { name: 'Broken Link Checker', url: '/tools/broken-link-checker', premium: true },
        { name: 'CSS Grid Generator', url: '/tools/css-grid-generator', premium: true },
        { name: 'Flexbox Generator', url: '/tools/flexbox-generator', premium: true },
        { name: 'Lorem Pixel Image Generator', url: '/tools/lorem-pixel-generator', premium: false },
      ]
    },
    {
      title: 'Image Tools',
      icon: Image,
      tools: [
        // Converters
        { name: 'Convert to JPG', url: '/tools/convert-to-jpg', premium: false },
        { name: 'Convert to PNG', url: '/tools/convert-to-png', premium: false },
        { name: 'Convert to WebP', url: '/tools/convert-to-webp', premium: false },
        { name: 'Convert to GIF', url: '/tools/convert-to-gif', premium: false },
        { name: 'Image to Base64', url: '/tools/image-to-base64', premium: false },
        { name: 'Base64 to Image', url: '/tools/base64-to-image', premium: false },
        { name: 'PDF to Image Converter', url: '/tools/pdf-to-image', premium: true },
        { name: 'SVG to PNG Converter', url: '/tools/svg-to-png', premium: false },
        { name: 'ICO to PNG Converter', url: '/tools/ico-to-png', premium: false },
        
        // Editors & Resizers
        { name: 'Image Resizer', url: '/tools/image-resizer', premium: false },
        { name: 'Image Cropper', url: '/tools/image-cropper', premium: false },
        { name: 'Rotate Image', url: '/tools/rotate-image', premium: false },
        { name: 'Flip Image', url: '/tools/flip-image', premium: false },
        { name: 'Add Text to Image', url: '/tools/add-text-to-image', premium: true },
        { name: 'Social Media Image Resizer', url: '/tools/social-media-resizer', premium: true },
        { name: 'Image Filters (Basic)', url: '/tools/image-filters-basic', premium: true },
        { name: 'Background Remover', url: '/tools/background-remover', premium: true },
        { name: 'Image Border Generator', url: '/tools/image-border-generator', premium: true },
        { name: 'Watermark Generator', url: '/tools/watermark-generator', premium: true },
        { name: 'Image Brightness/Contrast Adjuster', url: '/tools/image-brightness-contrast', premium: true },
        
        // Generators & Effects
        { name: 'GIF Maker (from images)', url: '/tools/gif-maker-images', premium: false },
        { name: 'Meme Generator', url: '/tools/meme-generator', premium: true },
        { name: 'Color Picker (from image/screen)', url: '/tools/color-picker-image', premium: false },
        { name: 'Gradient Generator', url: '/tools/gradient-generator', premium: false },
        { name: 'Pixel Art Generator', url: '/tools/pixel-art-generator', premium: true },
        { name: 'Zoom Background Maker', url: '/tools/zoom-background-maker', premium: true },
        { name: 'Business Card Designer', url: '/tools/business-card-designer', premium: true },
        { name: 'QR Code to Image Generator', url: '/tools/qr-code-to-image', premium: false },
        { name: 'Avatar Generator', url: '/tools/avatar-generator', premium: true },
        { name: 'Placeholder Image Generator', url: '/tools/placeholder-image-generator', premium: false },
        { name: 'Instagram Story Creator', url: '/tools/instagram-story-creator', premium: true },
        { name: 'Logo Maker (Basic)', url: '/tools/logo-maker-basic', premium: true },
        
        // Optimization & Utilities
        { name: 'Image Compressor (JPG/PNG/WebP)', url: '/tools/image-compressor-multi', premium: false },
        { name: 'PNG Compressor', url: '/tools/png-compressor', premium: false },
        { name: 'JPG Compressor', url: '/tools/jpg-compressor', premium: false },
        { name: 'EXIF/Metadata Remover', url: '/tools/exif-metadata-remover', premium: true },
        { name: 'Bulk Image Resizer', url: '/tools/bulk-image-resizer', premium: true },
        { name: 'Image Format Analyzer', url: '/tools/image-format-analyzer', premium: false },
        { name: 'Duplicate Image Finder', url: '/tools/duplicate-image-finder', premium: true },
        { name: 'Image Color Palette Extractor', url: '/tools/image-color-palette-extractor', premium: true },
      ]
    },
    {
      title: 'Calculators & Converters',
      icon: Calculator,
      tools: [
        // Math Calculators
        { name: 'Standard Calculator', url: '/tools/standard-calculator', premium: false },
        { name: 'Percentage Calculator', url: '/tools/percentage-calculator', premium: false },
        { name: 'Fraction Calculator', url: '/tools/fraction-calculator', premium: false },
        { name: 'Average Calculator', url: '/tools/average-calculator', premium: false },
        { name: 'Scientific Calculator', url: '/tools/scientific-calculator', premium: false },
        { name: 'Math Equation Solver (Basic)', url: '/tools/math-equation-solver', premium: true },
        { name: 'Grade Calculator', url: '/tools/grade-calculator', premium: false },
        { name: 'Mortgage Calculator', url: '/tools/mortgage-calculator', premium: false },
        { name: 'Statistics Calculator', url: '/tools/statistics-calculator', premium: true },
        { name: 'Matrix Calculator', url: '/tools/matrix-calculator', premium: true },
        { name: 'Loan Payment Calculator', url: '/tools/loan-payment-calculator', premium: false },
        
        // Unit Converters
        { name: 'Length Converter', url: '/tools/length-converter', premium: false },
        { name: 'Weight Converter', url: '/tools/weight-converter', premium: false },
        { name: 'Temperature Converter', url: '/tools/temperature-converter', premium: false },
        { name: 'Area Converter', url: '/tools/area-converter', premium: false },
        { name: 'Volume Converter', url: '/tools/volume-converter', premium: false },
        { name: 'Time Zone Converter', url: '/tools/time-zone-converter', premium: false },
        { name: 'Data Storage Converter', url: '/tools/data-storage-converter', premium: false },
        { name: 'Speed Converter', url: '/tools/speed-converter', premium: false },
        { name: 'Energy Converter', url: '/tools/energy-converter', premium: false },
        { name: 'Pressure Converter', url: '/tools/pressure-converter', premium: false },
        { name: 'Angle Converter', url: '/tools/angle-converter', premium: false },
        { name: 'Currency Converter (Live Rates)', url: '/tools/currency-converter-live', premium: true },
        
        // Finance Calculators
        { name: 'Tip Calculator', url: '/tools/tip-calculator', premium: false },
        { name: 'Loan EMI Calculator', url: '/tools/loan-emi-calculator', premium: false },
        { name: 'Compound Interest Calculator', url: '/tools/compound-interest-calculator', premium: false },
        { name: 'VAT/GST Calculator', url: '/tools/vat-gst-calculator', premium: false },
        { name: 'Currency Converter', url: '/tools/currency-converter', premium: true },
        { name: 'Salary Converter (Hourly/Annual)', url: '/tools/salary-converter', premium: false },
        { name: 'Retirement Savings Estimator', url: '/tools/retirement-savings-estimator', premium: true },
        { name: 'Investment Return Calculator', url: '/tools/investment-return-calculator', premium: true },
        { name: 'Tax Calculator', url: '/tools/tax-calculator', premium: true },
        { name: 'Budget Planner', url: '/tools/budget-planner', premium: true },
        { name: 'ROI Calculator', url: '/tools/roi-calculator', premium: true },
        
        // Health & Lifestyle
        { name: 'Age Calculator', url: '/tools/age-calculator', premium: false },
        { name: 'Date Difference Calculator', url: '/tools/date-difference-calculator', premium: false },
        { name: 'BMI Calculator', url: '/tools/bmi-calculator', premium: false },
        { name: 'Calorie Calculator (BMR/TDEE)', url: '/tools/calorie-calculator', premium: false },
        { name: 'Body Fat Percentage Estimator', url: '/tools/body-fat-percentage', premium: true },
        { name: 'Pregnancy Due Date Calculator', url: '/tools/pregnancy-due-date', premium: false },
        { name: 'Recipe Nutrition Calculator', url: '/tools/recipe-nutrition-calculator', premium: true },
        { name: 'Water Intake Calculator', url: '/tools/water-intake-calculator', premium: false },
        { name: 'Sleep Calculator', url: '/tools/sleep-calculator', premium: false },
        { name: 'Ideal Weight Calculator', url: '/tools/ideal-weight-calculator', premium: false },
        { name: 'Macro Calculator', url: '/tools/macro-calculator', premium: true },
      ]
    },
    {
      title: 'Productivity & Utilities',
      icon: Zap,
      tools: [
        // Time & Productivity
        { name: 'Online Notepad', url: '/tools/online-notepad', premium: false },
        { name: 'Pomodoro Timer 🍅', url: '/tools/pomodoro-timer', premium: false },
        { name: 'Countdown Timer', url: '/tools/countdown-timer', premium: false },
        { name: 'Online Stopwatch', url: '/tools/online-stopwatch', premium: false },
        { name: 'Daily Planner Generator', url: '/tools/daily-planner-generator', premium: true },
        { name: 'Meeting Cost Calculator', url: '/tools/meeting-cost-calculator', premium: true },
        { name: 'World Clock', url: '/tools/world-clock', premium: false },
        { name: 'Time Tracker', url: '/tools/time-tracker', premium: true },
        { name: 'Habit Tracker', url: '/tools/habit-tracker', premium: true },
        { name: 'Goal Setting Template', url: '/tools/goal-setting-template', premium: true },
        { name: 'Invoice Generator', url: '/tools/invoice-generator', premium: true },
        
        // Data & File Tools
        { name: 'CSV Viewer', url: '/tools/csv-viewer', premium: false },
        { name: 'JSON Viewer', url: '/tools/json-viewer', premium: false },
        { name: 'Excel to HTML Table', url: '/tools/excel-to-html-table', premium: true },
        { name: 'Diff Checker (Text Compare)', url: '/tools/diff-checker-text', premium: false },
        { name: 'Periodic Table Explorer', url: '/tools/periodic-table-explorer', premium: false },
        { name: 'PDF Tools Suite (Merge, Split, Compress)', url: '/tools/pdf-tools-suite', premium: true },
        { name: 'File Hash Checker', url: '/tools/file-hash-checker', premium: false },
        { name: 'Duplicate File Finder', url: '/tools/duplicate-file-finder', premium: true },
        { name: 'File Size Calculator', url: '/tools/file-size-calculator', premium: false },
        { name: 'Backup Reminder Generator', url: '/tools/backup-reminder-generator', premium: true },
        
        // Communication & Social
        { name: 'Email Template Generator', url: '/tools/email-template-generator', premium: true },
        { name: 'Social Media Post Scheduler', url: '/tools/social-media-post-scheduler', premium: true },
        { name: 'WhatsApp Link Generator', url: '/tools/whatsapp-link-generator', premium: false },
        { name: 'Mailto Link Generator', url: '/tools/mailto-link-generator', premium: false },
        { name: 'Contact Form Generator', url: '/tools/contact-form-generator', premium: true },
        { name: 'Survey Creator (Basic)', url: '/tools/survey-creator-basic', premium: true },
        
        // Fun & Random Tools
        { name: 'Coin Flipper', url: '/tools/coin-flipper', premium: false },
        { name: 'Dice Roller', url: '/tools/dice-roller', premium: false },
        { name: 'Random Number Generator', url: '/tools/random-number-generator', premium: false },
        { name: 'Random Country Generator', url: '/tools/random-country-generator', premium: false },
        { name: 'Band Name Generator', url: '/tools/band-name-generator', premium: false },
        { name: 'Riddle Generator', url: '/tools/riddle-generator', premium: true },
        { name: 'Tarot Card Reader (Fun)', url: '/tools/tarot-card-reader', premium: false },
        { name: 'Decision Maker Wheel', url: '/tools/decision-maker-wheel', premium: false },
        { name: 'Random Quote Generator', url: '/tools/random-quote-generator', premium: false },
        { name: 'Name Generator (Various Types)', url: '/tools/name-generator-various', premium: false },
        { name: 'Color Palette Generator', url: '/tools/color-palette-generator', premium: true },
        { name: 'Fake Data Generator', url: '/tools/fake-data-generator', premium: true },
      ]
    },
    {
      title: 'Archive & Compression',
      icon: Archive,
      tools: [
        { name: 'ZIP File Creator', url: '/tools/zip-file-creator', premium: false },
        { name: 'ZIP File Extractor/Viewer', url: '/tools/zip-file-extractor', premium: false },
        { name: 'RAR File Extractor', url: '/tools/rar-file-extractor', premium: false },
        { name: '7Z File Creator', url: '/tools/7z-file-creator', premium: false },
        { name: '7Z File Extractor', url: '/tools/7z-file-extractor', premium: false },
        { name: 'TAR File Creator', url: '/tools/tar-file-creator', premium: false },
        { name: 'TAR.GZ Extractor', url: '/tools/tar-gz-extractor', premium: false },
        { name: 'Archive File Converter (ZIP⇄RAR⇄7Z)', url: '/tools/archive-file-converter', premium: true },
        { name: 'Compressed File Password Remover', url: '/tools/compressed-file-password-remover', premium: true },
        { name: 'Archive File Inspector', url: '/tools/archive-file-inspector', premium: true },
        { name: 'Bulk File Compressor', url: '/tools/bulk-file-compressor', premium: true },
        { name: 'Split Archive Creator', url: '/tools/split-archive-creator', premium: true },
        { name: 'Archive Integrity Checker', url: '/tools/archive-integrity-checker', premium: true },
        { name: 'Password Protected ZIP Creator', url: '/tools/password-protected-zip-creator', premium: true },
        { name: 'Multi-Format Archive Extractor', url: '/tools/multi-format-archive-extractor', premium: true },
      ]
    },
    {
      title: 'Security & Privacy',
      icon: Shield,
      tools: [
        { name: 'Password Strength Checker', url: '/tools/password-strength-checker', premium: false },
        { name: 'Privacy Policy Generator (Basic)', url: '/tools/privacy-policy-generator', premium: true },
        { name: 'Terms of Service Generator (Basic)', url: '/tools/terms-of-service-generator', premium: true },
        { name: 'Temporary Email Generator', url: '/tools/temporary-email-generator', premium: false },
        { name: 'Email Signature Generator', url: '/tools/email-signature-generator', premium: true },
        { name: 'Two-Factor Auth QR Generator', url: '/tools/two-factor-auth-qr-generator', premium: true },
        { name: 'Secure Note Generator', url: '/tools/secure-note-generator', premium: true },
        { name: 'VPN Speed Test', url: '/tools/vpn-speed-test', premium: true },
        { name: 'Password Leak Checker', url: '/tools/password-leak-checker', premium: true },
        { name: 'Anonymous File Sharing', url: '/tools/anonymous-file-sharing', premium: true },
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
    }
  ];

  return (
    <div className="bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {toolCategories.map((category, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center space-x-2">
                <category.icon className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">{category.title}</h3>
              </div>
              <ul className="space-y-2 max-h-96 overflow-y-auto">
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
