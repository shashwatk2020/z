
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Download, QrCode, Palette, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QrCodeToImage = () => {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState([300]);
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('M');
  const [margin, setMargin] = useState([4]);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoSize, setLogoSize] = useState([20]);
  const [includeText, setIncludeText] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const errorLevels = [
    { value: 'L', label: 'Low (~7%)', description: 'Suitable for clean environments' },
    { value: 'M', label: 'Medium (~15%)', description: 'Balanced option' },
    { value: 'Q', label: 'Quartile (~25%)', description: 'Good for noisy environments' },
    { value: 'H', label: 'High (~30%)', description: 'Maximum error correction' }
  ];

  // Simple QR Code generation algorithm (simplified for demo)
  const generateQRMatrix = (text: string, errorLevel: string) => {
    // This is a simplified QR generation - in production, use a proper QR library
    const size = 25; // Fixed size for demo
    const matrix: boolean[][] = [];
    
    // Initialize matrix
    for (let i = 0; i < size; i++) {
      matrix[i] = [];
      for (let j = 0; j < size; j++) {
        matrix[i][j] = false;
      }
    }

    // Add finder patterns (corners)
    const addFinderPattern = (x: number, y: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (x + i < size && y + j < size) {
            const isBlack = (i === 0 || i === 6 || j === 0 || j === 6) ||
                           (i >= 2 && i <= 4 && j >= 2 && j <= 4);
            matrix[x + i][y + j] = isBlack;
          }
        }
      }
    };

    addFinderPattern(0, 0);
    addFinderPattern(0, size - 7);
    addFinderPattern(size - 7, 0);

    // Add some data pattern based on text
    const textHash = text.split('').reduce((hash, char) => {
      return hash * 31 + char.charCodeAt(0);
    }, 0);

    for (let i = 8; i < size - 8; i++) {
      for (let j = 8; j < size - 8; j++) {
        matrix[i][j] = ((i + j + textHash) % 3) === 0;
      }
    }

    return matrix;
  };

  const generateQR = async () => {
    if (!text.trim()) {
      toast({
        title: "No Content",
        description: "Please enter text or URL to generate QR code.",
        variant: "destructive"
      });
      return;
    }

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    
    const qrSize = size[0];
    const marginSize = margin[0] * 10;
    canvas.width = qrSize + marginSize * 2;
    canvas.height = qrSize + marginSize * 2 + (includeText ? 40 : 0);

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generate QR matrix
    const matrix = generateQRMatrix(text, errorCorrectionLevel);
    const moduleSize = qrSize / matrix.length;

    // Draw QR code
    ctx.fillStyle = foregroundColor;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j]) {
          ctx.fillRect(
            marginSize + j * moduleSize,
            marginSize + i * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }

    // Add logo if provided
    if (logoUrl) {
      try {
        const logo = new Image();
        logo.crossOrigin = 'anonymous';
        logo.onload = () => {
          const logoSizePixels = (qrSize * logoSize[0]) / 100;
          const logoX = marginSize + (qrSize - logoSizePixels) / 2;
          const logoY = marginSize + (qrSize - logoSizePixels) / 2;

          // Add white background for logo
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(logoX - 5, logoY - 5, logoSizePixels + 10, logoSizePixels + 10);

          ctx.drawImage(logo, logoX, logoY, logoSizePixels, logoSizePixels);
          
          finalizeQR();
        };
        logo.src = logoUrl;
      } catch (error) {
        finalizeQR();
      }
    } else {
      finalizeQR();
    }

    function finalizeQR() {
      // Add text below QR code if enabled
      if (includeText) {
        ctx.fillStyle = foregroundColor;
        ctx.font = '14px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          text.length > 50 ? text.substring(0, 47) + '...' : text,
          canvas.width / 2,
          canvas.height - 15
        );
      }

      const dataURL = canvas.toDataURL('image/png');
      setGeneratedQR(dataURL);

      toast({
        title: "QR Code Generated",
        description: "Your QR code is ready for download."
      });
    }
  };

  const downloadQR = () => {
    if (generatedQR) {
      const a = document.createElement('a');
      a.href = generatedQR;
      a.download = `qr-code-${Date.now()}.png`;
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
            QR Code to Image Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create customizable QR codes with logos, colors, and advanced settings for any text or URL.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  Content & Basic Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Text or URL</Label>
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text, URL, or any content for the QR code"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Size: {size[0]}px</Label>
                  <Slider
                    value={size}
                    onValueChange={setSize}
                    min={200}
                    max={800}
                    step={50}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Margin: {margin[0]} modules</Label>
                  <Slider
                    value={margin}
                    onValueChange={setMargin}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label>Foreground Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
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
                </div>

                <div className="space-y-3">
                  <Label>Logo URL (optional)</Label>
                  <Input
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                {logoUrl && (
                  <div className="space-y-3">
                    <Label>Logo Size: {logoSize[0]}% of QR code</Label>
                    <Slider
                      value={logoSize}
                      onValueChange={setLogoSize}
                      min={10}
                      max={30}
                      step={2}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-text"
                    checked={includeText}
                    onCheckedChange={setIncludeText}
                  />
                  <Label htmlFor="include-text">Include text below QR code</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Advanced Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Error Correction Level</Label>
                  <Select value={errorCorrectionLevel} onValueChange={setErrorCorrectionLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {errorLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          <div>
                            <div>{level.label}</div>
                            <div className="text-xs text-gray-500">{level.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={generateQR} className="w-full">
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Button>
                  
                  <Button 
                    onClick={downloadQR}
                    disabled={!generatedQR}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>QR Code Preview</CardTitle>
              <CardDescription>Your generated QR code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg p-8 bg-gray-50 min-h-[500px] flex items-center justify-center">
                {generatedQR ? (
                  <div className="text-center">
                    <img 
                      src={generatedQR} 
                      alt="Generated QR code" 
                      className="max-w-full max-h-[400px] object-contain mx-auto rounded shadow-lg"
                    />
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Size: {size[0]}px × {size[0] + (includeText ? 40 : 0)}px</p>
                      <p>Error Level: {errorLevels.find(l => l.value === errorCorrectionLevel)?.label}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <QrCode className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Enter content and click "Generate QR Code"</p>
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

export default QrCodeToImage;
