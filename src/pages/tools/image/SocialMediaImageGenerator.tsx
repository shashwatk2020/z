
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload, Download, Image as ImageIcon, X, Share2, Type, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SocialMediaImageGenerator = () => {
  const [platform, setPlatform] = useState('twitter');
  const [template, setTemplate] = useState('quote');
  const [title, setTitle] = useState('Your Amazing Title Here');
  const [subtitle, setSubtitle] = useState('Add your subtitle or description');
  const [authorName, setAuthorName] = useState('');
  const [backgroundType, setBackgroundType] = useState('gradient');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#667eea');
  const [secondaryColor, setSecondaryColor] = useState('#764ba2');
  const [textColor, setTextColor] = useState('#ffffff');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoSize, setLogoSize] = useState([15]);
  const [titleSize, setTitleSize] = useState([48]);
  const [overlayOpacity, setOverlayOpacity] = useState([50]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const platforms = [
    { value: 'twitter', label: 'Twitter/X Post', width: 1200, height: 675, description: '16:9 ratio' },
    { value: 'twitter-header', label: 'Twitter Header', width: 1500, height: 500, description: '3:1 ratio' },
    { value: 'instagram-post', label: 'Instagram Post', width: 1080, height: 1080, description: 'Square' },
    { value: 'instagram-story', label: 'Instagram Story', width: 1080, height: 1920, description: '9:16 ratio' },
    { value: 'facebook-post', label: 'Facebook Post', width: 1200, height: 630, description: '1.91:1 ratio' },
    { value: 'facebook-cover', label: 'Facebook Cover', width: 1200, height: 315, description: '3.8:1 ratio' },
    { value: 'linkedin-post', label: 'LinkedIn Post', width: 1200, height: 627, description: '1.91:1 ratio' },
    { value: 'youtube-thumbnail', label: 'YouTube Thumbnail', width: 1280, height: 720, description: '16:9 ratio' },
    { value: 'pinterest', label: 'Pinterest Pin', width: 1000, height: 1500, description: '2:3 ratio' },
    { value: 'blog-header', label: 'Blog Header', width: 1200, height: 600, description: '2:1 ratio' }
  ];

  const templates = [
    { value: 'quote', label: 'Quote Card', description: 'Large text with attribution' },
    { value: 'announcement', label: 'Announcement', description: 'Bold title with description' },
    { value: 'tips', label: 'Tips/List', description: 'Numbered or bulleted content' },
    { value: 'minimal', label: 'Minimal Text', description: 'Clean, simple design' },
    { value: 'photo-overlay', label: 'Photo Overlay', description: 'Text over background image' },
    { value: 'split-design', label: 'Split Design', description: 'Text and image sections' }
  ];

  const backgroundTypes = [
    { value: 'gradient', label: 'Gradient Background' },
    { value: 'solid', label: 'Solid Color' },
    { value: 'image', label: 'Background Image' },
    { value: 'pattern', label: 'Geometric Pattern' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setBackgroundImage(url);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
    }
  };

  const getCurrentPlatform = () => {
    return platforms.find(p => p.value === platform) || platforms[0];
  };

  const generateImage = async () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const platformData = getCurrentPlatform();
    
    canvas.width = platformData.width;
    canvas.height = platformData.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    await drawBackground(ctx, canvas.width, canvas.height);

    // Draw content based on template
    await drawTemplate(ctx, canvas.width, canvas.height);

    // Add logo if provided
    if (logoUrl) {
      await drawLogo(ctx, canvas.width, canvas.height);
    }

    const dataURL = canvas.toDataURL('image/png');
    setGeneratedImage(dataURL);

    toast({
      title: "Image Generated",
      description: `Created ${platformData.width}×${platformData.height} social media image.`
    });
  };

  const drawBackground = async (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    switch (backgroundType) {
      case 'gradient':
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(1, secondaryColor);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        break;
      
      case 'solid':
        ctx.fillStyle = primaryColor;
        ctx.fillRect(0, 0, width, height);
        break;
      
      case 'image':
        if (backgroundImage) {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              // Draw image to fill canvas
              const scale = Math.max(width / img.width, height / img.height);
              const scaledWidth = img.width * scale;
              const scaledHeight = img.height * scale;
              const x = (width - scaledWidth) / 2;
              const y = (height - scaledHeight) / 2;
              
              ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
              
              // Add overlay
              ctx.fillStyle = `${primaryColor}${Math.round(overlayOpacity[0] * 2.55).toString(16).padStart(2, '0')}`;
              ctx.fillRect(0, 0, width, height);
              
              resolve();
            };
            img.src = backgroundImage;
          });
        }
        break;
      
      case 'pattern':
        ctx.fillStyle = primaryColor;
        ctx.fillRect(0, 0, width, height);
        
        // Draw geometric pattern
        ctx.fillStyle = secondaryColor;
        ctx.globalAlpha = 0.1;
        const patternSize = Math.min(width, height) / 10;
        for (let x = 0; x < width; x += patternSize * 2) {
          for (let y = 0; y < height; y += patternSize * 2) {
            ctx.fillRect(x, y, patternSize, patternSize);
          }
        }
        ctx.globalAlpha = 1;
        break;
    }
  };

  const drawTemplate = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    
    const margin = width * 0.08;
    const contentWidth = width - margin * 2;
    const contentHeight = height - margin * 2;
    
    switch (template) {
      case 'quote':
        // Large quote text
        ctx.font = `bold ${titleSize[0]}px Arial, sans-serif`;
        ctx.textBaseline = 'middle';
        
        const lines = wrapText(ctx, `"${title}"`, contentWidth);
        const lineHeight = titleSize[0] * 1.2;
        const totalHeight = lines.length * lineHeight;
        const startY = (height - totalHeight) / 2;
        
        lines.forEach((line, index) => {
          ctx.fillText(line, width / 2, startY + index * lineHeight);
        });
        
        // Attribution
        if (authorName) {
          ctx.font = `normal ${titleSize[0] * 0.4}px Arial, sans-serif`;
          ctx.fillText(`— ${authorName}`, width / 2, startY + totalHeight + lineHeight);
        }
        break;
      
      case 'announcement':
        // Title
        ctx.font = `bold ${titleSize[0]}px Arial, sans-serif`;
        ctx.textBaseline = 'top';
        
        const titleLines = wrapText(ctx, title, contentWidth);
        let currentY = margin + contentHeight * 0.2;
        
        titleLines.forEach((line, index) => {
          ctx.fillText(line, width / 2, currentY + index * titleSize[0] * 1.2);
        });
        
        currentY += titleLines.length * titleSize[0] * 1.2 + 40;
        
        // Subtitle
        if (subtitle) {
          ctx.font = `normal ${titleSize[0] * 0.5}px Arial, sans-serif`;
          const subtitleLines = wrapText(ctx, subtitle, contentWidth);
          
          subtitleLines.forEach((line, index) => {
            ctx.fillText(line, width / 2, currentY + index * titleSize[0] * 0.6);
          });
        }
        break;
      
      case 'minimal':
        ctx.font = `300 ${titleSize[0]}px Arial, sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.fillText(title, width / 2, height / 2);
        break;
      
      case 'photo-overlay':
        // Text overlay with better contrast
        const overlayHeight = height * 0.4;
        ctx.fillStyle = `rgba(0, 0, 0, 0.6)`;
        ctx.fillRect(0, height - overlayHeight, width, overlayHeight);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${titleSize[0]}px Arial, sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.fillText(title, width / 2, height - overlayHeight / 2);
        break;
      
      default:
        // Default template
        ctx.font = `bold ${titleSize[0]}px Arial, sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.fillText(title, width / 2, height / 2);
    }
  };

  const drawLogo = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    return new Promise<void>((resolve) => {
      const logo = new Image();
      logo.crossOrigin = 'anonymous';
      logo.onload = () => {
        const logoSizePixels = (Math.min(width, height) * logoSize[0]) / 100;
        const logoX = width - logoSizePixels - 40;
        const logoY = 40;
        
        ctx.drawImage(logo, logoX, logoY, logoSizePixels, logoSizePixels);
        resolve();
      };
      logo.onerror = () => resolve();
      logo.src = logoUrl;
    });
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const downloadImage = () => {
    if (generatedImage) {
      const platformData = getCurrentPlatform();
      const a = document.createElement('a');
      a.href = generatedImage;
      a.download = `social-media-${platform}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Social Media Image Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create professional social media graphics for all platforms with customizable templates, colors, and layouts.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform & Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map(p => (
                        <SelectItem key={p.value} value={p.value}>
                          <div>
                            <div>{p.label}</div>
                            <div className="text-xs text-gray-500">{p.width}×{p.height} - {p.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Template</Label>
                  <Select value={template} onValueChange={setTemplate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(t => (
                        <SelectItem key={t.value} value={t.value}>
                          <div>
                            <div>{t.label}</div>
                            <div className="text-xs text-gray-500">{t.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Type className="h-5 w-5 mr-2" />
                  Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Title/Main Text</Label>
                  <Textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your main title or quote"
                    rows={2}
                  />
                </div>

                {['announcement', 'tips'].includes(template) && (
                  <div className="space-y-3">
                    <Label>Subtitle/Description</Label>
                    <Textarea
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Additional description or details"
                      rows={2}
                    />
                  </div>
                )}

                {template === 'quote' && (
                  <div className="space-y-3">
                    <Label>Author Name</Label>
                    <Input
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Quote attribution"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <Label>Title Font Size: {titleSize[0]}px</Label>
                  <Slider
                    value={titleSize}
                    onValueChange={setTitleSize}
                    min={24}
                    max={120}
                    step={4}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Design & Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Background Type</Label>
                  <Select value={backgroundType} onValueChange={setBackgroundType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {backgroundTypes.map(bg => (
                        <SelectItem key={bg.value} value={bg.value}>{bg.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {backgroundType === 'image' && (
                  <div className="space-y-3">
                    <Label>Background Image</Label>
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {backgroundImage ? (
                        <div className="flex items-center justify-center space-x-2">
                          <ImageIcon className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-green-600">Image uploaded</span>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload background image</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label>Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Text Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {backgroundType === 'image' && (
                  <div className="space-y-3">
                    <Label>Overlay Opacity: {overlayOpacity[0]}%</Label>
                    <Slider
                      value={overlayOpacity}
                      onValueChange={setOverlayOpacity}
                      min={0}
                      max={80}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <Label>Logo URL (optional)</Label>
                  <Input
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                {logoUrl && (
                  <div className="space-y-3">
                    <Label>Logo Size: {logoSize[0]}%</Label>
                    <Slider
                      value={logoSize}
                      onValueChange={setLogoSize}
                      min={5}
                      max={25}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={generateImage} className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                  
                  <Button 
                    onClick={downloadImage}
                    disabled={!generatedImage}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                {getCurrentPlatform().label} - {getCurrentPlatform().width}×{getCurrentPlatform().height}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[500px] flex items-center justify-center">
                {generatedImage ? (
                  <div className="text-center">
                    <img 
                      src={generatedImage} 
                      alt="Generated social media image" 
                      className="max-w-full max-h-[500px] object-contain rounded shadow-lg"
                    />
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Platform: {getCurrentPlatform().label}</p>
                      <p>Size: {getCurrentPlatform().width}×{getCurrentPlatform().height}</p>
                      <p>Template: {templates.find(t => t.value === template)?.label}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Share2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Configure your design and click "Generate"</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </Layout>
  );
};

export default SocialMediaImageGenerator;
