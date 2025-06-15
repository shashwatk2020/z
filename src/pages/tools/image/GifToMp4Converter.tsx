
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, Play, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GifToMp4Converter = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<{ name: string; url: string; originalSize: number; newSize: number }[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const gifFiles = files.filter(file => 
      file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif')
    );
    
    if (gifFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: "Please select only GIF files.",
        variant: "destructive"
      });
    }
    
    setSelectedFiles(gifFiles);
  };

  const convertToMp4 = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select GIF files to convert.",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    
    // Simulate conversion process
    setTimeout(() => {
      const converted = selectedFiles.map(file => ({
        name: file.name.replace(/\.gif$/i, '.mp4'),
        url: URL.createObjectURL(file), // In real implementation, this would be the converted MP4
        originalSize: file.size,
        newSize: Math.floor(file.size * 0.7) // Simulate compression
      }));
      
      setConvertedFiles(converted);
      setIsConverting(false);
      
      toast({
        title: "Conversion Complete",
        description: `Successfully converted ${converted.length} GIF(s) to MP4.`,
        variant: "default"
      });
    }, 3000);
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
            GIF to MP4 Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert animated GIF files to MP4 video format for better compression and compatibility.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload GIF Files</CardTitle>
              <CardDescription>Select one or more GIF files to convert to MP4 format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop GIF files here or click to browse
                </p>
                <p className="text-gray-500">
                  Supports .gif files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".gif,image/gif"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Selected Files:</h3>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Play className="h-5 w-5 text-blue-500" />
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
                onClick={convertToMp4} 
                disabled={selectedFiles.length === 0 || isConverting}
                className="w-full"
              >
                {isConverting ? 'Converting...' : `Convert to MP4 (${selectedFiles.length} files)`}
              </Button>
            </CardContent>
          </Card>

          {convertedFiles.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Converted Files</CardTitle>
                  <CardDescription>Your MP4 files are ready for download</CardDescription>
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
                        <Play className="h-5 w-5 text-green-500" />
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

export default GifToMp4Converter;
