
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, RotateCcw, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UnicodeCharacterConverter = () => {
  const [inputText, setInputText] = useState('');
  const [unicodeOutput, setUnicodeOutput] = useState('');
  const [decimalOutput, setDecimalOutput] = useState('');
  const [hexOutput, setHexOutput] = useState('');
  const { toast } = useToast();

  const convertText = () => {
    if (!inputText) {
      toast({
        title: "Error",
        description: "Please enter some text to convert.",
        variant: "destructive",
      });
      return;
    }

    // Unicode escape sequences (\uXXXX)
    const unicode = inputText
      .split('')
      .map(char => '\\u' + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0'))
      .join('');

    // Decimal code points
    const decimal = inputText
      .split('')
      .map(char => char.charCodeAt(0))
      .join(' ');

    // Hexadecimal code points
    const hex = inputText
      .split('')
      .map(char => 'U+' + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0'))
      .join(' ');

    setUnicodeOutput(unicode);
    setDecimalOutput(decimal);
    setHexOutput(hex);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`,
    });
  };

  const clearAll = () => {
    setInputText('');
    setUnicodeOutput('');
    setDecimalOutput('');
    setHexOutput('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Unicode Character Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Convert text to Unicode escape sequences, decimal code points, and hexadecimal representations.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Unicode Escape</Badge>
              <Badge variant="secondary">Decimal Codes</Badge>
              <Badge variant="secondary">Hex Codes</Badge>
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
                  Enter text to convert to Unicode representations
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
                  <Button onClick={convertText} className="flex-1">
                    <Hash className="h-4 w-4 mr-2" />
                    Convert to Unicode
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
                <CardTitle>Unicode Output</CardTitle>
                <CardDescription>
                  Different Unicode representations of your text
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="unicode" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="unicode">Unicode</TabsTrigger>
                    <TabsTrigger value="decimal">Decimal</TabsTrigger>
                    <TabsTrigger value="hex">Hex</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="unicode" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Unicode Escape Sequences</h4>
                      {unicodeOutput && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(unicodeOutput, 'Unicode sequences')}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      )}
                    </div>
                    <Textarea
                      value={unicodeOutput}
                      readOnly
                      placeholder="Unicode escape sequences will appear here..."
                      className="min-h-[150px] text-sm font-mono"
                    />
                  </TabsContent>
                  
                  <TabsContent value="decimal" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Decimal Code Points</h4>
                      {decimalOutput && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(decimalOutput, 'Decimal codes')}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      )}
                    </div>
                    <Textarea
                      value={decimalOutput}
                      readOnly
                      placeholder="Decimal code points will appear here..."
                      className="min-h-[150px] text-sm font-mono"
                    />
                  </TabsContent>
                  
                  <TabsContent value="hex" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Hexadecimal Code Points</h4>
                      {hexOutput && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(hexOutput, 'Hex codes')}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      )}
                    </div>
                    <Textarea
                      value={hexOutput}
                      readOnly
                      placeholder="Hexadecimal code points will appear here..."
                      className="min-h-[150px] text-sm font-mono"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Unicode Examples</CardTitle>
              <CardDescription>Common Unicode characters and their representations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-3">Common Characters</h4>
                  <div className="space-y-1">
                    <p>© → \\u00A9 (U+00A9)</p>
                    <p>® → \\u00AE (U+00AE)</p>
                    <p>™ → \\u2122 (U+2122)</p>
                    <p>€ → \\u20AC (U+20AC)</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Emoji Examples</h4>
                  <div className="space-y-1">
                    <p>😀 → \\uD83D\\uDE00 (U+1F600)</p>
                    <p>❤️ → \\u2764\\uFE0F (U+2764)</p>
                    <p>🚀 → \\uD83D\\uDE80 (U+1F680)</p>
                    <p>🌟 → \\uD83C\\uDF1F (U+1F31F)</p>
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

export default UnicodeCharacterConverter;
