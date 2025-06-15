
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Upload, Download, Image as ImageIcon, X, Palette, Copy, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ColorPaletteExtractor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<any[]>([]);
  const [colorCount, setColorCount] = useState([8]);
  const [tolerance, setTolerance] = useState([10]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sortBy, setSortBy] = useState('frequency');
  const [includeHex, setIncludeHex] = useState(true);
  const [includeRgb, setIncludeRgb] = useState(true);
  const [includeHsl, setIncludeHsl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      setExtractedColors([]);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
    }
  };

  const extractColors = async () => {
    if (!selectedFile || !originalImage) return;

    setIsProcessing(true);
    try {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Resize image for faster processing
        const maxSize = 200;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Color frequency map
        const colorMap: { [key: string]: { count: number; r: number; g: number; b: number } } = {};
        
        // Sample pixels (skip some for performance)
        const sampleRate = 4;
        for (let i = 0; i < pixels.length; i += 4 * sampleRate) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          
          if (a > 128) { // Skip transparent pixels
            // Quantize colors based on tolerance
            const quantizedR = Math.round(r / tolerance[0]) * tolerance[0];
            const quantizedG = Math.round(g / tolerance[0]) * tolerance[0];
            const quantizedB = Math.round(b / tolerance[0]) * tolerance[0];
            
            const key = `${quantizedR},${quantizedG},${quantizedB}`;
            
            if (colorMap[key]) {
              colorMap[key].count++;
            } else {
              colorMap[key] = { count: 1, r: quantizedR, g: quantizedG, b: quantizedB };
            }
          }
        }

        // Convert to array and sort
        let colorsArray = Object.values(colorMap);
        
        // Sort by frequency or brightness
        if (sortBy === 'frequency') {
          colorsArray.sort((a, b) => b.count - a.count);
        } else if (sortBy === 'brightness') {
          colorsArray.sort((a, b) => {
            const brightnessA = (a.r + a.g + a.b) / 3;
            const brightnessB = (b.r + b.g + b.b) / 3;
            return brightnessB - brightnessA;
          });
        } else if (sortBy === 'hue') {
          colorsArray.sort((a, b) => {
            const hueA = rgbToHsl(a.r, a.g, a.b)[0];
            const hueB = rgbToHsl(b.r, b.g, b.b)[0];
            return hueA - hueB;
          });
        }

        // Take top colors
        const topColors = colorsArray.slice(0, colorCount[0]).map((color, index) => {
          const hex = rgbToHex(color.r, color.g, color.b);
          const hsl = rgbToHsl(color.r, color.g, color.b);
          return {
            id: index,
            hex,
            rgb: { r: color.r, g: color.g, b: color.b },
            hsl: { h: Math.round(hsl[0]), s: Math.round(hsl[1]), l: Math.round(hsl[2]) },
            frequency: color.count,
            percentage: ((color.count / (pixels.length / 4)) * 100).toFixed(1)
          };
        });

        setExtractedColors(topColors);
        setIsProcessing(false);
        
        toast({
          title: "Colors Extracted",
          description: `Found ${topColors.length} dominant colors in the image.`
        });
      };

      img.src = originalImage;
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Extraction Failed",
        description: "Failed to extract colors. Please try again.",
        variant: "destructive"
      });
    }
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${format} color value copied to clipboard.`
    });
  };

  const exportPalette = (format: string) => {
    let content = '';
    
    if (format === 'css') {
      content = ':root {\n' + extractedColors.map((color, index) => 
        `  --color-${index + 1}: ${color.hex};`
      ).join('\n') + '\n}';
    } else if (format === 'scss') {
      content = extractedColors.map((color, index) => 
        `$color-${index + 1}: ${color.hex};`
      ).join('\n');
    } else if (format === 'json') {
      content = JSON.stringify(extractedColors.map(color => ({
        hex: color.hex,
        rgb: color.rgb,
        hsl: color.hsl,
        frequency: color.frequency
      })), null, 2);
    } else if (format === 'ase') {
      // Adobe Swatch Exchange format (simplified)
      content = extractedColors.map((color, index) => 
        `Color ${index + 1}: ${color.hex}`
      ).join('\n');
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `color-palette.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setExtractedColors([]);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Color Palette Extractor
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Extract dominant colors from any image and generate color palettes in various formats for design projects.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
                <CardDescription>Select an image to extract colors from</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop an image here or click to browse
                  </p>
                  <p className="text-gray-500">
                    Supports JPG, PNG, WebP, and more
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
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ImageIcon className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">Ready for color extraction</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={removeFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label>Number of Colors: {colorCount[0]}</Label>
                        <Slider
                          value={colorCount}
                          onValueChange={setColorCount}
                          min={3}
                          max={20}
                          step={1}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Color Tolerance: {tolerance[0]}</Label>
                        <Slider
                          value={tolerance}
                          onValueChange={setTolerance}
                          min={5}
                          max={50}
                          step={5}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Sort By</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            size="sm"
                            variant={sortBy === 'frequency' ? 'default' : 'outline'}
                            onClick={() => setSortBy('frequency')}
                          >
                            Frequency
                          </Button>
                          <Button
                            size="sm"
                            variant={sortBy === 'brightness' ? 'default' : 'outline'}
                            onClick={() => setSortBy('brightness')}
                          >
                            Brightness
                          </Button>
                          <Button
                            size="sm"
                            variant={sortBy === 'hue' ? 'default' : 'outline'}
                            onClick={() => setSortBy('hue')}
                          >
                            Hue
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Color Formats</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="include-hex"
                              checked={includeHex}
                              onCheckedChange={setIncludeHex}
                            />
                            <Label htmlFor="include-hex">HEX values</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="include-rgb"
                              checked={includeRgb}
                              onCheckedChange={setIncludeRgb}
                            />
                            <Label htmlFor="include-rgb">RGB values</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="include-hsl"
                              checked={includeHsl}
                              onCheckedChange={setIncludeHsl}
                            />
                            <Label htmlFor="include-hsl">HSL values</Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={extractColors} 
                      disabled={isProcessing}
                      className="w-full"
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      {isProcessing ? 'Extracting Colors...' : 'Extract Color Palette'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {extractedColors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Export Palette</CardTitle>
                  <CardDescription>Download your color palette in various formats</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={() => exportPalette('css')} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      CSS
                    </Button>
                    <Button onClick={() => exportPalette('scss')} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      SCSS
                    </Button>
                    <Button onClick={() => exportPalette('json')} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      JSON
                    </Button>
                    <Button onClick={() => exportPalette('ase')} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      ASE
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {originalImage && (
              <Card>
                <CardHeader>
                  <CardTitle>Original Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={originalImage} 
                    alt="Original" 
                    className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                    style={{ maxHeight: '300px' }}
                  />
                </CardContent>
              </Card>
            )}

            {extractedColors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Extracted Color Palette</CardTitle>
                  <CardDescription>{extractedColors.length} dominant colors found</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {extractedColors.map((color, index) => (
                      <div key={color.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div 
                          className="w-12 h-12 rounded-lg border shadow-sm flex-shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">Color {index + 1}</span>
                            <span className="text-sm text-gray-500">{color.percentage}%</span>
                          </div>
                          <div className="space-y-1 text-sm">
                            {includeHex && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">HEX:</span>
                                <div className="flex items-center space-x-2">
                                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">{color.hex}</code>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(color.hex, 'HEX')}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                            {includeRgb && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">RGB:</span>
                                <div className="flex items-center space-x-2">
                                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                    {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                                  </code>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, 'RGB')}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                            {includeHsl && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">HSL:</span>
                                <div className="flex items-center space-x-2">
                                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                    {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
                                  </code>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`, 'HSL')}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
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

export default ColorPaletteExtractor;
