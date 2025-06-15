import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Main pages
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import Help from "./pages/Help";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FeatureRequest from "./pages/FeatureRequest";
import ToolRequest from "./pages/ToolRequest";
import NotFound from "./pages/NotFound";

// Auth pages
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Tool category pages
import TextTools from "./pages/tools/TextTools";
import ImageTools from "./pages/tools/ImageTools";
import PDFTools from "./pages/tools/PDFTools";
import VideoTools from "./pages/tools/VideoTools";
import AudioTools from "./pages/tools/AudioTools";
import WebTools from "./pages/tools/WebTools";
import Security from "./pages/tools/Security";
import Productivity from "./pages/tools/Productivity";
import ArchiveTools from "./pages/tools/ArchiveTools";
import Calculators from "./pages/tools/Calculators";

// Calculator tools
import BasicCalculator from "./pages/tools/calculators/BasicCalculator";
import ScientificCalculator from "./pages/tools/calculators/ScientificCalculator";
import BinaryCalculator from "./pages/tools/calculators/BinaryCalculator";
import FractionCalculator from "./pages/tools/calculators/FractionCalculator";
import PercentageCalculator from "./pages/tools/calculators/PercentageCalculator";
import SquareRootCalculator from "./pages/tools/calculators/SquareRootCalculator";
import AlgebraCalculator from "./pages/tools/calculators/AlgebraCalculator";
import MatrixCalculator from "./pages/tools/calculators/MatrixCalculator";
import LoanCalculator from "./pages/tools/calculators/LoanCalculator";
import MortgageCalculator from "./pages/tools/calculators/MortgageCalculator";
import InvestmentCalculator from "./pages/tools/calculators/InvestmentCalculator";
import RetirementCalculator from "./pages/tools/calculators/RetirementCalculator";
import TaxCalculator from "./pages/tools/calculators/TaxCalculator";
import SalaryCalculator from "./pages/tools/calculators/SalaryCalculator";
import BudgetCalculator from "./pages/tools/calculators/BudgetCalculator";
import ROICalculator from "./pages/tools/calculators/ROICalculator";
import CurrencyConverter from "./pages/tools/calculators/CurrencyConverter";
import TipCalculator from "./pages/tools/calculators/TipCalculator";
import UnitConverter from "./pages/tools/calculators/UnitConverter";
import TemperatureConverter from "./pages/tools/calculators/TemperatureConverter";
import LengthConverter from "./pages/tools/calculators/LengthConverter";
import WeightConverter from "./pages/tools/calculators/WeightConverter";
import VolumeConverter from "./pages/tools/calculators/VolumeConverter";
import AreaCalculator from "./pages/tools/calculators/AreaCalculator";
import SpeedConverter from "./pages/tools/calculators/SpeedConverter";
import TimeZoneConverter from "./pages/tools/calculators/TimeZoneConverter";
import DateCalculator from "./pages/tools/calculators/DateCalculator";

// Text tools
import CharacterCounter from "./pages/tools/text/CharacterCounter";
import WordCounter from "./pages/tools/text/WordCounter";
import CaseConverter from "./pages/tools/text/CaseConverter";
import SentenceCaseConverter from "./pages/tools/text/SentenceCaseConverter";
import RandomPasswordGenerator from "./pages/tools/text/RandomPasswordGenerator";
import StrongPasswordGenerator from "./pages/tools/text/StrongPasswordGenerator";
import UsernameGenerator from "./pages/tools/text/UsernameGenerator";
import LoremIpsumGenerator from "./pages/tools/text/LoremIpsumGenerator";
import TextRepeater from "./pages/tools/text/TextRepeater";
import ReverseTextGenerator from "./pages/tools/text/ReverseTextGenerator";
import UpsideDownTextGenerator from "./pages/tools/text/UpsideDownTextGenerator";
import BoldTextGenerator from "./pages/tools/text/BoldTextGenerator";
import ItalicTextGenerator from "./pages/tools/text/ItalicTextGenerator";
import FancyTextGenerator from "./pages/tools/text/FancyTextGenerator";
import EmojiTextGenerator from "./pages/tools/text/EmojiTextGenerator";
import BigTextGenerator from "./pages/tools/text/BigTextGenerator";
import TextArtGenerator from "./pages/tools/text/TextArtGenerator";
import AsciiArtGenerator from "./pages/tools/text/AsciiArtGenerator";
import ZalgoGlitchText from "./pages/tools/text/ZalgoGlitchText";
import WhitespaceRemover from "./pages/tools/text/WhitespaceRemover";
import DuplicateLineRemover from "./pages/tools/text/DuplicateLineRemover";
import FindAndReplaceText from "./pages/tools/text/FindAndReplaceText";
import TextCompare from "./pages/tools/text/TextCompare";
import TextSummarizer from "./pages/tools/text/TextSummarizer";
import ReadingTimeCalculator from "./pages/tools/text/ReadingTimeCalculator";
import KeywordDensityChecker from "./pages/tools/text/KeywordDensityChecker";
import PlagiarismChecker from "./pages/tools/text/PlagiarismChecker";
import LanguageDetector from "./pages/tools/text/LanguageDetector";
import TextToSpeechConverter from "./pages/tools/text/TextToSpeechConverter";
import BinaryTextConverter from "./pages/tools/text/BinaryTextConverter";
import HexToTextConverter from "./pages/tools/text/HexToTextConverter";
import TextToHexConverter from "./pages/tools/text/TextToHexConverter";
import AsciiToTextConverter from "./pages/tools/text/AsciiToTextConverter";
import TextToAsciiConverter from "./pages/tools/text/TextToAsciiConverter";
import UnicodeCharacterConverter from "./pages/tools/text/UnicodeCharacterConverter";
import MorseCodeTranslator from "./pages/tools/text/MorseCodeTranslator";
import NumberToWordsConverter from "./pages/tools/text/NumberToWordsConverter";
import YodaTranslator from "./pages/tools/text/YodaTranslator";
import SlugGenerator from "./pages/tools/text/SlugGenerator";
import HashtagGenerator from "./pages/tools/text/HashtagGenerator";
import MetaDescriptionGenerator from "./pages/tools/text/MetaDescriptionGenerator";
import ArticleTitleGenerator from "./pages/tools/text/ArticleTitleGenerator";
import BlogTitleGenerator from "./pages/tools/text/BlogTitleGenerator";
import BusinessNameGenerator from "./pages/tools/text/BusinessNameGenerator";
import RandomWordGenerator from "./pages/tools/text/RandomWordGenerator";
import RandomLetterGenerator from "./pages/tools/text/RandomLetterGenerator";

// Image tools
import ImageCompressor from "./pages/tools/image/ImageCompressor";
import ImageResizer from "./pages/tools/image/ImageResizer";
import ImageCropper from "./pages/tools/image/ImageCropper";
import ImageRotator from "./pages/tools/image/ImageRotator";
import ImageFilters from "./pages/tools/image/ImageFilters";
import BackgroundRemover from "./pages/tools/image/BackgroundRemover";
import WatermarkAdder from "./pages/tools/image/WatermarkAdder";
import ColorAdjuster from "./pages/tools/image/ColorAdjuster";
import BrightnessAdjuster from "./pages/tools/image/BrightnessAdjuster";
import ImageSharpener from "./pages/tools/image/ImageSharpener";
import ImageBlurTool from "./pages/tools/image/ImageBlurTool";
import ImageSizeAnalyzer from "./pages/tools/image/ImageSizeAnalyzer";
import ImageMetadataRemover from "./pages/tools/image/ImageMetadataRemover";
import JpegToPngConverter from "./pages/tools/image/JpegToPngConverter";
import PngToJpegConverter from "./pages/tools/image/PngToJpegConverter";
import WebpConverter from "./pages/tools/image/WebpConverter";
import IcoToPngConverter from "./pages/tools/image/IcoToPngConverter";
import SvgToPngConverter from "./pages/tools/image/SvgToPngConverter";
import HeicToJpegConverter from "./pages/tools/image/HeicToJpegConverter";
import RawImageConverter from "./pages/tools/image/RawImageConverter";
import TiffToPdfConverter from "./pages/tools/image/TiffToPdfConverter";
import GifToMp4Converter from "./pages/tools/image/GifToMp4Converter";
import BatchImageConverter from "./pages/tools/image/BatchImageConverter";
import BatchCompressor from "./pages/tools/image/BatchCompressor";
import LosslessCompressor from "./pages/tools/image/LosslessCompressor";
import JpegOptimizer from "./pages/tools/image/JpegOptimizer";
import PngOptimizer from "./pages/tools/image/PngOptimizer";
import ProgressiveJpegCreator from "./pages/tools/image/ProgressiveJpegCreator";
import ColorPaletteExtractor from "./pages/tools/image/ColorPaletteExtractor";
import PlaceholderImageGenerator from "./pages/tools/image/PlaceholderImageGenerator";
import GradientImageGenerator from "./pages/tools/image/GradientImageGenerator";
import NoisePatternGenerator from "./pages/tools/image/NoisePatternGenerator";
import SocialMediaImageGenerator from "./pages/tools/image/SocialMediaImageGenerator";
import AvatarGenerator from "./pages/tools/image/AvatarGenerator";
import FaviconGenerator from "./pages/tools/image/FaviconGenerator";
import QrCodeToImage from "./pages/tools/image/QrCodeToImage";

// Web tools
import Base64EncoderDecoder from "./pages/tools/web/Base64EncoderDecoder";
import UrlEncoderDecoder from "./pages/tools/web/UrlEncoderDecoder";
import HtmlEntityEncoder from "./pages/tools/web/HtmlEntityEncoder";
import JsonFormatter from "./pages/tools/web/JsonFormatter";
import XmlFormatter from "./pages/tools/web/XmlFormatter";
import CssMinifier from "./pages/tools/web/CssMinifier";
import JavaScriptMinifier from "./pages/tools/web/JavaScriptMinifier";
import HtmlMinifier from "./pages/tools/web/HtmlMinifier";
import HtmlValidator from "./pages/tools/web/HtmlValidator";
import CssValidator from "./pages/tools/web/CssValidator";
import HtmlPreviewer from "./pages/tools/web/HtmlPreviewer";
import RegexTester from "./pages/tools/web/RegexTester";
import ColorPaletteGenerator from "./pages/tools/web/ColorPaletteGenerator";
import GradientGenerator from "./pages/tools/web/GradientGenerator";
import BoxShadowGenerator from "./pages/tools/web/BoxShadowGenerator";
import BorderRadiusGenerator from "./pages/tools/web/BorderRadiusGenerator";
import FlexboxGenerator from "./pages/tools/web/FlexboxGenerator";
import CssGridGenerator from "./pages/tools/web/CssGridGenerator";
import CssAnimationGenerator from "./pages/tools/web/CssAnimationGenerator";
import FontPairingTool from "./pages/tools/web/FontPairingTool";
import QrCodeGenerator from "./pages/tools/web/QrCodeGenerator";
import SeoMetaTagGenerator from "./pages/tools/web/SeoMetaTagGenerator";
import OpenGraphGenerator from "./pages/tools/web/OpenGraphGenerator";
import TwitterCardGenerator from "./pages/tools/web/TwitterCardGenerator";
import SchemaMarkupGenerator from "./pages/tools/web/SchemaMarkupGenerator";
import SitemapGenerator from "./pages/tools/web/SitemapGenerator";
import RobotsTxtGenerator from "./pages/tools/web/RobotsTxtGenerator";
import SerpPreviewTool from "./pages/tools/web/SerpPreviewTool";
import KeywordDensityAnalyzer from "./pages/tools/web/KeywordDensityAnalyzer";
import PageSpeedAnalyzer from "./pages/tools/web/PageSpeedAnalyzer";
import BrokenLinkChecker from "./pages/tools/web/BrokenLinkChecker";
import WebsiteUptimeMonitor from "./pages/tools/web/WebsiteUptimeMonitor";
import WebsiteSecurityScanner from "./pages/tools/web/WebsiteSecurityScanner";
import SslCertificateChecker from "./pages/tools/web/SslCertificateChecker";
import WhoisLookup from "./pages/tools/web/WhoisLookup";
import DnsLookupTool from "./pages/tools/web/DnsLookupTool";
import IpAddressLookup from "./pages/tools/web/IpAddressLookup";
import PingTestTool from "./pages/tools/web/PingTestTool";
import PortScanner from "./pages/tools/web/PortScanner";
import HttpHeaderChecker from "./pages/tools/web/HttpHeaderChecker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main pages */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/feature-request" element={<FeatureRequest />} />
            <Route path="/tool-request" element={<ToolRequest />} />

            {/* Auth pages */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Tool category pages */}
            <Route path="/tools/text" element={<TextTools />} />
            <Route path="/tools/image" element={<ImageTools />} />
            <Route path="/tools/pdf" element={<PDFTools />} />
            <Route path="/tools/video" element={<VideoTools />} />
            <Route path="/tools/audio" element={<AudioTools />} />
            <Route path="/tools/web" element={<WebTools />} />
            <Route path="/tools/security" element={<Security />} />
            <Route path="/tools/productivity" element={<Productivity />} />
            <Route path="/tools/archive" element={<ArchiveTools />} />
            <Route path="/tools/calculators" element={<Calculators />} />

            {/* Calculator tools */}
            <Route path="/tools/calculators/basic-calculator" element={<BasicCalculator />} />
            <Route path="/tools/calculators/scientific-calculator" element={<ScientificCalculator />} />
            <Route path="/tools/calculators/binary-calculator" element={<BinaryCalculator />} />
            <Route path="/tools/calculators/fraction-calculator" element={<FractionCalculator />} />
            <Route path="/tools/calculators/percentage-calculator" element={<PercentageCalculator />} />
            <Route path="/tools/calculators/square-root-calculator" element={<SquareRootCalculator />} />
            <Route path="/tools/calculators/algebra-calculator" element={<AlgebraCalculator />} />
            <Route path="/tools/calculators/matrix-calculator" element={<MatrixCalculator />} />
            <Route path="/tools/calculators/loan-calculator" element={<LoanCalculator />} />
            <Route path="/tools/calculators/mortgage-calculator" element={<MortgageCalculator />} />
            <Route path="/tools/calculators/investment-calculator" element={<InvestmentCalculator />} />
            <Route path="/tools/calculators/retirement-calculator" element={<RetirementCalculator />} />
            <Route path="/tools/calculators/tax-calculator" element={<TaxCalculator />} />
            <Route path="/tools/calculators/salary-calculator" element={<SalaryCalculator />} />
            <Route path="/tools/calculators/budget-calculator" element={<BudgetCalculator />} />
            <Route path="/tools/calculators/roi-calculator" element={<ROICalculator />} />
            <Route path="/tools/calculators/currency-converter" element={<CurrencyConverter />} />
            <Route path="/tools/calculators/tip-calculator" element={<TipCalculator />} />
            <Route path="/tools/calculators/unit-converter" element={<UnitConverter />} />
            <Route path="/tools/calculators/temperature-converter" element={<TemperatureConverter />} />
            <Route path="/tools/calculators/length-converter" element={<LengthConverter />} />
            <Route path="/tools/calculators/weight-converter" element={<WeightConverter />} />
            <Route path="/tools/calculators/volume-converter" element={<VolumeConverter />} />
            <Route path="/tools/calculators/area-calculator" element={<AreaCalculator />} />
            <Route path="/tools/calculators/speed-converter" element={<SpeedConverter />} />
            <Route path="/tools/calculators/time-zone-converter" element={<TimeZoneConverter />} />
            <Route path="/tools/calculators/date-calculator" element={<DateCalculator />} />

            {/* Text tools */}
            <Route path="/tools/text/character-counter" element={<CharacterCounter />} />
            <Route path="/tools/text/word-counter" element={<WordCounter />} />
            <Route path="/tools/text/case-converter" element={<CaseConverter />} />
            <Route path="/tools/text/sentence-case-converter" element={<SentenceCaseConverter />} />
            <Route path="/tools/text/random-password-generator" element={<RandomPasswordGenerator />} />
            <Route path="/tools/text/strong-password-generator" element={<StrongPasswordGenerator />} />
            <Route path="/tools/text/username-generator" element={<UsernameGenerator />} />
            <Route path="/tools/text/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
            <Route path="/tools/text/text-repeater" element={<TextRepeater />} />
            <Route path="/tools/text/reverse-text-generator" element={<ReverseTextGenerator />} />
            <Route path="/tools/text/upside-down-text-generator" element={<UpsideDownTextGenerator />} />
            <Route path="/tools/text/bold-text-generator" element={<BoldTextGenerator />} />
            <Route path="/tools/text/italic-text-generator" element={<ItalicTextGenerator />} />
            <Route path="/tools/text/fancy-text-generator" element={<FancyTextGenerator />} />
            <Route path="/tools/text/emoji-text-generator" element={<EmojiTextGenerator />} />
            <Route path="/tools/text/big-text-generator" element={<BigTextGenerator />} />
            <Route path="/tools/text/text-art-generator" element={<TextArtGenerator />} />
            <Route path="/tools/text/ascii-art-generator" element={<AsciiArtGenerator />} />
            <Route path="/tools/text/zalgo-glitch-text" element={<ZalgoGlitchText />} />
            <Route path="/tools/text/whitespace-remover" element={<WhitespaceRemover />} />
            <Route path="/tools/text/duplicate-line-remover" element={<DuplicateLineRemover />} />
            <Route path="/tools/text/find-and-replace-text" element={<FindAndReplaceText />} />
            <Route path="/tools/text/text-compare" element={<TextCompare />} />
            <Route path="/tools/text/text-summarizer" element={<TextSummarizer />} />
            <Route path="/tools/text/reading-time-calculator" element={<ReadingTimeCalculator />} />
            <Route path="/tools/text/keyword-density-checker" element={<KeywordDensityChecker />} />
            <Route path="/tools/text/plagiarism-checker" element={<PlagiarismChecker />} />
            <Route path="/tools/text/language-detector" element={<LanguageDetector />} />
            <Route path="/tools/text/text-to-speech-converter" element={<TextToSpeechConverter />} />
            <Route path="/tools/text/binary-text-converter" element={<BinaryTextConverter />} />
            <Route path="/tools/text/hex-to-text-converter" element={<HexToTextConverter />} />
            <Route path="/tools/text/text-to-hex-converter" element={<TextToHexConverter />} />
            <Route path="/tools/text/ascii-to-text-converter" element={<AsciiToTextConverter />} />
            <Route path="/tools/text/text-to-ascii-converter" element={<TextToAsciiConverter />} />
            <Route path="/tools/text/unicode-character-converter" element={<UnicodeCharacterConverter />} />
            <Route path="/tools/text/morse-code-translator" element={<MorseCodeTranslator />} />
            <Route path="/tools/text/number-to-words-converter" element={<NumberToWordsConverter />} />
            <Route path="/tools/text/yoda-translator" element={<YodaTranslator />} />
            <Route path="/tools/text/slug-generator" element={<SlugGenerator />} />
            <Route path="/tools/text/hashtag-generator" element={<HashtagGenerator />} />
            <Route path="/tools/text/meta-description-generator" element={<MetaDescriptionGenerator />} />
            <Route path="/tools/text/article-title-generator" element={<ArticleTitleGenerator />} />
            <Route path="/tools/text/blog-title-generator" element={<BlogTitleGenerator />} />
            <Route path="/tools/text/business-name-generator" element={<BusinessNameGenerator />} />
            <Route path="/tools/text/random-word-generator" element={<RandomWordGenerator />} />
            <Route path="/tools/text/random-letter-generator" element={<RandomLetterGenerator />} />

            {/* Image tools */}
            <Route path="/tools/image/image-compressor" element={<ImageCompressor />} />
            <Route path="/tools/image/image-resizer" element={<ImageResizer />} />
            <Route path="/tools/image/image-cropper" element={<ImageCropper />} />
            <Route path="/tools/image/image-rotator" element={<ImageRotator />} />
            <Route path="/tools/image/image-filters" element={<ImageFilters />} />
            <Route path="/tools/image/background-remover" element={<BackgroundRemover />} />
            <Route path="/tools/image/watermark-adder" element={<WatermarkAdder />} />
            <Route path="/tools/image/color-adjuster" element={<ColorAdjuster />} />
            <Route path="/tools/image/brightness-adjuster" element={<BrightnessAdjuster />} />
            <Route path="/tools/image/image-sharpener" element={<ImageSharpener />} />
            <Route path="/tools/image/image-blur-tool" element={<ImageBlurTool />} />
            <Route path="/tools/image/image-size-analyzer" element={<ImageSizeAnalyzer />} />
            <Route path="/tools/image/image-metadata-remover" element={<ImageMetadataRemover />} />
            <Route path="/tools/image/jpeg-to-png-converter" element={<JpegToPngConverter />} />
            <Route path="/tools/image/png-to-jpeg-converter" element={<PngToJpegConverter />} />
            <Route path="/tools/image/webp-converter" element={<WebpConverter />} />
            <Route path="/tools/image/ico-to-png-converter" element={<IcoToPngConverter />} />
            <Route path="/tools/image/svg-to-png-converter" element={<SvgToPngConverter />} />
            <Route path="/tools/image/heic-to-jpeg-converter" element={<HeicToJpegConverter />} />
            <Route path="/tools/image/raw-image-converter" element={<RawImageConverter />} />
            <Route path="/tools/image/tiff-to-pdf-converter" element={<TiffToPdfConverter />} />
            <Route path="/tools/image/gif-to-mp4-converter" element={<GifToMp4Converter />} />
            <Route path="/tools/image/batch-image-converter" element={<BatchImageConverter />} />
            <Route path="/tools/image/batch-compressor" element={<BatchCompressor />} />
            <Route path="/tools/image/lossless-compressor" element={<LosslessCompressor />} />
            <Route path="/tools/image/jpeg-optimizer" element={<JpegOptimizer />} />
            <Route path="/tools/image/png-optimizer" element={<PngOptimizer />} />
            <Route path="/tools/image/progressive-jpeg-creator" element={<ProgressiveJpegCreator />} />
            <Route path="/tools/image/color-palette-extractor" element={<ColorPaletteExtractor />} />
            <Route path="/tools/image/placeholder-image-generator" element={<PlaceholderImageGenerator />} />
            <Route path="/tools/image/gradient-image-generator" element={<GradientImageGenerator />} />
            <Route path="/tools/image/noise-pattern-generator" element={<NoisePatternGenerator />} />
            <Route path="/tools/image/social-media-image-generator" element={<SocialMediaImageGenerator />} />
            <Route path="/tools/image/avatar-generator" element={<AvatarGenerator />} />
            <Route path="/tools/image/favicon-generator" element={<FaviconGenerator />} />
            <Route path="/tools/image/qr-code-to-image" element={<QrCodeToImage />} />

            {/* Web tools */}
            <Route path="/tools/web/base64-encoder-decoder" element={<Base64EncoderDecoder />} />
            <Route path="/tools/web/url-encoder-decoder" element={<UrlEncoderDecoder />} />
            <Route path="/tools/web/html-entity-encoder" element={<HtmlEntityEncoder />} />
            <Route path="/tools/web/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/web/xml-formatter" element={<XmlFormatter />} />
            <Route path="/tools/web/css-minifier" element={<CssMinifier />} />
            <Route path="/tools/web/javascript-minifier" element={<JavaScriptMinifier />} />
            <Route path="/tools/web/html-minifier" element={<HtmlMinifier />} />
            <Route path="/tools/web/html-validator" element={<HtmlValidator />} />
            <Route path="/tools/web/css-validator" element={<CssValidator />} />
            <Route path="/tools/web/html-previewer" element={<HtmlPreviewer />} />
            <Route path="/tools/web/regex-tester" element={<RegexTester />} />
            <Route path="/tools/web/color-palette-generator" element={<ColorPaletteGenerator />} />
            <Route path="/tools/web/gradient-generator" element={<GradientGenerator />} />
            <Route path="/tools/web/box-shadow-generator" element={<BoxShadowGenerator />} />
            <Route path="/tools/web/border-radius-generator" element={<BorderRadiusGenerator />} />
            <Route path="/tools/web/flexbox-generator" element={<FlexboxGenerator />} />
            <Route path="/tools/web/css-grid-generator" element={<CssGridGenerator />} />
            <Route path="/tools/web/css-animation-generator" element={<CssAnimationGenerator />} />
            <Route path="/tools/web/font-pairing-tool" element={<FontPairingTool />} />
            <Route path="/tools/web/qr-code-generator" element={<QrCodeGenerator />} />
            <Route path="/tools/web/seo-meta-tag-generator" element={<SeoMetaTagGenerator />} />
            <Route path="/tools/web/open-graph-generator" element={<OpenGraphGenerator />} />
            <Route path="/tools/web/twitter-card-generator" element={<TwitterCardGenerator />} />
            <Route path="/tools/web/schema-markup-generator" element={<SchemaMarkupGenerator />} />
            <Route path="/tools/web/sitemap-generator" element={<SitemapGenerator />} />
            <Route path="/tools/web/robots-txt-generator" element={<RobotsTxtGenerator />} />
            <Route path="/tools/web/serp-preview-tool" element={<SerpPreviewTool />} />
            <Route path="/tools/web/keyword-density-analyzer" element={<KeywordDensityAnalyzer />} />
            <Route path="/tools/web/page-speed-analyzer" element={<PageSpeedAnalyzer />} />
            <Route path="/tools/web/broken-link-checker" element={<BrokenLinkChecker />} />
            <Route path="/tools/web/website-uptime-monitor" element={<WebsiteUptimeMonitor />} />
            <Route path="/tools/web/website-security-scanner" element={<WebsiteSecurityScanner />} />
            <Route path="/tools/web/ssl-certificate-checker" element={<SslCertificateChecker />} />
            <Route path="/tools/web/whois-lookup" element={<WhoisLookup />} />
            <Route path="/tools/web/dns-lookup-tool" element={<DnsLookupTool />} />
            <Route path="/tools/web/ip-address-lookup" element={<IpAddressLookup />} />
            <Route path="/tools/web/ping-test-tool" element={<PingTestTool />} />
            <Route path="/tools/web/port-scanner" element={<PortScanner />} />
            <Route path="/tools/web/http-header-checker" element={<HttpHeaderChecker />} />

            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
