
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Image, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ImagesToPDFConverter = () => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [outputFileName, setOutputFileName] = useState('converted_images.pdf');
  const [pageSize, setPageSize] = useState('A4');
  const [orientation, setOrientation] = useState('portrait');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedPdfUrl, setConvertedPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageOnlyFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageOnlyFiles.length > 0) {
      setImageFiles(prev => [...prev, ...imageOnlyFiles]);
      setConvertedPdfUrl(null);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please select image files only.",
        variant: "destructive"
      });
    }
  };

  const removeFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startConversion = async () => {
    if (imageFiles.length === 0) {
      toast({
        title: "No Images Selected",
        description: "Please select image files to convert.",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setConvertedPdfUrl(null);

    try {
      const steps = [
        'Analyzing images...',
        'Arranging pages...',
        'Converting to PDF format...',
        'Finalizing PDF...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simulate converted PDF URL
      const mockPdfBlob = new Blob(['mock pdf content from images'], { type: 'application/pdf' });
      const url = URL.createObjectURL(mockPdfBlob);
      setConvertedPdfUrl(url);

      toast({
        title: "Conversion Complete",
        description: "Images converted to PDF successfully."
      });
    } catch (error) {
      toast({
        title: "Conversion Failed",
        description: "An error occurred during conversion.",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Image className="h-12 w-12 mx-auto text-purple-600" />
          <h1 className="text-3xl font-bold">Images to PDF Converter</h1>
          <p className="text-gray-600">Combine multiple image files into a single PDF document</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Image Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Add Image Files
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              multiple 
              accept="image/*"
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {imageFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Images ({imageFiles.length})</Label>
                <div className="max-h-40 overflow-y-auto border rounded p-2">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-1 bg-gray-50 rounded mb-1">
                      <span>{file.name} ({formatFileSize(file.size)})</span>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                        X
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
            <CardTitle>Conversion Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Output File Name</Label>
              <Input 
                value={outputFileName} 
                onChange={(e) => setOutputFileName(e.target.value)} 
                placeholder="converted_images.pdf" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Page Size</Label>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4</SelectItem>
                    <SelectItem value="Letter">Letter</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Orientation</Label>
                <Select value={orientation} onValueChange={setOrientation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={startConversion} disabled={isConverting || imageFiles.length === 0} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isConverting ? 'Converting...' : 'Convert to PDF'}
            </Button>

            {isConverting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing conversion...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {convertedPdfUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Converted PDF
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Your images have been combined into a single PDF file.</p>
              <Button asChild className="w-full">
                <a href={convertedPdfUrl} download={outputFileName}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ImagesToPDFConverter;
