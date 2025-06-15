
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, Image as ImageIcon, X, Scissors } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BackgroundRemover = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      setProcessedImage(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
    }
  };

  const removeBackground = async () => {
    if (!selectedFile || !originalImage) {
      toast({
        title: "No File Selected",
        description: "Please select an image to process.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate background removal process
      // In a real implementation, this would use AI/ML services like Remove.bg API
      // or client-side libraries like @huggingface/transformers
      
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Simple background removal simulation (this is just for demo)
        // In reality, you'd use sophisticated AI models
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Simple threshold-based background removal (very basic)
          // This removes pixels that are too bright (simulating white background removal)
          if (r > 240 && g > 240 && b > 240) {
            data[i + 3] = 0; // Make transparent
          }
        }
        
        // Put the modified image data back
        ctx.putImageData(imageData, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setProcessedImage(url);
            setIsProcessing(false);
            
            toast({
              title: "Background Removed",
              description: "Successfully processed image. Note: This is a basic demo implementation."
            });
          }
        }, 'image/png', 1.0);
      };

      img.src = originalImage;
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Processing Failed",
        description: "Failed to remove background. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadImage = () => {
    if (processedImage && selectedFile) {
      const a = document.createElement('a');
      a.href = processedImage;
      a.download = `no_bg_${selectedFile.name.replace(/\.[^/.]+$/, '')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setProcessedImage(null);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Background Remover
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Remove backgrounds from your images automatically. Perfect for product photos, portraits, and more.
          </p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This is a basic demo implementation. For production use, consider integrating with AI services like Remove.bg or using advanced ML models.
            </p>
          </div>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Select an image file to remove its background</CardDescription>
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
                        <p className="text-sm text-gray-500">
                          Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button 
                    onClick={removeBackground} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Scissors className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Removing Background...' : 'Remove Background'}
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
                  <CardDescription>Your uploaded image</CardDescription>
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

              {processedImage && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Processed Image</CardTitle>
                      <CardDescription>Background removed</CardDescription>
                    </div>
                    <Button onClick={downloadImage} size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="bg-gray-100 bg-opacity-50 p-4 rounded-lg" style={{
                        backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                      }}>
                        <img 
                          src={processedImage} 
                          alt="Processed" 
                          className="max-w-full h-auto rounded-lg mx-auto"
                          style={{ maxHeight: '300px' }}
                        />
                      </div>
                    </div>
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

export default BackgroundRemover;
