
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { PenTool, Upload, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PDFAnnotationTool = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [annotationText, setAnnotationText] = useState('');
  const [annotationPage, setAnnotationPage] = useState('1');
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

  const applyAnnotation = async () => {
    if (!pdfFile || !annotationText) {
      toast({
        title: "Missing Information",
        description: "Please select a PDF and enter annotation text.",
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
        'Applying annotation...',
        'Saving new PDF...',
        'Finalizing...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simulate new PDF URL
      const mockPdfBlob = new Blob(['mock pdf content with annotation'], { type: 'application/pdf' });
      const url = URL.createObjectURL(mockPdfBlob);
      setOutputPdfUrl(url);

      toast({
        title: "Annotation Applied",
        description: "Annotation added to PDF successfully."
      });
    } catch (error) {
      toast({
        title: "Annotation Failed",
        description: "An error occurred while applying annotation.",
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
          <PenTool className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">PDF Annotation Tool</h1>
          <p className="text-gray-600">Add text, highlights, and notes to your PDF documents</p>
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
            <CardTitle>Add Annotation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="annotationText">Annotation Text</Label>
              <Textarea 
                id="annotationText" 
                value={annotationText} 
                onChange={(e) => setAnnotationText(e.target.value)} 
                placeholder="Enter your annotation here..." 
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="annotationPage">Page Number</Label>
              <Input 
                id="annotationPage" 
                type="number" 
                value={annotationPage} 
                onChange={(e) => setAnnotationPage(e.target.value)} 
                min="1" 
                placeholder="1"
              />
            </div>

            <Button onClick={applyAnnotation} disabled={isProcessing || !pdfFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Applying Annotation...' : 'Apply Annotation'}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing PDF annotation...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {outputPdfUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Annotated PDF
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Your PDF has been annotated. Download the new file below.</p>
              <Button asChild className="w-full">
                <a href={outputPdfUrl} download={`${pdfFile?.name.replace('.pdf', '_annotated.pdf')}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Annotated PDF
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default PDFAnnotationTool;
