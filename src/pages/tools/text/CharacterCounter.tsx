
import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, RotateCcw, FileText, Hash, Type } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CharacterCounter = () => {
  const [inputText, setInputText] = useState('');
  const [characterLimit, setCharacterLimit] = useState(280);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  const textAnalysis = useMemo(() => {
    const text = inputText;
    const lines = text.split('\n');
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.trim() ? text.trim().split(/\s+/).filter(word => word.length > 0) : [];
    
    // Character counts
    const totalCharacters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const charactersNoSpacesNoPunctuation = text.replace(/[\s\W]/g, '').length;
    
    // Advanced analysis
    const uniqueWords = new Set(words.map(word => word.toLowerCase().replace(/[^\w]/g, '')));
    const averageWordsPerSentence = sentences.length > 0 ? (words.length / sentences.length).toFixed(1) : '0';
    const averageCharsPerWord = words.length > 0 ? (charactersNoSpaces / words.length).toFixed(1) : '0';
    const readingTime = Math.ceil(words.length / 200); // Average 200 words per minute
    
    // Social media limits
    const socialLimits = {
      twitter: { limit: 280, remaining: 280 - totalCharacters },
      facebook: { limit: 63206, remaining: 63206 - totalCharacters },
      instagram: { limit: 2200, remaining: 2200 - totalCharacters },
      linkedin: { limit: 3000, remaining: 3000 - totalCharacters },
      youtube: { limit: 5000, remaining: 5000 - totalCharacters },
      tiktok: { limit: 300, remaining: 300 - totalCharacters }
    };
    
    // Character frequency
    const charFrequency = {};
    for (const char of text.toLowerCase()) {
      if (char.match(/[a-z]/)) {
        charFrequency[char] = (charFrequency[char] || 0) + 1;
      }
    }
    
    // Word frequency (top 10)
    const wordFrequency = {};
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 2) { // Only words longer than 2 characters
        wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
      }
    });
    const topWords = Object.entries(wordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    return {
      totalCharacters,
      charactersNoSpaces,
      charactersNoSpacesNoPunctuation,
      words: words.length,
      uniqueWords: uniqueWords.size,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      lines: lines.length,
      averageWordsPerSentence,
      averageCharsPerWord,
      readingTime,
      socialLimits,
      charFrequency,
      topWords
    };
  }, [inputText]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Text has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy text to clipboard.",
        variant: "destructive"
      });
    }
  };

  const downloadAsFile = () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to download",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    const analysis = `Text Analysis Report
====================

Original Text:
${inputText}

Basic Counts:
- Total Characters: ${textAnalysis.totalCharacters}
- Characters (no spaces): ${textAnalysis.charactersNoSpaces}
- Characters (no spaces/punctuation): ${textAnalysis.charactersNoSpacesNoPunctuation}
- Words: ${textAnalysis.words}
- Unique Words: ${textAnalysis.uniqueWords}
- Sentences: ${textAnalysis.sentences}
- Paragraphs: ${textAnalysis.paragraphs}
- Lines: ${textAnalysis.lines}

Advanced Analysis:
- Average Words per Sentence: ${textAnalysis.averageWordsPerSentence}
- Average Characters per Word: ${textAnalysis.averageCharsPerWord}
- Estimated Reading Time: ${textAnalysis.readingTime} minute(s)

Social Media Compatibility:
- Twitter: ${textAnalysis.socialLimits.twitter.remaining} characters remaining
- Instagram: ${textAnalysis.socialLimits.instagram.remaining} characters remaining
- LinkedIn: ${textAnalysis.socialLimits.linkedin.remaining} characters remaining
- TikTok: ${textAnalysis.socialLimits.tiktok.remaining} characters remaining

Generated on: ${new Date().toLocaleString()}
`;

    const element = document.createElement('a');
    const file = new Blob([analysis], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'text-analysis-report.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Analysis downloaded",
      description: "The text analysis report has been downloaded.",
    });
  };

  const clearAll = () => {
    setInputText('');
  };

  const getSocialMediaStatus = (platform, limit, remaining) => {
    const percentage = ((limit - remaining) / limit) * 100;
    if (remaining < 0) return 'over';
    if (percentage > 90) return 'warning';
    if (percentage > 75) return 'caution';
    return 'good';
  };

  const getSocialMediaColor = (status) => {
    switch (status) {
      case 'over': return 'bg-red-500';
      case 'warning': return 'bg-orange-500';
      case 'caution': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold">Advanced Character Counter & Text Analyzer</CardTitle>
              <CardDescription>
                Comprehensive text analysis tool with character counting, word frequency analysis, social media compatibility checks, and reading time estimation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Section */}
              <div className="space-y-2">
                <Label htmlFor="input-text" className="text-lg font-semibold">Input Text</Label>
                <Textarea
                  id="input-text"
                  placeholder="Type or paste your text here to analyze..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] text-base"
                />
                
                {/* Character Limit Settings */}
                <div className="flex items-center gap-4 pt-2">
                  <Label htmlFor="char-limit" className="text-sm font-medium">Custom Character Limit:</Label>
                  <Input
                    id="char-limit"
                    type="number"
                    value={characterLimit}
                    onChange={(e) => setCharacterLimit(Number(e.target.value))}
                    className="w-24"
                    min="1"
                  />
                  <div className="flex-1">
                    {textAnalysis.totalCharacters > characterLimit && (
                      <Badge variant="destructive">
                        Exceeds limit by {textAnalysis.totalCharacters - characterLimit} characters
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Analysis Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{textAnalysis.totalCharacters}</div>
                  <div className="text-sm text-gray-600">Total Characters</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{textAnalysis.charactersNoSpaces}</div>
                  <div className="text-sm text-gray-600">Without Spaces</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{textAnalysis.words}</div>
                  <div className="text-sm text-gray-600">Words</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{textAnalysis.sentences}</div>
                  <div className="text-sm text-gray-600">Sentences</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{textAnalysis.paragraphs}</div>
                  <div className="text-sm text-gray-600">Paragraphs</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600">{textAnalysis.readingTime}</div>
                  <div className="text-sm text-gray-600">Min. Read</div>
                </Card>
              </div>

              {/* Social Media Limits */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Social Media Compatibility</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(textAnalysis.socialLimits).map(([platform, data]) => {
                    const status = getSocialMediaStatus(platform, data.limit, data.remaining);
                    const colorClass = getSocialMediaColor(status);
                    
                    return (
                      <Card key={platform} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium capitalize">{platform}</span>
                          <Badge className={`${colorClass} text-white`}>
                            {data.remaining >= 0 ? `${data.remaining} left` : `${Math.abs(data.remaining)} over`}
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${colorClass}`}
                            style={{ width: `${Math.min(100, (data.limit - data.remaining) / data.limit * 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {textAnalysis.totalCharacters} / {data.limit} characters
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Analysis Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Hash className="h-4 w-4" />
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Analysis
                </Button>
              </div>

              {/* Advanced Analysis Section */}
              {showAdvanced && (
                <div className="space-y-6 border-t pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4 text-center">
                      <div className="text-xl font-bold text-teal-600">{textAnalysis.uniqueWords}</div>
                      <div className="text-sm text-gray-600">Unique Words</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-xl font-bold text-pink-600">{textAnalysis.lines}</div>
                      <div className="text-sm text-gray-600">Lines</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-xl font-bold text-cyan-600">{textAnalysis.averageWordsPerSentence}</div>
                      <div className="text-sm text-gray-600">Avg Words/Sentence</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-xl font-bold text-amber-600">{textAnalysis.averageCharsPerWord}</div>
                      <div className="text-sm text-gray-600">Avg Chars/Word</div>
                    </Card>
                  </div>

                  {/* Word Frequency */}
                  {textAnalysis.topWords.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold">Most Frequent Words</Label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {textAnalysis.topWords.map(([word, count], index) => (
                          <Card key={word} className="p-3 text-center">
                            <div className="font-medium text-sm">{word}</div>
                            <div className="text-xs text-gray-500">{count} times</div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Character Distribution */}
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold">Character Breakdown</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4">
                        <div className="text-lg font-semibold mb-2">Letters & Numbers</div>
                        <div className="text-2xl font-bold text-blue-600">{textAnalysis.charactersNoSpacesNoPunctuation}</div>
                        <div className="text-sm text-gray-600">Alphanumeric only</div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-lg font-semibold mb-2">Spaces</div>
                        <div className="text-2xl font-bold text-green-600">
                          {textAnalysis.totalCharacters - textAnalysis.charactersNoSpaces}
                        </div>
                        <div className="text-sm text-gray-600">Whitespace characters</div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-lg font-semibold mb-2">Punctuation</div>
                        <div className="text-2xl font-bold text-purple-600">
                          {textAnalysis.charactersNoSpaces - textAnalysis.charactersNoSpacesNoPunctuation}
                        </div>
                        <div className="text-sm text-gray-600">Special characters</div>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 justify-center pt-4">
                <Button onClick={() => copyToClipboard(inputText)} variant="outline" className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Text
                </Button>
                <Button onClick={downloadAsFile} variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Analysis
                </Button>
                <Button onClick={clearAll} variant="destructive" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Clear All
                </Button>
              </div>

              {/* Usage Examples */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Perfect for:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Content Creators:</strong> Check social media post limits, analyze engagement potential
                  </div>
                  <div>
                    <strong>Writers:</strong> Track document progress, analyze writing complexity and readability
                  </div>
                  <div>
                    <strong>Students:</strong> Meet essay requirements, analyze text structure and word usage
                  </div>
                  <div>
                    <strong>Marketers:</strong> Optimize ad copy, ensure compliance with platform character limits
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CharacterCounter;
