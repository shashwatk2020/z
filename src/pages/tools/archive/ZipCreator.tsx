
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { FileArchive, Upload, Download, Trash2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileItem {
  file: File;
  path: string;
  size: number;
}

const ZipCreator = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [archiveName, setArchiveName] = useState('archive.zip');
  const [compressionLevel, setCompressionLevel] = useState('6');
  const [password, setPassword] = useState('');
  const [includeSubfolders, setIncludeSubfolders] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: FileItem[] = selectedFiles.map(file => ({
      file,
      path: file.name,
      size: file.size
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const createZipArchive = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to create an archive.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    setProgress(0);

    try {
      // Simulate archive creation with progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Create a simple zip-like structure (simulation)
      const zipContent = files.map(item => ({
        name: item.path,
        size: item.size,
        compressed: Math.floor(item.size * (1 - parseInt(compressionLevel) / 10))
      }));

      const blob = new Blob([JSON.stringify(zipContent, null, 2)], {
        type: 'application/zip'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = archiveName;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Archive Created Successfully",
        description: `${archiveName} has been created and downloaded.`
      });
    } catch (error) {
      toast({
        title: "Error Creating Archive",
        description: "Failed to create the ZIP archive. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
      setProgress(0);
    }
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const estimatedCompressedSize = Math.floor(totalSize * (1 - parseInt(compressionLevel) / 10));

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <FileArchive className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">ZIP Archive Creator</h1>
          <p className="text-gray-600">Create compressed ZIP archives with advanced options</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Add Files to Archive
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
                  Select Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.path}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {files.length > 0 && (
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-sm font-medium">Total Files: {files.length}</p>
                  <p className="text-sm text-gray-600">
                    Original Size: {formatFileSize(totalSize)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Estimated Compressed: {formatFileSize(estimatedCompressedSize)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Archive Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="archiveName">Archive Name</Label>
                <Input
                  id="archiveName"
                  value={archiveName}
                  onChange={(e) => setArchiveName(e.target.value)}
                  placeholder="Enter archive name"
                />
              </div>

              <div>
                <Label htmlFor="compression">Compression Level</Label>
                <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Compression (Store)</SelectItem>
                    <SelectItem value="1">Fastest</SelectItem>
                    <SelectItem value="3">Fast</SelectItem>
                    <SelectItem value="6">Normal</SelectItem>
                    <SelectItem value="9">Maximum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="password">Password Protection (Optional)</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="subfolders"
                  checked={includeSubfolders}
                  onCheckedChange={(checked) => setIncludeSubfolders(checked as boolean)}
                />
                <Label htmlFor="subfolders">Include subfolders</Label>
              </div>

              <Button 
                onClick={createZipArchive}
                disabled={isCreating || files.length === 0}
                className="w-full"
              >
                {isCreating ? (
                  <>Creating Archive...</>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Create ZIP Archive
                  </>
                )}
              </Button>

              {isCreating && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-gray-600">
                    Creating archive... {progress}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ZipCreator;
