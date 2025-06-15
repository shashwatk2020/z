
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Upload, Download, Image as ImageIcon, X, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BrightnessAdjuster = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [adjustedImage, setAdjustedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [brightness, setBrightness] = useState([100]);
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
      setBrightness([100]);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
    }
  };

  const adjustBrightness = async () => {
    if (!selectedFile || !originalImage) {
      toast({
        title: "No File Selected",
        description: "Please select an image to adjust brightness.",
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
        
        // Apply brightness filter
        ctx.filter = `brightness(${brightness[0]}%)`;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setAdjustedImage(url);
            setIsProcessing(false);
            
            toast({
              title: "Brightness Adjusted",
              description: `Successfully adjusted brightness to ${brightness[0]}%.`
            });
          }
        }, selectedFile.type, 0.9);
      };

      img.src = originalImage;
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Adjustment Failed",
        description: "Failed to adjust brightness. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadImage = () => {
    if (adjustedImage && selectedFile) {
      const a = document.createElement('a');
      a.href = adjustedImage;
      a.download = `brightness_${brightness[0]}_${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const resetBrightness = () => {
    setBrightness([100]);
    setAdjustedImage(null);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setAdjustedImage(null);
    setBrightness([100]);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Brightness Adjuster
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Adjust the brightness of your images to make them lighter or darker as needed.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Select an image file to adjust brightness</CardDescription>
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ImageIcon className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">Brightness: {brightness[0]}%</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Brightness: {brightness[0]}%</Label>
                      <Slider
                        value={brightness}
                        onValueChange={setBrightness}
                        max={300}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Very Dark (10%)</span>
                        <span>Normal (100%)</span>
                        <span>Very Bright (300%)</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={adjustBrightness} 
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        <Sun className="h-4 w-4 mr-2" />
                        {isProcessing ? 'Adjusting...' : 'Apply Brightness'}
                      </Button>
                      <Button 
                        onClick={resetBrightness} 
                        disabled={isProcessing || brightness[0] === 100}
                        variant="outline"
                      >
                        Reset
                      </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {[50, 75, 125, 150, 200, 250].map((value) => (
                        <Button
                          key={value}
                          onClick={() => setBrightness([value])}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          {value}%
                        </Button>
                      ))}
                    </div>
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
                  <CardDescription>Your uploaded image (100% brightness)</CardDescription>
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
                    <CardDescription>Brightness: {brightness[0]}%</CardDescription>
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
                        filter: !adjustedImage ? `brightness(${brightness[0]}%)` : 'none'
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

export default BrightnessAdjuster;
