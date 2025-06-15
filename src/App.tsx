import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';

// Layout and main pages
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import Help from './pages/Help';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Blog from './pages/Blog';
import Pricing from './pages/Pricing';
import FeatureRequest from './pages/FeatureRequest';
import ToolRequest from './pages/ToolRequest';
import Login from './pages/Login';
import Register from './pages/Register';

// Category pages
import TextTools from './pages/tools/TextTools';
import ImageTools from './pages/tools/ImageTools';
import WebTools from './pages/tools/WebTools';
import PDFTools from './pages/tools/PDFTools';
import VideoTools from './pages/tools/VideoTools';
import AudioTools from './pages/tools/AudioTools';
import Calculators from './pages/tools/Calculators';
import Security from './pages/tools/Security';
import Productivity from './pages/tools/Productivity';
import ArchiveTools from './pages/tools/ArchiveTools';

// Image Tools - Basic Converters
import JpegToPngConverter from './pages/tools/image/JpegToPngConverter';
import PngToJpegConverter from './pages/tools/image/PngToJpegConverter';
import WebpConverter from './pages/tools/image/WebpConverter';
import GifToMp4Converter from './pages/tools/image/GifToMp4Converter';
import SvgToPngConverter from './pages/tools/image/SvgToPngConverter';
import HeicToJpegConverter from './pages/tools/image/HeicToJpegConverter';
import RawImageConverter from './pages/tools/image/RawImageConverter';
import BatchImageConverter from './pages/tools/image/BatchImageConverter';
import IcoToPngConverter from './pages/tools/image/IcoToPngConverter';

// Image Tools - Processing
import TiffToPdfConverter from './pages/tools/image/TiffToPdfConverter';
import ImageResizer from './pages/tools/image/ImageResizer';
import ImageCropper from './pages/tools/image/ImageCropper';
import ImageRotator from './pages/tools/image/ImageRotator';
import BackgroundRemover from './pages/tools/image/BackgroundRemover';
import ImageFilters from './pages/tools/image/ImageFilters';
import BrightnessAdjuster from './pages/tools/image/BrightnessAdjuster';
import ColorAdjuster from './pages/tools/image/ColorAdjuster';
import ImageBlurTool from './pages/tools/image/ImageBlurTool';

// Image Tools - Advanced
import ImageSharpener from './pages/tools/image/ImageSharpener';
import WatermarkAdder from './pages/tools/image/WatermarkAdder';
import ImageCompressor from './pages/tools/image/ImageCompressor';
import LosslessCompressor from './pages/tools/image/LosslessCompressor';
import JpegOptimizer from './pages/tools/image/JpegOptimizer';
import PngOptimizer from './pages/tools/image/PngOptimizer';
import ImageMetadataRemover from './pages/tools/image/ImageMetadataRemover';
import BatchCompressor from './pages/tools/image/BatchCompressor';
import ProgressiveJpegCreator from './pages/tools/image/ProgressiveJpegCreator';

// Image Tools - Generators & Analyzers
import ImageSizeAnalyzer from './pages/tools/image/ImageSizeAnalyzer';
import PlaceholderImageGenerator from './pages/tools/image/PlaceholderImageGenerator';
import QrCodeToImage from './pages/tools/image/QrCodeToImage';
import GradientImageGenerator from './pages/tools/image/GradientImageGenerator';
import ColorPaletteExtractor from './pages/tools/image/ColorPaletteExtractor';
import NoisePatternGenerator from './pages/tools/image/NoisePatternGenerator';
import AvatarGenerator from './pages/tools/image/AvatarGenerator';
import FaviconGenerator from './pages/tools/image/FaviconGenerator';
import SocialMediaImageGenerator from './pages/tools/image/SocialMediaImageGenerator';

// Web Tools
import Base64EncoderDecoder from './pages/tools/web/Base64EncoderDecoder';
import BorderRadiusGenerator from './pages/tools/web/BorderRadiusGenerator';
import BoxShadowGenerator from './pages/tools/web/BoxShadowGenerator';
import BrokenLinkChecker from './pages/tools/web/BrokenLinkChecker';
import ColorPaletteGenerator from './pages/tools/web/ColorPaletteGenerator';
import CssAnimationGenerator from './pages/tools/web/CssAnimationGenerator';
import CssGridGenerator from './pages/tools/web/CssGridGenerator';
import CssMinifier from './pages/tools/web/CssMinifier';
import CssValidator from './pages/tools/web/CssValidator';
import DnsLookupTool from './pages/tools/web/DnsLookupTool';
import FlexboxGenerator from './pages/tools/web/FlexboxGenerator';
import FontPairingTool from './pages/tools/web/FontPairingTool';
import GradientGenerator from './pages/tools/web/GradientGenerator';
import HtmlEntityEncoder from './pages/tools/web/HtmlEntityEncoder';
import HtmlMinifier from './pages/tools/web/HtmlMinifier';
import HtmlPreviewer from './pages/tools/web/HtmlPreviewer';
import HtmlValidator from './pages/tools/web/HtmlValidator';
import HttpHeaderChecker from './pages/tools/web/HttpHeaderChecker';
import IpAddressLookup from './pages/tools/web/IpAddressLookup';
import JavaScriptMinifier from './pages/tools/web/JavaScriptMinifier';
import JsonFormatter from './pages/tools/web/JsonFormatter';
import KeywordDensityAnalyzer from './pages/tools/web/KeywordDensityAnalyzer';
import OpenGraphGenerator from './pages/tools/web/OpenGraphGenerator';
import PageSpeedAnalyzer from './pages/tools/web/PageSpeedAnalyzer';
import PingTestTool from './pages/tools/web/PingTestTool';
import PortScanner from './pages/tools/web/PortScanner';
import QrCodeGenerator from './pages/tools/web/QrCodeGenerator';
import RegexTester from './pages/tools/web/RegexTester';
import RobotsTxtGenerator from './pages/tools/web/RobotsTxtGenerator';
import SchemaMarkupGenerator from './pages/tools/web/SchemaMarkupGenerator';
import SeoMetaTagGenerator from './pages/tools/web/SeoMetaTagGenerator';
import SerpPreviewTool from './pages/tools/web/SerpPreviewTool';
import SitemapGenerator from './pages/tools/web/SitemapGenerator';
import SslCertificateChecker from './pages/tools/web/SslCertificateChecker';
import TwitterCardGenerator from './pages/tools/web/TwitterCardGenerator';
import UrlEncoderDecoder from './pages/tools/web/UrlEncoderDecoder';
import WebsiteSecurityScanner from './pages/tools/web/WebsiteSecurityScanner';
import WebsiteUptimeMonitor from './pages/tools/web/WebsiteUptimeMonitor';
import WhoisLookup from './pages/tools/web/WhoisLookup';
import XmlFormatter from './pages/tools/web/XmlFormatter';

// Text Tools
import ArticleTitleGenerator from './pages/tools/text/ArticleTitleGenerator';
import AsciiArtGenerator from './pages/tools/text/AsciiArtGenerator';
import AsciiToTextConverter from './pages/tools/text/AsciiToTextConverter';
import BigTextGenerator from './pages/tools/text/BigTextGenerator';
import BinaryTextConverter from './pages/tools/text/BinaryTextConverter';
import BlogTitleGenerator from './pages/tools/text/BlogTitleGenerator';
import BoldTextGenerator from './pages/tools/text/BoldTextGenerator';
import BusinessNameGenerator from './pages/tools/text/BusinessNameGenerator';
import CaseConverter from './pages/tools/text/CaseConverter';
import CharacterCounter from './pages/tools/text/CharacterCounter';
import DuplicateLineRemover from './pages/tools/text/DuplicateLineRemover';
import EmojiTextGenerator from './pages/tools/text/EmojiTextGenerator';
import FancyTextGenerator from './pages/tools/text/FancyTextGenerator';
import FindAndReplaceText from './pages/tools/text/FindAndReplaceText';
import HashtagGenerator from './pages/tools/text/HashtagGenerator';
import HexToTextConverter from './pages/tools/text/HexToTextConverter';
import ItalicTextGenerator from './pages/tools/text/ItalicTextGenerator';
import KeywordDensityChecker from './pages/tools/text/KeywordDensityChecker';
import LanguageDetector from './pages/tools/text/LanguageDetector';
import LoremIpsumGenerator from './pages/tools/text/LoremIpsumGenerator';
import MetaDescriptionGenerator from './pages/tools/text/MetaDescriptionGenerator';
import MorseCodeTranslator from './pages/tools/text/MorseCodeTranslator';
import NumberToWordsConverter from './pages/tools/text/NumberToWordsConverter';
import PlagiarismChecker from './pages/tools/text/PlagiarismChecker';
import RandomLetterGenerator from './pages/tools/text/RandomLetterGenerator';
import RandomPasswordGenerator from './pages/tools/text/RandomPasswordGenerator';
import RandomWordGenerator from './pages/tools/text/RandomWordGenerator';
import ReadingTimeCalculator from './pages/tools/text/ReadingTimeCalculator';
import ReverseTextGenerator from './pages/tools/text/ReverseTextGenerator';
import SentenceCaseConverter from './pages/tools/text/SentenceCaseConverter';
import SlugGenerator from './pages/tools/text/SlugGenerator';
import StrongPasswordGenerator from './pages/tools/text/StrongPasswordGenerator';
import TextArtGenerator from './pages/tools/text/TextArtGenerator';
import TextCompare from './pages/tools/text/TextCompare';
import TextRepeater from './pages/tools/text/TextRepeater';
import TextSummarizer from './pages/tools/text/TextSummarizer';
import TextToAsciiConverter from './pages/tools/text/TextToAsciiConverter';
import TextToHexConverter from './pages/tools/text/TextToHexConverter';
import TextToSpeechConverter from './pages/tools/text/TextToSpeechConverter';
import UnicodeCharacterConverter from './pages/tools/text/UnicodeCharacterConverter';
import UpsideDownTextGenerator from './pages/tools/text/UpsideDownTextGenerator';
import UsernameGenerator from './pages/tools/text/UsernameGenerator';
import WhitespaceRemover from './pages/tools/text/WhitespaceRemover';
import WordCounter from './pages/tools/text/WordCounter';
import YodaTranslator from './pages/tools/text/YodaTranslator';
import ZalgoGlitchText from './pages/tools/text/ZalgoGlitchText';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/feature-request" element={<FeatureRequest />} />
              <Route path="/tool-request" element={<ToolRequest />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Category Pages */}
              <Route path="/tools/text" element={<TextTools />} />
              <Route path="/tools/image" element={<ImageTools />} />
              <Route path="/tools/web" element={<WebTools />} />
              <Route path="/tools/pdf" element={<PDFTools />} />
              <Route path="/tools/video" element={<VideoTools />} />
              <Route path="/tools/audio" element={<AudioTools />} />
              <Route path="/tools/calculators" element={<Calculators />} />
              <Route path="/tools/security" element={<Security />} />
              <Route path="/tools/productivity" element={<Productivity />} />
              <Route path="/tools/archive" element={<ArchiveTools />} />

              {/* Image Tools */}
              <Route path="/tools/image/jpeg-to-png-converter" element={<JpegToPngConverter />} />
              <Route path="/tools/image/png-to-jpeg-converter" element={<PngToJpegConverter />} />
              <Route path="/tools/image/webp-converter" element={<WebpConverter />} />
              <Route path="/tools/image/gif-to-mp4-converter" element={<GifToMp4Converter />} />
              <Route path="/tools/image/svg-to-png-converter" element={<SvgToPngConverter />} />
              <Route path="/tools/image/heic-to-jpeg-converter" element={<HeicToJpegConverter />} />
              <Route path="/tools/image/raw-image-converter" element={<RawImageConverter />} />
              <Route path="/tools/image/batch-image-converter" element={<BatchImageConverter />} />
              <Route path="/tools/image/ico-to-png-converter" element={<IcoToPngConverter />} />
              <Route path="/tools/image/tiff-to-pdf-converter" element={<TiffToPdfConverter />} />
              <Route path="/tools/image/image-resizer" element={<ImageResizer />} />
              <Route path="/tools/image/image-cropper" element={<ImageCropper />} />
              <Route path="/tools/image/image-rotator" element={<ImageRotator />} />
              <Route path="/tools/image/background-remover" element={<BackgroundRemover />} />
              <Route path="/tools/image/image-filters" element={<ImageFilters />} />
              <Route path="/tools/image/brightness-adjuster" element={<BrightnessAdjuster />} />
              <Route path="/tools/image/color-adjuster" element={<ColorAdjuster />} />
              <Route path="/tools/image/image-blur-tool" element={<ImageBlurTool />} />
              <Route path="/tools/image/image-sharpener" element={<ImageSharpener />} />
              <Route path="/tools/image/watermark-adder" element={<WatermarkAdder />} />
              <Route path="/tools/image/image-compressor" element={<ImageCompressor />} />
              <Route path="/tools/image/lossless-compressor" element={<LosslessCompressor />} />
              <Route path="/tools/image/jpeg-optimizer" element={<JpegOptimizer />} />
              <Route path="/tools/image/png-optimizer" element={<PngOptimizer />} />
              <Route path="/tools/image/image-metadata-remover" element={<ImageMetadataRemover />} />
              <Route path="/tools/image/batch-compressor" element={<BatchCompressor />} />
              <Route path="/tools/image/progressive-jpeg-creator" element={<ProgressiveJpegCreator />} />
              <Route path="/tools/image/image-size-analyzer" element={<ImageSizeAnalyzer />} />
              <Route path="/tools/image/placeholder-image-generator" element={<PlaceholderImageGenerator />} />
              <Route path="/tools/image/qr-code-to-image" element={<QrCodeToImage />} />
              <Route path="/tools/image/gradient-image-generator" element={<GradientImageGenerator />} />
              <Route path="/tools/image/color-palette-extractor" element={<ColorPaletteExtractor />} />
              <Route path="/tools/image/noise-pattern-generator" element={<NoisePatternGenerator />} />
              <Route path="/tools/image/avatar-generator" element={<AvatarGenerator />} />
              <Route path="/tools/image/favicon-generator" element={<FaviconGenerator />} />
              <Route path="/tools/image/social-media-image-generator" element={<SocialMediaImageGenerator />} />

              {/* Web Tools */}
              <Route path="/tools/web/base64-encoder-decoder" element={<Base64EncoderDecoder />} />
              <Route path="/tools/web/border-radius-generator" element={<BorderRadiusGenerator />} />
              <Route path="/tools/web/box-shadow-generator" element={<BoxShadowGenerator />} />
              <Route path="/tools/web/broken-link-checker" element={<BrokenLinkChecker />} />
              <Route path="/tools/web/color-palette-generator" element={<ColorPaletteGenerator />} />
              <Route path="/tools/web/css-animation-generator" element={<CssAnimationGenerator />} />
              <Route path="/tools/web/css-grid-generator" element={<CssGridGenerator />} />
              <Route path="/tools/web/css-minifier" element={<CssMinifier />} />
              <Route path="/tools/web/css-validator" element={<CssValidator />} />
              <Route path="/tools/web/dns-lookup-tool" element={<DnsLookupTool />} />
              <Route path="/tools/web/favicon-generator" element={<FaviconGenerator />} />
              <Route path="/tools/web/flexbox-generator" element={<FlexboxGenerator />} />
              <Route path="/tools/web/font-pairing-tool" element={<FontPairingTool />} />
              <Route path="/tools/web/gradient-generator" element={<GradientGenerator />} />
              <Route path="/tools/web/html-entity-encoder" element={<HtmlEntityEncoder />} />
              <Route path="/tools/web/html-minifier" element={<HtmlMinifier />} />
              <Route path="/tools/web/html-previewer" element={<HtmlPreviewer />} />
              <Route path="/tools/web/html-validator" element={<HtmlValidator />} />
              <Route path="/tools/web/http-header-checker" element={<HttpHeaderChecker />} />
              <Route path="/tools/web/ip-address-lookup" element={<IpAddressLookup />} />
              <Route path="/tools/web/javascript-minifier" element={<JavaScriptMinifier />} />
              <Route path="/tools/web/json-formatter" element={<JsonFormatter />} />
              <Route path="/tools/web/keyword-density-analyzer" element={<KeywordDensityAnalyzer />} />
              <Route path="/tools/web/open-graph-generator" element={<OpenGraphGenerator />} />
              <Route path="/tools/web/page-speed-analyzer" element={<PageSpeedAnalyzer />} />
              <Route path="/tools/web/ping-test-tool" element={<PingTestTool />} />
              <Route path="/tools/web/port-scanner" element={<PortScanner />} />
              <Route path="/tools/web/qr-code-generator" element={<QrCodeGenerator />} />
              <Route path="/tools/web/regex-tester" element={<RegexTester />} />
              <Route path="/tools/web/robots-txt-generator" element={<RobotsTxtGenerator />} />
              <Route path="/tools/web/schema-markup-generator" element={<SchemaMarkupGenerator />} />
              <Route path="/tools/web/seo-meta-tag-generator" element={<SeoMetaTagGenerator />} />
              <Route path="/tools/web/serp-preview-tool" element={<SerpPreviewTool />} />
              <Route path="/tools/web/sitemap-generator" element={<SitemapGenerator />} />
              <Route path="/tools/web/ssl-certificate-checker" element={<SslCertificateChecker />} />
              <Route path="/tools/web/twitter-card-generator" element={<TwitterCardGenerator />} />
              <Route path="/tools/web/url-encoder-decoder" element={<UrlEncoderDecoder />} />
              <Route path="/tools/web/website-security-scanner" element={<WebsiteSecurityScanner />} />
              <Route path="/tools/web/website-uptime-monitor" element={<WebsiteUptimeMonitor />} />
              <Route path="/tools/web/whois-lookup" element={<WhoisLookup />} />
              <Route path="/tools/web/xml-formatter" element={<XmlFormatter />} />

              {/* Text Tools */}
              <Route path="/tools/text/article-title-generator" element={<ArticleTitleGenerator />} />
              <Route path="/tools/text/ascii-art-generator" element={<AsciiArtGenerator />} />
              <Route path="/tools/text/ascii-to-text-converter" element={<AsciiToTextConverter />} />
              <Route path="/tools/text/big-text-generator" element={<BigTextGenerator />} />
              <Route path="/tools/text/binary-text-converter" element={<BinaryTextConverter />} />
              <Route path="/tools/text/blog-title-generator" element={<BlogTitleGenerator />} />
              <Route path="/tools/text/bold-text-generator" element={<BoldTextGenerator />} />
              <Route path="/tools/text/business-name-generator" element={<BusinessNameGenerator />} />
              <Route path="/tools/text/case-converter" element={<CaseConverter />} />
              <Route path="/tools/text/character-counter" element={<CharacterCounter />} />
              <Route path="/tools/text/duplicate-line-remover" element={<DuplicateLineRemover />} />
              <Route path="/tools/text/emoji-text-generator" element={<EmojiTextGenerator />} />
              <Route path="/tools/text/fancy-text-generator" element={<FancyTextGenerator />} />
              <Route path="/tools/text/find-and-replace-text" element={<FindAndReplaceText />} />
              <Route path="/tools/text/hashtag-generator" element={<HashtagGenerator />} />
              <Route path="/tools/text/hex-to-text-converter" element={<HexToTextConverter />} />
              <Route path="/tools/text/italic-text-generator" element={<ItalicTextGenerator />} />
              <Route path="/tools/text/keyword-density-checker" element={<KeywordDensityChecker />} />
              <Route path="/tools/text/language-detector" element={<LanguageDetector />} />
              <Route path="/tools/text/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
              <Route path="/tools/text/meta-description-generator" element={<MetaDescriptionGenerator />} />
              <Route path="/tools/text/morse-code-translator" element={<MorseCodeTranslator />} />
              <Route path="/tools/text/number-to-words-converter" element={<NumberToWordsConverter />} />
              <Route path="/tools/text/plagiarism-checker" element={<PlagiarismChecker />} />
              <Route path="/tools/text/random-letter-generator" element={<RandomLetterGenerator />} />
              <Route path="/tools/text/random-password-generator" element={<RandomPasswordGenerator />} />
              <Route path="/tools/text/random-word-generator" element={<RandomWordGenerator />} />
              <Route path="/tools/text/reading-time-calculator" element={<ReadingTimeCalculator />} />
              <Route path="/tools/text/reverse-text-generator" element={<ReverseTextGenerator />} />
              <Route path="/tools/text/sentence-case-converter" element={<SentenceCaseConverter />} />
              <Route path="/tools/text/slug-generator" element={<SlugGenerator />} />
              <Route path="/tools/text/strong-password-generator" element={<StrongPasswordGenerator />} />
              <Route path="/tools/text/text-art-generator" element={<TextArtGenerator />} />
              <Route path="/tools/text/text-compare" element={<TextCompare />} />
              <Route path="/tools/text/text-repeater" element={<TextRepeater />} />
              <Route path="/tools/text/text-summarizer" element={<TextSummarizer />} />
              <Route path="/tools/text/text-to-ascii-converter" element={<TextToAsciiConverter />} />
              <Route path="/tools/text/text-to-hex-converter" element={<TextToHexConverter />} />
              <Route path="/tools/text/text-to-speech-converter" element={<TextToSpeechConverter />} />
              <Route path="/tools/text/unicode-character-converter" element={<UnicodeCharacterConverter />} />
              <Route path="/tools/text/upside-down-text-generator" element={<UpsideDownTextGenerator />} />
              <Route path="/tools/text/username-generator" element={<UsernameGenerator />} />
              <Route path="/tools/text/whitespace-remover" element={<WhitespaceRemover />} />
              <Route path="/tools/text/word-counter" element={<WordCounter />} />
              <Route path="/tools/text/yoda-translator" element={<YodaTranslator />} />
              <Route path="/tools/text/zalgo-glitch-text" element={<ZalgoGlitchText />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
