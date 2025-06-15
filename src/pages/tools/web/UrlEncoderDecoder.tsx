
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowUpDown, Copy, Download, FileText, RotateCcw, Link, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UrlEncoderDecoder = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeSpaces, setEncodeSpaces] = useState(true);
  const [strictEncoding, setStrictEncoding] = useState(false);
  const { toast } = useToast();

  const urlEncode = (text: string) => {
    try {
      if (strictEncoding) {
        // Encode all characters except unreserved ones (A-Z a-z 0-9 - . _ ~)
        return text.replace(/[^A-Za-z0-9\-_.~]/g, (char) => {
          return '%' + char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
        });
      } else {
        // Standard URL encoding
        let encoded = encodeURIComponent(text);
        
        if (!encodeSpaces) {
          // Replace %20 with + for form-style encoding
          encoded = encoded.replace(/%20/g, '+');
        }
        
        return encoded;
      }
    } catch (error) {
      throw new Error('Failed to encode URL. Please check your input.');
    }
  };

  const urlDecode = (text: string) => {
    try {
      // Replace + with %20 if spaces were encoded as +
      let processedText = text.replace(/\+/g, '%20');
      
      return decodeURIComponent(processedText);
    } catch (error) {
      throw new Error('Invalid URL encoded string. Please check your input.');
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
        ? urlEncode(inputText)
        : urlDecode(inputText);
      
      setOutputText(result);
      
      toast({
        title: `URL ${mode === 'encode' ? 'Encoded' : 'Decoded'}`,
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

  const analyzeUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      const analysis = {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port,
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        parameters: Array.from(params.entries())
      };
      
      return analysis;
    } catch (error) {
      return null;
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
    a.download = mode === 'encode' ? 'url-encoded.txt' : 'url-decoded.txt';
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
  };

  const insertSampleText = () => {
    if (mode === 'encode') {
      setInputText('https://example.com/search?q=hello world&category=web tools&sort=date');
    } else {
      setInputText('https%3A//example.com/search%3Fq%3Dhello%20world%26category%3Dweb%20tools%26sort%3Ddate');
    }
  };

  const urlAnalysis = analyzeUrl(mode === 'decode' ? outputText : inputText);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              URL Encoder/Decoder
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Encode and decode URLs and query parameters with advanced options for web development and SEO.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">URL Encoding</Badge>
              <Badge variant="secondary">Query Parameters</Badge>
              <Badge variant="secondary">Form Data</Badge>
              <Badge variant="secondary">URL Analysis</Badge>
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
                    <CardTitle className="flex items-center gap-2">
                      <Link className="h-5 w-5" />
                      URL Encode
                    </CardTitle>
                    <CardDescription>
                      Convert text to URL-safe encoded format
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="input-url">Input Text/URL</Label>
                      <Textarea
                        id="input-url"
                        placeholder="Enter text or URL to encode..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="encode-spaces"
                          checked={encodeSpaces}
                          onCheckedChange={setEncodeSpaces}
                        />
                        <Label htmlFor="encode-spaces">Encode Spaces as %20</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="strict-encoding"
                          checked={strictEncoding}
                          onCheckedChange={setStrictEncoding}
                        />
                        <Label htmlFor="strict-encoding">Strict Encoding</Label>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <strong>Encoding Options:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• <strong>Spaces as %20:</strong> Standard URL encoding (unchecked uses + for form data)</li>
                        <li>• <strong>Strict Encoding:</strong> Encodes all characters except A-Z, a-z, 0-9, -, ., _, ~</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="decode" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      URL Decode
                    </CardTitle>
                    <CardDescription>
                      Convert URL-encoded text back to readable format
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="input-encoded">Encoded URL/Text</Label>
                      <Textarea
                        id="input-encoded"
                        placeholder="Enter URL-encoded text to decode..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </div>

                    <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                      <strong>Decoding Notes:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Automatically handles both %20 and + for spaces</li>
                        <li>• Supports all standard URL encoding patterns</li>
                        <li>• Validates encoding format during processing</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 flex-wrap mb-8">
              <Button onClick={processText} className="flex-1">
                {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    {mode === 'encode' ? 'URL encoded result' : 'Decoded text result'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[200px]">
                    {outputText ? (
                      <div className="space-y-4">
                        <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
                          <pre className="text-sm whitespace-pre-wrap font-mono">
                            {outputText}
                          </pre>
                        </div>
                        <div className="text-sm text-gray-600">
                          Characters: {outputText.length}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <Link className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>Click "{mode === 'encode' ? 'Encode URL' : 'Decode URL'}" to process</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {urlAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>URL Analysis</CardTitle>
                    <CardDescription>
                      Breakdown of URL components
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong>Protocol:</strong> {urlAnalysis.protocol}
                      </div>
                      <div>
                        <strong>Hostname:</strong> {urlAnalysis.hostname}
                      </div>
                      {urlAnalysis.port && (
                        <div>
                          <strong>Port:</strong> {urlAnalysis.port}
                        </div>
                      )}
                      <div>
                        <strong>Path:</strong> {urlAnalysis.pathname || '/'}
                      </div>
                      {urlAnalysis.search && (
                        <div>
                          <strong>Query String:</strong> {urlAnalysis.search}
                        </div>
                      )}
                      {urlAnalysis.hash && (
                        <div>
                          <strong>Fragment:</strong> {urlAnalysis.hash}
                        </div>
                      )}
                      
                      {urlAnalysis.parameters.length > 0 && (
                        <div>
                          <strong>Parameters:</strong>
                          <div className="mt-2 space-y-1 pl-4">
                            {urlAnalysis.parameters.map(([key, value], index) => (
                              <div key={index} className="text-xs bg-gray-100 p-2 rounded">
                                <strong>{key}:</strong> {value}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Encoding Features</CardTitle>
                  <CardDescription>Tool capabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Standard URL encoding/decoding</li>
                    <li>• Form data encoding (+ for spaces)</li>
                    <li>• Strict RFC 3986 compliance</li>
                    <li>• Query parameter handling</li>
                    <li>• URL component analysis</li>
                    <li>• Batch text processing</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Use Cases</CardTitle>
                  <CardDescription>When to use this tool</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• API endpoint construction</li>
                    <li>• Query parameter encoding</li>
                    <li>• Form data preparation</li>
                    <li>• SEO URL optimization</li>
                    <li>• Web scraping data prep</li>
                    <li>• Email link encoding</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reserved Characters</CardTitle>
                  <CardDescription>Characters that need encoding</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• <strong>Space:</strong> %20 or +</li>
                    <li>• <strong>&:</strong> %26</li>
                    <li>• <strong>=:</strong> %3D</li>
                    <li>• <strong>?:</strong> %3F</li>
                    <li>• <strong>#:</strong> %23</li>
                    <li>• <strong>/:</strong> %2F (in query)</li>
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

export default UrlEncoderDecoder;
