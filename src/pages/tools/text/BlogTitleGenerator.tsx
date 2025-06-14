
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Lightbulb, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const titleTemplates = {
  howTo: [
    'How to {keyword} in {timeframe}',
    'The Ultimate Guide to {keyword}',
    'How to {keyword} Like a Pro',
    '{number} Ways to {keyword}',
    'Step-by-Step Guide to {keyword}',
    'How to {keyword} Without {obstacle}',
    'Beginner\'s Guide to {keyword}',
    'How to {keyword} on a Budget'
  ],
  listicle: [
    '{number} {keyword} Tips That Will Change Your Life',
    '{number} Proven {keyword} Strategies',
    'Top {number} {keyword} Mistakes to Avoid',
    '{number} {keyword} Secrets You Need to Know',
    '{number} Essential {keyword} Tools',
    'The {number} Best {keyword} Resources',
    '{number} {keyword} Hacks for Beginners',
    '{number} Surprising {keyword} Facts'
  ],
  question: [
    'What is {keyword} and Why Does it Matter?',
    'Why {keyword} is Important in {year}',
    'Is {keyword} Worth It?',
    'What Makes {keyword} So Effective?',
    'Why Are People Obsessed with {keyword}?',
    'What Can {keyword} Teach Us?',
    'How Does {keyword} Really Work?',
    'Why {keyword} is the Future'
  ],
  comparison: [
    '{keyword} vs {alternative}: Which is Better?',
    '{keyword} or {alternative}: The Ultimate Comparison',
    'Choosing Between {keyword} and {alternative}',
    '{keyword} vs {alternative}: Pros and Cons',
    'The Difference Between {keyword} and {alternative}',
    '{keyword} Compared to {alternative}',
    'Why {keyword} Beats {alternative}',
    '{keyword} vs {alternative}: A Complete Analysis'
  ]
};

const BlogTitleGenerator = () => {
  const [keyword, setKeyword] = useState('');
  const [titleType, setTitleType] = useState('howTo');
  const [count, setCount] = useState(10);
  const [titles, setTitles] = useState<string[]>([]);
  const { toast } = useToast();

  const generateTitles = () => {
    if (!keyword.trim()) {
      toast({
        title: "Error",
        description: "Please enter a keyword or topic",
        variant: "destructive"
      });
      return;
    }

    const templates = titleTemplates[titleType as keyof typeof titleTemplates];
    const generatedTitles = [];
    
    for (let i = 0; i < count && i < templates.length * 3; i++) {
      const template = templates[i % templates.length];
      let title = template.replace(/{keyword}/g, keyword);
      
      // Replace placeholders with random values
      title = title.replace(/{number}/g, () => {
        const numbers = [5, 7, 10, 15, 20, 25, 30];
        return numbers[Math.floor(Math.random() * numbers.length)].toString();
      });
      
      title = title.replace(/{timeframe}/g, () => {
        const timeframes = ['30 Days', '24 Hours', 'One Week', 'This Year', 'Next Month'];
        return timeframes[Math.floor(Math.random() * timeframes.length)];
      });
      
      title = title.replace(/{obstacle}/g, () => {
        const obstacles = ['Breaking the Bank', 'Spending Hours', 'Prior Experience', 'Special Tools'];
        return obstacles[Math.floor(Math.random() * obstacles.length)];
      });
      
      title = title.replace(/{alternative}/g, () => {
        const alternatives = ['Traditional Methods', 'Expensive Solutions', 'Complex Approaches', 'Outdated Techniques'];
        return alternatives[Math.floor(Math.random() * alternatives.length)];
      });
      
      title = title.replace(/{year}/g, new Date().getFullYear().toString());
      
      generatedTitles.push(title);
    }
    
    setTitles(generatedTitles.slice(0, count));
  };

  const copyToClipboard = (title: string) => {
    navigator.clipboard.writeText(title);
    toast({
      title: "Copied!",
      description: "Title copied to clipboard",
    });
  };

  const copyAllTitles = () => {
    const allTitles = titles.join('\n');
    navigator.clipboard.writeText(allTitles);
    toast({
      title: "Copied!",
      description: "All titles copied to clipboard",
    });
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Blog Title Generator</h1>
            <p className="mt-4 text-lg text-gray-600">
              Generate compelling blog titles that attract readers and improve SEO
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Generate Blog Titles</CardTitle>
              <CardDescription>
                Enter your topic and choose a title type to generate engaging headlines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="keyword">Topic/Keyword</Label>
                <Input
                  id="keyword"
                  placeholder="e.g., digital marketing, cooking, fitness..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titleType">Title Type</Label>
                  <Select value={titleType} onValueChange={setTitleType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="howTo">How-To Guides</SelectItem>
                      <SelectItem value="listicle">Listicles (Number Lists)</SelectItem>
                      <SelectItem value="question">Questions</SelectItem>
                      <SelectItem value="comparison">Comparisons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="count">Number of Titles</Label>
                  <Input
                    id="count"
                    type="number"
                    min="5"
                    max="20"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 10)}
                  />
                </div>
              </div>

              <Button onClick={generateTitles} className="w-full" size="lg" disabled={!keyword.trim()}>
                <Lightbulb className="mr-2 h-4 w-4" />
                Generate Titles
              </Button>

              {titles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Generated Titles:</h3>
                    <Button onClick={copyAllTitles} variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {titles.map((title, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <p className="text-gray-900 font-medium flex-1 mr-4">{title}</p>
                        <Button
                          onClick={() => copyToClipboard(title)}
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BlogTitleGenerator;
