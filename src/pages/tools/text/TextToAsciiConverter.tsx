
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, RotateCcw, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TextToAsciiConverter = () => {
  const [inputText, setInputText] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const convertToAscii = () => {
    if (!inputText) {
      toast({
        title: "Error",
        description: "Please enter some text to convert.",
        variant: "destructive",
      });
      return;
    }

    const asciiValues = inputText
      .split('')
      .map(char => char.charCodeAt(0))
      .join(' ');
    
    setOutput(asciiValues);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "ASCII values copied to clipboard.",
    });
  };

  const clearAll = () => {
    setInputText('');
    setOutput('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Text to ASCII Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Convert any text into ASCII decimal values. Perfect for encoding, programming, and data processing tasks.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Instant Conversion</Badge>
              <Badge variant="secondary">ASCII Values</Badge>
              <Badge variant="secondary">Copy Function</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Text Input
                </CardTitle>
                <CardDescription>
                  Enter the text you want to convert to ASCII values
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Type or paste your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] text-base"
                />
                
                <div className="flex gap-2">
                  <Button onClick={convertToAscii} className="flex-1">
                    <Hash className="h-4 w-4 mr-2" />
                    Convert to ASCII
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>ASCII Output</CardTitle>
                    <CardDescription>
                      ASCII decimal values of your text
                    </CardDescription>
                  </div>
                  {output && (
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={output}
                  readOnly
                  placeholder="ASCII values will appear here..."
                  className="min-h-[200px] text-sm font-mono"
                />
                {output && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Characters processed: {inputText.length}</p>
                    <p>ASCII values: {output.split(' ').length}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>ASCII Reference</CardTitle>
              <CardDescription>Common ASCII values for reference</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Numbers</h4>
                  <p>0-9: 48-57</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Uppercase</h4>
                  <p>A-Z: 65-90</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Lowercase</h4>
                  <p>a-z: 97-122</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Special</h4>
                  <p>Space: 32, !: 33, @: 64</p>
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

export default TextToAsciiConverter;
