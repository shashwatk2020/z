
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, Upload, RotateCcw, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UnicodeCharacterConverter = () => {
  const [text, setText] = useState('');
  const [unicodeResult, setUnicodeResult] = useState('');
  const [characterInput, setCharacterInput] = useState('');
  const [characterInfo, setCharacterInfo] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const textToUnicode = () => {
    try {
      const unicode = text
        .split('')
        .map(char => {
          const codePoint = char.codePointAt(0);
          return `U+${codePoint?.toString(16).toUpperCase().padStart(4, '0')} (${codePoint})`;
        })
        .join('\n');
      setUnicodeResult(unicode);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert text to Unicode.",
        variant: "destructive",
      });
    }
  };

  const analyzeCharacter = () => {
    if (!characterInput) {
      toast({
        title: "No Character",
        description: "Please enter a character to analyze.",
        variant: "destructive",
      });
      return;
    }

    const char = characterInput[0]; // Take first character
    const codePoint = char.codePointAt(0);
    
    if (codePoint === undefined) {
      toast({
        title: "Invalid Character",
        description: "Unable to analyze the provided character.",
        variant: "destructive",
      });
      return;
    }

    const info = {
      character: char,
      codePoint: codePoint,
      hexCode: codePoint.toString(16).toUpperCase(),
      unicodeNotation: `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
      htmlEntity: `&#${codePoint};`,
      htmlHex: `&#x${codePoint.toString(16).toUpperCase()};`,
      cssCode: `\\${codePoint.toString(16).toUpperCase()}`,
      javascriptCode: `\\u{${codePoint.toString(16).toUpperCase()}}`,
      category: getUnicodeCategory(codePoint),
      block: getUnicodeBlock(codePoint),
    };

    setCharacterInfo(info);
  };

  const getUnicodeCategory = (codePoint: number): string => {
    if (codePoint >= 32 && codePoint <= 126) return "Basic Latin";
    if (codePoint >= 128 && codePoint <= 255) return "Latin-1 Supplement";
    if (codePoint >= 256 && codePoint <= 383) return "Latin Extended-A";
    if (codePoint >= 384 && codePoint <= 591) return "Latin Extended-B";
    if (codePoint >= 0x0370 && codePoint <= 0x03FF) return "Greek and Coptic";
    if (codePoint >= 0x0400 && codePoint <= 0x04FF) return "Cyrillic";
    if (codePoint >= 0x4E00 && codePoint <= 0x9FFF) return "CJK Unified Ideographs";
    if (codePoint >= 0x1F600 && codePoint <= 0x1F64F) return "Emoticons";
    if (codePoint >= 0x1F300 && codePoint <= 0x1F5FF) return "Miscellaneous Symbols";
    return "Other";
  };

  const getUnicodeBlock = (codePoint: number): string => {
    if (codePoint <= 127) return "ASCII";
    if (codePoint <= 255) return "Latin-1";
    if (codePoint <= 0x024F) return "Latin Extended";
    if (codePoint <= 0x02AF) return "IPA Extensions";
    if (codePoint <= 0x036F) return "Combining Diacritical Marks";
    if (codePoint <= 0x03FF) return "Greek";
    if (codePoint <= 0x04FF) return "Cyrillic";
    if (codePoint <= 0x1FFF) return "Various Scripts";
    if (codePoint <= 0x2BFF) return "Symbols and Punctuation";
    if (codePoint <= 0x9FFF) return "CJK";
    if (codePoint <= 0x1F7FF) return "Symbols and Pictographs";
    return "Supplementary";
  };

  const commonUnicodeChars = [
    { char: '©', name: 'Copyright Sign', code: 'U+00A9' },
    { char: '®', name: 'Registered Sign', code: 'U+00AE' },
    { char: '™', name: 'Trade Mark Sign', code: 'U+2122' },
    { char: '€', name: 'Euro Sign', code: 'U+20AC' },
    { char: '£', name: 'Pound Sign', code: 'U+00A3' },
    { char: '¥', name: 'Yen Sign', code: 'U+00A5' },
    { char: '→', name: 'Rightwards Arrow', code: 'U+2192' },
    { char: '←', name: 'Leftwards Arrow', code: 'U+2190' },
    { char: '↑', name: 'Upwards Arrow', code: 'U+2191' },
    { char: '↓', name: 'Downwards Arrow', code: 'U+2193' },
    { char: '★', name: 'Black Star', code: 'U+2605' },
    { char: '☆', name: 'White Star', code: 'U+2606' },
    { char: '♠', name: 'Black Spade Suit', code: 'U+2660' },
    { char: '♣', name: 'Black Club Suit', code: 'U+2663' },
    { char: '♥', name: 'Black Heart Suit', code: 'U+2665' },
    { char: '♦', name: 'Black Diamond Suit', code: 'U+2666' },
    { char: '✓', name: 'Check Mark', code: 'U+2713' },
    { char: '✗', name: 'Ballot X', code: 'U+2717' },
    { char: '∞', name: 'Infinity', code: 'U+221E' },
    { char: '≠', name: 'Not Equal To', code: 'U+2260' },
  ];

  const filteredChars = commonUnicodeChars.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.char.includes(searchTerm) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = async (content: string) => {
    if (content) {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard successfully.",
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

  const clearAll = () => {
    setText('');
    setUnicodeResult('');
    setCharacterInput('');
    setCharacterInfo(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Unicode Character Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Analyze Unicode characters, convert text to Unicode code points, and explore character properties and encodings.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Free Tool</Badge>
              <Badge variant="secondary">Unicode Analysis</Badge>
              <Badge variant="secondary">Character Inspector</Badge>
            </div>
          </div>

          {/* Main Tool */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Unicode Character Converter & Analyzer</CardTitle>
              <CardDescription>
                Convert text to Unicode code points and analyze individual characters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="text-to-unicode" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text-to-unicode">Text to Unicode</TabsTrigger>
                  <TabsTrigger value="character-analyzer">Character Analyzer</TabsTrigger>
                  <TabsTrigger value="unicode-reference">Unicode Reference</TabsTrigger>
                </TabsList>
                
                <TabsContent value="text-to-unicode" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Input Text</label>
                        <Button variant="outline" size="sm" onClick={clearAll}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Clear
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Enter text to analyze Unicode characters..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="min-h-[300px] text-base"
                      />
                      <Button onClick={textToUnicode} className="w-full">
                        Convert to Unicode
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Unicode Code Points</label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(unicodeResult)}
                            disabled={!unicodeResult}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadText(unicodeResult, 'unicode-output.txt')}
                            disabled={!unicodeResult}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        placeholder="Unicode code points will appear here..."
                        value={unicodeResult}
                        readOnly
                        className="min-h-[300px] text-base bg-gray-50 font-mono text-sm"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="character-analyzer" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-sm font-medium">Character to Analyze</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter a single character..."
                          value={characterInput}
                          onChange={(e) => setCharacterInput(e.target.value)}
                          className="text-2xl text-center"
                          maxLength={2}
                        />
                        <Button onClick={analyzeCharacter}>
                          Analyze
                        </Button>
                      </div>
                    </div>

                    {characterInfo && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Character Information</h3>
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium">Character:</p>
                              <p className="text-2xl bg-gray-50 p-2 rounded text-center">{characterInfo.character}</p>
                            </div>
                            <div>
                              <p className="font-medium">Code Point:</p>
                              <p className="bg-gray-50 p-2 rounded font-mono">{characterInfo.codePoint}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">Unicode Notation:</span>
                              <code className="bg-gray-100 px-2 py-1 rounded">{characterInfo.unicodeNotation}</code>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Hex Code:</span>
                              <code className="bg-gray-100 px-2 py-1 rounded">{characterInfo.hexCode}</code>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">HTML Entity:</span>
                              <code className="bg-gray-100 px-2 py-1 rounded">{characterInfo.htmlEntity}</code>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">HTML Hex:</span>
                              <code className="bg-gray-100 px-2 py-1 rounded">{characterInfo.htmlHex}</code>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">CSS Code:</span>
                              <code className="bg-gray-100 px-2 py-1 rounded">{characterInfo.cssCode}</code>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">JavaScript:</span>
                              <code className="bg-gray-100 px-2 py-1 rounded">{characterInfo.javascriptCode}</code>
                            </div>
                          </div>

                          <div className="pt-2 border-t">
                            <div className="flex justify-between">
                              <span className="font-medium">Category:</span>
                              <span>{characterInfo.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Block:</span>
                              <span>{characterInfo.block}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="unicode-reference" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      <Input
                        placeholder="Search characters..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredChars.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{item.char}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(item.char)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600 font-mono">{item.code}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Article Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Understanding Unicode</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p>
                    Unicode is a computing standard that assigns a unique number to every character, regardless of platform, 
                    device, application, or language. It covers all characters for all the writing systems of the world, 
                    modern and ancient, including technical symbols and emojis.
                  </p>
                  <p>
                    Each Unicode character has a code point, typically represented as U+ABCD where ABCD is a hexadecimal number. 
                    Our tool helps you analyze these code points and understand how characters are encoded in different formats.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Use the Unicode Converter</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <h4 className="font-semibold">Text to Unicode:</h4>
                  <ol>
                    <li>Enter your text in the input field</li>
                    <li>Click "Convert to Unicode" to see code points</li>
                    <li>Each character will show its Unicode notation and decimal value</li>
                  </ol>
                  
                  <h4 className="font-semibold mt-4">Character Analyzer:</h4>
                  <ol>
                    <li>Enter a single character in the analyzer</li>
                    <li>Click "Analyze" to see detailed information</li>
                    <li>View various encoding formats and character properties</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Character Encoding Formats</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Unicode Notation:</strong> Standard U+ABCD format</li>
                    <li><strong>HTML Entity:</strong> Decimal format for HTML (&amp;#1234;)</li>
                    <li><strong>HTML Hex:</strong> Hexadecimal format for HTML (&amp;#xABCD;)</li>
                    <li><strong>CSS Code:</strong> Escape sequence for CSS (\\ABCD)</li>
                    <li><strong>JavaScript:</strong> Unicode escape for JavaScript (\\u{ABCD})</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Unicode Ranges</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div>
                    <p className="font-semibold">Basic Latin (ASCII)</p>
                    <p className="text-gray-600">U+0000 - U+007F</p>
                  </div>
                  <div>
                    <p className="font-semibold">Latin-1 Supplement</p>
                    <p className="text-gray-600">U+0080 - U+00FF</p>
                  </div>
                  <div>
                    <p className="font-semibold">Greek and Coptic</p>
                    <p className="text-gray-600">U+0370 - U+03FF</p>
                  </div>
                  <div>
                    <p className="font-semibold">CJK Unified Ideographs</p>
                    <p className="text-gray-600">U+4E00 - U+9FFF</p>
                  </div>
                  <div>
                    <p className="font-semibold">Emoticons</p>
                    <p className="text-gray-600">U+1F600 - U+1F64F</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Q: What's the difference between UTF-8 and Unicode?</h4>
                    <p className="text-sm text-gray-600">
                      Unicode defines the characters and their code points, while UTF-8 is an encoding that represents Unicode characters as bytes.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: Can I analyze emojis?</h4>
                    <p className="text-sm text-gray-600">
                      Yes! The tool can analyze emojis and other Unicode symbols, showing their code points and properties.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: How do I use these codes in my code?</h4>
                    <p className="text-sm text-gray-600">
                      Use the appropriate format for your language: \\u{ABCD} for JavaScript, \\ABCD for CSS, or &amp;#1234; for HTML.
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

export default UnicodeCharacterConverter;
