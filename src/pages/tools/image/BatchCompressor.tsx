
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Image as ImageIcon, X, Layers, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BatchCompressor = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<{ name: string; url: string; originalSize: number; compressedSize: number; format: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState([80]);
  const [outputFormat, setOutputFormat] = useState('keep-original');
  const [maxWidth, setMaxWidth] = useState([1920]);
  const [maxHeight, setMaxHeight] = useState([1080]);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [removeMetadata, setRemoveMetadata] = useState(true);
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

  const batchCompress = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select images to compress.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    const compressed: { name: string; url: string; originalSize: number; compressedSize: number; format: string }[] = [];

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

            // Determine output format
            let mimeType = file.type;
            let extension = file.name.split('.').pop();
            let newName = file.name;

            if (outputFormat !== 'keep-original') {
              switch (outputFormat) {
                case 'jpeg':
                  mimeType = 'image/jpeg';
                  extension = 'jpg';
                  break;
                case 'png':
                  mimeType = 'image/png';
                  extension = 'png';
                  break;
                case 'webp':
                  mimeType = 'image/webp';
                  extension = 'webp';
                  break;
              }
              newName = file.name.replace(/\.[^/.]+$/, `.${extension}`);
            }

            const qualityValue = mimeType === 'image/png' ? 1.0 : quality[0] / 100;

            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                compressed.push({
                  name: newName,
                  url,
                  originalSize: file.size,
                  compressedSize: blob.size,
                  format: extension || 'unknown'
                });
              }
              resolve(null);
            }, mimeType, qualityValue);
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
        title: "Batch Compression Complete",
        description: `Processed ${compressed.length} images. Saved ${compressionRatio}% space.`
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
            Batch Compressor
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Compress multiple images at once with advanced settings for format conversion, resizing, and optimization.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>Select multiple images for batch compression</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop multiple images here or click to browse
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
                    <h3 className="font-medium text-gray-900">Selected Files ({selectedFiles.length}):</h3>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <ImageIcon className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label>Output Format</Label>
                        <Select value={outputFormat} onValueChange={setOutputFormat}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="keep-original">Keep Original Format</SelectItem>
                            <SelectItem value="jpeg">Convert to JPEG</SelectItem>
                            <SelectItem value="png">Convert to PNG</SelectItem>
                            <SelectItem value="webp">Convert to WebP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

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

                      <div className="space-y-4">
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
                            id="metadata"
                            checked={removeMetadata}
                            onCheckedChange={setRemoveMetadata}
                          />
                          <Label htmlFor="metadata">Remove metadata</Label>
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
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Settings className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Batch Processing Features</h4>
                        <ul className="text-sm text-blue-700 mt-1 space-y-1">
                          <li>• Process multiple images simultaneously</li>
                          <li>• Format conversion and quality adjustment</li>
                          <li>• Automatic resizing with aspect ratio preservation</li>
                          <li>• Metadata removal for privacy protection</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={batchCompress} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Processing...' : `Compress ${selectedFiles.length} Images`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {compressedImages.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Batch Compressed Images</CardTitle>
                  <CardDescription>Your processed images are ready for download</CardDescription>
                </div>
                <Button onClick={downloadAll}>
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {compressedImages.map((img, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ImageIcon className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{img.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(img.originalSize)} → {formatFileSize(img.compressedSize)}
                            <span className="text-green-600 ml-1">
                              ({((img.originalSize - img.compressedSize) / img.originalSize * 100).toFixed(0)}% saved)
                            </span>
                          </p>
                          <p className="text-xs text-blue-600">{img.format.toUpperCase()} format</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadImage(img.url, img.name)}
                      >
                        <Download className="h-3 w-3" />
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

export default BatchCompressor;
