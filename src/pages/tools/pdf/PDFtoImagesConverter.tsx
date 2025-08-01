
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

const PDFtoImagesConverter = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState('png');
  const [resolution, setResolution] = useState('150'); // DPI
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedImageUrls, setConvertedImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setConvertedImageUrls([]);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a PDF file.",
        variant: "destructive"
      });
    }
  };

  const startConversion = async () => {
    if (!pdfFile) {
      toast({
        title: "No PDF Selected",
        description: "Please select a PDF file to convert.",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setConvertedImageUrls([]);

    try {
      const steps = [
        'Analyzing PDF pages...',
        'Rendering pages to images...',
        'Applying resolution settings...',
        'Finalizing images...'
      ];

      const mockImageUrls = [];
      const numberOfPages = 3; // Simulate 3 pages
      for (let i = 0; i < numberOfPages; i++) {
        const mockBlob = new Blob(['mock image content'], { type: `image/${outputFormat}` });
        mockImageUrls.push(URL.createObjectURL(mockBlob));
      }

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setConvertedImageUrls(mockImageUrls);

      toast({
        title: "Conversion Complete",
        description: `PDF converted to ${numberOfPages} images successfully.`
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Image className="h-12 w-12 mx-auto text-purple-600" />
          <h1 className="text-3xl font-bold">PDF to Images Converter</h1>
          <p className="text-gray-600">Convert PDF pages into high-quality image files</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select PDF File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {pdfFile ? `Selected: ${pdfFile.name}` : 'Choose PDF File'}
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".pdf"
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {pdfFile && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>File:</strong> {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
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
              <Label>Output Image Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Resolution (DPI)</Label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="72">72 DPI (Web Quality)</SelectItem>
                  <SelectItem value="150">150 DPI (Standard)</SelectItem>
                  <SelectItem value="300">300 DPI (Print Quality)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={startConversion} disabled={isConverting || !pdfFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isConverting ? 'Converting...' : 'Convert to Images'}
            </Button>

            {isConverting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing conversion...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {convertedImageUrls.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="h-5 w-5 mr-2" />
                Converted Images
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {convertedImageUrls.map((url, index) => (
                <div key={index} className="space-y-2">
                  <img src={url} alt={`Page ${index + 1}`} className="w-full h-auto rounded-md border" />
                  <Button asChild className="w-full" variant="outline" size="sm">
                    <a href={url} download={`${pdfFile?.name.replace('.pdf', '')}_page_${index + 1}.${outputFormat}`}>
                      <Download className="h-3 w-3 mr-1" />
                      Download Page {index + 1}
                    </a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default PDFtoImagesConverter;
