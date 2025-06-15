
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Code, FileText, RotateCcw, Copy, Download, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const JsonFormatter = () => {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [indentSize, setIndentSize] = useState([2]);
  const [sortKeys, setSortKeys] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  const formatJson = () => {
    try {
      if (!inputJson.trim()) {
        toast({
          title: "Input Required",
          description: "Please enter JSON data to format.",
          variant: "destructive",
        });
        return;
      }

      const parsed = JSON.parse(inputJson);
      
      // Sort keys if enabled
      const processedData = sortKeys ? sortObjectKeys(parsed) : parsed;
      
      // Format with specified indentation
      const formatted = compactMode 
        ? JSON.stringify(processedData)
        : JSON.stringify(processedData, null, indentSize[0]);
      
      setOutputJson(formatted);
      setIsValid(true);
      setValidationErrors([]);
      
      toast({
        title: "JSON Formatted",
        description: "Your JSON has been successfully formatted.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
      setValidationErrors([errorMessage]);
      setIsValid(false);
      setOutputJson('');
      
      toast({
        title: "Invalid JSON",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const sortObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(item => sortObjectKeys(item));
    } else if (obj !== null && typeof obj === 'object') {
      const sortedKeys = Object.keys(obj).sort();
      const sortedObj: any = {};
      sortedKeys.forEach(key => {
        sortedObj[key] = sortObjectKeys(obj[key]);
      });
      return sortedObj;
    }
    return obj;
  };

  const minifyJson = () => {
    try {
      if (!inputJson.trim()) {
        toast({
          title: "Input Required",
          description: "Please enter JSON data to minify.",
          variant: "destructive",
        });
        return;
      }

      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      
      setOutputJson(minified);
      setIsValid(true);
      setValidationErrors([]);
      
      toast({
        title: "JSON Minified",
        description: "Your JSON has been successfully minified.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
      setValidationErrors([errorMessage]);
      setIsValid(false);
      setOutputJson('');
      
      toast({
        title: "Invalid JSON",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const validateJson = () => {
    try {
      if (!inputJson.trim()) {
        toast({
          title: "Input Required",
          description: "Please enter JSON data to validate.",
          variant: "destructive",
        });
        return;
      }

      JSON.parse(inputJson);
      setIsValid(true);
      setValidationErrors([]);
      
      toast({
        title: "Valid JSON",
        description: "Your JSON is valid!",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
      setValidationErrors([errorMessage]);
      setIsValid(false);
      
      toast({
        title: "Invalid JSON",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    if (!outputJson) {
      toast({
        title: "Nothing to Copy",
        description: "Please format JSON first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(outputJson);
      toast({
        title: "Copied!",
        description: "Formatted JSON copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadJson = () => {
    if (!outputJson) {
      toast({
        title: "Nothing to Download",
        description: "Please format JSON first.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([outputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "JSON file has been downloaded.",
    });
  };

  const clearAll = () => {
    setInputJson('');
    setOutputJson('');
    setValidationErrors([]);
    setIsValid(null);
  };

  const insertSampleJson = () => {
    setInputJson(`{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "swimming", "coding"],
  "address": {
    "street": "123 Main St",
    "zipCode": "10001",
    "country": "USA"
  },
  "isActive": true,
  "lastLogin": "2024-01-15T10:30:00Z",
  "metadata": {
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "version": 1.2
  }
}`);
  };

  const addLineNumbers = (text: string) => {
    if (!showLineNumbers) return text;
    
    return text.split('\n').map((line, index) => 
      `${(index + 1).toString().padStart(3, ' ')}  ${line}`
    ).join('\n');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              JSON Formatter & Validator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Format, validate, and beautify JSON data with advanced options. Perfect for debugging APIs and data structures.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">JSON Validation</Badge>
              <Badge variant="secondary">Pretty Print</Badge>
              <Badge variant="secondary">Minification</Badge>
              <Badge variant="secondary">Key Sorting</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Input JSON
                </CardTitle>
                <CardDescription>
                  Paste your JSON data here
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Paste your JSON data here..."
                  value={inputJson}
                  onChange={(e) => setInputJson(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Indent Size</Label>
                    <Slider
                      value={indentSize}
                      onValueChange={setIndentSize}
                      max={8}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600">{indentSize[0]} spaces</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sort-keys"
                        checked={sortKeys}
                        onCheckedChange={setSortKeys}
                      />
                      <Label htmlFor="sort-keys">Sort Keys</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-lines"
                        checked={showLineNumbers}
                        onCheckedChange={setShowLineNumbers}
                      />
                      <Label htmlFor="show-lines">Line Numbers</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={formatJson} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Format
                  </Button>
                  <Button onClick={minifyJson} variant="outline">
                    Minify
                  </Button>
                  <Button onClick={validateJson} variant="outline">
                    Validate
                  </Button>
                  <Button variant="outline" onClick={insertSampleJson}>
                    <FileText className="h-4 w-4 mr-2" />
                    Sample
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>

                {inputJson && (
                  <div className="text-sm text-gray-600">
                    Lines: {inputJson.split('\n').length} | Characters: {inputJson.length}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Formatted Output
                </CardTitle>
                <CardDescription>
                  Formatted and validated JSON
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px]">
                  {isValid === null && !outputJson && validationErrors.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Click "Format" to process your JSON</p>
                      </div>
                    </div>
                  )}

                  {validationErrors.length > 0 && (
                    <div className="space-y-3">
                      <Badge variant="destructive">Invalid JSON</Badge>
                      {validationErrors.map((error, index) => (
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                            <div className="text-sm text-red-700">{error}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {outputJson && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="default">Valid JSON</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={copyToClipboard}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button size="sm" variant="outline" onClick={downloadJson}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>

                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
                        <pre className="text-sm whitespace-pre-wrap">
                          {addLineNumbers(outputJson)}
                        </pre>
                      </div>

                      <div className="text-sm text-gray-600">
                        Lines: {outputJson.split('\n').length} | Characters: {outputJson.length}
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
                <CardTitle>Formatting Features</CardTitle>
                <CardDescription>Available options</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Pretty print with custom indentation</li>
                  <li>• JSON minification</li>
                  <li>• Key sorting (alphabetical)</li>
                  <li>• Syntax validation</li>
                  <li>• Line numbers display</li>
                  <li>• Error highlighting</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Use Cases</CardTitle>
                <CardDescription>When to use this tool</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• API response debugging</li>
                  <li>• Configuration file editing</li>
                  <li>• Data structure visualization</li>
                  <li>• JSON file optimization</li>
                  <li>• Code documentation</li>
                  <li>• Data validation</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
                <CardDescription>JSON recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Use consistent naming conventions</li>
                  <li>• Avoid deeply nested structures</li>
                  <li>• Use arrays for ordered data</li>
                  <li>• Keep string values consistent</li>
                  <li>• Validate before deployment</li>
                  <li>• Use meaningful property names</li>
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

export default JsonFormatter;
