import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, []);

  const tools = [
    // Text Tools
    { name: 'Case Converter', category: 'Text Tools', path: '/tools/text/case-converter' },
    { name: 'Sentence Case Converter', category: 'Text Tools', path: '/tools/text/sentence-case-converter' },
    { name: 'Binary Text Converter', category: 'Text Tools', path: '/tools/text/binary-text-converter' },
    { name: 'Text to Hex Converter', category: 'Text Tools', path: '/tools/text/text-to-hex-converter' },
    { name: 'Hex to Text Converter', category: 'Text Tools', path: '/tools/text/hex-to-text-converter' },
    { name: 'Text to ASCII Converter', category: 'Text Tools', path: '/tools/text/text-to-ascii-converter' },
    { name: 'ASCII to Text Converter', category: 'Text Tools', path: '/tools/text/ascii-to-text-converter' },
    { name: 'Reverse Text Generator', category: 'Text Tools', path: '/tools/text/reverse-text-generator' },
    { name: 'Text to Speech Converter', category: 'Text Tools', path: '/tools/text/text-to-speech-converter' },
    { name: 'Unicode Character Converter', category: 'Text Tools', path: '/tools/text/unicode-character-converter' },
    { name: 'Number to Words Converter', category: 'Text Tools', path: '/tools/text/number-to-words-converter' },
    { name: 'Random Password Generator', category: 'Text Tools', path: '/tools/text/random-password-generator' },
    { name: 'Lorem Ipsum Generator', category: 'Text Tools', path: '/tools/text/lorem-ipsum-generator' },
    { name: 'Slug Generator', category: 'Text Tools', path: '/tools/text/slug-generator' },

    // Web Tools
    { name: 'HTML Encoder', category: 'Web Tools', path: '/tools/web/html-encoder' },
    { name: 'HTML Decoder', category: 'Web Tools', path: '/tools/web/html-decoder' },
    { name: 'URL Encoder', category: 'Web Tools', path: '/tools/web/url-encoder' },
    { name: 'URL Decoder', category: 'Web Tools', path: '/tools/web/url-decoder' },
    { name: 'Base64 Encoder', category: 'Web Tools', path: '/tools/web/base64-encoder' },
    { name: 'Base64 Decoder', category: 'Web Tools', path: '/tools/web/base64-decoder' },
    { name: 'JSON Formatter', category: 'Web Tools', path: '/tools/web/json-formatter' },
    { name: 'CSS Minifier', category: 'Web Tools', path: '/tools/web/css-minifier' },
    { name: 'JavaScript Minifier', category: 'Web Tools', path: '/tools/web/javascript-minifier' },
    { name: 'QR Code Generator', category: 'Web Tools', path: '/tools/web/qr-code-generator' },
    { name: 'UUID Generator', category: 'Web Tools', path: '/tools/web/uuid-generator' },
    { name: ' robots.txt Generator', category: 'Web Tools', path: '/tools/web/robots-txt-generator' },
    { name: 'Favicon Generator', category: 'Web Tools', path: '/tools/web/favicon-generator' },
    { name: 'HTTP Header Analyzer', category: 'Web Tools', path: '/tools/web/http-header-analyzer' },

    // Image Tools
    { name: 'Image Converter', category: 'Image Tools', path: '/tools/image/image-converter' },
    { name: 'Image Resizer', category: 'Image Tools', path: '/tools/image/image-resizer' },
    { name: 'Image Compressor', category: 'Image Tools', path: '/tools/image/image-compressor' },
    { name: 'Image Editor', category: 'Image Tools', path: '/tools/image/image-editor' },
    { name: 'Watermark', category: 'Image Tools', path: '/tools/image/watermark' },
    { name: 'Image Metadata Viewer', category: 'Image Tools', path: '/tools/image/image-metadata-viewer' },
    { name: 'Base64 Image Converter', category: 'Image Tools', path: '/tools/image/base64-image-converter' },
    { name: 'Image Color Palette Generator', category: 'Image Tools', path: '/tools/image/image-color-palette-generator' },
    { name: 'Blur Image', category: 'Image Tools', path: '/tools/image/blur-image' },
    { name: 'Sharpen Image', category: 'Image Tools', path: '/tools/image/sharpen-image' },
    { name: 'Black and White Filter', category: 'Image Tools', path: '/tools/image/black-and-white-filter' },
    { name: 'Sepia Filter', category: 'Image Tools', path: '/tools/image/sepia-filter' },

    // Calculators
    { name: 'Percentage Calculator', category: 'Calculators', path: '/tools/calculators/percentage-calculator' },
    { name: 'VAT Calculator', category: 'Calculators', path: '/tools/calculators/vat-calculator' },
    { name: 'Loan Calculator', category: 'Calculators', path: '/tools/calculators/loan-calculator' },
    { name: 'Mortgage Calculator', category: 'Calculators', path: '/tools/calculators/mortgage-calculator' },
    { name: 'Age Calculator', category: 'Calculators', path: '/tools/calculators/age-calculator' },
    { name: 'Date Calculator', category: 'Calculators', path: '/tools/calculators/date-calculator' },
    { name: 'Scientific Calculator', category: 'Calculators', path: '/tools/calculators/scientific-calculator' },
    { name: 'BMI Calculator', category: 'Calculators', path: '/tools/calculators/bmi-calculator' },
    { name: 'Calorie Calculator', category: 'Calculators', path: '/tools/calculators/calorie-calculator' },
    { name: 'GPA Calculator', category: 'Calculators', path: '/tools/calculators/gpa-calculator' },
    { name: 'Unit Converter', category: 'Calculators', path: '/tools/calculators/unit-converter' },
    { name: 'Currency Converter', category: 'Calculators', path: '/tools/calculators/currency-converter' },

    // Productivity
    { name: 'To-Do List', category: 'Productivity', path: '/tools/productivity/to-do-list' },
    { name: 'Calendar', category: 'Productivity', path: '/tools/productivity/calendar' },
    { name: 'Pomodoro Timer', category: 'Productivity', path: '/tools/productivity/pomodoro-timer' },
    { name: 'Notes', category: 'Productivity', path: '/tools/productivity/notes' },
    { name: 'Habit Tracker', category: 'Productivity', path: '/tools/productivity/habit-tracker' },
    { name: 'Time Zone Converter', category: 'Productivity', path: '/tools/productivity/time-zone-converter' },
    { name: 'Meeting Scheduler', category: 'Productivity', path: '/tools/productivity/meeting-scheduler' },
    { name: 'Word Counter', category: 'Productivity', path: '/tools/productivity/word-counter' },
    { name: 'Character Counter', category: 'Productivity', path: '/tools/productivity/character-counter' },
    { name: 'Online Notepad', category: 'Productivity', path: '/tools/productivity/online-notepad' },
    { name: 'Stopwatch', category: 'Productivity', path: '/tools/productivity/stopwatch' },
    { name: 'Countdown Timer', category: 'Productivity', path: '/tools/productivity/countdown-timer' },

    // Archive Tools
    { name: 'ZIP Extractor', category: 'Archive Tools', path: '/tools/archive/zip-extractor' },
    { name: 'ZIP Compressor', category: 'Archive Tools', path: '/tools/archive/zip-compressor' },
    { name: 'RAR Extractor', category: 'Archive Tools', path: '/tools/archive/rar-extractor' },
    { name: '7Z Extractor', category: 'Archive Tools', path: '/tools/archive/7z-extractor' },
    { name: 'Tar Extractor', category: 'Archive Tools', path: '/tools/archive/tar-extractor' },
    { name: 'GZIP Extractor', category: 'Archive Tools', path: '/tools/archive/gzip-extractor' },
    { name: 'BZIP2 Extractor', category: 'Archive Tools', path: '/tools/archive/bzip2-extractor' },
    { name: 'ISO Extractor', category: 'Archive Tools', path: '/tools/archive/iso-extractor' },
    { name: 'Archive Converter', category: 'Archive Tools', path: '/tools/archive/archive-converter' },
    { name: 'File Splitter', category: 'Archive Tools', path: '/tools/archive/file-splitter' },
    { name: 'File Joiner', category: 'Archive Tools', path: '/tools/archive/file-joiner' },
    { name: 'Data Compression', category: 'Archive Tools', path: '/tools/archive/data-compression' },

    // Security
    { name: 'Password Generator', category: 'Security', path: '/tools/security/password-generator' },
    { name: 'Password Strength Checker', category: 'Security', path: '/tools/security/password-strength-checker' },
    { name: 'Online Hash Generator', category: 'Security', path: '/tools/security/online-hash-generator' },
    { name: 'MD5 Generator', category: 'Security', path: '/tools/security/md5-generator' },
    { name: 'SHA1 Generator', category: 'Security', path: '/tools/security/sha1-generator' },
    { name: 'SHA256 Generator', category: 'Security', path: '/tools/security/sha256-generator' },
    { name: 'SHA512 Generator', category: 'Security', path: '/tools/security/sha512-generator' },
    { name: 'Data Encryption', category: 'Security', path: '/tools/security/data-encryption' },
    { name: 'Data Decryption', category: 'Security', path: '/tools/security/data-decryption' },
    { name: 'IP Address Lookup', category: 'Security', path: '/tools/security/ip-address-lookup' },
    { name: 'Online Ping Tool', category: 'Security', path: '/tools/security/online-ping-tool' },
    { name: 'SSL Checker', category: 'Security', path: '/tools/security/ssl-checker' },

    // Video Tools
    { name: 'Video Converter', category: 'Video Tools', path: '/tools/video/video-converter' },
    { name: 'Video Compressor', category: 'Video Tools', path: '/tools/video/video-compressor' },
    { name: 'Video Editor', category: 'Video Tools', path: '/tools/video/video-editor' },
    { name: 'Merge Video', category: 'Video Tools', path: '/tools/video/merge-video' },
    { name: 'Trim Video', category: 'Video Tools', path: '/tools/video/trim-video' },
    { name: 'Rotate Video', category: 'Video Tools', path: '/tools/video/rotate-video' },
    { name: 'Crop Video', category: 'Video Tools', path: '/tools/video/crop-video' },
    { name: 'Add Watermark to Video', category: 'Video Tools', path: '/tools/video/add-watermark-to-video' },
    { name: 'Video to GIF', category: 'Video Tools', path: '/tools/video/video-to-gif' },
    { name: 'Video to Audio', category: 'Video Tools', path: '/tools/video/video-to-audio' },
    { name: 'Screen Recorder', category: 'Video Tools', path: '/tools/video/screen-recorder' },
    { name: 'Webcam Recorder', category: 'Video Tools', path: '/tools/video/webcam-recorder' },

    // Audio Tools
    { name: 'Audio Converter', category: 'Audio Tools', path: '/tools/audio/audio-converter' },
    { name: 'Audio Compressor', category: 'Audio Tools', path: '/tools/audio/audio-compressor' },
    { name: 'Audio Editor', category: 'Audio Tools', path: '/tools/audio/audio-editor' },
    { name: 'Merge Audio', category: 'Audio Tools', path: '/tools/audio/merge-audio' },
    { name: 'Trim Audio', category: 'Audio Tools', path: '/tools/audio/trim-audio' },
    { name: 'Record Audio', category: 'Audio Tools', path: '/tools/audio/record-audio' },
    { name: 'Text to Speech', category: 'Audio Tools', path: '/tools/audio/text-to-speech' },
    { name: 'Speech to Text', category: 'Audio Tools', path: '/tools/audio/speech-to-text' },
    { name: 'Change Audio Speed', category: 'Audio Tools', path: '/tools/audio/change-audio-speed' },
    { name: 'Change Audio Volume', category: 'Audio Tools', path: '/tools/audio/change-audio-volume' },
    { name: 'Add Echo to Audio', category: 'Audio Tools', path: '/tools/audio/add-echo-to-audio' },
    { name: 'Add Fade In/Out', category: 'Audio Tools', path: '/tools/audio/add-fade-in-out' },

    // PDF Tools
    { name: 'Merge PDF', category: 'PDF Tools', path: '/tools/pdf/merge-pdf' },
    { name: 'Split PDF', category: 'PDF Tools', path: '/tools/pdf/split-pdf' },
    { name: 'Compress PDF', category: 'PDF Tools', path: '/tools/pdf/compress-pdf' },
    { name: 'PDF Converter', category: 'PDF Tools', path: '/tools/pdf/pdf-converter' },
    { name: 'Edit PDF', category: 'PDF Tools', path: '/tools/pdf/edit-pdf' },
    { name: 'Add Watermark to PDF', category: 'PDF Tools', path: '/tools/pdf/add-watermark-to-pdf' },
    { name: 'Remove Password from PDF', category: 'PDF Tools', path: '/tools/pdf/remove-password-from-pdf' },
    { name: 'Add Password to PDF', category: 'PDF Tools', path: '/tools/pdf/add-password-to-pdf' },
    { name: 'Rotate PDF', category: 'PDF Tools', path: '/tools/pdf/rotate-pdf' },
    { name: 'Crop PDF', category: 'PDF Tools', path: '/tools/pdf/crop-pdf' },
    { name: 'Extract Images from PDF', category: 'PDF Tools', path: '/tools/pdf/extract-images-from-pdf' },
    { name: 'Organize PDF Pages', category: 'PDF Tools', path: '/tools/pdf/organize-pdf-pages' },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Search tools... (Ctrl+K)"
            onChange={(e) => setValue(e.target.value)}
            value={value}
            onFocus={() => setOpen(true)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 overflow-hidden">
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Tools">
              {tools
                .filter((tool) =>
                  tool.name.toLowerCase().includes(value.toLowerCase())
                )
                .map((tool) => (
                  <CommandItem
                    key={tool.name}
                    onSelect={() => {
                      navigate(tool.path);
                      setOpen(false);
                      setValue("");
                    }}
                  >
                    {tool.name}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBar;
