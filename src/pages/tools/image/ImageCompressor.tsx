
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Upload, Download, Image as ImageIcon, X, Compress } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ImageCompressor = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<{ name: string; url: string; originalSize: number; compressedSize: number }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState([80]);
  const [maxWidth, setMaxWidth] = useState([1920]);
  const [maxHeight, setMaxHeight] = useState([1080]);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [progressive, setProgressive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: "Please select only image files.",
        variant: "destructive"
      });
    }
    
    setSelectedFiles(imageFiles);
    setCompressedImages([]);
  };

  const compressImages = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select images to compress.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    const compressed: { name: string; url: string; originalSize: number; compressedSize: number }[] = [];

    try {
      for (const file of selectedFiles) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const img = new Image();

        await new Promise((resolve) => {
          img.onload = () => {
            let { width, height } = img;
            
            // Resize if needed
            if (width > maxWidth[0] || height > maxHeight[0]) {
              if (maintainAspectRatio) {
                const ratio = Math.min(maxWidth[0] / width, maxHeight[0] / height);
                width *= ratio;
                height *= ratio;
              } else {
                width = Math.min(width, maxWidth[0]);
                height = Math.min(height, maxHeight[0]);
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                compressed.push({
                  name: file.name,
                  url,
                  originalSize: file.size,
                  compressedSize: blob.size
                });
              }
              resolve(null);
            }, file.type, quality[0] / 100);
          };
          img.src = URL.createObjectURL(file);
        });
      }

      setCompressedImages(compressed);
      setIsProcessing(false);
      
      const totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
      const totalCompressedSize = compressed.reduce((sum, img) => sum + img.compressedSize, 0);
      const compressionRatio = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
      
      toast({
        title: "Compression Complete",
        description: `Compressed ${compressed.length} images. Saved ${compressionRatio}% space.`
      });
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Compression Failed",
        description: "Failed to compress images. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadImage = (url: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    compressedImages.forEach(img => {
      downloadImage(img.url, img.name);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Compressor
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Reduce image file sizes while maintaining quality. Perfect for web optimization and storage savings.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>Select one or more images to compress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop images here or click to browse
                </p>
                <p className="text-gray-500">
                  Supports JPG, PNG, WebP, and more
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Selected Files:</h3>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <ImageIcon className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label>Quality: {quality[0]}%</Label>
                        <Slider
                          value={quality}
                          onValueChange={setQuality}
                          min={10}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Max Width: {maxWidth[0]}px</Label>
                        <Slider
                          value={maxWidth}
                          onValueChange={setMaxWidth}
                          min={320}
                          max={4000}
                          step={80}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label>Max Height: {maxHeight[0]}px</Label>
                        <Slider
                          value={maxHeight}
                          onValueChange={setMaxHeight}
                          min={240}
                          max={3000}
                          step={60}
                          className="w-full"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="aspect-ratio"
                          checked={maintainAspectRatio}
                          onCheckedChange={setMaintainAspectRatio}
                        />
                        <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="progressive"
                          checked={progressive}
                          onCheckedChange={setProgressive}
                        />
                        <Label htmlFor="progressive">Progressive JPEG</Label>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={compressImages} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Compress className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Compressing...' : `Compress ${selectedFiles.length} Images`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {compressedImages.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Compressed Images</CardTitle>
                  <CardDescription>Your optimized images are ready for download</CardDescription>
                </div>
                <Button onClick={downloadAll}>
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {compressedImages.map((img, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ImageIcon className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium text-gray-900">{img.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(img.originalSize)} → {formatFileSize(img.compressedSize)} 
                            ({((img.originalSize - img.compressedSize) / img.originalSize * 100).toFixed(1)}% saved)
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadImage(img.url, img.name)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ImageCompressor;
