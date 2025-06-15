
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PlagiarismChecker = () => {
  const [text, setText] = useState('');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Plagiarism Checker (Basic)
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Check your text for potential plagiarism and ensure content originality.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="destructive">Tool Offline</Badge>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </div>

          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Service Currently Offline:</strong> This plagiarism checker requires external API services that are not currently available. The tool will be activated once API access is configured.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Plagiarism Detection
              </CardTitle>
              <CardDescription>
                Enter your text below to check for potential plagiarism (service currently unavailable)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="Enter your text here to check for plagiarism..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] text-base"
                disabled
              />
              
              <Button disabled className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Check for Plagiarism (Offline)
              </Button>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">What this tool will provide when available:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Percentage of potentially plagiarized content</li>
                  <li>• Sources where similar content was found</li>
                  <li>• Highlighted sections with potential matches</li>
                  <li>• Originality score and detailed report</li>
                  <li>• Suggestions for improving content uniqueness</li>
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

export default PlagiarismChecker;
