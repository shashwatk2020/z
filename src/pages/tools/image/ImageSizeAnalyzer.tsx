
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, X, BarChart3, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ImageSizeAnalyzer = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
    setAnalysisResults([]);
  };

  const analyzeImages = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select images to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    const results: any[] = [];

    try {
      for (const file of selectedFiles) {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        await new Promise((resolve) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            
            // Calculate color analysis
            let totalPixels = 0;
            let redSum = 0, greenSum = 0, blueSum = 0;
            const colorCounts: { [key: string]: number } = {};
            
            for (let i = 0; i < pixels.length; i += 4) {
              const r = pixels[i];
              const g = pixels[i + 1];
              const b = pixels[i + 2];
              const a = pixels[i + 3];
              
              if (a > 0) {
                totalPixels++;
                redSum += r;
                greenSum += g;
                blueSum += b;
                
                const colorKey = `${Math.floor(r/32)*32},${Math.floor(g/32)*32},${Math.floor(b/32)*32}`;
                colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
              }
            }

            const aspectRatio = img.width / img.height;
            const megapixels = (img.width * img.height) / 1000000;
            const averageColor = {
              r: Math.round(redSum / totalPixels),
              g: Math.round(greenSum / totalPixels),
              b: Math.round(blueSum / totalPixels)
            };

            // Determine image category
            let category = 'Unknown';
            if (aspectRatio > 1.7) category = 'Landscape';
            else if (aspectRatio < 0.6) category = 'Portrait';
            else if (Math.abs(aspectRatio - 1) < 0.1) category = 'Square';
            else category = 'Standard';

            // Calculate compression efficiency
            const bytesPerPixel = file.size / (img.width * img.height);
            let compressionEfficiency = 'Good';
            if (bytesPerPixel > 3) compressionEfficiency = 'Poor';
            else if (bytesPerPixel > 1.5) compressionEfficiency = 'Fair';
            else if (bytesPerPixel < 0.5) compressionEfficiency = 'Excellent';

            results.push({
              name: file.name,
              fileSize: file.size,
              width: img.width,
              height: img.height,
              aspectRatio: aspectRatio.toFixed(2),
              megapixels: megapixels.toFixed(2),
              format: file.type,
              averageColor,
              category,
              bytesPerPixel: bytesPerPixel.toFixed(2),
              compressionEfficiency,
              totalPixels: img.width * img.height,
              dominantColors: Object.keys(colorCounts).slice(0, 5)
            });
            resolve(null);
          };
          img.src = URL.createObjectURL(file);
        });
      }

      setAnalysisResults(results);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Analyzed ${results.length} images successfully.`
      });
    } catch (error) {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze images. Please try again.",
        variant: "destructive"
      });
    }
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Size Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive analysis of image dimensions, file sizes, compression efficiency, and visual properties.
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Images for Analysis</CardTitle>
              <CardDescription>Select one or more images to analyze their properties</CardDescription>
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
                  Supports JPG, PNG, WebP, GIF, and more
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
                            <p className="text-sm text-gray-500">{formatFileSize(file.size)} • {file.type}</p>
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

                  <Button 
                    onClick={analyzeImages} 
                    disabled={isAnalyzing}
                    className="w-full"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {isAnalyzing ? 'Analyzing...' : `Analyze ${selectedFiles.length} Images`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {analysisResults.length > 0 && (
            <div className="space-y-6">
              {analysisResults.map((result, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{result.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-500">{result.category}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Dimensions</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-500">Size:</span> {result.width} × {result.height}px</p>
                          <p><span className="text-gray-500">Aspect Ratio:</span> {result.aspectRatio}:1</p>
                          <p><span className="text-gray-500">Megapixels:</span> {result.megapixels} MP</p>
                          <p><span className="text-gray-500">Total Pixels:</span> {result.totalPixels.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">File Properties</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-500">Size:</span> {formatFileSize(result.fileSize)}</p>
                          <p><span className="text-gray-500">Format:</span> {result.format}</p>
                          <p><span className="text-gray-500">Bytes/Pixel:</span> {result.bytesPerPixel}</p>
                          <p><span className="text-gray-500">Compression:</span> 
                            <span className={`ml-1 ${
                              result.compressionEfficiency === 'Excellent' ? 'text-green-600' :
                              result.compressionEfficiency === 'Good' ? 'text-blue-600' :
                              result.compressionEfficiency === 'Fair' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {result.compressionEfficiency}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Color Analysis</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-500">Average Color:</span></p>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ 
                                backgroundColor: `rgb(${result.averageColor.r}, ${result.averageColor.g}, ${result.averageColor.b})` 
                              }}
                            />
                            <span>RGB({result.averageColor.r}, {result.averageColor.g}, {result.averageColor.b})</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Recommendations</h4>
                        <div className="space-y-2 text-sm">
                          {result.compressionEfficiency === 'Poor' && (
                            <p className="text-red-600">• Consider compressing for web use</p>
                          )}
                          {result.megapixels > 10 && (
                            <p className="text-yellow-600">• High resolution - good for print</p>
                          )}
                          {result.aspectRatio === '1.00' && (
                            <p className="text-blue-600">• Perfect for social media profiles</p>
                          )}
                          {parseFloat(result.aspectRatio) > 1.5 && (
                            <p className="text-green-600">• Great for landscape display</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ImageSizeAnalyzer;
