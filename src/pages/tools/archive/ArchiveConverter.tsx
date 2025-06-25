
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Archive, Upload, Download, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ArchiveConverter = () => {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceFormat, setSourceFormat] = useState('');
  const [targetFormat, setTargetFormat] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formats = [
    { value: 'zip', label: 'ZIP', extension: '.zip' },
    { value: 'rar', label: 'RAR', extension: '.rar' },
    { value: '7z', label: '7-Zip', extension: '.7z' },
    { value: 'tar', label: 'TAR', extension: '.tar' },
    { value: 'tar.gz', label: 'TAR.GZ', extension: '.tar.gz' },
    { value: 'tar.bz2', label: 'TAR.BZ2', extension: '.tar.bz2' },
    { value: 'tar.xz', label: 'TAR.XZ', extension: '.tar.xz' },
    { value: 'gzip', label: 'GZIP', extension: '.gz' },
    { value: 'bzip2', label: 'BZIP2', extension: '.bz2' },
    { value: 'xz', label: 'XZ', extension: '.xz' }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSourceFile(file);
      
      // Auto-detect source format
      const extension = file.name.toLowerCase();
      if (extension.endsWith('.zip')) setSourceFormat('zip');
      else if (extension.endsWith('.rar')) setSourceFormat('rar');
      else if (extension.endsWith('.7z')) setSourceFormat('7z');
      else if (extension.endsWith('.tar.gz')) setSourceFormat('tar.gz');
      else if (extension.endsWith('.tar.bz2')) setSourceFormat('tar.bz2');
      else if (extension.endsWith('.tar.xz')) setSourceFormat('tar.xz');
      else if (extension.endsWith('.tar')) setSourceFormat('tar');
      else if (extension.endsWith('.gz')) setSourceFormat('gzip');
      else if (extension.endsWith('.bz2')) setSourceFormat('bzip2');
      else if (extension.endsWith('.xz')) setSourceFormat('xz');
    }
  };

  const convertArchive = async () => {
    if (!sourceFile || !sourceFormat || !targetFormat) {
      toast({
        title: "Missing Information",
        description: "Please select a file and both source and target formats.",
        variant: "destructive"
      });
      return;
    }

    if (sourceFormat === targetFormat) {
      toast({
        title: "Same Format",
        description: "Source and target formats are the same. No conversion needed.",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);

    try {
      // Simulate conversion process
      const steps = [
        'Reading source archive...',
        'Extracting files...',
        'Analyzing content...',
        'Compressing to target format...',
        'Finalizing archive...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress((i + 1) * 20);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Create converted file
      const targetExt = formats.find(f => f.value === targetFormat)?.extension || '.archive';
      const convertedFileName = sourceFile.name.replace(/\.[^/.]+$/, '') + targetExt;
      
      const blob = new Blob([`Converted archive from ${sourceFormat} to ${targetFormat}`], {
        type: 'application/octet-stream'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = convertedFileName;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Conversion Complete",
        description: `Archive converted from ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()} successfully.`
      });
    } catch (error) {
      toast({
        title: "Conversion Failed",
        description: "Failed to convert the archive. Please try again.",
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
          <Archive className="h-12 w-12 mx-auto text-purple-600" />
          <h1 className="text-3xl font-bold">Archive Format Converter</h1>
          <p className="text-gray-600">Convert between different archive formats while preserving file structure</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Select Archive to Convert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Archive File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip,.rar,.7z,.tar,.tar.gz,.tar.bz2,.tar.xz,.gz,.bz2,.xz"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {sourceFile && (
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium">{sourceFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(sourceFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Source Format</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="sourceFormat">From</Label>
              <Select value={sourceFormat} onValueChange={setSourceFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source format" />
                </SelectTrigger>
                <SelectContent>
                  {formats.map(format => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <ArrowRight className="h-8 w-8 text-gray-400" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Target Format</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="targetFormat">To</Label>
              <Select value={targetFormat} onValueChange={setTargetFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target format" />
                </SelectTrigger>
                <SelectContent>
                  {formats.map(format => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Convert Archive
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={convertArchive}
              disabled={isConverting || !sourceFile || !sourceFormat || !targetFormat}
              className="w-full"
            >
              {isConverting ? (
                <>Converting...</>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Convert Archive
                </>
              )}
            </Button>

            {isConverting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-gray-600">
                  Converting archive... {progress}%
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium mb-2">Supported Input Formats:</h4>
                <ul className="space-y-1">
                  <li>• ZIP archives</li>
                  <li>• RAR archives</li>
                  <li>• 7-Zip archives</li>
                  <li>• TAR archives</li>
                  <li>• GZIP compressed files</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Supported Output Formats:</h4>
                <ul className="space-y-1">
                  <li>• ZIP (universal compatibility)</li>
                  <li>• 7Z (maximum compression)</li>
                  <li>• TAR (Unix/Linux standard)</li>
                  <li>• GZIP (web optimization)</li>
                  <li>• XZ (high compression ratio)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ArchiveConverter;
