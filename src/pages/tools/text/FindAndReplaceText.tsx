
import React, { useState, useCallback } from 'react';
import { Copy, RotateCcw, Search, Replace, AlertCircle, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const FindAndReplaceText = () => {
  const [inputText, setInputText] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [result, setResult] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);
  const [replacementHistory, setReplacementHistory] = useState<Array<{
    find: string;
    replace: string;
    matches: number;
    timestamp: Date;
  }>>([]);
  const { toast } = useToast();

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const createSearchRegex = useCallback((searchText: string) => {
    try {
      let pattern = searchText;
      
      if (!useRegex) {
        pattern = escapeRegExp(searchText);
      }
      
      if (wholeWord && !useRegex) {
        pattern = `\\b${pattern}\\b`;
      }
      
      const flags = caseSensitive ? 'g' : 'gi';
      return new RegExp(pattern, flags);
    } catch (error) {
      throw new Error('Invalid regular expression');
    }
  }, [caseSensitive, wholeWord, useRegex]);

  const findMatches = useCallback(() => {
    if (!inputText || !findText) {
      setResult('');
      setMatchCount(0);
      return;
    }

    try {
      const regex = createSearchRegex(findText);
      const matches = inputText.match(regex);
      const count = matches ? matches.length : 0;
      setMatchCount(count);

      if (highlightMode) {
        const highlighted = inputText.replace(regex, (match) => `🔍${match}🔍`);
        setResult(highlighted);
      } else {
        setResult(inputText);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid search pattern. Please check your input.",
        variant: "destructive",
      });
      setResult('');
      setMatchCount(0);
    }
  }, [inputText, findText, createSearchRegex, highlightMode, toast]);

  const performReplace = useCallback(() => {
    if (!inputText || !findText) {
      toast({
        title: "Missing Input",
        description: "Please enter both text to search and find text.",
        variant: "destructive",
      });
      return;
    }

    try {
      const regex = createSearchRegex(findText);
      const matches = inputText.match(regex);
      const count = matches ? matches.length : 0;
      
      if (count === 0) {
        toast({
          title: "No Matches",
          description: "No matches found for the search text.",
          variant: "destructive",
        });
        return;
      }

      const replaced = inputText.replace(regex, replaceText);
      setResult(replaced);
      setMatchCount(count);

      // Add to history
      const historyEntry = {
        find: findText,
        replace: replaceText,
        matches: count,
        timestamp: new Date()
      };
      setReplacementHistory(prev => [historyEntry, ...prev.slice(0, 9)]);

      toast({
        title: "Replace Complete",
        description: `Replaced ${count} occurrence${count !== 1 ? 's' : ''}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid search pattern. Please check your input.",
        variant: "destructive",
      });
    }
  }, [inputText, findText, replaceText, createSearchRegex, toast]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const reset = () => {
    setInputText('');
    setFindText('');
    setReplaceText('');
    setResult('');
    setMatchCount(0);
    setCaseSensitive(false);
    setWholeWord(false);
    setUseRegex(false);
    setHighlightMode(false);
  };

  const useHistoryEntry = (entry: typeof replacementHistory[0]) => {
    setFindText(entry.find);
    setReplaceText(entry.replace);
  };

  const examples = [
    {
      name: "Basic Text Replacement",
      input: "Hello world! This is a wonderful world.",
      find: "world",
      replace: "universe",
      description: "Replace all occurrences of 'world' with 'universe'"
    },
    {
      name: "Remove Extra Spaces",
      input: "This  text  has   multiple    spaces.",
      find: "\\s+",
      replace: " ",
      regex: true,
      description: "Remove extra spaces using regex"
    },
    {
      name: "Format Phone Numbers",
      input: "Call me at 1234567890 or 9876543210",
      find: "(\\d{3})(\\d{3})(\\d{4})",
      replace: "($1) $2-$3",
      regex: true,
      description: "Format phone numbers with regex capture groups"
    },
    {
      name: "Clean HTML Tags",
      input: "<p>This is <strong>bold</strong> text.</p>",
      find: "<[^>]*>",
      replace: "",
      regex: true,
      description: "Remove HTML tags using regex"
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
                Find and Replace Text
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Advanced text search and replacement tool with regex support, case sensitivity options, and batch operations. Perfect for text processing and data cleaning.
              </p>
            </div>

            <Tabs defaultValue="tool" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tool">Find & Replace</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="tool" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Search className="h-5 w-5" />
                      <span>Text Input</span>
                    </CardTitle>
                    <CardDescription>
                      Enter the text you want to search and replace within.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="input-text">Source Text</Label>
                      <Textarea
                        id="input-text"
                        placeholder="Enter your text here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[200px] mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Replace className="h-5 w-5" />
                      <span>Search & Replace Options</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="find-text">Find Text</Label>
                        <Input
                          id="find-text"
                          placeholder="Text to find..."
                          value={findText}
                          onChange={(e) => setFindText(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="replace-text">Replace With</Label>
                        <Input
                          id="replace-text"
                          placeholder="Replacement text..."
                          value={replaceText}
                          onChange={(e) => setReplaceText(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="case-sensitive"
                          checked={caseSensitive}
                          onCheckedChange={(checked) => setCaseSensitive(checked as boolean)}
                        />
                        <Label htmlFor="case-sensitive" className="text-sm">Case Sensitive</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="whole-word"
                          checked={wholeWord}
                          onCheckedChange={(checked) => setWholeWord(checked as boolean)}
                        />
                        <Label htmlFor="whole-word" className="text-sm">Whole Word</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="use-regex"
                          checked={useRegex}
                          onCheckedChange={(checked) => setUseRegex(checked as boolean)}
                        />
                        <Label htmlFor="use-regex" className="text-sm">Use Regex</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="highlight-mode"
                          checked={highlightMode}
                          onCheckedChange={(checked) => setHighlightMode(checked as boolean)}
                        />
                        <Label htmlFor="highlight-mode" className="text-sm">Highlight Only</Label>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button onClick={findMatches} variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-2" />
                        Find Matches
                      </Button>
                      <Button onClick={performReplace} size="sm">
                        <Replace className="h-4 w-4 mr-2" />
                        Replace All
                      </Button>
                      <Button onClick={reset} variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>

                    {matchCount > 0 && (
                      <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">
                          Found {matchCount} match{matchCount !== 1 ? 'es' : ''}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {result && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Result</span>
                        <Button
                          onClick={() => copyToClipboard(result)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <Textarea
                          value={result}
                          readOnly
                          className="min-h-[200px] font-mono text-sm"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="examples" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Examples</CardTitle>
                    <CardDescription>
                      Click on any example to load it into the tool.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {examples.map((example, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            setInputText(example.input);
                            setFindText(example.find);
                            setReplaceText(example.replace);
                            setUseRegex(example.regex || false);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h3 className="font-medium">{example.name}</h3>
                              <p className="text-sm text-gray-600">{example.description}</p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">Find: {example.find}</Badge>
                                <Badge variant="outline">Replace: {example.replace}</Badge>
                                {example.regex && <Badge variant="secondary">Regex</Badge>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Replacement History</CardTitle>
                    <CardDescription>
                      Your recent find and replace operations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {replacementHistory.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>No replacements performed yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {replacementHistory.map((entry, index) => (
                          <div
                            key={index}
                            className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => useHistoryEntry(entry)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">Find: {entry.find}</Badge>
                                  <Badge variant="outline">Replace: {entry.replace}</Badge>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {entry.matches} replacement{entry.matches !== 1 ? 's' : ''} • {entry.timestamp.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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

export default FindAndReplaceText;
