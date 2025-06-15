
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import ToolRequest from "./pages/ToolRequest";
import FeatureRequest from "./pages/FeatureRequest";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import TextTools from "./pages/tools/TextTools";
import WebTools from "./pages/tools/WebTools";
import ImageTools from "./pages/tools/ImageTools";
import Calculators from "./pages/tools/Calculators";
import Productivity from "./pages/tools/Productivity";
import ArchiveTools from "./pages/tools/ArchiveTools";
import Security from "./pages/tools/Security";
import VideoTools from "./pages/tools/VideoTools";
import AudioTools from "./pages/tools/AudioTools";
import PDFTools from "./pages/tools/PDFTools";
// Text Tools
import CaseConverter from "./pages/tools/text/CaseConverter";
import SentenceCaseConverter from "./pages/tools/text/SentenceCaseConverter";
import BinaryTextConverter from "./pages/tools/text/BinaryTextConverter";
import TextToHexConverter from "./pages/tools/text/TextToHexConverter";
import HexToTextConverter from "./pages/tools/text/HexToTextConverter";
import TextToAsciiConverter from "./pages/tools/text/TextToAsciiConverter";
import AsciiToTextConverter from "./pages/tools/text/AsciiToTextConverter";
import ReverseTextGenerator from "./pages/tools/text/ReverseTextGenerator";
import TextToSpeechConverter from "./pages/tools/text/TextToSpeechConverter";
import UnicodeCharacterConverter from "./pages/tools/text/UnicodeCharacterConverter";
import NumberToWordsConverter from "./pages/tools/text/NumberToWordsConverter";
import RandomPasswordGenerator from "./pages/tools/text/RandomPasswordGenerator";
import LoremIpsumGenerator from "./pages/tools/text/LoremIpsumGenerator";
import SlugGenerator from "./pages/tools/text/SlugGenerator";
import RandomWordGenerator from "./pages/tools/text/RandomWordGenerator";
import RandomLetterGenerator from "./pages/tools/text/RandomLetterGenerator";
import TextRepeater from "./pages/tools/text/TextRepeater";
import HashtagGenerator from "./pages/tools/text/HashtagGenerator";
import BlogTitleGenerator from "./pages/tools/text/BlogTitleGenerator";
import StrongPasswordGenerator from "./pages/tools/text/StrongPasswordGenerator";
import WhitespaceRemover from "./pages/tools/text/WhitespaceRemover";
import ArticleTitleGenerator from "./pages/tools/text/ArticleTitleGenerator";
import AsciiArtGenerator from "./pages/tools/text/AsciiArtGenerator";
import BigTextGenerator from "./pages/tools/text/BigTextGenerator";
import BoldTextGenerator from "./pages/tools/text/BoldTextGenerator";
import BusinessNameGenerator from "./pages/tools/text/BusinessNameGenerator";
import CharacterCounter from "./pages/tools/text/CharacterCounter";
import DuplicateLineRemover from "./pages/tools/text/DuplicateLineRemover";
import EmojiTextGenerator from "./pages/tools/text/EmojiTextGenerator";
import FancyTextGenerator from "./pages/tools/text/FancyTextGenerator";
import FindAndReplaceText from "./pages/tools/text/FindAndReplaceText";
import ItalicTextGenerator from "./pages/tools/text/ItalicTextGenerator";
import KeywordDensityChecker from "./pages/tools/text/KeywordDensityChecker";
import LanguageDetector from "./pages/tools/text/LanguageDetector";
import MetaDescriptionGenerator from "./pages/tools/text/MetaDescriptionGenerator";
import MorseCodeTranslator from "./pages/tools/text/MorseCodeTranslator";
import WordCounter from "./pages/tools/text/WordCounter";
import PlagiarismChecker from "./pages/tools/text/PlagiarismChecker";
import ReadingTimeCalculator from "./pages/tools/text/ReadingTimeCalculator";
import TextCompare from "./pages/tools/text/TextCompare";
import TextArtGenerator from "./pages/tools/text/TextArtGenerator";
import TextSummarizer from "./pages/tools/text/TextSummarizer";
import UpsideDownTextGenerator from "./pages/tools/text/UpsideDownTextGenerator";
import UsernameGenerator from "./pages/tools/text/UsernameGenerator";
import YodaTranslator from "./pages/tools/text/YodaTranslator";
import ZalgoGlitchText from "./pages/tools/text/ZalgoGlitchText";
// Web Tools
import HtmlPreviewer from "./pages/tools/web/HtmlPreviewer";
import HtmlValidator from "./pages/tools/web/HtmlValidator";
import CssValidator from "./pages/tools/web/CssValidator";
import JavaScriptMinifier from "./pages/tools/web/JavaScriptMinifier";
import CssMinifier from "./pages/tools/web/CssMinifier";
import HtmlMinifier from "./pages/tools/web/HtmlMinifier";
import JsonFormatter from "./pages/tools/web/JsonFormatter";
import XmlFormatter from "./pages/tools/web/XmlFormatter";
import Base64EncoderDecoder from "./pages/tools/web/Base64EncoderDecoder";
import UrlEncoderDecoder from "./pages/tools/web/UrlEncoderDecoder";
import HtmlEntityEncoder from "./pages/tools/web/HtmlEntityEncoder";
import RegexTester from "./pages/tools/web/RegexTester";
import SeoMetaTagGenerator from "./pages/tools/web/SeoMetaTagGenerator";
import OpenGraphGenerator from "./pages/tools/web/OpenGraphGenerator";
import TwitterCardGenerator from "./pages/tools/web/TwitterCardGenerator";
import RobotsTxtGenerator from "./pages/tools/web/RobotsTxtGenerator";
import SitemapGenerator from "./pages/tools/web/SitemapGenerator";
import SchemaMarkupGenerator from "./pages/tools/web/SchemaMarkupGenerator";
import KeywordDensityAnalyzer from "./pages/tools/web/KeywordDensityAnalyzer";
import SerpPreviewTool from "./pages/tools/web/SerpPreviewTool";
import BrokenLinkChecker from "./pages/tools/web/BrokenLinkChecker";
import PageSpeedAnalyzer from "./pages/tools/web/PageSpeedAnalyzer";
import ColorPaletteGenerator from "./pages/tools/web/ColorPaletteGenerator";
import GradientGenerator from "./pages/tools/web/GradientGenerator";
import BoxShadowGenerator from "./pages/tools/web/BoxShadowGenerator";
import BorderRadiusGenerator from "./pages/tools/web/BorderRadiusGenerator";
import CssGridGenerator from "./pages/tools/web/CssGridGenerator";
import FlexboxGenerator from "./pages/tools/web/FlexboxGenerator";
import FontPairingTool from "./pages/tools/web/FontPairingTool";
import FaviconGenerator from "./pages/tools/web/FaviconGenerator";
import CssAnimationGenerator from "./pages/tools/web/CssAnimationGenerator";
import QrCodeGenerator from "./pages/tools/web/QrCodeGenerator";
import SslCertificateChecker from "./pages/tools/web/SslCertificateChecker";
import WebsiteSecurityScanner from "./pages/tools/web/WebsiteSecurityScanner";
import HttpHeaderChecker from "./pages/tools/web/HttpHeaderChecker";
import WhoisLookup from "./pages/tools/web/WhoisLookup";
import DnsLookupTool from "./pages/tools/web/DnsLookupTool";
import IpAddressLookup from "./pages/tools/web/IpAddressLookup";
import PortScanner from "./pages/tools/web/PortScanner";
import WebsiteUptimeMonitor from "./pages/tools/web/WebsiteUptimeMonitor";
import PingTestTool from "./pages/tools/web/PingTestTool";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/tool-request" element={
              <ProtectedRoute>
                <ToolRequest />
              </ProtectedRoute>
            } />
            <Route path="/feature-request" element={
              <ProtectedRoute>
                <FeatureRequest />
              </ProtectedRoute>
            } />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            {/* Tool Category Pages */}
            <Route path="/tools/text" element={<TextTools />} />
            <Route path="/tools/web" element={<WebTools />} />
            <Route path="/tools/image" element={<ImageTools />} />
            <Route path="/tools/calculators" element={<Calculators />} />
            <Route path="/tools/productivity" element={<Productivity />} />
            <Route path="/tools/archive" element={<ArchiveTools />} />
            <Route path="/tools/security" element={<Security />} />
            <Route path="/tools/video" element={<VideoTools />} />
            <Route path="/tools/audio" element={<AudioTools />} />
            <Route path="/tools/pdf" element={<PDFTools />} />
            {/* Text Tools */}
            <Route path="/tools/text/case-converter" element={<CaseConverter />} />
            <Route path="/tools/text/sentence-case-converter" element={<SentenceCaseConverter />} />
            <Route path="/tools/text/binary-text-converter" element={<BinaryTextConverter />} />
            <Route path="/tools/text/text-to-hex-converter" element={<TextToHexConverter />} />
            <Route path="/tools/text/hex-to-text-converter" element={<HexToTextConverter />} />
            <Route path="/tools/text/text-to-ascii-converter" element={<TextToAsciiConverter />} />
            <Route path="/tools/text/ascii-to-text-converter" element={<AsciiToTextConverter />} />
            <Route path="/tools/text/reverse-text-generator" element={<ReverseTextGenerator />} />
            <Route path="/tools/text/text-to-speech-converter" element={<TextToSpeechConverter />} />
            <Route path="/tools/text/unicode-character-converter" element={<UnicodeCharacterConverter />} />
            <Route path="/tools/text/number-to-words-converter" element={<NumberToWordsConverter />} />
            <Route path="/tools/text/random-password-generator" element={<RandomPasswordGenerator />} />
            <Route path="/tools/text/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
            <Route path="/tools/text/slug-generator" element={<SlugGenerator />} />
            <Route path="/tools/text/random-word-generator" element={<RandomWordGenerator />} />
            <Route path="/tools/text/random-letter-generator" element={<RandomLetterGenerator />} />
            <Route path="/tools/text/text-repeater" element={<TextRepeater />} />
            <Route path="/tools/text/hashtag-generator" element={<HashtagGenerator />} />
            <Route path="/tools/text/blog-title-generator" element={<BlogTitleGenerator />} />
            <Route path="/tools/text/strong-password-generator" element={<StrongPasswordGenerator />} />
            <Route path="/tools/text/whitespace-remover" element={<WhitespaceRemover />} />
            <Route path="/tools/text/article-title-generator" element={<ArticleTitleGenerator />} />
            <Route path="/tools/text/ascii-art-generator" element={<AsciiArtGenerator />} />
            <Route path="/tools/text/big-text-generator" element={<BigTextGenerator />} />
            <Route path="/tools/text/bold-text-generator" element={<BoldTextGenerator />} />
            <Route path="/tools/text/business-name-generator" element={<BusinessNameGenerator />} />
            <Route path="/tools/text/character-counter" element={<CharacterCounter />} />
            <Route path="/tools/text/duplicate-line-remover" element={<DuplicateLineRemover />} />
            <Route path="/tools/text/emoji-text-generator" element={<EmojiTextGenerator />} />
            <Route path="/tools/text/fancy-text-generator" element={<FancyTextGenerator />} />
            <Route path="/tools/text/find-and-replace" element={<FindAndReplaceText />} />
            <Route path="/tools/text/italic-text-generator" element={<ItalicTextGenerator />} />
            <Route path="/tools/text/keyword-density-checker" element={<KeywordDensityChecker />} />
            <Route path="/tools/text/language-detector" element={<LanguageDetector />} />
            <Route path="/tools/text/meta-description-generator" element={<MetaDescriptionGenerator />} />
            <Route path="/tools/text/morse-code-translator" element={<MorseCodeTranslator />} />
            <Route path="/tools/text/word-counter" element={<WordCounter />} />
            <Route path="/tools/text/plagiarism-checker" element={<PlagiarismChecker />} />
            <Route path="/tools/text/reading-time-calculator" element={<ReadingTimeCalculator />} />
            <Route path="/tools/text/text-compare" element={<TextCompare />} />
            <Route path="/tools/text/text-art-generator" element={<TextArtGenerator />} />
            <Route path="/tools/text/text-summarizer" element={<TextSummarizer />} />
            <Route path="/tools/text/upside-down-text-generator" element={<UpsideDownTextGenerator />} />
            <Route path="/tools/text/username-generator" element={<UsernameGenerator />} />
            <Route path="/tools/text/yoda-translator" element={<YodaTranslator />} />
            <Route path="/tools/text/zalgo-glitch-text" element={<ZalgoGlitchText />} />
            {/* Web Tools */}
            <Route path="/tools/web/html-previewer" element={<HtmlPreviewer />} />
            <Route path="/tools/web/html-validator" element={<HtmlValidator />} />
            <Route path="/tools/web/css-validator" element={<CssValidator />} />
            <Route path="/tools/web/javascript-minifier" element={<JavaScriptMinifier />} />
            <Route path="/tools/web/css-minifier" element={<CssMinifier />} />
            <Route path="/tools/web/html-minifier" element={<HtmlMinifier />} />
            <Route path="/tools/web/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/web/xml-formatter" element={<XmlFormatter />} />
            <Route path="/tools/web/base64-encoder-decoder" element={<Base64EncoderDecoder />} />
            <Route path="/tools/web/url-encoder-decoder" element={<UrlEncoderDecoder />} />
            <Route path="/tools/web/html-entity-encoder" element={<HtmlEntityEncoder />} />
            <Route path="/tools/web/regex-tester" element={<RegexTester />} />
            <Route path="/tools/web/seo-meta-tag-generator" element={<SeoMetaTagGenerator />} />
            <Route path="/tools/web/open-graph-generator" element={<OpenGraphGenerator />} />
            <Route path="/tools/web/twitter-card-generator" element={<TwitterCardGenerator />} />
            <Route path="/tools/web/robots-txt-generator" element={<RobotsTxtGenerator />} />
            <Route path="/tools/web/sitemap-generator" element={<SitemapGenerator />} />
            <Route path="/tools/web/schema-markup-generator" element={<SchemaMarkupGenerator />} />
            <Route path="/tools/web/keyword-density-analyzer" element={<KeywordDensityAnalyzer />} />
            <Route path="/tools/web/serp-preview-tool" element={<SerpPreviewTool />} />
            <Route path="/tools/web/broken-link-checker" element={<BrokenLinkChecker />} />
            <Route path="/tools/web/page-speed-analyzer" element={<PageSpeedAnalyzer />} />
            <Route path="/tools/web/color-palette-generator" element={<ColorPaletteGenerator />} />
            <Route path="/tools/web/gradient-generator" element={<GradientGenerator />} />
            <Route path="/tools/web/box-shadow-generator" element={<BoxShadowGenerator />} />
            <Route path="/tools/web/border-radius-generator" element={<BorderRadiusGenerator />} />
            <Route path="/tools/web/css-grid-generator" element={<CssGridGenerator />} />
            <Route path="/tools/web/flexbox-generator" element={<FlexboxGenerator />} />
            <Route path="/tools/web/font-pairing-tool" element={<FontPairingTool />} />
            <Route path="/tools/web/favicon-generator" element={<FaviconGenerator />} />
            <Route path="/tools/web/css-animation-generator" element={<CssAnimationGenerator />} />
            <Route path="/tools/web/qr-code-generator" element={<QrCodeGenerator />} />
            <Route path="/tools/web/ssl-certificate-checker" element={<SslCertificateChecker />} />
            <Route path="/tools/web/website-security-scanner" element={<WebsiteSecurityScanner />} />
            <Route path="/tools/web/http-header-checker" element={<HttpHeaderChecker />} />
            <Route path="/tools/web/whois-lookup" element={<WhoisLookup />} />
            <Route path="/tools/web/dns-lookup-tool" element={<DnsLookupTool />} />
            <Route path="/tools/web/ip-address-lookup" element={<IpAddressLookup />} />
            <Route path="/tools/web/port-scanner" element={<PortScanner />} />
            <Route path="/tools/web/website-uptime-monitor" element={<WebsiteUptimeMonitor />} />
            <Route path="/tools/web/ping-test-tool" element={<PingTestTool />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
