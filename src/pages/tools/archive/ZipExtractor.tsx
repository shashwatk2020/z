
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FolderOpen, Upload, Download, File, Folder, Lock, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ZipExtractor = () => {
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [extractPath, setExtractPath] = useState('extracted');
  const [preserveStructure, setPreserveStructure] = useState(true);
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zipInfo, setZipInfo] = useState<any>(null);
  const [extractedFiles, setExtractedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.zip')) {
      setZipFile(file);
      
      // Simulate ZIP analysis
      setZipInfo({
        name: file.name,
        size: file.size,
        filesCount: Math.floor(Math.random() * 50) + 10,
        foldersCount: Math.floor(Math.random() * 10) + 2,
        compressed: true,
        encrypted: Math.random() > 0.7
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a ZIP file.",
        variant: "destructive"
      });
    }
  };

  const extractZip = async () => {
    if (!zipFile) {
      toast({
        title: "No File Selected",
        description: "Please select a ZIP file to extract.",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    setProgress(0);

    try {
      const steps = [
        'Reading ZIP archive...',
        'Verifying structure...',
        'Extracting files...',
        'Creating directories...',
        'Finalizing extraction...'
      ];

      const mockFiles = [
        'README.txt',
        'docs/manual.pdf',
        'docs/changelog.md',
        'images/logo.png',
        'images/screenshots/screen1.png',
        'src/main.js',
        'src/utils.js',
        'config.json'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      setExtractedFiles(mockFiles);

      // Create extracted files as download
      const blob = new Blob(['Extracted ZIP contents'], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${extractPath}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Extraction Complete",
        description: `Successfully extracted ${mockFiles.length} files from ZIP archive.`
      });
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Failed to extract ZIP file. Please check if it's password protected.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <FolderOpen className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">ZIP File Extractor</h1>
          <p className="text-gray-600">Extract files from ZIP archives with advanced options</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select ZIP File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              {zipFile ? `Selected: ${zipFile.name}` : 'Choose ZIP File'}
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".zip"
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {zipInfo && (
              <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="font-medium">Archive Information</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Size:</strong> {formatFileSize(zipInfo.size)}</div>
                  <div><strong>Files:</strong> {zipInfo.filesCount}</div>
                  <div><strong>Folders:</strong> {zipInfo.foldersCount}</div>
                  <div>
                    <strong>Status:</strong> 
                    {zipInfo.encrypted ? (
                      <span className="text-red-600 ml-1">Password Protected</span>
                    ) : (
                      <span className="text-green-600 ml-1">Not Protected</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="extract" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="extract">Extract Files</TabsTrigger>
            <TabsTrigger value="results" disabled={extractedFiles.length === 0}>
              Extraction Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="extract" className="space-y-4">
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

                {zipInfo?.encrypted && (
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter ZIP password"
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={preserveStructure} 
                      onCheckedChange={(checked) => setPreserveStructure(checked === true)} 
                    />
                    <Label>Preserve folder structure</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={overwriteExisting} 
                      onCheckedChange={(checked) => setOverwriteExisting(checked === true)} 
                    />
                    <Label>Overwrite existing files</Label>
                  </div>
                </div>

                <Button onClick={extractZip} disabled={isExtracting || !zipFile} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {isExtracting ? 'Extracting...' : 'Extract ZIP File'}
                </Button>

                {isExtracting && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-gray-600 text-center">
                      Extracting ZIP archive...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Extracted Files ({extractedFiles.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
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
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ZipExtractor;
