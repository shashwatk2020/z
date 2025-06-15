
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Download, Zap, Shuffle, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NoisePatternGenerator = () => {
  const [width, setWidth] = useState([800]);
  const [height, setHeight] = useState([600]);
  const [noiseType, setNoiseType] = useState('white');
  const [intensity, setIntensity] = useState([50]);
  const [frequency, setFrequency] = useState([10]);
  const [octaves, setOctaves] = useState([4]);
  const [persistence, setPersistence] = useState([50]);
  const [lacunarity, setLacunarity] = useState([200]);
  const [baseColor, setBaseColor] = useState('#808080');
  const [noiseColor, setNoiseColor] = useState('#ffffff');
  const [seamless, setSeamless] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [seed, setSeed] = useState(12345);
  const [generatedPattern, setGeneratedPattern] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const { toast } = useToast();

  const noiseTypes = [
    { value: 'white', label: 'White Noise', description: 'Random pixel values' },
    { value: 'perlin', label: 'Perlin Noise', description: 'Smooth, natural-looking noise' },
    { value: 'simplex', label: 'Simplex Noise', description: 'Improved Perlin noise' },
    { value: 'worley', label: 'Worley Noise', description: 'Cellular/Voronoi patterns' },
    { value: 'fbm', label: 'Fractal Brownian Motion', description: 'Layered noise' },
    { value: 'ridged', label: 'Ridged Noise', description: 'Sharp ridges and valleys' },
    { value: 'billow', label: 'Billow Noise', description: 'Cloud-like patterns' }
  ];

  // Simple noise generation functions
  const generateWhiteNoise = (x: number, y: number, time = 0) => {
    const hash = ((x * 374761393) + (y * 668265263) + (time * 12345)) % 2147483647;
    return (hash / 2147483647) * 2 - 1;
  };

  const generatePerlinNoise = (x: number, y: number, time = 0) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const T = Math.floor(time) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    time -= Math.floor(time);
    
    const u = fade(x);
    const v = fade(y);
    const w = fade(time);
    
    const A = (X + Y + T) % 256;
    const B = (X + Y + T + 1) % 256;
    
    return lerp(w, 
      lerp(v, 
        lerp(u, grad(A, x, y, time), grad(B, x-1, y, time)),
        lerp(u, grad(A+1, x, y-1, time), grad(B+1, x-1, y-1, time))),
      lerp(v,
        lerp(u, grad(A+256, x, y, time-1), grad(B+256, x-1, y, time-1)),
        lerp(u, grad(A+257, x, y-1, time-1), grad(B+257, x-1, y-1, time-1)))
    );
  };

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t: number, a: number, b: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  const generateWorleyNoise = (x: number, y: number, time = 0) => {
    const cellSize = 50;
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    
    let minDist = Infinity;
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const neighborX = cellX + dx;
        const neighborY = cellY + dy;
        
        const hash = ((neighborX * 374761393) + (neighborY * 668265263) + (time * 12345)) % 2147483647;
        const pointX = neighborX * cellSize + (hash % cellSize);
        const pointY = neighborY * cellSize + ((hash * 7) % cellSize);
        
        const dist = Math.sqrt((x - pointX) ** 2 + (y - pointY) ** 2);
        minDist = Math.min(minDist, dist);
      }
    }
    
    return Math.max(0, 1 - minDist / cellSize);
  };

  const generateFBM = (x: number, y: number, time = 0) => {
    let value = 0;
    let amplitude = 1;
    let freq = frequency[0] / 1000;
    
    for (let i = 0; i < octaves[0]; i++) {
      value += generatePerlinNoise(x * freq, y * freq, time * freq) * amplitude;
      freq *= lacunarity[0] / 100;
      amplitude *= persistence[0] / 100;
    }
    
    return value;
  };

  const generatePattern = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = width[0];
    canvas.height = height[0];

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    const baseR = parseInt(baseColor.slice(1, 3), 16);
    const baseG = parseInt(baseColor.slice(3, 5), 16);
    const baseB = parseInt(baseColor.slice(5, 7), 16);
    
    const noiseR = parseInt(noiseColor.slice(1, 3), 16);
    const noiseG = parseInt(noiseColor.slice(3, 5), 16);
    const noiseB = parseInt(noiseColor.slice(5, 7), 16);

    drawNoise(data, canvas.width, canvas.height, 0, baseR, baseG, baseB, noiseR, noiseG, noiseB);

    ctx.putImageData(imageData, 0, 0);

    const dataURL = canvas.toDataURL('image/png');
    setGeneratedPattern(dataURL);

    if (animated) {
      startAnimation();
    }

    toast({
      title: "Pattern Generated",
      description: `Created ${width[0]}×${height[0]} noise pattern.`
    });
  };

  const drawNoise = (data: Uint8ClampedArray, w: number, h: number, time: number, 
                    baseR: number, baseG: number, baseB: number,
                    noiseR: number, noiseG: number, noiseB: number) => {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let noiseValue = 0;
        
        switch (noiseType) {
          case 'white':
            noiseValue = generateWhiteNoise(x + seed, y + seed, time);
            break;
          case 'perlin':
            noiseValue = generatePerlinNoise((x + seed) * frequency[0] / 1000, (y + seed) * frequency[0] / 1000, time);
            break;
          case 'simplex':
            noiseValue = generatePerlinNoise((x + seed) * frequency[0] / 1000, (y + seed) * frequency[0] / 1000, time) * 0.8;
            break;
          case 'worley':
            noiseValue = generateWorleyNoise(x + seed, y + seed, time) * 2 - 1;
            break;
          case 'fbm':
            noiseValue = generateFBM(x + seed, y + seed, time);
            break;
          case 'ridged':
            noiseValue = 1 - Math.abs(generateFBM(x + seed, y + seed, time));
            break;
          case 'billow':
            noiseValue = Math.abs(generateFBM(x + seed, y + seed, time));
            break;
        }

        // Apply intensity
        noiseValue *= intensity[0] / 100;
        
        // Normalize to 0-1
        noiseValue = (noiseValue + 1) / 2;
        
        // Blend colors
        const t = noiseValue;
        const r = Math.round(baseR + (noiseR - baseR) * t);
        const g = Math.round(baseG + (noiseG - baseG) * t);
        const b = Math.round(baseB + (noiseB - baseB) * t);
        
        const index = (y * w + x) * 4;
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255;
      }
    }
  };

  const startAnimation = () => {
    let time = 0;
    const animate = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      const baseR = parseInt(baseColor.slice(1, 3), 16);
      const baseG = parseInt(baseColor.slice(3, 5), 16);
      const baseB = parseInt(baseColor.slice(5, 7), 16);
      
      const noiseR = parseInt(noiseColor.slice(1, 3), 16);
      const noiseG = parseInt(noiseColor.slice(3, 5), 16);
      const noiseB = parseInt(noiseColor.slice(5, 7), 16);

      drawNoise(data, canvas.width, canvas.height, time * 0.01, baseR, baseG, baseB, noiseR, noiseG, noiseB);
      
      ctx.putImageData(imageData, 0, 0);
      time++;
      
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

  const randomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 999999));
  };

  const downloadPattern = () => {
    if (generatedPattern) {
      const a = document.createElement('a');
      a.href = generatedPattern;
      a.download = `noise-pattern-${width[0]}x${height[0]}.png`;
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
            Noise Pattern Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Generate various types of noise patterns including Perlin, Simplex, Worley, and more for textures and backgrounds.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pattern Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label>Width: {width[0]}px</Label>
                    <Slider
                      value={width}
                      onValueChange={setWidth}
                      min={100}
                      max={1500}
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
                      max={1500}
                      step={50}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Noise Type</Label>
                  <Select value={noiseType} onValueChange={setNoiseType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {noiseTypes.map(type => (
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

                <div className="space-y-3">
                  <Label>Intensity: {intensity[0]}%</Label>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    min={10}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Frequency: {frequency[0]}</Label>
                  <Slider
                    value={frequency}
                    onValueChange={setFrequency}
                    min={1}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {['perlin', 'simplex', 'fbm', 'ridged', 'billow'].includes(noiseType) && (
                  <>
                    <div className="space-y-3">
                      <Label>Octaves: {octaves[0]}</Label>
                      <Slider
                        value={octaves}
                        onValueChange={setOctaves}
                        min={1}
                        max={8}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Persistence: {persistence[0]}%</Label>
                      <Slider
                        value={persistence}
                        onValueChange={setPersistence}
                        min={10}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Lacunarity: {lacunarity[0]}%</Label>
                      <Slider
                        value={lacunarity}
                        onValueChange={setLacunarity}
                        min={100}
                        max={400}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Colors & Effects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label>Base Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={baseColor}
                        onChange={(e) => setBaseColor(e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={baseColor}
                        onChange={(e) => setBaseColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Noise Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={noiseColor}
                        onChange={(e) => setNoiseColor(e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={noiseColor}
                        onChange={(e) => setNoiseColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Seed Value</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={seed}
                      onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={randomizeSeed}>
                      <Shuffle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="seamless"
                      checked={seamless}
                      onCheckedChange={setSeamless}
                    />
                    <Label htmlFor="seamless">Seamless tiling</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="animated"
                      checked={animated}
                      onCheckedChange={(checked) => {
                        setAnimated(checked);
                        if (!checked) stopAnimation();
                      }}
                    />
                    <Label htmlFor="animated">Animated pattern</Label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={generatePattern} className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                  
                  <Button 
                    onClick={downloadPattern}
                    disabled={!generatedPattern}
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
              <CardTitle>Pattern Preview</CardTitle>
              <CardDescription>Generated noise pattern</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[500px] flex items-center justify-center">
                {generatedPattern ? (
                  <div className="text-center">
                    <canvas 
                      ref={canvasRef}
                      className="max-w-full max-h-[450px] object-contain rounded shadow-lg"
                    />
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Size: {width[0]} × {height[0]} pixels</p>
                      <p>Type: {noiseTypes.find(t => t.value === noiseType)?.label}</p>
                      <p>Seed: {seed}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
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

export default NoisePatternGenerator;
