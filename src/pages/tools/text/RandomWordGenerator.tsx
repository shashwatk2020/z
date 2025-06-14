
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const wordCategories = {
  common: ['apple', 'house', 'water', 'light', 'world', 'people', 'place', 'work', 'time', 'year', 'way', 'day', 'man', 'thing', 'woman', 'life', 'child', 'world', 'school', 'state', 'family', 'student', 'group', 'country', 'problem', 'hand', 'part', 'place', 'case', 'week', 'company', 'where', 'system', 'program', 'question', 'work', 'government', 'number', 'night', 'point', 'home', 'water', 'room', 'mother', 'area', 'money', 'story', 'fact', 'month', 'lot', 'right', 'study', 'book', 'eye', 'job', 'word', 'business', 'issue', 'side', 'kind', 'head', 'house', 'service', 'friend', 'father', 'power', 'hour', 'game', 'line', 'end', 'member', 'law', 'car', 'city', 'community', 'name', 'president', 'team', 'minute', 'idea', 'kid', 'body', 'information', 'back', 'parent', 'face', 'others', 'level', 'office', 'door', 'health', 'person', 'art', 'war', 'history', 'party', 'result', 'change', 'morning', 'reason', 'research', 'girl', 'guy', 'moment', 'air', 'teacher', 'force', 'education'],
  animals: ['cat', 'dog', 'elephant', 'lion', 'tiger', 'bear', 'wolf', 'fox', 'rabbit', 'deer', 'horse', 'cow', 'pig', 'sheep', 'goat', 'chicken', 'duck', 'bird', 'fish', 'shark', 'whale', 'dolphin', 'octopus', 'spider', 'butterfly', 'bee', 'ant', 'snake', 'lizard', 'frog', 'turtle', 'mouse', 'rat', 'squirrel', 'monkey', 'gorilla', 'kangaroo', 'zebra', 'giraffe', 'hippopotamus', 'rhinoceros', 'crocodile', 'alligator', 'penguin', 'owl', 'eagle', 'hawk', 'parrot', 'flamingo', 'peacock'],
  food: ['pizza', 'burger', 'sandwich', 'salad', 'soup', 'pasta', 'rice', 'bread', 'cheese', 'meat', 'chicken', 'fish', 'beef', 'pork', 'vegetables', 'fruits', 'apple', 'banana', 'orange', 'strawberry', 'grape', 'watermelon', 'tomato', 'potato', 'carrot', 'onion', 'garlic', 'pepper', 'salt', 'sugar', 'honey', 'chocolate', 'cake', 'cookie', 'ice cream', 'coffee', 'tea', 'water', 'juice', 'milk', 'wine', 'beer', 'soda', 'yogurt', 'butter', 'egg', 'flour', 'oil', 'vinegar', 'sauce'],
  technology: ['computer', 'laptop', 'smartphone', 'tablet', 'monitor', 'keyboard', 'mouse', 'printer', 'camera', 'software', 'hardware', 'internet', 'website', 'email', 'password', 'database', 'server', 'network', 'wifi', 'bluetooth', 'app', 'application', 'program', 'code', 'algorithm', 'data', 'cloud', 'artificial', 'intelligence', 'machine', 'learning', 'virtual', 'reality', 'augmented', 'blockchain', 'cryptocurrency', 'bitcoin', 'social', 'media', 'platform', 'digital', 'online', 'cyber', 'security', 'encryption', 'firewall', 'virus', 'malware', 'backup', 'update']
};

const RandomWordGenerator = () => {
  const [count, setCount] = useState(5);
  const [category, setCategory] = useState('common');
  const [words, setWords] = useState<string[]>([]);
  const { toast } = useToast();

  const generateWords = () => {
    const selectedWords = wordCategories[category as keyof typeof wordCategories];
    const generatedWords = [];
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * selectedWords.length);
      generatedWords.push(selectedWords[randomIndex]);
    }
    
    setWords(generatedWords);
  };

  const copyToClipboard = () => {
    const text = words.join(', ');
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Words copied to clipboard",
    });
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Random Word Generator</h1>
            <p className="mt-4 text-lg text-gray-600">
              Generate random words for games, creative writing, or brainstorming sessions
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Generate Random Words</CardTitle>
              <CardDescription>
                Choose how many words you want and from which category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="count">Number of Words</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="50"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">Common Words</SelectItem>
                      <SelectItem value="animals">Animals</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={generateWords} className="w-full" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Words
              </Button>

              {words.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Generated Words:</h3>
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {words.map((word, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
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

export default RandomWordGenerator;
