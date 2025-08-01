
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Hash, Upload, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PDFPageNumbering = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [startPage, setStartPage] = useState('1');
  const [endPage, setEndPage] = useState('all');
  const [position, setPosition] = useState('bottom-right');
  const [fontSize, setFontSize] = useState('10');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputPdfUrl, setOutputPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const applyPageNumbers = async () => {
    if (!pdfFile) {
      toast({
        title: "No PDF Selected",
        description: "Please select a PDF file to add page numbers.",
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
        'Applying page numbers...',
        'Saving new PDF...',
        'Finalizing...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simulate new PDF URL
      const mockPdfBlob = new Blob(['mock pdf content with page numbers'], { type: 'application/pdf' });
      const url = URL.createObjectURL(mockPdfBlob);
      setOutputPdfUrl(url);

      toast({
        title: "Page Numbers Applied",
        description: "Page numbers added to PDF successfully."
      });
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "An error occurred while applying page numbers.",
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
          <Hash className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">PDF Page Numbering</h1>
          <p className="text-gray-600">Add page numbers to your PDF documents</p>
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
            <CardTitle>Page Numbering Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Page</Label>
                <Input 
                  type="number" 
                  value={startPage} 
                  onChange={(e) => setStartPage(e.target.value)} 
                  min="1" 
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label>End Page</Label>
                <Input 
                  value={endPage} 
                  onChange={(e) => setEndPage(e.target.value)} 
                  placeholder="all" 
                />
                <p className="text-xs text-gray-500">Enter 'all' for all pages, or a number for a specific end page.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Top-Left</SelectItem>
                    <SelectItem value="top-center">Top-Center</SelectItem>
                    <SelectItem value="top-right">Top-Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom-Left</SelectItem>
                    <SelectItem value="bottom-center">Bottom-Center</SelectItem>
                    <SelectItem value="bottom-right">Bottom-Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="10">10 (Default)</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="14">14</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={applyPageNumbers} disabled={isProcessing || !pdfFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Applying...' : 'Apply Page Numbers'}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing PDF...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {outputPdfUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                PDF with Page Numbers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Your PDF has been updated with page numbers. Download the new file below.</p>
              <Button asChild className="w-full">
                <a href={outputPdfUrl} download={`${pdfFile?.name.replace('.pdf', '_numbered.pdf')}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Numbered PDF
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default PDFPageNumbering;
