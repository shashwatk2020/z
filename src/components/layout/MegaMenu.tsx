
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
        { name: 'HTML Previewer', path: '/tools/web/html-previewer' },
        { name: 'HTML Validator', path: '/tools/web/html-validator' },
        { name: 'CSS Validator', path: '/tools/web/css-validator' },
        { name: 'JavaScript Minifier', path: '/tools/web/javascript-minifier' },
        { name: 'CSS Minifier', path: '/tools/web/css-minifier' },
        { name: 'HTML Minifier', path: '/tools/web/html-minifier' },
        { name: 'JSON Formatter', path: '/tools/web/json-formatter' },
        { name: 'XML Formatter', path: '/tools/web/xml-formatter' },
        { name: 'Base64 Encoder/Decoder', path: '/tools/web/base64-encoder-decoder' },
        { name: 'URL Encoder/Decoder', path: '/tools/web/url-encoder-decoder' },
        { name: 'HTML Entity Encoder', path: '/tools/web/html-entity-encoder' },
        { name: 'Regex Tester', path: '/tools/web/regex-tester' },
        { name: 'SEO Meta Tag Generator', path: '/tools/web/seo-meta-tag-generator' },
        { name: 'Open Graph Generator', path: '/tools/web/open-graph-generator' },
        { name: 'Twitter Card Generator', path: '/tools/web/twitter-card-generator' },
        { name: 'Robots.txt Generator', path: '/tools/web/robots-txt-generator' },
        { name: 'Sitemap Generator', path: '/tools/web/sitemap-generator' },
        { name: 'Schema Markup Generator', path: '/tools/web/schema-markup-generator' },
        { name: 'Keyword Density Analyzer', path: '/tools/web/keyword-density-analyzer' },
        { name: 'Page Speed Analyzer', path: '/tools/web/page-speed-analyzer' },
        { name: 'Broken Link Checker', path: '/tools/web/broken-link-checker' },
        { name: 'SERP Preview Tool', path: '/tools/web/serp-preview-tool' },
        { name: 'Color Palette Generator', path: '/tools/web/color-palette-generator' },
        { name: 'Gradient Generator', path: '/tools/web/gradient-generator' },
        { name: 'Box Shadow Generator', path: '/tools/web/box-shadow-generator' },
        { name: 'Border Radius Generator', path: '/tools/web/border-radius-generator' },
        { name: 'CSS Grid Generator', path: '/tools/web/css-grid-generator' },
        { name: 'Flexbox Generator', path: '/tools/web/flexbox-generator' },
        { name: 'Font Pairing Tool', path: '/tools/web/font-pairing-tool' },
        { name: 'Favicon Generator', path: '/tools/web/favicon-generator' },
        { name: 'CSS Animation Generator', path: '/tools/web/css-animation-generator' },
        { name: 'QR Code Generator', path: '/tools/web/qr-code-generator' },
        { name: 'SSL Certificate Checker', path: '/tools/web/ssl-certificate-checker' },
        { name: 'Website Security Scanner', path: '/tools/web/website-security-scanner' },
        { name: 'HTTP Header Checker', path: '/tools/web/http-header-checker' },
        { name: 'WHOIS Lookup', path: '/tools/web/whois-lookup' },
        { name: 'DNS Lookup Tool', path: '/tools/web/dns-lookup-tool' },
        { name: 'IP Address Lookup', path: '/tools/web/ip-address-lookup' },
        { name: 'Port Scanner', path: '/tools/web/port-scanner' },
        { name: 'Website Uptime Monitor', path: '/tools/web/website-uptime-monitor' },
        { name: 'Ping Test Tool', path: '/tools/web/ping-test-tool' },
      ]
    },
    image: {
      title: 'Image Tools',
      tools: [
        { name: 'JPEG to PNG Converter', path: '/tools/image/jpeg-to-png-converter' },
        { name: 'PNG to JPEG Converter', path: '/tools/image/png-to-jpeg-converter' },
        { name: 'WebP Converter', path: '/tools/image/webp-converter' },
        { name: 'GIF to MP4 Converter', path: '/tools/image/gif-to-mp4-converter' },
        { name: 'SVG to PNG Converter', path: '/tools/image/svg-to-png-converter' },
        { name: 'HEIC to JPEG Converter', path: '/tools/image/heic-to-jpeg-converter' },
        { name: 'RAW Image Converter', path: '/tools/image/raw-image-converter' },
        { name: 'Batch Image Converter', path: '/tools/image/batch-image-converter' },
        { name: 'ICO to PNG Converter', path: '/tools/image/ico-to-png-converter' },
        { name: 'TIFF to PDF Converter', path: '/tools/image/tiff-to-pdf-converter' },
        { name: 'Image Resizer', path: '/tools/image/image-resizer' },
        { name: 'Image Cropper', path: '/tools/image/image-cropper' },
        { name: 'Image Rotator', path: '/tools/image/image-rotator' },
        { name: 'Background Remover', path: '/tools/image/background-remover' },
        { name: 'Image Filters', path: '/tools/image/image-filters' },
        { name: 'Brightness Adjuster', path: '/tools/image/brightness-adjuster' },
        { name: 'Color Adjuster', path: '/tools/image/color-adjuster' },
        { name: 'Image Blur Tool', path: '/tools/image/image-blur-tool' },
        { name: 'Image Sharpener', path: '/tools/image/image-sharpener' },
        { name: 'Watermark Adder', path: '/tools/image/watermark-adder' },
        { name: 'Image Compressor', path: '/tools/image/image-compressor' },
        { name: 'Lossless Compressor', path: '/tools/image/lossless-compressor' },
        { name: 'JPEG Optimizer', path: '/tools/image/jpeg-optimizer' },
        { name: 'PNG Optimizer', path: '/tools/image/png-optimizer' },
        { name: 'Image Metadata Remover', path: '/tools/image/image-metadata-remover' },
        { name: 'Batch Compressor', path: '/tools/image/batch-compressor' },
        { name: 'Progressive JPEG Creator', path: '/tools/image/progressive-jpeg-creator' },
        { name: 'Image Size Analyzer', path: '/tools/image/image-size-analyzer' },
        { name: 'Placeholder Image Generator', path: '/tools/image/placeholder-image-generator' },
        { name: 'QR Code to Image', path: '/tools/image/qr-code-to-image' },
        { name: 'Gradient Image Generator', path: '/tools/image/gradient-image-generator' },
        { name: 'Color Palette Extractor', path: '/tools/image/color-palette-extractor' },
        { name: 'Noise Pattern Generator', path: '/tools/image/noise-pattern-generator' },
        { name: 'Avatar Generator', path: '/tools/image/avatar-generator' },
        { name: 'Favicon Generator', path: '/tools/image/favicon-generator' },
        { name: 'Social Media Image Generator', path: '/tools/image/social-media-image-generator' },
      ]
    },
    calculators: {
      title: 'Calculators',
      tools: [
        { name: 'Basic Calculator', path: '/tools/calculators/basic-calculator' },
        { name: 'Scientific Calculator', path: '/tools/calculators/scientific-calculator' },
        { name: 'Fraction Calculator', path: '/tools/calculators/fraction-calculator' },
        { name: 'Percentage Calculator', path: '/tools/calculators/percentage-calculator' },
        { name: 'Square Root Calculator', path: '/tools/calculators/square-root-calculator' },
        { name: 'Algebra Calculator', path: '/tools/calculators/algebra-calculator' },
        { name: 'Binary Calculator', path: '/tools/calculators/binary-calculator' },
        { name: 'Matrix Calculator', path: '/tools/calculators/matrix-calculator' },
        { name: 'Loan Calculator', path: '/tools/calculators/loan-calculator' },
        { name: 'Mortgage Calculator', path: '/tools/calculators/mortgage-calculator' },
        { name: 'Investment Calculator', path: '/tools/calculators/investment-calculator' },
        { name: 'Retirement Calculator', path: '/tools/calculators/retirement-calculator' },
        { name: 'Tax Calculator', path: '/tools/calculators/tax-calculator' },
        { name: 'Salary Calculator', path: '/tools/calculators/salary-calculator' },
        { name: 'Budget Calculator', path: '/tools/calculators/budget-calculator' },
        { name: 'ROI Calculator', path: '/tools/calculators/roi-calculator' },
        { name: 'Currency Converter', path: '/tools/calculators/currency-converter' },
        { name: 'Tip Calculator', path: '/tools/calculators/tip-calculator' },
        { name: 'Unit Converter', path: '/tools/calculators/unit-converter' },
        { name: 'Temperature Converter', path: '/tools/calculators/temperature-converter' },
        { name: 'Length Converter', path: '/tools/calculators/length-converter' },
        { name: 'Weight Converter', path: '/tools/calculators/weight-converter' },
        { name: 'Volume Converter', path: '/tools/calculators/volume-converter' },
        { name: 'Area Calculator', path: '/tools/calculators/area-calculator' },
        { name: 'Speed Converter', path: '/tools/calculators/speed-converter' },
        { name: 'Time Zone Converter', path: '/tools/calculators/time-zone-converter' },
        { name: 'Date Calculator', path: '/tools/calculators/date-calculator' },
        { name: 'Age Calculator', path: '/tools/calculators/age-calculator' },
        { name: 'BMI Calculator', path: '/tools/calculators/bmi-calculator' },
        { name: 'Calorie Calculator', path: '/tools/calculators/calorie-calculator' },
        { name: 'GPA Calculator', path: '/tools/calculators/gpa-calculator' },
        { name: 'Fuel Cost Calculator', path: '/tools/calculators/fuel-cost-calculator' },
        { name: 'Paint Calculator', path: '/tools/calculators/paint-calculator' },
        { name: 'Pregnancy Calculator', path: '/tools/calculators/pregnancy-calculator' },
      ]
    },
    productivity: {
      title: 'Productivity',
      tools: [
        { name: 'Advanced Todo List', path: '/tools/productivity/advanced-todo-list' },
        { name: 'Kanban Board', path: '/tools/productivity/kanban-board' },
        { name: 'Project Planner', path: '/tools/productivity/project-planner' },
        { name: 'Team Task Manager', path: '/tools/productivity/team-task-manager' },
        { name: 'Goal Tracker', path: '/tools/productivity/goal-tracker' },
        { name: 'Habit Tracker', path: '/tools/productivity/habit-tracker' },
        { name: 'Priority Matrix', path: '/tools/productivity/priority-matrix' },
        { name: 'Milestone Tracker', path: '/tools/productivity/milestone-tracker' },
        { name: 'Time Tracker', path: '/tools/productivity/time-tracker' },
        { name: 'Pomodoro Timer', path: '/tools/productivity/pomodoro-timer' },
        { name: 'Work Schedule Planner', path: '/tools/productivity/work-schedule-planner' },
        { name: 'Meeting Scheduler', path: '/tools/productivity/meeting-scheduler' },
        { name: 'Time Zone Planner', path: '/tools/productivity/time-zone-planner' },
        { name: 'Calendar Sync Tool', path: '/tools/productivity/calendar-sync-tool' },
        { name: 'Deadline Calculator', path: '/tools/productivity/deadline-calculator' },
        { name: 'Time Blocking Tool', path: '/tools/productivity/time-blocking-tool' },
        { name: 'Digital Note System', path: '/tools/productivity/digital-note-system' },
        { name: 'Document Organizer', path: '/tools/productivity/document-organizer' },
        { name: 'Contact Manager', path: '/tools/productivity/contact-manager' },
        { name: 'Bookmark Manager', path: '/tools/productivity/bookmark-manager' },
        { name: 'Password Organizer', path: '/tools/productivity/password-organizer' },
        { name: 'File Naming System', path: '/tools/productivity/file-naming-system' },
        { name: 'Digital Workspace', path: '/tools/productivity/digital-workspace' },
        { name: 'Archive System', path: '/tools/productivity/archive-system' },
        { name: 'Team Collaboration Hub', path: '/tools/productivity/team-collaboration-hub' },
        { name: 'Shared Workspace', path: '/tools/productivity/shared-workspace' },
        { name: 'Meeting Notes Organizer', path: '/tools/productivity/meeting-notes-organizer' },
        { name: 'Team Calendar', path: '/tools/productivity/team-calendar' },
        { name: 'Project Dashboard', path: '/tools/productivity/project-dashboard' },
        { name: 'Resource Sharing Tool', path: '/tools/productivity/resource-sharing-tool' },
        { name: 'Feedback Collection', path: '/tools/productivity/feedback-collection' },
        { name: 'Team Communication', path: '/tools/productivity/team-communication' },
      ]
    },
    archive: {
      title: 'Archive Tools',
      tools: [
        { name: 'ZIP Archive Creator', path: '/tools/archive/zip-creator' },
        { name: 'ZIP File Extractor', path: '/tools/archive/zip-extractor' },
        { name: 'RAR File Extractor', path: '/tools/archive/rar-extractor' },
        { name: '7-Zip Creator', path: '/tools/archive/7z-creator' },
        { name: 'TAR Archive Tool', path: '/tools/archive/tar-tool' },
        { name: 'GZIP Compressor', path: '/tools/archive/gzip-compressor' },
        { name: 'Multi-format Extractor', path: '/tools/archive/multi-extractor' },
        { name: 'Batch Archive Creator', path: '/tools/archive/batch-creator' },
        { name: 'Archive Format Converter', path: '/tools/archive/format-converter' },
        { name: 'ZIP to RAR Converter', path: '/tools/archive/zip-to-rar' },
        { name: 'RAR to ZIP Converter', path: '/tools/archive/rar-to-zip' },
        { name: '7Z to ZIP Converter', path: '/tools/archive/7z-to-zip' },
        { name: 'TAR to ZIP Converter', path: '/tools/archive/tar-to-zip' },
        { name: 'ISO File Extractor', path: '/tools/archive/iso-extractor' },
        { name: 'CAB File Extractor', path: '/tools/archive/cab-extractor' },
        { name: 'DMG File Extractor', path: '/tools/archive/dmg-extractor' },
        { name: 'Archive Inspector', path: '/tools/archive/archive-inspector' },
        { name: 'File Size Analyzer', path: '/tools/archive/size-analyzer' },
        { name: 'Duplicate File Finder', path: '/tools/archive/duplicate-finder' },
        { name: 'Archive Repair Tool', path: '/tools/archive/repair-tool' },
        { name: 'Password Recovery', path: '/tools/archive/password-recovery' },
        { name: 'Archive Splitter', path: '/tools/archive/splitter' },
        { name: 'Archive Merger', path: '/tools/archive/merger' },
        { name: 'Compression Analyzer', path: '/tools/archive/compression-analyzer' },
        { name: 'File Compressor', path: '/tools/archive/file-compressor' },
        { name: 'Archive Converter', path: '/tools/archive/archive-converter' },
        { name: 'Backup Archive Creator', path: '/tools/archive/backup-creator' },
        { name: 'Incremental Backup Tool', path: '/tools/archive/incremental-backup' },
        { name: 'Backup Restoration Tool', path: '/tools/archive/backup-restore' },
        { name: 'Backup Verification', path: '/tools/archive/backup-verify' },
        { name: 'Backup Scheduler', path: '/tools/archive/backup-scheduler' },
        { name: 'Cloud Backup Sync', path: '/tools/archive/cloud-sync' },
        { name: 'Backup Catalog', path: '/tools/archive/backup-catalog' },
        { name: 'Backup Encryption', path: '/tools/archive/backup-encryption' },
      ]
    },
    security: {
      title: 'Security',
      tools: [
        { name: 'Strong Password Generator', path: '/tools/security/strong-password-generator' },
        { name: 'Passphrase Generator', path: 'tools/security/passphrase-generator' },
        { name: 'Password Strength Analyzer', path: '/tools/security/password-strength-analyzer' },
        { name: 'Password Breach Checker', path: '/tools/security/password-breach-checker' },
        { name: 'Bulk Password Generator', path: '/tools/security/bulk-password-generator' },
        { name: 'Password Policy Generator', path: '/tools/security/password-policy-generator' },
        { name: 'PIN Code Generator', path: '/tools/security/pin-code-generator' },
        { name: 'Recovery Key Generator', path: '/tools/security/recovery-key-generator' },
        { name: 'Text Encryption Tool', path: '/tools/security/text-encryption-tool' },
        { name: 'File Encryption Tool', path: '/tools/security/file-encryption-tool' },
        { name: 'Base64 Encoder/Decoder', path: '/tools/security/base64-encoder-decoder' },
        { name: 'Caesar Cipher Tool', path: '/tools/security/caesar-cipher-tool' },
        { name: 'ROT13 Encoder', path: '/tools/security/rot13-encoder' },
        { name: 'Hash Generator', path: '/tools/security/hash-generator' },
        { name: 'HMAC Generator', path: '/tools/security/hmac-generator' },
        { name: 'Digital Signature Tool', path: '/tools/security/digital-signature-tool' },
        { name: 'Privacy Scanner', path: '/tools/security/privacy-scanner' },
        { name: 'Metadata Remover', path: '/tools/security/metadata-remover' },
        { name: 'Anonymous URL Generator', path: '/tools/security/anonymous-url-generator' },
        { name: 'Secure File Shredder', path: '/tools/security/secure-file-shredder' },
        { name: 'IP Address Lookup', path: '/tools/security/ip-address-lookup' },
        { name: 'VPN Connection Tester', path: '/tools/security/vpn-connection-tester' },
        { name: 'Cookie Analyzer', path: '/tools/security/cookie-analyzer' },
        { name: 'Browser Fingerprint Test', path: '/tools/security/browser-fingerprint-test' },
        { name: 'Security Audit Dashboard', path: '/tools/security/security-audit-dashboard' },
        { name: 'Website Security Scanner', path: '/tools/security/website-security-scanner' },
        { name: 'SSL Certificate Checker', path: '/tools/security/ssl-certificate-checker' },
        { name: 'Port Security Scanner', path: '/tools/security/port-security-scanner' },
        { name: 'Email Security Checker', path: '/tools/security/email-security-checker' },
        { name: 'Two-Factor Auth Setup', path: '/tools/security/two-factor-auth-setup' },
        { name: 'Security Checklist', path: '/tools/security/security-checklist' },
        { name: 'Vulnerability Database', path: '/tools/security/vulnerability-database' },
      ]
    },
    video: {
      title: 'Video Tools',
      tools: [
        { name: 'MP4 Video Converter', path: '/tools/video/mp4-video-converter' },
        { name: 'AVI Video Converter', path: '/tools/video/avi-video-converter' },
        { name: 'MOV Video Converter', path: '/tools/video/mov-video-converter' },
        { name: 'WMV Video Converter', path: '/tools/video/wmv-video-converter' },
        { name: 'MKV Video Converter', path: '/tools/video/mkv-video-converter' },
        { name: 'WebM Video Converter', path: '/tools/video/webm-video-converter' },
        { name: 'FLV Video Converter', path: '/tools/video/flv-video-converter' },
        { name: 'Batch Video Converter', path: '/tools/video/batch-video-converter' },
        { name: 'Video Trimmer & Cutter', path: '/tools/video/video-trimmer-cutter' },
        { name: 'Video Merger', path: '/tools/video/video-merger' },
        { name: 'Video Splitter', path: '/tools/video/video-splitter' },
        { name: 'Video Rotator', path: '/tools/video/video-rotator' },
        { name: 'Video Resizer', path: '/tools/video/video-resizer' },
        { name: 'Video Speed Changer', path: '/tools/video/video-speed-changer' },
        { name: 'Video Stabilizer', path: '/tools/video/video-stabilizer' },
        { name: 'Video Color Corrector', path: '/tools/video/video-color-corrector' },
        { name: 'Video Compressor', path: '/tools/video/video-compressor' },
        { name: 'Video Quality Enhancer', path: '/tools/video/video-quality-enhancer' },
        { name: 'Video Optimizer for Web', path: '/tools/video/video-optimizer-for-web' },
        { name: 'Mobile Video Optimizer', path: '/tools/video/mobile-video-optimizer' },
        { name: 'Video Bitrate Calculator', path: '/tools/video/video-bitrate-calculator' },
        { name: 'Video Metadata Editor', path: '/tools/video/video-metadata-editor' },
        { name: 'Video Thumbnail Generator', path: '/tools/video/video-thumbnail-generator' },
        { name: 'Video Frame Extractor', path: '/tools/video/video-frame-extractor' },
        { name: 'Audio Extractor', path: '/tools/video/audio-extractor' },
        { name: 'Video to GIF Converter', path: '/tools/video/video-to-gif-converter' },
        { name: 'Subtitle Extractor', path: '/tools/video/subtitle-extractor' },
        { name: 'Video Info Analyzer', path: '/tools/video/video-info-analyzer' },
        { name: 'Video Repair Tool', path: '/tools/video/video-repair-tool' },
        { name: 'Screen Recorder', path: '/tools/video/screen-recorder' },
        { name: 'Webcam Recorder', path: '/tools/video/webcam-recorder' },
        { name: 'Video Downloader', path: '/tools/video/video-downloader' },
      ]
    },
    audio: {
      title: 'Audio Tools',
      tools: [
        { name: 'MP3 Audio Converter', path: '/tools/audio/mp3-audio-converter' },
        { name: 'WAV Audio Converter', path: '/tools/audio/wav-audio-converter' },
        { name: 'AAC Audio Converter', path: '/tools/audio/aac-audio-converter' },
        { name: 'FLAC Audio Converter', path: '/tools/audio/flac-audio-converter' },
        { name: 'OGG Audio Converter', path: '/tools/audio/ogg-audio-converter' },
        { name: 'M4A Audio Converter', path: '/tools/audio/m4a-audio-converter' },
        { name: 'WMA Audio Converter', path: '/tools/audio/wma-audio-converter' },
        { name: 'Batch Audio Converter', path: '/tools/audio/batch-audio-converter' },
        { name: 'Audio Trimmer & Cutter', path: '/tools/audio/audio-trimmer-cutter' },
        { name: 'Audio Merger', path: '/tools/audio/audio-merger' },
        { name: 'Audio Splitter', path: '/tools/audio/audio-splitter' },
        { name: 'Volume Adjuster', path: '/tools/audio/volume-adjuster' },
        { name: 'Audio Speed Changer', path: '/tools/audio/audio-speed-changer' },
        { name: 'Pitch Shifter', path: '/tools/audio/pitch-shifter' },
        { name: 'Audio Reverb Tool', path: '/tools/audio/audio-reverb-tool' },
        { name: 'Noise Reducer', path: '/tools/audio/noise-reducer' },
        { name: 'Voice Recorder', path: '/tools/audio/voice-recorder' },
        { name: 'Screen Audio Recorder', path: '/tools/audio/screen-audio-recorder' },
        { name: 'Podcast Recorder', path: '/tools/audio/podcast-recorder' },
        { name: 'Interview Recorder', path: '/tools/audio/interview-recorder' },
        { name: 'Music Recorder', path: '/tools/audio/music-recorder' },
        { name: 'Dictation Recorder', path: '/tools/audio/dictation-recorder' },
        { name: 'Meeting Recorder', path: '/tools/audio/meeting-recorder' },
        { name: 'Radio Recorder', path: '/tools/audio/radio-recorder' },
        { name: 'Audio Spectrum Analyzer', path: '/tools/audio/audio-spectrum-analyzer' },
        { name: 'Audio Waveform Viewer', path: '/tools/audio/audio-waveform-viewer' },
        { name: 'Audio Quality Analyzer', path: '/tools/audio/audio-quality-analyzer' },
        { name: 'Audio Metadata Editor', path: '/tools/audio/audio-metadata-editor' },
        { name: 'Audio Bitrate Calculator', path: '/tools/audio/audio-bitrate-calculator' },
        { name: 'Silence Detector', path: '/tools/audio/silence-detector' },
        { name: 'Audio File Info', path: '/tools/audio/audio-file-info' },
        { name: 'Peak Level Meter', path: '/tools/audio/peak-level-meter' },
      ]
    },
    pdf: {
      title: 'PDF Tools',
      tools: [
        { name: 'PDF to Word Converter', path: '/tools/pdf/pdf-to-word-converter' },
        { name: 'PDF to Excel Converter', path: '/tools/pdf/pdf-to-excel-converter' },
        { name: 'PDF to PowerPoint Converter', path: '/tools/pdf/pdf-to-powerpoint-converter' },
        { name: 'PDF to Images Converter', path: '/tools/pdf/pdf-to-images-converter' },
        { name: 'Word to PDF Converter', path: '/tools/pdf/word-to-pdf-converter' },
        { name: 'Excel to PDF Converter', path: '/tools/pdf/excel-to-pdf-converter' },
        { name: 'PowerPoint to PDF Converter', path: '/tools/pdf/powerpoint-to-pdf-converter' },
        { name: 'Images to PDF Converter', path: '/tools/pdf/images-to-pdf-converter' },
        { name: 'PDF Text Editor', path: '/tools/pdf/pdf-text-editor' },
        { name: 'PDF Page Editor', path: '/tools/pdf/pdf-page-editor' },
        { name: 'PDF Annotation Tool', path: '/tools/pdf/pdf-annotation-tool' },
        { name: 'PDF Form Filler', path: '/tools/pdf/pdf-form-filler' },
        { name: 'PDF Watermark Tool', path: '/tools/pdf/pdf-watermark-tool' },
        { name: 'PDF Header Footer Tool', path: '/tools/pdf/pdf-header-footer-tool' },
        { name: 'PDF Page Numbering', path: '/tools/pdf/pdf-page-numbering' },
        { name: 'PDF Background Tool', path: '/tools/pdf/pdf-background-tool' },
        { name: 'PDF Merger Tool', path: '/tools/pdf/pdf-merger-tool' },
        { name: 'PDF Splitter Tool', path: '/tools/pdf/pdf-splitter-tool' },
        { name: 'PDF Page Extractor', path: '/tools/pdf/pdf-page-extractor' },
        { name: 'PDF Organizer', path: '/tools/pdf/pdf-organizer' },
        { name: 'PDF Bookmark Manager', path: '/tools/pdf/pdf-bookmark-manager' },
        { name: 'PDF Batch Processor', path: '/tools/pdf/pdf-batch-processor' },
        { name: 'PDF Size Reducer', path: '/tools/pdf/pdf-size-reducer' },
        { name: 'PDF Repair Tool', path: '/tools/pdf/pdf-repair-tool' },
        { name: 'PDF Password Protector', path: '/tools/pdf/pdf-password-protector' },
        { name: 'PDF Unlocker', path: '/tools/pdf/pdf-unlocker' },
        { name: 'PDF Encryption Tool', path: '/tools/pdf/pdf-encryption-tool' },
        { name: 'PDF Permission Manager', path: '/tools/pdf/pdf-permission-manager' },
        { name: 'PDF Digital Signature', path: '/tools/pdf/pdf-digital-signature' },
        { name: 'PDF Redaction Tool', path: '/tools/pdf/pdf-redaction-tool' },
        { name: 'PDF Metadata Remover', path: '/tools/pdf/pdf-metadata-remover' },
        { name: 'PDF Security Analyzer', path: '/tools/pdf/pdf-security-analyzer' },
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
