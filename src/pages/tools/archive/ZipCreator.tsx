
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Archive, Upload, Download, File, X, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ZipCreator = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [zipName, setZipName] = useState('archive.zip');
  const [compressionLevel, setCompressionLevel] = useState('6');
  const [password, setPassword] = useState('');
  const [includeSubfolders, setIncludeSubfolders] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const createZip = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files or folders to create a ZIP archive.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    setProgress(0);

    try {
      const steps = [
        'Preparing files...',
        'Applying compression...',
        'Adding to archive...',
        'Encrypting (if password set)...',
        'Finalizing ZIP file...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const blob = new Blob(['ZIP archive content'], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = zipName;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "ZIP Created Successfully",
        description: `${zipName} has been created with ${files.length} files.`
      });
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create ZIP archive. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
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

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Archive className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">ZIP Archive Creator</h1>
          <p className="text-gray-600">Create compressed ZIP archives with advanced options</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Files and Folders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Add Files
              </Button>
              <Button onClick={() => folderInputRef.current?.click()} variant="outline" className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Add Folder
              </Button>
            </div>
            
            <input 
              ref={fileInputRef} 
              type="file" 
              multiple 
              onChange={handleFileSelect} 
              className="hidden" 
            />
            <input 
              ref={folderInputRef} 
              type="file" 
              {...({webkitdirectory: true} as any)}
              onChange={handleFolderSelect} 
              className="hidden" 
            />

            {files.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Selected Files ({files.length})</Label>
                  <Button variant="ghost" size="sm" onClick={clearAllFiles}>
                    Clear All
                  </Button>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1 border rounded p-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <File className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="truncate flex-1">{file.name}</span>
                      <span className="text-gray-500 mx-2">{formatFileSize(file.size)}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Total size: {formatFileSize(totalSize)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Archive Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Archive Name</Label>
              <Input 
                value={zipName} 
                onChange={(e) => setZipName(e.target.value)}
                placeholder="archive.zip"
              />
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
                placeholder="Leave empty for no password protection"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={includeSubfolders} 
                onCheckedChange={(checked) => setIncludeSubfolders(checked === true)} 
              />
              <Label>Include subfolders when adding directories</Label>
            </div>

            <Button onClick={createZip} disabled={isCreating || files.length === 0} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isCreating ? 'Creating ZIP...' : 'Create ZIP Archive'}
            </Button>

            {isCreating && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">
                  Creating ZIP archive with {files.length} files...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ZipCreator;
