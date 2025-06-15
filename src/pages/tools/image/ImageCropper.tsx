
import React, { useState, useRef, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, Download, Image as ImageIcon, X, Crop } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ImageCropper = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      setCroppedImage(null);
      
      // Load image to get dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        setCropArea({ x: 0, y: 0, width: Math.min(200, img.width), height: Math.min(200, img.height) });
      };
      img.src = url;
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
    }
  };

  const cropImage = useCallback(async () => {
    if (!selectedFile || !imageDimensions) {
      toast({
        title: "No File Selected",
        description: "Please select an image to crop.",
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
        canvas.width = cropArea.width;
        canvas.height = cropArea.height;
        
        ctx.drawImage(
          img,
          cropArea.x, cropArea.y, cropArea.width, cropArea.height,
          0, 0, cropArea.width, cropArea.height
        );
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setCroppedImage(url);
            setIsProcessing(false);
            
            toast({
              title: "Image Cropped",
              description: `Successfully cropped image to ${cropArea.width}x${cropArea.height}px.`
            });
          }
        }, selectedFile.type, 0.9);
      };

      img.src = originalImage!;
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Crop Failed",
        description: "Failed to crop the image. Please try again.",
        variant: "destructive"
      });
    }
  }, [selectedFile, originalImage, cropArea, imageDimensions, toast]);

  const downloadImage = () => {
    if (croppedImage && selectedFile) {
      const a = document.createElement('a');
      a.href = croppedImage;
      a.download = `cropped_${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setCroppedImage(null);
    setImageDimensions(null);
  };

  const updateCropArea = (field: keyof typeof cropArea, value: number) => {
    setCropArea(prev => ({
      ...prev,
      [field]: Math.max(0, value)
    }));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Cropper
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Crop your images to focus on the important parts and remove unwanted areas.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Select an image file to crop</CardDescription>
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
                        {imageDimensions && (
                          <p className="text-sm text-gray-500">
                            Original: {imageDimensions.width} x {imageDimensions.height}px
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="x">X Position</Label>
                      <Input
                        id="x"
                        type="number"
                        value={cropArea.x}
                        onChange={(e) => updateCropArea('x', parseInt(e.target.value) || 0)}
                        min="0"
                        max={imageDimensions?.width || 0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="y">Y Position</Label>
                      <Input
                        id="y"
                        type="number"
                        value={cropArea.y}
                        onChange={(e) => updateCropArea('y', parseInt(e.target.value) || 0)}
                        min="0"
                        max={imageDimensions?.height || 0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        type="number"
                        value={cropArea.width}
                        onChange={(e) => updateCropArea('width', parseInt(e.target.value) || 0)}
                        min="1"
                        max={imageDimensions?.width || 0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        type="number"
                        value={cropArea.height}
                        onChange={(e) => updateCropArea('height', parseInt(e.target.value) || 0)}
                        min="1"
                        max={imageDimensions?.height || 0}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={cropImage} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Crop className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Cropping...' : 'Crop Image'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {originalImage && (
            <Card>
              <CardHeader>
                <CardTitle>Original Image</CardTitle>
                <CardDescription>Preview of the image with crop area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative inline-block">
                  <img 
                    ref={imageRef}
                    src={originalImage} 
                    alt="Original" 
                    className="max-w-full h-auto rounded-lg"
                    style={{ maxHeight: '400px' }}
                  />
                  <div 
                    className="absolute border-2 border-red-500 bg-red-500 bg-opacity-20"
                    style={{
                      left: `${(cropArea.x / (imageDimensions?.width || 1)) * 100}%`,
                      top: `${(cropArea.y / (imageDimensions?.height || 1)) * 100}%`,
                      width: `${(cropArea.width / (imageDimensions?.width || 1)) * 100}%`,
                      height: `${(cropArea.height / (imageDimensions?.height || 1)) * 100}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {croppedImage && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Cropped Image</CardTitle>
                  <CardDescription>
                    Dimensions: {cropArea.width} x {cropArea.height}px
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
                    src={croppedImage} 
                    alt="Cropped" 
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

export default ImageCropper;
