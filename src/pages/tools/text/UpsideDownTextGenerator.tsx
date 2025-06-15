
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, RotateCcw, RotateUpsideDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UpsideDownTextGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  // Unicode character map for upside down text
  const upsideDownMap: { [key: string]: string } = {
    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
    'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
    'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
    'y': 'ʎ', 'z': 'z',
    'A': '∀', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': 'פ', 'H': 'H',
    'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ',
    'Q': 'Q', 'R': 'ᴿ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X',
    'Y': '⅄', 'Z': 'Z',
    '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ',
    '8': '8', '9': '6',
    '!': '¡', '?': '¿', '.': '˙', ',': "'", "'": ',', '"': '„', '(': ')', ')': '(',
    '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋',
    '_': '‾', '-': '-', '+': '+', '=': '=', '*': '✱', '/': '/', '\\': '\\',
    '|': '|', ';': '؛', ':': ':', ' ': ' '
  };

  const convertToUpsideDown = () => {
    if (!inputText) {
      toast({
        title: "Error",
        description: "Please enter some text to convert.",
        variant: "destructive",
      });
      return;
    }

    const converted = inputText
      .split('')
      .map(char => upsideDownMap[char] || char)
      .reverse()
      .join('');
    
    setOutput(converted);
  };

  useEffect(() => {
    if (inputText) {
      convertToUpsideDown();
    } else {
      setOutput('');
    }
  }, [inputText]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "Upside down text copied to clipboard.",
    });
  };

  const clearAll = () => {
    setInputText('');
    setOutput('');
  };

  const sampleTexts = [
    "Hello World!",
    "This is upside down text",
    "Amazing transformation",
    "Cool Unicode magic"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Upside Down Text Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transform your text into upside down characters using Unicode symbols. Perfect for social media, messaging, and creative content.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Real-time Conversion</Badge>
              <Badge variant="secondary">Unicode Magic</Badge>
              <Badge variant="secondary">Instant Copy</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateUpsideDown className="h-5 w-5" />
                  Normal Text Input
                </CardTitle>
                <CardDescription>
                  Enter your text to convert to upside down format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Type your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] text-base"
                />
                
                <div className="flex gap-2">
                  <Button onClick={convertToUpsideDown} className="flex-1">
                    <RotateUpsideDown className="h-4 w-4 mr-2" />
                    Flip Text
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Try these examples:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {sampleTexts.map((text, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputText(text)}
                        className="text-xs"
                      >
                        {text}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Upside Down Output</CardTitle>
                    <CardDescription>
                      Your flipped text appears here
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
                  placeholder="Upside down text will appear here..."
                  className="min-h-[200px] text-lg"
                />
                {output && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Original length: {inputText.length} characters</p>
                    <p>Flipped length: {output.length} characters</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How Upside Down Text Works</CardTitle>
              <CardDescription>Understanding the Unicode magic behind flipped text</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-3">Character Mapping</h4>
                  <p className="mb-2">Each regular character is mapped to a visually similar Unicode character that appears upside down:</p>
                  <div className="bg-gray-100 p-3 rounded font-mono text-xs">
                    <p>a → ɐ (U+0250)</p>
                    <p>b → q (Regular q)</p>
                    <p>e → ǝ (U+01DD)</p>
                    <p>! → ¡ (U+00A1)</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Text Reversal</h4>
                  <p className="mb-2">After character substitution, the entire string is reversed to complete the upside down effect:</p>
                  <div className="bg-gray-100 p-3 rounded text-xs">
                    <p>1. "Hello" → "Hǝllo"</p>
                    <p>2. Reverse → "ollǝH"</p>
                    <p>3. Final → "ollǝH"</p>
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

export default UpsideDownTextGenerator;
