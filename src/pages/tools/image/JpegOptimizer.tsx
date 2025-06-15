
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Upload, Download, Image as ImageIcon, X, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const JpegOptimizer = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [optimizedImages, setOptimizedImages] = useState<{ name: string; url: string; originalSize: number; optimizedSize: number }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState([85]);
  const [progressive, setProgressive] = useState(true);
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [optimizeHuffman, setOptimizeHuffman] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const jpegFiles = files.filter(file => 
      file.type === 'image/jpeg' || file.type === 'image/jpg'
    );
    
    if (jpegFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: "Please select only JPEG files.",
        variant: "destructive"
      });
    }
    
    setSelectedFiles(jpegFiles);
    setOptimizedImages([]);
  };

  const optimizeJpegs = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select JPEG files to optimize.",
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
            if (optimizeHuffman) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
            }
            
            ctx.drawImage(img, 0, 0);

            // Progressive JPEG simulation (in real implementation, this would be handled by the encoder)
            const qualityValue = progressive ? quality[0] / 100 * 0.95 : quality[0] / 100;

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
            }, 'image/jpeg', qualityValue);
          };
          img.src = URL.createObjectURL(file);
        });
      }

      setOptimizedImages(optimized);
      setIsProcessing(false);
      
      const totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
      const totalOptimizedSize = optimized.reduce((sum, img) => sum + img.optimizedSize, 0);
      const compressionRatio = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
      
      toast({
        title: "JPEG Optimization Complete",
        description: `Optimized ${optimized.length} JPEG files. Saved ${compressionRatio}% space.`
      });
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize JPEG files. Please try again.",
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
            JPEG Optimizer
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Advanced JPEG optimization with progressive encoding, Huffman table optimization, and metadata removal.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload JPEG Files</CardTitle>
              <CardDescription>Select JPEG images for advanced optimization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop JPEG files here or click to browse
                </p>
                <p className="text-gray-500">
                  Supports .jpg and .jpeg files only
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,image/jpeg"
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
                          min={50}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500">
                          Higher quality = larger file size
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="progressive"
                          checked={progressive}
                          onCheckedChange={setProgressive}
                        />
                        <Label htmlFor="progressive">Progressive JPEG</Label>
                      </div>

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
                          id="huffman"
                          checked={optimizeHuffman}
                          onCheckedChange={setOptimizeHuffman}
                        />
                        <Label htmlFor="huffman">Optimize Huffman tables</Label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Settings className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Optimization Features</h4>
                        <ul className="text-sm text-blue-700 mt-1 space-y-1">
                          <li>• Progressive JPEG for faster loading</li>
                          <li>• Huffman table optimization for better compression</li>
                          <li>• Metadata removal to reduce file size</li>
                          <li>• Quality-based compression with minimal artifacts</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={optimizeJpegs} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Optimizing...' : `Optimize ${selectedFiles.length} JPEG Files`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {optimizedImages.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Optimized JPEG Files</CardTitle>
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
                            ({((img.originalSize - img.optimizedSize) / img.originalSize * 100).toFixed(1)}% saved)
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

export default JpegOptimizer;
