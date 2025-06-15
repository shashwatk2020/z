
import React, { useState, useRef, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Copy, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FaviconGenerator = () => {
  const [text, setText] = useState('A');
  const [backgroundColor, setBackgroundColor] = useState('#3498db');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(48);
  const [borderRadius, setBorderRadius] = useState(8);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fontOptions = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
    'Courier New', 'Monaco', 'Impact', 'Comic Sans MS', 'Trebuchet MS'
  ];

  const generateFavicon = useCallback((size: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;

    // Apply border radius by clipping
    ctx.beginPath();
    const radius = (borderRadius / 64) * size; // Scale radius to size
    ctx.roundRect(0, 0, size, size, radius);
    ctx.clip();

    // Background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);

    if (mode === 'text') {
      // Text
      ctx.fillStyle = textColor;
      ctx.font = `${(fontSize / 64) * size}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, size / 2, size / 2);
    } else if (mode === 'image' && uploadedImage) {
      // Image
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(size / img.width, size / img.height);
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;
        const x = (size - newWidth) / 2;
        const y = (size - newHeight) / 2;
        ctx.drawImage(img, x, y, newWidth, newHeight);
      };
      img.src = uploadedImage;
    }

    return canvas.toDataURL('image/png');
  }, [text, backgroundColor, textColor, fontSize, borderRadius, fontFamily, mode, uploadedImage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setMode('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadFavicon = (size: number) => {
    const dataUrl = generateFavicon(size);
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = `favicon-${size}x${size}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const generateHTML = () => {
    return `<!-- Standard favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Android Chrome Icons -->
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">

<!-- Web App Manifest -->
<link rel="manifest" href="/site.webmanifest">`;
  };

  const copyHTML = () => {
    navigator.clipboard.writeText(generateHTML());
    toast({
      title: "Copied!",
      description: "HTML code copied to clipboard."
    });
  };

  const sizes = [16, 32, 48, 64, 128, 180, 192, 512];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Favicon Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create favicons for your website from text or images. Generate all sizes and get the HTML code.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Favicon Settings</CardTitle>
                  <CardDescription>Customize your favicon</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Mode</Label>
                    <Select value={mode} onValueChange={(value: 'text' | 'image') => setMode(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {mode === 'text' ? (
                    <>
                      <div className="space-y-2">
                        <Label>Text</Label>
                        <Input
                          value={text}
                          onChange={(e) => setText(e.target.value.slice(0, 3))}
                          placeholder="Enter 1-3 characters"
                          maxLength={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Font Family</Label>
                        <Select value={fontFamily} onValueChange={setFontFamily}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fontOptions.map((font) => (
                              <SelectItem key={font} value={font}>{font}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Font Size: {fontSize}px</Label>
                        <Slider value={[fontSize]} onValueChange={(v) => setFontSize(v[0])} min={20} max={80} step={1} />
                      </div>

                      <div className="space-y-2">
                        <Label>Text Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-16 h-10 p-1 border rounded"
                          />
                          <Input
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            placeholder="#ffffff"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label>Upload Image</Label>
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {uploadedImage ? (
                          <img src={uploadedImage} alt="Uploaded" className="w-16 h-16 mx-auto object-cover rounded" />
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-500">Click to upload image</p>
                          </>
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

                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        placeholder="#3498db"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Border Radius: {borderRadius}px</Label>
                    <Slider value={[borderRadius]} onValueChange={(v) => setBorderRadius(v[0])} min={0} max={32} step={1} />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-8">
                    <div 
                      className="border rounded-lg p-4"
                      style={{ 
                        backgroundColor: '#f8f9fa',
                        backgroundImage: 'radial-gradient(circle, #e9ecef 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }}
                    >
                      {mode === 'text' ? (
                        <div 
                          className="w-16 h-16 flex items-center justify-center text-white font-bold"
                          style={{
                            backgroundColor,
                            borderRadius: `${borderRadius}px`,
                            fontSize: `${fontSize / 4}px`,
                            fontFamily,
                            color: textColor
                          }}
                        >
                          {text}
                        </div>
                      ) : uploadedImage ? (
                        <div 
                          className="w-16 h-16 overflow-hidden"
                          style={{
                            backgroundColor,
                            borderRadius: `${borderRadius}px`
                          }}
                        >
                          <img src={uploadedImage} alt="Favicon preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div 
                          className="w-16 h-16 flex items-center justify-center"
                          style={{
                            backgroundColor,
                            borderRadius: `${borderRadius}px`
                          }}
                        >
                          <ImageIcon className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Download Favicons</CardTitle>
                  <CardDescription>Generate and download all favicon sizes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFavicon(size)}
                        className="flex flex-col h-auto py-3"
                      >
                        <Download className="h-4 w-4 mb-1" />
                        {size}x{size}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>HTML Code</CardTitle>
                  <CardDescription>Add these tags to your HTML head section</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">HTML Tags</h4>
                    <Button variant="ghost" size="sm" onClick={copyHTML}>
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                  </div>
                  <pre className="p-3 bg-gray-900 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                    <code>{generateHTML()}</code>
                  </pre>
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

export default FaviconGenerator;
