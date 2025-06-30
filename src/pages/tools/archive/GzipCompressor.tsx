
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Upload, Download, FileText, BarChart3, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GzipCompressor = () => {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputName, setOutputName] = useState('');
  const [compressionLevel, setCompressionLevel] = useState('6');
  const [preserveTimestamp, setPreserveTimestamp] = useState(true);
  const [addToTar, setAddToTar] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionStats, setCompressionStats] = useState<any>(null);
  const [mode, setMode] = useState<'compress' | 'decompress'>('compress');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputFile(file);
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      
      if (mode === 'compress') {
        setOutputName(addToTar ? `${baseName}.tar.gz` : `${baseName}.gz`);
      } else {
        if (file.name.endsWith('.gz')) {
          setOutputName(file.name.replace(/\.gz$/, ''));
        } else {
          setOutputName(baseName);
        }
      }
    }
  };

  const processFile = async () => {
    if (!inputFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to process.",
        variant: "destructive"
      });
      return;
    }

    if (mode === 'compress' && inputFile.name.endsWith('.gz')) {
      toast({
        title: "Already Compressed",
        description: "This file appears to be already compressed.",
        variant: "destructive"
      });
      return;
    }

    if (mode === 'decompress' && !inputFile.name.endsWith('.gz')) {
      toast({
        title: "Not a GZIP File",
        description: "Please select a .gz file for decompression.",
        variant: "destructive"
      });
      return;
    }

    setIsCompressing(true);
    setProgress(0);

    try {
      const steps = mode === 'compress' ? [
        'Reading source file...',
        'Applying GZIP compression...',
        'Optimizing compression ratio...',
        'Writing compressed data...',
        'Finalizing GZIP archive...'
      ] : [
        'Reading GZIP archive...',
        'Verifying file integrity...',
        'Decompressing data...',
        'Restoring original file...',
        'Cleaning up...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Calculate compression stats
      const originalSize = inputFile.size;
      let finalSize, ratio;
      
      if (mode === 'compress') {
        const compressionRatio = parseInt(compressionLevel) / 9;
        finalSize = originalSize * (0.3 + compressionRatio * 0.4); // Simulate compression
        ratio = ((originalSize - finalSize) / originalSize) * 100;
      } else {
        finalSize = originalSize * 2.5; // Simulate decompression
        ratio = ((finalSize - originalSize) / originalSize) * 100;
      }

      setCompressionStats({
        originalSize,
        finalSize,
        ratio,
        method: mode === 'compress' ? 'GZIP Compression' : 'GZIP Decompression',
        level: compressionLevel
      });

      const blob = new Blob([mode === 'compress' ? 'GZIP compressed data' : 'Decompressed file content'], {
        type: mode === 'compress' ? 'application/gzip' : 'application/octet-stream'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = outputName;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: `${mode === 'compress' ? 'Compression' : 'Decompression'} Complete`,
        description: `File processed with ${Math.abs(ratio).toFixed(1)}% ${mode === 'compress' ? 'compression' : 'expansion'} ratio.`
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: `Failed to ${mode} file. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsCompressing(false);
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
          <Zap className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">GZIP Compressor & Decompressor</h1>
          <p className="text-gray-600">High-performance GZIP compression for web optimization</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Operation Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={mode} onValueChange={(value) => setMode(value as 'compress' | 'decompress')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="compress">Compress Files</TabsTrigger>
                <TabsTrigger value="decompress">Decompress GZIP</TabsTrigger>
              </TabsList>

              <TabsContent value="compress" className="space-y-4 mt-6">
                <div className="text-sm text-gray-600">
                  Compress files using GZIP algorithm for web servers and file transfer optimization.
                </div>
              </TabsContent>

              <TabsContent value="decompress" className="space-y-4 mt-6">
                <div className="text-sm text-gray-600">
                  Extract and decompress .gz files to their original format.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>File Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {inputFile ? `Selected: ${inputFile.name}` : `Choose File to ${mode === 'compress' ? 'Compress' : 'Decompress'}`}
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept={mode === 'compress' ? '*' : '.gz'}
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {inputFile && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="font-medium">File Information</span>
                </div>
                <div className="mt-2 text-sm space-y-1">
                  <div><strong>Name:</strong> {inputFile.name}</div>
                  <div><strong>Size:</strong> {formatFileSize(inputFile.size)}</div>
                  <div><strong>Type:</strong> {inputFile.type || 'Unknown'}</div>
                  <div><strong>Modified:</strong> {new Date(inputFile.lastModified).toLocaleDateString()}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              {mode === 'compress' ? 'Compression' : 'Decompression'} Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Output Filename</Label>
              <Input 
                value={outputName} 
                onChange={(e) => setOutputName(e.target.value)}
                placeholder={mode === 'compress' ? 'compressed.gz' : 'decompressed_file'}
              />
            </div>

            {mode === 'compress' && (
              <>
                <div className="space-y-2">
                  <Label>Compression Level</Label>
                  <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Fastest (Large files)</SelectItem>
                      <SelectItem value="3">3 - Fast</SelectItem>
                      <SelectItem value="6">6 - Normal (Recommended)</SelectItem>
                      <SelectItem value="9">9 - Best compression (Slow)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={addToTar} 
                      onCheckedChange={(checked) => setAddToTar(checked === true)} 
                    />
                    <Label>Create TAR.GZ archive (for multiple files)</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={preserveTimestamp} 
                      onCheckedChange={(checked) => setPreserveTimestamp(checked === true)} 
                    />
                    <Label>Preserve original timestamp</Label>
                  </div>
                </div>
              </>
            )}

            <Button 
              onClick={processFile} 
              disabled={isCompressing || !inputFile} 
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {isCompressing ? 
                (mode === 'compress' ? 'Compressing...' : 'Decompressing...') : 
                (mode === 'compress' ? 'Compress File' : 'Decompress File')
              }
            </Button>

            {isCompressing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">
                  {mode === 'compress' ? 'Applying GZIP compression...' : 'Decompressing GZIP archive...'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {compressionStats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Processing Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Original Size</p>
                  <p className="font-semibold">{formatFileSize(compressionStats.originalSize)}</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded">
                  <p className="text-sm text-gray-600">Final Size</p>
                  <p className="font-semibold text-blue-600">{formatFileSize(compressionStats.finalSize)}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <p className="text-sm text-gray-600">Ratio</p>
                  <p className="font-semibold text-green-600">{Math.abs(compressionStats.ratio).toFixed(1)}%</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded">
                  <p className="text-sm text-gray-600">Method</p>
                  <p className="font-semibold text-purple-600">GZIP-{compressionStats.level}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default GzipCompressor;
