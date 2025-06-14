
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, Upload, RotateCcw, RotateCounterClockwise } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReverseTextGenerator = () => {
  const [text, setText] = useState('');
  const [reverseResult, setReverseResult] = useState('');
  const [flipResult, setFlipResult] = useState('');
  const [wordsResult, setWordsResult] = useState('');
  const { toast } = useToast();

  const reverseText = () => {
    const reversed = text.split('').reverse().join('');
    setReverseResult(reversed);
  };

  const flipText = () => {
    const flipMap: { [key: string]: string } = {
      'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
      'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
      'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
      'y': 'ʎ', 'z': 'z', 'A': '∀', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ᖴ',
      'G': 'פ', 'H': 'H', 'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N',
      'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'ᴿ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ',
      'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ',
      '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0', '.': '˙', ',': "'",
      '?': '¿', '!': '¡', "'": ',', '"': '„', '(': ')', ')': '(', '[': ']', ']': '[',
      '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾'
    };
    
    const flipped = text
      .split('')
      .map(char => flipMap[char] || char)
      .reverse()
      .join('');
    setFlipResult(flipped);
  };

  const reverseWords = () => {
    const reversed = text.split(' ').reverse().join(' ');
    setWordsResult(reversed);
  };

  const copyToClipboard = async (content: string) => {
    if (content) {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard successfully.",
      });
    }
  };

  const downloadText = (content: string, filename: string) => {
    if (content) {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const clearAll = () => {
    setText('');
    setReverseResult('');
    setFlipResult('');
    setWordsResult('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Reverse Text Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create reversed, flipped, and upside-down text effects. Perfect for social media, messaging, and creative text formatting.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Free Tool</Badge>
              <Badge variant="secondary">Multiple Effects</Badge>
              <Badge variant="secondary">Social Media Ready</Badge>
            </div>
          </div>

          {/* Main Tool */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <RotateCounterClockwise className="h-6 w-6" />
                Reverse Text Generator
              </CardTitle>
              <CardDescription>
                Enter your text and choose from different reverse text effects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Input Text</label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button variant="outline" size="sm" onClick={clearAll}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </div>
                <Textarea
                  placeholder="Type your text here to reverse it..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[150px] text-base"
                />
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={reverseText} disabled={!text}>
                  Reverse Characters
                </Button>
                <Button onClick={flipText} disabled={!text}>
                  Flip Text (Upside Down)
                </Button>
                <Button onClick={reverseWords} disabled={!text}>
                  Reverse Words
                </Button>
              </div>

              {/* Results */}
              <Tabs defaultValue="reverse" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="reverse">Reversed</TabsTrigger>
                  <TabsTrigger value="flip">Flipped</TabsTrigger>
                  <TabsTrigger value="words">Words Reversed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="reverse" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Reversed Text</label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(reverseResult)}
                        disabled={!reverseResult}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadText(reverseResult, 'reversed-text.txt')}
                        disabled={!reverseResult}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Reversed text will appear here..."
                    value={reverseResult}
                    readOnly
                    className="min-h-[200px] text-base bg-gray-50"
                  />
                </TabsContent>

                <TabsContent value="flip" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Flipped Text (Upside Down)</label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(flipResult)}
                        disabled={!flipResult}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadText(flipResult, 'flipped-text.txt')}
                        disabled={!flipResult}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Flipped text will appear here..."
                    value={flipResult}
                    readOnly
                    className="min-h-[200px] text-base bg-gray-50"
                  />
                </TabsContent>

                <TabsContent value="words" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Words Reversed</label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(wordsResult)}
                        disabled={!wordsResult}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadText(wordsResult, 'words-reversed.txt')}
                        disabled={!wordsResult}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Text with reversed word order will appear here..."
                    value={wordsResult}
                    readOnly
                    className="min-h-[200px] text-base bg-gray-50"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Article Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Types of Text Reversal</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p>
                    Our reverse text generator offers three different types of text manipulation:
                  </p>
                  <ul>
                    <li><strong>Character Reversal:</strong> Reverses the order of individual characters in the text</li>
                    <li><strong>Flipped Text:</strong> Creates upside-down text using Unicode characters that look like upside-down versions of regular letters</li>
                    <li><strong>Word Reversal:</strong> Reverses the order of words while keeping individual words intact</li>
                  </ul>
                  <p>
                    Each method creates a different visual effect and can be used for various creative and practical purposes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Use the Reverse Text Generator</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <ol>
                    <li><strong>Input Text:</strong> Type or paste your text into the input area, or upload a text file.</li>
                    <li><strong>Choose Effect:</strong> Click on the desired effect button (Reverse Characters, Flip Text, or Reverse Words).</li>
                    <li><strong>View Results:</strong> Switch between tabs to see different reverse text effects.</li>
                    <li><strong>Copy or Download:</strong> Use the copy button to copy results to clipboard or download as text files.</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Creative Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 font-bold">•</span>
                      <span><strong>Social Media:</strong> Create eye-catching posts and comments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 font-bold">•</span>
                      <span><strong>Gaming:</strong> Unique usernames and in-game text</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 font-bold">•</span>
                      <span><strong>Art Projects:</strong> Typography and design elements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 font-bold">•</span>
                      <span><strong>Puzzles:</strong> Create word games and riddles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 font-bold">•</span>
                      <span><strong>Education:</strong> Teaching tools for reading and comprehension</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 font-bold">•</span>
                      <span><strong>Privacy:</strong> Obscure text for screenshots</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Original:</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded border">
                      Hello World
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Reversed:</h4>
                    <p className="text-sm bg-blue-50 p-3 rounded border border-blue-200">
                      dlroW olleH
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Flipped:</h4>
                    <p className="text-sm bg-purple-50 p-3 rounded border border-purple-200">
                      plɹoM ollǝH
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Words Reversed:</h4>
                    <p className="text-sm bg-green-50 p-3 rounded border border-green-200">
                      World Hello
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tips & Tricks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-semibold text-blue-600">Flipped Text Compatibility</p>
                    <p className="text-gray-600">Works best with simple Latin characters</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-green-600">Mobile Friendly</p>
                    <p className="text-gray-600">All effects work on mobile devices</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-purple-600">Combine Effects</p>
                    <p className="text-gray-600">Use different effects for creative results</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Q: Why do some flipped characters look different?</h4>
                    <p className="text-sm text-gray-600">
                      Flipped text uses Unicode characters that approximate upside-down versions. Not all characters have perfect equivalents.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: Can I reverse multiple paragraphs?</h4>
                    <p className="text-sm text-gray-600">
                      Yes, the tool works with any amount of text, including multiple paragraphs and line breaks.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: Does flipped text work on all platforms?</h4>
                    <p className="text-sm text-gray-600">
                      Most modern platforms support Unicode characters, but some may not display all flipped characters correctly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReverseTextGenerator;
