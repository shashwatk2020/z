
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
