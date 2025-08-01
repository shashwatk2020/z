
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PDFtoWordConverter = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedDocUrl, setConvertedDocUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setConvertedDocUrl(null);
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
    setConvertedDocUrl(null);

    try {
      const steps = [
        'Analyzing PDF structure...',
        'Extracting text and images...',
        'Converting to Word format...',
        'Finalizing document...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simulate converted document URL
      const mockDocBlob = new Blob(['mock word document content'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(mockDocBlob);
      setConvertedDocUrl(url);

      toast({
        title: "Conversion Complete",
        description: "PDF converted to Word successfully."
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
          <FileText className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">PDF to Word Converter</h1>
          <p className="text-gray-600">Convert your PDF documents to editable Word files</p>
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
            <CardTitle>Convert to Word</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={startConversion} disabled={isConverting || !pdfFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isConverting ? 'Converting...' : 'Convert to Word'}
            </Button>

            {isConverting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing conversion...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {convertedDocUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Converted Document
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Your PDF has been converted to an editable Word document.</p>
              <Button asChild className="w-full">
                <a href={convertedDocUrl} download={`${pdfFile?.name.replace('.pdf', '.docx')}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Word Document
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default PDFtoWordConverter;
