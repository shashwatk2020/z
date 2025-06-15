
import React, { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, Download, Plus, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Shadow {
  id: string;
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadRadius: number;
  color: string;
  inset: boolean;
  opacity: number;
}

const BoxShadowGenerator = () => {
  const [shadows, setShadows] = useState<Shadow[]>([
    {
      id: '1',
      offsetX: 0,
      offsetY: 4,
      blurRadius: 6,
      spreadRadius: 0,
      color: '#000000',
      inset: false,
      opacity: 25
    }
  ]);
  const [previewBg, setPreviewBg] = useState('#f3f4f6');
  const [elementBg, setElementBg] = useState('#ffffff');
  const [elementSize, setElementSize] = useState(200);
  const [borderRadius, setBorderRadius] = useState(8);
  const [presets] = useState([
    { name: 'Soft', shadow: { offsetX: 0, offsetY: 1, blurRadius: 3, spreadRadius: 0, color: '#000000', opacity: 12 } },
    { name: 'Medium', shadow: { offsetX: 0, offsetY: 4, blurRadius: 6, spreadRadius: -1, color: '#000000', opacity: 10 } },
    { name: 'Large', shadow: { offsetX: 0, offsetY: 10, blurRadius: 15, spreadRadius: -3, color: '#000000', opacity: 10 } },
    { name: 'Extra Large', shadow: { offsetX: 0, offsetY: 25, blurRadius: 25, spreadRadius: -5, color: '#000000', opacity: 25 } },
    { name: 'Inner', shadow: { offsetX: 0, offsetY: 2, blurRadius: 4, spreadRadius: 0, color: '#000000', opacity: 6, inset: true } },
    { name: 'Colored', shadow: { offsetX: 0, offsetY: 4, blurRadius: 14, spreadRadius: 0, color: '#3b82f6', opacity: 25 } }
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const generateCSS = useCallback(() => {
    if (shadows.length === 0) return 'none';
    
    return shadows.map(shadow => {
      const { offsetX, offsetY, blurRadius, spreadRadius, color, inset, opacity } = shadow;
      const colorWithOpacity = hexToRgba(color, opacity);
      const insetKeyword = inset ? 'inset ' : '';
      return `${insetKeyword}${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${colorWithOpacity}`;
    }).join(', ');
  }, [shadows]);

  const addShadow = () => {
    const newShadow: Shadow = {
      id: Date.now().toString(),
      offsetX: 0,
      offsetY: 4,
      blurRadius: 6,
      spreadRadius: 0,
      color: '#000000',
      inset: false,
      opacity: 25
    };
    setShadows([...shadows, newShadow]);
  };

  const removeShadow = (id: string) => {
    setShadows(shadows.filter(shadow => shadow.id !== id));
  };

  const updateShadow = (id: string, field: keyof Shadow, value: any) => {
    setShadows(shadows.map(shadow => 
      shadow.id === id ? { ...shadow, [field]: value } : shadow
    ));
  };

  const copyCSS = () => {
    const css = `box-shadow: ${generateCSS()};`;
    navigator.clipboard.writeText(css);
    toast({
      title: "Copied!",
      description: "CSS box-shadow copied to clipboard"
    });
  };

  const copyValue = () => {
    navigator.clipboard.writeText(generateCSS());
    toast({
      title: "Copied!",
      description: "Box-shadow value copied to clipboard"
    });
  };

  const saveToHistory = () => {
    const css = generateCSS();
    setHistory(prev => [css, ...prev.slice(0, 9)]);
    toast({
      title: "Saved!",
      description: "Shadow saved to history"
    });
  };

  const loadPreset = (preset: typeof presets[0]) => {
    const newShadow: Shadow = {
      id: Date.now().toString(),
      offsetX: preset.shadow.offsetX,
      offsetY: preset.shadow.offsetY,
      blurRadius: preset.shadow.blurRadius,
      spreadRadius: preset.shadow.spreadRadius,
      color: preset.shadow.color,
      inset: preset.shadow.inset || false,
      opacity: preset.shadow.opacity
    };
    setShadows([newShadow]);
  };

  const randomizeShadow = () => {
    const randomShadow: Shadow = {
      id: Date.now().toString(),
      offsetX: Math.floor(Math.random() * 21) - 10,
      offsetY: Math.floor(Math.random() * 21) - 10,
      blurRadius: Math.floor(Math.random() * 20),
      spreadRadius: Math.floor(Math.random() * 11) - 5,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      inset: Math.random() > 0.5,
      opacity: Math.floor(Math.random() * 50) + 10
    };
    setShadows([randomShadow]);
  };

  const exportCSS = () => {
    const css = `.element {\n  box-shadow: ${generateCSS()};\n}`;
    const blob = new Blob([css], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'box-shadow.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentBoxShadow = generateCSS();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Box Shadow Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create beautiful CSS box shadows with live preview. Support for multiple shadows and inset effects.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shadow Layers</CardTitle>
                  <CardDescription>Add and configure multiple shadow layers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {shadows.map((shadow, index) => (
                    <div key={shadow.id} className="space-y-3 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <Label>Shadow {index + 1}</Label>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={shadow.inset}
                            onCheckedChange={(checked) => updateShadow(shadow.id, 'inset', checked)}
                          />
                          <Label className="text-xs">Inset</Label>
                          {shadows.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeShadow(shadow.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Offset X: {shadow.offsetX}px</Label>
                          <Slider
                            value={[shadow.offsetX]}
                            onValueChange={(value) => updateShadow(shadow.id, 'offsetX', value[0])}
                            min={-50}
                            max={50}
                            step={1}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Offset Y: {shadow.offsetY}px</Label>
                          <Slider
                            value={[shadow.offsetY]}
                            onValueChange={(value) => updateShadow(shadow.id, 'offsetY', value[0])}
                            min={-50}
                            max={50}
                            step={1}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Blur: {shadow.blurRadius}px</Label>
                          <Slider
                            value={[shadow.blurRadius]}
                            onValueChange={(value) => updateShadow(shadow.id, 'blurRadius', value[0])}
                            min={0}
                            max={100}
                            step={1}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Spread: {shadow.spreadRadius}px</Label>
                          <Slider
                            value={[shadow.spreadRadius]}
                            onValueChange={(value) => updateShadow(shadow.id, 'spreadRadius', value[0])}
                            min={-50}
                            max={50}
                            step={1}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs">Color & Opacity</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={shadow.color}
                            onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                            className="w-12 h-8 p-1"
                          />
                          <Input
                            value={shadow.color}
                            onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Opacity: {shadow.opacity}%</Label>
                          <Slider
                            value={[shadow.opacity]}
                            onValueChange={(value) => updateShadow(shadow.id, 'opacity', value[0])}
                            min={0}
                            max={100}
                            step={1}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={addShadow} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Shadow Layer
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button onClick={randomizeShadow} variant="outline" className="flex-1">
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
                          className="w-8 h-8 bg-white rounded mb-2"
                          style={{
                            boxShadow: `${preset.shadow.inset ? 'inset ' : ''}${preset.shadow.offsetX}px ${preset.shadow.offsetY}px ${preset.shadow.blurRadius}px ${preset.shadow.spreadRadius}px ${hexToRgba(preset.shadow.color, preset.shadow.opacity)}`
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
                    <Label>Element Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={elementBg}
                        onChange={(e) => setElementBg(e.target.value)}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        value={elementBg}
                        onChange={(e) => setElementBg(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Element Size: {elementSize}px</Label>
                    <Slider
                      value={[elementSize]}
                      onValueChange={(value) => setElementSize(value[0])}
                      min={100}
                      max={400}
                      step={10}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Border Radius: {borderRadius}px</Label>
                    <Slider
                      value={[borderRadius]}
                      onValueChange={(value) => setBorderRadius(value[0])}
                      min={0}
                      max={50}
                      step={1}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>Your box shadow preview and CSS code</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div 
                      className="w-full h-96 flex items-center justify-center"
                      style={{ backgroundColor: previewBg }}
                    >
                      <div
                        style={{
                          width: `${elementSize}px`,
                          height: `${elementSize}px`,
                          backgroundColor: elementBg,
                          borderRadius: `${borderRadius}px`,
                          boxShadow: currentBoxShadow
                        }}
                      />
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
                        box-shadow: {currentBoxShadow};
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {history.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shadow History</CardTitle>
                    <CardDescription>Your saved box shadows</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {history.map((boxShadow, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 border rounded">
                          <div
                            className="w-12 h-8 bg-white rounded border flex-shrink-0"
                            style={{ boxShadow }}
                          />
                          <code className="flex-1 text-xs text-gray-600 truncate">
                            {boxShadow}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(boxShadow)}
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

export default BoxShadowGenerator;
