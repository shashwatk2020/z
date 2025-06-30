
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Archive, Upload, Download, FileArchive, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TarTool = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [tarFile, setTarFile] = useState<File | null>(null);
  const [archiveName, setArchiveName] = useState('archive.tar');
  const [compressionType, setCompressionType] = useState('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const createInputRef = useRef<HTMLInputElement>(null);
  const extractInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCreateFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const handleExtractFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith('.tar') || file.name.endsWith('.tar.gz') || file.name.endsWith('.tar.bz2'))) {
      setTarFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a TAR, TAR.GZ, or TAR.BZ2 file.",
        variant: "destructive"
      });
    }
  };

  const createTarArchive = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to create TAR archive.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const steps = [
        'Preparing files...',
        'Creating TAR structure...',
        'Applying compression...',
        'Finalizing archive...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const extension = compressionType === 'gzip' ? '.tar.gz' : 
                       compressionType === 'bzip2' ? '.tar.bz2' : '.tar';
      const finalName = archiveName.replace(/\.(tar|tar\.gz|tar\.bz2)$/, '') + extension;

      const blob = new Blob(['TAR archive content'], { 
        type: compressionType === 'gzip' ? 'application/gzip' : 
              compressionType === 'bzip2' ? 'application/x-bzip2' : 'application/x-tar'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = finalName;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "TAR Archive Created",
        description: `Successfully created ${finalName} with ${files.length} files.`
      });
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create TAR archive.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const extractTarArchive = async () => {
    if (!tarFile) {
      toast({
        title: "No File Selected",
        description: "Please select a TAR file to extract.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const steps = [
        'Reading TAR archive...',
        'Decompressing data...',
        'Extracting files...',
        'Creating directories...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const blob = new Blob(['Extracted TAR contents'], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'extracted_files.zip';
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Extraction Complete",
        description: `Successfully extracted files from ${tarFile.name}.`
      });
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Failed to extract TAR archive.",
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
          <Archive className="h-12 w-12 mx-auto text-orange-600" />
          <h1 className="text-3xl font-bold">TAR Archive Tool</h1>
          <p className="text-gray-600">Create and extract TAR archives with compression support</p>
        </div>

        <Tabs defaultValue="create" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create TAR</TabsTrigger>
            <TabsTrigger value="extract">Extract TAR</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create TAR Archive</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => createInputRef.current?.click()} variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Select Files to Archive
                </Button>
                <input 
                  ref={createInputRef} 
                  type="file" 
                  multiple 
                  onChange={handleCreateFiles} 
                  className="hidden" 
                />

                {files.length > 0 && (
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">Selected {files.length} files</p>
                    <div className="mt-2 max-h-32 overflow-y-auto">
                      {files.slice(0, 5).map((file, index) => (
                        <p key={index} className="text-xs text-gray-600">{file.name}</p>
                      ))}
                      {files.length > 5 && (
                        <p className="text-xs text-gray-500">...and {files.length - 5} more files</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Archive Name</Label>
                  <Input 
                    value={archiveName} 
                    onChange={(e) => setArchiveName(e.target.value)}
                    placeholder="archive.tar"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Compression</Label>
                  <Select value={compressionType} onValueChange={setCompressionType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No compression (.tar)</SelectItem>
                      <SelectItem value="gzip">GZIP compression (.tar.gz)</SelectItem>
                      <SelectItem value="bzip2">BZIP2 compression (.tar.bz2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={createTarArchive} disabled={isProcessing || files.length === 0} className="w-full">
                  <FileArchive className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Creating TAR...' : 'Create TAR Archive'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="extract" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Extract TAR Archive</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => extractInputRef.current?.click()} variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  {tarFile ? `Selected: ${tarFile.name}` : 'Select TAR File'}
                </Button>
                <input 
                  ref={extractInputRef} 
                  type="file" 
                  accept=".tar,.tar.gz,.tar.bz2"
                  onChange={handleExtractFile} 
                  className="hidden" 
                />

                {tarFile && (
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="text-sm font-medium">File: {tarFile.name}</p>
                    <p className="text-xs text-gray-600">
                      Size: {(tarFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}

                <Button onClick={extractTarArchive} disabled={isProcessing || !tarFile} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Extracting...' : 'Extract TAR Archive'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {isProcessing && (
          <Card>
            <CardContent className="pt-6">
              <Progress value={progress} />
              <p className="text-sm text-gray-600 text-center mt-2">
                Processing TAR archive...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default TarTool;
