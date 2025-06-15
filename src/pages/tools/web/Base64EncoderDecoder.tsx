
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowUpDown, Copy, Download, FileText, RotateCcw, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Base64EncoderDecoder = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [urlSafe, setUrlSafe] = useState(false);
  const [lineBreaks, setLineBreaks] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const encodeBase64 = (text: string) => {
    try {
      let encoded = btoa(unescape(encodeURIComponent(text)));
      
      if (urlSafe) {
        encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      }
      
      if (lineBreaks && encoded.length > 76) {
        encoded = encoded.match(/.{1,76}/g)?.join('\n') || encoded;
      }
      
      return encoded;
    } catch (error) {
      throw new Error('Failed to encode text. Please check your input.');
    }
  };

  const decodeBase64 = (text: string) => {
    try {
      let cleanText = text.replace(/\s/g, '');
      
      if (urlSafe) {
        cleanText = cleanText.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding if needed
        while (cleanText.length % 4) {
          cleanText += '=';
        }
      }
      
      return decodeURIComponent(escape(atob(cleanText)));
    } catch (error) {
      throw new Error('Invalid Base64 string. Please check your input.');
    }
  };

  const processText = () => {
    try {
      if (!inputText.trim()) {
        toast({
          title: "Input Required",
          description: "Please enter text to process.",
          variant: "destructive",
        });
        return;
      }

      const result = mode === 'encode' 
        ? encodeBase64(inputText)
        : decodeBase64(inputText);
      
      setOutputText(result);
      
      toast({
        title: `Text ${mode === 'encode' ? 'Encoded' : 'Decoded'}`,
        description: `Successfully ${mode === 'encode' ? 'encoded' : 'decoded'} your text.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Processing failed';
      toast({
        title: "Processing Error",
        description: message,
        variant: "destructive",
      });
      setOutputText('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    
    if (mode === 'encode') {
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (file.type.startsWith('text/')) {
          setInputText(result);
        } else {
          // For binary files, convert to base64 directly
          const base64 = result.split(',')[1];
          setOutputText(base64);
          toast({
            title: "File Encoded",
            description: "Binary file has been encoded to Base64.",
          });
        }
      };
      
      if (file.type.startsWith('text/')) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    } else {
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setInputText(result);
      };
      reader.readAsText(file);
    }
  };

  const copyToClipboard = async () => {
    if (!outputText) {
      toast({
        title: "Nothing to Copy",
        description: "Please process text first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: "Copied!",
        description: "Output copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadOutput = () => {
    if (!outputText) {
      toast({
        title: "Nothing to Download",
        description: "Please process text first.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Output file has been downloaded.",
    });
  };

  const swapInputOutput = () => {
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
    setMode(mode === 'encode' ? 'decode' : 'encode');
    
    toast({
      title: "Swapped",
      description: "Input and output have been swapped.",
    });
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setUploadedFile(null);
  };

  const insertSampleText = () => {
    if (mode === 'encode') {
      setInputText('Hello, World! This is a sample text for Base64 encoding. 🌟');
    } else {
      setInputText('SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgc2FtcGxlIHRleHQgZm9yIEJhc2U2NCBlbmNvZGluZy4g8J+MnA==');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Base64 Encoder/Decoder
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Encode and decode text or files using Base64 encoding with URL-safe and standard formats.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Text Encoding</Badge>
              <Badge variant="secondary">File Support</Badge>
              <Badge variant="secondary">URL Safe</Badge>
              <Badge variant="secondary">Binary Files</Badge>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Tabs value={mode} onValueChange={(value) => setMode(value as 'encode' | 'decode')} className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="encode">Encode</TabsTrigger>
                <TabsTrigger value="decode">Decode</TabsTrigger>
              </TabsList>

              <TabsContent value="encode" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Encode to Base64</CardTitle>
                    <CardDescription>
                      Convert text or files to Base64 encoded format
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label htmlFor="file-upload">Upload File (Optional)</Label>
                      <Input
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                      {uploadedFile && (
                        <div className="text-sm text-gray-600">
                          Selected: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="input-text">Input Text</Label>
                      <Textarea
                        id="input-text"
                        placeholder="Enter text to encode..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="url-safe"
                          checked={urlSafe}
                          onCheckedChange={setUrlSafe}
                        />
                        <Label htmlFor="url-safe">URL Safe Encoding</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="line-breaks"
                          checked={lineBreaks}
                          onCheckedChange={setLineBreaks}
                        />
                        <Label htmlFor="line-breaks">Insert Line Breaks</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="decode" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Decode from Base64</CardTitle>
                    <CardDescription>
                      Convert Base64 encoded text back to original format
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label htmlFor="file-upload-decode">Upload Base64 File (Optional)</Label>
                      <Input
                        id="file-upload-decode"
                        type="file"
                        accept=".txt,.b64"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                      {uploadedFile && (
                        <div className="text-sm text-gray-600">
                          Selected: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="input-base64">Base64 Input</Label>
                      <Textarea
                        id="input-base64"
                        placeholder="Enter Base64 encoded text..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="url-safe-decode"
                        checked={urlSafe}
                        onCheckedChange={setUrlSafe}
                      />
                      <Label htmlFor="url-safe-decode">URL Safe Decoding</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 flex-wrap mb-8">
              <Button onClick={processText} className="flex-1">
                {mode === 'encode' ? 'Encode' : 'Decode'}
              </Button>
              <Button variant="outline" onClick={swapInputOutput}>
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Swap
              </Button>
              <Button variant="outline" onClick={insertSampleText}>
                <FileText className="h-4 w-4 mr-2" />
                Sample
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Output
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadOutput}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  {mode === 'encode' ? 'Base64 encoded result' : 'Decoded text result'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[200px]">
                  {outputText ? (
                    <div className="space-y-4">
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                          {outputText}
                        </pre>
                      </div>
                      <div className="text-sm text-gray-600">
                        Characters: {outputText.length} | 
                        Size: {new Blob([outputText]).size} bytes
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <ArrowUpDown className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Click "{mode === 'encode' ? 'Encode' : 'Decode'}" to process your text</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Base64 Features</CardTitle>
                  <CardDescription>What this tool offers</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Text and file encoding/decoding</li>
                    <li>• URL-safe Base64 format</li>
                    <li>• Automatic line breaking</li>
                    <li>• Binary file support</li>
                    <li>• Large file handling (up to 10MB)</li>
                    <li>• Error detection and validation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Use Cases</CardTitle>
                  <CardDescription>Common applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Email attachment encoding</li>
                    <li>• Image data embedding</li>
                    <li>• API data transmission</li>
                    <li>• Configuration file encoding</li>
                    <li>• URL parameter encoding</li>
                    <li>• Binary data storage</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Format Information</CardTitle>
                  <CardDescription>Base64 details</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Uses A-Z, a-z, 0-9, +, /</li>
                    <li>• URL-safe uses -, _ instead</li>
                    <li>• Padding with = characters</li>
                    <li>• 33% size increase from original</li>
                    <li>• Binary-safe encoding</li>
                    <li>• Widely supported standard</li>
                  </ul>
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

export default Base64EncoderDecoder;
