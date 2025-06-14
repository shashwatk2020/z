
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Copy, RefreshCw, FileText } from 'lucide-react';

const LoremIpsumGenerator = () => {
  const [count, setCount] = useState(5);
  const [type, setType] = useState('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [includeHtml, setIncludeHtml] = useState(false);
  const [generatedText, setGeneratedText] = useState('');

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
    'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
    'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo'
  ];

  const generateWords = (wordCount: number) => {
    const words = [];
    for (let i = 0; i < wordCount; i++) {
      if (i === 0 && startWithLorem) {
        words.push('Lorem');
      } else if (i === 1 && startWithLorem) {
        words.push('ipsum');
      } else {
        words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
      }
    }
    return words.join(' ');
  };

  const generateSentences = (sentenceCount: number) => {
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      const wordsInSentence = Math.floor(Math.random() * 10) + 5;
      let sentence = generateWords(wordsInSentence);
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
      sentences.push(sentence);
    }
    return sentences.join(' ');
  };

  const generateParagraphs = (paragraphCount: number) => {
    const paragraphs = [];
    for (let i = 0; i < paragraphCount; i++) {
      const sentencesInParagraph = Math.floor(Math.random() * 5) + 3;
      const paragraph = generateSentences(sentencesInParagraph);
      if (includeHtml) {
        paragraphs.push(`<p>${paragraph}</p>`);
      } else {
        paragraphs.push(paragraph);
      }
    }
    return paragraphs.join(includeHtml ? '\n\n' : '\n\n');
  };

  const generateText = () => {
    let result = '';
    
    switch (type) {
      case 'words':
        result = generateWords(count);
        break;
      case 'sentences':
        result = generateSentences(count);
        break;
      case 'paragraphs':
        result = generateParagraphs(count);
        break;
      case 'list':
        const listItems = [];
        for (let i = 0; i < count; i++) {
          const wordsInItem = Math.floor(Math.random() * 8) + 3;
          const item = generateWords(wordsInItem);
          if (includeHtml) {
            listItems.push(`<li>${item.charAt(0).toUpperCase() + item.slice(1)}</li>`);
          } else {
            listItems.push(`• ${item.charAt(0).toUpperCase() + item.slice(1)}`);
          }
        }
        if (includeHtml) {
          result = `<ul>\n${listItems.join('\n')}\n</ul>`;
        } else {
          result = listItems.join('\n');
        }
        break;
    }
    
    setGeneratedText(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    toast({
      title: "Copied!",
      description: "Lorem ipsum text copied to clipboard.",
    });
  };

  const getWordCount = (text: string) => {
    return text.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharCount = (text: string) => {
    return text.length;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Advanced Lorem Ipsum Generator
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Generate customizable placeholder text for your designs, mockups, and layouts.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Generator Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="type">Text Type</Label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="words">Words</SelectItem>
                          <SelectItem value="sentences">Sentences</SelectItem>
                          <SelectItem value="paragraphs">Paragraphs</SelectItem>
                          <SelectItem value="list">List Items</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="count">Count</Label>
                      <Input
                        id="count"
                        type="number"
                        min="1"
                        max="1000"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                        className="mt-1"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="startWithLorem"
                          checked={startWithLorem}
                          onCheckedChange={setStartWithLorem}
                        />
                        <Label htmlFor="startWithLorem">Start with "Lorem ipsum"</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeHtml"
                          checked={includeHtml}
                          onCheckedChange={setIncludeHtml}
                        />
                        <Label htmlFor="includeHtml">Include HTML tags</Label>
                      </div>
                    </div>

                    <Button onClick={generateText} className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Text
                    </Button>
                  </CardContent>
                </Card>

                {generatedText && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Text Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Words:</span>
                        <span className="font-semibold">{getWordCount(generatedText)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Characters:</span>
                        <span className="font-semibold">{getCharCount(generatedText)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Characters (no spaces):</span>
                        <span className="font-semibold">{generatedText.replace(/\s/g, '').length}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Generated Text</CardTitle>
                      {generatedText && (
                        <Button variant="outline" onClick={copyToClipboard}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {generatedText ? (
                      <Textarea
                        value={generatedText}
                        readOnly
                        className="min-h-[400px] font-serif text-sm leading-relaxed"
                      />
                    ) : (
                      <div className="min-h-[400px] flex items-center justify-center text-gray-500">
                        Click "Generate Text" to create Lorem Ipsum content.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-12">
              <Card>
                <CardHeader>
                  <CardTitle>Common Use Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Web Design</h4>
                      <p className="text-gray-600">Fill layout mockups and wireframes with placeholder content to focus on design without being distracted by content.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Print Design</h4>
                      <p className="text-gray-600">Create brochures, flyers, and magazines with temporary text while waiting for final copy.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Development</h4>
                      <p className="text-gray-600">Test applications with realistic text content of various lengths and structures.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Presentations</h4>
                      <p className="text-gray-600">Fill slide templates with placeholder text to demonstrate layout and design concepts.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Typography</h4>
                      <p className="text-gray-600">Test font combinations and text styling with neutral content that won't influence design decisions.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Content Management</h4>
                      <p className="text-gray-600">Populate CMS templates and database schemas with sample content for testing purposes.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoremIpsumGenerator;
