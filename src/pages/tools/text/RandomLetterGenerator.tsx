
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, Shuffle, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RandomLetterGenerator = () => {
  const [count, setCount] = useState('10');
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeVowels, setIncludeVowels] = useState(true);
  const [includeConsonants, setIncludeConsonants] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [format, setFormat] = useState('single');
  const [separator, setSeparator] = useState(' ');
  const [customChars, setCustomChars] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const vowels = 'aeiouAEIOU';
  const consonants = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';
  const similarChars = 'il1Lo0O';

  const generateLetters = () => {
    const numCount = parseInt(count);
    if (isNaN(numCount) || numCount < 1 || numCount > 10000) {
      toast({
        title: "Invalid Count",
        description: "Please enter a number between 1 and 10,000",
        variant: "destructive"
      });
      return;
    }

    let availableChars = '';

    if (customChars.trim()) {
      availableChars = customChars;
    } else {
      if (includeVowels) {
        if (includeUppercase) availableChars += vowels.toUpperCase();
        if (includeLowercase) availableChars += vowels.toLowerCase();
      }
      if (includeConsonants) {
        if (includeUppercase) availableChars += consonants.toUpperCase().replace(/[AEIOU]/g, '');
        if (includeLowercase) availableChars += consonants.toLowerCase().replace(/[aeiou]/g, '');
      }
    }

    if (excludeSimilar) {
      availableChars = availableChars.split('').filter(char => !similarChars.includes(char)).join('');
    }

    if (!availableChars) {
      toast({
        title: "No Characters Available",
        description: "Please select at least one character type",
        variant: "destructive"
      });
      return;
    }

    const letters = [];
    for (let i = 0; i < numCount; i++) {
      const randomIndex = Math.floor(Math.random() * availableChars.length);
      letters.push(availableChars[randomIndex]);
    }

    let formattedResult = '';
    switch (format) {
      case 'single':
        formattedResult = letters.join('');
        break;
      case 'separated':
        formattedResult = letters.join(separator);
        break;
      case 'lines':
        formattedResult = letters.join('\n');
        break;
      case 'numbered':
        formattedResult = letters.map((letter, index) => `${index + 1}. ${letter}`).join('\n');
        break;
      case 'groups':
        const groups = [];
        for (let i = 0; i < letters.length; i += 5) {
          groups.push(letters.slice(i, i + 5).join(''));
        }
        formattedResult = groups.join(' ');
        break;
    }

    setResult(formattedResult);
    setHistory(prev => [formattedResult, ...prev.slice(0, 9)]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Letters copied to clipboard"
    });
  };

  const downloadResult = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'random-letters.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setResult('');
    setHistory([]);
  };

  const getCharacterSet = () => {
    let chars = '';
    if (customChars.trim()) return customChars;
    
    if (includeVowels) {
      if (includeUppercase) chars += 'AEIOU';
      if (includeLowercase) chars += 'aeiou';
    }
    if (includeConsonants) {
      if (includeUppercase) chars += 'BCDFGHJKLMNPQRSTVWXYZ';
      if (includeLowercase) chars += 'bcdfghjklmnpqrstvwxyz';
    }
    
    if (excludeSimilar) {
      chars = chars.split('').filter(char => !similarChars.includes(char)).join('');
    }
    
    return chars;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Random Letter Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Generate random letters with customizable options for various use cases including games, passwords, and testing.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generation Settings</CardTitle>
                  <CardDescription>Configure your random letter generation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="count">Number of Letters</Label>
                    <Input
                      id="count"
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                      placeholder="Enter number (1-10000)"
                      type="number"
                      min="1"
                      max="10000"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Character Types</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="uppercase"
                          checked={includeUppercase}
                          onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
                        />
                        <Label htmlFor="uppercase">Uppercase</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="lowercase"
                          checked={includeLowercase}
                          onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
                        />
                        <Label htmlFor="lowercase">Lowercase</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="vowels"
                          checked={includeVowels}
                          onCheckedChange={(checked) => setIncludeVowels(checked === true)}
                        />
                        <Label htmlFor="vowels">Vowels</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="consonants"
                          checked={includeConsonants}
                          onCheckedChange={(checked) => setIncludeConsonants(checked === true)}
                        />
                        <Label htmlFor="consonants">Consonants</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="excludeSimilar"
                        checked={excludeSimilar}
                        onCheckedChange={(checked) => setExcludeSimilar(checked === true)}
                      />
                      <Label htmlFor="excludeSimilar">Exclude similar characters (i, l, 1, L, o, 0, O)</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customChars">Custom Character Set (optional)</Label>
                    <Input
                      id="customChars"
                      value={customChars}
                      onChange={(e) => setCustomChars(e.target.value)}
                      placeholder="Enter custom characters"
                    />
                    <p className="text-xs text-gray-500">If provided, this will override other character options</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Output Format</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Format Style</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single string (abc)</SelectItem>
                        <SelectItem value="separated">Separated (a b c)</SelectItem>
                        <SelectItem value="lines">One per line</SelectItem>
                        <SelectItem value="numbered">Numbered list</SelectItem>
                        <SelectItem value="groups">Groups of 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {format === 'separated' && (
                    <div className="space-y-2">
                      <Label htmlFor="separator">Separator</Label>
                      <Input
                        id="separator"
                        value={separator}
                        onChange={(e) => setSeparator(e.target.value)}
                        placeholder="Enter separator"
                        maxLength={5}
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button onClick={generateLetters} className="flex-1">
                      <Shuffle className="h-4 w-4 mr-2" />
                      Generate Letters
                    </Button>
                    <Button variant="outline" onClick={clearAll}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Letters</CardTitle>
                  <CardDescription>Your random letters will appear here</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="min-h-[200px] p-4 bg-gray-50 rounded-lg border font-mono text-lg">
                      {result || 'Click "Generate Letters" to create random letters'}
                    </div>
                    
                    {result && (
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">
                          {result.replace(/[\s\n]/g, '').length} letters
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(result)}>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm" onClick={downloadResult}>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Character Set Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-blue-50 rounded-lg border">
                    <p className="text-sm text-gray-600 mb-2">Available characters:</p>
                    <p className="font-mono text-sm break-all">
                      {getCharacterSet() || 'No characters selected'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Total: {getCharacterSet().length} characters
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {history.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Generation History</CardTitle>
                    <CardDescription>Recent generations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {history.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <span className="font-mono truncate mr-2">
                            {item.length > 30 ? item.substring(0, 30) + '...' : item}
                          </span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(item)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RandomLetterGenerator;
