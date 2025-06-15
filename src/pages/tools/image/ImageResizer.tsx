
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Upload, Download, Image as ImageIcon, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ImageResizer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resizedImage, setResizedImage] = useState<{ url: string; width: number; height: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      
      // Get original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = URL.createObjectURL(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
    }
  };

  const handleWidthChange = (value: string) => {
    const newWidth = parseInt(value) || 0;
    setWidth(newWidth);
    
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (value: string) => {
    const newHeight = parseInt(value) || 0;
    setHeight(newHeight);
    
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const resizeImage = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select an image to resize.",
        variant: "destructive"
      });
      return;
    }

    if (width <= 0 || height <= 0) {
      toast({
        title: "Invalid Dimensions",
        description: "Please enter valid width and height values.",
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
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResizedImage({ url, width, height });
            setIsProcessing(false);
            
            toast({
              title: "Image Resized",
              description: `Successfully resized image to ${width}x${height}px.`
            });
          }
        }, selectedFile.type, 0.9);
      };

      img.src = URL.createObjectURL(selectedFile);
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Resize Failed",
        description: "Failed to resize the image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadImage = () => {
    if (resizedImage && selectedFile) {
      const a = document.createElement('a');
      a.href = resizedImage.url;
      a.download = `resized_${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setResizedImage(null);
    setOriginalDimensions(null);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Resizer
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Resize your images to specific dimensions while maintaining quality.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Select an image file to resize</CardDescription>
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
                        {originalDimensions && (
                          <p className="text-sm text-gray-500">
                            Original: {originalDimensions.width} x {originalDimensions.height}px
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="width">Width (px)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={width}
                        onChange={(e) => handleWidthChange(e.target.value)}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (px)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="aspect-ratio"
                      checked={maintainAspectRatio}
                      onCheckedChange={setMaintainAspectRatio}
                    />
                    <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
                  </div>

                  <Button 
                    onClick={resizeImage} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? 'Resizing...' : 'Resize Image'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {resizedImage && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Resized Image</CardTitle>
                  <CardDescription>
                    New dimensions: {resizedImage.width} x {resizedImage.height}px
                  </CardDescription>
                </div>
                <Button onClick={downloadImage}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <img 
                    src={resizedImage.url} 
                    alt="Resized" 
                    className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </Layout>
  );
};

export default ImageResizer;
