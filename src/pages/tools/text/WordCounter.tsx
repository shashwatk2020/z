
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Copy, Download, RefreshCw, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WordCounter = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    mostCommonWord: '',
    averageWordsPerSentence: 0,
    readingTime: 0,
    speakingTime: 0
  });
  const [wordFrequency, setWordFrequency] = useState<Array<{word: string, count: number}>>([]);
  const { toast } = useToast();

  useEffect(() => {
    calculateStats();
  }, [text]);

  const calculateStats = () => {
    if (!text.trim()) {
      setStats({
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        mostCommonWord: '',
        averageWordsPerSentence: 0,
        readingTime: 0,
        speakingTime: 0
      });
      setWordFrequency([]);
      return;
    }

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const lines = text.split('\n').length;
    
    // Calculate word frequency
    const wordArray = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const frequency: {[key: string]: number} = {};
    wordArray.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    const sortedWords = Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({word, count}));
    
    setWordFrequency(sortedWords);
    
    const mostCommonWord = sortedWords[0]?.word || '';
    const averageWordsPerSentence = sentences > 0 ? Math.round((words / sentences) * 10) / 10 : 0;
    const readingTime = Math.ceil(words / 200); // 200 WPM average reading speed
    const speakingTime = Math.ceil(words / 150); // 150 WPM average speaking speed

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      mostCommonWord,
      averageWordsPerSentence,
      readingTime,
      speakingTime
    });
  };

  const copyStats = () => {
    const statsText = `
Text Statistics:
- Characters: ${stats.characters}
- Characters (no spaces): ${stats.charactersNoSpaces}
- Words: ${stats.words}
- Sentences: ${stats.sentences}
- Paragraphs: ${stats.paragraphs}
- Lines: ${stats.lines}
- Most common word: ${stats.mostCommonWord}
- Average words per sentence: ${stats.averageWordsPerSentence}
- Reading time: ${stats.readingTime} minutes
- Speaking time: ${stats.speakingTime} minutes
    `.trim();
    
    navigator.clipboard.writeText(statsText);
    toast({
      title: "Copied!",
      description: "Statistics copied to clipboard"
    });
  };

  const downloadReport = () => {
    const report = `
TEXT ANALYSIS REPORT
===================

BASIC STATISTICS:
- Characters: ${stats.characters}
- Characters (no spaces): ${stats.charactersNoSpaces}
- Words: ${stats.words}
- Sentences: ${stats.sentences}
- Paragraphs: ${stats.paragraphs}
- Lines: ${stats.lines}

ADVANCED STATISTICS:
- Most common word: "${stats.mostCommonWord}"
- Average words per sentence: ${stats.averageWordsPerSentence}
- Reading time: ${stats.readingTime} minutes (200 WPM)
- Speaking time: ${stats.speakingTime} minutes (150 WPM)

WORD FREQUENCY (Top 10):
${wordFrequency.map((item, index) => `${index + 1}. "${item.word}" - ${item.count} times`).join('\n')}

ORIGINAL TEXT:
${text}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-analysis-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearText = () => {
    setText('');
  };

  const getCharacterProgress = () => {
    const limits = [160, 280, 500, 1000];
    const currentLimit = limits.find(limit => stats.characters <= limit) || limits[limits.length - 1];
    return (stats.characters / currentLimit) * 100;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Word Counter & Text Analyzer
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get comprehensive text statistics including word frequency, reading time, and detailed analysis.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Text Input</CardTitle>
                  <CardDescription>Paste or type your text for analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="text">Your Text</Label>
                      <Textarea
                        id="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Start typing or paste your text here..."
                        className="min-h-[400px] text-base leading-relaxed"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={clearText}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                      <Button variant="outline" onClick={copyStats}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Stats
                      </Button>
                      <Button variant="outline" onClick={downloadReport}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.characters}</div>
                      <div className="text-sm text-gray-600">Characters</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.words}</div>
                      <div className="text-sm text-gray-600">Words</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{stats.sentences}</div>
                      <div className="text-sm text-gray-600">Sentences</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{stats.paragraphs}</div>
                      <div className="text-sm text-gray-600">Paragraphs</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Character Limit Progress</span>
                      <span>{stats.characters}/1000</span>
                    </div>
                    <Progress value={getCharacterProgress()} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Characters (no spaces):</span>
                    <Badge variant="secondary">{stats.charactersNoSpaces}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lines:</span>
                    <Badge variant="secondary">{stats.lines}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Most common word:</span>
                    <Badge variant="outline">{stats.mostCommonWord || 'N/A'}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg words/sentence:</span>
                    <Badge variant="secondary">{stats.averageWordsPerSentence}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reading time:</span>
                    <Badge variant="outline">{stats.readingTime} min</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Speaking time:</span>
                    <Badge variant="outline">{stats.speakingTime} min</Badge>
                  </div>
                </CardContent>
              </Card>
              
              {wordFrequency.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Word Frequency</CardTitle>
                    <CardDescription>Most used words</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {wordFrequency.slice(0, 5).map((item, index) => (
                        <div key={item.word} className="flex justify-between items-center">
                          <span className="text-sm">{index + 1}. {item.word}</span>
                          <Badge variant="secondary">{item.count}</Badge>
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

export default WordCounter;
