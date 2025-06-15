
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Minimize, Copy, Download, RotateCcw, FileText, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const JavaScriptMinifier = () => {
  const [originalCode, setOriginalCode] = useState('');
  const [minifiedCode, setMinifiedCode] = useState('');
  const [compressionStats, setCompressionStats] = useState({
    originalSize: 0,
    minifiedSize: 0,
    compressionRatio: 0,
    savedBytes: 0
  });
  const { toast } = useToast();

  const minifyJavaScript = () => {
    if (!originalCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter JavaScript code to minify.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Basic JavaScript minification
      let minified = originalCode
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '')
        // Remove unnecessary whitespace
        .replace(/\s+/g, ' ')
        // Remove whitespace around operators and punctuation
        .replace(/\s*([{}();,=+\-*\/&|!<>])\s*/g, '$1')
        // Remove trailing semicolons before }
        .replace(/;}/g, '}')
        // Remove unnecessary spaces
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*,\s*/g, ',')
        // Remove leading/trailing whitespace
        .trim();

      setMinifiedCode(minified);

      // Calculate compression statistics
      const originalSize = new Blob([originalCode]).size;
      const minifiedSize = new Blob([minified]).size;
      const savedBytes = originalSize - minifiedSize;
      const compressionRatio = originalSize > 0 ? (savedBytes / originalSize) * 100 : 0;

      setCompressionStats({
        originalSize,
        minifiedSize,
        savedBytes,
        compressionRatio
      });

      toast({
        title: "Minification Complete",
        description: `Reduced size by ${compressionRatio.toFixed(1)}% (${savedBytes} bytes saved)`,
      });
    } catch (error) {
      toast({
        title: "Minification Error",
        description: "There was an error minifying your JavaScript code.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`,
    });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: `${filename} downloaded successfully.`,
    });
  };

  const clearAll = () => {
    setOriginalCode('');
    setMinifiedCode('');
    setCompressionStats({
      originalSize: 0,
      minifiedSize: 0,
      compressionRatio: 0,
      savedBytes: 0
    });
  };

  const insertSampleCode = () => {
    setOriginalCode(`// Sample JavaScript code for minification
function calculateSum(numbers) {
    // Initialize sum variable
    let sum = 0;
    
    // Loop through all numbers
    for (let i = 0; i < numbers.length; i++) {
        // Add each number to sum
        sum += numbers[i];
    }
    
    return sum;
}

function processUserData(userData) {
    // Validate user data
    if (!userData || typeof userData !== 'object') {
        throw new Error('Invalid user data provided');
    }
    
    // Extract user information
    const { name, email, age } = userData;
    
    // Validate required fields
    if (!name || !email) {
        throw new Error('Name and email are required');
    }
    
    // Process and return formatted data
    return {
        displayName: name.trim().toLowerCase(),
        emailAddress: email.trim().toLowerCase(),
        userAge: age || 0,
        isValid: true
    };
}

// Event handlers
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded successfully');
    
    // Initialize application
    initializeApp();
});

function initializeApp() {
    // Setup event listeners
    const button = document.getElementById('submit-btn');
    if (button) {
        button.addEventListener('click', handleSubmit);
    }
}`);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              JavaScript Minifier
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Compress and optimize your JavaScript code by removing unnecessary characters, comments, and whitespace.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Code Compression</Badge>
              <Badge variant="secondary">Remove Comments</Badge>
              <Badge variant="secondary">Size Optimization</Badge>
              <Badge variant="secondary">Performance Boost</Badge>
            </div>
          </div>

          <Tabs defaultValue="minifier" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="minifier">JavaScript Minifier</TabsTrigger>
              <TabsTrigger value="stats">Compression Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="minifier" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Original JavaScript
                    </CardTitle>
                    <CardDescription>
                      Paste your JavaScript code here
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Textarea
                      placeholder="Paste your JavaScript code here..."
                      value={originalCode}
                      onChange={(e) => setOriginalCode(e.target.value)}
                      className="min-h-[400px] font-mono text-sm"
                    />
                    
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        onClick={minifyJavaScript} 
                        disabled={!originalCode.trim()}
                        className="flex-1"
                      >
                        <Minimize className="h-4 w-4 mr-2" />
                        Minify JavaScript
                      </Button>
                      <Button variant="outline" onClick={insertSampleCode}>
                        <FileText className="h-4 w-4 mr-2" />
                        Sample
                      </Button>
                      <Button variant="outline" onClick={clearAll}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    </div>

                    {originalCode && (
                      <div className="text-sm text-gray-600">
                        Lines: {originalCode.split('\n').length} | Size: {formatBytes(new Blob([originalCode]).size)}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Minimize className="h-5 w-5" />
                      Minified JavaScript
                    </CardTitle>
                    <CardDescription>
                      Your compressed JavaScript code
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Textarea
                      value={minifiedCode}
                      readOnly
                      className="min-h-[400px] font-mono text-sm bg-gray-50"
                      placeholder="Minified code will appear here..."
                    />

                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        variant="outline" 
                        onClick={() => copyToClipboard(minifiedCode, 'Minified code')}
                        disabled={!minifiedCode}
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => downloadFile(minifiedCode, 'minified.js')}
                        disabled={!minifiedCode}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>

                    {minifiedCode && (
                      <div className="text-sm text-gray-600">
                        Size: {formatBytes(new Blob([minifiedCode]).size)} | 
                        Reduction: {compressionStats.compressionRatio.toFixed(1)}%
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-8">
              {compressionStats.originalSize > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Original Size</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatBytes(compressionStats.originalSize)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Minified Size</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {formatBytes(compressionStats.minifiedSize)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Bytes Saved</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {formatBytes(compressionStats.savedBytes)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Compression Ratio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {compressionStats.compressionRatio.toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Minify JavaScript code to see compression statistics</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Minification Benefits</CardTitle>
                <CardDescription>Why minify JavaScript?</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Reduces file size significantly</li>
                  <li>• Faster page load times</li>
                  <li>• Lower bandwidth usage</li>
                  <li>• Improved website performance</li>
                  <li>• Better user experience</li>
                  <li>• SEO optimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What Gets Removed</CardTitle>
                <CardDescription>Minification process</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Comments and documentation</li>
                  <li>• Unnecessary whitespace</li>
                  <li>• Line breaks and tabs</li>
                  <li>• Extra spaces around operators</li>
                  <li>• Redundant semicolons</li>
                  <li>• Block formatting</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
                <CardDescription>Optimization tips</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Keep original files for development</li>
                  <li>• Use minified files in production</li>
                  <li>• Combine multiple JS files</li>
                  <li>• Enable gzip compression</li>
                  <li>• Consider tree shaking</li>
                  <li>• Use source maps for debugging</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JavaScriptMinifier;
