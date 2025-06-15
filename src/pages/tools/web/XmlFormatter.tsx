
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Code, FileText, RotateCcw, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const XmlFormatter = () => {
  const [inputXml, setInputXml] = useState('');
  const [outputXml, setOutputXml] = useState('');
  const [indentSize, setIndentSize] = useState([2]);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [removeComments, setRemoveComments] = useState(false);
  const [removeWhitespace, setRemoveWhitespace] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  const parseXml = (xmlString: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error(parserError.textContent || 'XML parsing error');
    }
    
    return xmlDoc;
  };

  const formatXml = (xmlString: string, indent: number = 2) => {
    try {
      const xmlDoc = parseXml(xmlString);
      return formatXmlNode(xmlDoc, 0, indent);
    } catch (error) {
      throw error;
    }
  };

  const formatXmlNode = (node: Node, depth: number, indent: number): string => {
    const indentStr = ' '.repeat(depth * indent);
    let result = '';

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName;
      const hasChildren = element.childNodes.length > 0;
      const hasTextContent = element.childNodes.length === 1 && 
                            element.firstChild?.nodeType === Node.TEXT_NODE;

      // Opening tag with attributes
      let openTag = `<${tagName}`;
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        openTag += ` ${attr.name}="${attr.value}"`;
      }
      openTag += '>';

      if (!hasChildren) {
        result += `${indentStr}${openTag.replace('>', ' />')}\n`;
      } else if (hasTextContent) {
        const textContent = element.textContent?.trim() || '';
        result += `${indentStr}${openTag}${textContent}</${tagName}>\n`;
      } else {
        result += `${indentStr}${openTag}\n`;
        
        // Process children
        for (let i = 0; i < element.childNodes.length; i++) {
          const child = element.childNodes[i];
          if (child.nodeType === Node.ELEMENT_NODE) {
            result += formatXmlNode(child, depth + 1, indent);
          } else if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent?.trim();
            if (text) {
              result += `${' '.repeat((depth + 1) * indent)}${text}\n`;
            }
          } else if (child.nodeType === Node.COMMENT_NODE && !removeComments) {
            result += `${' '.repeat((depth + 1) * indent)}<!--${child.textContent}-->\n`;
          }
        }
        
        result += `${indentStr}</${tagName}>\n`;
      }
    } else if (node.nodeType === Node.DOCUMENT_NODE) {
      // Process document children
      for (let i = 0; i < node.childNodes.length; i++) {
        result += formatXmlNode(node.childNodes[i], depth, indent);
      }
    }

    return result;
  };

  const formatXmlHandler = () => {
    try {
      if (!inputXml.trim()) {
        toast({
          title: "Input Required",
          description: "Please enter XML data to format.",
          variant: "destructive",
        });
        return;
      }

      let processedXml = inputXml;
      
      if (removeComments) {
        processedXml = processedXml.replace(/<!--[\s\S]*?-->/g, '');
      }
      
      if (removeWhitespace) {
        processedXml = processedXml.replace(/>\s+</g, '><');
      }

      const formatted = formatXml(processedXml, indentSize[0]);
      
      setOutputXml(formatted.trim());
      setIsValid(true);
      setValidationErrors([]);
      
      toast({
        title: "XML Formatted",
        description: "Your XML has been successfully formatted.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid XML';
      setValidationErrors([errorMessage]);
      setIsValid(false);
      setOutputXml('');
      
      toast({
        title: "Invalid XML",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const minifyXml = () => {
    try {
      if (!inputXml.trim()) {
        toast({
          title: "Input Required",
          description: "Please enter XML data to minify.",
          variant: "destructive",
        });
        return;
      }

      // Parse to validate, then minify
      parseXml(inputXml);
      
      let minified = inputXml
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .replace(/<!--[\s\S]*?-->/g, '')
        .trim();
      
      setOutputXml(minified);
      setIsValid(true);
      setValidationErrors([]);
      
      toast({
        title: "XML Minified",
        description: "Your XML has been successfully minified.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid XML';
      setValidationErrors([errorMessage]);
      setIsValid(false);
      setOutputXml('');
      
      toast({
        title: "Invalid XML",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const validateXml = () => {
    try {
      if (!inputXml.trim()) {
        toast({
          title: "Input Required",
          description: "Please enter XML data to validate.",
          variant: "destructive",
        });
        return;
      }

      parseXml(inputXml);
      setIsValid(true);
      setValidationErrors([]);
      
      toast({
        title: "Valid XML",
        description: "Your XML is well-formed!",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid XML';
      setValidationErrors([errorMessage]);
      setIsValid(false);
      
      toast({
        title: "Invalid XML",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    if (!outputXml) {
      toast({
        title: "Nothing to Copy",
        description: "Please format XML first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(outputXml);
      toast({
        title: "Copied!",
        description: "Formatted XML copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadXml = () => {
    if (!outputXml) {
      toast({
        title: "Nothing to Download",
        description: "Please format XML first.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([outputXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "XML file has been downloaded.",
    });
  };

  const clearAll = () => {
    setInputXml('');
    setOutputXml('');
    setValidationErrors([]);
    setIsValid(null);
  };

  const insertSampleXml = () => {
    setInputXml(`<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
<book id="1" category="fiction">
<title lang="en">Great Gatsby</title>
<author>F. Scott Fitzgerald</author>
<year>1925</year>
<price currency="USD">12.99</price>
<description>A classic American novel set in the Jazz Age.</description>
</book>
<book id="2" category="science">
<title lang="en">Brief History of Time</title>
<author>Stephen Hawking</author>
<year>1988</year>
<price currency="USD">15.99</price>
<description>An exploration of cosmology and theoretical physics.</description>
</book>
</bookstore>`);
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
              XML Formatter & Validator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Format, validate, and beautify XML documents with comprehensive parsing and error detection.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">XML Validation</Badge>
              <Badge variant="secondary">Pretty Print</Badge>
              <Badge variant="secondary">Minification</Badge>
              <Badge variant="secondary">Error Detection</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Input XML
                </CardTitle>
                <CardDescription>
                  Paste your XML data here
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Paste your XML data here..."
                  value={inputXml}
                  onChange={(e) => setInputXml(e.target.value)}
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
                        id="remove-comments"
                        checked={removeComments}
                        onCheckedChange={setRemoveComments}
                      />
                      <Label htmlFor="remove-comments">Remove Comments</Label>
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
                  <Button onClick={formatXmlHandler} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Format
                  </Button>
                  <Button onClick={minifyXml} variant="outline">
                    Minify
                  </Button>
                  <Button onClick={validateXml} variant="outline">
                    Validate
                  </Button>
                  <Button variant="outline" onClick={insertSampleXml}>
                    <FileText className="h-4 w-4 mr-2" />
                    Sample
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>

                {inputXml && (
                  <div className="text-sm text-gray-600">
                    Lines: {inputXml.split('\n').length} | Characters: {inputXml.length}
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
                  Formatted and validated XML
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px]">
                  {isValid === null && !outputXml && validationErrors.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Click "Format" to process your XML</p>
                      </div>
                    </div>
                  )}

                  {validationErrors.length > 0 && (
                    <div className="space-y-3">
                      <Badge variant="destructive">Invalid XML</Badge>
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

                  {outputXml && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="default">Valid XML</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={copyToClipboard}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button size="sm" variant="outline" onClick={downloadXml}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>

                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
                        <pre className="text-sm whitespace-pre-wrap">
                          {addLineNumbers(outputXml)}
                        </pre>
                      </div>

                      <div className="text-sm text-gray-600">
                        Lines: {outputXml.split('\n').length} | Characters: {outputXml.length}
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
                  <li>• XML minification</li>
                  <li>• Comment removal</li>
                  <li>• Well-formedness validation</li>
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
                  <li>• Configuration file editing</li>
                  <li>• API response debugging</li>
                  <li>• Document structure analysis</li>
                  <li>• Data transformation</li>
                  <li>• XML schema validation</li>
                  <li>• Web service testing</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>XML Best Practices</CardTitle>
                <CardDescription>Recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Use meaningful element names</li>
                  <li>• Keep nesting levels reasonable</li>
                  <li>• Include XML declaration</li>
                  <li>• Use attributes for metadata</li>
                  <li>• Validate against schemas</li>
                  <li>• Escape special characters</li>
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

export default XmlFormatter;
