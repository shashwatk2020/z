
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
import { Copy, Download, RotateCcw, Share2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OpenGraphGenerator = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    image: '',
    imageAlt: '',
    type: 'website',
    siteName: '',
    locale: 'en_US',
    imageWidth: '1200',
    imageHeight: '630',
    author: '',
    publishedTime: '',
    modifiedTime: '',
    section: '',
    tags: ''
  });

  const [generatedTags, setGeneratedTags] = useState('');
  const { toast } = useToast();

  const ogTypes = [
    'website',
    'article',
    'book',
    'profile',
    'music.song',
    'music.album',
    'music.playlist',
    'music.radio_station',
    'video.movie',
    'video.episode',
    'video.tv_show',
    'video.other'
  ];

  const generateOpenGraphTags = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter at least a title and description.",
        variant: "destructive",
      });
      return;
    }

    let tags = '';

    // Basic Open Graph tags
    tags += `<meta property="og:title" content="${formData.title}" />\n`;
    tags += `<meta property="og:description" content="${formData.description}" />\n`;
    tags += `<meta property="og:type" content="${formData.type}" />\n`;

    if (formData.url) {
      tags += `<meta property="og:url" content="${formData.url}" />\n`;
    }

    if (formData.image) {
      tags += `<meta property="og:image" content="${formData.image}" />\n`;
      
      if (formData.imageAlt) {
        tags += `<meta property="og:image:alt" content="${formData.imageAlt}" />\n`;
      }
      
      if (formData.imageWidth) {
        tags += `<meta property="og:image:width" content="${formData.imageWidth}" />\n`;
      }
      
      if (formData.imageHeight) {
        tags += `<meta property="og:image:height" content="${formData.imageHeight}" />\n`;
      }
    }

    if (formData.siteName) {
      tags += `<meta property="og:site_name" content="${formData.siteName}" />\n`;
    }

    if (formData.locale) {
      tags += `<meta property="og:locale" content="${formData.locale}" />\n`;
    }

    // Article-specific tags
    if (formData.type === 'article') {
      if (formData.author) {
        tags += `<meta property="article:author" content="${formData.author}" />\n`;
      }
      
      if (formData.publishedTime) {
        tags += `<meta property="article:published_time" content="${formData.publishedTime}" />\n`;
      }
      
      if (formData.modifiedTime) {
        tags += `<meta property="article:modified_time" content="${formData.modifiedTime}" />\n`;
      }
      
      if (formData.section) {
        tags += `<meta property="article:section" content="${formData.section}" />\n`;
      }
      
      if (formData.tags) {
        const tagList = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        tagList.forEach(tag => {
          tags += `<meta property="article:tag" content="${tag}" />\n`;
        });
      }
    }

    // Twitter Card tags (for better compatibility)
    tags += `\n<!-- Twitter Card tags -->\n`;
    tags += `<meta name="twitter:card" content="summary_large_image" />\n`;
    tags += `<meta name="twitter:title" content="${formData.title}" />\n`;
    tags += `<meta name="twitter:description" content="${formData.description}" />\n`;
    
    if (formData.image) {
      tags += `<meta name="twitter:image" content="${formData.image}" />\n`;
    }

    setGeneratedTags(tags);

    toast({
      title: "Open Graph Tags Generated",
      description: "Your Open Graph meta tags are ready to use.",
    });
  };

  const copyTags = async () => {
    if (!generatedTags) {
      toast({
        title: "Nothing to Copy",
        description: "Please generate tags first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedTags);
      toast({
        title: "Copied!",
        description: "Open Graph tags copied to clipboard.",
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
        description: "Please generate tags first.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([generatedTags], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'open-graph-tags.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Open Graph tags file has been downloaded.",
    });
  };

  const clearForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      image: '',
      imageAlt: '',
      type: 'website',
      siteName: '',
      locale: 'en_US',
      imageWidth: '1200',
      imageHeight: '630',
      author: '',
      publishedTime: '',
      modifiedTime: '',
      section: '',
      tags: ''
    });
    setGeneratedTags('');
  };

  const loadSample = () => {
    setFormData({
      title: 'Professional Web Development Tools - Complete Suite',
      description: 'Discover our comprehensive collection of web development tools including HTML validators, CSS minifiers, and SEO optimizers. All free and browser-based.',
      url: 'https://zipconvert.com/tools/web',
      image: 'https://zipconvert.com/images/web-tools-og.jpg',
      imageAlt: 'ZipConvert Web Development Tools Dashboard',
      type: 'website',
      siteName: 'ZipConvert',
      locale: 'en_US',
      imageWidth: '1200',
      imageHeight: '630',
      author: '',
      publishedTime: '',
      modifiedTime: '',
      section: '',
      tags: ''
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Open Graph Meta Tag Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Generate Open Graph meta tags for better social media sharing on Facebook, LinkedIn, and other platforms.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Facebook Sharing</Badge>
              <Badge variant="secondary">LinkedIn</Badge>
              <Badge variant="secondary">Social Preview</Badge>
              <Badge variant="secondary">Rich Snippets</Badge>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Open Graph Configuration
                </CardTitle>
                <CardDescription>
                  Configure how your page appears when shared on social media
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Page title for social sharing"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      maxLength={95}
                    />
                    <div className="text-sm text-gray-500">
                      {formData.title.length}/95 characters (recommended)
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Content Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ogTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.replace('.', ' › ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Description that appears in social media previews"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      maxLength={300}
                      className="min-h-[80px]"
                    />
                    <div className="text-sm text-gray-500">
                      {formData.description.length}/300 characters (recommended)
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">Page URL</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com/page"
                      value={formData.url}
                      onChange={(e) => setFormData({...formData, url: e.target.value})}
                    />
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
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      placeholder="https://example.com/image.jpg (1200x630 recommended)"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageAlt">Image Alt Text</Label>
                    <Input
                      id="imageAlt"
                      placeholder="Description of the image"
                      value={formData.imageAlt}
                      onChange={(e) => setFormData({...formData, imageAlt: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="locale">Locale</Label>
                    <Input
                      id="locale"
                      placeholder="en_US, es_ES, fr_FR, etc."
                      value={formData.locale}
                      onChange={(e) => setFormData({...formData, locale: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="imageWidth">Image Width</Label>
                      <Input
                        id="imageWidth"
                        placeholder="1200"
                        value={formData.imageWidth}
                        onChange={(e) => setFormData({...formData, imageWidth: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imageHeight">Image Height</Label>
                      <Input
                        id="imageHeight"
                        placeholder="630"
                        value={formData.imageHeight}
                        onChange={(e) => setFormData({...formData, imageHeight: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {formData.type === 'article' && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Article-Specific Properties</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <Label htmlFor="section">Section</Label>
                        <Input
                          id="section"
                          placeholder="Technology, Business, etc."
                          value={formData.section}
                          onChange={(e) => setFormData({...formData, section: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="publishedTime">Published Time</Label>
                        <Input
                          id="publishedTime"
                          type="datetime-local"
                          value={formData.publishedTime}
                          onChange={(e) => setFormData({...formData, publishedTime: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="modifiedTime">Modified Time</Label>
                        <Input
                          id="modifiedTime"
                          type="datetime-local"
                          value={formData.modifiedTime}
                          onChange={(e) => setFormData({...formData, modifiedTime: e.target.value})}
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                          id="tags"
                          placeholder="tag1, tag2, tag3"
                          value={formData.tags}
                          onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button onClick={generateOpenGraphTags} className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Generate Open Graph Tags
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
                  Generated Open Graph Tags
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
                  Add these tags to your HTML &lt;head&gt; section
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
                    <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Configure your Open Graph settings and click "Generate" to see the tags</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Open Graph Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Use high-quality images (1200x630px)</li>
                    <li>• Keep titles under 95 characters</li>
                    <li>• Descriptions should be 125-300 characters</li>
                    <li>• Always include og:title, og:description, og:image</li>
                    <li>• Use absolute URLs for images</li>
                    <li>• Test your tags with Facebook Debugger</li>
                    <li>• Use appropriate content types</li>
                    <li>• Include Twitter Card tags for compatibility</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supported Platforms</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• <strong>Facebook:</strong> Full Open Graph support</li>
                    <li>• <strong>LinkedIn:</strong> Professional sharing</li>
                    <li>• <strong>Twitter:</strong> Fallback from Open Graph</li>
                    <li>• <strong>Slack:</strong> Rich link previews</li>
                    <li>• <strong>Discord:</strong> Embedded content</li>
                    <li>• <strong>WhatsApp:</strong> Link previews</li>
                    <li>• <strong>Telegram:</strong> Media previews</li>
                    <li>• <strong>Pinterest:</strong> Rich Pins</li>
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

export default OpenGraphGenerator;
