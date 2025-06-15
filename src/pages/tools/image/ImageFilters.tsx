
import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, Image as ImageIcon, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ImageFilters = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [filteredImage, setFilteredImage] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const filters = [
    { name: 'None', value: 'none', css: 'none' },
    { name: 'Grayscale', value: 'grayscale', css: 'grayscale(100%)' },
    { name: 'Sepia', value: 'sepia', css: 'sepia(100%)' },
    { name: 'Blur', value: 'blur', css: 'blur(3px)' },
    { name: 'Brightness', value: 'brightness', css: 'brightness(150%)' },
    { name: 'Contrast', value: 'contrast', css: 'contrast(150%)' },
    { name: 'Saturate', value: 'saturate', css: 'saturate(200%)' },
    { name: 'Hue Rotate', value: 'hue-rotate', css: 'hue-rotate(90deg)' },
    { name: 'Invert', value: 'invert', css: 'invert(100%)' },
    { name: 'Vintage', value: 'vintage', css: 'sepia(50%) contrast(120%) brightness(110%)' },
    { name: 'Cool', value: 'cool', css: 'hue-rotate(180deg) saturate(120%)' },
    { name: 'Warm', value: 'warm', css: 'hue-rotate(-30deg) saturate(120%) brightness(110%)' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setOriginalImage(url);
      setFilteredImage(null);
      setCurrentFilter('none');
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
    }
  };

  const applyFilter = async (filterValue: string) => {
    if (!selectedFile || !originalImage) {
      toast({
        title: "No File Selected",
        description: "Please select an image to apply filters.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setCurrentFilter(filterValue);

    try {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Apply CSS filter to canvas context
        const filter = filters.find(f => f.value === filterValue);
        if (filter && filter.css !== 'none') {
          ctx.filter = filter.css;
        } else {
          ctx.filter = 'none';
        }
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setFilteredImage(url);
            setIsProcessing(false);
            
            toast({
              title: "Filter Applied",
              description: `Successfully applied ${filter?.name || 'filter'} to your image.`
            });
          }
        }, selectedFile.type, 0.9);
      };

      img.src = originalImage;
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Filter Failed",
        description: "Failed to apply filter. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadImage = () => {
    if (filteredImage && selectedFile) {
      const filterName = filters.find(f => f.value === currentFilter)?.name || 'filtered';
      const a = document.createElement('a');
      a.href = filteredImage;
      a.download = `${filterName.toLowerCase()}_${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setFilteredImage(null);
    setCurrentFilter('none');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Filters
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Apply beautiful filters to your images to enhance their visual appeal.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Select an image file to apply filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop an image here or click to browse
                </p>
                <p className="text-gray-500">
                  Supports JPG, PNG, GIF, WebP, and more
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {selectedFile && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ImageIcon className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          Current filter: {filters.find(f => f.value === currentFilter)?.name || 'None'}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filters.map((filter) => (
                      <Button
                        key={filter.value}
                        onClick={() => applyFilter(filter.value)}
                        disabled={isProcessing}
                        variant={currentFilter === filter.value ? "default" : "outline"}
                        size="sm"
                        className="text-xs"
                      >
                        {filter.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {originalImage && (
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Original Image</CardTitle>
                  <CardDescription>Your uploaded image</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <img 
                      src={originalImage} 
                      alt="Original" 
                      className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>
                      {filters.find(f => f.value === currentFilter)?.name || 'No filter applied'}
                    </CardDescription>
                  </div>
                  {filteredImage && (
                    <Button onClick={downloadImage} size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <img 
                      src={filteredImage || originalImage} 
                      alt="Filtered" 
                      className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                      style={{ 
                        maxHeight: '300px',
                        filter: !filteredImage ? filters.find(f => f.value === currentFilter)?.css || 'none' : 'none'
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </Layout>
  );
};

export default ImageFilters;
