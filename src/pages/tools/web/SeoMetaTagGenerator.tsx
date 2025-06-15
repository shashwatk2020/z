
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Download, RotateCcw, Search, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SeoMetaTagGenerator = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    author: '',
    robots: 'index, follow',
    canonical: '',
    language: 'en',
    charset: 'UTF-8',
    viewport: 'width=device-width, initial-scale=1.0',
    siteName: '',
    type: 'website'
  });

  const [generatedTags, setGeneratedTags] = useState('');
  const { toast } = useToast();

  const robotsOptions = [
    'index, follow',
    'index, nofollow',
    'noindex, follow',
    'noindex, nofollow',
    'noimageindex',
    'noarchive',
    'nosnippet'
  ];

  const generateMetaTags = () => {
    if (!formData.title && !formData.description) {
      toast({
        title: "Input Required",
        description: "Please enter at least a title or description.",
        variant: "destructive",
      });
      return;
    }

    let tags = '';

    // Basic meta tags
    if (formData.charset) {
      tags += `<meta charset="${formData.charset}">\n`;
    }
    
    if (formData.viewport) {
      tags += `<meta name="viewport" content="${formData.viewport}">\n`;
    }

    if (formData.title) {
      tags += `<title>${formData.title}</title>\n`;
    }

    if (formData.description) {
      tags += `<meta name="description" content="${formData.description}">\n`;
    }

    if (formData.keywords) {
      tags += `<meta name="keywords" content="${formData.keywords}">\n`;
    }

    if (formData.author) {
      tags += `<meta name="author" content="${formData.author}">\n`;
    }

    if (formData.robots) {
      tags += `<meta name="robots" content="${formData.robots}">\n`;
    }

    if (formData.canonical) {
      tags += `<link rel="canonical" href="${formData.canonical}">\n`;
    }

    if (formData.language) {
      tags += `<html lang="${formData.language}">\n`;
    }

    // Open Graph tags
    if (formData.title) {
      tags += `<meta property="og:title" content="${formData.title}">\n`;
    }

    if (formData.description) {
      tags += `<meta property="og:description" content="${formData.description}">\n`;
    }

    if (formData.canonical) {
      tags += `<meta property="og:url" content="${formData.canonical}">\n`;
    }

    if (formData.siteName) {
      tags += `<meta property="og:site_name" content="${formData.siteName}">\n`;
    }

    if (formData.type) {
      tags += `<meta property="og:type" content="${formData.type}">\n`;
    }

    // Twitter Card tags
    tags += `<meta name="twitter:card" content="summary_large_image">\n`;
    
    if (formData.title) {
      tags += `<meta name="twitter:title" content="${formData.title}">\n`;
    }

    if (formData.description) {
      tags += `<meta name="twitter:description" content="${formData.description}">\n`;
    }

    setGeneratedTags(tags);

    toast({
      title: "Meta Tags Generated",
      description: "SEO meta tags have been generated successfully.",
    });
  };

  const copyTags = async () => {
    if (!generatedTags) {
      toast({
        title: "Nothing to Copy",
        description: "Please generate meta tags first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedTags);
      toast({
        title: "Copied!",
        description: "Meta tags copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadTags = () => {
    if (!generatedTags) {
      toast({
        title: "Nothing to Download",
        description: "Please generate meta tags first.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([generatedTags], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meta-tags.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Meta tags file has been downloaded.",
    });
  };

  const clearForm = () => {
    setFormData({
      title: '',
      description: '',
      keywords: '',
      author: '',
      robots: 'index, follow',
      canonical: '',
      language: 'en',
      charset: 'UTF-8',
      viewport: 'width=device-width, initial-scale=1.0',
      siteName: '',
      type: 'website'
    });
    setGeneratedTags('');
  };

  const loadSample = () => {
    setFormData({
      title: 'Best Web Development Tools | ZipConvert',
      description: 'Discover professional web development tools for HTML validation, CSS optimization, and SEO enhancement. Free online utilities for developers.',
      keywords: 'web development, HTML validator, CSS minifier, SEO tools, developer utilities',
      author: 'ZipConvert Team',
      robots: 'index, follow',
      canonical: 'https://zipconvert.com/tools/web',
      language: 'en',
      charset: 'UTF-8',
      viewport: 'width=device-width, initial-scale=1.0',
      siteName: 'ZipConvert',
      type: 'website'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              SEO Meta Tag Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Generate optimized HTML meta tags for better search engine visibility and social media sharing.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">SEO Optimization</Badge>
              <Badge variant="secondary">Open Graph</Badge>
              <Badge variant="secondary">Twitter Cards</Badge>
              <Badge variant="secondary">Schema Ready</Badge>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Page Information
                </CardTitle>
                <CardDescription>
                  Enter your page details to generate optimized meta tags
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Page Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter page title (50-60 characters recommended)"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      maxLength={60}
                    />
                    <div className="text-sm text-gray-500">
                      {formData.title.length}/60 characters
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      placeholder="Your website name"
                      value={formData.siteName}
                      onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="description">Meta Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter meta description (150-160 characters recommended)"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      maxLength={160}
                      className="min-h-[80px]"
                    />
                    <div className="text-sm text-gray-500">
                      {formData.description.length}/160 characters
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="keyword1, keyword2, keyword3"
                      value={formData.keywords}
                      onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      placeholder="Author name"
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="canonical">Canonical URL</Label>
                    <Input
                      id="canonical"
                      placeholder="https://example.com/page"
                      value={formData.canonical}
                      onChange={(e) => setFormData({...formData, canonical: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="robots">Robots</Label>
                    <Select value={formData.robots} onValueChange={(value) => setFormData({...formData, robots: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {robotsOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input
                      id="language"
                      placeholder="en"
                      value={formData.language}
                      onChange={(e) => setFormData({...formData, language: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button onClick={generateMetaTags} className="flex-1">
                    <Search className="h-4 w-4 mr-2" />
                    Generate Meta Tags
                  </Button>
                  <Button variant="outline" onClick={loadSample}>
                    Load Sample
                  </Button>
                  <Button variant="outline" onClick={clearForm}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Generated Meta Tags
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyTags}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadTags}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Copy these tags and add them to your HTML &lt;head&gt; section
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedTags ? (
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {generatedTags}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Click "Generate Meta Tags" to create your SEO tags</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Keep titles under 60 characters</li>
                    <li>• Meta descriptions: 150-160 characters</li>
                    <li>• Use unique titles for each page</li>
                    <li>• Include target keywords naturally</li>
                    <li>• Write compelling, click-worthy descriptions</li>
                    <li>• Use canonical URLs to avoid duplicates</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Open Graph Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Better social media sharing</li>
                    <li>• Rich previews on Facebook</li>
                    <li>• Increased click-through rates</li>
                    <li>• Professional appearance</li>
                    <li>• Brand consistency</li>
                    <li>• Higher engagement</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Twitter Card Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• <strong>Summary:</strong> Title, description, thumbnail</li>
                    <li>• <strong>Summary Large:</strong> Larger image display</li>
                    <li>• <strong>App:</strong> Mobile app promotions</li>
                    <li>• <strong>Player:</strong> Video/audio content</li>
                  </ul>
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

export default SeoMetaTagGenerator;
