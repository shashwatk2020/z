
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
import { Upload, Download, Image as ImageIcon, X, Star, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FaviconGenerator = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState([24]);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#333333');
  const [padding, setPadding] = useState([4]);
  const [borderRadius, setBorderRadius] = useState([0]);
  const [sourceType, setSourceType] = useState('image');
  const [generatedFavicons, setGeneratedFavicons] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const faviconSizes = [
    { size: 16, name: 'favicon-16x16.png', description: 'Browser tab (small)' },
    { size: 32, name: 'favicon-32x32.png', description: 'Browser tab (standard)' },
    { size: 48, name: 'favicon-48x48.png', description: 'Windows taskbar' },
    { size: 64, name: 'favicon-64x64.png', description: 'High DPI displays' },
    { size: 96, name: 'favicon-96x96.png', description: 'Android Chrome' },
    { size: 128, name: 'favicon-128x128.png', description: 'Chrome Web Store' },
    { size: 152, name: 'apple-touch-icon-152x152.png', description: 'iPad touch icon' },
    { size: 167, name: 'apple-touch-icon-167x167.png', description: 'iPad Pro touch icon' },
    { size: 180, name: 'apple-touch-icon-180x180.png', description: 'iPhone touch icon' },
    { size: 192, name: 'android-chrome-192x192.png', description: 'Android home screen' },
    { size: 512, name: 'android-chrome-512x512.png', description: 'Android splash screen' }
  ];

  const sourceTypes = [
    { value: 'image', label: 'Upload Image', description: 'Use an existing image' },
    { value: 'text', label: 'Text/Logo', description: 'Create from text or initials' },
    { value: 'emoji', label: 'Emoji', description: 'Use emoji as favicon' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      setGeneratedFavicons({});
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
    }
  };

  const generateFavicon = (size: number) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Apply border radius
    if (borderRadius[0] > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, (borderRadius[0] * size) / 100);
      ctx.clip();
    }

    // Background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);

    const paddingPixels = (padding[0] * size) / 100;
    const contentSize = size - paddingPixels * 2;

    if (sourceType === 'image' && originalImage) {
      // Draw image
      const img = new Image();
      return new Promise<string>((resolve) => {
        img.onload = () => {
          // Calculate scaling to fit within content area
          const scale = Math.min(contentSize / img.width, contentSize / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          const x = paddingPixels + (contentSize - scaledWidth) / 2;
          const y = paddingPixels + (contentSize - scaledHeight) / 2;

          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
          
          if (borderRadius[0] > 0) {
            ctx.restore();
          }
          
          resolve(canvas.toDataURL('image/png'));
        };
        img.src = originalImage;
      });
    } else if (sourceType === 'text' || sourceType === 'emoji') {
      // Draw text/emoji
      const displayText = text || 'F';
      const baseFontSize = size * 0.6;
      const adjustedFontSize = (baseFontSize * fontSize[0]) / 100;
      
      ctx.fillStyle = textColor;
      ctx.font = `bold ${adjustedFontSize}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.fillText(displayText, size / 2, size / 2);
      
      if (borderRadius[0] > 0) {
        ctx.restore();
      }
      
      return Promise.resolve(canvas.toDataURL('image/png'));
    }

    return Promise.resolve('');
  };

  const generateAllFavicons = async () => {
    if (sourceType === 'image' && !originalImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image first.",
        variant: "destructive"
      });
      return;
    }

    if ((sourceType === 'text' || sourceType === 'emoji') && !text.trim()) {
      toast({
        title: "No Text Entered",
        description: "Please enter text or emoji for the favicon.",
        variant: "destructive"
      });
      return;
    }

    const favicons: { [key: string]: string } = {};

    try {
      for (const faviconSize of faviconSizes) {
        const dataURL = await generateFavicon(faviconSize.size);
        favicons[faviconSize.name] = dataURL;
      }

      setGeneratedFavicons(favicons);
      
      toast({
        title: "Favicons Generated",
        description: `Created ${faviconSizes.length} favicon sizes.`
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate favicons. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadFavicon = (name: string, dataURL: string) => {
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllFavicons = () => {
    Object.entries(generatedFavicons).forEach(([name, dataURL]) => {
      setTimeout(() => downloadFavicon(name, dataURL), 100);
    });
  };

  const generateHTMLCode = () => {
    const htmlCode = `<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="shortcut icon" href="/favicon.ico">

<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">
<link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon-167x167.png">
<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">

<!-- Android Icons -->
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">

<!-- Manifest -->
<link rel="manifest" href="/site.webmanifest">`;

    navigator.clipboard.writeText(htmlCode);
    toast({
      title: "HTML Code Copied",
      description: "Favicon HTML code copied to clipboard."
    });
  };

  const generateManifest = () => {
    const manifest = {
      name: "Your App Name",
      short_name: "App",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ],
      theme_color: backgroundColor,
      background_color: backgroundColor,
      display: "standalone"
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site.webmanifest';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setGeneratedFavicons({});
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Favicon Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Generate complete favicon packages for your website including all sizes and formats for different devices and platforms.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Source Settings</CardTitle>
                <CardDescription>Choose your favicon source</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Source Type</Label>
                  <Select value={sourceType} onValueChange={setSourceType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div>{type.label}</div>
                            <div className="text-xs text-gray-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {sourceType === 'image' && (
                  <div className="space-y-6">
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Drop an image here or click to browse
                      </p>
                      <p className="text-gray-500">
                        PNG, JPG, or SVG recommended
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>

                    {selectedFile && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <ImageIcon className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-gray-900">{selectedFile.name}</p>
                            <p className="text-sm text-gray-500">Ready for favicon generation</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={removeFile}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {(sourceType === 'text' || sourceType === 'emoji') && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label>{sourceType === 'emoji' ? 'Emoji' : 'Text/Initials'}</Label>
                      <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={sourceType === 'emoji' ? '🚀' : 'Logo text or initials'}
                        maxLength={sourceType === 'emoji' ? 2 : 4}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Font Size: {fontSize[0]}%</Label>
                      <Slider
                        value={fontSize}
                        onValueChange={setFontSize}
                        min={50}
                        max={150}
                        step={5}
                        className="w-full"
                      />
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
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Style Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Background Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Padding: {padding[0]}%</Label>
                  <Slider
                    value={padding}
                    onValueChange={setPadding}
                    min={0}
                    max={25}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Border Radius: {borderRadius[0]}%</Label>
                  <Slider
                    value={borderRadius}
                    onValueChange={setBorderRadius}
                    min={0}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>

                <Button onClick={generateAllFavicons} className="w-full">
                  <Star className="h-4 w-4 mr-2" />
                  Generate All Favicons
                </Button>
              </CardContent>
            </Card>

            {Object.keys(generatedFavicons).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={downloadAllFavicons} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download All
                    </Button>
                    <Button onClick={generateHTMLCode} variant="outline">
                      <Globe className="h-4 w-4 mr-2" />
                      Copy HTML
                    </Button>
                  </div>
                  <Button onClick={generateManifest} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Manifest
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {(originalImage || text) && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>32x32 preview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                    {generatedFavicons['favicon-32x32.png'] ? (
                      <img 
                        src={generatedFavicons['favicon-32x32.png']} 
                        alt="Favicon preview" 
                        className="w-16 h-16 border border-gray-200"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <Star className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>Click "Generate All Favicons" to see preview</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {Object.keys(generatedFavicons).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Favicons</CardTitle>
                  <CardDescription>{faviconSizes.length} sizes generated</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {faviconSizes.map((favicon) => (
                      <div key={favicon.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={generatedFavicons[favicon.name]} 
                            alt={favicon.name}
                            className="w-8 h-8 border border-gray-200"
                            style={{ imageRendering: favicon.size <= 32 ? 'pixelated' : 'auto' }}
                          />
                          <div>
                            <p className="font-medium text-gray-900">{favicon.name}</p>
                            <p className="text-sm text-gray-500">{favicon.size}×{favicon.size} - {favicon.description}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadFavicon(favicon.name, generatedFavicons[favicon.name])}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </Layout>
  );
};

export default FaviconGenerator;
