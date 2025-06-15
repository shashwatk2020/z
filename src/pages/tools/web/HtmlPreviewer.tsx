
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Eye, Code, RotateCcw, Copy, Download, Fullscreen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HtmlPreviewer = () => {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Preview</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; }
        .highlight { background-color: yellow; }
    </style>
</head>
<body>
    <h1>Welcome to HTML Previewer</h1>
    <p>This is a <span class="highlight">sample HTML</span> document.</p>
    <ul>
        <li>List item 1</li>
        <li>List item 2</li>
        <li>List item 3</li>
    </ul>
    <button onclick="alert('Hello World!')">Click me!</button>
</body>
</html>`);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();

  const copyCode = () => {
    navigator.clipboard.writeText(htmlCode);
    toast({
      title: "Copied!",
      description: "HTML code copied to clipboard.",
    });
  };

  const downloadHtml = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'preview.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "HTML file downloaded successfully.",
    });
  };

  const clearCode = () => {
    setHtmlCode('');
  };

  const insertSampleCode = () => {
    setHtmlCode(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h1 { text-align: center; margin-bottom: 30px; }
        .card { 
            background: rgba(255,255,255,0.2); 
            padding: 20px; 
            margin: 20px 0;
            border-radius: 10px;
        }
        button {
            background: #ff6b6b;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover { background: #ff5252; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Modern HTML Preview</h1>
        <div class="card">
            <h2>Welcome to the Future</h2>
            <p>This is a beautiful, modern HTML page with CSS styling and interactive elements.</p>
            <button onclick="showMessage()">Click for Magic ✨</button>
        </div>
        <div class="card">
            <h3>Features:</h3>
            <ul>
                <li>Responsive Design</li>
                <li>Modern CSS with Gradients</li>
                <li>Interactive JavaScript</li>
                <li>Glass-morphism Effects</li>
            </ul>
        </div>
    </div>

    <script>
        function showMessage() {
            alert('🎉 Welcome to the amazing world of web development!');
        }
    </script>
</body>
</html>`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
          {!isFullscreen && (
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                HTML Previewer
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Write, edit, and preview HTML code in real-time. Perfect for testing, learning, and prototyping web pages.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Badge variant="secondary">Real-time Preview</Badge>
                <Badge variant="secondary">Syntax Highlighting</Badge>
                <Badge variant="secondary">Download Ready</Badge>
                <Badge variant="secondary">Mobile Responsive</Badge>
              </div>
            </div>
          )}

          <div className={`grid ${isFullscreen ? 'grid-cols-2 h-screen' : 'grid-cols-1 lg:grid-cols-2'} gap-8`}>
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      HTML Editor
                    </CardTitle>
                    <CardDescription>
                      Write your HTML code here
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyCode}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadHtml}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                      <Fullscreen className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Enter your HTML code here..."
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className={`font-mono text-sm ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'min-h-[400px]'}`}
                />
                
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={insertSampleCode} size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Load Sample
                  </Button>
                  <Button variant="outline" onClick={clearCode} size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>

                {htmlCode && (
                  <div className="text-sm text-gray-600">
                    Lines: {htmlCode.split('\n').length} | Characters: {htmlCode.length}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  See your HTML rendered in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`border rounded-lg overflow-hidden bg-white ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'min-h-[400px]'}`}>
                  <iframe
                    srcDoc={htmlCode}
                    className="w-full h-full border-0"
                    title="HTML Preview"
                    sandbox="allow-scripts allow-forms allow-modals"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {!isFullscreen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                  <CardDescription>What makes our HTML Previewer special</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Real-time HTML preview as you type</li>
                    <li>• Support for CSS styling and JavaScript</li>
                    <li>• Download your HTML as a file</li>
                    <li>• Fullscreen editing and preview mode</li>
                    <li>• Mobile-responsive preview</li>
                    <li>• Safe sandbox environment</li>
                    <li>• Sample templates to get started</li>
                    <li>• Character and line counting</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tips & Tricks</CardTitle>
                  <CardDescription>Get the most out of the HTML Previewer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">Include CSS</p>
                      <p className="text-gray-600">Add CSS in &lt;style&gt; tags in the &lt;head&gt; section for styling</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Add JavaScript</p>
                      <p className="text-gray-600">Use &lt;script&gt; tags to add interactive functionality</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Test Responsiveness</p>
                      <p className="text-gray-600">Use fullscreen mode to test your design on larger screens</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Quick Download</p>
                      <p className="text-gray-600">Save your HTML as a file to use in your projects</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      {!isFullscreen && <Footer />}
    </div>
  );
};

export default HtmlPreviewer;
