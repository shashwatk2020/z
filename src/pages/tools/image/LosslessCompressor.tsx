
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, Image as ImageIcon, X, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LosslessCompressor = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<{ name: string; url: string; originalSize: number; compressedSize: number }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const compressLossless = async () => {
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
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // For lossless compression, we use PNG format with maximum quality
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                compressed.push({
                  name: file.name.replace(/\.[^/.]+$/, '.png'), // Change extension to PNG
                  url,
                  originalSize: file.size,
                  compressedSize: blob.size
                });
              }
              resolve(null);
            }, 'image/png', 1.0); // PNG is lossless
          };
          img.src = URL.createObjectURL(file);
        });
      }

      setCompressedImages(compressed);
      setIsProcessing(false);
      
      const totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
      const totalCompressedSize = compressed.reduce((sum, img) => sum + img.compressedSize, 0);
      const compressionInfo = totalCompressedSize < totalOriginalSize 
        ? `Saved ${((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1)}% space`
        : `Optimized for lossless quality`;
      
      toast({
        title: "Lossless Compression Complete",
        description: `Processed ${compressed.length} images. ${compressionInfo}.`
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
    a.download = `lossless_${fileName}`;
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
            Lossless Compressor
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Compress images without losing any quality. Perfect for preserving original image data while optimizing file size.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>Select images for lossless compression to PNG format</CardDescription>
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
                  Will be converted to PNG for lossless compression
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

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Lossless Compression</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Images will be converted to PNG format to ensure zero quality loss. 
                          The compression removes unnecessary metadata and optimizes the file structure.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={compressLossless} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Processing...' : `Compress ${selectedFiles.length} Images (Lossless)`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {compressedImages.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Lossless Compressed Images</CardTitle>
                  <CardDescription>Your images compressed without quality loss</CardDescription>
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
                            {img.compressedSize < img.originalSize && (
                              <span className="text-green-600">
                                {' '}({((img.originalSize - img.compressedSize) / img.originalSize * 100).toFixed(1)}% saved)
                              </span>
                            )}
                            {img.compressedSize >= img.originalSize && (
                              <span className="text-blue-600"> (Quality preserved)</span>
                            )}
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

export default LosslessCompressor;
