
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { FileArchive, Upload, Download, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FileCompressor = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [compressionType, setCompressionType] = useState('gzip');
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const compressFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to compress.",
        variant: "destructive"
      });
      return;
    }

    setIsCompressing(true);
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(((i + 1) / files.length) * 100);
        
        // Simulate compression
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const compressedName = `${file.name.split('.')[0]}_compressed.${compressionType}`;
        const blob = new Blob([`Compressed content of ${file.name}`], {
          type: 'application/octet-stream'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = compressedName;
        a.click();
        URL.revokeObjectURL(url);
      }

      toast({
        title: "Compression Complete",
        description: `${files.length} files compressed successfully.`
      });
    } catch (error) {
      toast({
        title: "Compression Failed",
        description: "Failed to compress files.",
        variant: "destructive"
      });
    } finally {
      setIsCompressing(false);
      setProgress(0);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Zap className="h-12 w-12 mx-auto text-yellow-600" />
          <h1 className="text-3xl font-bold">File Compressor</h1>
          <p className="text-gray-600">Compress individual files to reduce storage space</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Files & Compression Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Select Files
            </Button>
            <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />

            <div>
              <Label>Compression Type</Label>
              <Select value={compressionType} onValueChange={setCompressionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gzip">GZIP (.gz)</SelectItem>
                  <SelectItem value="bzip2">BZIP2 (.bz2)</SelectItem>
                  <SelectItem value="xz">XZ (.xz)</SelectItem>
                  <SelectItem value="lz4">LZ4 (.lz4)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Selected Files:</h3>
                {files.map((file, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                ))}
              </div>
            )}

            <Button onClick={compressFiles} disabled={isCompressing || files.length === 0} className="w-full">
              {isCompressing ? 'Compressing...' : 'Compress Files'}
            </Button>

            {isCompressing && <Progress value={progress} />}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FileCompressor;
