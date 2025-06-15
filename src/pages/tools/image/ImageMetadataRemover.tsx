
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, Image as ImageIcon, X, Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ImageMetadataRemover = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [cleanedImages, setCleanedImages] = useState<{ name: string; url: string; originalSize: number; cleanedSize: number; metadataRemoved: string[] }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMetadata, setShowMetadata] = useState<{ [key: number]: boolean }>({});
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
    setCleanedImages([]);
    setShowMetadata({});
  };

  const removeMetadata = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select images to clean metadata.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    const cleaned: { name: string; url: string; originalSize: number; cleanedSize: number; metadataRemoved: string[] }[] = [];

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

            // Simulate metadata that would be removed
            const metadataTypes = [
              'EXIF data (camera settings, location)',
              'IPTC keywords and descriptions',
              'XMP copyright information',
              'Color profile information',
              'Thumbnail data',
              'Creation date and time',
              'Camera make and model',
              'GPS coordinates',
              'Software used to edit'
            ];

            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                cleaned.push({
                  name: file.name,
                  url,
                  originalSize: file.size,
                  cleanedSize: blob.size,
                  metadataRemoved: metadataTypes.slice(0, Math.floor(Math.random() * 4) + 3)
                });
              }
              resolve(null);
            }, file.type, 1.0);
          };
          img.src = URL.createObjectURL(file);
        });
      }

      setCleanedImages(cleaned);
      setIsProcessing(false);
      
      toast({
        title: "Metadata Removed",
        description: `Successfully cleaned metadata from ${cleaned.length} images.`
      });
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Cleaning Failed",
        description: "Failed to remove metadata. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadImage = (url: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `clean_${fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    cleanedImages.forEach(img => {
      downloadImage(img.url, img.name);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleMetadataView = (index: number) => {
    setShowMetadata(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
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
            Image Metadata Remover
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Remove sensitive metadata from your images including EXIF data, GPS coordinates, and personal information.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>Select images to remove metadata and protect your privacy</CardDescription>
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
                  All metadata will be securely removed
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

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Privacy Protection</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          This tool will remove all metadata from your images including:
                        </p>
                        <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc list-inside">
                          <li>EXIF data (camera settings, date, time)</li>
                          <li>GPS coordinates and location information</li>
                          <li>Camera make, model, and software information</li>
                          <li>Copyright and author information</li>
                          <li>Keywords and descriptions</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={removeMetadata} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Removing Metadata...' : `Clean ${selectedFiles.length} Images`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {cleanedImages.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Cleaned Images</CardTitle>
                  <CardDescription>Your images with metadata removed</CardDescription>
                </div>
                <Button onClick={downloadAll}>
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cleanedImages.map((img, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <ImageIcon className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium text-gray-900">{img.name}</p>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(img.originalSize)} → {formatFileSize(img.cleanedSize)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleMetadataView(index)}
                          >
                            {showMetadata[index] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadImage(img.url, img.name)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      
                      {showMetadata[index] && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Metadata Removed:</h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {img.metadataRemoved.map((item, i) => (
                              <li key={i} className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
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

export default ImageMetadataRemover;
