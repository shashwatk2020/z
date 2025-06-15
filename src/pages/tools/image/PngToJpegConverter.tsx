
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Upload, Download, Image as ImageIcon, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PngToJpegConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<{ name: string; url: string; originalSize: number; newSize: number }[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [quality, setQuality] = useState([85]);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const pngFiles = files.filter(file => 
      file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')
    );
    
    if (pngFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: "Please select only PNG files.",
        variant: "destructive"
      });
    }
    
    setSelectedFiles(pngFiles);
  };

  const convertToJpeg = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select PNG files to convert.",
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
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Fill with background color for transparency
            if (ctx) {
              ctx.fillStyle = backgroundColor;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
            }
            
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const fileName = file.name.replace(/\.png$/i, '.jpg');
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
            }, 'image/jpeg', quality[0] / 100);
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
        title: "Conversion Complete",
        description: `Successfully converted ${converted.length} file(s) to JPEG.`
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
            PNG to JPEG Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert PNG images to JPEG format with adjustable quality and background color settings.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload PNG Files</CardTitle>
              <CardDescription>Select one or more PNG files to convert to JPEG format</CardDescription>
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
                  Supports .png files
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Quality: {quality[0]}%</Label>
                  <Slider
                    value={quality}
                    onValueChange={setQuality}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Background Color (for transparency)</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <span className="text-sm text-gray-600">{backgroundColor}</span>
                  </div>
                </div>
              </div>

              {selectedFiles.length > 0 && (
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
              )}

              <Button 
                onClick={convertToJpeg} 
                disabled={selectedFiles.length === 0 || isConverting}
                className="w-full"
              >
                {isConverting ? 'Converting...' : `Convert to JPEG (${selectedFiles.length} files)`}
              </Button>
            </CardContent>
          </Card>

          {convertedFiles.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Converted Files</CardTitle>
                  <CardDescription>Your JPEG files are ready for download</CardDescription>
                </div>
                <Button onClick={downloadAll}>
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {convertedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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

export default PngToJpegConverter;
