
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const KeywordDensityAnalyzer = () => {
  const [text, setText] = useState('');
  const [keywords, setKeywords] = useState('');
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  const analyze = () => {
    if (!text.trim() || !keywords.trim()) {
      toast({ title: 'Input required', description: 'Please provide both text and keywords.', variant: 'destructive' });
      return;
    }

    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const totalWords = words.length;
    const keywordList = keywords.toLowerCase().split(',').map(k => k.trim()).filter(k => k);

    const densityResults = keywordList.map(keyword => {
      const keywordParts = keyword.split(' ');
      let count = 0;
      if (keywordParts.length === 1) {
        count = words.filter(word => word === keyword).length;
      } else {
        const textLower = text.toLowerCase();
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        count = (textLower.match(regex) || []).length;
      }
      const density = totalWords > 0 ? (count * keywordParts.length / totalWords) * 100 : 0;
      return { keyword, count, density: density.toFixed(2) };
    });

    setResults({ totalWords, densityResults });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Density Analyzer</CardTitle>
              <CardDescription>Check the keyword density of your text to optimize for SEO.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="text-input">Your Text</Label>
                <Textarea id="text-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your content here..." className="min-h-[250px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords-input">Keywords (comma-separated)</Label>
                <Input id="keywords-input" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g. seo, web tools, keyword analysis" />
              </div>
              <Button onClick={analyze} className="w-full">Analyze Density</Button>

              {results && (
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Results</CardTitle>
                    <CardDescription>Total words: {results.totalWords}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b">
                            <th className="p-2">Keyword</th>
                            <th className="p-2 text-right">Count</th>
                            <th className="p-2 text-right">Density</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.densityResults.map(res => (
                            <tr key={res.keyword} className="border-b">
                              <td className="p-2 font-semibold">{res.keyword}</td>
                              <td className="p-2 text-right">{res.count}</td>
                              <td className="p-2 text-right">{res.density}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KeywordDensityAnalyzer;
