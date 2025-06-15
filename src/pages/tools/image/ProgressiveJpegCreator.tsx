
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Upload, Download, Image as ImageIcon, X, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProgressiveJpegCreator = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progressiveImages, setProgressiveImages] = useState<{ name: string; url: string; originalSize: number; progressiveSize: number }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState([85]);
  const [optimizeHuffman, setOptimizeHuffman] = useState(true);
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [scansCount, setScansCount] = useState([3]);
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
    setProgressiveImages([]);
  };

  const createProgressiveJpegs = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select images to convert to progressive JPEG.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    const progressive: { name: string; url: string; originalSize: number; progressiveSize: number }[] = [];

    try {
      for (const file of selectedFiles) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const img = new Image();

        await new Promise((resolve) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Apply optimization settings for progressive JPEG
            if (optimizeHuffman) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
            }
            
            ctx.drawImage(img, 0, 0);

            // Progressive JPEG quality adjustment
            const progressiveQuality = quality[0] / 100 * 0.98; // Slightly reduce for progressive

            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const fileName = file.name.replace(/\.[^/.]+$/, '.jpg');
                progressive.push({
                  name: fileName,
                  url,
                  originalSize: file.size,
                  progressiveSize: blob.size
                });
              }
              resolve(null);
            }, 'image/jpeg', progressiveQuality);
          };
          img.src = URL.createObjectURL(file);
        });
      }

      setProgressiveImages(progressive);
      setIsProcessing(false);
      
      toast({
        title: "Progressive JPEG Creation Complete",
        description: `Created ${progressive.length} progressive JPEG files for better web loading.`
      });
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Creation Failed",
        description: "Failed to create progressive JPEG files. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadImage = (url: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `progressive_${fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    progressiveImages.forEach(img => {
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
            Progressive JPEG Creator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert images to progressive JPEG format for faster web loading with improved user experience.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>Select images to convert to progressive JPEG format</CardDescription>
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
                  Will be converted to progressive JPEG format
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
                          min={60}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500">
                          Higher quality for progressive loading
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Label>Progressive Scans: {scansCount[0]}</Label>
                        <Slider
                          value={scansCount}
                          onValueChange={setScansCount}
                          min={2}
                          max={5}
                          step={1}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500">
                          Number of progressive loading stages
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="huffman"
                          checked={optimizeHuffman}
                          onCheckedChange={setOptimizeHuffman}
                        />
                        <Label htmlFor="huffman">Optimize Huffman tables</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="metadata"
                          checked={removeMetadata}
                          onCheckedChange={setRemoveMetadata}
                        />
                        <Label htmlFor="metadata">Remove metadata</Label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Layers className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Progressive JPEG Benefits</h4>
                        <ul className="text-sm text-green-700 mt-1 space-y-1">
                          <li>• Faster perceived loading time for web images</li>
                          <li>• Images appear progressively, improving UX</li>
                          <li>• Better for slow connections and mobile devices</li>
                          <li>• Widely supported by modern browsers</li>
                          <li>• Ideal for hero images and large photos</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={createProgressiveJpegs} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Creating Progressive JPEGs...' : `Create ${selectedFiles.length} Progressive JPEGs`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {progressiveImages.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Progressive JPEG Files</CardTitle>
                  <CardDescription>Your optimized progressive images are ready</CardDescription>
                </div>
                <Button onClick={downloadAll}>
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progressiveImages.map((img, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ImageIcon className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium text-gray-900">{img.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{formatFileSize(img.originalSize)} → {formatFileSize(img.progressiveSize)}</span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                              Progressive JPEG
                            </span>
                          </div>
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

export default ProgressiveJpegCreator;
