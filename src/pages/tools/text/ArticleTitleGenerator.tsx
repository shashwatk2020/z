import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, Sparkles, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';

const ArticleTitleGenerator = () => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('professional');
  const [titleType, setTitleType] = useState('general');
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateTitles = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic for your article.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Calling generate-article-titles function...');
      
      const { data, error } = await supabase.functions.invoke('generate-article-titles', {
        body: {
          topic: topic.trim(),
          keywords: keywords.trim(),
          audience: audience.trim(),
          tone,
          titleType,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate titles');
      }

      console.log('Function response:', data);

      if (data && data.titles && Array.isArray(data.titles)) {
        setGeneratedTitles(data.titles);
        toast({
          title: "Success",
          description: `Generated ${data.titles.length} article titles!`,
        });
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error generating titles:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate titles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (title: string) => {
    navigator.clipboard.writeText(title);
    toast({
      title: "Copied",
      description: "Title copied to clipboard!",
    });
  };

  const copyAllTitles = () => {
    const allTitles = generatedTitles.join('\n');
    navigator.clipboard.writeText(allTitles);
    toast({
      title: "Copied",
      description: "All titles copied to clipboard!",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Article Title Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate compelling, SEO-optimized article titles that grab attention and drive clicks using advanced AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                Article Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="topic">Article Topic *</Label>
                <Textarea
                  id="topic"
                  placeholder="Enter your article topic or main subject (e.g., 'sustainable living tips for beginners')"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="keywords">Target Keywords</Label>
                <Input
                  id="keywords"
                  placeholder="SEO keywords (comma-separated)"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  placeholder="Who is your target audience? (e.g., 'small business owners')"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="engaging">Engaging</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Title Type</Label>
                  <Select value={titleType} onValueChange={setTitleType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="howto">How-To Guides</SelectItem>
                      <SelectItem value="listicle">Listicles</SelectItem>
                      <SelectItem value="question">Question-Based</SelectItem>
                      <SelectItem value="controversial">Controversial</SelectItem>
                      <SelectItem value="ultimate">Ultimate Guides</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={generateTitles} 
                disabled={isLoading || !topic.trim()}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Titles...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Generate Article Titles
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Generated Titles
                </div>
                {generatedTitles.length > 0 && (
                  <Button variant="outline" size="sm" onClick={copyAllTitles}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedTitles.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Generated article titles will appear here</p>
                  <p className="text-sm mt-2">Enter your topic and click generate to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {generatedTitles.map((title, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium leading-relaxed">
                            {title}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {title.length} characters
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(title)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tips for Great Article Titles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">SEO Best Practices</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Keep titles between 50-60 characters for search results</li>
                  <li>• Include your primary keyword near the beginning</li>
                  <li>• Use compelling adjectives and power words</li>
                  <li>• Make it specific and actionable</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Engagement Tips</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Use numbers and lists (e.g., "7 Ways to...")</li>
                  <li>• Ask questions to spark curiosity</li>
                  <li>• Create urgency with time-sensitive language</li>
                  <li>• Promise value and solutions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ArticleTitleGenerator;
