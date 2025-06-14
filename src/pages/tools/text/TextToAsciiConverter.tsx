
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Upload, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TextToAsciiConverter = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const convertToAscii = () => {
    try {
      const ascii = text
        .split('')
        .map(char => char.charCodeAt(0))
        .join(' ');
      setResult(ascii);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert text to ASCII.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      toast({
        title: "Copied!",
        description: "ASCII codes copied to clipboard successfully.",
      });
    }
  };

  const downloadText = () => {
    if (result) {
      const blob = new Blob([result], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ascii-output.txt';
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
    setResult('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Text to ASCII Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Convert any text to its ASCII decimal values. Get the numerical representation of each character in your text.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Free Tool</Badge>
              <Badge variant="secondary">ASCII Table</Badge>
              <Badge variant="secondary">Decimal Values</Badge>
            </div>
          </div>

          {/* Main Tool */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Text to ASCII Converter</CardTitle>
              <CardDescription>
                Enter your text below to convert it to ASCII decimal values
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        Clear
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Type or paste your text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[300px] text-base"
                  />
                  <Button onClick={convertToAscii} className="w-full">
                    Convert to ASCII
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">ASCII Result</label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        disabled={!result}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadText}
                        disabled={!result}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="ASCII decimal values will appear here..."
                    value={result}
                    readOnly
                    className="min-h-[300px] text-base bg-gray-50 font-mono"
                  />
                  {result && (
                    <div className="text-sm text-gray-600">
                      <p>Characters: {text.length} | ASCII values: {result.split(' ').length}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ASCII Table Reference */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Common ASCII Values Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">Control Characters</h4>
                  <div className="space-y-1 text-xs">
                    <p>NULL: 0</p>
                    <p>TAB: 9</p>
                    <p>LF: 10</p>
                    <p>CR: 13</p>
                    <p>ESC: 27</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Special Characters</h4>
                  <div className="space-y-1 text-xs">
                    <p>Space: 32</p>
                    <p>!: 33</p>
                    <p>": 34</p>
                    <p>#: 35</p>
                    <p>$: 36</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Numbers</h4>
                  <div className="space-y-1 text-xs">
                    <p>0: 48</p>
                    <p>1: 49</p>
                    <p>2: 50</p>
                    <p>...: ...</p>
                    <p>9: 57</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Letters</h4>
                  <div className="space-y-1 text-xs">
                    <p>A: 65</p>
                    <p>B: 66</p>
                    <p>...: ...</p>
                    <p>Z: 90</p>
                    <p>a: 97</p>
                    <p>z: 122</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>What is ASCII?</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p>
                    ASCII (American Standard Code for Information Interchange) is a character encoding standard 
                    that assigns unique numerical values to characters. Each character, including letters, numbers, 
                    punctuation marks, and control characters, has a corresponding ASCII value ranging from 0 to 127.
                  </p>
                  <p>
                    ASCII is fundamental to computing and data processing, as it provides a standard way to represent 
                    text in computers and communication equipment. Understanding ASCII values is essential for 
                    programming, data analysis, and debugging text-related issues.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Use the Text to ASCII Converter</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <ol>
                    <li><strong>Input Text:</strong> Type or paste your text into the input area, or upload a text file.</li>
                    <li><strong>Convert:</strong> Click the "Convert to ASCII" button to process your text.</li>
                    <li><strong>View Results:</strong> Each character will be converted to its corresponding ASCII decimal value.</li>
                    <li><strong>Analyze:</strong> Use the ASCII values for programming, debugging, or data analysis.</li>
                    <li><strong>Export:</strong> Copy the results to clipboard or download as a text file.</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Applications and Use Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Programming:</strong> Character manipulation and string processing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Debugging:</strong> Identifying hidden or special characters in text</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Data Analysis:</strong> Analyzing character patterns and frequencies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Encryption:</strong> Simple character-based encoding schemes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Education:</strong> Learning about character encoding and computer science fundamentals</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Input Text:</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded border">
                        Hello!
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">ASCII Values:</h4>
                      <p className="text-sm bg-blue-50 p-3 rounded border border-blue-200 font-mono">
                        72 101 108 108 111 33
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>H = 72, e = 101, l = 108</p>
                      <p>l = 108, o = 111, ! = 33</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Q: What's the difference between ASCII and Unicode?</h4>
                    <p className="text-sm text-gray-600">
                      ASCII uses 7 bits and supports 128 characters (0-127), while Unicode supports millions of characters for international text.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: Can I convert ASCII values back to text?</h4>
                    <p className="text-sm text-gray-600">
                      Yes, use our "ASCII to Text Converter" tool to convert ASCII decimal values back to readable text.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: What happens with non-ASCII characters?</h4>
                    <p className="text-sm text-gray-600">
                      Non-ASCII characters will show their Unicode code point values, which may be higher than 127.
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

export default TextToAsciiConverter;
