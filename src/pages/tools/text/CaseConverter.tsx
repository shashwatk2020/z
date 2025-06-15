
import React, { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, RotateCcw, Shuffle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CaseConverter = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [activeCase, setActiveCase] = useState('');
  const { toast } = useToast();

  const conversions = [
    {
      id: 'upper',
      name: 'UPPER CASE',
      description: 'Convert all letters to uppercase',
      convert: (text: string) => text.toUpperCase()
    },
    {
      id: 'lower',
      name: 'lower case',
      description: 'Convert all letters to lowercase',
      convert: (text: string) => text.toLowerCase()
    },
    {
      id: 'title',
      name: 'Title Case',
      description: 'Capitalize the first letter of each word',
      convert: (text: string) => text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
    },
    {
      id: 'sentence',
      name: 'Sentence case',
      description: 'Capitalize the first letter of each sentence',
      convert: (text: string) => text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
    },
    {
      id: 'camel',
      name: 'camelCase',
      description: 'Remove spaces and capitalize each word except the first',
      convert: (text: string) => {
        const words = text.toLowerCase().split(/\s+/);
        return words[0] + words.slice(1).map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)).join('');
      }
    },
    {
      id: 'pascal',
      name: 'PascalCase',
      description: 'Remove spaces and capitalize each word',
      convert: (text: string) => text.toLowerCase().split(/\s+/).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)).join('')
    },
    {
      id: 'snake',
      name: 'snake_case',
      description: 'Replace spaces with underscores and use lowercase',
      convert: (text: string) => text.toLowerCase().replace(/\s+/g, '_')
    },
    {
      id: 'kebab',
      name: 'kebab-case',
      description: 'Replace spaces with hyphens and use lowercase',
      convert: (text: string) => text.toLowerCase().replace(/\s+/g, '-')
    },
    {
      id: 'constant',
      name: 'CONSTANT_CASE',
      description: 'Replace spaces with underscores and use uppercase',
      convert: (text: string) => text.toUpperCase().replace(/\s+/g, '_')
    },
    {
      id: 'alternating',
      name: 'aLtErNaTiNg CaSe',
      description: 'Alternate between lowercase and uppercase letters',
      convert: (text: string) => text.split('').map((char, index) => 
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('')
    },
    {
      id: 'inverse',
      name: 'iNVERSE cASE',
      description: 'Swap the case of each letter',
      convert: (text: string) => text.split('').map(char => 
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()).join('')
    },
    {
      id: 'random',
      name: 'RaNdOm CaSe',
      description: 'Randomly capitalize letters',
      convert: (text: string) => text.split('').map(char => 
        Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()).join('')
    }
  ];

  const handleConversion = useCallback((conversionId: string) => {
    if (!inputText.trim()) {
      toast({
        title: "No input text",
        description: "Please enter some text to convert.",
        variant: "destructive"
      });
      return;
    }

    const conversion = conversions.find(c => c.id === conversionId);
    if (conversion) {
      const result = conversion.convert(inputText);
      setOutputText(result);
      setActiveCase(conversionId);
      toast({
        title: "Text converted",
        description: `Successfully converted to ${conversion.name}`,
      });
    }
  }, [inputText, toast]);

  const copyToClipboard = async () => {
    if (!outputText) {
      toast({
        title: "No output to copy",
        description: "Please convert some text first.",
        variant: "destructive"
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: "Copied to clipboard",
        description: "The converted text has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy text to clipboard.",
        variant: "destructive"
      });
    }
  };

  const downloadAsFile = () => {
    if (!outputText) {
      toast({
        title: "No output to download",
        description: "Please convert some text first.",
        variant: "destructive"
      });
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([outputText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `converted-text-${activeCase || 'output'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "File downloaded",
      description: "The converted text has been downloaded as a file.",
    });
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setActiveCase('');
  };

  const swapInputOutput = () => {
    if (!outputText) {
      toast({
        title: "No output to swap",
        description: "Please convert some text first.",
        variant: "destructive"
      });
      return;
    }
    
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
    setActiveCase('');
  };

  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const getCharCount = (text: string) => text.length;
  const getCharCountNoSpaces = (text: string) => text.replace(/\s/g, '').length;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold">Advanced Case Converter</CardTitle>
              <CardDescription>
                Convert text between multiple case formats with advanced options and text analysis features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Section */}
              <div className="space-y-2">
                <Label htmlFor="input-text" className="text-lg font-semibold">Input Text</Label>
                <Textarea
                  id="input-text"
                  placeholder="Type or paste your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[150px] text-base"
                />
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>Characters: {getCharCount(inputText)}</span>
                  <span>Characters (no spaces): {getCharCountNoSpaces(inputText)}</span>
                  <span>Words: {getWordCount(inputText)}</span>
                  <span>Lines: {inputText.split('\n').length}</span>
                </div>
              </div>

              {/* Conversion Options */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Conversion Options</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {conversions.map((conversion) => (
                    <Button
                      key={conversion.id}
                      onClick={() => handleConversion(conversion.id)}
                      variant={activeCase === conversion.id ? "default" : "outline"}
                      className="h-auto p-3 flex flex-col items-start text-left"
                      title={conversion.description}
                    >
                      <span className="font-medium text-sm">{conversion.name}</span>
                      <span className="text-xs text-gray-500 mt-1">{conversion.description}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Output Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="output-text" className="text-lg font-semibold">Output Text</Label>
                  {activeCase && (
                    <Badge variant="secondary" className="ml-2">
                      {conversions.find(c => c.id === activeCase)?.name}
                    </Badge>
                  )}
                </div>
                <Textarea
                  id="output-text"
                  placeholder="Converted text will appear here..."
                  value={outputText}
                  readOnly
                  className="min-h-[150px] text-base bg-gray-50"
                />
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>Characters: {getCharCount(outputText)}</span>
                  <span>Characters (no spaces): {getCharCountNoSpaces(outputText)}</span>
                  <span>Words: {getWordCount(outputText)}</span>
                  <span>Lines: {outputText.split('\n').length}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Button onClick={copyToClipboard} variant="outline" className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Output
                </Button>
                <Button onClick={downloadAsFile} variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button onClick={swapInputOutput} variant="outline" className="flex items-center gap-2">
                  <Shuffle className="h-4 w-4" />
                  Swap Input/Output
                </Button>
                <Button onClick={clearAll} variant="destructive" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Clear All
                </Button>
              </div>

              {/* Usage Examples */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Usage Examples:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Programming:</strong> Use camelCase, PascalCase, snake_case, or kebab-case for variable names
                  </div>
                  <div>
                    <strong>Documentation:</strong> Use Title Case for headings, Sentence case for content
                  </div>
                  <div>
                    <strong>Social Media:</strong> Use alternating case or random case for creative posts
                  </div>
                  <div>
                    <strong>Constants:</strong> Use CONSTANT_CASE for environment variables and constants
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CaseConverter;
