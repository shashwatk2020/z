
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, Download, Crop, RotateCcw, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PDFPageEditor = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputPdfUrl, setOutputPdfUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setOutputPdfUrl(null);
      // Simulate PDF loading and page count
      setTimeout(() => {
        setTotalPages(Math.floor(Math.random() * 10) + 3); // 3 to 12 pages
        setCurrentPage(1);
      }, 500);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a PDF file.",
        variant: "destructive"
      });
    }
  };

  const applyChanges = async () => {
    if (!pdfFile) {
      toast({
        title: "No PDF Selected",
        description: "Please select a PDF file to edit.",
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
        'Applying page edits...',
        'Re-rendering PDF...',
        'Finalizing new PDF...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simulate new PDF URL
      const mockPdfBlob = new Blob(['mock new pdf content with page edits'], { type: 'application/pdf' });
      const url = URL.createObjectURL(mockPdfBlob);
      setOutputPdfUrl(url);

      toast({
        title: "Changes Applied",
        description: "PDF pages edited successfully."
      });
    } catch (error) {
      toast({
        title: "Editing Failed",
        description: "An error occurred while editing PDF pages.",
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
          <FileText className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">PDF Page Editor</h1>
          <p className="text-gray-600">Rotate, crop, or delete individual pages in your PDF</p>
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
                <p className="text-sm mt-1">Pages: {totalPages}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {pdfFile && (
          <Card>
            <CardHeader>
              <CardTitle>Page Editing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="currentPage">Edit Page:</Label>
                <Input 
                  id="currentPage" 
                  type="number" 
                  value={currentPage} 
                  onChange={(e) => setCurrentPage(Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1)))}
                  min="1" 
                  max={totalPages}
                  className="w-24"
                />
                <span>of {totalPages}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Rotate Page
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Crop className="h-4 w-4 mr-2" />
                  Crop Page
                </Button>
                <Button variant="destructive" className="flex items-center">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Page
                </Button>
              </div>

              <Button onClick={applyChanges} disabled={isProcessing} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                {isProcessing ? 'Applying Changes...' : 'Apply Changes & Download PDF'}
              </Button>

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-gray-600 text-center">Processing PDF pages...</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {outputPdfUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Edited PDF
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Your PDF has been edited. Download the new file below.</p>
              <Button asChild className="w-full">
                <a href={outputPdfUrl} download={`${pdfFile?.name.replace('.pdf', '_edited.pdf')}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Edited PDF
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default PDFPageEditor;
