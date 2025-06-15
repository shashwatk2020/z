
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, Image as ImageIcon, X, RotateCw, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ImageRotator = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [rotatedImage, setRotatedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      setRotatedImage(null);
      setRotation(0);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
    }
  };

  const rotateImage = async (degrees: number) => {
    if (!selectedFile || !originalImage) {
      toast({
        title: "No File Selected",
        description: "Please select an image to rotate.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    const newRotation = (rotation + degrees) % 360;
    setRotation(newRotation);

    try {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new canvas dimensions based on rotation
        const rad = (newRotation * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));
        
        const newWidth = img.width * cos + img.height * sin;
        const newHeight = img.width * sin + img.height * cos;
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Clear canvas and set up transformation
        ctx.clearRect(0, 0, newWidth, newHeight);
        ctx.translate(newWidth / 2, newHeight / 2);
        ctx.rotate(rad);
        
        // Draw the image centered
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setRotatedImage(url);
            setIsProcessing(false);
            
            toast({
              title: "Image Rotated",
              description: `Successfully rotated image by ${degrees}°.`
            });
          }
        }, selectedFile.type, 0.9);
      };

      img.src = originalImage;
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Rotation Failed",
        description: "Failed to rotate the image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadImage = () => {
    if (rotatedImage && selectedFile) {
      const a = document.createElement('a');
      a.href = rotatedImage;
      a.download = `rotated_${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const resetRotation = () => {
    setRotation(0);
    setRotatedImage(null);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setRotatedImage(null);
    setRotation(0);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Rotator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Rotate your images clockwise or counterclockwise to get the perfect orientation.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Select an image file to rotate</CardDescription>
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
                        <p className="text-sm text-gray-500">Current rotation: {rotation}°</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button 
                      onClick={() => rotateImage(-90)} 
                      disabled={isProcessing}
                      variant="outline"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Rotate Left 90°
                    </Button>
                    <Button 
                      onClick={() => rotateImage(90)} 
                      disabled={isProcessing}
                      variant="outline"
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      Rotate Right 90°
                    </Button>
                    <Button 
                      onClick={() => rotateImage(180)} 
                      disabled={isProcessing}
                      variant="outline"
                    >
                      Flip 180°
                    </Button>
                    <Button 
                      onClick={resetRotation} 
                      disabled={isProcessing || rotation === 0}
                      variant="outline"
                    >
                      Reset
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[15, 30, 45, -15, -30, -45].map((degrees) => (
                      <Button 
                        key={degrees}
                        onClick={() => rotateImage(degrees)} 
                        disabled={isProcessing}
                        variant="outline"
                        size="sm"
                      >
                        {degrees > 0 ? '+' : ''}{degrees}°
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {originalImage && (
            <Card>
              <CardHeader>
                <CardTitle>Image Preview</CardTitle>
                <CardDescription>
                  {rotatedImage ? `Rotated by ${rotation}°` : 'Original image'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <img 
                    src={rotatedImage || originalImage} 
                    alt={rotatedImage ? 'Rotated' : 'Original'} 
                    className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {rotatedImage && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Download Rotated Image</CardTitle>
                  <CardDescription>Your rotated image is ready for download</CardDescription>
                </div>
                <Button onClick={downloadImage}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardHeader>
            </Card>
          )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </Layout>
  );
};

export default ImageRotator;
