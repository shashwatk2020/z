
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Star } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const YodaTranslator = () => {
  const [text, setText] = useState('');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Yoda Translator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transform your text to speak like Master Yoda. Use the Force of language patterns, you will.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="destructive">Tool Offline</Badge>
              <Badge variant="secondary">AI Required</Badge>
            </div>
          </div>

          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Service Currently Offline:</strong> This Yoda translator requires advanced language processing API services (OpenAI, natural language processing APIs) that are not currently available. The tool will be activated once API access is configured.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Yoda Translation
              </CardTitle>
              <CardDescription>
                Enter your text below to translate to Yoda's speech pattern (service currently unavailable)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="Enter the text you want to translate to Yoda speech..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] text-base"
                disabled
              />
              
              <Button disabled className="w-full">
                <Star className="h-4 w-4 mr-2" />
                Translate to Yoda Speech (Offline)
              </Button>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">What this tool will provide when available:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Object-Subject-Verb sentence restructuring</li>
                  <li>• Yoda's characteristic speech patterns</li>
                  <li>• Proper word inversions and arrangements</li>
                  <li>• Wisdom-like phrasing transformations</li>
                  <li>• Context-aware sentence modifications</li>
                  <li>• Preservation of original meaning</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="font-semibold mb-4 text-green-800">Example Transformations:</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Normal: "You will learn the ways of the Force"</p>
                    <p className="text-green-700 font-medium">Yoda: "Learn the ways of the Force, you will"</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Normal: "I am going to the store"</p>
                    <p className="text-green-700 font-medium">Yoda: "To the store, going I am"</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Normal: "The path is difficult"</p>
                    <p className="text-green-700 font-medium">Yoda: "Difficult, the path is"</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default YodaTranslator;
