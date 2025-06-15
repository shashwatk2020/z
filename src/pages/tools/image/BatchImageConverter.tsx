
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Download, Image as ImageIcon, X, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BatchImageConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<{ name: string; url: string; originalSize: number; newSize: number }[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [quality, setQuality] = useState([85]);
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
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
  };

  const convertImages = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select image files to convert.",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    const converted: { name: string; url: string; originalSize: number; newSize: number }[] = [];

    for (const file of selectedFiles) {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        await new Promise((resolve, reject) => {
          img.onload = () => {
            let targetWidth = img.width;
            let targetHeight = img.height;

            if (resizeEnabled && width && height) {
              targetWidth = parseInt(width);
              targetHeight = parseInt(height);

              if (maintainAspectRatio) {
                const aspectRatio = img.width / img.height;
                if (targetWidth / targetHeight > aspectRatio) {
                  targetWidth = targetHeight * aspectRatio;
                } else {
                  targetHeight = targetWidth / aspectRatio;
                }
              }
            }

            canvas.width = targetWidth;
            canvas.height = targetHeight;
            
            if (ctx) {
              if (outputFormat === 'jpeg') {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
              }
              ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            }
            
            const mimeType = outputFormat === 'png' ? 'image/png' : 
                           outputFormat === 'webp' ? 'image/webp' : 'image/jpeg';
            const extension = outputFormat === 'png' ? '.png' : 
                            outputFormat === 'webp' ? '.webp' : '.jpg';
            
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const fileName = file.name.replace(/\.[^/.]+$/, extension);
                converted.push({
                  name: fileName,
                  url,
                  originalSize: file.size,
                  newSize: blob.size
                });
                resolve(void 0);
              } else {
                reject(new Error('Conversion failed'));
              }
            }, mimeType, quality[0] / 100);
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
      } catch (error) {
        console.error('Error converting file:', file.name, error);
        toast({
          title: "Conversion Error",
          description: `Failed to convert ${file.name}`,
          variant: "destructive"
        });
      }
    }

    setConvertedFiles(converted);
    setIsConverting(false);
    
    if (converted.length > 0) {
      toast({
        title: "Batch Conversion Complete",
        description: `Successfully converted ${converted.length} file(s) to ${outputFormat.toUpperCase()}.`
      });
    }
  };

  const downloadFile = (url: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    convertedFiles.forEach(file => {
      downloadFile(file.url, file.name);
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
            Batch Image Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert multiple images at once with customizable format, quality, and resize options.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image Files</CardTitle>
              <CardDescription>Select multiple image files for batch conversion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop image files here or click to browse
                </p>
                <p className="text-gray-500">
                  Supports all common image formats
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
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Selected Files ({selectedFiles.length}):</h3>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <ImageIcon className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
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
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Conversion Settings</span>
              </CardTitle>
              <CardDescription>Configure output format, quality, and resize options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quality: {quality[0]}%</Label>
                  <Slider
                    value={quality}
                    onValueChange={setQuality}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                    disabled={outputFormat === 'png'}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="resize"
                    checked={resizeEnabled}
                    onCheckedChange={(checked) => setResizeEnabled(checked as boolean)}
                  />
                  <Label htmlFor="resize">Enable resizing</Label>
                </div>

                {resizeEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label>Width (px)</Label>
                      <Input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height (px)</Label>
                      <Input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>&nbsp;</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="aspectRatio"
                          checked={maintainAspectRatio}
                          onCheckedChange={(checked) => setMaintainAspectRatio(checked as boolean)}
                        />
                        <Label htmlFor="aspectRatio" className="text-sm">Maintain aspect ratio</Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                onClick={convertImages} 
                disabled={selectedFiles.length === 0 || isConverting}
                className="w-full"
              >
                {isConverting ? 'Converting...' : `Convert ${selectedFiles.length} files to ${outputFormat.toUpperCase()}`}
              </Button>
            </CardContent>
          </Card>

          {convertedFiles.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Converted Files</CardTitle>
                  <CardDescription>Your converted files are ready for download</CardDescription>
                </div>
                <Button onClick={downloadAll}>
                  <Download className="h-4 w-4 mr-2" />
                  Download All ({convertedFiles.length})
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {convertedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ImageIcon className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.originalSize)} → {formatFileSize(file.newSize)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(file.url, file.name)}
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

export default BatchImageConverter;
