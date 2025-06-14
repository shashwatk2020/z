
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const hashtagCategories = {
  general: ['love', 'life', 'happy', 'success', 'motivation', 'inspiration', 'follow', 'like', 'share', 'comment'],
  business: ['entrepreneur', 'startup', 'business', 'marketing', 'sales', 'growth', 'success', 'leadership', 'innovation', 'networking'],
  fitness: ['fitness', 'gym', 'workout', 'health', 'fit', 'strong', 'training', 'muscle', 'cardio', 'nutrition'],
  food: ['food', 'foodie', 'delicious', 'yummy', 'recipe', 'cooking', 'chef', 'restaurant', 'healthy', 'organic'],
  travel: ['travel', 'adventure', 'explore', 'vacation', 'wanderlust', 'journey', 'destination', 'photography', 'nature', 'culture'],
  technology: ['tech', 'innovation', 'coding', 'programming', 'software', 'ai', 'digital', 'startup', 'developer', 'future'],
  fashion: ['fashion', 'style', 'outfit', 'trendy', 'designer', 'beauty', 'model', 'clothing', 'accessories', 'shopping'],
  art: ['art', 'artist', 'creative', 'design', 'painting', 'drawing', 'photography', 'inspiration', 'gallery', 'artwork']
};

const HashtagGenerator = () => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('general');
  const [count, setCount] = useState(10);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const { toast } = useToast();

  const generateHashtags = () => {
    if (!keyword.trim()) {
      toast({
        title: "Error",
        description: "Please enter a keyword",
        variant: "destructive"
      });
      return;
    }

    const categoryTags = hashtagCategories[category as keyof typeof hashtagCategories];
    const keywordVariations = [
      keyword.toLowerCase().replace(/\s+/g, ''),
      keyword.toLowerCase().replace(/\s+/g, '_'),
      keyword.toLowerCase(),
      ...keyword.split(' ').filter(word => word.length > 2)
    ];

    const generated = new Set<string>();
    
    // Add keyword variations
    keywordVariations.forEach(variation => {
      if (variation.length > 0) {
        generated.add(`#${variation.replace(/\s+/g, '')}`);
      }
    });

    // Add category hashtags
    categoryTags.forEach(tag => {
      generated.add(`#${tag}`);
    });

    // Add some combined hashtags
    if (keyword.split(' ').length === 1) {
      categoryTags.slice(0, 3).forEach(tag => {
        generated.add(`#${keyword.toLowerCase()}${tag}`);
      });
    }

    const hashtagArray = Array.from(generated).slice(0, count);
    setHashtags(hashtagArray);
  };

  const copyToClipboard = () => {
    const text = hashtags.join(' ');
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Hashtags copied to clipboard",
    });
  };

  const copyIndividual = (hashtag: string) => {
    navigator.clipboard.writeText(hashtag);
    toast({
      title: "Copied!",
      description: `${hashtag} copied to clipboard`,
    });
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Hashtag Generator</h1>
            <p className="mt-4 text-lg text-gray-600">
              Generate relevant hashtags for your social media posts to increase visibility
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Generate Hashtags</CardTitle>
              <CardDescription>
                Enter a keyword or topic and select a category to generate relevant hashtags
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="keyword">Keyword or Topic</Label>
                <Input
                  id="keyword"
                  placeholder="e.g., coffee, sunset, motivation..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="count">Number of Hashtags</Label>
                  <Input
                    id="count"
                    type="number"
                    min="5"
                    max="50"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 10)}
                  />
                </div>
              </div>

              <Button onClick={generateHashtags} className="w-full" size="lg" disabled={!keyword.trim()}>
                <Hash className="mr-2 h-4 w-4" />
                Generate Hashtags
              </Button>

              {hashtags.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Generated Hashtags:</h3>
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy All
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {hashtags.map((hashtag, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <span className="text-blue-700 font-medium">{hashtag}</span>
                        <Button
                          onClick={() => copyIndividual(hashtag)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Copy-ready format:</p>
                    <p className="text-sm font-mono break-all">{hashtags.join(' ')}</p>
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

export default HashtagGenerator;
