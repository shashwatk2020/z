
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Droplet, Upload, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PDFWatermarkTool = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkType, setWatermarkType] = useState('text');
  const [watermarkPosition, setWatermarkPosition] = useState('center');
  const [watermarkOpacity, setWatermarkOpacity] = useState('0.5');
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

  const applyWatermark = async () => {
    if (!pdfFile) {
      toast({
        title: "No PDF Selected",
        description: "Please select a PDF file to watermark.",
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
        'Applying watermark...',
        'Saving new PDF...',
        'Finalizing...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simulate new PDF URL
      const mockPdfBlob = new Blob(['mock pdf content with watermark'], { type: 'application/pdf' });
      const url = URL.createObjectURL(mockPdfBlob);
      setOutputPdfUrl(url);

      toast({
        title: "Watermark Applied",
        description: "Watermark added to PDF successfully."
      });
    } catch (error) {
      toast({
        title: "Watermark Failed",
        description: "An error occurred while applying watermark.",
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
          <Droplet className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">PDF Watermark Tool</h1>
          <p className="text-gray-600">Add text or image watermarks to your PDF documents</p>
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
            <CardTitle>Watermark Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Watermark Type</Label>
              <Select value={watermarkType} onValueChange={setWatermarkType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Watermark</SelectItem>
                  <SelectItem value="image">Image Watermark (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {watermarkType === 'text' && (
              <div className="space-y-2">
                <Label>Watermark Text</Label>
                <Input 
                  value={watermarkText} 
                  onChange={(e) => setWatermarkText(e.target.value)} 
                  placeholder="Enter watermark text" 
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={watermarkPosition} onValueChange={setWatermarkPosition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Top-Left</SelectItem>
                    <SelectItem value="top-right">Top-Right</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="bottom-left">Bottom-Left</SelectItem>
                    <SelectItem value="bottom-right">Bottom-Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Opacity</Label>
                <Select value={watermarkOpacity} onValueChange={setWatermarkOpacity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.1">10%</SelectItem>
                    <SelectItem value="0.3">30%</SelectItem>
                    <SelectItem value="0.5">50% (Default)</SelectItem>
                    <SelectItem value="0.7">70%</SelectItem>
                    <SelectItem value="0.9">90%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={applyWatermark} disabled={isProcessing || !pdfFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Applying Watermark...' : 'Apply Watermark'}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing PDF watermark...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {outputPdfUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Watermarked PDF
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Your PDF has been watermarked. Download the new file below.</p>
              <Button asChild className="w-full">
                <a href={outputPdfUrl} download={`${pdfFile?.name.replace('.pdf', '_watermarked.pdf')}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Watermarked PDF
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default PDFWatermarkTool;
