
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

const CssMinifier = () => {
  const [originalCode, setOriginalCode] = useState('');
  const [minifiedCode, setMinifiedCode] = useState('');
  const [compressionStats, setCompressionStats] = useState({
    originalSize: 0,
    minifiedSize: 0,
    compressionRatio: 0,
    savedBytes: 0
  });
  const { toast } = useToast();

  const minifyCSS = () => {
    if (!originalCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter CSS code to minify.",
        variant: "destructive",
      });
      return;
    }

    try {
      // CSS minification
      let minified = originalCode
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove unnecessary whitespace
        .replace(/\s+/g, ' ')
        // Remove whitespace around special characters
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        // Remove trailing semicolon before }
        .replace(/;}/g, '}')
        // Remove unnecessary spaces
        .replace(/;\s+/g, ';')
        .replace(/,\s+/g, ',')
        .replace(/{\s+/g, '{')
        .replace(/}\s+/g, '}')
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
        description: "There was an error minifying your CSS code.",
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
    const blob = new Blob([content], { type: 'text/css' });
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
    setOriginalCode(`/* Main styles for website layout */
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    line-height: 1.6;
}

/* Header styles */
.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem 0;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.header h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 300;
}

/* Navigation styles */
.nav {
    background-color: #333;
    padding: 0;
}

.nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
}

.nav li {
    margin: 0;
}

.nav a {
    display: block;
    color: white;
    text-decoration: none;
    padding: 1rem 2rem;
    transition: background-color 0.3s ease;
}

.nav a:hover {
    background-color: #555;
}

/* Container and layout */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.row {
    display: flex;
    flex-wrap: wrap;
    margin: -1rem;
}

.col {
    flex: 1;
    padding: 1rem;
    min-width: 250px;
}

/* Card component */
.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    margin-bottom: 2rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* Button styles */
.btn {
    display: inline-block;
    background-color: #007bff;
    color: white;
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
}

.btn:hover {
    background-color: #0056b3;
}

.btn-secondary {
    background-color: #6c757d;
}

.btn-secondary:hover {
    background-color: #545b62;
}

/* Responsive design */
@media (max-width: 768px) {
    .header h1 {
        font-size: 2rem;
    }
    
    .nav ul {
        flex-direction: column;
    }
    
    .row {
        flex-direction: column;
    }
    
    .container {
        padding: 1rem;
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
              CSS Minifier
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Compress and optimize your CSS code by removing unnecessary characters, comments, and whitespace for better performance.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">CSS Compression</Badge>
              <Badge variant="secondary">Remove Comments</Badge>
              <Badge variant="secondary">Size Optimization</Badge>
              <Badge variant="secondary">Performance Boost</Badge>
            </div>
          </div>

          <Tabs defaultValue="minifier" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="minifier">CSS Minifier</TabsTrigger>
              <TabsTrigger value="stats">Compression Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="minifier" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Original CSS
                    </CardTitle>
                    <CardDescription>
                      Paste your CSS code here
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Textarea
                      placeholder="Paste your CSS code here..."
                      value={originalCode}
                      onChange={(e) => setOriginalCode(e.target.value)}
                      className="min-h-[400px] font-mono text-sm"
                    />
                    
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        onClick={minifyCSS} 
                        disabled={!originalCode.trim()}
                        className="flex-1"
                      >
                        <Minimize className="h-4 w-4 mr-2" />
                        Minify CSS
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
                      Minified CSS
                    </CardTitle>
                    <CardDescription>
                      Your compressed CSS code
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
                        onClick={() => downloadFile(minifiedCode, 'minified.css')}
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
                      <p>Minify CSS code to see compression statistics</p>
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
                <CardDescription>Why minify CSS?</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Reduces file size significantly</li>
                  <li>• Faster page load times</li>
                  <li>• Lower bandwidth usage</li>
                  <li>• Improved website performance</li>
                  <li>• Better Core Web Vitals scores</li>
                  <li>• Enhanced user experience</li>
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
                  <li>• Line breaks and indentation</li>
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
                  <li>• Combine multiple CSS files</li>
                  <li>• Enable gzip compression</li>
                  <li>• Remove unused CSS rules</li>
                  <li>• Use CSS preprocessors wisely</li>
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

export default CssMinifier;
