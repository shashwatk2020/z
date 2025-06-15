
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Download, Palette, RotateCw, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GradientImageGenerator = () => {
  const [width, setWidth] = useState([800]);
  const [height, setHeight] = useState([600]);
  const [gradientType, setGradientType] = useState('linear');
  const [angle, setAngle] = useState([45]);
  const [colors, setColors] = useState(['#ff6b6b', '#4ecdc4']);
  const [positions, setPositions] = useState([0, 100]);
  const [centerX, setCenterX] = useState([50]);
  const [centerY, setCenterY] = useState([50]);
  const [shape, setShape] = useState('ellipse');
  const [animated, setAnimated] = useState(false);
  const [generatedGradient, setGeneratedGradient] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const { toast } = useToast();

  const gradientTypes = [
    { value: 'linear', label: 'Linear Gradient' },
    { value: 'radial', label: 'Radial Gradient' },
    { value: 'conic', label: 'Conic Gradient' }
  ];

  const shapes = [
    { value: 'ellipse', label: 'Ellipse' },
    { value: 'circle', label: 'Circle' }
  ];

  const presetGradients = [
    { name: 'Sunset', colors: ['#ff9a9e', '#fecfef', '#fecfef'] },
    { name: 'Ocean', colors: ['#667eea', '#764ba2'] },
    { name: 'Forest', colors: ['#134e5e', '#71b280'] },
    { name: 'Fire', colors: ['#ff512f', '#dd2476'] },
    { name: 'Purple Rain', colors: ['#667eea', '#764ba2', '#f093fb'] },
    { name: 'Mint', colors: ['#00b09b', '#96c93d'] }
  ];

  const addColor = () => {
    if (colors.length < 5) {
      setColors([...colors, '#ffffff']);
      setPositions([...positions, 50]);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
      setPositions(positions.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const updatePosition = (index: number, position: number) => {
    const newPositions = [...positions];
    newPositions[index] = position;
    setPositions(newPositions);
  };

  const applyPreset = (preset: typeof presetGradients[0]) => {
    setColors(preset.colors);
    setPositions(preset.colors.map((_, i) => (i / (preset.colors.length - 1)) * 100));
  };

  const generateGradient = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = width[0];
    canvas.height = height[0];

    drawGradient(ctx, 0);

    const dataURL = canvas.toDataURL('image/png');
    setGeneratedGradient(dataURL);

    if (animated) {
      startAnimation();
    }

    toast({
      title: "Gradient Generated",
      description: `Created ${width[0]}×${height[0]} gradient image.`
    });
  };

  const drawGradient = (ctx: CanvasRenderingContext2D, animationOffset = 0) => {
    let gradient: CanvasGradient;

    switch (gradientType) {
      case 'linear':
        const angleRad = ((angle[0] + animationOffset) * Math.PI) / 180;
        const x1 = Math.cos(angleRad) * width[0];
        const y1 = Math.sin(angleRad) * height[0];
        gradient = ctx.createLinearGradient(0, 0, x1, y1);
        break;
      
      case 'radial':
        const maxRadius = Math.max(width[0], height[0]) / 2;
        gradient = ctx.createRadialGradient(
          (width[0] * centerX[0]) / 100, (height[0] * centerY[0]) / 100, 0,
          (width[0] * centerX[0]) / 100, (height[0] * centerY[0]) / 100, maxRadius
        );
        break;
      
      case 'conic':
        // Simulate conic gradient with multiple linear gradients
        const segments = 360;
        for (let i = 0; i < segments; i++) {
          const segmentAngle = (i / segments) * 2 * Math.PI + (animationOffset * Math.PI) / 180;
          const colorIndex = (i / segments) * (colors.length - 1);
          const color1Index = Math.floor(colorIndex);
          const color2Index = Math.ceil(colorIndex) % colors.length;
          const t = colorIndex - color1Index;
          
          const color = interpolateColor(colors[color1Index], colors[color2Index], t);
          
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(width[0] / 2, height[0] / 2);
          ctx.arc(width[0] / 2, height[0] / 2, Math.max(width[0], height[0]), 
                  segmentAngle, segmentAngle + (2 * Math.PI) / segments);
          ctx.closePath();
          ctx.fill();
        }
        return;
      
      default:
        gradient = ctx.createLinearGradient(0, 0, width[0], 0);
    }

    // Add color stops
    colors.forEach((color, index) => {
      gradient.addColorStop(positions[index] / 100, color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width[0], height[0]);
  };

  const interpolateColor = (color1: string, color2: string, t: number) => {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const startAnimation = () => {
    let animationOffset = 0;
    const animate = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      
      drawGradient(ctx, animationOffset);
      animationOffset += 2;
      
      if (animated) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animate();
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const downloadGradient = () => {
    if (generatedGradient) {
      const a = document.createElement('a');
      a.href = generatedGradient;
      a.download = `gradient-${width[0]}x${height[0]}.png`;
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
            Gradient Image Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create beautiful gradient images with linear, radial, and conic patterns, custom colors, and animation effects.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dimensions & Type</CardTitle>
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
                      step={50}
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
                      step={50}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Gradient Type</Label>
                  <Select value={gradientType} onValueChange={setGradientType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gradientTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {gradientType === 'linear' && (
                  <div className="space-y-3">
                    <Label>Angle: {angle[0]}°</Label>
                    <Slider
                      value={angle}
                      onValueChange={setAngle}
                      min={0}
                      max={360}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}

                {gradientType === 'radial' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label>Center X: {centerX[0]}%</Label>
                      <Slider
                        value={centerX}
                        onValueChange={setCenterX}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Center Y: {centerY[0]}%</Label>
                      <Slider
                        value={centerY}
                        onValueChange={setCenterY}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Colors & Stops</span>
                  <Button size="sm" onClick={addColor} disabled={colors.length >= 5}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Input
                      type="color"
                      value={color}
                      onChange={(e) => updateColor(index, e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={color}
                      onChange={(e) => updateColor(index, e.target.value)}
                      className="flex-1"
                    />
                    <div className="w-20">
                      <Input
                        type="number"
                        value={positions[index]}
                        onChange={(e) => updatePosition(index, parseInt(e.target.value) || 0)}
                        min={0}
                        max={100}
                        className="text-sm"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeColor(index)}
                      disabled={colors.length <= 2}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <Label className="mb-3 block">Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {presetGradients.map((preset, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset(preset)}
                        className="text-xs"
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="animated"
                    checked={animated}
                    onCheckedChange={(checked) => {
                      setAnimated(checked);
                      if (!checked) stopAnimation();
                    }}
                  />
                  <Label htmlFor="animated">Animated gradient (rotation)</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={generateGradient} className="w-full">
                    <Palette className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                  
                  <Button 
                    onClick={downloadGradient}
                    disabled={!generatedGradient}
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
              <CardTitle>Gradient Preview</CardTitle>
              <CardDescription>Live preview of your gradient</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[500px] flex items-center justify-center">
                {generatedGradient ? (
                  <div className="text-center">
                    <canvas 
                      ref={canvasRef}
                      className="max-w-full max-h-[450px] object-contain rounded shadow-lg"
                    />
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Size: {width[0]} × {height[0]} pixels</p>
                      <p>Type: {gradientTypes.find(t => t.value === gradientType)?.label}</p>
                      <p>Colors: {colors.length} stops</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Palette className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Configure your gradient and click "Generate"</p>
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

export default GradientImageGenerator;
