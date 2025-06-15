
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, RotateCcw, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TextRepeater = () => {
  const [inputText, setInputText] = useState('');
  const [repeatCount, setRepeatCount] = useState(5);
  const [separator, setSeparator] = useState('\n');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const repeatText = () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to repeat.",
        variant: "destructive",
      });
      return;
    }

    if (repeatCount < 1 || repeatCount > 1000) {
      toast({
        title: "Error",
        description: "Repeat count must be between 1 and 1000.",
        variant: "destructive",
      });
      return;
    }

    const repeated = Array(repeatCount).fill(inputText).join(separator);
    setOutput(repeated);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "Repeated text copied to clipboard.",
    });
  };

  const clearAll = () => {
    setInputText('');
    setOutput('');
    setRepeatCount(5);
    setSeparator('\n');
  };

  const separatorOptions = [
    { label: 'New Line', value: '\n' },
    { label: 'Space', value: ' ' },
    { label: 'Comma', value: ', ' },
    { label: 'Tab', value: '\t' },
    { label: 'No Separator', value: '' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Text Repeater Tool
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Repeat any text multiple times with custom separators. Perfect for creating lists, patterns, or filling content.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Custom Separators</Badge>
              <Badge variant="secondary">Bulk Repeat</Badge>
              <Badge variant="secondary">Copy Function</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Repeat className="h-5 w-5" />
                  Input Text
                </CardTitle>
                <CardDescription>
                  Enter the text you want to repeat and configure the settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="input-text">Text to Repeat</Label>
                  <Textarea
                    id="input-text"
                    placeholder="Enter the text you want to repeat..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[100px] mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="repeat-count">Repeat Count (1-1000)</Label>
                  <Input
                    id="repeat-count"
                    type="number"
                    min="1"
                    max="1000"
                    value={repeatCount}
                    onChange={(e) => setRepeatCount(parseInt(e.target.value) || 1)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Separator</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {separatorOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={separator === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSeparator(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={repeatText} className="flex-1">
                    <Repeat className="h-4 w-4 mr-2" />
                    Repeat Text
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Repeated Text Output</CardTitle>
                    <CardDescription>
                      Your repeated text will appear here
                    </CardDescription>
                  </div>
                  {output && (
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={output}
                  readOnly
                  placeholder="Repeated text will appear here..."
                  className="min-h-[300px] text-sm"
                />
                {output && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Characters: {output.length.toLocaleString()}</p>
                    <p>Lines: {output.split('\n').length.toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TextRepeater;
