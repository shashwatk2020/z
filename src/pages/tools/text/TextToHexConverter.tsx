
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, RotateCcw, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TextToHexConverter = () => {
  const [inputText, setInputText] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const convertToHex = () => {
    if (!inputText) {
      toast({
        title: "Error",
        description: "Please enter some text to convert.",
        variant: "destructive",
      });
      return;
    }

    const hexValues = inputText
      .split('')
      .map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'))
      .join(' ');
    
    setOutput(hexValues);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "Hex values copied to clipboard.",
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
              Text to Hex Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Convert any text into hexadecimal values. Useful for programming, debugging, and data encoding tasks.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Instant Conversion</Badge>
              <Badge variant="secondary">Hex Values</Badge>
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
                  Enter the text you want to convert to hexadecimal
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
                  <Button onClick={convertToHex} className="flex-1">
                    <Hash className="h-4 w-4 mr-2" />
                    Convert to Hex
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
                    <CardTitle>Hexadecimal Output</CardTitle>
                    <CardDescription>
                      Hex values of your text
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
                  placeholder="Hexadecimal values will appear here..."
                  className="min-h-[200px] text-sm font-mono"
                />
                {output && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Characters processed: {inputText.length}</p>
                    <p>Hex values: {output.split(' ').length}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Hexadecimal Reference</CardTitle>
              <CardDescription>Common hex values for reference</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Numbers</h4>
                  <p>0-9: 30-39</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Uppercase</h4>
                  <p>A-Z: 41-5A</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Lowercase</h4>
                  <p>a-z: 61-7A</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Special</h4>
                  <p>Space: 20, !: 21, @: 40</p>
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

export default TextToHexConverter;
