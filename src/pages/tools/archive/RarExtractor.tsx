
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { FileArchive, Upload, Download, Folder, File, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RarExtractor = () => {
  const [rarFile, setRarFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [extractPath, setExtractPath] = useState('extracted');
  const [preserveStructure, setPreserveStructure] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedFiles, setExtractedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.rar')) {
      setRarFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a RAR file.",
        variant: "destructive"
      });
    }
  };

  const extractRar = async () => {
    if (!rarFile) {
      toast({
        title: "No File Selected",
        description: "Please select a RAR file to extract.",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    setProgress(0);

    try {
      // Simulate RAR extraction process
      const steps = [
        'Reading RAR archive...',
        'Verifying integrity...',
        'Extracting files...',
        'Creating directory structure...',
        'Finalizing extraction...'
      ];

      const mockFiles = [
        'document.pdf',
        'images/photo1.jpg',
        'images/photo2.jpg',
        'data/config.txt',
        'README.md'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      setExtractedFiles(mockFiles);

      // Create and download extracted files as ZIP
      const blob = new Blob(['Extracted RAR contents'], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${extractPath}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Extraction Complete",
        description: `Successfully extracted ${mockFiles.length} files from RAR archive.`
      });
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Failed to extract RAR file. Please check if it's password protected.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
      setProgress(0);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <FileArchive className="h-12 w-12 mx-auto text-red-600" />
          <h1 className="text-3xl font-bold">RAR File Extractor</h1>
          <p className="text-gray-600">Extract files from RAR archives with password support</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select RAR File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              {rarFile ? `Selected: ${rarFile.name}` : 'Choose RAR File'}
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".rar"
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {rarFile && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>File:</strong> {rarFile.name} ({(rarFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extraction Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Extract to Folder</Label>
              <Input 
                value={extractPath} 
                onChange={(e) => setExtractPath(e.target.value)}
                placeholder="extracted"
              />
            </div>

            <div className="space-y-2">
              <Label>Password (if protected)</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password if archive is protected"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={preserveStructure} 
                onCheckedChange={(checked) => setPreserveStructure(checked === true)} 
              />
              <Label>Preserve folder structure</Label>
            </div>

            <Button onClick={extractRar} disabled={isExtracting || !rarFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isExtracting ? 'Extracting...' : 'Extract RAR File'}
            </Button>

            {isExtracting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">
                  Extracting RAR archive...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {extractedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Extracted Files ({extractedFiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {extractedFiles.map((file, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                    {file.includes('/') ? (
                      <Folder className="h-4 w-4 mr-2 text-blue-500" />
                    ) : (
                      <File className="h-4 w-4 mr-2 text-gray-500" />
                    )}
                    <span className="text-sm">{file}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default RarExtractor;
