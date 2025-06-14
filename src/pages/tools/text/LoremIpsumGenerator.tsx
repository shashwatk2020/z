import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const loremIpsum = require('lorem-ipsum').LoremIpsum;

const LoremIpsumGenerator = () => {
  const [type, setType] = useState('paragraphs');
  const [count, setCount] = useState(5);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [includeHtml, setIncludeHtml] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const { toast } = useToast();

  const generateText = () => {
    const lipsum = new loremIpsum({
      sentencesPerParagraph: {
        max: 8,
        min: 4
      },
      wordsPerSentence: {
        max: 16,
        min: 4
      }
    });

    let text = '';
    if (type === 'paragraphs') {
      text = lipsum.generateParagraphs(count);
    } else if (type === 'sentences') {
      text = lipsum.generateSentences(count);
    } else if (type === 'words') {
      text = lipsum.generateWords(count);
    } else if (type === 'characters') {
      let tempText = lipsum.generateWords(500);
      text = tempText.substring(0, count);
    }

    if (!startWithLorem && text.startsWith('Lorem ipsum dolor sit amet, consectetur adipiscing elit')) {
      const firstSentenceEnd = text.indexOf('. ');
      if (firstSentenceEnd !== -1) {
        text = text.substring(firstSentenceEnd + 2);
      }
    }

    setGeneratedText(text);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    toast({
      title: "Copied!",
      description: "Lorem Ipsum text copied to clipboard",
    });
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Advanced Lorem Ipsum Generator</h1>
            <p className="mt-4 text-lg text-gray-600">
              Generate customizable placeholder text with various options and formats
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Generate Lorem Ipsum</CardTitle>
              <CardDescription>
                Choose the type and amount of placeholder text you need
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Generate</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paragraphs">Paragraphs</SelectItem>
                      <SelectItem value="sentences">Sentences</SelectItem>
                      <SelectItem value="words">Words</SelectItem>
                      <SelectItem value="characters">Characters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="count">Number of {type}</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max={type === 'characters' ? 10000 : 100}
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Options</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="startWithLorem"
                      checked={startWithLorem}
                      onCheckedChange={(checked) => setStartWithLorem(checked === true)}
                    />
                    <Label htmlFor="startWithLorem">Start with "Lorem ipsum..."</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeHtml"
                      checked={includeHtml}
                      onCheckedChange={(checked) => setIncludeHtml(checked === true)}
                    />
                    <Label htmlFor="includeHtml">Include HTML tags</Label>
                  </div>
                </div>
              </div>

              <Button onClick={generateText} className="w-full" size="lg">
                <FileText className="mr-2 h-4 w-4" />
                Generate Text
              </Button>

              {generatedText && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Generated Text:</h3>
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                    {includeHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: generatedText }} />
                    ) : (
                      <p className="whitespace-pre-wrap">{generatedText}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 flex justify-between">
                    <span>Characters: {generatedText.replace(/<[^>]*>/g, '').length}</span>
                    <span>Words: {generatedText.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}</span>
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

export default LoremIpsumGenerator;
