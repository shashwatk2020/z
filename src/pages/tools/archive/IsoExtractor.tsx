
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Disc, Upload, Download, Folder, File, HardDrive, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const IsoExtractor = () => {
  const [isoFile, setIsoFile] = useState<File | null>(null);
  const [extractPath, setExtractPath] = useState('extracted_iso');
  const [preserveStructure, setPreserveStructure] = useState(true);
  const [extractBootSector, setExtractBootSector] = useState(false);
  const [verifyIntegrity, setVerifyIntegrity] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isoInfo, setIsoInfo] = useState<any>(null);
  const [extractedFiles, setExtractedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.iso')) {
      setIsoFile(file);
      
      // Simulate ISO analysis
      setIsoInfo({
        name: file.name,
        size: file.size,
        type: 'ISO 9660',
        created: new Date().toLocaleDateString(),
        system: 'Windows/Linux',
        bootable: Math.random() > 0.5,
        sessions: 1,
        tracks: Math.floor(Math.random() * 5) + 1
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an ISO file.",
        variant: "destructive"
      });
    }
  };

  const extractIso = async () => {
    if (!isoFile) {
      toast({
        title: "No File Selected",
        description: "Please select an ISO file to extract.",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    setProgress(0);

    try {
      const steps = [
        'Reading ISO structure...',
        'Verifying disc integrity...',
        'Extracting boot sector...',
        'Processing directories...',
        'Extracting files...',
        'Finalizing extraction...'
      ];

      const mockFiles = [
        'setup.exe',
        'autorun.inf',
        'drivers/audio.inf',
        'drivers/network.inf',
        'docs/readme.txt',
        'images/splash.bmp',
        'system/kernel.sys',
        'boot/bootmgr'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setExtractedFiles(mockFiles);

      const blob = new Blob(['Extracted ISO contents'], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${extractPath}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Extraction Complete",
        description: `Successfully extracted ${mockFiles.length} files from ISO image.`
      });
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Failed to extract ISO file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Disc className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">ISO File Extractor</h1>
          <p className="text-gray-600">Extract files from ISO disc images with advanced options</p>
        </div>

        <Tabs defaultValue="extract" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="extract">Extract ISO</TabsTrigger>
            <TabsTrigger value="info" disabled={!isoInfo}>ISO Information</TabsTrigger>
          </TabsList>

          <TabsContent value="extract" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select ISO File</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  {isoFile ? `Selected: ${isoFile.name}` : 'Choose ISO File'}
                </Button>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept=".iso"
                  onChange={handleFileSelect} 
                  className="hidden" 
                />

                {isoFile && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium">ISO Information</span>
                    </div>
                    <div className="mt-2 text-sm space-y-1">
                      <div><strong>Name:</strong> {isoFile.name}</div>
                      <div><strong>Size:</strong> {formatFileSize(isoFile.size)}</div>
                      <div><strong>Type:</strong> {isoInfo?.type}</div>
                      <div><strong>Bootable:</strong> {isoInfo?.bootable ? 'Yes' : 'No'}</div>
                    </div>
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
                    placeholder="extracted_iso"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={preserveStructure} 
                      onCheckedChange={(checked) => setPreserveStructure(checked === true)} 
                    />
                    <Label>Preserve directory structure</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={extractBootSector} 
                      onCheckedChange={(checked) => setExtractBootSector(checked === true)} 
                    />
                    <Label>Extract boot sector information</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={verifyIntegrity} 
                      onCheckedChange={(checked) => setVerifyIntegrity(checked === true)} 
                    />
                    <Label>Verify file integrity during extraction</Label>
                  </div>
                </div>

                <Button onClick={extractIso} disabled={isExtracting || !isoFile} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {isExtracting ? 'Extracting ISO...' : 'Extract ISO Files'}
                </Button>

                {isExtracting && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-gray-600 text-center">
                      Extracting ISO image...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            {isoInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    ISO Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div><strong>File System:</strong> {isoInfo.type}</div>
                    <div><strong>Size:</strong> {formatFileSize(isoInfo.size)}</div>
                    <div><strong>Created:</strong> {isoInfo.created}</div>
                    <div><strong>System:</strong> {isoInfo.system}</div>
                    <div><strong>Sessions:</strong> {isoInfo.sessions}</div>
                    <div><strong>Tracks:</strong> {isoInfo.tracks}</div>
                  </div>
                </CardContent>
              </Card>
            )}

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
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default IsoExtractor;
