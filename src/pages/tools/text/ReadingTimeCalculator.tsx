
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReadingTimeCalculator = () => {
  const [text, setText] = useState('');
  const [wpm, setWpm] = useState(200);
  const [results, setResults] = useState({
    words: 0,
    characters: 0,
    readingTime: 0,
    speakingTime: 0,
    pages: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    calculateReadingTime();
  }, [text, wpm]);

  const calculateReadingTime = () => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const readingTime = words / wpm;
    const speakingTime = words / 150; // Average speaking speed
    const pages = words / 250; // Approximately 250 words per page

    setResults({
      words,
      characters,
      readingTime,
      speakingTime,
      pages
    });
  };

  const formatTime = (minutes: number) => {
    if (minutes < 1) {
      const seconds = Math.round(minutes * 60);
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
    }
    
    return `${mins} minute${mins !== 1 ? 's' : ''}`;
  };

  const copyResults = () => {
    const resultsText = `Reading Time Analysis:
Word Count: ${results.words.toLocaleString()}
Character Count: ${results.characters.toLocaleString()}
Reading Time: ${formatTime(results.readingTime)}
Speaking Time: ${formatTime(results.speakingTime)}
Estimated Pages: ${results.pages.toFixed(1)}
Reading Speed: ${wpm} WPM`;

    navigator.clipboard.writeText(resultsText);
    toast({
      title: "Copied!",
      description: "Reading time analysis copied to clipboard.",
    });
  };

  const presetSpeeds = [
    { label: "Slow Reader", wpm: 150 },
    { label: "Average Reader", wpm: 200 },
    { label: "Fast Reader", wpm: 300 },
    { label: "Speed Reader", wpm: 500 }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Reading Time Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Calculate how long it will take to read your text based on average reading speeds. Perfect for blog posts, articles, and presentations.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Real-time Calculation</Badge>
              <Badge variant="secondary">Custom Speed</Badge>
              <Badge variant="secondary">Speaking Time</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Text Input</CardTitle>
                  <CardDescription>
                    Enter your text to calculate reading time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste your article, blog post, or any text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[300px] text-base"
                  />
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Reading Speed Settings</CardTitle>
                  <CardDescription>
                    Adjust the reading speed to match your audience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="wpm">Words Per Minute (WPM)</Label>
                      <Input
                        id="wpm"
                        type="number"
                        min="50"
                        max="1000"
                        value={wpm}
                        onChange={(e) => setWpm(parseInt(e.target.value) || 200)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {presetSpeeds.map((preset) => (
                        <Button
                          key={preset.wpm}
                          variant={wpm === preset.wpm ? "default" : "outline"}
                          size="sm"
                          onClick={() => setWpm(preset.wpm)}
                        >
                          {preset.label} ({preset.wpm} WPM)
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Results
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={copyResults}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600 font-medium">Reading Time</div>
                      <div className="text-lg font-bold text-blue-900">
                        {formatTime(results.readingTime)}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-600 font-medium">Speaking Time</div>
                      <div className="text-lg font-bold text-green-900">
                        {formatTime(results.speakingTime)}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Words:</span>
                      <span className="text-sm font-bold">{results.words.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Characters:</span>
                      <span className="text-sm font-bold">{results.characters.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Pages:</span>
                      <span className="text-sm font-bold">{results.pages.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-3 rounded-lg text-xs text-gray-600">
                    <strong>Note:</strong> Reading times are estimates based on average reading speeds. Actual reading time may vary depending on text complexity and reader comprehension level.
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

export default ReadingTimeCalculator;
