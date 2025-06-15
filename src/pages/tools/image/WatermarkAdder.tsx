
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Image as ImageIcon, X, Type } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WatermarkAdder = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<string | null>(null);
  const [watermarkedImage, setWatermarkedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkText, setWatermarkText] = useState('© Your Watermark');
  const [opacity, setOpacity] = useState([50]);
  const [position, setPosition] = useState('bottom-right');
  const [watermarkType, setWatermarkType] = useState('text');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      setWatermarkedImage(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
    }
  };

  const handleWatermarkSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setWatermarkFile(file);
      const url = URL.createObjectURL(file);
      setWatermarkImage(url);
    } else {
      toast({
        title: "Invalid Watermark",
        description: "Please select a valid image file for watermark.",
        variant: "destructive"
      });
    }
  };

  const addWatermark = async () => {
    if (!selectedFile || !originalImage) return;
    if (watermarkType === 'image' && !watermarkImage) {
      toast({
        title: "No Watermark Image",
        description: "Please select a watermark image.",
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
        ctx.drawImage(img, 0, 0);

        // Calculate position
        const getPosition = () => {
          const margin = 20;
          switch (position) {
            case 'top-left': return { x: margin, y: margin };
            case 'top-right': return { x: canvas.width - 200 - margin, y: margin };
            case 'bottom-left': return { x: margin, y: canvas.height - 50 - margin };
            case 'bottom-right': return { x: canvas.width - 200 - margin, y: canvas.height - 50 - margin };
            case 'center': return { x: canvas.width / 2 - 100, y: canvas.height / 2 - 25 };
            default: return { x: canvas.width - 200 - margin, y: canvas.height - 50 - margin };
          }
        };

        const pos = getPosition();
        ctx.globalAlpha = opacity[0] / 100;

        if (watermarkType === 'text') {
          // Add text watermark
          ctx.font = '24px Arial';
          ctx.fillStyle = 'white';
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 2;
          ctx.strokeText(watermarkText, pos.x, pos.y);
          ctx.fillText(watermarkText, pos.x, pos.y);
        } else if (watermarkType === 'image' && watermarkImage) {
          // Add image watermark
          const watermarkImg = new Image();
          watermarkImg.onload = () => {
            const watermarkWidth = 150;
            const watermarkHeight = (watermarkImg.height * watermarkWidth) / watermarkImg.width;
            ctx.drawImage(watermarkImg, pos.x, pos.y, watermarkWidth, watermarkHeight);
            
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                setWatermarkedImage(url);
                setIsProcessing(false);
                toast({
                  title: "Watermark Added",
                  description: "Successfully added watermark to your image."
                });
              }
            }, selectedFile.type, 0.9);
          };
          watermarkImg.src = watermarkImage;
          return;
        }

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setWatermarkedImage(url);
            setIsProcessing(false);
            toast({
              title: "Watermark Added",
              description: "Successfully added watermark to your image."
            });
          }
        }, selectedFile.type, 0.9);
      };

      img.src = originalImage;
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Watermark Failed",
        description: "Failed to add watermark. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadImage = () => {
    if (watermarkedImage && selectedFile) {
      const a = document.createElement('a');
      a.href = watermarkedImage;
      a.download = `watermarked_${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setWatermarkedImage(null);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Watermark Adder
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Protect your images with custom text or image watermarks in various positions and opacity levels.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Select an image to add watermark</CardDescription>
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
                        <p className="text-sm text-gray-500">Ready for watermarking</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label>Watermark Type</Label>
                      <Select value={watermarkType} onValueChange={setWatermarkType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text Watermark</SelectItem>
                          <SelectItem value="image">Image Watermark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {watermarkType === 'text' ? (
                      <div className="space-y-3">
                        <Label>Watermark Text</Label>
                        <Input
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          placeholder="Enter watermark text"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Label>Watermark Image</Label>
                        <Button
                          variant="outline"
                          onClick={() => watermarkInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Select Watermark Image
                        </Button>
                        <input
                          ref={watermarkInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleWatermarkSelect}
                          className="hidden"
                        />
                        {watermarkFile && (
                          <p className="text-sm text-gray-600">{watermarkFile.name}</p>
                        )}
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label>Position</Label>
                      <Select value={position} onValueChange={setPosition}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top-left">Top Left</SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Opacity: {opacity[0]}%</Label>
                      <Slider
                        value={opacity}
                        onValueChange={setOpacity}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={addWatermark} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Type className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Adding Watermark...' : 'Add Watermark'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {originalImage && (
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Original Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={originalImage} 
                    alt="Original" 
                    className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                    style={{ maxHeight: '300px' }}
                  />
                </CardContent>
              </Card>

              {watermarkedImage && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Watermarked Image</CardTitle>
                      <CardDescription>Protected with watermark</CardDescription>
                    </div>
                    <Button onClick={downloadImage} size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <img 
                      src={watermarkedImage} 
                      alt="Watermarked" 
                      className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                      style={{ maxHeight: '300px' }}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </Layout>
  );
};

export default WatermarkAdder;
