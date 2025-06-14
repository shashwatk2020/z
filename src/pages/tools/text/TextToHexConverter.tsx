
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Upload, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TextToHexConverter = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const convertToHex = () => {
    try {
      const hex = text
        .split('')
        .map(char => char.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase())
        .join(' ');
      setResult(hex);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert text to hexadecimal.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      toast({
        title: "Copied!",
        description: "Hexadecimal code copied to clipboard successfully.",
      });
    }
  };

  const downloadText = () => {
    if (result) {
      const blob = new Blob([result], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hex-output.txt';
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
              Text to Hex Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Convert any text to its hexadecimal representation. Perfect for encoding text data into hex format for programming and data processing.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Free Tool</Badge>
              <Badge variant="secondary">ASCII Encoding</Badge>
              <Badge variant="secondary">Instant Results</Badge>
            </div>
          </div>

          {/* Main Tool */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Text to Hexadecimal Converter</CardTitle>
              <CardDescription>
                Enter your text below to convert it to hexadecimal format
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
                  <Button onClick={convertToHex} className="w-full">
                    Convert to Hexadecimal
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Hexadecimal Result</label>
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
                    placeholder="Hexadecimal representation will appear here..."
                    value={result}
                    readOnly
                    className="min-h-[300px] text-base bg-gray-50 font-mono"
                  />
                  {result && (
                    <div className="text-sm text-gray-600">
                      <p>Characters: {text.length} | Hex pairs: {result.split(' ').length}</p>
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
                  <CardTitle>What is Hexadecimal?</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p>
                    Hexadecimal (hex) is a base-16 number system that uses 16 distinct symbols: 0-9 and A-F. 
                    In computing, hexadecimal is widely used because it provides a more human-friendly representation 
                    of binary data. Each hex digit represents exactly four binary digits (bits).
                  </p>
                  <p>
                    When converting text to hex, each character is converted to its ASCII value, which is then 
                    represented in hexadecimal format. For example, the letter 'A' has an ASCII value of 65, 
                    which is represented as '41' in hexadecimal.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Use the Text to Hex Converter</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <ol>
                    <li><strong>Input Text:</strong> Type or paste your text into the input area, or upload a text file using the upload button.</li>
                    <li><strong>Convert:</strong> Click the "Convert to Hexadecimal" button to process your text.</li>
                    <li><strong>View Results:</strong> The hexadecimal representation will appear in the result area, with each character represented as a two-digit hex value.</li>
                    <li><strong>Copy or Download:</strong> Use the copy button to copy the hex data to your clipboard, or download it as a text file.</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Use Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Programming:</strong> Encoding text data for low-level programming and debugging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Data Analysis:</strong> Examining binary file contents in a readable format</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Security:</strong> Converting passwords or sensitive data for secure storage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Web Development:</strong> URL encoding and color code generation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Database Storage:</strong> Storing binary data in text-based databases</span>
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
                      <p className="text-sm bg-gray-50 p-3 rounded border font-mono">
                        Hello
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Hexadecimal Output:</h4>
                      <p className="text-sm bg-blue-50 p-3 rounded border border-blue-200 font-mono">
                        48 65 6C 6C 6F
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>H = 72 (decimal) = 48 (hex)</p>
                      <p>e = 101 (decimal) = 65 (hex)</p>
                      <p>l = 108 (decimal) = 6C (hex)</p>
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
                    <h4 className="font-semibold">Q: What character encoding is used?</h4>
                    <p className="text-sm text-gray-600">
                      The tool uses ASCII encoding, which covers standard English characters, numbers, and symbols (0-127).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: Can I convert special characters?</h4>
                    <p className="text-sm text-gray-600">
                      Yes, the tool can convert any character that has an ASCII representation, including spaces, punctuation, and special symbols.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: How do I convert hex back to text?</h4>
                    <p className="text-sm text-gray-600">
                      Use our companion "Hex to Text Converter" tool to convert hexadecimal data back to readable text.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: Is there a character limit?</h4>
                    <p className="text-sm text-gray-600">
                      No, there are no artificial limits on the amount of text you can convert.
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

export default TextToHexConverter;
