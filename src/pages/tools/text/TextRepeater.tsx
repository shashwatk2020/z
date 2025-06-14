
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TextRepeater = () => {
  const [text, setText] = useState('');
  const [repetitions, setRepetitions] = useState(3);
  const [separator, setSeparator] = useState(' ');
  const [customSeparator, setCustomSeparator] = useState('');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const repeatText = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to repeat",
        variant: "destructive"
      });
      return;
    }

    const actualSeparator = separator === 'custom' ? customSeparator : separator;
    const repeatedText = Array(repetitions).fill(text).join(actualSeparator);
    setResult(repeatedText);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied!",
      description: "Repeated text copied to clipboard",
    });
  };

  const getSeparatorDisplay = (value: string) => {
    switch (value) {
      case ' ': return 'Space';
      case '\n': return 'New Line';
      case ', ': return 'Comma + Space';
      case '': return 'No Separator';
      case 'custom': return 'Custom';
      default: return value;
    }
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Text Repeater</h1>
            <p className="mt-4 text-lg text-gray-600">
              Duplicate any text multiple times with custom separators
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Repeat Text</CardTitle>
              <CardDescription>
                Enter your text and specify how many times you want to repeat it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="text">Text to Repeat</Label>
                <Textarea
                  id="text"
                  placeholder="Enter the text you want to repeat..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="repetitions">Number of Repetitions</Label>
                  <Input
                    id="repetitions"
                    type="number"
                    min="1"
                    max="1000"
                    value={repetitions}
                    onChange={(e) => setRepetitions(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="separator">Separator</Label>
                  <Select value={separator} onValueChange={setSeparator}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">Space</SelectItem>
                      <SelectItem value={"\n"}>New Line</SelectItem>
                      <SelectItem value=", ">Comma + Space</SelectItem>
                      <SelectItem value="">No Separator</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {separator === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="customSeparator">Custom Separator</Label>
                  <Input
                    id="customSeparator"
                    placeholder="Enter custom separator..."
                    value={customSeparator}
                    onChange={(e) => setCustomSeparator(e.target.value)}
                  />
                </div>
              )}

              <Button onClick={repeatText} className="w-full" size="lg" disabled={!text.trim()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Repeat Text
              </Button>

              {result && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Result:</h3>
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Character count: {result.length}</p>
                    <p>Separator used: {getSeparatorDisplay(separator === 'custom' ? customSeparator : separator)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TextRepeater;
