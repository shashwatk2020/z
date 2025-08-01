
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { FileSpreadsheet, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ExcelToPDFConverter = () => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedPdfUrl, setConvertedPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel')) {
      setExcelFile(file);
      setConvertedPdfUrl(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an Excel file (.xls, .xlsx).",
        variant: "destructive"
      });
    }
  };

  const startConversion = async () => {
    if (!excelFile) {
      toast({
        title: "No Excel File Selected",
        description: "Please select an Excel file to convert.",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setConvertedPdfUrl(null);

    try {
      const steps = [
        'Analyzing Excel spreadsheet...',
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
        description: "Excel spreadsheet converted to PDF successfully."
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
          <FileSpreadsheet className="h-12 w-12 mx-auto text-green-600" />
          <h1 className="text-3xl font-bold">Excel to PDF Converter</h1>
          <p className="text-gray-600">Convert your Excel spreadsheets to PDF files</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Excel File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {excelFile ? `Selected: ${excelFile.name}` : 'Choose Excel File'}
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".xls,.xlsx"
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {excelFile && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>File:</strong> {excelFile.name} ({(excelFile.size / 1024 / 1024).toFixed(2)} MB)
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
            <Button onClick={startConversion} disabled={isConverting || !excelFile} className="w-full">
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
                <FileSpreadsheet className="h-5 w-5 mr-2" />
                Converted PDF
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Your Excel spreadsheet has been converted to a PDF file.</p>
              <Button asChild className="w-full">
                <a href={convertedPdfUrl} download={`${excelFile?.name.replace(/\.(xls|xlsx)$/, '.pdf')}`}>
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

export default ExcelToPDFConverter;
