
import React, { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, Download, Plus, Trash2, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ColorStop {
  color: string;
  position: number;
  id: string;
}

const GradientGenerator = () => {
  const [gradientType, setGradientType] = useState('linear');
  const [direction, setDirection] = useState('to right');
  const [radialShape, setRadialShape] = useState('ellipse');
  const [radialSize, setRadialSize] = useState('farthest-corner');
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: '1', color: '#ff6b6b', position: 0 },
    { id: '2', color: '#4ecdc4', position: 100 }
  ]);
  const [presets] = useState([
    { name: 'Sunset', stops: [{ color: '#ff7e5f', position: 0 }, { color: '#feb47b', position: 100 }] },
    { name: 'Ocean', stops: [{ color: '#2193b0', position: 0 }, { color: '#6dd5ed', position: 100 }] },
    { name: 'Purple Dream', stops: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }] },
    { name: 'Forest', stops: [{ color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 }] },
    { name: 'Fire', stops: [{ color: '#ff416c', position: 0 }, { color: '#ff4b2b', position: 100 }] },
    { name: 'Candy', stops: [{ color: '#ff9a9e', position: 0 }, { color: '#fecfef', position: 50 }, { color: '#fecfef', position: 100 }] }
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const generateCSS = useCallback(() => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    const colorString = sortedStops.map(stop => `${stop.color} ${stop.position}%`).join(', ');
    
    if (gradientType === 'linear') {
      return `linear-gradient(${direction}, ${colorString})`;
    } else if (gradientType === 'radial') {
      return `radial-gradient(${radialShape} ${radialSize}, ${colorString})`;
    } else {
      return `conic-gradient(${colorString})`;
    }
  }, [gradientType, direction, radialShape, radialSize, colorStops]);

  const addColorStop = () => {
    const newPosition = colorStops.length > 0 ? 
      Math.round((colorStops[colorStops.length - 1].position + 100) / 2) : 50;
    
    const newStop: ColorStop = {
      id: Date.now().toString(),
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      position: Math.min(newPosition, 100)
    };
    
    setColorStops([...colorStops, newStop]);
  };

  const removeColorStop = (id: string) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter(stop => stop.id !== id));
    }
  };

  const updateColorStop = (id: string, field: keyof ColorStop, value: string | number) => {
    setColorStops(colorStops.map(stop => 
      stop.id === id ? { ...stop, [field]: value } : stop
    ));
  };

  const copyCSS = () => {
    const css = `background: ${generateCSS()};`;
    navigator.clipboard.writeText(css);
    toast({
      title: "Copied!",
      description: "CSS gradient copied to clipboard"
    });
  };

  const copyGradientOnly = () => {
    navigator.clipboard.writeText(generateCSS());
    toast({
      title: "Copied!",
      description: "Gradient value copied to clipboard"
    });
  };

  const saveToHistory = () => {
    const css = generateCSS();
    setHistory(prev => [css, ...prev.slice(0, 9)]);
    toast({
      title: "Saved!",
      description: "Gradient saved to history"
    });
  };

  const loadPreset = (preset: typeof presets[0]) => {
    const newStops = preset.stops.map((stop, index) => ({
      id: Date.now().toString() + index,
      color: stop.color,
      position: stop.position
    }));
    setColorStops(newStops);
  };

  const randomizeGradient = () => {
    const randomStops = Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, index) => ({
      id: Date.now().toString() + index,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      position: (index / (Math.floor(Math.random() * 3) + 1)) * 100
    }));
    
    setColorStops(randomStops);
    
    // Random gradient type and direction
    const types = ['linear', 'radial', 'conic'];
    const directions = ['to right', 'to left', 'to top', 'to bottom', 'to top right', 'to bottom left', '45deg', '90deg'];
    
    setGradientType(types[Math.floor(Math.random() * types.length)]);
    if (gradientType === 'linear') {
      setDirection(directions[Math.floor(Math.random() * directions.length)]);
    }
  };

  const exportGradient = (format: string) => {
    let content = '';
    const timestamp = new Date().toISOString().slice(0, 10);
    
    switch (format) {
      case 'css':
        content = `.gradient {\n  background: ${generateCSS()};\n}`;
        break;
      case 'scss':
        content = `$gradient: ${generateCSS()};\n\n.gradient {\n  background: $gradient;\n}`;
        break;
      case 'svg':
        const svgStops = colorStops.map((stop, index) => 
          `<stop offset="${stop.position}%" stop-color="${stop.color}"/>`
        ).join('\n    ');
        content = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      ${svgStops}
    </linearGradient>
  </defs>
  <rect width="100" height="100" fill="url(#grad1)"/>
</svg>`;
        break;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gradient-${timestamp}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentGradient = generateCSS();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced CSS Gradient Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create beautiful CSS gradients with live preview. Support for linear, radial, and conic gradients.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gradient Settings</CardTitle>
                  <CardDescription>Configure your gradient properties</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Gradient Type</Label>
                    <Select value={gradientType} onValueChange={setGradientType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="radial">Radial</SelectItem>
                        <SelectItem value="conic">Conic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {gradientType === 'linear' && (
                    <div className="space-y-2">
                      <Label>Direction</Label>
                      <Select value={direction} onValueChange={setDirection}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="to right">To Right</SelectItem>
                          <SelectItem value="to left">To Left</SelectItem>
                          <SelectItem value="to top">To Top</SelectItem>
                          <SelectItem value="to bottom">To Bottom</SelectItem>
                          <SelectItem value="to top right">To Top Right</SelectItem>
                          <SelectItem value="to top left">To Top Left</SelectItem>
                          <SelectItem value="to bottom right">To Bottom Right</SelectItem>
                          <SelectItem value="to bottom left">To Bottom Left</SelectItem>
                          <SelectItem value="45deg">45 degrees</SelectItem>
                          <SelectItem value="90deg">90 degrees</SelectItem>
                          <SelectItem value="135deg">135 degrees</SelectItem>
                          <SelectItem value="180deg">180 degrees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {gradientType === 'radial' && (
                    <>
                      <div className="space-y-2">
                        <Label>Shape</Label>
                        <Select value={radialShape} onValueChange={setRadialShape}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ellipse">Ellipse</SelectItem>
                            <SelectItem value="circle">Circle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Size</Label>
                        <Select value={radialSize} onValueChange={setRadialSize}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="closest-side">Closest Side</SelectItem>
                            <SelectItem value="closest-corner">Closest Corner</SelectItem>
                            <SelectItem value="farthest-side">Farthest Side</SelectItem>
                            <SelectItem value="farthest-corner">Farthest Corner</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  
                  <div className="flex gap-2">
                    <Button onClick={randomizeGradient} variant="outline" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Random
                    </Button>
                    <Button onClick={saveToHistory} variant="outline">
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Color Stops</CardTitle>
                  <CardDescription>Adjust colors and positions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {colorStops.map((stop, index) => (
                    <div key={stop.id} className="space-y-2 p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <Label>Color Stop {index + 1}</Label>
                        {colorStops.length > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeColorStop(stop.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={stop.color}
                          onChange={(e) => updateColorStop(stop.id, 'color', e.target.value)}
                          className="w-16 h-8 p-1"
                        />
                        <Input
                          value={stop.color}
                          onChange={(e) => updateColorStop(stop.id, 'color', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Position: {stop.position}%</Label>
                        <Slider
                          value={[stop.position]}
                          onValueChange={(value) => updateColorStop(stop.id, 'position', value[0])}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={addColorStop} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Color Stop
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Presets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {presets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        onClick={() => loadPreset(preset)}
                        className="h-auto p-2 flex flex-col"
                      >
                        <div
                          className="w-full h-6 rounded mb-1"
                          style={{
                            background: `linear-gradient(to right, ${preset.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`
                          }}
                        />
                        <span className="text-xs">{preset.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>Your gradient preview and CSS code</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div
                      className="w-full h-64 rounded-lg border"
                      style={{ background: currentGradient }}
                    />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>CSS Code</Label>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={copyGradientOnly}>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy Value
                          </Button>
                          <Button variant="outline" size="sm" onClick={copyCSS}>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy CSS
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-900 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                        background: {currentGradient};
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => exportGradient('css')}>
                        <Download className="h-4 w-4 mr-2" />
                        Export CSS
                      </Button>
                      <Button variant="outline" onClick={() => exportGradient('scss')}>
                        Export SCSS
                      </Button>
                      <Button variant="outline" onClick={() => exportGradient('svg')}>
                        Export SVG
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {history.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gradient History</CardTitle>
                    <CardDescription>Your saved gradients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {history.map((gradient, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 border rounded">
                          <div
                            className="w-16 h-8 rounded border flex-shrink-0"
                            style={{ background: gradient }}
                          />
                          <code className="flex-1 text-xs text-gray-600 truncate">
                            {gradient}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(gradient)}
                          >
                            <Copy className="h-3 w-3" />
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

export default GradientGenerator;
