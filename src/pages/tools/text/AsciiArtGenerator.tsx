
import React, { useState, useRef, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Upload, Copy, Palette, Wand2 } from 'lucide-react';

const ASCII_SETS = {
  simple: ' .:-=+*#%@",',
  detailed: '`.-_:\',;^/i!lI~+?][}{1)(|\\tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  blocks: ' █▓▒░',
};

const AsciiArtGenerator = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [asciiArt, setAsciiArt] = useState('');
  const [width, setWidth] = useState(100);
  const [charset, setCharset] = useState('detailed');
  const [isInverted, setIsInverted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const generateAscii = useCallback(() => {
    if (!imageFile) {
      toast({ title: "No image selected", description: "Please upload an image file.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          setIsLoading(false);
          return;
        }
        const context = canvas.getContext('2d');
        if (!context) {
          setIsLoading(false);
          return;
        }

        const aspectRatio = img.height / img.width;
        // Correct for character aspect ratio (usually taller than wide)
        const newHeight = Math.floor(aspectRatio * width * 0.55);

        canvas.width = width;
        canvas.height = newHeight;
        context.drawImage(img, 0, 0, width, newHeight);

        const imageData = context.getImageData(0, 0, width, newHeight);
        const data = imageData.data;
        let ascii = '';
        const charSet = ASCII_SETS[charset as keyof typeof ASCII_SETS];
        const charSetLength = charSet.length - 1;

        for (let y = 0; y < newHeight; y++) {
          for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Luminance formula
            const brightness = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            let charIndex = Math.floor(brightness * charSetLength);
            if (isInverted) {
              charIndex = charSetLength - charIndex;
            }
            ascii += charSet[charIndex];
          }
          ascii += '\n';
        }
        setAsciiArt(ascii);
        setIsLoading(false);
        toast({ title: "Success", description: "ASCII art generated!" });
      };
      img.onerror = () => {
        setIsLoading(false);
        toast({ title: "Error", description: "Could not load image.", variant: "destructive" });
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
        setIsLoading(false);
        toast({ title: "Error", description: "Could not read file.", variant: "destructive" });
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile, width, charset, isInverted, toast]);

  const copyToClipboard = () => {
    if (!asciiArt) return;
    navigator.clipboard.writeText(asciiArt);
    toast({ title: "Copied!", description: "ASCII art copied to clipboard." });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Advanced ASCII Art Generator</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Convert your images to text-based art with customizable settings.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5 text-blue-500" /> Upload & Customize</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="image-upload">Upload Image</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="mt-2 file:text-primary file:font-medium"
                  onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                />
              </div>
              <div>
                <Label htmlFor="width">Output Width (characters)</Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Math.max(10, Math.min(500, parseInt(e.target.value, 10) || 10)))}
                  className="mt-2"
                  min="10"
                  max="500"
                />
              </div>
              <div>
                <Label>Character Set</Label>
                <Select value={charset} onValueChange={setCharset}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="blocks">Blocks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="invert"
                  checked={isInverted}
                  onCheckedChange={(checked) => setIsInverted(Boolean(checked))}
                />
                <Label htmlFor="invert" className="font-normal cursor-pointer">
                  Invert Brightness
                </Label>
              </div>
              <Button onClick={generateAscii} disabled={!imageFile || isLoading} className="w-full" size="lg">
                {isLoading ? (
                  <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Generate Art
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-green-500" />
                  Generated Art
                </div>
                {asciiArt && (
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {asciiArt ? (
                <pre className="text-[5px] leading-tight font-mono p-4 bg-gray-900 text-white rounded-md overflow-auto max-h-[500px]">
                  {asciiArt}
                </pre>
              ) : (
                <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center h-full">
                  <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Your ASCII art will appear here.</p>
                  <p className="text-sm mt-2">Upload an image and click generate.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </Layout>
  );
};

export default AsciiArtGenerator;
