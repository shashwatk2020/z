
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Eraser } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from "@/components/ui/checkbox"

const WhitespaceRemover = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [removeType, setRemoveType] = useState('extra-spaces');
  const [removeLineBreaks, setRemoveLineBreaks] = useState(false);
  const [removeTabs, setRemoveTabs] = useState(false);
  const [trimLines, setTrimLines] = useState(false);
  const { toast } = useToast();

  const removeWhitespace = () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to process",
        variant: "destructive"
      });
      return;
    }

    let processedText = input;

    // Remove different types of whitespace based on selection
    switch (removeType) {
      case 'all-spaces':
        processedText = processedText.replace(/\s+/g, '');
        break;
      case 'extra-spaces':
        processedText = processedText.replace(/\s+/g, ' ');
        break;
      case 'leading-trailing':
        processedText = processedText.trim();
        break;
      case 'custom':
        if (removeLineBreaks) {
          processedText = processedText.replace(/\n+/g, ' ');
        }
        if (removeTabs) {
          processedText = processedText.replace(/\t+/g, '');
        }
        if (trimLines) {
          processedText = processedText.split('\n').map(line => line.trim()).join('\n');
        }
        break;
      default:
        break;
    }

    setResult(processedText);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied!",
      description: "Cleaned text copied to clipboard",
    });
  };

  const getCharacterCounts = () => {
    return {
      original: input.length,
      cleaned: result.length,
      removed: input.length - result.length
    };
  };

  const counts = getCharacterCounts();

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Advanced Whitespace Remover</h1>
            <p className="mt-4 text-lg text-gray-600">
              Clean up your text by removing unwanted spaces, tabs, and line breaks
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Remove Whitespace</CardTitle>
              <CardDescription>
                Choose how you want to clean up whitespace in your text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="input" className="block text-sm font-medium text-gray-700">
                  Text to Clean
                </label>
                <Textarea
                  id="input"
                  placeholder="Paste your text here with extra spaces, tabs, or line breaks..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={8}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="removeType" className="block text-sm font-medium text-gray-700">
                    Cleanup Type
                  </label>
                  <Select value={removeType} onValueChange={setRemoveType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="extra-spaces">Remove Extra Spaces</SelectItem>
                      <SelectItem value="all-spaces">Remove All Spaces</SelectItem>
                      <SelectItem value="leading-trailing">Remove Leading/Trailing Spaces</SelectItem>
                      <SelectItem value="custom">Custom Options</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {removeType === 'custom' && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Custom Options</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="removeLineBreaks"
                          checked={removeLineBreaks}
                          onCheckedChange={(checked) => setRemoveLineBreaks(checked === true)}
                        />
                        <label htmlFor="removeLineBreaks" className="text-sm">Remove line breaks</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="removeTabs"
                          checked={removeTabs}
                          onCheckedChange={(checked) => setRemoveTabs(checked === true)}
                        />
                        <label htmlFor="removeTabs" className="text-sm">Remove tabs</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="trimLines"
                          checked={trimLines}
                          onCheckedChange={(checked) => setTrimLines(checked === true)}
                        />
                        <label htmlFor="trimLines" className="text-sm">Trim each line</label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={removeWhitespace} className="w-full" size="lg" disabled={!input.trim()}>
                <Eraser className="mr-2 h-4 w-4" />
                Clean Text
              </Button>

              {result && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Cleaned Text:</h3>
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Original characters: {counts.original}</p>
                    <p>Cleaned characters: {counts.cleaned}</p>
                    <p>Characters removed: {counts.removed}</p>
                    {counts.removed > 0 && (
                      <p className="text-green-600">✓ Removed {((counts.removed / counts.original) * 100).toFixed(1)}% whitespace</p>
                    )}
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

export default WhitespaceRemover;
