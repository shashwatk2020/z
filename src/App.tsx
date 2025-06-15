
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
