
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TextArtGenerator = () => {
  const [text, setText] = useState('HELLO');
  const [results, setResults] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const asciiStyles = {
    'block': {
      'A': '██████\n██  ██\n██████\n██  ██\n██  ██',
      'B': '██████\n██  ██\n██████\n██  ██\n██████',
      'C': '██████\n██    \n██    \n██    \n██████',
      'D': '██████\n██  ██\n██  ██\n██  ██\n██████',
      'E': '██████\n██    \n██████\n██    \n██████',
      'F': '██████\n██    \n██████\n██    \n██    ',
      'G': '██████\n██    \n██ ███\n██  ██\n██████',
      'H': '██  ██\n██  ██\n██████\n██  ██\n██  ██',
      'I': '██████\n  ██  \n  ██  \n  ██  \n██████',
      'J': '██████\n    ██\n    ██\n██  ██\n██████',
      'K': '██  ██\n██ ██ \n████  \n██ ██ \n██  ██',
      'L': '██    \n██    \n██    \n██    \n██████',
      'M': '██  ██\n██████\n██████\n██  ██\n██  ██',
      'N': '██████\n██  ██\n██  ██\n██  ██\n██  ██',
      'O': '██████\n██  ██\n██  ██\n██  ██\n██████',
      'P': '██████\n██  ██\n██████\n██    \n██    ',
      'Q': '██████\n██  ██\n██  ██\n██ ███\n██████',
      'R': '██████\n██  ██\n██████\n██ ██ \n██  ██',
      'S': '██████\n██    \n██████\n    ██\n██████',
      'T': '██████\n  ██  \n  ██  \n  ██  \n  ██  ',
      'U': '██  ██\n██  ██\n██  ██\n██  ██\n██████',
      'V': '██  ██\n██  ██\n██  ██\n ████ \n  ██  ',
      'W': '██  ██\n██  ██\n██████\n██████\n██  ██',
      'X': '██  ██\n ████ \n  ██  \n ████ \n██  ██',
      'Y': '██  ██\n██  ██\n ████ \n  ██  \n  ██  ',
      'Z': '██████\n    ██\n  ██  \n██    \n██████',
      ' ': '      \n      \n      \n      \n      '
    },
    'banner': {
      'A': ' █████╗ \n██╔══██╗\n███████║\n██╔══██║\n██║  ██║',
      'B': '██████╗ \n██╔══██╗\n██████╔╝\n██╔══██╗\n██████╔╝',
      'C': ' ██████╗\n██╔════╝\n██║     \n██║     \n╚██████╗',
      'D': '██████╗ \n██╔══██╗\n██║  ██║\n██║  ██║\n██████╔╝',
      'E': '███████╗\n██╔════╝\n█████╗  \n██╔══╝  \n███████╗',
      'F': '███████╗\n██╔════╝\n█████╗  \n██╔══╝  \n██║     ',
      'G': ' ██████╗ \n██╔════╝ \n██║  ███╗\n██║   ██║\n╚██████╔╝',
      'H': '██╗  ██╗\n██║  ██║\n███████║\n██╔══██║\n██║  ██║',
      'I': '██╗\n██║\n██║\n██║\n██║',
      'J': '     ██╗\n     ██║\n     ██║\n██   ██║\n╚██████╔╝',
      'K': '██╗  ██╗\n██║ ██╔╝\n█████╔╝ \n██╔═██╗ \n██║  ██╗',
      'L': '██╗     \n██║     \n██║     \n██║     \n███████╗',
      'M': '███╗   ███╗\n████╗ ████║\n██╔████╔██║\n██║╚██╔╝██║\n██║ ╚═╝ ██║',
      'N': '███╗   ██╗\n████╗  ██║\n██╔██╗ ██║\n██║╚██╗██║\n██║ ╚████║',
      'O': ' ██████╗ \n██╔═══██╗\n██║   ██║\n██║   ██║\n╚██████╔╝',
      'P': '██████╗ \n██╔══██╗\n██████╔╝\n██╔═══╝ \n██║     ',
      'Q': ' ██████╗ \n██╔═══██╗\n██║   ██║\n██║▄▄ ██║\n╚██████╔╝',
      'R': '██████╗ \n██╔══██╗\n██████╔╝\n██╔══██╗\n██║  ██║',
      'S': '███████╗\n██╔════╝\n███████╗\n╚════██║\n███████║',
      'T': '████████╗\n╚══██╔══╝\n   ██║   \n   ██║   \n   ██║   ',
      'U': '██╗   ██╗\n██║   ██║\n██║   ██║\n██║   ██║\n╚██████╔╝',
      'V': '██╗   ██╗\n██║   ██║\n██║   ██║\n╚██╗ ██╔╝\n ╚████╔╝ ',
      'W': '██╗    ██╗\n██║    ██║\n██║ █╗ ██║\n██║███╗██║\n╚███╔███╔╝',
      'X': '██╗  ██╗\n╚██╗██╔╝\n ╚███╔╝ \n ██╔██╗ \n██╔╝ ██╗',
      'Y': '██╗   ██╗\n╚██╗ ██╔╝\n ╚████╔╝ \n  ╚██╔╝  \n   ██║   ',
      'Z': '███████╗\n╚══███╔╝\n  ███╔╝ \n ███╔╝  \n███████╗',
      ' ': '     \n     \n     \n     \n     '
    }
  };

  const generateArt = (style: 'block' | 'banner') => {
    const lines = ['', '', '', '', ''];
    const chars = text.toUpperCase().split('');
    
    chars.forEach((char, index) => {
      const pattern = asciiStyles[style][char as keyof typeof asciiStyles[typeof style]] || asciiStyles[style][' '];
      const charLines = pattern.split('\n');
      
      charLines.forEach((line, lineIndex) => {
        lines[lineIndex] += line + (index < chars.length - 1 ? '  ' : '');
      });
    });
    
    return lines.join('\n');
  };

  const generateBorder = (content: string, style: string) => {
    const lines = content.split('\n');
    const maxLength = Math.max(...lines.map(line => line.length));
    
    let borderChar = '';
    switch (style) {
      case 'stars': borderChar = '*'; break;
      case 'equals': borderChar = '='; break;
      case 'dashes': borderChar = '-'; break;
      case 'dots': borderChar = '.'; break;
      default: borderChar = '#';
    }
    
    const border = borderChar.repeat(maxLength + 4);
    const paddedLines = lines.map(line => `${borderChar} ${line.padEnd(maxLength)} ${borderChar}`);
    
    return [border, ...paddedLines, border].join('\n');
  };

  const generateAllStyles = () => {
    const newResults: {[key: string]: string} = {};
    
    // Basic ASCII styles
    newResults['Block Style'] = generateArt('block');
    newResults['Banner Style'] = generateArt('banner');
    
    // With borders
    newResults['Block with Stars'] = generateBorder(generateArt('block'), 'stars');
    newResults['Banner with Equals'] = generateBorder(generateArt('banner'), 'equals');
    newResults['Block with Dashes'] = generateBorder(generateArt('block'), 'dashes');
    
    // Simple styles
    newResults['Double Line'] = text.toUpperCase().split('').join('  ').repeat(1) + '\n' + '═'.repeat(text.length * 3);
    newResults['Underlined'] = text.toUpperCase() + '\n' + '─'.repeat(text.length);
    newResults['Boxed'] = `┌${'─'.repeat(text.length + 2)}┐\n│ ${text.toUpperCase()} │\n└${'─'.repeat(text.length + 2)}┘`;
    
    setResults(newResults);
  };

  const copyToClipboard = (content: string, styleName: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: `${styleName} copied to clipboard.`,
    });
  };

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `${filename} has been downloaded.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Text Art Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Convert your text into beautiful ASCII art with various styles and borders. Perfect for banners, headers, and decorative text.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">ASCII Art</Badge>
              <Badge variant="secondary">Multiple Styles</Badge>
              <Badge variant="secondary">Borders</Badge>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Text Input</CardTitle>
              <CardDescription>
                Enter your text to convert to ASCII art (works best with short text)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="text-input">Your Text</Label>
                <Input
                  id="text-input"
                  placeholder="Enter text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="text-lg mt-2"
                  maxLength={20}
                />
                <p className="text-sm text-gray-500 mt-1">Maximum 20 characters for best results</p>
              </div>
              
              <Button onClick={generateAllStyles} size="lg" disabled={!text.trim()}>
                Generate ASCII Art
              </Button>
            </CardContent>
          </Card>

          {Object.keys(results).length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Generated ASCII Art</h2>
              
              <Tabs defaultValue="styles" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="styles">Art Styles</TabsTrigger>
                  <TabsTrigger value="simple">Simple Styles</TabsTrigger>
                </TabsList>
                
                <TabsContent value="styles" className="space-y-6">
                  {Object.entries(results)
                    .filter(([name]) => ['Block Style', 'Banner Style', 'Block with Stars', 'Banner with Equals', 'Block with Dashes'].includes(name))
                    .map(([name, art]) => (
                    <Card key={name}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{name}</CardTitle>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(art, name)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadAsFile(art, name.toLowerCase().replace(/\s+/g, '-'))}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs font-mono whitespace-pre">
                          {art}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="simple" className="space-y-6">
                  {Object.entries(results)
                    .filter(([name]) => ['Double Line', 'Underlined', 'Boxed'].includes(name))
                    .map(([name, art]) => (
                    <Card key={name}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{name}</CardTitle>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(art, name)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadAsFile(art, name.toLowerCase().replace(/\s+/g, '-'))}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre">
                          {art}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TextArtGenerator;
