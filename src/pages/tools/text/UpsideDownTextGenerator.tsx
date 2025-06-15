
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, RotateCcw, FlipVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UpsideDownTextGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  // Character mapping for upside down text
  const upsideDownMap: { [key: string]: string } = {
    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
    'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
    'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
    'y': 'ʎ', 'z': 'z',
    'A': '∀', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ᖴ', 'G': 'פ', 'H': 'H',
    'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ',
    'Q': 'Q', 'R': 'ᴿ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X',
    'Y': '⅄', 'Z': 'Z',
    '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ',
    '8': '8', '9': '6',
    '.': '˙', ',': "'", '?': '¿', '!': '¡', '"': '„', "'": ',', '(': ')', ')': '(',
    '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋',
    ' ': ' '
  };

  const generateUpsideDownText = () => {
    if (!inputText) {
      toast({
        title: "Error",
        description: "Please enter some text to convert.",
        variant: "destructive",
      });
      return;
    }

    const upsideDown = inputText
      .split('')
      .map(char => upsideDownMap[char] || char)
      .reverse()
      .join('');
    
    setOutput(upsideDown);
  };

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
              Flip your text upside down for fun social media posts, unique messages, and creative text effects.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Instant Generation</Badge>
              <Badge variant="secondary">Unicode Characters</Badge>
              <Badge variant="secondary">Copy Function</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlipVertical className="h-5 w-5" />
                  Normal Text
                </CardTitle>
                <CardDescription>
                  Enter the text you want to flip upside down
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
                  <Button onClick={generateUpsideDownText} className="flex-1">
                    <FlipVertical className="h-4 w-4 mr-2" />
                    Generate Upside Down Text
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
                    <CardTitle>Upside Down Text</CardTitle>
                    <CardDescription>
                      Your flipped text result
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
                  className="min-h-[200px] text-lg font-mono"
                />
                {output && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Characters: {output.length}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Understanding upside down text generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Character Mapping</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Uses Unicode characters that visually appear as upside down versions of regular letters.
                  </p>
                  <div className="text-sm space-y-1">
                    <p>a → ɐ, b → q, e → ǝ</p>
                    <p>A → ∀, B → ᗺ, E → Ǝ</p>
                    <p>! → ¡, ? → ¿</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Text Reversal</h4>
                  <p className="text-sm text-gray-600">
                    After character conversion, the entire string is reversed to create the upside down effect.
                  </p>
                  <div className="mt-2 p-3 bg-gray-100 rounded text-sm">
                    <p>Example: "Hello" → "ollǝH" → "Hǝllo"</p>
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
