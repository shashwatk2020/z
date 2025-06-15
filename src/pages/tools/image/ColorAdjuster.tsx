
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Upload, Download, Image as ImageIcon, X, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ColorAdjuster = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [adjustedImage, setAdjustedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState({
    brightness: [100],
    contrast: [100],
    saturation: [100],
    hue: [0]
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      setAdjustedImage(null);
      setSettings({
        brightness: [100],
        contrast: [100],
        saturation: [100],
        hue: [0]
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
    }
  };

  const adjustColors = async () => {
    if (!selectedFile || !originalImage) {
      toast({
        title: "No File Selected",
        description: "Please select an image to adjust colors.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Apply combined filters
        const filters = [
          `brightness(${settings.brightness[0]}%)`,
          `contrast(${settings.contrast[0]}%)`,
          `saturate(${settings.saturation[0]}%)`,
          `hue-rotate(${settings.hue[0]}deg)`
        ];
        
        ctx.filter = filters.join(' ');
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setAdjustedImage(url);
            setIsProcessing(false);
            
            toast({
              title: "Colors Adjusted",
              description: "Successfully applied color adjustments to your image."
            });
          }
        }, selectedFile.type, 0.9);
      };

      img.src = originalImage;
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Adjustment Failed",
        description: "Failed to adjust colors. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadImage = () => {
    if (adjustedImage && selectedFile) {
      const a = document.createElement('a');
      a.href = adjustedImage;
      a.download = `color_adjusted_${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const resetColors = () => {
    setSettings({
      brightness: [100],
      contrast: [100],
      saturation: [100],
      hue: [0]
    });
    setAdjustedImage(null);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setAdjustedImage(null);
    setSettings({
      brightness: [100],
      contrast: [100],
      saturation: [100],
      hue: [0]
    });
  };

  const updateSetting = (key: keyof typeof settings, value: number[]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getCurrentFilter = () => {
    const filters = [
      `brightness(${settings.brightness[0]}%)`,
      `contrast(${settings.contrast[0]}%)`,
      `saturate(${settings.saturation[0]}%)`,
      `hue-rotate(${settings.hue[0]}deg)`
    ];
    return filters.join(' ');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Color Adjuster
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Fine-tune your image colors with brightness, contrast, saturation, and hue adjustments.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Select an image file to adjust colors</CardDescription>
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
                  Supports JPG, PNG, GIF, WebP, and more
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
                        <p className="text-sm text-gray-500">Adjust color properties below</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label>Brightness: {settings.brightness[0]}%</Label>
                      <Slider
                        value={settings.brightness}
                        onValueChange={(value) => updateSetting('brightness', value)}
                        max={200}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Contrast: {settings.contrast[0]}%</Label>
                      <Slider
                        value={settings.contrast}
                        onValueChange={(value) => updateSetting('contrast', value)}
                        max={200}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Saturation: {settings.saturation[0]}%</Label>
                      <Slider
                        value={settings.saturation}
                        onValueChange={(value) => updateSetting('saturation', value)}
                        max={200}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Hue: {settings.hue[0]}°</Label>
                      <Slider
                        value={settings.hue}
                        onValueChange={(value) => updateSetting('hue', value)}
                        max={360}
                        min={-360}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={adjustColors} 
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      {isProcessing ? 'Adjusting...' : 'Apply Colors'}
                    </Button>
                    <Button 
                      onClick={resetColors} 
                      disabled={isProcessing}
                      variant="outline"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {originalImage && (
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Original Image</CardTitle>
                  <CardDescription>Your uploaded image (no adjustments)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <img 
                      src={originalImage} 
                      alt="Original" 
                      className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Live preview with adjustments</CardDescription>
                  </div>
                  {adjustedImage && (
                    <Button onClick={downloadImage} size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <img 
                      src={adjustedImage || originalImage} 
                      alt="Adjusted" 
                      className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                      style={{ 
                        maxHeight: '300px',
                        filter: !adjustedImage ? getCurrentFilter() : 'none'
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </Layout>
  );
};

export default ColorAdjuster;
