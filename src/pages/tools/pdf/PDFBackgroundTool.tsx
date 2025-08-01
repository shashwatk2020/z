
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Palette, Upload, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PDFBackgroundTool = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [backgroundType, setBackgroundType] = useState('color');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputPdfUrl, setOutputPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setOutputPdfUrl(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a PDF file.",
        variant: "destructive"
      });
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setBackgroundImage(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive"
      });
    }
  };

  const applyBackground = async () => {
    if (!pdfFile) {
      toast({
        title: "No PDF Selected",
        description: "Please select a PDF file to apply background.",
        variant: "destructive"
      });
      return;
    }

    if (backgroundType === 'image' && !backgroundImage) {
      toast({
        title: "No Image Selected",
        description: "Please select a background image.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setOutputPdfUrl(null);

    try {
      const steps = [
        'Loading PDF...',
        'Applying background...',
        'Saving new PDF...',
        'Finalizing...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simulate new PDF URL
      const mockPdfBlob = new Blob(['mock pdf content with background'], { type: 'application/pdf' });
      const url = URL.createObjectURL(mockPdfBlob);
      setOutputPdfUrl(url);

      toast({
        title: "Background Applied",
        description: "Background added to PDF successfully."
      });
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "An error occurred while applying background.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Palette className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">PDF Background Tool</h1>
          <p className="text-gray-600">Add custom backgrounds to your PDF documents</p>
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
            <CardTitle>Background Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Background Type</Label>
              <Select value={backgroundType} onValueChange={setBackgroundType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="color">Solid Color</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {backgroundType === 'color' && (
              <div className="space-y-2">
                <Label>Background Color</Label>
                <Input 
                  type="color" 
                  value={backgroundColor} 
                  onChange={(e) => setBackgroundColor(e.target.value)} 
                />
              </div>
            )}

            {backgroundType === 'image' && (
              <div className="space-y-2">
                <Label>Background Image</Label>
                <Button onClick={() => imageInputRef.current?.click()} variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  {backgroundImage ? `Selected: ${backgroundImage.name}` : 'Choose Image File'}
                </Button>
                <input 
                  ref={imageInputRef} 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageSelect} 
                  className="hidden" 
                />
              </div>
            )}

            <Button onClick={applyBackground} disabled={isProcessing || !pdfFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Applying Background...' : 'Apply Background'}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing PDF background...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {outputPdfUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                PDF with Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Your PDF has been updated with the new background. Download the new file below.</p>
              <Button asChild className="w-full">
                <a href={outputPdfUrl} download={`${pdfFile?.name.replace('.pdf', '_background.pdf')}`}>
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

export default PDFBackgroundTool;
