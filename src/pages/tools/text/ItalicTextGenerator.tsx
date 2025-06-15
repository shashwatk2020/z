
import React, { useState } from 'react';
import { Copy, RotateCcw, Type, Italic, Sparkles, Download } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const ItalicTextGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<Array<{name: string, text: string, description: string}>>([]);
  const { toast } = useToast();

  const italicStyles = [
    {
      name: 'Mathematical Italic',
      transform: (text: string) => {
        const italicMap: {[key: string]: string} = {
          'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ', 'i': '𝑖', 'j': '𝑗',
          'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝', 'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡',
          'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥', 'y': '𝑦', 'z': '𝑧',
          'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺', 'H': '𝐻', 'I': '𝐼', 'J': '𝐽',
          'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇',
          'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝑍'
        };
        return text.split('').map(char => italicMap[char] || char).join('');
      },
      description: 'Mathematical italic Unicode characters'
    },
    {
      name: 'Bold Italic',
      transform: (text: string) => {
        const boldItalicMap: {[key: string]: string} = {
          'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
          'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
          'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
          'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
          'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
          'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁'
        };
        return text.split('').map(char => boldItalicMap[char] || char).join('');
      },
      description: 'Bold italic Unicode characters'
    },
    {
      name: 'Sans-Serif Italic',
      transform: (text: string) => {
        const sansItalicMap: {[key: string]: string} = {
          'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫',
          'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵',
          'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻',
          'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑',
          'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛',
          'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡'
        };
        return text.split('').map(char => sansItalicMap[char] || char).join('');
      },
      description: 'Sans-serif italic Unicode characters'
    },
    {
      name: 'Script/Cursive',
      transform: (text: string) => {
        const scriptMap: {[key: string]: string} = {
          'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': 'ℯ', 'f': '𝒻', 'g': 'ℊ', 'h': '𝒽', 'i': '𝒾', 'j': '𝒿',
          'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': 'ℴ', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉',
          'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏',
          'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥',
          'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯',
          'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵'
        };
        return text.split('').map(char => scriptMap[char] || char).join('');
      },
      description: 'Elegant script/cursive style'
    },
    {
      name: 'Emphasized Slant',
      transform: (text: string) => {
        return text.split('').map(char => {
          if (/[a-zA-Z]/.test(char)) {
            return char + '͎';
          }
          return char;
        }).join('');
      },
      description: 'Text with slant emphasis marks'
    },
    {
      name: 'HTML Italic',
      transform: (text: string) => `<i>${text}</i>`,
      description: 'HTML italic tags'
    },
    {
      name: 'Markdown Italic',
      transform: (text: string) => `*${text}*`,
      description: 'Markdown italic formatting'
    },
    {
      name: 'CSS Italic',
      transform: (text: string) => `<span style="font-style: italic;">${text}</span>`,
      description: 'CSS styled italic text'
    }
  ];

  const generateItalicText = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to convert.",
        variant: "destructive",
      });
      return;
    }

    const generatedResults = italicStyles.map(style => ({
      name: style.name,
      text: style.transform(inputText),
      description: style.description
    }));

    setResults(generatedResults);
    
    toast({
      title: "Success!",
      description: `Generated ${generatedResults.length} italic text variations.`,
    });
  };

  const copyToClipboard = async (text: string, styleName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${styleName} copied to clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadAsFile = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `${filename} has been downloaded.`,
    });
  };

  const reset = () => {
    setInputText('');
    setResults([]);
  };

  const examples = [
    {
      text: "Hello World",
      description: "Simple greeting"
    },
    {
      text: "The quick brown fox jumps over the lazy dog",
      description: "Pangram containing all letters"
    },
    {
      text: "Welcome to our website!",
      description: "Website welcome message"
    },
    {
      text: "Typography matters in design",
      description: "Design quote"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Italic Text Generator
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Transform your text into beautiful italic styles using Unicode characters, HTML, Markdown, and CSS formatting. Perfect for social media, documents, and web design.
              </p>
            </div>

            <Tabs defaultValue="generator" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generator">Text Generator</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>

              <TabsContent value="generator" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Type className="h-5 w-5" />
                      <span>Text Input</span>
                    </CardTitle>
                    <CardDescription>
                      Enter the text you want to convert to italic styles.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="input-text">Your Text</Label>
                      <Textarea
                        id="input-text"
                        placeholder="Enter your text here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[120px] mt-2"
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={generateItalicText} size="lg">
                        <Italic className="h-4 w-4 mr-2" />
                        Generate Italic Text
                      </Button>
                      <Button onClick={reset} variant="outline" size="lg">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {results.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Generated Italic Text Styles</h2>
                    {results.map((result, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{result.name}</CardTitle>
                              <CardDescription>{result.description}</CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => copyToClipboard(result.text, result.name)}
                                variant="outline"
                                size="sm"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </Button>
                              <Button
                                onClick={() => downloadAsFile(result.text, result.name.toLowerCase().replace(/\s+/g, '-'))}
                                variant="outline"
                                size="sm"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-lg break-all font-serif" style={{fontStyle: 'italic'}}>
                              {result.text}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="examples" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5" />
                      <span>Example Texts</span>
                    </CardTitle>
                    <CardDescription>
                      Click on any example to load it into the generator.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {examples.map((example, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => setInputText(example.text)}
                        >
                          <div className="space-y-2">
                            <p className="font-medium">{example.text}</p>
                            <p className="text-sm text-gray-600">{example.description}</p>
                            <Badge variant="outline">Click to use</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ItalicTextGenerator;
