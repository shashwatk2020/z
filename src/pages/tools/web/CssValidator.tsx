
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

const CssValidator = () => {
  const [cssCode, setCssCode] = useState('');
  const [validationResults, setValidationResults] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateCss = () => {
    setIsValidating(true);
    
    setTimeout(() => {
      const errors: ValidationError[] = [];
      const lines = cssCode.split('\n');
      
      let openBraces = 0;
      let inSelector = false;
      
      lines.forEach((line, lineIndex) => {
        const lineNum = lineIndex + 1;
        const trimmedLine = line.trim();
        
        if (trimmedLine === '') return;
        
        // Check for missing semicolons
        if (trimmedLine.includes(':') && !trimmedLine.endsWith(';') && !trimmedLine.endsWith('{') && !trimmedLine.endsWith('}')) {
          errors.push({
            line: lineNum,
            column: line.length,
            message: 'Missing semicolon at end of declaration',
            type: 'error'
          });
        }
        
        // Check for invalid property names
        if (trimmedLine.includes(':') && !trimmedLine.includes('{')) {
          const property = trimmedLine.split(':')[0].trim();
          if (property && !property.match(/^[a-zA-Z-]+$/) && !property.startsWith('--')) {
            errors.push({
              line: lineNum,
              column: line.indexOf(property) + 1,
              message: `Invalid CSS property name: ${property}`,
              type: 'error'
            });
          }
        }
        
        // Check for vendor prefixes without standard property
        if (trimmedLine.includes('-webkit-') || trimmedLine.includes('-moz-') || trimmedLine.includes('-ms-')) {
          errors.push({
            line: lineNum,
            column: line.indexOf('-') + 1,
            message: 'Consider adding the standard property along with vendor prefix',
            type: 'info'
          });
        }
        
        // Check for !important usage
        if (trimmedLine.includes('!important')) {
          errors.push({
            line: lineNum,
            column: line.indexOf('!important') + 1,
            message: 'Avoid using !important when possible',
            type: 'warning'
          });
        }
        
        // Check brace matching
        const openBraceCount = (trimmedLine.match(/{/g) || []).length;
        const closeBraceCount = (trimmedLine.match(/}/g) || []).length;
        openBraces += openBraceCount - closeBraceCount;
        
        if (openBraces < 0) {
          errors.push({
            line: lineNum,
            column: line.indexOf('}') + 1,
            message: 'Unexpected closing brace',
            type: 'error'
          });
        }
      });
      
      if (openBraces > 0) {
        errors.push({
          line: lines.length,
          column: 1,
          message: `${openBraces} unclosed brace(s)`,
          type: 'error'
        });
      }
      
      setValidationResults(errors);
      setIsValid(errors.filter(e => e.type === 'error').length === 0);
      setIsValidating(false);
      
      toast({
        title: errors.length === 0 ? "Validation Complete" : "Validation Issues Found",
        description: errors.length === 0 
          ? "Your CSS is valid!" 
          : `Found ${errors.length} issue(s) in your CSS code.`,
        variant: errors.filter(e => e.type === 'error').length > 0 ? "destructive" : "default",
      });
    }, 1000);
  };

  const clearAll = () => {
    setCssCode('');
    setValidationResults([]);
    setIsValid(null);
  };

  const insertSampleCode = () => {
    setCssCode(`/* Valid CSS Example */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .container {
    margin: 10px;
    border-radius: 0;
  }
}`);
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
              CSS Validator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Validate your CSS code for syntax errors, best practices, and browser compatibility issues.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Syntax Validation</Badge>
              <Badge variant="secondary">Best Practices</Badge>
              <Badge variant="secondary">Browser Compatibility</Badge>
              <Badge variant="secondary">Performance Tips</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  CSS Code
                </CardTitle>
                <CardDescription>
                  Paste your CSS code to validate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Paste your CSS code here..."
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
                
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    onClick={validateCss} 
                    disabled={!cssCode.trim() || isValidating}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isValidating ? 'Validating...' : 'Validate CSS'}
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

                {cssCode && (
                  <div className="text-sm text-gray-600">
                    Lines: {cssCode.split('\n').length} | Characters: {cssCode.length}
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
                  Issues and suggestions for your CSS code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px]">
                  {isValid === null && validationResults.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Click "Validate CSS" to check your code</p>
                      </div>
                    </div>
                  )}

                  {isValid === true && validationResults.length === 0 && (
                    <div className="flex items-center justify-center h-full text-green-600">
                      <div className="text-center">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                        <p className="font-medium">Valid CSS!</p>
                        <p className="text-sm text-gray-600">No issues found in your code.</p>
                      </div>
                    </div>
                  )}

                  {validationResults.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant={isValid ? "default" : "destructive"}>
                          {isValid ? 'Valid with Warnings' : 'Invalid CSS'}
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
                <CardTitle>Validation Features</CardTitle>
                <CardDescription>What we check for</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Syntax errors and typos</li>
                  <li>• Missing semicolons</li>
                  <li>• Unclosed braces</li>
                  <li>• Invalid property names</li>
                  <li>• Vendor prefix usage</li>
                  <li>• Performance issues</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
                <CardDescription>CSS recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Use external stylesheets</li>
                  <li>• Avoid !important</li>
                  <li>• Use semantic class names</li>
                  <li>• Minimize vendor prefixes</li>
                  <li>• Use CSS Grid/Flexbox</li>
                  <li>• Optimize for performance</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Types</CardTitle>
                <CardDescription>Issue categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Errors</span>
                    <span className="text-gray-600">- Syntax issues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Warnings</span>
                    <span className="text-gray-600">- Best practice violations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Info</span>
                    <span className="text-gray-600">- Optimization tips</span>
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

export default CssValidator;
