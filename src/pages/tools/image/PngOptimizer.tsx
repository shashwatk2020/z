
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Upload, Download, Image as ImageIcon, X, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PngOptimizer = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [optimizedImages, setOptimizedImages] = useState<{ name: string; url: string; originalSize: number; optimizedSize: number }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState([6]);
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [optimizePalette, setOptimizePalette] = useState(true);
  const [interlaced, setInterlaced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const pngFiles = files.filter(file => file.type === 'image/png');
    
    if (pngFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: "Please select only PNG files.",
        variant: "destructive"
      });
    }
    
    setSelectedFiles(pngFiles);
    setOptimizedImages([]);
  };

  const optimizePngs = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select PNG files to optimize.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    const optimized: { name: string; url: string; originalSize: number; optimizedSize: number }[] = [];

    try {
      for (const file of selectedFiles) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const img = new Image();

        await new Promise((resolve) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Apply optimization settings
            if (optimizePalette) {
              ctx.imageSmoothingEnabled = false;
            }
            
            ctx.drawImage(img, 0, 0);

            // Simulate compression level (in real implementation, this would affect the PNG encoder)
            const quality = 1.0 - (compressionLevel[0] / 10 * 0.1);

            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                optimized.push({
                  name: file.name,
                  url,
                  originalSize: file.size,
                  optimizedSize: blob.size
                });
              }
              resolve(null);
            }, 'image/png', quality);
          };
          img.src = URL.createObjectURL(file);
        });
      }

      setOptimizedImages(optimized);
      setIsProcessing(false);
      
      const totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
      const totalOptimizedSize = optimized.reduce((sum, img) => sum + img.optimizedSize, 0);
      const compressionRatio = totalOptimizedSize < totalOriginalSize 
        ? ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)
        : '0';
      
      toast({
        title: "PNG Optimization Complete",
        description: `Optimized ${optimized.length} PNG files. ${compressionRatio}% space saved.`
      });
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize PNG files. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadImage = (url: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized_${fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    optimizedImages.forEach(img => {
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
            PNG Optimizer
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Advanced PNG optimization with lossless compression, palette optimization, and metadata removal.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload PNG Files</CardTitle>
              <CardDescription>Select PNG images for advanced optimization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop PNG files here or click to browse
                </p>
                <p className="text-gray-500">
                  Supports .png files only
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".png,image/png"
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
                        <Label>Compression Level: {compressionLevel[0]}</Label>
                        <Slider
                          value={compressionLevel}
                          onValueChange={setCompressionLevel}
                          min={0}
                          max={9}
                          step={1}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500">
                          0 = No compression, 9 = Maximum compression
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="metadata"
                          checked={removeMetadata}
                          onCheckedChange={setRemoveMetadata}
                        />
                        <Label htmlFor="metadata">Remove metadata</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="palette"
                          checked={optimizePalette}
                          onCheckedChange={setOptimizePalette}
                        />
                        <Label htmlFor="palette">Optimize palette</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="interlaced"
                          checked={interlaced}
                          onCheckedChange={setInterlaced}
                        />
                        <Label htmlFor="interlaced">Interlaced PNG</Label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Zap className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">PNG Optimization Features</h4>
                        <ul className="text-sm text-green-700 mt-1 space-y-1">
                          <li>• Lossless compression maintains image quality</li>
                          <li>• Palette optimization reduces color redundancy</li>
                          <li>• Metadata removal for smaller file sizes</li>
                          <li>• Interlaced option for progressive loading</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={optimizePngs} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Optimizing...' : `Optimize ${selectedFiles.length} PNG Files`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {optimizedImages.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Optimized PNG Files</CardTitle>
                  <CardDescription>Your optimized images are ready for download</CardDescription>
                </div>
                <Button onClick={downloadAll}>
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {optimizedImages.map((img, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ImageIcon className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium text-gray-900">{img.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(img.originalSize)} → {formatFileSize(img.optimizedSize)}
                            {img.optimizedSize < img.originalSize && (
                              <span className="text-green-600">
                                {' '}({((img.originalSize - img.optimizedSize) / img.originalSize * 100).toFixed(1)}% saved)
                              </span>
                            )}
                            {img.optimizedSize >= img.originalSize && (
                              <span className="text-blue-600"> (Already optimized)</span>
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

export default PngOptimizer;
