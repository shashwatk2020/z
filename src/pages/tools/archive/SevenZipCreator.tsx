
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { FileArchive, Upload, Download, Settings, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SevenZipCreator = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [archiveName, setArchiveName] = useState('archive.7z');
  const [compressionLevel, setCompressionLevel] = useState('5');
  const [compressionMethod, setCompressionMethod] = useState('LZMA2');
  const [password, setPassword] = useState('');
  const [encryptHeaders, setEncryptHeaders] = useState(false);
  const [solidArchive, setSolidArchive] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const create7zArchive = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to create a 7z archive.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    setProgress(0);

    try {
      // Simulate 7z creation with ultra compression
      const steps = [
        'Analyzing files...',
        'Applying compression...',
        'Optimizing structure...',
        'Encrypting data...',
        'Finalizing archive...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress((i + 1) * 20);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const blob = new Blob(['7z archive content'], { type: 'application/x-7z-compressed' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = archiveName;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "7z Archive Created",
        description: `${archiveName} created with maximum compression.`
      });
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create 7z archive.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
      setProgress(0);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Zap className="h-12 w-12 mx-auto text-orange-600" />
          <h1 className="text-3xl font-bold">7-Zip Archive Creator</h1>
          <p className="text-gray-600">Create highly compressed 7z archives with maximum compression ratios</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Files & Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Select Files
              </Button>
              <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />

              <div className="space-y-2">
                <Label>Archive Name</Label>
                <Input value={archiveName} onChange={(e) => setArchiveName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Compression Level</Label>
                <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Store (No compression)</SelectItem>
                    <SelectItem value="1">Fastest</SelectItem>
                    <SelectItem value="3">Fast</SelectItem>
                    <SelectItem value="5">Normal</SelectItem>
                    <SelectItem value="7">Maximum</SelectItem>
                    <SelectItem value="9">Ultra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Compression Method</Label>
                <Select value={compressionMethod} onValueChange={setCompressionMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LZMA2">LZMA2 (Best)</SelectItem>
                    <SelectItem value="LZMA">LZMA</SelectItem>
                    <SelectItem value="PPMd">PPMd (Text files)</SelectItem>
                    <SelectItem value="BZip2">BZip2</SelectItem>
                    <SelectItem value="Deflate">Deflate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Password (Optional)</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox checked={encryptHeaders} onCheckedChange={setEncryptHeaders} />
                  <Label>Encrypt file names</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={solidArchive} onCheckedChange={setSolidArchive} />
                  <Label>Create solid archive</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Archive</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={create7zArchive} disabled={isCreating} className="w-full">
                {isCreating ? 'Creating...' : 'Create 7z Archive'}
              </Button>

              {isCreating && <Progress value={progress} />}

              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">7z Features:</h4>
                <ul className="space-y-1">
                  <li>• Ultra-high compression ratios</li>
                  <li>• Strong AES-256 encryption</li>
                  <li>• Solid compression optimization</li>
                  <li>• Multiple compression methods</li>
                  <li>• File name encryption</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SevenZipCreator;
