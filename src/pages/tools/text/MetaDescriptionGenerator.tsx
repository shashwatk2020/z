
import React, { useState } from 'react';
import { Search, FileText, Copy, RefreshCw, Lightbulb, CheckCircle } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';

interface MetaDescription {
  text: string;
  length: number;
  wordCount: number;
  style: string;
}

const MetaDescriptionGenerator = () => {
  const [pageTitle, setPageTitle] = useState('');
  const [mainKeyword, setMainKeyword] = useState('');
  const [additionalKeywords, setAdditionalKeywords] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [targetAction, setTargetAction] = useState('');
  const [includeKeyword, setIncludeKeyword] = useState(true);
  const [includeAction, setIncludeAction] = useState(true);
  const [businessType, setBusinessType] = useState('');
  const [results, setResults] = useState<MetaDescription[]>([]);
  const { toast } = useToast();

  const metaTemplates = [
    {
      name: 'Standard Informational',
      template: (keyword: string, title: string, action: string) => 
        `Learn about ${keyword} with our comprehensive guide. ${title} - everything you need to know about ${keyword}. ${action}.`,
      style: 'Informational'
    },
    {
      name: 'Problem-Solution',
      template: (keyword: string, title: string, action: string) => 
        `Struggling with ${keyword}? ${title} provides the solution you need. ${action} and solve your ${keyword} challenges today.`,
      style: 'Problem-Solving'
    },
    {
      name: 'Benefit-Focused',
      template: (keyword: string, title: string, action: string) => 
        `Discover the benefits of ${keyword} with ${title}. Get expert insights, tips, and strategies. ${action} now.`,
      style: 'Benefit-Driven'
    },
    {
      name: 'How-To Guide',
      template: (keyword: string, title: string, action: string) => 
        `Learn how to master ${keyword} with our step-by-step guide. ${title} explains everything simply. ${action} today.`,
      style: 'Educational'
    },
    {
      name: 'Professional Service',
      template: (keyword: string, title: string, action: string) => 
        `Professional ${keyword} services from ${title}. Expert solutions, proven results, competitive rates. ${action} for a free consultation.`,
      style: 'Service-Based'
    },
    {
      name: 'E-commerce Product',
      template: (keyword: string, title: string, action: string) => 
        `Shop the best ${keyword} at ${title}. Premium quality, competitive prices, fast shipping. ${action} and save today.`,
      style: 'E-commerce'
    },
    {
      name: 'News/Blog',
      template: (keyword: string, title: string, action: string) => 
        `Latest news and insights about ${keyword}. ${title} brings you expert analysis and updates. ${action} to stay informed.`,
      style: 'Content/Blog'
    },
    {
      name: 'Local Business',
      template: (keyword: string, title: string, action: string) => 
        `${title} - your local ${keyword} experts. Serving the community with quality service and competitive rates. ${action} today.`,
      style: 'Local Business'
    },
    {
      name: 'Software/Tool',
      template: (keyword: string, title: string, action: string) => 
        `${title} - the ultimate ${keyword} solution. Powerful features, easy to use, trusted by thousands. ${action} for free.`,
      style: 'Software/SaaS'
    },
    {
      name: 'Comparison/Review',
      template: (keyword: string, title: string, action: string) => 
        `${title}: In-depth ${keyword} comparison and reviews. Expert analysis, pros & cons, pricing. ${action} to make the right choice.`,
      style: 'Review/Comparison'
    }
  ];

  const actionWords = [
    'Learn more', 'Get started', 'Try now', 'Read more', 'Discover', 'Explore',
    'Contact us', 'Get quote', 'Start free trial', 'Download now', 'Sign up',
    'Book appointment', 'Get help', 'Find out how', 'See how', 'Join now'
  ];

  const generateDescriptions = () => {
    if (!pageTitle.trim() || !mainKeyword.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a page title and main keyword.",
        variant: "destructive",
      });
      return;
    }

    const keyword = mainKeyword.trim();
    const title = pageTitle.trim();
    const action = targetAction.trim() || 'Learn more';
    
    const generatedDescriptions: MetaDescription[] = [];

    metaTemplates.forEach(template => {
      let description = template.template(keyword, title, action);
      
      // Add additional keywords if provided
      if (additionalKeywords.trim()) {
        const additionalKws = additionalKeywords.split(',').map(kw => kw.trim()).filter(kw => kw);
        if (additionalKws.length > 0) {
          description = description.replace('.', `, ${additionalKws.slice(0, 2).join(', ')}.`);
        }
      }

      // Ensure description is within SEO limits (150-160 characters)
      if (description.length > 160) {
        description = description.substring(0, 157) + '...';
      }

      generatedDescriptions.push({
        text: description,
        length: description.length,
        wordCount: description.split(/\s+/).length,
        style: template.style
      });
    });

    // Generate some custom variations
    const customDescriptions = [
      `${title} offers comprehensive ${keyword} solutions. Expert advice, proven strategies, and actionable insights. ${action} to transform your approach.`,
      `Get expert ${keyword} guidance with ${title}. Detailed information, practical tips, and professional insights. ${action} and see the difference.`,
      `${title}: Your trusted source for ${keyword} information. Quality content, expert reviews, and helpful resources. ${action} today.`
    ].map(desc => {
      if (desc.length > 160) {
        desc = desc.substring(0, 157) + '...';
      }
      return {
        text: desc,
        length: desc.length,
        wordCount: desc.split(/\s+/).length,
        style: 'Custom Generated'
      };
    });

    const allDescriptions = [...generatedDescriptions, ...customDescriptions];
    setResults(allDescriptions);

    toast({
      title: "Descriptions Generated!",
      description: `Created ${allDescriptions.length} meta description variations.`,
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Meta description copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const reset = () => {
    setPageTitle('');
    setMainKeyword('');
    setAdditionalKeywords('');
    setPageContent('');
    setTargetAction('');
    setBusinessType('');
    setResults([]);
  };

  const getLengthColor = (length: number) => {
    if (length < 120) return 'text-orange-600';
    if (length <= 160) return 'text-green-600';
    return 'text-red-600';
  };

  const getLengthStatus = (length: number) => {
    if (length < 120) return 'Too Short';
    if (length <= 160) return 'Optimal';
    return 'Too Long';
  };

  const examples = [
    {
      title: 'Best Digital Marketing Agency',
      keyword: 'digital marketing services',
      business: 'Marketing Agency',
      action: 'Get a free consultation'
    },
    {
      title: 'Organic Coffee Beans Online',
      keyword: 'organic coffee',
      business: 'E-commerce',
      action: 'Shop now'
    },
    {
      title: 'Web Development Tutorials',
      keyword: 'web development',
      business: 'Educational',
      action: 'Start learning'
    },
    {
      title: 'Local Plumbing Services',
      keyword: 'plumbing repair',
      business: 'Local Service',
      action: 'Call now'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Meta Description Generator
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Create compelling meta descriptions that improve your search engine rankings and click-through rates. Generate SEO-optimized descriptions tailored to your content and business goals.
              </p>
            </div>

            <Tabs defaultValue="generator" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="generator">Description Generator</TabsTrigger>
                <TabsTrigger value="results">Generated Results</TabsTrigger>
                <TabsTrigger value="examples">Examples & Tips</TabsTrigger>
              </TabsList>

              <TabsContent value="generator" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Page Information</span>
                    </CardTitle>
                    <CardDescription>
                      Provide details about your page to generate targeted meta descriptions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="page-title">Page Title *</Label>
                        <Input
                          id="page-title"
                          placeholder="Your page or business name"
                          value={pageTitle}
                          onChange={(e) => setPageTitle(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="main-keyword">Main Keyword *</Label>
                        <Input
                          id="main-keyword"
                          placeholder="Primary keyword or service"
                          value={mainKeyword}
                          onChange={(e) => setMainKeyword(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="additional-keywords">Additional Keywords</Label>
                        <Input
                          id="additional-keywords"
                          placeholder="keyword1, keyword2, keyword3"
                          value={additionalKeywords}
                          onChange={(e) => setAdditionalKeywords(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="business-type">Business Type</Label>
                        <Input
                          id="business-type"
                          placeholder="e.g., E-commerce, Service, Blog"
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="target-action">Call-to-Action</Label>
                      <Input
                        id="target-action"
                        placeholder="e.g., Learn more, Get started, Contact us"
                        value={targetAction}
                        onChange={(e) => setTargetAction(e.target.value)}
                        className="mt-2"
                      />
                      <div className="flex flex-wrap gap-1 mt-2">
                        {actionWords.slice(0, 8).map((action, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => setTargetAction(action)}
                          >
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="page-content">Page Content Summary (Optional)</Label>
                      <Textarea
                        id="page-content"
                        placeholder="Brief description of what your page is about..."
                        value={pageContent}
                        onChange={(e) => setPageContent(e.target.value)}
                        className="mt-2 min-h-[100px]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={generateDescriptions} size="lg">
                        <Search className="h-4 w-4 mr-2" />
                        Generate Meta Descriptions
                      </Button>
                      <Button onClick={reset} variant="outline" size="lg">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="results" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Meta Descriptions</CardTitle>
                    <CardDescription>
                      Choose the best meta description for your page. Optimal length is 120-160 characters.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {results.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No meta descriptions generated yet.</p>
                        <p className="text-sm">Fill in the form and click "Generate Meta Descriptions" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {results.map((result, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Badge variant="outline">{result.style}</Badge>
                                  <Badge 
                                    variant="outline" 
                                    className={getLengthColor(result.length)}
                                  >
                                    {result.length} chars - {getLengthStatus(result.length)}
                                  </Badge>
                                  {result.length >= 120 && result.length <= 160 && (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  )}
                                </div>
                                <p className="text-gray-900 mb-2">{result.text}</p>
                                <div className="text-sm text-gray-600">
                                  Words: {result.wordCount} | Characters: {result.length}
                                </div>
                              </div>
                              <Button
                                onClick={() => copyToClipboard(result.text)}
                                variant="outline"
                                size="sm"
                                className="ml-4"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="examples" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5" />
                      <span>Examples & Best Practices</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">Quick Examples</h3>
                        <div className="grid gap-3">
                          {examples.map((example, index) => (
                            <div
                              key={index}
                              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => {
                                setPageTitle(example.title);
                                setMainKeyword(example.keyword);
                                setBusinessType(example.business);
                                setTargetAction(example.action);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{example.title}</p>
                                  <p className="text-sm text-gray-600">Keyword: {example.keyword}</p>
                                </div>
                                <Badge variant="outline">Click to use</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Meta Description Best Practices</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <p><strong>Length:</strong> Keep between 120-160 characters for optimal display</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <p><strong>Keywords:</strong> Include your primary keyword naturally</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <p><strong>Action:</strong> Include a clear call-to-action</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <p><strong>Unique:</strong> Each page should have a unique meta description</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <p><strong>Compelling:</strong> Write for users, not just search engines</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <p><strong>Accurate:</strong> Reflect the actual content of your page</p>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default MetaDescriptionGenerator;
