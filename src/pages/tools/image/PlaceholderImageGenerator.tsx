
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Download, Image as ImageIcon, Palette, Type } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PlaceholderImageGenerator = () => {
  const [width, setWidth] = useState([800]);
  const [height, setHeight] = useState([600]);
  const [backgroundColor, setBackgroundColor] = useState('#f0f0f0');
  const [textColor, setTextColor] = useState('#333333');
  const [customText, setCustomText] = useState('');
  const [fontSize, setFontSize] = useState([24]);
  const [pattern, setPattern] = useState('solid');
  const [showDimensions, setShowDimensions] = useState(true);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const patterns = [
    { value: 'solid', label: 'Solid Color' },
    { value: 'gradient', label: 'Linear Gradient' },
    { value: 'radial', label: 'Radial Gradient' },
    { value: 'stripes', label: 'Diagonal Stripes' },
    { value: 'dots', label: 'Polka Dots' },
    { value: 'checkerboard', label: 'Checkerboard' },
    { value: 'noise', label: 'Random Noise' }
  ];

  const generateImage = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = width[0];
    canvas.height = height[0];

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply background pattern
    switch (pattern) {
      case 'solid':
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;
      
      case 'gradient':
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, backgroundColor);
        gradient.addColorStop(1, adjustColor(backgroundColor, -30));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;
      
      case 'radial':
        const radialGradient = ctx.createRadialGradient(
          canvas.width/2, canvas.height/2, 0,
          canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)/2
        );
        radialGradient.addColorStop(0, backgroundColor);
        radialGradient.addColorStop(1, adjustColor(backgroundColor, -40));
        ctx.fillStyle = radialGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;
      
      case 'stripes':
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = adjustColor(backgroundColor, -20);
        for (let i = 0; i < canvas.width + canvas.height; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i - canvas.height, canvas.height);
          ctx.lineTo(i - canvas.height + 20, canvas.height);
          ctx.lineTo(i + 20, 0);
          ctx.closePath();
          ctx.fill();
        }
        break;
      
      case 'dots':
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = adjustColor(backgroundColor, -30);
        const dotSize = Math.min(canvas.width, canvas.height) * 0.02;
        for (let x = dotSize * 2; x < canvas.width; x += dotSize * 4) {
          for (let y = dotSize * 2; y < canvas.height; y += dotSize * 4) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
      
      case 'checkerboard':
        const squareSize = Math.min(canvas.width, canvas.height) * 0.1;
        for (let x = 0; x < canvas.width; x += squareSize) {
          for (let y = 0; y < canvas.height; y += squareSize) {
            const isEven = Math.floor(x / squareSize) % 2 === Math.floor(y / squareSize) % 2;
            ctx.fillStyle = isEven ? backgroundColor : adjustColor(backgroundColor, -20);
            ctx.fillRect(x, y, squareSize, squareSize);
          }
        }
        break;
      
      case 'noise':
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 40;
          data[i] = Math.max(0, Math.min(255, data[i] + noise));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);
        break;
    }

    // Add text
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize[0]}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    if (customText) {
      ctx.fillText(customText, centerX, centerY);
    } else if (showDimensions) {
      ctx.fillText(`${width[0]} × ${height[0]}`, centerX, centerY);
    }

    // Convert to data URL
    const dataURL = canvas.toDataURL('image/png');
    setGeneratedImage(dataURL);

    toast({
      title: "Image Generated",
      description: `Created ${width[0]}×${height[0]} placeholder image.`
    });
  };

  const adjustColor = (color: string, amount: number) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const downloadImage = () => {
    if (generatedImage) {
      const a = document.createElement('a');
      a.href = generatedImage;
      a.download = `placeholder-${width[0]}x${height[0]}.png`;
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
            Placeholder Image Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create custom placeholder images with various patterns, colors, and text for your design projects.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Image Settings</CardTitle>
              <CardDescription>Customize your placeholder image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label>Width: {width[0]}px</Label>
                  <Slider
                    value={width}
                    onValueChange={setWidth}
                    min={100}
                    max={2000}
                    step={10}
                    className="w-full"
                  />
                </div>
                <div className="space-y-3">
                  <Label>Height: {height[0]}px</Label>
                  <Slider
                    value={height}
                    onValueChange={setHeight}
                    min={100}
                    max={2000}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Background Pattern</Label>
                <Select value={pattern} onValueChange={setPattern}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {patterns.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

              <div className="space-y-3">
                <Label>Custom Text (optional)</Label>
                <Input
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Leave empty to show dimensions"
                />
              </div>

              <div className="space-y-3">
                <Label>Font Size: {fontSize[0]}px</Label>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  min={12}
                  max={72}
                  step={2}
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-dimensions"
                  checked={showDimensions}
                  onCheckedChange={setShowDimensions}
                />
                <Label htmlFor="show-dimensions">Show dimensions when no custom text</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button onClick={generateImage} className="w-full">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Generate Image
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

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Your generated placeholder image</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[400px] flex items-center justify-center">
                {generatedImage ? (
                  <img 
                    src={generatedImage} 
                    alt="Generated placeholder" 
                    className="max-w-full max-h-[500px] object-contain rounded shadow-lg"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Click "Generate Image" to create your placeholder</p>
                  </div>
                )}
              </div>
              
              {generatedImage && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  <p>Size: {width[0]} × {height[0]} pixels</p>
                  <p>Pattern: {patterns.find(p => p.value === pattern)?.label}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </Layout>
  );
};

export default PlaceholderImageGenerator;
