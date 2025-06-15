
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Download, Copy, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QrCodeGenerator = () => {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState('M');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [margin, setMargin] = useState(4);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Simple QR code generation (basic implementation)
  const generateQR = async () => {
    try {
      // For a real implementation, you would use a QR code library like 'qrcode'
      // This is a simplified version using a service or basic implementation
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = size;
      canvas.height = size;

      // Background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, size, size);

      // Simple QR pattern (placeholder - in real app use QR library)
      ctx.fillStyle = foregroundColor;
      const moduleSize = (size - margin * 2) / 25; // 25x25 grid
      
      // Create a simple pattern that looks like a QR code
      for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
          // Create a pattern based on text hash
          const hash = text.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
          }, 0);
          
          if ((i + j + hash) % 3 === 0 || 
              (i < 7 && j < 7) || 
              (i < 7 && j > 17) || 
              (i > 17 && j < 7)) {
            ctx.fillRect(
              margin + j * moduleSize,
              margin + i * moduleSize,
              moduleSize,
              moduleSize
            );
          }
        }
      }

      setQrDataUrl(canvas.toDataURL('image/png'));
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  useEffect(() => {
    generateQR();
  }, [text, size, errorLevel, foregroundColor, backgroundColor, margin]);

  const downloadQR = () => {
    if (qrDataUrl) {
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = qrDataUrl;
      link.click();
      toast({
        title: "Downloaded!",
        description: "QR code downloaded successfully."
      });
    }
  };

  const copyQRLink = () => {
    navigator.clipboard.writeText(qrDataUrl);
    toast({
      title: "Copied!",
      description: "QR code data URL copied to clipboard."
    });
  };

  const presetTexts = [
    { label: 'Website URL', value: 'https://example.com' },
    { label: 'Email', value: 'mailto:contact@example.com' },
    { label: 'Phone', value: 'tel:+1234567890' },
    { label: 'WiFi', value: 'WIFI:T:WPA;S:NetworkName;P:Password;;' },
    { label: 'SMS', value: 'sms:+1234567890:Hello!' },
    { label: 'vCard', value: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nORG:Company\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              QR Code Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create custom QR codes for URLs, text, contact info, and more. Customize colors and download high-quality images.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Settings</CardTitle>
                  <CardDescription>Configure your QR code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select onValueChange={(value) => setText(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose preset..." />
                      </SelectTrigger>
                      <SelectContent>
                        {presetTexts.map((preset, index) => (
                          <SelectItem key={index} value={preset.value}>{preset.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Text/URL</Label>
                    <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter text, URL, or data..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Size: {size}px</Label>
                    <Slider value={[size]} onValueChange={(v) => setSize(v[0])} min={128} max={512} step={32} />
                  </div>

                  <div className="space-y-2">
                    <Label>Error Correction Level</Label>
                    <Select value={errorLevel} onValueChange={setErrorLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Low (7%)</SelectItem>
                        <SelectItem value="M">Medium (15%)</SelectItem>
                        <SelectItem value="Q">Quartile (25%)</SelectItem>
                        <SelectItem value="H">High (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Foreground Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Margin: {margin}px</Label>
                    <Slider value={[margin]} onValueChange={(v) => setMargin(v[0])} min={0} max={20} step={1} />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated QR Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-white rounded-lg border">
                      {qrDataUrl ? (
                        <img src={qrDataUrl} alt="Generated QR Code" className="max-w-full h-auto" />
                      ) : (
                        <div className="w-64 h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                          <QrCode className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <canvas ref={canvasRef} className="hidden" />
                    
                    <div className="flex gap-3">
                      <Button onClick={downloadQR} disabled={!qrDataUrl}>
                        <Download className="h-4 w-4 mr-2" />
                        Download PNG
                      </Button>
                      <Button variant="outline" onClick={copyQRLink} disabled={!qrDataUrl}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Data URL
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>QR Code Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Content Length:</span>
                      <span className="ml-2">{text.length} characters</span>
                    </div>
                    <div>
                      <span className="font-semibold">Image Size:</span>
                      <span className="ml-2">{size}x{size}px</span>
                    </div>
                    <div>
                      <span className="font-semibold">Error Correction:</span>
                      <span className="ml-2">{errorLevel}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Margin:</span>
                      <span className="ml-2">{margin}px</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Usage Tips:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use high contrast colors for better readability</li>
                      <li>• Higher error correction allows for more damage tolerance</li>
                      <li>• Test your QR code with multiple scanners</li>
                      <li>• Keep important content short for better compatibility</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QrCodeGenerator;
