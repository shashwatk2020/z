import React, { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, Download, Palette, Lock, Unlock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ColorPaletteGenerator = () => {
  const [baseColor, setBaseColor] = useState('#3498db');
  const [paletteType, setPaletteType] = useState('complementary');
  const [colorCount, setColorCount] = useState('5');
  const [palette, setPalette] = useState<string[]>([]);
  const [lockedColors, setLockedColors] = useState<boolean[]>([]);
  const [history, setHistory] = useState<string[][]>([]);
  const { toast } = useToast();

  const hexToHsl = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

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

  const hslToHex = (h: number, s: number, l: number): string => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const generatePalette = useCallback(() => {
    const count = parseInt(colorCount);
    const [h, s, l] = hexToHsl(baseColor);
    let newPalette: string[] = [];

    switch (paletteType) {
      case 'monochromatic':
        for (let i = 0; i < count; i++) {
          const newL = Math.max(10, Math.min(90, l + (i - count/2) * 15));
          newPalette.push(hslToHex(h, s, newL));
        }
        break;
      
      case 'analogous':
        for (let i = 0; i < count; i++) {
          const newH = (h + (i - count/2) * 30) % 360;
          newPalette.push(hslToHex(newH, s, l));
        }
        break;
      
      case 'complementary':
        newPalette.push(baseColor);
        if (count > 1) newPalette.push(hslToHex((h + 180) % 360, s, l));
        for (let i = 2; i < count; i++) {
          const newH = (h + (i - 1) * 60) % 360;
          newPalette.push(hslToHex(newH, s, l));
        }
        break;
      
      case 'triadic':
        for (let i = 0; i < count; i++) {
          const newH = (h + i * 120) % 360;
          newPalette.push(hslToHex(newH, s, l));
        }
        break;
      
      case 'split-complementary':
        newPalette.push(baseColor);
        if (count > 1) newPalette.push(hslToHex((h + 150) % 360, s, l));
        if (count > 2) newPalette.push(hslToHex((h + 210) % 360, s, l));
        for (let i = 3; i < count; i++) {
          const newH = (h + i * 40) % 360;
          newPalette.push(hslToHex(newH, s, l));
        }
        break;
      
      case 'random':
        for (let i = 0; i < count; i++) {
          const newH = Math.random() * 360;
          const newS = 40 + Math.random() * 40;
          const newL = 30 + Math.random() * 40;
          newPalette.push(hslToHex(newH, newS, newL));
        }
        break;
    }

    // Keep locked colors
    const finalPalette = newPalette.map((color, index) => {
      return lockedColors[index] && palette[index] ? palette[index] : color;
    });

    setPalette(finalPalette);
    setLockedColors(new Array(finalPalette.length).fill(false));
    setHistory(prev => [finalPalette, ...prev.slice(0, 9)]);
  }, [baseColor, paletteType, colorCount, lockedColors, palette]);

  const toggleLock = (index: number) => {
    setLockedColors(prev => {
      const newLocked = [...prev];
      newLocked[index] = !newLocked[index];
      return newLocked;
    });
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: "Copied!",
      description: `Color ${color} copied to clipboard`
    });
  };

  const copyPalette = () => {
    const paletteText = palette.join(', ');
    navigator.clipboard.writeText(paletteText);
    toast({
      title: "Palette Copied!",
      description: "All colors copied to clipboard"
    });
  };

  const exportPalette = (format: string) => {
    let content = '';
    const timestamp = new Date().toISOString().slice(0, 10);
    
    switch (format) {
      case 'css':
        content = `:root {\n${palette.map((color, i) => `  --color-${i + 1}: ${color};`).join('\n')}\n}`;
        break;
      case 'scss':
        content = palette.map((color, i) => `$color-${i + 1}: ${color};`).join('\n');
        break;
      case 'json':
        content = JSON.stringify({ palette, type: paletteType, base: baseColor }, null, 2);
        break;
      case 'adobe':
        content = palette.map((color, i) => `Color ${i + 1}\t${color}`).join('\n');
        break;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-${timestamp}.${format === 'json' ? 'json' : format === 'adobe' ? 'txt' : format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const randomizeUnlocked = () => {
    const newPalette = palette.map((color, index) => {
      if (lockedColors[index]) return color;
      
      const newH = Math.random() * 360;
      const newS = 40 + Math.random() * 40;
      const newL = 30 + Math.random() * 40;
      return hslToHex(newH, newS, newL);
    });
    
    setPalette(newPalette);
    setHistory(prev => [newPalette, ...prev.slice(0, 9)]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Color Palette Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create beautiful color palettes using various color harmony algorithms. Perfect for designers and developers.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Palette Settings</CardTitle>
                  <CardDescription>Configure your color palette generation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="baseColor">Base Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="baseColor"
                        type="color"
                        value={baseColor}
                        onChange={(e) => setBaseColor(e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={baseColor}
                        onChange={(e) => setBaseColor(e.target.value)}
                        placeholder="#3498db"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Palette Type</Label>
                    <Select value={paletteType} onValueChange={setPaletteType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monochromatic">Monochromatic</SelectItem>
                        <SelectItem value="analogous">Analogous</SelectItem>
                        <SelectItem value="complementary">Complementary</SelectItem>
                        <SelectItem value="triadic">Triadic</SelectItem>
                        <SelectItem value="split-complementary">Split Complementary</SelectItem>
                        <SelectItem value="random">Random</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="colorCount">Number of Colors</Label>
                    <Select value={colorCount} onValueChange={setColorCount}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 colors</SelectItem>
                        <SelectItem value="4">4 colors</SelectItem>
                        <SelectItem value="5">5 colors</SelectItem>
                        <SelectItem value="6">6 colors</SelectItem>
                        <SelectItem value="8">8 colors</SelectItem>
                        <SelectItem value="10">10 colors</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={generatePalette} className="flex-1">
                      <Palette className="h-4 w-4 mr-2" />
                      Generate Palette
                    </Button>
                    <Button variant="outline" onClick={randomizeUnlocked}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" onClick={copyPalette} className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All Colors
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportPalette('css')}>
                      CSS
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportPalette('scss')}>
                      SCSS
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportPalette('json')}>
                      JSON
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportPalette('adobe')}>
                      Adobe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Palette</CardTitle>
                  <CardDescription>Click to copy colors, lock to preserve during regeneration</CardDescription>
                </CardHeader>
                <CardContent>
                  {palette.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {palette.map((color, index) => (
                          <div key={index} className="space-y-2">
                            <div 
                              className="w-full h-24 rounded-lg border cursor-pointer relative group"
                              style={{ backgroundColor: color }}
                              onClick={() => copyColor(color)}
                            >
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
                                <Copy className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-sm">{color}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleLock(index)}
                                className="p-1"
                              >
                                {lockedColors[index] ? (
                                  <Lock className="h-4 w-4" />
                                ) : (
                                  <Unlock className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Click "Generate Palette" to create your color palette
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {history.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Palette History</CardTitle>
                    <CardDescription>Recent palettes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {history.map((historyPalette, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex gap-1 flex-1">
                            {historyPalette.map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="w-8 h-8 rounded border cursor-pointer"
                                style={{ backgroundColor: color }}
                                onClick={() => copyColor(color)}
                              />
                            ))}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setPalette(historyPalette);
                              setLockedColors(new Array(historyPalette.length).fill(false));
                            }}
                          >
                            Use
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ColorPaletteGenerator;
