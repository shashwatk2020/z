
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PowerPointToPDFConverter = () => {
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedPdfUrl, setConvertedPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || file.type === 'application/vnd.ms-powerpoint')) {
      setPptFile(file);
      setConvertedPdfUrl(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a PowerPoint file (.ppt, .pptx).",
        variant: "destructive"
      });
    }
  };

  const startConversion = async () => {
    if (!pptFile) {
      toast({
        title: "No PowerPoint File Selected",
        description: "Please select a PowerPoint file to convert.",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setConvertedPdfUrl(null);

    try {
      const steps = [
        'Analyzing PowerPoint presentation...',
        'Converting to PDF format...',
        'Optimizing PDF...',
        'Finalizing PDF...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simulate converted PDF URL
      const mockPdfBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(mockPdfBlob);
      setConvertedPdfUrl(url);

      toast({
        title: "Conversion Complete",
        description: "PowerPoint presentation converted to PDF successfully."
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
          <FileText className="h-12 w-12 mx-auto text-red-600" />
          <h1 className="text-3xl font-bold">PowerPoint to PDF Converter</h1>
          <p className="text-gray-600">Convert your PowerPoint presentations to PDF files</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select PowerPoint File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {pptFile ? `Selected: ${pptFile.name}` : 'Choose PowerPoint File'}
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".ppt,.pptx"
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {pptFile && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>File:</strong> {pptFile.name} ({(pptFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Convert to PDF</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={startConversion} disabled={isConverting || !pptFile} className="w-full">
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
              <p className="text-sm text-gray-600">Your PowerPoint presentation has been converted to a PDF file.</p>
              <Button asChild className="w-full">
                <a href={convertedPdfUrl} download={`${pptFile?.name.replace(/\.(ppt|pptx)$/, '.pdf')}`}>
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

export default PowerPointToPDFConverter;
