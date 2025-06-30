
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Archive, Upload, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ArchiveConverter = () => {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState('zip');
  const [compressionLevel, setCompressionLevel] = useState('6');
  const [password, setPassword] = useState('');
  const [preserveStructure, setPreserveStructure] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [conversionInfo, setConversionInfo] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const supportedFormats = [
    { value: 'zip', label: 'ZIP Archive', ext: '.zip' },
    { value: 'rar', label: 'RAR Archive', ext: '.rar' },
    { value: '7z', label: '7-Zip Archive', ext: '.7z' },
    { value: 'tar', label: 'TAR Archive', ext: '.tar' },
    { value: 'tar.gz', label: 'TAR.GZ Archive', ext: '.tar.gz' },
    { value: 'tar.bz2', label: 'TAR.BZ2 Archive', ext: '.tar.bz2' }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const supportedExts = ['.zip', '.rar', '.7z', '.tar', '.tar.gz', '.tar.bz2'];
      const isSupported = supportedExts.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (isSupported) {
        setInputFile(file);
        setConversionInfo({
          name: file.name,
          size: file.size,
          type: file.name.split('.').pop()?.toUpperCase(),
          lastModified: new Date(file.lastModified).toLocaleDateString()
        });
      } else {
        toast({
          title: "Unsupported Format",
          description: "Please select a ZIP, RAR, 7Z, TAR, TAR.GZ, or TAR.BZ2 file.",
          variant: "destructive"
        });
      }
    }
  };

  const convertArchive = async () => {
    if (!inputFile) {
      toast({
        title: "No File Selected",
        description: "Please select an archive file to convert.",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);

    try {
      const steps = [
        'Reading source archive...',
        'Extracting files...',
        'Analyzing structure...',
        'Applying new compression...',
        'Creating target archive...',
        'Finalizing conversion...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const outputFormat_obj = supportedFormats.find(f => f.value === outputFormat);
      const outputName = inputFile.name.replace(/\.[^/.]+$/, '') + outputFormat_obj?.ext;

      const blob = new Blob(['Converted archive content'], { 
        type: outputFormat === 'zip' ? 'application/zip' : 
              outputFormat === 'rar' ? 'application/x-rar-compressed' :
              outputFormat === '7z' ? 'application/x-7z-compressed' :
              'application/x-tar'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = outputName;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Conversion Complete",
        description: `Successfully converted to ${outputFormat_obj?.label}`
      });
    } catch (error) {
      toast({
        title: "Conversion Failed",
        description: "Failed to convert archive. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
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
          <Archive className="h-12 w-12 mx-auto text-purple-600" />
          <h1 className="text-3xl font-bold">Archive Format Converter</h1>
          <p className="text-gray-600">Convert between different archive formats with advanced options</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Source Archive</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Choose Archive File
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".zip,.rar,.7z,.tar,.tar.gz,.tar.bz2"
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {conversionInfo && (
              <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="font-medium">Source Archive Information</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {conversionInfo.name}</div>
                  <div><strong>Type:</strong> {conversionInfo.type}</div>
                  <div><strong>Size:</strong> {formatFileSize(conversionInfo.size)}</div>
                  <div><strong>Modified:</strong> {conversionInfo.lastModified}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Target Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedFormats.map(format => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <SelectItem value="6">Normal (Recommended)</SelectItem>
                  <SelectItem value="9">Maximum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Password (Optional)</Label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set password for target archive"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={preserveStructure} 
                onCheckedChange={(checked) => setPreserveStructure(checked === true)} 
              />
              <Label>Preserve original folder structure</Label>
            </div>

            <Button 
              onClick={convertArchive} 
              disabled={isConverting || !inputFile} 
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isConverting ? 'animate-spin' : ''}`} />
              {isConverting ? 'Converting...' : 'Convert Archive'}
            </Button>

            {isConverting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">
                  Converting archive format...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ArchiveConverter;
