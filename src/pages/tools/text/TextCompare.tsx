
import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, RotateCcw, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as Diff from 'diff';

const TextCompare = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const { toast } = useToast();

  const diffResults = useMemo(() => {
    const wordDiff = Diff.diffWords(text1, text2);
    const lineDiff = Diff.diffLines(text1, text2);
    const charDiff = Diff.diffChars(text1, text2);
    
    return {
      words: wordDiff,
      lines: lineDiff,
      characters: charDiff
    };
  }, [text1, text2]);

  const renderDiff = (diff: Diff.Change[]) => {
    return diff.map((part, index) => {
      const className = part.added 
        ? 'bg-green-200 text-green-800' 
        : part.removed 
        ? 'bg-red-200 text-red-800' 
        : 'bg-gray-100';
      
      return (
        <span key={index} className={className}>
          {part.value}
        </span>
      );
    });
  };

  const getStats = () => {
    const additions = diffResults.words.filter(part => part.added).reduce((acc, part) => acc + part.value.split(/\s+/).length, 0);
    const deletions = diffResults.words.filter(part => part.removed).reduce((acc, part) => acc + part.value.split(/\s+/).length, 0);
    const unchanged = diffResults.words.filter(part => !part.added && !part.removed).reduce((acc, part) => acc + part.value.split(/\s+/).length, 0);
    
    return { additions, deletions, unchanged };
  };

  const stats = getStats();

  const copyDiff = (type: string) => {
    const diffText = diffResults[type as keyof typeof diffResults]
      .map(part => {
        if (part.added) return `+ ${part.value}`;
        if (part.removed) return `- ${part.value}`;
        return part.value;
      })
      .join('');

    navigator.clipboard.writeText(diffText);
    toast({
      title: "Copied!",
      description: `${type} diff copied to clipboard.`,
    });
  };

  const handleFileUpload = (textSetter: (text: string) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        textSetter(content);
      };
      reader.readAsText(file);
    }
  };

  const clearAll = () => {
    setText1('');
    setText2('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Text Compare (Diff Checker)
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Compare two texts and see the differences highlighted. Perfect for document versioning, code reviews, and content analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Word Diff</Badge>
              <Badge variant="secondary">Line Diff</Badge>
              <Badge variant="secondary">Character Diff</Badge>
            </div>
          </div>

          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Original Text</CardTitle>
                <CardDescription>Enter or upload the first text to compare</CardDescription>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload-1')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
                <input
                  id="file-upload-1"
                  type="file"
                  accept=".txt,.md"
                  onChange={handleFileUpload(setText1)}
                  className="hidden"
                />
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter original text here..."
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                  className="min-h-[200px] text-sm font-mono"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modified Text</CardTitle>
                <CardDescription>Enter or upload the second text to compare</CardDescription>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload-2')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
                <input
                  id="file-upload-2"
                  type="file"
                  accept=".txt,.md"
                  onChange={handleFileUpload(setText2)}
                  className="hidden"
                />
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter modified text here..."
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  className="min-h-[200px] text-sm font-mono"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mb-8">
            <Button onClick={clearAll} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>

          {/* Statistics */}
          {(text1 || text2) && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Comparison Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.additions}</div>
                    <div className="text-sm text-green-800">Words Added</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{stats.deletions}</div>
                    <div className="text-sm text-red-800">Words Removed</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{stats.unchanged}</div>
                    <div className="text-sm text-gray-800">Words Unchanged</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Diff Results */}
          {(text1 || text2) && (
            <Card>
              <CardHeader>
                <CardTitle>Comparison Results</CardTitle>
                <CardDescription>
                  Red highlights show deletions, green highlights show additions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="words" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="words">Word Diff</TabsTrigger>
                    <TabsTrigger value="lines">Line Diff</TabsTrigger>
                    <TabsTrigger value="characters">Character Diff</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="words" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Word-by-Word Comparison</h3>
                      <Button variant="outline" size="sm" onClick={() => copyDiff('words')}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Diff
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg bg-white text-sm font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {renderDiff(diffResults.words)}
                    </div>
                  </TabsContent>

                  <TabsContent value="lines" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Line-by-Line Comparison</h3>
                      <Button variant="outline" size="sm" onClick={() => copyDiff('lines')}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Diff
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg bg-white text-sm font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {renderDiff(diffResults.lines)}
                    </div>
                  </TabsContent>

                  <TabsContent value="characters" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Character-by-Character Comparison</h3>
                      <Button variant="outline" size="sm" onClick={() => copyDiff('characters')}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Diff
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg bg-white text-sm font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {renderDiff(diffResults.characters)}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TextCompare;
