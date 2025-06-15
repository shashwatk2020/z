
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Code, FileText, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ValidationError {
  line: number;
  column: number;
  message: string;
  type: 'error' | 'warning' | 'info';
}

const HtmlValidator = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [validationResults, setValidationResults] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateHtml = () => {
    setIsValidating(true);
    
    // Simulate validation process
    setTimeout(() => {
      const errors: ValidationError[] = [];
      const lines = htmlCode.split('\n');
      
      // Basic HTML validation rules
      let hasDoctype = false;
      let hasHtml = false;
      let hasHead = false;
      let hasBody = false;
      let openTags: string[] = [];
      
      lines.forEach((line, lineIndex) => {
        const lineNum = lineIndex + 1;
        
        // Check for DOCTYPE
        if (line.toLowerCase().includes('<!doctype')) {
          hasDoctype = true;
        }
        
        // Check for HTML tag
        if (line.toLowerCase().includes('<html')) {
          hasHtml = true;
        }
        
        // Check for head and body tags
        if (line.toLowerCase().includes('<head')) hasHead = true;
        if (line.toLowerCase().includes('<body')) hasBody = true;
        
        // Check for unclosed tags
        const tagMatches = line.match(/<\/?[a-zA-Z][^>]*>/g);
        if (tagMatches) {
          tagMatches.forEach(tag => {
            const tagName = tag.match(/[a-zA-Z]+/)?.[0]?.toLowerCase();
            if (tagName) {
              if (tag.startsWith('</')) {
                // Closing tag
                const lastOpenTag = openTags.pop();
                if (lastOpenTag !== tagName) {
                  errors.push({
                    line: lineNum,
                    column: line.indexOf(tag) + 1,
                    message: `Mismatched closing tag: expected </${lastOpenTag}>, found </${tagName}>`,
                    type: 'error'
                  });
                }
              } else if (!tag.endsWith('/>') && !['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tagName)) {
                // Opening tag (not self-closing)
                openTags.push(tagName);
              }
            }
          });
        }
        
        // Check for common issues
        if (line.includes('<img') && !line.includes('alt=')) {
          errors.push({
            line: lineNum,
            column: line.indexOf('<img') + 1,
            message: 'Image tag missing alt attribute for accessibility',
            type: 'warning'
          });
        }
        
        if (line.includes('<a') && line.includes('href=""')) {
          errors.push({
            line: lineNum,
            column: line.indexOf('href=""') + 1,
            message: 'Empty href attribute in anchor tag',
            type: 'warning'
          });
        }
        
        // Check for inline styles (accessibility concern)
        if (line.includes('style=')) {
          errors.push({
            line: lineNum,
            column: line.indexOf('style=') + 1,
            message: 'Consider using external CSS instead of inline styles',
            type: 'info'
          });
        }
      });
      
      // Check for remaining unclosed tags
      openTags.forEach(tag => {
        errors.push({
          line: lines.length,
          column: 1,
          message: `Unclosed tag: <${tag}>`,
          type: 'error'
        });
      });
      
      // Check for missing essential elements
      if (!hasDoctype) {
        errors.push({
          line: 1,
          column: 1,
          message: 'Missing DOCTYPE declaration',
          type: 'error'
        });
      }
      
      if (!hasHtml) {
        errors.push({
          line: 1,
          column: 1,
          message: 'Missing <html> tag',
          type: 'error'
        });
      }
      
      if (!hasHead) {
        errors.push({
          line: 1,
          column: 1,
          message: 'Missing <head> section',
          type: 'warning'
        });
      }
      
      if (!hasBody) {
        errors.push({
          line: 1,
          column: 1,
          message: 'Missing <body> section',
          type: 'warning'
        });
      }
      
      setValidationResults(errors);
      setIsValid(errors.filter(e => e.type === 'error').length === 0);
      setIsValidating(false);
      
      toast({
        title: errors.length === 0 ? "Validation Complete" : "Validation Issues Found",
        description: errors.length === 0 
          ? "Your HTML is valid!" 
          : `Found ${errors.length} issue(s) in your HTML code.`,
        variant: errors.filter(e => e.type === 'error').length > 0 ? "destructive" : "default",
      });
    }, 1000);
  };

  const clearAll = () => {
    setHtmlCode('');
    setValidationResults([]);
    setIsValid(null);
  };

  const insertSampleCode = () => {
    setHtmlCode(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Valid HTML Document</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is a well-formed HTML document.</p>
    <img src="image.jpg" alt="Description of image">
    <a href="https://example.com">Visit Example</a>
</body>
</html>`);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              HTML Validator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Validate your HTML code for syntax errors, accessibility issues, and best practices compliance.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Syntax Validation</Badge>
              <Badge variant="secondary">Accessibility Check</Badge>
              <Badge variant="secondary">Best Practices</Badge>
              <Badge variant="secondary">W3C Standards</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  HTML Code
                </CardTitle>
                <CardDescription>
                  Paste your HTML code to validate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Paste your HTML code here..."
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
                
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    onClick={validateHtml} 
                    disabled={!htmlCode.trim() || isValidating}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isValidating ? 'Validating...' : 'Validate HTML'}
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

                {htmlCode && (
                  <div className="text-sm text-gray-600">
                    Lines: {htmlCode.split('\n').length} | Characters: {htmlCode.length}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Validation Results
                </CardTitle>
                <CardDescription>
                  Issues and suggestions for your HTML code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px]">
                  {isValid === null && validationResults.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Click "Validate HTML" to check your code</p>
                      </div>
                    </div>
                  )}

                  {isValid === true && validationResults.length === 0 && (
                    <div className="flex items-center justify-center h-full text-green-600">
                      <div className="text-center">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                        <p className="font-medium">Valid HTML!</p>
                        <p className="text-sm text-gray-600">No issues found in your code.</p>
                      </div>
                    </div>
                  )}

                  {validationResults.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant={isValid ? "default" : "destructive"}>
                          {isValid ? 'Valid with Warnings' : 'Invalid HTML'}
                        </Badge>
                        <span className="text-gray-600">
                          {validationResults.length} issue(s) found
                        </span>
                      </div>

                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {validationResults.map((error, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border-l-4 ${
                              error.type === 'error'
                                ? 'bg-red-50 border-red-500'
                                : error.type === 'warning'
                                ? 'bg-yellow-50 border-yellow-500'
                                : 'bg-blue-50 border-blue-500'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {getIconForType(error.type)}
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                  Line {error.line}, Column {error.column}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {error.message}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Common Issues</CardTitle>
                <CardDescription>What we check for</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Missing DOCTYPE declaration</li>
                  <li>• Unclosed HTML tags</li>
                  <li>• Mismatched opening/closing tags</li>
                  <li>• Missing required attributes</li>
                  <li>• Invalid nesting of elements</li>
                  <li>• Accessibility issues</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
                <CardDescription>Recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Use semantic HTML elements</li>
                  <li>• Include alt text for images</li>
                  <li>• Use external CSS files</li>
                  <li>• Validate against W3C standards</li>
                  <li>• Ensure proper document structure</li>
                  <li>• Follow accessibility guidelines</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Validation Types</CardTitle>
                <CardDescription>Issue categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Errors</span>
                    <span className="text-gray-600">- Critical issues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Warnings</span>
                    <span className="text-gray-600">- Best practice violations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Info</span>
                    <span className="text-gray-600">- Suggestions for improvement</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HtmlValidator;
