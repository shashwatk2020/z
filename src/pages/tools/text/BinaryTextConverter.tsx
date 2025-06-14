
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, Upload, RotateCcw, ArrowLeftRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BinaryTextConverter = () => {
  const [textInput, setTextInput] = useState('');
  const [binaryInput, setBinaryInput] = useState('');
  const [textResult, setTextResult] = useState('');
  const [binaryResult, setBinaryResult] = useState('');
  const { toast } = useToast();

  const textToBinary = () => {
    try {
      const binary = textInput
        .split('')
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ');
      setBinaryResult(binary);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert text to binary.",
        variant: "destructive",
      });
    }
  };

  const binaryToText = () => {
    try {
      const binaryArray = binaryInput.replace(/\s/g, '').match(/.{1,8}/g);
      if (!binaryArray) {
        throw new Error('Invalid binary format');
      }
      
      const text = binaryArray
        .map(binary => {
          const decimal = parseInt(binary, 2);
          if (isNaN(decimal) || decimal > 255) {
            throw new Error('Invalid binary value');
          }
          return String.fromCharCode(decimal);
        })
        .join('');
      
      setTextResult(text);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid binary format. Please enter valid 8-bit binary values.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    if (text) {
      await navigator.clipboard.writeText(text);
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
    setTextInput('');
    setBinaryInput('');
    setTextResult('');
    setBinaryResult('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Binary ⇄ Text Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Convert text to binary code and binary code back to text. Perfect for encoding and decoding binary data.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Free Tool</Badge>
              <Badge variant="secondary">Bidirectional</Badge>
              <Badge variant="secondary">Instant Conversion</Badge>
            </div>
          </div>

          {/* Main Tool */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <ArrowLeftRight className="h-6 w-6" />
                Binary Text Converter
              </CardTitle>
              <CardDescription>
                Convert between text and binary representation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="text-to-binary" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text-to-binary">Text to Binary</TabsTrigger>
                  <TabsTrigger value="binary-to-text">Binary to Text</TabsTrigger>
                </TabsList>
                
                <TabsContent value="text-to-binary" className="space-y-6">
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
                        placeholder="Enter text to convert to binary..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="min-h-[300px] text-base"
                      />
                      <Button onClick={textToBinary} className="w-full">
                        Convert to Binary
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Binary Result</label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(binaryResult)}
                            disabled={!binaryResult}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadText(binaryResult, 'binary-output.txt')}
                            disabled={!binaryResult}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        placeholder="Binary representation will appear here..."
                        value={binaryResult}
                        readOnly
                        className="min-h-[300px] text-base bg-gray-50 font-mono"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="binary-to-text" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Input Binary</label>
                        <Button variant="outline" size="sm" onClick={clearAll}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Clear
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Enter binary code (e.g., 01001000 01100101 01101100 01101100 01101111)..."
                        value={binaryInput}
                        onChange={(e) => setBinaryInput(e.target.value)}
                        className="min-h-[300px] text-base font-mono"
                      />
                      <Button onClick={binaryToText} className="w-full">
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
                            onClick={() => copyToClipboard(textResult)}
                            disabled={!textResult}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadText(textResult, 'text-output.txt')}
                            disabled={!textResult}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        placeholder="Decoded text will appear here..."
                        value={textResult}
                        readOnly
                        className="min-h-[300px] text-base bg-gray-50"
                      />
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
                  <CardTitle>Understanding Binary and Text Conversion</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p>
                    Binary is the fundamental number system used by computers, consisting of only two digits: 0 and 1. 
                    Every character in text is represented by a unique combination of these binary digits (bits). 
                    Standard ASCII characters use 8 bits (1 byte) each.
                  </p>
                  <p>
                    Our binary-text converter uses ASCII encoding, where each character is represented by an 8-bit binary number. 
                    For example, the letter 'A' is represented as 01000001 in binary (decimal 65).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Use the Binary Text Converter</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <h4 className="font-semibold">Text to Binary:</h4>
                  <ol>
                    <li>Select the "Text to Binary" tab</li>
                    <li>Enter your text in the input field</li>
                    <li>Click "Convert to Binary" to see the binary representation</li>
                    <li>Copy or download the binary result</li>
                  </ol>
                  
                  <h4 className="font-semibold mt-4">Binary to Text:</h4>
                  <ol>
                    <li>Select the "Binary to Text" tab</li>
                    <li>Enter binary code (8-bit groups, spaces optional)</li>
                    <li>Click "Convert to Text" to decode the binary</li>
                    <li>Copy or download the decoded text</li>
                  </ol>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Example Conversions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm">Text: "Hello"</h4>
                    <p className="text-xs bg-gray-50 p-2 rounded font-mono">
                      01001000 01100101 01101100 01101100 01101111
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Binary: "01000001"</h4>
                    <p className="text-xs bg-green-50 p-2 rounded">
                      Text: "A"
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Q: What format should binary input be in?</h4>
                    <p className="text-sm text-gray-600">
                      Enter 8-bit binary groups separated by spaces. The tool also accepts continuous binary strings.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: Does this support Unicode characters?</h4>
                    <p className="text-sm text-gray-600">
                      This tool uses ASCII encoding for standard characters (0-255). Unicode characters may not convert correctly.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: Why do I get an error message?</h4>
                    <p className="text-sm text-gray-600">
                      Errors occur when binary input contains invalid characters or isn't properly formatted as 8-bit groups.
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

export default BinaryTextConverter;
