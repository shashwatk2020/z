
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Upload, Download, Image as ImageIcon, X, Focus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ImageBlurTool = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [blurredImage, setBlurredImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [blurAmount, setBlurAmount] = useState([0]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      setBlurredImage(null);
      setBlurAmount([0]);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
    }
  };

  const applyBlur = async () => {
    if (!selectedFile || !originalImage) {
      toast({
        title: "No File Selected",
        description: "Please select an image to apply blur.",
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
        
        // Apply blur filter
        ctx.filter = `blur(${blurAmount[0]}px)`;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setBlurredImage(url);
            setIsProcessing(false);
            
            toast({
              title: "Blur Applied",
              description: `Successfully applied ${blurAmount[0]}px blur to your image.`
            });
          }
        }, selectedFile.type, 0.9);
      };

      img.src = originalImage;
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Blur Failed",
        description: "Failed to apply blur. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadImage = () => {
    if (blurredImage && selectedFile) {
      const a = document.createElement('a');
      a.href = blurredImage;
      a.download = `blur_${blurAmount[0]}px_${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const resetBlur = () => {
    setBlurAmount([0]);
    setBlurredImage(null);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setBlurredImage(null);
    setBlurAmount([0]);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Blur Tool
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Apply blur effects to your images for artistic or privacy purposes.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Select an image file to apply blur effects</CardDescription>
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
                        <p className="text-sm text-gray-500">Blur: {blurAmount[0]}px</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Blur Amount: {blurAmount[0]}px</Label>
                      <Slider
                        value={blurAmount}
                        onValueChange={setBlurAmount}
                        max={50}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>No Blur (0px)</span>
                        <span>Light (10px)</span>
                        <span>Heavy (50px)</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={applyBlur} 
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        <Focus className="h-4 w-4 mr-2" />
                        {isProcessing ? 'Applying...' : 'Apply Blur'}
                      </Button>
                      <Button 
                        onClick={resetBlur} 
                        disabled={isProcessing || blurAmount[0] === 0}
                        variant="outline"
                      >
                        Reset
                      </Button>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {[1, 3, 5, 10, 15, 20, 25, 30, 40, 50].map((value) => (
                        <Button
                          key={value}
                          onClick={() => setBlurAmount([value])}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          {value}px
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
                  <CardDescription>Your uploaded image (no blur)</CardDescription>
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
                    <CardDescription>Blur: {blurAmount[0]}px</CardDescription>
                  </div>
                  {blurredImage && (
                    <Button onClick={downloadImage} size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <img 
                      src={blurredImage || originalImage} 
                      alt="Blurred" 
                      className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                      style={{ 
                        maxHeight: '300px',
                        filter: !blurredImage ? `blur(${blurAmount[0]}px)` : 'none'
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

export default ImageBlurTool;
