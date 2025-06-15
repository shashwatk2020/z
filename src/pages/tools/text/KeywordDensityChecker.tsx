
import React, { useState, useMemo } from 'react';
import { Search, BarChart3, FileText, Download, RefreshCw } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface KeywordData {
  keyword: string;
  count: number;
  density: number;
  variants?: string[];
}

const KeywordDensityChecker = () => {
  const [inputText, setInputText] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [minWordLength, setMinWordLength] = useState(3);
  const [stopWordsEnabled, setStopWordsEnabled] = useState(true);
  const { toast } = useToast();

  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it',
    'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with', 'the', 'this', 'but', 'they',
    'have', 'had', 'what', 'said', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'up', 'out',
    'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'into', 'him',
    'time', 'two', 'more', 'go', 'no', 'way', 'could', 'my', 'than', 'first', 'been', 'call', 'who',
    'oil', 'sit', 'now', 'find', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part'
  ]);

  const textStats = useMemo(() => {
    if (!inputText.trim()) {
      return {
        totalWords: 0,
        totalCharacters: 0,
        totalCharactersNoSpaces: 0,
        totalSentences: 0,
        totalParagraphs: 0
      };
    }

    const words = inputText.trim().split(/\s+/);
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = inputText.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    return {
      totalWords: words.length,
      totalCharacters: inputText.length,
      totalCharactersNoSpaces: inputText.replace(/\s/g, '').length,
      totalSentences: sentences.length,
      totalParagraphs: paragraphs.length
    };
  }, [inputText]);

  const keywordAnalysis = useMemo(() => {
    if (!inputText.trim()) return [];

    const words = inputText.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => {
        if (word.length < minWordLength) return false;
        if (stopWordsEnabled && stopWords.has(word)) return false;
        return true;
      });

    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const totalWords = textStats.totalWords;
    
    return Object.entries(wordCount)
      .map(([keyword, count]) => ({
        keyword,
        count,
        density: totalWords > 0 ? (count / totalWords) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);
  }, [inputText, minWordLength, stopWordsEnabled, textStats.totalWords]);

  const targetKeywordAnalysis = useMemo(() => {
    if (!inputText.trim() || !targetKeyword.trim()) return null;

    const text = inputText.toLowerCase();
    const target = targetKeyword.toLowerCase().trim();
    
    // Count exact matches
    const exactMatches = (text.match(new RegExp(`\\b${target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')) || []).length;
    
    // Count partial matches (containing the keyword)
    const words = text.replace(/[^\w\s]/g, ' ').split(/\s+/);
    const partialMatches = words.filter(word => word.includes(target) && word !== target).length;
    
    const density = textStats.totalWords > 0 ? (exactMatches / textStats.totalWords) * 100 : 0;
    
    return {
      keyword: targetKeyword,
      exactMatches,
      partialMatches,
      density,
      totalMatches: exactMatches + partialMatches
    };
  }, [inputText, targetKeyword, textStats.totalWords]);

  const analyzeText = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Analysis Complete!",
      description: `Found ${keywordAnalysis.length} unique keywords in your text.`,
    });
  };

  const exportResults = () => {
    if (keywordAnalysis.length === 0) {
      toast({
        title: "No Data",
        description: "Please analyze some text first.",
        variant: "destructive",
      });
      return;
    }

    const csvContent = [
      'Keyword,Count,Density (%)',
      ...keywordAnalysis.map(item => `"${item.keyword}",${item.count},${item.density.toFixed(2)}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyword-density-analysis.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Exported!",
      description: "Keyword analysis exported as CSV file.",
    });
  };

  const reset = () => {
    setInputText('');
    setTargetKeyword('');
    setMinWordLength(3);
    setStopWordsEnabled(true);
  };

  const getDensityColor = (density: number) => {
    if (density < 1) return 'text-green-600';
    if (density < 3) return 'text-yellow-600';
    if (density < 5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getDensityLabel = (density: number) => {
    if (density < 1) return 'Low';
    if (density < 3) return 'Good';
    if (density < 5) return 'High';
    return 'Too High';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Keyword Density Checker
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Analyze keyword density in your content for SEO optimization. Check keyword frequency, density percentages, and get insights to improve your content strategy.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{textStats.totalWords}</p>
                      <p className="text-sm text-gray-600">Total Words</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{textStats.totalCharacters}</p>
                      <p className="text-sm text-gray-600">Characters</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{keywordAnalysis.length}</p>
                      <p className="text-sm text-gray-600">Unique Keywords</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="analyzer" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analyzer">Text Analyzer</TabsTrigger>
                <TabsTrigger value="keywords">Keyword Analysis</TabsTrigger>
                <TabsTrigger value="target">Target Keyword</TabsTrigger>
              </TabsList>

              <TabsContent value="analyzer" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Text Input & Settings</CardTitle>
                    <CardDescription>
                      Paste your content and configure analysis settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="input-text">Your Content</Label>
                      <Textarea
                        id="input-text"
                        placeholder="Paste your article, blog post, or any text content here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[300px] mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="min-length">Minimum Word Length</Label>
                        <Input
                          id="min-length"
                          type="number"
                          min="1"
                          max="10"
                          value={minWordLength}
                          onChange={(e) => setMinWordLength(parseInt(e.target.value) || 3)}
                          className="mt-2"
                        />
                      </div>
                      <div className="flex items-center space-x-2 mt-6">
                        <input
                          type="checkbox"
                          id="stop-words"
                          checked={stopWordsEnabled}
                          onChange={(e) => setStopWordsEnabled(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="stop-words">Exclude Stop Words</Label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={analyzeText} size="lg">
                        <Search className="h-4 w-4 mr-2" />
                        Analyze Text
                      </Button>
                      <Button onClick={exportResults} variant="outline" size="lg">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                      <Button onClick={reset} variant="outline" size="lg">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="keywords" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Keyword Density Analysis</CardTitle>
                    <CardDescription>
                      Top keywords found in your content with their frequency and density.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {keywordAnalysis.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No keywords analyzed yet. Enter some text and click "Analyze Text".</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {keywordAnalysis.slice(0, 20).map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{item.keyword}</span>
                                <Badge variant="outline">{item.count} times</Badge>
                                <Badge 
                                  variant="outline" 
                                  className={getDensityColor(item.density)}
                                >
                                  {item.density.toFixed(2)}% - {getDensityLabel(item.density)}
                                </Badge>
                              </div>
                              <Progress 
                                value={Math.min(item.density * 2, 100)} 
                                className="mt-2 h-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="target" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Target Keyword Analysis</CardTitle>
                    <CardDescription>
                      Analyze a specific keyword's performance in your content.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="target-keyword">Target Keyword</Label>
                      <Input
                        id="target-keyword"
                        placeholder="Enter your target keyword..."
                        value={targetKeyword}
                        onChange={(e) => setTargetKeyword(e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    {targetKeywordAnalysis && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-blue-600">{targetKeywordAnalysis.exactMatches}</p>
                            <p className="text-sm text-gray-600">Exact Matches</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-green-600">{targetKeywordAnalysis.partialMatches}</p>
                            <p className="text-sm text-gray-600">Partial Matches</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-purple-600">{targetKeywordAnalysis.totalMatches}</p>
                            <p className="text-sm text-gray-600">Total Occurrences</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className={`text-2xl font-bold ${getDensityColor(targetKeywordAnalysis.density)}`}>
                              {targetKeywordAnalysis.density.toFixed(2)}%
                            </p>
                            <p className="text-sm text-gray-600">Keyword Density</p>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {targetKeywordAnalysis && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold mb-2">SEO Recommendations:</h3>
                        <ul className="text-sm space-y-1">
                          {targetKeywordAnalysis.density < 0.5 && (
                            <li className="text-orange-600">• Consider increasing keyword usage (current: {targetKeywordAnalysis.density.toFixed(2)}%)</li>
                          )}
                          {targetKeywordAnalysis.density >= 0.5 && targetKeywordAnalysis.density <= 2.5 && (
                            <li className="text-green-600">• Good keyword density for SEO (current: {targetKeywordAnalysis.density.toFixed(2)}%)</li>
                          )}
                          {targetKeywordAnalysis.density > 2.5 && (
                            <li className="text-red-600">• Keyword density might be too high - consider reducing usage (current: {targetKeywordAnalysis.density.toFixed(2)}%)</li>
                          )}
                          <li className="text-gray-600">• Optimal keyword density is typically between 0.5% - 2.5%</li>
                          <li className="text-gray-600">• Use keyword variations and synonyms for better SEO</li>
                        </ul>
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

export default KeywordDensityChecker;
