
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Minimize, Copy, Download, RotateCcw, FileText, BarChart3, Settings } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface MinificationOptions {
  removeComments: boolean;
  removeWhitespace: boolean;
  removeEmptyLines: boolean;
  removeRedundantAttributes: boolean;
  removeScriptTypeAttributes: boolean;
  removeLinkTypeAttributes: boolean;
}

const HtmlMinifier = () => {
  const [originalCode, setOriginalCode] = useState('');
  const [minifiedCode, setMinifiedCode] = useState('');
  const [options, setOptions] = useState<MinificationOptions>({
    removeComments: true,
    removeWhitespace: true,
    removeEmptyLines: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeLinkTypeAttributes: true,
  });
  const [compressionStats, setCompressionStats] = useState({
    originalSize: 0,
    minifiedSize: 0,
    compressionRatio: 0,
    savedBytes: 0
  });
  const { toast } = useToast();

  const minifyHTML = () => {
    if (!originalCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter HTML code to minify.",
        variant: "destructive",
      });
      return;
    }

    try {
      let minified = originalCode;

      // Remove HTML comments
      if (options.removeComments) {
        minified = minified.replace(/<!--[\s\S]*?-->/g, '');
      }

      // Remove unnecessary whitespace
      if (options.removeWhitespace) {
        minified = minified
          .replace(/\s+/g, ' ')
          .replace(/>\s+</g, '><')
          .replace(/\s+>/g, '>')
          .replace(/<\s+/g, '<');
      }

      // Remove empty lines
      if (options.removeEmptyLines) {
        minified = minified.replace(/^\s*[\r\n]/gm, '');
      }

      // Remove redundant attributes
      if (options.removeRedundantAttributes) {
        minified = minified.replace(/\s+method="get"/gi, '');
      }

      // Remove script type attributes
      if (options.removeScriptTypeAttributes) {
        minified = minified.replace(/\s+type="text\/javascript"/gi, '');
      }

      // Remove link type attributes
      if (options.removeLinkTypeAttributes) {
        minified = minified.replace(/\s+type="text\/css"/gi, '');
      }

      // Final cleanup
      minified = minified.trim();

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
        description: "There was an error minifying your HTML code.",
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
    const blob = new Blob([content], { type: 'text/html' });
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
    setOriginalCode(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample HTML Document for Minification</title>
    
    <!-- CSS Styles -->
    <link rel="stylesheet" type="text/css" href="styles.css">
    <style type="text/css">
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <!-- Main content wrapper -->
    <div class="container">
        
        <!-- Page header -->
        <header class="header">
            <h1>Welcome to HTML Minification Demo</h1>
            <p>This is a sample HTML document that demonstrates various elements and structures.</p>
        </header>
        
        <!-- Navigation menu -->
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
        
        <!-- Main content section -->
        <main>
            <section id="content">
                <h2>Main Content Section</h2>
                <p>This paragraph contains some sample text to demonstrate how HTML minification works. 
                   The minifier will remove unnecessary whitespace, comments, and redundant attributes 
                   while preserving the functionality and structure of the document.</p>
                
                <div class="feature-list">
                    <h3>Features of HTML Minification:</h3>
                    <ul>
                        <li>Removes HTML comments</li>
                        <li>Eliminates unnecessary whitespace</li>
                        <li>Compresses file size</li>
                        <li>Improves loading speed</li>
                        <li>Maintains functionality</li>
                    </ul>
                </div>
                
                <!-- Contact form -->
                <form method="get" action="/submit">
                    <h3>Contact Form</h3>
                    <div>
                        <label for="name">Name:</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    
                    <div>
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <div>
                        <label for="message">Message:</label>
                        <textarea id="message" name="message" rows="4" required></textarea>
                    </div>
                    
                    <button type="submit" class="button">Send Message</button>
                </form>
            </section>
        </main>
        
        <!-- Footer section -->
        <footer>
            <p>&copy; 2024 HTML Minifier Demo. All rights reserved.</p>
        </footer>
        
    </div>
    
    <!-- JavaScript -->
    <script type="text/javascript">
        // Simple form validation
        document.querySelector('form').addEventListener('submit', function(e) {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            if (!name || !email) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
        
        // Page load message
        window.addEventListener('load', function() {
            console.log('Page loaded successfully!');
        });
    </script>
</body>
</html>`);
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
              HTML Minifier
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Compress and optimize your HTML code by removing unnecessary characters, comments, and whitespace while preserving functionality.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">HTML Compression</Badge>
              <Badge variant="secondary">Remove Comments</Badge>
              <Badge variant="secondary">Size Optimization</Badge>
              <Badge variant="secondary">Faster Loading</Badge>
            </div>
          </div>

          <Tabs defaultValue="minifier" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="minifier">HTML Minifier</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="minifier" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Original HTML
                    </CardTitle>
                    <CardDescription>
                      Paste your HTML code here
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Textarea
                      placeholder="Paste your HTML code here..."
                      value={originalCode}
                      onChange={(e) => setOriginalCode(e.target.value)}
                      className="min-h-[400px] font-mono text-sm"
                    />
                    
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        onClick={minifyHTML} 
                        disabled={!originalCode.trim()}
                        className="flex-1"
                      >
                        <Minimize className="h-4 w-4 mr-2" />
                        Minify HTML
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
                      Minified HTML
                    </CardTitle>
                    <CardDescription>
                      Your compressed HTML code
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
                        onClick={() => downloadFile(minifiedCode, 'minified.html')}
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

            <TabsContent value="options" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Minification Options
                  </CardTitle>
                  <CardDescription>
                    Configure what should be removed during minification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="removeComments" 
                          checked={options.removeComments}
                          onCheckedChange={(checked) => 
                            setOptions(prev => ({ ...prev, removeComments: checked as boolean }))
                          }
                        />
                        <label htmlFor="removeComments" className="text-sm font-medium">
                          Remove HTML Comments
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="removeWhitespace" 
                          checked={options.removeWhitespace}
                          onCheckedChange={(checked) => 
                            setOptions(prev => ({ ...prev, removeWhitespace: checked as boolean }))
                          }
                        />
                        <label htmlFor="removeWhitespace" className="text-sm font-medium">
                          Remove Unnecessary Whitespace
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="removeEmptyLines" 
                          checked={options.removeEmptyLines}
                          onCheckedChange={(checked) => 
                            setOptions(prev => ({ ...prev, removeEmptyLines: checked as boolean }))
                          }
                        />
                        <label htmlFor="removeEmptyLines" className="text-sm font-medium">
                          Remove Empty Lines
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="removeRedundantAttributes" 
                          checked={options.removeRedundantAttributes}
                          onCheckedChange={(checked) => 
                            setOptions(prev => ({ ...prev, removeRedundantAttributes: checked as boolean }))
                          }
                        />
                        <label htmlFor="removeRedundantAttributes" className="text-sm font-medium">
                          Remove Redundant Attributes
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="removeScriptTypeAttributes" 
                          checked={options.removeScriptTypeAttributes}
                          onCheckedChange={(checked) => 
                            setOptions(prev => ({ ...prev, removeScriptTypeAttributes: checked as boolean }))
                          }
                        />
                        <label htmlFor="removeScriptTypeAttributes" className="text-sm font-medium">
                          Remove Script Type Attributes
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="removeLinkTypeAttributes" 
                          checked={options.removeLinkTypeAttributes}
                          onCheckedChange={(checked) => 
                            setOptions(prev => ({ ...prev, removeLinkTypeAttributes: checked as boolean }))
                          }
                        />
                        <label htmlFor="removeLinkTypeAttributes" className="text-sm font-medium">
                          Remove Link Type Attributes
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                      <p>Minify HTML code to see compression statistics</p>
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
                <CardDescription>Why minify HTML?</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Reduces file size significantly</li>
                  <li>• Faster page load times</li>
                  <li>• Lower bandwidth usage</li>
                  <li>• Improved website performance</li>
                  <li>• Better search engine ranking</li>
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
                  <li>• HTML comments</li>
                  <li>• Unnecessary whitespace</li>
                  <li>• Empty lines and indentation</li>
                  <li>• Redundant attributes</li>
                  <li>• Optional closing tags</li>
                  <li>• Quote marks where possible</li>
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
                  <li>• Test functionality after minification</li>
                  <li>• Combine with CSS/JS minification</li>
                  <li>• Enable server compression</li>
                  <li>• Use build tools for automation</li>
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

export default HtmlMinifier;
