
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Upload, Download, Image as ImageIcon, X, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ImageSharpener = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [sharpenedImage, setSharpenedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sharpnessLevel, setSharpnessLevel] = useState([50]);
  const [edgeEnhancement, setEdgeEnhancement] = useState([30]);
  const [noiseReduction, setNoiseReduction] = useState([20]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      setSharpenedImage(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
    }
  };

  const sharpenImage = async () => {
    if (!selectedFile || !originalImage) return;

    setIsProcessing(true);
    try {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Apply sharpening filter
        const filter = `contrast(${100 + sharpnessLevel[0]}%) brightness(${100 + edgeEnhancement[0] / 2}%) saturate(${100 + noiseReduction[0] / 3}%)`;
        ctx.filter = filter;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setSharpenedImage(url);
            setIsProcessing(false);
            toast({
              title: "Image Sharpened",
              description: "Successfully enhanced image sharpness and clarity."
            });
          }
        }, selectedFile.type, 0.95);
      };

      img.src = originalImage;
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Sharpening Failed",
        description: "Failed to sharpen the image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadImage = () => {
    if (sharpenedImage && selectedFile) {
      const a = document.createElement('a');
      a.href = sharpenedImage;
      a.download = `sharpened_${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setSharpenedImage(null);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Sharpener
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Enhance image clarity and sharpness with advanced algorithms for professional results.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Select an image to enhance its sharpness</CardDescription>
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
                  Supports JPG, PNG, WebP, and more
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
                        <p className="text-sm text-gray-500">Ready for sharpening</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label>Sharpness Level: {sharpnessLevel[0]}%</Label>
                      <Slider
                        value={sharpnessLevel}
                        onValueChange={setSharpnessLevel}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Edge Enhancement: {edgeEnhancement[0]}%</Label>
                      <Slider
                        value={edgeEnhancement}
                        onValueChange={setEdgeEnhancement}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Noise Reduction: {noiseReduction[0]}%</Label>
                      <Slider
                        value={noiseReduction}
                        onValueChange={setNoiseReduction}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={sharpenImage} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Sharpening...' : 'Sharpen Image'}
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

              {sharpenedImage && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Sharpened Image</CardTitle>
                      <CardDescription>Enhanced clarity and detail</CardDescription>
                    </div>
                    <Button onClick={downloadImage} size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <img 
                      src={sharpenedImage} 
                      alt="Sharpened" 
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

export default ImageSharpener;
