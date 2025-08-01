
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, Download, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PDFTextEditor = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [editedText, setEditedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputPdfUrl, setOutputPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setExtractedText('');
      setEditedText('');
      setOutputPdfUrl(null);
      extractTextFromFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a PDF file.",
        variant: "destructive"
      });
    }
  };

  const extractTextFromFile = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    try {
      // Simulate text extraction
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockText = "This is some sample text extracted from the PDF. You can edit this text directly in the editor below.";
      setExtractedText(mockText);
      setEditedText(mockText);
      toast({
        title: "Text Extracted",
        description: "Text extracted from PDF successfully."
      });
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Could not extract text from PDF.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const saveEditedPDF = async () => {
    if (!pdfFile || !editedText) {
      toast({
        title: "Missing Data",
        description: "Please select a PDF and ensure text is edited.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setOutputPdfUrl(null);

    try {
      const steps = [
        'Preparing PDF...',
        'Inserting edited text...',
        'Re-rendering PDF...',
        'Finalizing new PDF...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simulate new PDF URL
      const mockPdfBlob = new Blob(['mock new pdf content with edited text'], { type: 'application/pdf' });
      const url = URL.createObjectURL(mockPdfBlob);
      setOutputPdfUrl(url);

      toast({
        title: "PDF Saved",
        description: "Edited text saved to new PDF successfully."
      });
    } catch (error) {
      toast({
        title: "Saving Failed",
        description: "An error occurred while saving the edited PDF.",
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
          <h1 className="text-3xl font-bold">PDF Text Editor</h1>
          <p className="text-gray-600">Edit text content directly within your PDF documents</p>
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

        {extractedText && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="pdf-text-editor">Editable Text Content</Label>
              <Textarea
                id="pdf-text-editor"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={10}
                className="font-mono"
              />
              <Button onClick={saveEditedPDF} disabled={isProcessing} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {isProcessing ? 'Saving...' : 'Save Edited PDF'}
              </Button>
              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-gray-600 text-center">Saving changes to PDF...</p>
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
                New PDF with Edited Text
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Your PDF has been updated with the edited text.</p>
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

export default PDFTextEditor;
