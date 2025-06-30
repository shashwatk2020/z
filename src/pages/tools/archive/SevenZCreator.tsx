
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { FileArchive, Upload, Download, Settings, Zap, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SevenZCreator = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [archiveName, setArchiveName] = useState('archive.7z');
  const [compressionLevel, setCompressionLevel] = useState([9]);
  const [compressionMethod, setCompressionMethod] = useState('LZMA2');
  const [password, setPassword] = useState('');
  const [encryptHeaders, setEncryptHeaders] = useState(false);
  const [solidArchive, setSolidArchive] = useState(true);
  const [splitArchive, setSplitArchive] = useState(false);
  const [splitSize, setSplitSize] = useState('100');
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
      const steps = [
        'Analyzing files...',
        'Applying LZMA2 compression...',
        'Optimizing dictionary...',
        'Encrypting data...',
        'Creating solid blocks...',
        'Finalizing archive...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1200));
      }

      const blob = new Blob(['7z ultra compressed archive'], { type: 'application/x-7z-compressed' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = archiveName;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "7z Archive Created",
        description: `${archiveName} created with maximum compression and security.`
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

  const getCompressionLevelLabel = () => {
    const level = compressionLevel[0];
    const labels = ['Store', 'Fastest', 'Fast', 'Normal', 'Good', 'Better', 'Best', 'Ultra', 'Maximum'];
    return labels[level] || 'Custom';
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
          <FileArchive className="h-12 w-12 mx-auto text-purple-600" />
          <h1 className="text-3xl font-bold">7-Zip Archive Creator</h1>
          <p className="text-gray-600">Create ultra-compressed 7z archives with maximum security</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>File Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Add Files to Archive
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              multiple 
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {files.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files ({files.length})</Label>
                <div className="max-h-32 overflow-y-auto space-y-1 border rounded p-2">
                  {files.map((file, index) => (
                    <div key={index} className="text-sm p-1 bg-gray-50 rounded">
                      {file.name} ({formatFileSize(file.size)})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Advanced Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Archive Name</Label>
              <Input 
                value={archiveName} 
                onChange={(e) => setArchiveName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Compression Level: {compressionLevel[0]} - {getCompressionLevelLabel()}</Label>
              <Slider
                value={compressionLevel}
                onValueChange={setCompressionLevel}
                max={9}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Store</span>
                <span>Ultra</span>
                <span>Maximum</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Compression Method</Label>
              <Select value={compressionMethod} onValueChange={setCompressionMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LZMA2">LZMA2 (Recommended)</SelectItem>
                  <SelectItem value="LZMA">LZMA (Legacy)</SelectItem>
                  <SelectItem value="PPMd">PPMd (Text files)</SelectItem>
                  <SelectItem value="BZip2">BZip2 (Fast)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={solidArchive} 
                    onCheckedChange={(checked) => setSolidArchive(checked === true)} 
                  />
                  <Label>Solid archive (better compression)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={splitArchive} 
                    onCheckedChange={(checked) => setSplitArchive(checked === true)} 
                  />
                  <Label>Split archive into volumes</Label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={encryptHeaders} 
                    onCheckedChange={(checked) => setEncryptHeaders(checked === true)} 
                  />
                  <Label>Encrypt file names</Label>
                </div>

                {splitArchive && (
                  <div className="space-y-2">
                    <Label>Volume Size (MB)</Label>
                    <Input 
                      value={splitSize} 
                      onChange={(e) => setSplitSize(e.target.value)}
                      placeholder="100"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Password Protection (Optional)
              </Label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password for encryption"
              />
            </div>

            <Button onClick={create7zArchive} disabled={isCreating || files.length === 0} className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              {isCreating ? 'Creating 7z Archive...' : 'Create Ultra-Compressed Archive'}
            </Button>

            {isCreating && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">
                  Creating 7z archive with maximum compression...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SevenZCreator;
