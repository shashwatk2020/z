
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Upload, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AsciiToTextConverter = () => {
  const [ascii, setAscii] = useState('');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const convertAsciiToText = () => {
    try {
      // Split by spaces, commas, or any whitespace and filter out empty strings
      const asciiValues = ascii.split(/[\s,]+/).filter(val => val.trim() !== '');
      
      if (asciiValues.length === 0) {
        throw new Error('Please enter ASCII values');
      }
      
      const text = asciiValues.map(value => {
        const num = parseInt(value.trim(), 10);
        if (isNaN(num)) {
          throw new Error(`Invalid ASCII value: ${value}`);
        }
        if (num < 0 || num > 1114111) { // Extended to support Unicode
          throw new Error(`ASCII value out of range: ${num}`);
        }
        return String.fromCharCode(num);
      }).join('');
      
      setResult(text);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to convert ASCII to text.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard successfully.",
      });
    }
  };

  const downloadText = () => {
    if (result) {
      const blob = new Blob([result], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'text-output.txt';
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
        setAscii(content);
      };
      reader.readAsText(file);
    }
  };

  const clearAll = () => {
    setAscii('');
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
              ASCII to Text Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Convert ASCII decimal values back to readable text. Decode ASCII codes to reveal the original text content.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Free Tool</Badge>
              <Badge variant="secondary">ASCII Decoding</Badge>
              <Badge variant="secondary">Error Validation</Badge>
            </div>
          </div>

          {/* Main Tool */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">ASCII to Text Converter</CardTitle>
              <CardDescription>
                Enter ASCII decimal values to convert them back to readable text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Input ASCII Values</label>
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
                    placeholder="Enter ASCII values separated by spaces or commas (e.g., 72 101 108 108 111)..."
                    value={ascii}
                    onChange={(e) => setAscii(e.target.value)}
                    className="min-h-[300px] text-base font-mono"
                  />
                  <div className="text-sm text-gray-600">
                    <p>Supported formats:</p>
                    <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                      <li>Space separated: 72 101 108 108 111</li>
                      <li>Comma separated: 72,101,108,108,111</li>
                      <li>Mixed: 72, 101 108, 108 111</li>
                    </ul>
                  </div>
                  <Button onClick={convertAsciiToText} className="w-full">
                    Convert to Text
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Text Result</label>
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
                    placeholder="Decoded text will appear here..."
                    value={result}
                    readOnly
                    className="min-h-[300px] text-base bg-gray-50"
                  />
                  {result && (
                    <div className="text-sm text-gray-600">
                      <p>Characters decoded: {result.length}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Understanding ASCII to Text Conversion</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p>
                    ASCII to text conversion is the process of decoding ASCII decimal values back into their 
                    corresponding characters. Each number represents a specific character according to the 
                    ASCII (American Standard Code for Information Interchange) standard.
                  </p>
                  <p>
                    Our converter supports flexible input formats and provides clear error messages for invalid 
                    values. It can handle standard ASCII values (0-127) as well as extended Unicode values for 
                    broader character support.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Use the ASCII to Text Converter</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <ol>
                    <li><strong>Input ASCII Values:</strong> Enter ASCII decimal values in the input field. You can separate them with spaces, commas, or a combination of both.</li>
                    <li><strong>Validate Input:</strong> The tool will validate each value and show specific error messages for invalid entries.</li>
                    <li><strong>Convert:</strong> Click "Convert to Text" to decode the ASCII values.</li>
                    <li><strong>View Results:</strong> The decoded text will appear in the result area.</li>
                    <li><strong>Export:</strong> Copy the result to clipboard or download as a text file.</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supported Value Ranges</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span><strong>Standard ASCII (0-127):</strong> Basic English characters, numbers, and symbols</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span><strong>Extended ASCII (128-255):</strong> Additional characters and symbols</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span><strong>Unicode (256+):</strong> International characters and emojis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">ℹ</span>
                      <span><strong>Control Characters (0-31):</strong> May not display visibly but are valid</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common ASCII Value Ranges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Characters & Ranges</h4>
                      <ul className="space-y-1 text-xs">
                        <li>Control characters: 0-31</li>
                        <li>Space & punctuation: 32-47</li>
                        <li>Numbers (0-9): 48-57</li>
                        <li>Uppercase letters (A-Z): 65-90</li>
                        <li>Lowercase letters (a-z): 97-122</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Special Characters</h4>
                      <ul className="space-y-1 text-xs">
                        <li>Space: 32</li>
                        <li>Exclamation (!): 33</li>
                        <li>At symbol (@): 64</li>
                        <li>Backslash (\): 92</li>
                        <li>Tilde (~): 126</li>
                      </ul>
                    </div>
                  </div>
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
                      <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Input ASCII:</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded border font-mono">
                        72 101 108 108 111 44 32 87 111 114 108 100 33
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Decoded Text:</h4>
                      <p className="text-sm bg-green-50 p-3 rounded border border-green-200">
                        Hello, World!
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>72=H, 101=e, 108=l, 108=l, 111=o</p>
                      <p>44=comma, 32=space, 33=!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Error Handling</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-semibold text-red-600">Invalid ASCII value</p>
                    <p className="text-gray-600">Non-numeric or out of range values</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-red-600">Empty input</p>
                    <p className="text-gray-600">Enter at least one ASCII value</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-green-600">Auto-filtering</p>
                    <p className="text-gray-600">Empty values are automatically ignored</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Q: Why don't I see some characters in the result?</h4>
                    <p className="text-sm text-gray-600">
                      Control characters (0-31) may not display visibly but are still valid and present in the text.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: Can I mix different number formats?</h4>
                    <p className="text-sm text-gray-600">
                      Yes, you can use spaces, commas, or both to separate ASCII values. The tool handles mixed formats automatically.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: What's the maximum ASCII value supported?</h4>
                    <p className="text-sm text-gray-600">
                      The tool supports values up to 1,114,111 to include the full Unicode range.
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

export default AsciiToTextConverter;
