
import React, { useState, useRef, useEffect } from 'react';
import { Search, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const tools = [
  // Text Tools - Conversion & Case
  { name: 'Case Converter (All Cases)', category: 'Text Tools', url: '/tools/case-converter-all', premium: false },
  { name: 'Sentence Case Converter', category: 'Text Tools', url: '/tools/sentence-case', premium: false },
  { name: 'Binary ⇄ Text Converter', category: 'Text Tools', url: '/tools/binary-text', premium: false },
  { name: 'Text to Hex Converter', category: 'Text Tools', url: '/tools/text-to-hex', premium: false },
  { name: 'Hex to Text Converter', category: 'Text Tools', url: '/tools/hex-to-text', premium: false },
  { name: 'Text to ASCII', category: 'Text Tools', url: '/tools/text-to-ascii', premium: false },
  { name: 'ASCII to Text', category: 'Text Tools', url: '/tools/ascii-to-text', premium: false },
  { name: 'Reverse Text Generator', category: 'Text Tools', url: '/tools/reverse-text', premium: false },
  { name: 'Text to Speech Converter', category: 'Text Tools', url: '/tools/text-to-speech', premium: false },
  { name: 'Unicode Character Converter', category: 'Text Tools', url: '/tools/unicode-converter', premium: false },
  { name: 'Number to Words Converter', category: 'Text Tools', url: '/tools/number-to-words', premium: false },

  // Text Tools - Generation
  { name: 'Random Password Generator', category: 'Text Tools', url: '/tools/random-password', premium: false },
  { name: 'Advanced Lorem Ipsum', category: 'Text Tools', url: '/tools/lorem-ipsum-advanced', premium: false },
  { name: 'Advanced Slug Generator', category: 'Text Tools', url: '/tools/slug-generator', premium: false },
  { name: 'Random Word Generator', category: 'Text Tools', url: '/tools/random-word', premium: false },
  { name: 'Random Letter Generator', category: 'Text Tools', url: '/tools/random-letter', premium: false },
  { name: 'Text Repeater', category: 'Text Tools', url: '/tools/text-repeater', premium: false },
  { name: 'Hashtag Generator', category: 'Text Tools', url: '/tools/hashtag-generator', premium: true },
  { name: 'Blog Title Generator', category: 'Text Tools', url: '/tools/blog-title-generator', premium: true },
  { name: 'Strong Password Generator with Rules', category: 'Text Tools', url: '/tools/strong-password-rules', premium: false },
  { name: 'Article Title Generator', category: 'Text Tools', url: '/tools/article-title-generator', premium: true },
  { name: 'Username Generator', category: 'Text Tools', url: '/tools/username-generator', premium: false },
  { name: 'Business Name Generator', category: 'Text Tools', url: '/tools/business-name-generator', premium: true },

  // Text Tools - Analysis & Utilities
  { name: 'Online Word Counter', category: 'Text Tools', url: '/tools/word-counter', premium: false },
  { name: 'Character Counter', category: 'Text Tools', url: '/tools/character-counter', premium: false },
  { name: 'Duplicate Line Remover', category: 'Text Tools', url: '/tools/duplicate-line-remover', premium: false },
  { name: 'Advanced Whitespace Remover', category: 'Text Tools', url: '/tools/whitespace-remover', premium: false },
  { name: 'Text Compare (Diff Checker)', category: 'Text Tools', url: '/tools/text-diff-checker', premium: false },
  { name: 'Find and Replace Text', category: 'Text Tools', url: '/tools/find-replace-text', premium: false },
  { name: 'Keyword Density Checker', category: 'Text Tools', url: '/tools/keyword-density-checker', premium: true },
  { name: 'Meta Description Generator', category: 'Text Tools', url: '/tools/meta-description-generator', premium: true },
  { name: 'Text Summarizer', category: 'Text Tools', url: '/tools/text-summarizer', premium: true },
  { name: 'Plagiarism Checker (Basic)', category: 'Text Tools', url: '/tools/plagiarism-checker', premium: true },
  { name: 'Reading Time Calculator', category: 'Text Tools', url: '/tools/reading-time-calculator', premium: false },
  { name: 'Language Detector', category: 'Text Tools', url: '/tools/language-detector', premium: true },

  // Text Tools - Styling & Fun
  { name: 'Bold Text Generator', category: 'Text Tools', url: '/tools/bold-text-generator', premium: false },
  { name: 'Italic Text Generator', category: 'Text Tools', url: '/tools/italic-text-generator', premium: false },
  { name: 'Fancy Text Generator', category: 'Text Tools', url: '/tools/fancy-text-generator', premium: false },
  { name: 'Zalgo Glitch Text', category: 'Text Tools', url: '/tools/zalgo-glitch-text', premium: false },
  { name: 'Big Text (ASCII) Generator', category: 'Text Tools', url: '/tools/big-text-ascii', premium: false },
  { name: 'ASCII Art Generator', category: 'Text Tools', url: '/tools/ascii-art-generator', premium: true },
  { name: 'Yoda Translator', category: 'Text Tools', url: '/tools/yoda-translator', premium: false },
  { name: 'Morse Code Translator', category: 'Text Tools', url: '/tools/morse-code-translator', premium: false },
  { name: 'Emoji Text Generator', category: 'Text Tools', url: '/tools/emoji-text-generator', premium: false },
  { name: 'Text Art Generator', category: 'Text Tools', url: '/tools/text-art-generator', premium: true },
  { name: 'Upside Down Text Generator', category: 'Text Tools', url: '/tools/upside-down-text', premium: false },

  // Web Tools - Converters & Encoders
  { name: 'HTML Entity Encode/Decode', category: 'Web Tools', url: '/tools/html-entity-encoder', premium: false },
  { name: 'URL Encode/Decode', category: 'Web Tools', url: '/tools/url-encoder-decoder', premium: false },
  { name: 'Advanced Base64 Encode/Decode', category: 'Web Tools', url: '/tools/base64-encoder-advanced', premium: false },
  { name: 'CSV to JSON Converter', category: 'Web Tools', url: '/tools/csv-to-json', premium: false },
  { name: 'JSON to CSV Converter', category: 'Web Tools', url: '/tools/json-to-csv', premium: false },
  { name: 'XML to JSON Converter', category: 'Web Tools', url: '/tools/xml-to-json', premium: false },
  { name: 'YAML to JSON Converter', category: 'Web Tools', url: '/tools/yaml-to-json', premium: false },
  { name: 'Color Code Converter (Hex/RGB/HSL)', category: 'Web Tools', url: '/tools/color-code-converter', premium: false },
  { name: 'Markdown to HTML Converter', category: 'Web Tools', url: '/tools/markdown-to-html', premium: false },
  { name: 'HTML to Markdown Converter', category: 'Web Tools', url: '/tools/html-to-markdown', premium: false },
  { name: 'SQL to JSON Converter', category: 'Web Tools', url: '/tools/sql-to-json', premium: true },
  { name: 'Excel to JSON Converter', category: 'Web Tools', url: '/tools/excel-to-json', premium: true },

  // Web Tools - Generators
  { name: 'QR Code Generator', category: 'Web Tools', url: '/tools/qr-generator', premium: false },
  { name: 'Favicon Generator', category: 'Web Tools', url: '/tools/favicon-generator', premium: true },
  { name: 'UUID Generator', category: 'Web Tools', url: '/tools/uuid-generator', premium: false },
  { name: 'Hash Generator (MD5/SHA)', category: 'Web Tools', url: '/tools/hash-generator', premium: false },
  { name: 'Meta Tag Generator', category: 'Web Tools', url: '/tools/meta-tag-generator', premium: true },
  { name: 'Open Graph (OG) Generator', category: 'Web Tools', url: '/tools/og-generator', premium: true },
  { name: 'UTM Builder', category: 'Web Tools', url: '/tools/utm-builder', premium: true },
  { name: 'HTTP Header Generator', category: 'Web Tools', url: '/tools/http-header-generator', premium: true },
  { name: 'API Documentation Generator', category: 'Web Tools', url: '/tools/api-doc-generator', premium: true },
  { name: 'Robots.txt Generator', category: 'Web Tools', url: '/tools/robots-txt-generator', premium: false },
  { name: 'Htaccess Generator', category: 'Web Tools', url: '/tools/htaccess-generator', premium: true },
  { name: 'Schema Markup Generator', category: 'Web Tools', url: '/tools/schema-markup-generator', premium: true },

  // Web Tools - Validators & Formatters
  { name: 'Advanced XML Validator', category: 'Web Tools', url: '/tools/xml-validator-advanced', premium: false },
  { name: 'Advanced SQL Formatter', category: 'Web Tools', url: '/tools/sql-formatter-advanced', premium: true },
  { name: 'Adv. CSS Minifier/Beautifier', category: 'Web Tools', url: '/tools/css-minifier-beautifier', premium: true },
  { name: 'JSON Validator & Formatter', category: 'Web Tools', url: '/tools/json-formatter', premium: false },
  { name: 'HTML Validator', category: 'Web Tools', url: '/tools/html-validator', premium: false },
  { name: 'CSS Validator', category: 'Web Tools', url: '/tools/css-validator', premium: false },
  { name: 'Robots.txt Validator', category: 'Web Tools', url: '/tools/robots-txt-validator', premium: false },
  { name: 'Sitemap Generator', category: 'Web Tools', url: '/tools/sitemap-generator', premium: true },
  { name: 'JavaScript Minifier/Beautifier', category: 'Web Tools', url: '/tools/js-minifier-beautifier', premium: true },
  { name: 'YAML Validator', category: 'Web Tools', url: '/tools/yaml-validator', premium: false },
  { name: 'Email Validator', category: 'Web Tools', url: '/tools/email-validator', premium: false },
  { name: 'Credit Card Validator', category: 'Web Tools', url: '/tools/credit-card-validator', premium: false },

  // Web Tools - Utilities & Dev
  { name: 'HTML Previewer', category: 'Web Tools', url: '/tools/html-previewer', premium: false },
  { name: 'XML Viewer, Editor & Validator', category: 'Web Tools', url: '/tools/xml-viewer-editor', premium: true },
  { name: 'Advanced Regex Tester', category: 'Web Tools', url: '/tools/regex-tester-advanced', premium: true },
  { name: 'Basic JavaScript Obfuscator', category: 'Web Tools', url: '/tools/js-obfuscator-basic', premium: true },
  { name: 'CSS Animator', category: 'Web Tools', url: '/tools/css-animator', premium: true },
  { name: 'Query String Parser', category: 'Web Tools', url: '/tools/query-string-parser', premium: false },
  { name: 'User-Agent Parser', category: 'Web Tools', url: '/tools/user-agent-parser', premium: false },
  { name: 'IP Address Viewer', category: 'Web Tools', url: '/tools/ip-address-viewer', premium: false },
  { name: 'Website Screenshot Tool', category: 'Web Tools', url: '/tools/website-screenshot', premium: true },
  { name: 'Broken Link Checker', category: 'Web Tools', url: '/tools/broken-link-checker', premium: true },
  { name: 'CSS Grid Generator', category: 'Web Tools', url: '/tools/css-grid-generator', premium: true },
  { name: 'Flexbox Generator', category: 'Web Tools', url: '/tools/flexbox-generator', premium: true },
  { name: 'Lorem Pixel Image Generator', category: 'Web Tools', url: '/tools/lorem-pixel-generator', premium: false },

  // Image Tools - Converters
  { name: 'Convert to JPG', category: 'Image Tools', url: '/tools/convert-to-jpg', premium: false },
  { name: 'Convert to PNG', category: 'Image Tools', url: '/tools/convert-to-png', premium: false },
  { name: 'Convert to WebP', category: 'Image Tools', url: '/tools/convert-to-webp', premium: false },
  { name: 'Convert to GIF', category: 'Image Tools', url: '/tools/convert-to-gif', premium: false },
  { name: 'Image to Base64', category: 'Image Tools', url: '/tools/image-to-base64', premium: false },
  { name: 'Base64 to Image', category: 'Image Tools', url: '/tools/base64-to-image', premium: false },
  { name: 'PDF to Image Converter', category: 'Image Tools', url: '/tools/pdf-to-image', premium: true },
  { name: 'SVG to PNG Converter', category: 'Image Tools', url: '/tools/svg-to-png', premium: false },
  { name: 'ICO to PNG Converter', category: 'Image Tools', url: '/tools/ico-to-png', premium: false },

  // Image Tools - Editors & Resizers
  { name: 'Image Resizer', category: 'Image Tools', url: '/tools/image-resizer', premium: false },
  { name: 'Image Cropper', category: 'Image Tools', url: '/tools/image-cropper', premium: false },
  { name: 'Rotate Image', category: 'Image Tools', url: '/tools/rotate-image', premium: false },
  { name: 'Flip Image', category: 'Image Tools', url: '/tools/flip-image', premium: false },
  { name: 'Add Text to Image', category: 'Image Tools', url: '/tools/add-text-to-image', premium: true },
  { name: 'Social Media Image Resizer', category: 'Image Tools', url: '/tools/social-media-resizer', premium: true },
  { name: 'Image Filters (Basic)', category: 'Image Tools', url: '/tools/image-filters-basic', premium: true },
  { name: 'Background Remover', category: 'Image Tools', url: '/tools/background-remover', premium: true },
  { name: 'Image Border Generator', category: 'Image Tools', url: '/tools/image-border-generator', premium: true },
  { name: 'Watermark Generator', category: 'Image Tools', url: '/tools/watermark-generator', premium: true },
  { name: 'Image Brightness/Contrast Adjuster', category: 'Image Tools', url: '/tools/image-brightness-contrast', premium: true },

  // Image Tools - Generators & Effects
  { name: 'GIF Maker (from images)', category: 'Image Tools', url: '/tools/gif-maker-images', premium: false },
  { name: 'Meme Generator', category: 'Image Tools', url: '/tools/meme-generator', premium: true },
  { name: 'Color Picker (from image/screen)', category: 'Image Tools', url: '/tools/color-picker-image', premium: false },
  { name: 'Gradient Generator', category: 'Image Tools', url: '/tools/gradient-generator', premium: false },
  { name: 'Pixel Art Generator', category: 'Image Tools', url: '/tools/pixel-art-generator', premium: true },
  { name: 'Zoom Background Maker', category: 'Image Tools', url: '/tools/zoom-background-maker', premium: true },
  { name: 'Business Card Designer', category: 'Image Tools', url: '/tools/business-card-designer', premium: true },
  { name: 'QR Code to Image Generator', category: 'Image Tools', url: '/tools/qr-code-to-image', premium: false },
  { name: 'Avatar Generator', category: 'Image Tools', url: '/tools/avatar-generator', premium: true },
  { name: 'Placeholder Image Generator', category: 'Image Tools', url: '/tools/placeholder-image-generator', premium: false },
  { name: 'Instagram Story Creator', category: 'Image Tools', url: '/tools/instagram-story-creator', premium: true },
  { name: 'Logo Maker (Basic)', category: 'Image Tools', url: '/tools/logo-maker-basic', premium: true },

  // Image Tools - Optimization & Utilities
  { name: 'Image Compressor (JPG/PNG/WebP)', category: 'Image Tools', url: '/tools/image-compressor-multi', premium: false },
  { name: 'PNG Compressor', category: 'Image Tools', url: '/tools/png-compressor', premium: false },
  { name: 'JPG Compressor', category: 'Image Tools', url: '/tools/jpg-compressor', premium: false },
  { name: 'EXIF/Metadata Remover', category: 'Image Tools', url: '/tools/exif-metadata-remover', premium: true },
  { name: 'Bulk Image Resizer', category: 'Image Tools', url: '/tools/bulk-image-resizer', premium: true },
  { name: 'Image Format Analyzer', category: 'Image Tools', url: '/tools/image-format-analyzer', premium: false },
  { name: 'Duplicate Image Finder', category: 'Image Tools', url: '/tools/duplicate-image-finder', premium: true },
  { name: 'Image Color Palette Extractor', category: 'Image Tools', url: '/tools/image-color-palette-extractor', premium: true },

  // Calculators & Converters - Math Calculators
  { name: 'Standard Calculator', category: 'Calculators & Converters', url: '/tools/standard-calculator', premium: false },
  { name: 'Percentage Calculator', category: 'Calculators & Converters', url: '/tools/percentage-calculator', premium: false },
  { name: 'Fraction Calculator', category: 'Calculators & Converters', url: '/tools/fraction-calculator', premium: false },
  { name: 'Average Calculator', category: 'Calculators & Converters', url: '/tools/average-calculator', premium: false },
  { name: 'Scientific Calculator', category: 'Calculators & Converters', url: '/tools/scientific-calculator', premium: false },
  { name: 'Math Equation Solver (Basic)', category: 'Calculators & Converters', url: '/tools/math-equation-solver', premium: true },
  { name: 'Grade Calculator', category: 'Calculators & Converters', url: '/tools/grade-calculator', premium: false },
  { name: 'Mortgage Calculator', category: 'Calculators & Converters', url: '/tools/mortgage-calculator', premium: false },
  { name: 'Statistics Calculator', category: 'Calculators & Converters', url: '/tools/statistics-calculator', premium: true },
  { name: 'Matrix Calculator', category: 'Calculators & Converters', url: '/tools/matrix-calculator', premium: true },
  { name: 'Loan Payment Calculator', category: 'Calculators & Converters', url: '/tools/loan-payment-calculator', premium: false },

  // Unit Converters
  { name: 'Length Converter', category: 'Calculators & Converters', url: '/tools/length-converter', premium: false },
  { name: 'Weight Converter', category: 'Calculators & Converters', url: '/tools/weight-converter', premium: false },
  { name: 'Temperature Converter', category: 'Calculators & Converters', url: '/tools/temperature-converter', premium: false },
  { name: 'Area Converter', category: 'Calculators & Converters', url: '/tools/area-converter', premium: false },
  { name: 'Volume Converter', category: 'Calculators & Converters', url: '/tools/volume-converter', premium: false },
  { name: 'Time Zone Converter', category: 'Calculators & Converters', url: '/tools/time-zone-converter', premium: false },
  { name: 'Data Storage Converter', category: 'Calculators & Converters', url: '/tools/data-storage-converter', premium: false },
  { name: 'Speed Converter', category: 'Calculators & Converters', url: '/tools/speed-converter', premium: false },
  { name: 'Energy Converter', category: 'Calculators & Converters', url: '/tools/energy-converter', premium: false },
  { name: 'Pressure Converter', category: 'Calculators & Converters', url: '/tools/pressure-converter', premium: false },
  { name: 'Angle Converter', category: 'Calculators & Converters', url: '/tools/angle-converter', premium: false },
  { name: 'Currency Converter (Live Rates)', category: 'Calculators & Converters', url: '/tools/currency-converter-live', premium: true },

  // Finance Calculators
  { name: 'Tip Calculator', category: 'Calculators & Converters', url: '/tools/tip-calculator', premium: false },
  { name: 'Loan EMI Calculator', category: 'Calculators & Converters', url: '/tools/loan-emi-calculator', premium: false },
  { name: 'Compound Interest Calculator', category: 'Calculators & Converters', url: '/tools/compound-interest-calculator', premium: false },
  { name: 'VAT/GST Calculator', category: 'Calculators & Converters', url: '/tools/vat-gst-calculator', premium: false },
  { name: 'Currency Converter', category: 'Calculators & Converters', url: '/tools/currency-converter', premium: true },
  { name: 'Salary Converter (Hourly/Annual)', category: 'Calculators & Converters', url: '/tools/salary-converter', premium: false },
  { name: 'Retirement Savings Estimator', category: 'Calculators & Converters', url: '/tools/retirement-savings-estimator', premium: true },
  { name: 'Investment Return Calculator', category: 'Calculators & Converters', url: '/tools/investment-return-calculator', premium: true },
  { name: 'Tax Calculator', category: 'Calculators & Converters', url: '/tools/tax-calculator', premium: true },
  { name: 'Budget Planner', category: 'Calculators & Converters', url: '/tools/budget-planner', premium: true },
  { name: 'ROI Calculator', category: 'Calculators & Converters', url: '/tools/roi-calculator', premium: true },

  // Health & Lifestyle
  { name: 'Age Calculator', category: 'Calculators & Converters', url: '/tools/age-calculator', premium: false },
  { name: 'Date Difference Calculator', category: 'Calculators & Converters', url: '/tools/date-difference-calculator', premium: false },
  { name: 'BMI Calculator', category: 'Calculators & Converters', url: '/tools/bmi-calculator', premium: false },
  { name: 'Calorie Calculator (BMR/TDEE)', category: 'Calculators & Converters', url: '/tools/calorie-calculator', premium: false },
  { name: 'Body Fat Percentage Estimator', category: 'Calculators & Converters', url: '/tools/body-fat-percentage', premium: true },
  { name: 'Pregnancy Due Date Calculator', category: 'Calculators & Converters', url: '/tools/pregnancy-due-date', premium: false },
  { name: 'Recipe Nutrition Calculator', category: 'Calculators & Converters', url: '/tools/recipe-nutrition-calculator', premium: true },
  { name: 'Water Intake Calculator', category: 'Calculators & Converters', url: '/tools/water-intake-calculator', premium: false },
  { name: 'Sleep Calculator', category: 'Calculators & Converters', url: '/tools/sleep-calculator', premium: false },
  { name: 'Ideal Weight Calculator', category: 'Calculators & Converters', url: '/tools/ideal-weight-calculator', premium: false },
  { name: 'Macro Calculator', category: 'Calculators & Converters', url: '/tools/macro-calculator', premium: true },

  // Productivity & Utilities - Time & Productivity
  { name: 'Online Notepad', category: 'Productivity & Utilities', url: '/tools/online-notepad', premium: false },
  { name: 'Pomodoro Timer 🍅', category: 'Productivity & Utilities', url: '/tools/pomodoro-timer', premium: false },
  { name: 'Countdown Timer', category: 'Productivity & Utilities', url: '/tools/countdown-timer', premium: false },
  { name: 'Online Stopwatch', category: 'Productivity & Utilities', url: '/tools/online-stopwatch', premium: false },
  { name: 'Daily Planner Generator', category: 'Productivity & Utilities', url: '/tools/daily-planner-generator', premium: true },
  { name: 'Meeting Cost Calculator', category: 'Productivity & Utilities', url: '/tools/meeting-cost-calculator', premium: true },
  { name: 'World Clock', category: 'Productivity & Utilities', url: '/tools/world-clock', premium: false },
  { name: 'Time Tracker', category: 'Productivity & Utilities', url: '/tools/time-tracker', premium: true },
  { name: 'Habit Tracker', category: 'Productivity & Utilities', url: '/tools/habit-tracker', premium: true },
  { name: 'Goal Setting Template', category: 'Productivity & Utilities', url: '/tools/goal-setting-template', premium: true },
  { name: 'Invoice Generator', category: 'Productivity & Utilities', url: '/tools/invoice-generator', premium: true },

  // Data & File Tools
  { name: 'CSV Viewer', category: 'Productivity & Utilities', url: '/tools/csv-viewer', premium: false },
  { name: 'JSON Viewer', category: 'Productivity & Utilities', url: '/tools/json-viewer', premium: false },
  { name: 'Excel to HTML Table', category: 'Productivity & Utilities', url: '/tools/excel-to-html-table', premium: true },
  { name: 'Diff Checker (Text Compare)', category: 'Productivity & Utilities', url: '/tools/diff-checker-text', premium: false },
  { name: 'Periodic Table Explorer', category: 'Productivity & Utilities', url: '/tools/periodic-table-explorer', premium: false },
  { name: 'PDF Tools Suite (Merge, Split, Compress)', category: 'Productivity & Utilities', url: '/tools/pdf-tools-suite', premium: true },
  { name: 'File Hash Checker', category: 'Productivity & Utilities', url: '/tools/file-hash-checker', premium: false },
  { name: 'Duplicate File Finder', category: 'Productivity & Utilities', url: '/tools/duplicate-file-finder', premium: true },
  { name: 'File Size Calculator', category: 'Productivity & Utilities', url: '/tools/file-size-calculator', premium: false },
  { name: 'Backup Reminder Generator', category: 'Productivity & Utilities', url: '/tools/backup-reminder-generator', premium: true },

  // Communication & Social
  { name: 'Email Template Generator', category: 'Productivity & Utilities', url: '/tools/email-template-generator', premium: true },
  { name: 'Social Media Post Scheduler', category: 'Productivity & Utilities', url: '/tools/social-media-post-scheduler', premium: true },
  { name: 'WhatsApp Link Generator', category: 'Productivity & Utilities', url: '/tools/whatsapp-link-generator', premium: false },
  { name: 'Mailto Link Generator', category: 'Productivity & Utilities', url: '/tools/mailto-link-generator', premium: false },
  { name: 'Contact Form Generator', category: 'Productivity & Utilities', url: '/tools/contact-form-generator', premium: true },
  { name: 'Survey Creator (Basic)', category: 'Productivity & Utilities', url: '/tools/survey-creator-basic', premium: true },

  // Fun & Random Tools
  { name: 'Coin Flipper', category: 'Productivity & Utilities', url: '/tools/coin-flipper', premium: false },
  { name: 'Dice Roller', category: 'Productivity & Utilities', url: '/tools/dice-roller', premium: false },
  { name: 'Random Number Generator', category: 'Productivity & Utilities', url: '/tools/random-number-generator', premium: false },
  { name: 'Random Country Generator', category: 'Productivity & Utilities', url: '/tools/random-country-generator', premium: false },
  { name: 'Band Name Generator', category: 'Productivity & Utilities', url: '/tools/band-name-generator', premium: false },
  { name: 'Riddle Generator', category: 'Productivity & Utilities', url: '/tools/riddle-generator', premium: true },
  { name: 'Tarot Card Reader (Fun)', category: 'Productivity & Utilities', url: '/tools/tarot-card-reader', premium: false },
  { name: 'Decision Maker Wheel', category: 'Productivity & Utilities', url: '/tools/decision-maker-wheel', premium: false },
  { name: 'Random Quote Generator', category: 'Productivity & Utilities', url: '/tools/random-quote-generator', premium: false },
  { name: 'Name Generator (Various Types)', category: 'Productivity & Utilities', url: '/tools/name-generator-various', premium: false },
  { name: 'Color Palette Generator', category: 'Productivity & Utilities', url: '/tools/color-palette-generator', premium: true },
  { name: 'Fake Data Generator', category: 'Productivity & Utilities', url: '/tools/fake-data-generator', premium: true },

  // Archive & Compression Tools
  { name: 'ZIP File Creator', category: 'Archive & Compression', url: '/tools/zip-file-creator', premium: false },
  { name: 'ZIP File Extractor/Viewer', category: 'Archive & Compression', url: '/tools/zip-file-extractor', premium: false },
  { name: 'RAR File Extractor', category: 'Archive & Compression', url: '/tools/rar-file-extractor', premium: false },
  { name: '7Z File Creator', category: 'Archive & Compression', url: '/tools/7z-file-creator', premium: false },
  { name: '7Z File Extractor', category: 'Archive & Compression', url: '/tools/7z-file-extractor', premium: false },
  { name: 'TAR File Creator', category: 'Archive & Compression', url: '/tools/tar-file-creator', premium: false },
  { name: 'TAR.GZ Extractor', category: 'Archive & Compression', url: '/tools/tar-gz-extractor', premium: false },
  { name: 'Archive File Converter (ZIP⇄RAR⇄7Z)', category: 'Archive & Compression', url: '/tools/archive-file-converter', premium: true },
  { name: 'Compressed File Password Remover', category: 'Archive & Compression', url: '/tools/compressed-file-password-remover', premium: true },
  { name: 'Archive File Inspector', category: 'Archive & Compression', url: '/tools/archive-file-inspector', premium: true },
  { name: 'Bulk File Compressor', category: 'Archive & Compression', url: '/tools/bulk-file-compressor', premium: true },
  { name: 'Split Archive Creator', category: 'Archive & Compression', url: '/tools/split-archive-creator', premium: true },
  { name: 'Archive Integrity Checker', category: 'Archive & Compression', url: '/tools/archive-integrity-checker', premium: true },
  { name: 'Password Protected ZIP Creator', category: 'Archive & Compression', url: '/tools/password-protected-zip-creator', premium: true },
  { name: 'Multi-Format Archive Extractor', category: 'Archive & Compression', url: '/tools/multi-format-archive-extractor', premium: true },

  // Security & Privacy Tools
  { name: 'Password Strength Checker', category: 'Security & Privacy', url: '/tools/password-strength-checker', premium: false },
  { name: 'Privacy Policy Generator (Basic)', category: 'Security & Privacy', url: '/tools/privacy-policy-generator', premium: true },
  { name: 'Terms of Service Generator (Basic)', category: 'Security & Privacy', url: '/tools/terms-of-service-generator', premium: true },
  { name: 'Temporary Email Generator', category: 'Security & Privacy', url: '/tools/temporary-email-generator', premium: false },
  { name: 'Email Signature Generator', category: 'Security & Privacy', url: '/tools/email-signature-generator', premium: true },
  { name: 'Two-Factor Auth QR Generator', category: 'Security & Privacy', url: '/tools/two-factor-auth-qr-generator', premium: true },
  { name: 'Secure Note Generator', category: 'Security & Privacy', url: '/tools/secure-note-generator', premium: true },
  { name: 'VPN Speed Test', category: 'Security & Privacy', url: '/tools/vpn-speed-test', premium: true },
  { name: 'Password Leak Checker', category: 'Security & Privacy', url: '/tools/password-leak-checker', premium: true },
  { name: 'Anonymous File Sharing', category: 'Security & Privacy', url: '/tools/anonymous-file-sharing', premium: true },

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
              {filteredTools.slice(0, 50).map((tool, index) => (
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
              {filteredTools.length > 50 && (
                <div className="px-4 py-2 text-sm text-gray-500 text-center border-t">
                  Showing first 50 results. Refine your search for more specific results.
                </div>
              )}
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
