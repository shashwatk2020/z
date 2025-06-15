
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TextSummarizer = () => {
  const [text, setText] = useState('');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Text Summarizer (AI-Powered)
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Automatically summarize long texts, articles, and documents using advanced AI technology.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="destructive">Tool Offline</Badge>
              <Badge variant="secondary">AI Required</Badge>
            </div>
          </div>

          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Service Currently Offline:</strong> This text summarizer requires AI API services (OpenAI, Anthropic, or similar) that are not currently available. The tool will be activated once API access is configured.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Text Summarization
              </CardTitle>
              <CardDescription>
                Enter your text below to generate an AI-powered summary (service currently unavailable)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="Paste your long text, article, or document here to summarize..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] text-base"
                disabled
              />
              
              <Button disabled className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Generate Summary (Offline)
              </Button>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">What this tool will provide when available:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Intelligent text summarization using AI</li>
                  <li>• Customizable summary length (short, medium, long)</li>
                  <li>• Key points extraction from long documents</li>
                  <li>• Multiple summary styles (bullet points, paragraphs)</li>
                  <li>• Multilingual summarization support</li>
                  <li>• Preservation of important context and meaning</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TextSummarizer;
