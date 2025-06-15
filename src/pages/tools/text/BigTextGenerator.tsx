
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Copy, Type, Wand2 } from 'lucide-react';

// ASCII font definitions
const ASCII_FONTS = {
  big: {
    name: 'Big',
    chars: {
      'A': ['  ██  ', ' ████ ', '██  ██', '██████', '██  ██', '██  ██', '      '],
      'B': ['██████', '██  ██', '██████', '██████', '██  ██', '██████', '      '],
      'C': [' █████', '██    ', '██    ', '██    ', '██    ', ' █████', '      '],
      'D': ['██████', '██  ██', '██  ██', '██  ██', '██  ██', '██████', '      '],
      'E': ['██████', '██    ', '█████ ', '█████ ', '██    ', '██████', '      '],
      'F': ['██████', '██    ', '█████ ', '█████ ', '██    ', '██    ', '      '],
      'G': [' █████', '██    ', '██ ███', '██  ██', '██  ██', ' █████', '      '],
      'H': ['██  ██', '██  ██', '██████', '██████', '██  ██', '██  ██', '      '],
      'I': ['██████', '  ██  ', '  ██  ', '  ██  ', '  ██  ', '██████', '      '],
      'J': ['██████', '    ██', '    ██', '    ██', '██  ██', ' █████', '      '],
      'K': ['██  ██', '██ ██ ', '████  ', '████  ', '██ ██ ', '██  ██', '      '],
      'L': ['██    ', '██    ', '██    ', '██    ', '██    ', '██████', '      '],
      'M': ['██  ██', '██████', '██████', '██  ██', '██  ██', '██  ██', '      '],
      'N': ['██  ██', '███ ██', '██████', '██ ███', '██  ██', '██  ██', '      '],
      'O': [' █████', '██  ██', '██  ██', '██  ██', '██  ██', ' █████', '      '],
      'P': ['██████', '██  ██', '██████', '██    ', '██    ', '██    ', '      '],
      'Q': [' █████', '██  ██', '██  ██', '██ ███', '██  ██', ' ██████', '     █'],
      'R': ['██████', '██  ██', '██████', '██ ██ ', '██  ██', '██  ██', '      '],
      'S': [' █████', '██    ', ' ████ ', '    ██', '    ██', '█████ ', '      '],
      'T': ['██████', '  ██  ', '  ██  ', '  ██  ', '  ██  ', '  ██  ', '      '],
      'U': ['██  ██', '██  ██', '██  ██', '██  ██', '██  ██', ' █████', '      '],
      'V': ['██  ██', '██  ██', '██  ██', '██  ██', ' ████ ', '  ██  ', '      '],
      'W': ['██  ██', '██  ██', '██  ██', '██████', '██████', '██  ██', '      '],
      'X': ['██  ██', ' ████ ', '  ██  ', '  ██  ', ' ████ ', '██  ██', '      '],
      'Y': ['██  ██', '██  ██', ' ████ ', '  ██  ', '  ██  ', '  ██  ', '      '],
      'Z': ['██████', '    ██', '   ██ ', '  ██  ', ' ██   ', '██████', '      '],
      '0': [' █████', '██  ██', '██ ███', '█████ ', '██  ██', ' █████', '      '],
      '1': ['  ██  ', ' ███  ', '  ██  ', '  ██  ', '  ██  ', '██████', '      '],
      '2': [' █████', '██  ██', '   ██ ', '  ██  ', ' ██   ', '██████', '      '],
      '3': [' █████', '██  ██', '  ███ ', '    ██', '██  ██', ' █████', '      '],
      '4': ['██  ██', '██  ██', '██████', '    ██', '    ██', '    ██', '      '],
      '5': ['██████', '██    ', '█████ ', '    ██', '██  ██', ' █████', '      '],
      '6': [' █████', '██    ', '█████ ', '██  ██', '██  ██', ' █████', '      '],
      '7': ['██████', '    ██', '   ██ ', '  ██  ', ' ██   ', '██    ', '      '],
      '8': [' █████', '██  ██', ' █████', '██  ██', '██  ██', ' █████', '      '],
      '9': [' █████', '██  ██', ' ██████', '    ██', '    ██', ' █████', '      '],
      ' ': ['      ', '      ', '      ', '      ', '      ', '      ', '      '],
      '!': ['  ██  ', '  ██  ', '  ██  ', '  ██  ', '      ', '  ██  ', '      '],
      '?': [' █████', '██  ██', '   ██ ', '  ██  ', '      ', '  ██  ', '      '],
      '.': ['      ', '      ', '      ', '      ', '      ', '  ██  ', '      '],
      ',': ['      ', '      ', '      ', '      ', '  ██  ', ' ██   ', '      '],
      ':': ['      ', '  ██  ', '      ', '      ', '  ██  ', '      ', '      '],
      ';': ['      ', '  ██  ', '      ', '      ', '  ██  ', ' ██   ', '      '],
      '-': ['      ', '      ', '██████', '      ', '      ', '      ', '      '],
      '+': ['      ', '  ██  ', '██████', '  ██  ', '      ', '      ', '      '],
      '=': ['      ', '██████', '      ', '██████', '      ', '      ', '      '],
      '(': ['   ██ ', '  ██  ', ' ██   ', ' ██   ', '  ██  ', '   ██ ', '      '],
      ')': [' ██   ', '  ██  ', '   ██ ', '   ██ ', '  ██  ', ' ██   ', '      '],
      '[': [' █████', ' ██   ', ' ██   ', ' ██   ', ' ██   ', ' █████', '      '],
      ']': ['█████ ', '   ██ ', '   ██ ', '   ██ ', '   ██ ', '█████ ', '      '],
      '/': ['    ██', '   ██ ', '  ██  ', ' ██   ', '██    ', '      ', '      '],
      '\\': ['██    ', ' ██   ', '  ██  ', '   ██ ', '    ██', '      ', '      '],
      '*': ['      ', ' █ █ █', '  ███ ', '██████', '  ███ ', ' █ █ █', '      '],
      '@': [' █████', '██  ██', '██ ███', '██ ███', '██    ', ' █████', '      '],
      '#': [' ██ ██', '██████', ' ██ ██', '██████', ' ██ ██', '      ', '      '],
      '$': ['  ██  ', ' █████', '██    ', ' █████', '    ██', ' █████', '  ██  '],
      '%': ['██  ██', '██ ██ ', '  ██  ', ' ██ ██', '██  ██', '      ', '      '],
      '^': ['  ██  ', ' ████ ', '██  ██', '      ', '      ', '      ', '      '],
      '&': [' ████ ', '██  ██', ' ████ ', '██ ██ ', '██  ██', ' ██ ██', '      '],
      '_': ['      ', '      ', '      ', '      ', '      ', '██████', '      '],
      '|': ['  ██  ', '  ██  ', '  ██  ', '  ██  ', '  ██  ', '  ██  ', '      '],
      '~': ['      ', '      ', ' ██ ██', '██ ██ ', '      ', '      ', '      '],
      '`': [' ██   ', '  ██  ', '      ', '      ', '      ', '      ', '      '],
      "'": ['  ██  ', '  ██  ', '      ', '      ', '      ', '      ', '      '],
      '"': [' ████ ', ' ████ ', '      ', '      ', '      ', '      ', '      '],
      '<': ['   ██ ', '  ██  ', ' ██   ', '  ██  ', '   ██ ', '      ', '      '],
      '>': [' ██   ', '  ██  ', '   ██ ', '  ██  ', ' ██   ', '      ', '      '],
    }
  },
  block: {
    name: 'Block',
    chars: {
      'A': ['█████', '█   █', '█████', '█   █', '█   █'],
      'B': ['████', '█   █', '████', '█   █', '████'],
      'C': ['█████', '█    ', '█    ', '█    ', '█████'],
      'D': ['████', '█   █', '█   █', '█   █', '████'],
      'E': ['█████', '█    ', '███  ', '█    ', '█████'],
      'F': ['█████', '█    ', '███  ', '█    ', '█    '],
      'G': ['█████', '█    ', '█ ███', '█   █', '█████'],
      'H': ['█   █', '█   █', '█████', '█   █', '█   █'],
      'I': ['█████', '  █  ', '  █  ', '  █  ', '█████'],
      'J': ['█████', '    █', '    █', '█   █', '█████'],
      'K': ['█   █', '█  █ ', '███  ', '█  █ ', '█   █'],
      'L': ['█    ', '█    ', '█    ', '█    ', '█████'],
      'M': ['█   █', '██ ██', '█ █ █', '█   █', '█   █'],
      'N': ['█   █', '██  █', '█ █ █', '█  ██', '█   █'],
      'O': ['█████', '█   █', '█   █', '█   █', '█████'],
      'P': ['████', '█   █', '████', '█    ', '█    '],
      'Q': ['█████', '█   █', '█ █ █', '█  ██', '█████'],
      'R': ['████', '█   █', '████', '█  █ ', '█   █'],
      'S': ['█████', '█    ', '█████', '    █', '█████'],
      'T': ['█████', '  █  ', '  █  ', '  █  ', '  █  '],
      'U': ['█   █', '█   █', '█   █', '█   █', '█████'],
      'V': ['█   █', '█   █', '█   █', ' █ █ ', '  █  '],
      'W': ['█   █', '█   █', '█ █ █', '██ ██', '█   █'],
      'X': ['█   █', ' █ █ ', '  █  ', ' █ █ ', '█   █'],
      'Y': ['█   █', ' █ █ ', '  █  ', '  █  ', '  █  '],
      'Z': ['█████', '   █ ', '  █  ', ' █   ', '█████'],
      '0': ['█████', '█   █', '█   █', '█   █', '█████'],
      '1': ['  █  ', ' ██  ', '  █  ', '  █  ', '█████'],
      '2': ['█████', '    █', '█████', '█    ', '█████'],
      '3': ['█████', '    █', '█████', '    █', '█████'],
      '4': ['█   █', '█   █', '█████', '    █', '    █'],
      '5': ['█████', '█    ', '█████', '    █', '█████'],
      '6': ['█████', '█    ', '█████', '█   █', '█████'],
      '7': ['█████', '    █', '   █ ', '  █  ', '  █  '],
      '8': ['█████', '█   █', '█████', '█   █', '█████'],
      '9': ['█████', '█   █', '█████', '    █', '█████'],
      ' ': ['     ', '     ', '     ', '     ', '     '],
      '!': ['  █  ', '  █  ', '  █  ', '     ', '  █  '],
      '?': ['█████', '    █', '  ██ ', '     ', '  █  '],
      '.': ['     ', '     ', '     ', '     ', '  █  '],
      ',': ['     ', '     ', '     ', '  █  ', ' █   '],
      ':': ['     ', '  █  ', '     ', '  █  ', '     '],
      ';': ['     ', '  █  ', '     ', '  █  ', ' █   '],
      '-': ['     ', '     ', '█████', '     ', '     '],
      '+': ['     ', '  █  ', '█████', '  █  ', '     '],
      '=': ['     ', '█████', '     ', '█████', '     '],
      '(': ['  ██ ', ' █   ', ' █   ', ' █   ', '  ██ '],
      ')': ' ██  |   █ |   █ |   █ | ██  '.split('|'),
      '*': [' █ █ ', '  █  ', '█████', '  █  ', ' █ █ ']
    }
  }
};

const BigTextGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [font, setFont] = useState('big');
  const [bigText, setBigText] = useState('');
  const { toast } = useToast();

  const generateBigText = () => {
    if (!inputText.trim()) {
      toast({ title: "No text entered", description: "Please enter some text to convert.", variant: "destructive" });
      return;
    }

    const selectedFont = ASCII_FONTS[font as keyof typeof ASCII_FONTS];
    const chars = inputText.toUpperCase().split('');
    const height = selectedFont.chars['A'].length;
    const lines: string[] = Array(height).fill('');

    chars.forEach((char) => {
      const charPattern = selectedFont.chars[char] || selectedFont.chars[' '];
      charPattern.forEach((line, index) => {
        lines[index] += line + ' ';
      });
    });

    setBigText(lines.join('\n'));
    toast({ title: "Success", description: "Big text generated!" });
  };

  const copyToClipboard = () => {
    if (!bigText) return;
    navigator.clipboard.writeText(bigText);
    toast({ title: "Copied!", description: "Big text copied to clipboard." });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Big Text (ASCII) Generator</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Transform your text into large ASCII art letters. Perfect for banners, headers, and eye-catching displays.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5 text-blue-500" />
                Text Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="input-text">Enter Text</Label>
                <Input
                  id="input-text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your text here..."
                  className="mt-2"
                  maxLength={20}
                />
                <p className="text-sm text-gray-500 mt-1">{inputText.length}/20 characters</p>
              </div>

              <div>
                <Label>Font Style</Label>
                <Select value={font} onValueChange={setFont}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="big">Big (Detailed)</SelectItem>
                    <SelectItem value="block">Block (Simple)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={generateBigText} disabled={!inputText.trim()} className="w-full" size="lg">
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Big Text
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-green-500" />
                  Generated Big Text
                </div>
                {bigText && (
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bigText ? (
                <pre className="text-xs md:text-sm font-mono p-4 bg-gray-900 text-white rounded-md overflow-auto max-h-[400px] whitespace-pre">
                  {bigText}
                </pre>
              ) : (
                <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center h-full">
                  <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Your big text will appear here.</p>
                  <p className="text-sm mt-2">Enter some text and click generate.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-white rounded-lg p-8 shadow-sm border">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Use the Big Text Generator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Convert text to large ASCII art</li>
                <li>• Multiple font styles available</li>
                <li>• Supports letters, numbers & symbols</li>
                <li>• One-click copy to clipboard</li>
                <li>• Perfect for banners and headers</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Usage Tips</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Keep text short (20 characters max)</li>
                <li>• Use for social media posts</li>
                <li>• Great for ASCII art projects</li>
                <li>• Works best with monospace fonts</li>
                <li>• Try different font styles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BigTextGenerator;
