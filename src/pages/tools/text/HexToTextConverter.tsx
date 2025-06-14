
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Upload, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HexToTextConverter = () => {
  const [hex, setHex] = useState('');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const convertHexToText = () => {
    try {
      // Remove spaces and validate hex format
      const cleanHex = hex.replace(/\s/g, '');
      
      if (cleanHex.length % 2 !== 0) {
        throw new Error('Invalid hex format: odd number of characters');
      }
      
      if (!/^[0-9A-Fa-f]*$/.test(cleanHex)) {
        throw new Error('Invalid hex format: contains non-hexadecimal characters');
      }
      
      const hexPairs = cleanHex.match(/.{2}/g);
      if (!hexPairs) {
        throw new Error('Invalid hex format');
      }
      
      const text = hexPairs
        .map(hex => {
          const decimal = parseInt(hex, 16);
          return String.fromCharCode(decimal);
        })
        .join('');
      
      setResult(text);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to convert hexadecimal to text.",
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
        setHex(content);
      };
      reader.readAsText(file);
    }
  };

  const clearAll = () => {
    setHex('');
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
              Hex to Text Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Convert hexadecimal data back to readable text. Decode hex-encoded strings and view the original text content.
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
              <CardTitle className="text-2xl">Hexadecimal to Text Converter</CardTitle>
              <CardDescription>
                Enter hexadecimal data to convert it back to readable text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Input Hexadecimal</label>
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
                    placeholder="Enter hexadecimal data here (e.g., 48 65 6C 6C 6F or 48656C6C6F)..."
                    value={hex}
                    onChange={(e) => setHex(e.target.value)}
                    className="min-h-[300px] text-base font-mono"
                  />
                  <div className="text-sm text-gray-600">
                    <p>Supported formats:</p>
                    <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                      <li>Spaced: 48 65 6C 6C 6F</li>
                      <li>Continuous: 48656C6C6F</li>
                    </ul>
                  </div>
                  <Button onClick={convertHexToText} className="w-full">
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
                  <CardTitle>Understanding Hexadecimal to Text Conversion</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p>
                    Hexadecimal to text conversion is the reverse process of text to hex encoding. Each pair of 
                    hexadecimal digits represents one character in ASCII format. This process is essential for 
                    decoding hex-encoded data back into human-readable text.
                  </p>
                  <p>
                    Our converter automatically handles different hex formats, whether your data is spaced 
                    (48 65 6C 6C 6F) or continuous (48656C6C6F), and provides clear error messages for 
                    invalid input formats.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Use the Hex to Text Converter</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <ol>
                    <li><strong>Input Hex Data:</strong> Paste your hexadecimal data into the input field. You can use spaced or continuous format.</li>
                    <li><strong>Validate Format:</strong> The tool will automatically validate your hex data and show errors if the format is invalid.</li>
                    <li><strong>Convert:</strong> Click "Convert to Text" to decode the hexadecimal data.</li>
                    <li><strong>View Results:</strong> The decoded text will appear in the result area.</li>
                    <li><strong>Export:</strong> Copy the result to clipboard or download as a text file.</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Input Format Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span><strong>Valid characters:</strong> 0-9, A-F, a-f (case insensitive)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span><strong>Even length:</strong> Hex data must have an even number of characters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span><strong>Flexible spacing:</strong> Spaces between hex pairs are optional</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">✗</span>
                      <span><strong>Invalid:</strong> Non-hex characters, odd-length strings</span>
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
                      <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Input Hex:</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded border font-mono">
                        48 65 6C 6C 6F 20 57 6F 72 6C 64 21
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Decoded Text:</h4>
                      <p className="text-sm bg-green-50 p-3 rounded border border-green-200">
                        Hello World!
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>48 = H, 65 = e, 6C = l</p>
                      <p>20 = space, 21 = !</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Errors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-semibold text-red-600">Odd number of characters</p>
                    <p className="text-gray-600">Ensure hex data has even length (pairs)</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-red-600">Invalid hex characters</p>
                    <p className="text-gray-600">Only use 0-9 and A-F characters</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-red-600">Empty input</p>
                    <p className="text-gray-600">Enter valid hexadecimal data first</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Q: Can I convert large hex files?</h4>
                    <p className="text-sm text-gray-600">
                      Yes, the tool can handle large hex data, though very large files may take a moment to process.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: What if the result shows strange characters?</h4>
                    <p className="text-sm text-gray-600">
                      This may indicate the hex data represents binary data rather than text, or uses a different encoding.
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

export default HexToTextConverter;
