
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
import { Copy, Download, RotateCcw, MessageSquare, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TwitterCardGenerator = () => {
  const [formData, setFormData] = useState({
    cardType: 'summary_large_image',
    title: '',
    description: '',
    image: '',
    imageAlt: '',
    site: '',
    creator: '',
    domain: '',
    url: '',
    playerUrl: '',
    playerWidth: '560',
    playerHeight: '315',
    playerStream: '',
    appIdIphone: '',
    appIdIpad: '',
    appIdGoogleplay: '',
    appUrlIphone: '',
    appUrlIpad: '',
    appUrlGoogleplay: '',
    appNameIphone: '',
    appNameIpad: '',
    appNameGoogleplay: ''
  });

  const [generatedTags, setGeneratedTags] = useState('');
  const { toast } = useToast();

  const cardTypes = [
    { value: 'summary', label: 'Summary Card', description: 'Title, description, and thumbnail image' },
    { value: 'summary_large_image', label: 'Summary Large Image', description: 'Similar to summary but with a large image' },
    { value: 'app', label: 'App Card', description: 'Mobile app promotion with app store links' },
    { value: 'player', label: 'Player Card', description: 'Video/audio content with inline player' }
  ];

  const generateTwitterCardTags = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter at least a title and description.",
        variant: "destructive",
      });
      return;
    }

    let tags = '';

    // Basic Twitter Card tags
    tags += `<meta name="twitter:card" content="${formData.cardType}" />\n`;
    tags += `<meta name="twitter:title" content="${formData.title}" />\n`;
    tags += `<meta name="twitter:description" content="${formData.description}" />\n`;

    if (formData.site) {
      tags += `<meta name="twitter:site" content="${formData.site.startsWith('@') ? formData.site : '@' + formData.site}" />\n`;
    }

    if (formData.creator) {
      tags += `<meta name="twitter:creator" content="${formData.creator.startsWith('@') ? formData.creator : '@' + formData.creator}" />\n`;
    }

    if (formData.domain) {
      tags += `<meta name="twitter:domain" content="${formData.domain}" />\n`;
    }

    if (formData.url) {
      tags += `<meta name="twitter:url" content="${formData.url}" />\n`;
    }

    // Image for summary and summary_large_image cards
    if ((formData.cardType === 'summary' || formData.cardType === 'summary_large_image') && formData.image) {
      tags += `<meta name="twitter:image" content="${formData.image}" />\n`;
      
      if (formData.imageAlt) {
        tags += `<meta name="twitter:image:alt" content="${formData.imageAlt}" />\n`;
      }
    }

    // Player card specific tags
    if (formData.cardType === 'player') {
      if (formData.playerUrl) {
        tags += `<meta name="twitter:player" content="${formData.playerUrl}" />\n`;
      }
      
      if (formData.playerWidth) {
        tags += `<meta name="twitter:player:width" content="${formData.playerWidth}" />\n`;
      }
      
      if (formData.playerHeight) {
        tags += `<meta name="twitter:player:height" content="${formData.playerHeight}" />\n`;
      }
      
      if (formData.playerStream) {
        tags += `<meta name="twitter:player:stream" content="${formData.playerStream}" />\n`;
      }
      
      if (formData.image) {
        tags += `<meta name="twitter:image" content="${formData.image}" />\n`;
      }
    }

    // App card specific tags
    if (formData.cardType === 'app') {
      if (formData.appIdIphone) {
        tags += `<meta name="twitter:app:id:iphone" content="${formData.appIdIphone}" />\n`;
      }
      
      if (formData.appIdIpad) {
        tags += `<meta name="twitter:app:id:ipad" content="${formData.appIdIpad}" />\n`;
      }
      
      if (formData.appIdGoogleplay) {
        tags += `<meta name="twitter:app:id:googleplay" content="${formData.appIdGoogleplay}" />\n`;
      }
      
      if (formData.appUrlIphone) {
        tags += `<meta name="twitter:app:url:iphone" content="${formData.appUrlIphone}" />\n`;
      }
      
      if (formData.appUrlIpad) {
        tags += `<meta name="twitter:app:url:ipad" content="${formData.appUrlIpad}" />\n`;
      }
      
      if (formData.appUrlGoogleplay) {
        tags += `<meta name="twitter:app:url:googleplay" content="${formData.appUrlGoogleplay}" />\n`;
      }
      
      if (formData.appNameIphone) {
        tags += `<meta name="twitter:app:name:iphone" content="${formData.appNameIphone}" />\n`;
      }
      
      if (formData.appNameIpad) {
        tags += `<meta name="twitter:app:name:ipad" content="${formData.appNameIpad}" />\n`;
      }
      
      if (formData.appNameGoogleplay) {
        tags += `<meta name="twitter:app:name:googleplay" content="${formData.appNameGoogleplay}" />\n`;
      }
    }

    // Add complementary Open Graph tags
    tags += `\n<!-- Complementary Open Graph tags -->\n`;
    tags += `<meta property="og:title" content="${formData.title}" />\n`;
    tags += `<meta property="og:description" content="${formData.description}" />\n`;
    
    if (formData.url) {
      tags += `<meta property="og:url" content="${formData.url}" />\n`;
    }
    
    if (formData.image) {
      tags += `<meta property="og:image" content="${formData.image}" />\n`;
    }

    setGeneratedTags(tags);

    toast({
      title: "Twitter Card Tags Generated",
      description: "Your Twitter Card meta tags are ready to use.",
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
        description: "Twitter Card tags copied to clipboard.",
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
    a.download = 'twitter-card-tags.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Twitter Card tags file has been downloaded.",
    });
  };

  const clearForm = () => {
    setFormData({
      cardType: 'summary_large_image',
      title: '',
      description: '',
      image: '',
      imageAlt: '',
      site: '',
      creator: '',
      domain: '',
      url: '',
      playerUrl: '',
      playerWidth: '560',
      playerHeight: '315',
      playerStream: '',
      appIdIphone: '',
      appIdIpad: '',
      appIdGoogleplay: '',
      appUrlIphone: '',
      appUrlIpad: '',
      appUrlGoogleplay: '',
      appNameIphone: '',
      appNameIpad: '',
      appNameGoogleplay: ''
    });
    setGeneratedTags('');
  };

  const loadSample = () => {
    const sampleData = {
      summary_large_image: {
        title: 'Professional Web Development Tools | ZipConvert',
        description: 'Boost your web development workflow with our comprehensive suite of tools. HTML validation, CSS optimization, and more.',
        image: 'https://zipconvert.com/images/web-tools-preview.jpg',
        imageAlt: 'ZipConvert web development tools interface',
        site: '@zipconvert',
        creator: '@webdev_team',
        domain: 'zipconvert.com',
        url: 'https://zipconvert.com/tools/web'
      },
      app: {
        title: 'ZipConvert Mobile App',
        description: 'Access all your favorite conversion tools on the go with our mobile app.',
        site: '@zipconvert',
        creator: '@zipconvert',
        appIdIphone: '123456789',
        appIdGoogleplay: 'com.zipconvert.app',
        appNameIphone: 'ZipConvert',
        appNameGoogleplay: 'ZipConvert'
      },
      player: {
        title: 'Learn Web Development - Video Tutorial',
        description: 'Master modern web development techniques with our comprehensive video series.',
        playerUrl: 'https://player.example.com/embed/12345',
        playerWidth: '560',
        playerHeight: '315',
        image: 'https://example.com/video-thumbnail.jpg'
      }
    };

    const sample = sampleData[formData.cardType as keyof typeof sampleData] || sampleData.summary_large_image;
    setFormData({...formData, ...sample});
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Twitter Card Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create Twitter Card meta tags for enhanced tweet appearance with rich media previews.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Twitter Cards</Badge>
              <Badge variant="secondary">Rich Previews</Badge>
              <Badge variant="secondary">Social Media</Badge>
              <Badge variant="secondary">Media Sharing</Badge>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Twitter Card Configuration
                </CardTitle>
                <CardDescription>
                  Configure how your content appears when shared on Twitter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cardType">Card Type</Label>
                  <Select value={formData.cardType} onValueChange={(value) => setFormData({...formData, cardType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cardTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-gray-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Your content title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      maxLength={70}
                    />
                    <div className="text-sm text-gray-500">
                      {formData.title.length}/70 characters
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="site">Site Handle</Label>
                    <Input
                      id="site"
                      placeholder="@yoursite"
                      value={formData.site}
                      onChange={(e) => setFormData({...formData, site: e.target.value})}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Description of your content"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      maxLength={200}
                      className="min-h-[80px]"
                    />
                    <div className="text-sm text-gray-500">
                      {formData.description.length}/200 characters
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="creator">Creator Handle</Label>
                    <Input
                      id="creator"
                      placeholder="@creator"
                      value={formData.creator}
                      onChange={(e) => setFormData({...formData, creator: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      placeholder="example.com"
                      value={formData.domain}
                      onChange={(e) => setFormData({...formData, domain: e.target.value})}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="url">Page URL</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com/page"
                      value={formData.url}
                      onChange={(e) => setFormData({...formData, url: e.target.value})}
                    />
                  </div>
                </div>

                {(formData.cardType === 'summary' || formData.cardType === 'summary_large_image' || formData.cardType === 'player') && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Image Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                          id="image"
                          placeholder="https://example.com/image.jpg"
                          value={formData.image}
                          onChange={(e) => setFormData({...formData, image: e.target.value})}
                        />
                        <div className="text-sm text-gray-500">
                          {formData.cardType === 'summary' ? 'Recommended: 144x144px minimum' : 'Recommended: 1200x630px'}
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="imageAlt">Image Alt Text</Label>
                        <Input
                          id="imageAlt"
                          placeholder="Description of the image"
                          value={formData.imageAlt}
                          onChange={(e) => setFormData({...formData, imageAlt: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.cardType === 'player' && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Player Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="playerUrl">Player URL</Label>
                        <Input
                          id="playerUrl"
                          placeholder="https://player.example.com/embed/12345"
                          value={formData.playerUrl}
                          onChange={(e) => setFormData({...formData, playerUrl: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="playerWidth">Player Width</Label>
                        <Input
                          id="playerWidth"
                          placeholder="560"
                          value={formData.playerWidth}
                          onChange={(e) => setFormData({...formData, playerWidth: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="playerHeight">Player Height</Label>
                        <Input
                          id="playerHeight"
                          placeholder="315"
                          value={formData.playerHeight}
                          onChange={(e) => setFormData({...formData, playerHeight: e.target.value})}
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="playerStream">Stream URL (optional)</Label>
                        <Input
                          id="playerStream"
                          placeholder="https://example.com/stream.mp4"
                          value={formData.playerStream}
                          onChange={(e) => setFormData({...formData, playerStream: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.cardType === 'app' && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">App Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="appIdIphone">iPhone App ID</Label>
                        <Input
                          id="appIdIphone"
                          placeholder="123456789"
                          value={formData.appIdIphone}
                          onChange={(e) => setFormData({...formData, appIdIphone: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="appNameIphone">iPhone App Name</Label>
                        <Input
                          id="appNameIphone"
                          placeholder="Your App Name"
                          value={formData.appNameIphone}
                          onChange={(e) => setFormData({...formData, appNameIphone: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="appIdGoogleplay">Google Play App ID</Label>
                        <Input
                          id="appIdGoogleplay"
                          placeholder="com.example.app"
                          value={formData.appIdGoogleplay}
                          onChange={(e) => setFormData({...formData, appIdGoogleplay: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="appNameGoogleplay">Google Play App Name</Label>
                        <Input
                          id="appNameGoogleplay"
                          placeholder="Your App Name"
                          value={formData.appNameGoogleplay}
                          onChange={(e) => setFormData({...formData, appNameGoogleplay: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="appUrlIphone">iPhone App URL</Label>
                        <Input
                          id="appUrlIphone"
                          placeholder="yourapp://open"
                          value={formData.appUrlIphone}
                          onChange={(e) => setFormData({...formData, appUrlIphone: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="appUrlGoogleplay">Google Play App URL</Label>
                        <Input
                          id="appUrlGoogleplay"
                          placeholder="yourapp://open"
                          value={formData.appUrlGoogleplay}
                          onChange={(e) => setFormData({...formData, appUrlGoogleplay: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button onClick={generateTwitterCardTags} className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Generate Twitter Card Tags
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
                  Generated Twitter Card Tags
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
                    <p>Configure your Twitter Card settings and click "Generate" to see the tags</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Twitter Card Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm">Summary Card</h4>
                      <p className="text-sm text-gray-600">Basic card with title, description, and small image</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Summary Large Image</h4>
                      <p className="text-sm text-gray-600">Enhanced card with large prominent image</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">App Card</h4>
                      <p className="text-sm text-gray-600">Promotes mobile apps with store links</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Player Card</h4>
                      <p className="text-sm text-gray-600">Embedded video/audio player</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Test with Twitter Card Validator</li>
                    <li>• Use high-quality images (1200x630px)</li>
                    <li>• Keep titles under 70 characters</li>
                    <li>• Descriptions should be concise and engaging</li>
                    <li>• Include @mentions for attribution</li>
                    <li>• Use absolute URLs for all resources</li>
                    <li>• Consider mobile viewing experience</li>
                    <li>• Add alt text for accessibility</li>
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

export default TwitterCardGenerator;
