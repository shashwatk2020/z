
import React, { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, RefreshCw, Download, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BorderRadiusGenerator = () => {
  const [uniformRadius, setUniformRadius] = useState(true);
  const [topLeft, setTopLeft] = useState(8);
  const [topRight, setTopRight] = useState(8);
  const [bottomRight, setBottomRight] = useState(8);
  const [bottomLeft, setBottomLeft] = useState(8);
  const [unit, setUnit] = useState('px');
  const [elementWidth, setElementWidth] = useState(300);
  const [elementHeight, setElementHeight] = useState(200);
  const [backgroundColor, setBackgroundColor] = useState('#3b82f6');
  const [previewBg, setPreviewBg] = useState('#f3f4f6');
  const [showGrid, setShowGrid] = useState(false);
  const [presets] = useState([
    { name: 'None', values: [0, 0, 0, 0] },
    { name: 'Slight', values: [4, 4, 4, 4] },
    { name: 'Rounded', values: [8, 8, 8, 8] },
    { name: 'Large', values: [16, 16, 16, 16] },
    { name: 'Pill', values: [9999, 9999, 9999, 9999] },
    { name: 'Top Only', values: [16, 16, 0, 0] },
    { name: 'Bottom Only', values: [0, 0, 16, 16] },
    { name: 'Left Only', values: [16, 0, 0, 16] },
    { name: 'Right Only', values: [0, 16, 16, 0] },
    { name: 'Asymmetric', values: [0, 16, 0, 16] },
    { name: 'Organic', values: [25, 8, 32, 12] },
    { name: 'Leaf', values: [50, 0, 50, 0] }
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const generateCSS = useCallback(() => {
    if (uniformRadius) {
      return topLeft === 0 ? '0' : `${topLeft}${unit}`;
    } else {
      const values = [topLeft, topRight, bottomRight, bottomLeft];
      if (values.every(v => v === 0)) return '0';
      if (values.every(v => v === values[0])) return `${values[0]}${unit}`;
      return `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`;
    }
  }, [uniformRadius, topLeft, topRight, bottomRight, bottomLeft, unit]);

  const updateUniformRadius = (value: number) => {
    setTopLeft(value);
    setTopRight(value);
    setBottomRight(value);
    setBottomLeft(value);
  };

  const loadPreset = (preset: typeof presets[0]) => {
    const [tl, tr, br, bl] = preset.values;
    setTopLeft(tl);
    setTopRight(tr);
    setBottomRight(br);
    setBottomLeft(bl);
    setUniformRadius(preset.values.every(v => v === preset.values[0]));
  };

  const copyCSS = () => {
    const css = `border-radius: ${generateCSS()};`;
    navigator.clipboard.writeText(css);
    toast({
      title: "Copied!",
      description: "CSS border-radius copied to clipboard"
    });
  };

  const copyValue = () => {
    navigator.clipboard.writeText(generateCSS());
    toast({
      title: "Copied!",
      description: "Border-radius value copied to clipboard"
    });
  };

  const saveToHistory = () => {
    const css = generateCSS();
    setHistory(prev => [css, ...prev.slice(0, 9)]);
    toast({
      title: "Saved!",
      description: "Border radius saved to history"
    });
  };

  const randomizeRadius = () => {
    const maxVal = unit === 'px' ? 50 : 50;
    setTopLeft(Math.floor(Math.random() * maxVal));
    setTopRight(Math.floor(Math.random() * maxVal));
    setBottomRight(Math.floor(Math.random() * maxVal));
    setBottomLeft(Math.floor(Math.random() * maxVal));
    setUniformRadius(false);
  };

  const resetRadius = () => {
    setTopLeft(0);
    setTopRight(0);
    setBottomRight(0);
    setBottomLeft(0);
    setUniformRadius(true);
  };

  const exportCSS = () => {
    const css = `.element {\n  border-radius: ${generateCSS()};\n}`;
    const blob = new Blob([css], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'border-radius.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const maxValue = unit === 'px' ? 200 : 100;
  const currentBorderRadius = generateCSS();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Border Radius Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create perfect rounded corners with visual controls. Preview and generate CSS border-radius properties.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Radius Controls</CardTitle>
                  <CardDescription>Adjust border radius values</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label>Uniform Radius</Label>
                    <Switch
                      checked={uniformRadius}
                      onCheckedChange={setUniformRadius}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="px">Pixels (px)</SelectItem>
                        <SelectItem value="%">Percentage (%)</SelectItem>
                        <SelectItem value="rem">Rem</SelectItem>
                        <SelectItem value="em">Em</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {uniformRadius ? (
                    <div className="space-y-2">
                      <Label>Radius: {topLeft}{unit}</Label>
                      <Slider
                        value={[topLeft]}
                        onValueChange={(value) => updateUniformRadius(value[0])}
                        max={maxValue}
                        step={1}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Top Left: {topLeft}{unit}</Label>
                          <Slider
                            value={[topLeft]}
                            onValueChange={(value) => setTopLeft(value[0])}
                            max={maxValue}
                            step={1}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Top Right: {topRight}{unit}</Label>
                          <Slider
                            value={[topRight]}
                            onValueChange={(value) => setTopRight(value[0])}
                            max={maxValue}
                            step={1}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Bottom Left: {bottomLeft}{unit}</Label>
                          <Slider
                            value={[bottomLeft]}
                            onValueChange={(value) => setBottomLeft(value[0])}
                            max={maxValue}
                            step={1}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Bottom Right: {bottomRight}{unit}</Label>
                          <Slider
                            value={[bottomRight]}
                            onValueChange={(value) => setBottomRight(value[0])}
                            max={maxValue}
                            step={1}
                          />
                        </div>
                      </div>
                      
                      {/* Visual Corner Diagram */}
                      <div className="relative bg-gray-100 p-4 rounded-lg">
                        <div className="absolute top-2 left-2 text-xs text-gray-500">TL: {topLeft}</div>
                        <div className="absolute top-2 right-2 text-xs text-gray-500">TR: {topRight}</div>
                        <div className="absolute bottom-2 left-2 text-xs text-gray-500">BL: {bottomLeft}</div>
                        <div className="absolute bottom-2 right-2 text-xs text-gray-500">BR: {bottomRight}</div>
                        <div 
                          className="w-16 h-16 bg-blue-500 mx-auto"
                          style={{ borderRadius: currentBorderRadius }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button onClick={randomizeRadius} variant="outline" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Random
                    </Button>
                    <Button onClick={resetRadius} variant="outline">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button onClick={saveToHistory} variant="outline">
                      Save
                    </Button>
                  </div>
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
                        className="h-auto p-3 flex flex-col"
                      >
                        <div
                          className="w-8 h-6 bg-blue-500 mb-2"
                          style={{
                            borderRadius: preset.values.every(v => v === preset.values[0]) 
                              ? `${preset.values[0]}px` 
                              : `${preset.values[0]}px ${preset.values[1]}px ${preset.values[2]}px ${preset.values[3]}px`
                          }}
                        />
                        <span className="text-xs">{preset.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Preview Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Element Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={previewBg}
                        onChange={(e) => setPreviewBg(e.target.value)}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        value={previewBg}
                        onChange={(e) => setPreviewBg(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Width: {elementWidth}px</Label>
                    <Slider
                      value={[elementWidth]}
                      onValueChange={(value) => setElementWidth(value[0])}
                      min={100}
                      max={500}
                      step={10}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Height: {elementHeight}px</Label>
                    <Slider
                      value={[elementHeight]}
                      onValueChange={(value) => setElementHeight(value[0])}
                      min={100}
                      max={400}
                      step={10}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Show Grid</Label>
                    <Switch
                      checked={showGrid}
                      onCheckedChange={setShowGrid}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>Your border radius preview and CSS code</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div 
                      className="w-full h-96 flex items-center justify-center relative"
                      style={{ 
                        backgroundColor: previewBg,
                        backgroundImage: showGrid ? 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)' : 'none',
                        backgroundSize: showGrid ? '20px 20px' : 'auto'
                      }}
                    >
                      <div
                        style={{
                          width: `${elementWidth}px`,
                          height: `${elementHeight}px`,
                          backgroundColor: backgroundColor,
                          borderRadius: currentBorderRadius,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      
                      {/* Corner labels for individual mode */}
                      {!uniformRadius && (
                        <>
                          <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded text-xs font-mono shadow">
                            TL: {topLeft}{unit}
                          </div>
                          <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded text-xs font-mono shadow">
                            TR: {topRight}{unit}
                          </div>
                          <div className="absolute bottom-4 left-4 bg-white px-2 py-1 rounded text-xs font-mono shadow">
                            BL: {bottomLeft}{unit}
                          </div>
                          <div className="absolute bottom-4 right-4 bg-white px-2 py-1 rounded text-xs font-mono shadow">
                            BR: {bottomRight}{unit}
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>CSS Code</Label>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={copyValue}>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy Value
                          </Button>
                          <Button variant="outline" size="sm" onClick={copyCSS}>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy CSS
                          </Button>
                          <Button variant="outline" size="sm" onClick={exportCSS}>
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-900 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                        border-radius: {currentBorderRadius};
                      </div>
                      
                      {/* Additional CSS variants */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-2 bg-gray-100 rounded font-mono">
                          <div className="text-gray-600 mb-1">Webkit prefix:</div>
                          -webkit-border-radius: {currentBorderRadius};
                        </div>
                        <div className="p-2 bg-gray-100 rounded font-mono">
                          <div className="text-gray-600 mb-1">Moz prefix:</div>
                          -moz-border-radius: {currentBorderRadius};
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {history.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Border Radius History</CardTitle>
                    <CardDescription>Your saved border radius values</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {history.map((radius, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 border rounded">
                          <div
                            className="w-12 h-8 bg-blue-500 flex-shrink-0"
                            style={{ borderRadius: radius }}
                          />
                          <code className="flex-1 text-xs text-gray-600 truncate">
                            {radius}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(radius)}
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

export default BorderRadiusGenerator;
