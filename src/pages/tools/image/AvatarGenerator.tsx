
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Download, User, Shuffle, Eye, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AvatarGenerator = () => {
  const [avatarName, setAvatarName] = useState('');
  const [size, setSize] = useState([256]);
  const [style, setStyle] = useState('geometric');
  const [colorScheme, setColorScheme] = useState('vibrant');
  const [backgroundColor, setBackgroundColor] = useState('#f0f0f0');
  const [borderRadius, setBorderRadius] = useState([50]);
  const [showInitials, setShowInitials] = useState(true);
  const [fontWeight, setFontWeight] = useState('bold');
  const [borderWidth, setBorderWidth] = useState([0]);
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const avatarStyles = [
    { value: 'geometric', label: 'Geometric Shapes' },
    { value: 'initials', label: 'Text Initials' },
    { value: 'abstract', label: 'Abstract Pattern' },
    { value: 'pixelart', label: 'Pixel Art Style' },
    { value: 'gradient', label: 'Gradient Background' },
    { value: 'identicon', label: 'Identicon' }
  ];

  const colorSchemes = [
    { value: 'vibrant', label: 'Vibrant Colors', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'] },
    { value: 'pastel', label: 'Pastel Colors', colors: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFB3FF'] },
    { value: 'monochrome', label: 'Monochrome', colors: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7'] },
    { value: 'warm', label: 'Warm Tones', colors: ['#E74C3C', '#E67E22', '#F39C12', '#F1C40F', '#27AE60'] },
    { value: 'cool', label: 'Cool Tones', colors: ['#3498DB', '#9B59B6', '#1ABC9C', '#2ECC71', '#34495E'] }
  ];

  const fontWeights = [
    { value: 'normal', label: 'Normal' },
    { value: 'bold', label: 'Bold' },
    { value: '900', label: 'Black' }
  ];

  const generateHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const getColorFromScheme = (scheme: string, index: number) => {
    const schemeData = colorSchemes.find(s => s.value === scheme);
    if (!schemeData) return '#FF6B6B';
    return schemeData.colors[index % schemeData.colors.length];
  };

  const generateGeometric = (ctx: CanvasRenderingContext2D, hash: number, size: number) => {
    const shapes = ['circle', 'square', 'triangle', 'hexagon'];
    const shapeCount = 3 + (hash % 4);
    
    for (let i = 0; i < shapeCount; i++) {
      const shapeHash = hash + i * 1000;
      const shape = shapes[shapeHash % shapes.length];
      const x = (shapeHash % (size - 60)) + 30;
      const y = ((shapeHash * 7) % (size - 60)) + 30;
      const shapeSize = 20 + (shapeHash % 40);
      const color = getColorFromScheme(colorScheme, i);
      
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8;
      
      switch (shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(x, y, shapeSize / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'square':
          ctx.fillRect(x - shapeSize / 2, y - shapeSize / 2, shapeSize, shapeSize);
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(x, y - shapeSize / 2);
          ctx.lineTo(x - shapeSize / 2, y + shapeSize / 2);
          ctx.lineTo(x + shapeSize / 2, y + shapeSize / 2);
          ctx.closePath();
          ctx.fill();
          break;
        case 'hexagon':
          const sides = 6;
          const radius = shapeSize / 2;
          ctx.beginPath();
          for (let j = 0; j < sides; j++) {
            const angle = (j * 2 * Math.PI) / sides;
            const px = x + radius * Math.cos(angle);
            const py = y + radius * Math.sin(angle);
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          break;
      }
    }
    ctx.globalAlpha = 1;
  };

  const generateInitials = (ctx: CanvasRenderingContext2D, name: string, size: number) => {
    const initials = name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').slice(0, 2);
    const fontSize = size * 0.3;
    
    ctx.fillStyle = getColorFromScheme(colorScheme, 0);
    ctx.font = `${fontWeight} ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText(initials, size / 2, size / 2);
  };

  const generateAbstract = (ctx: CanvasRenderingContext2D, hash: number, size: number) => {
    const lineCount = 20 + (hash % 30);
    
    for (let i = 0; i < lineCount; i++) {
      const lineHash = hash + i * 500;
      const x1 = lineHash % size;
      const y1 = (lineHash * 3) % size;
      const x2 = (lineHash * 7) % size;
      const y2 = (lineHash * 11) % size;
      const thickness = 2 + (lineHash % 8);
      const color = getColorFromScheme(colorScheme, i % 5);
      
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  const generatePixelArt = (ctx: CanvasRenderingContext2D, hash: number, size: number) => {
    const gridSize = 16;
    const pixelSize = size / gridSize;
    
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const pixelHash = hash + x * 1000 + y * 100;
        if (pixelHash % 3 === 0) {
          const color = getColorFromScheme(colorScheme, (x + y) % 5);
          ctx.fillStyle = color;
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  };

  const generateGradient = (ctx: CanvasRenderingContext2D, hash: number, size: number) => {
    const color1 = getColorFromScheme(colorScheme, hash % 5);
    const color2 = getColorFromScheme(colorScheme, (hash + 2) % 5);
    
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  };

  const generateIdenticon = (ctx: CanvasRenderingContext2D, hash: number, size: number) => {
    const gridSize = 5;
    const cellSize = size / gridSize;
    
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const cellHash = hash + x * 100 + y * 10;
        const mirrorX = gridSize - 1 - x;
        
        if (cellHash % 2 === 0) {
          const color = getColorFromScheme(colorScheme, (x + y) % 3);
          ctx.fillStyle = color;
          
          // Draw original cell
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          
          // Mirror horizontally if not center column
          if (x !== Math.floor(gridSize / 2)) {
            ctx.fillRect(mirrorX * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
      }
    }
  };

  const generateAvatar = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const avatarSize = size[0];
    
    canvas.width = avatarSize;
    canvas.height = avatarSize;

    // Clear canvas
    ctx.clearRect(0, 0, avatarSize, avatarSize);

    // Background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, avatarSize, avatarSize);

    // Generate hash from name or random if no name
    const seedText = avatarName || Math.random().toString();
    const hash = generateHash(seedText);

    // Generate avatar based on style
    switch (style) {
      case 'geometric':
        generateGeometric(ctx, hash, avatarSize);
        break;
      case 'initials':
        if (avatarName && showInitials) {
          generateInitials(ctx, avatarName, avatarSize);
        }
        break;
      case 'abstract':
        generateAbstract(ctx, hash, avatarSize);
        break;
      case 'pixelart':
        generatePixelArt(ctx, hash, avatarSize);
        break;
      case 'gradient':
        generateGradient(ctx, hash, avatarSize);
        if (avatarName && showInitials) {
          generateInitials(ctx, avatarName, avatarSize);
        }
        break;
      case 'identicon':
        generateIdenticon(ctx, hash, avatarSize);
        break;
    }

    // Apply border radius by creating a new canvas
    const finalCanvas = document.createElement('canvas');
    const finalCtx = finalCanvas.getContext('2d')!;
    finalCanvas.width = avatarSize + borderWidth[0] * 2;
    finalCanvas.height = avatarSize + borderWidth[0] * 2;

    // Draw border if needed
    if (borderWidth[0] > 0) {
      finalCtx.fillStyle = borderColor;
      finalCtx.beginPath();
      finalCtx.roundRect(0, 0, finalCanvas.width, finalCanvas.height, borderRadius[0] * finalCanvas.width / 100);
      finalCtx.fill();
    }

    // Clip to rounded rectangle
    finalCtx.save();
    finalCtx.beginPath();
    finalCtx.roundRect(
      borderWidth[0], borderWidth[0], 
      avatarSize, avatarSize, 
      borderRadius[0] * avatarSize / 100
    );
    finalCtx.clip();

    // Draw the avatar
    finalCtx.drawImage(canvas, borderWidth[0], borderWidth[0]);
    finalCtx.restore();

    const dataURL = finalCanvas.toDataURL('image/png');
    setGeneratedAvatar(dataURL);

    toast({
      title: "Avatar Generated",
      description: `Created ${avatarSize}×${avatarSize} avatar.`
    });
  };

  const randomizeAvatar = () => {
    setAvatarName(Math.random().toString(36).substring(2, 8));
    generateAvatar();
  };

  const downloadAvatar = () => {
    if (generatedAvatar) {
      const a = document.createElement('a');
      a.href = generatedAvatar;
      a.download = `avatar-${avatarName || 'random'}-${size[0]}x${size[0]}.png`;
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
            Avatar Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Generate unique, customizable avatars for profiles, gaming, and social media with various styles and patterns.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Name or Seed Text</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={avatarName}
                      onChange={(e) => setAvatarName(e.target.value)}
                      placeholder="Enter name for consistent avatar"
                      className="flex-1"
                    />
                    <Button size="sm" onClick={randomizeAvatar}>
                      <Shuffle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Size: {size[0]}px</Label>
                  <Slider
                    value={size}
                    onValueChange={setSize}
                    min={64}
                    max={512}
                    step={32}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Avatar Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {avatarStyles.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Color Scheme</Label>
                  <Select value={colorScheme} onValueChange={setColorScheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorSchemes.map(scheme => (
                        <SelectItem key={scheme.value} value={scheme.value}>
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {scheme.colors.slice(0, 3).map((color, i) => (
                                <div
                                  key={i}
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <span>{scheme.label}</span>
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
                <CardTitle>Appearance</CardTitle>
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

                <div className="space-y-3">
                  <Label>Border Width: {borderWidth[0]}px</Label>
                  <Slider
                    value={borderWidth}
                    onValueChange={setBorderWidth}
                    min={0}
                    max={20}
                    step={2}
                    className="w-full"
                  />
                </div>

                {borderWidth[0] > 0 && (
                  <div className="space-y-3">
                    <Label>Border Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                )}

                {['initials', 'gradient'].includes(style) && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-initials"
                        checked={showInitials}
                        onCheckedChange={setShowInitials}
                      />
                      <Label htmlFor="show-initials">Show initials text</Label>
                    </div>

                    {showInitials && (
                      <div className="space-y-3">
                        <Label>Font Weight</Label>
                        <Select value={fontWeight} onValueChange={setFontWeight}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fontWeights.map(fw => (
                              <SelectItem key={fw.value} value={fw.value}>{fw.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={generateAvatar} className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                  
                  <Button 
                    onClick={downloadAvatar}
                    disabled={!generatedAvatar}
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
              <CardTitle>Avatar Preview</CardTitle>
              <CardDescription>Your generated avatar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg p-8 bg-gray-50 min-h-[500px] flex items-center justify-center">
                {generatedAvatar ? (
                  <div className="text-center">
                    <img 
                      src={generatedAvatar} 
                      alt="Generated avatar" 
                      className="mx-auto rounded shadow-lg"
                      style={{ 
                        width: Math.min(300, size[0]), 
                        height: Math.min(300, size[0]),
                        imageRendering: style === 'pixelart' ? 'pixelated' : 'auto'
                      }}
                    />
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Size: {size[0]} × {size[0]} pixels</p>
                      <p>Style: {avatarStyles.find(s => s.value === style)?.label}</p>
                      <p>Colors: {colorSchemes.find(c => c.value === colorScheme)?.label}</p>
                      {avatarName && <p>Seed: {avatarName}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Configure settings and click "Generate"</p>
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

export default AvatarGenerator;
