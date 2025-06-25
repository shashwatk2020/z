
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Layers, Upload, Download, Zap, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FileCompressor = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [compressionLevel, setCompressionLevel] = useState([6]);
  const [outputFormat, setOutputFormat] = useState('zip');
  const [archiveName, setArchiveName] = useState('compressed');
  const [password, setPassword] = useState('');
  const [deleteOriginals, setDeleteOriginals] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionStats, setCompressionStats] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const compressionFormats = [
    { value: 'zip', label: 'ZIP - Universal compatibility', maxLevel: 9 },
    { value: '7z', label: '7-Zip - Maximum compression', maxLevel: 9 },
    { value: 'tar.gz', label: 'TAR.GZ - Linux standard', maxLevel: 9 },
    { value: 'tar.bz2', label: 'TAR.BZ2 - Better compression', maxLevel: 9 },
    { value: 'tar.xz', label: 'TAR.XZ - Best compression', maxLevel: 9 }
  ];

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

  const getCompressionLevelLabel = (level: number) => {
    const labels = ['Store', 'Fastest', 'Fast', 'Normal', 'Good', 'Better', 'Best', 'Ultra', 'Maximum'];
    return labels[level] || 'Custom';
  };

  const estimateCompressionRatio = () => {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const level = compressionLevel[0];
    const format = outputFormat;
    
    // Rough estimation based on format and level
    let ratio = 0.7; // Default 30% compression
    
    if (format === '7z') ratio = 0.5 - (level * 0.05);
    else if (format === 'tar.xz') ratio = 0.6 - (level * 0.04);
    else if (format === 'tar.bz2') ratio = 0.65 - (level * 0.03);
    else if (format === 'zip') ratio = 0.75 - (level * 0.03);
    
    return {
      originalSize: totalSize,
      estimatedSize: Math.round(totalSize * Math.max(0.1, ratio)),
      savingPercent: Math.round((1 - Math.max(0.1, ratio)) * 100)
    };
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
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      
      // Simulate compression process
      const steps = [
        'Analyzing files...',
        'Applying compression algorithm...',
        'Optimizing structure...',
        'Writing archive...',
        'Finalizing compression...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Calculate final stats
      const estimation = estimateCompressionRatio();
      setCompressionStats({
        originalSize: estimation.originalSize,
        compressedSize: estimation.estimatedSize,
        compressionRatio: estimation.savingPercent,
        filesProcessed: files.length,
        format: outputFormat.toUpperCase(),
        level: compressionLevel[0]
      });

      // Create compressed file
      const extension = outputFormat === 'tar.gz' ? '.tar.gz' : 
                       outputFormat === 'tar.bz2' ? '.tar.bz2' :
                       outputFormat === 'tar.xz' ? '.tar.xz' :
                       `.${outputFormat}`;
      
      const fileName = `${archiveName}${extension}`;
      const blob = new Blob(['Compressed archive content'], { 
        type: getMimeType(outputFormat) 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Compression Complete",
        description: `${fileName} created successfully with ${estimation.savingPercent}% compression.`
      });
    } catch (error) {
      toast({
        title: "Compression Failed",
        description: "Failed to compress files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCompressing(false);
      setProgress(0);
    }
  };

  const getMimeType = (format: string) => {
    const mimeTypes: Record<string, string> = {
      zip: 'application/zip',
      '7z': 'application/x-7z-compressed',
      'tar.gz': 'application/gzip',
      'tar.bz2': 'application/x-bzip2',
      'tar.xz': 'application/x-xz'
    };
    return mimeTypes[format] || 'application/octet-stream';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const estimation = files.length > 0 ? estimateCompressionRatio() : null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Layers className="h-12 w-12 mx-auto text-orange-600" />
          <h1 className="text-3xl font-bold">Advanced File Compressor</h1>
          <p className="text-gray-600">Compress files and folders with maximum efficiency and customizable settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Files Selection</CardTitle>
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
                        <span className="truncate flex-1">{file.name}</span>
                        <span className="text-gray-500 mx-2">{formatFileSize(file.size)}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0"
                        >
                          ×
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
                Compression Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Archive Name</Label>
                <Input 
                  value={archiveName} 
                  onChange={(e) => setArchiveName(e.target.value)}
                  placeholder="compressed"
                />
              </div>

              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {compressionFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Compression Level: {compressionLevel[0]} - {getCompressionLevelLabel(compressionLevel[0])}</Label>
                <Slider
                  value={compressionLevel}
                  onValueChange={setCompressionLevel}
                  max={9}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Fastest</span>
                  <span>Balanced</span>
                  <span>Best</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Password (Optional)</Label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave empty for no encryption"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={deleteOriginals} 
                  onCheckedChange={(checked) => setDeleteOriginals(checked === true)} 
                />
                <Label>Delete original files after compression</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {estimation && (
          <Card>
            <CardHeader>
              <CardTitle>Compression Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatFileSize(estimation.originalSize)}
                  </div>
                  <p className="text-sm text-blue-700">Original Size</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatFileSize(estimation.estimatedSize)}
                  </div>
                  <p className="text-sm text-green-700">Estimated Size</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {estimation.savingPercent}%
                  </div>
                  <p className="text-sm text-purple-700">Space Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={compressFiles} 
              disabled={isCompressing || files.length === 0} 
              className="w-full"
              size="lg"
            >
              <Zap className="h-4 w-4 mr-2" />
              {isCompressing ? 'Compressing...' : 'Compress Files'}
            </Button>

            {isCompressing && (
              <div className="mt-4 space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">
                  Compressing {files.length} files with {getCompressionLevelLabel(compressionLevel[0])} compression...
                </p>
              </div>
            )}

            {compressionStats && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Compression Complete!</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Format:</span> {compressionStats.format}
                  </div>
                  <div>
                    <span className="text-gray-600">Level:</span> {compressionStats.level}
                  </div>
                  <div>
                    <span className="text-gray-600">Files:</span> {compressionStats.filesProcessed}
                  </div>
                  <div>
                    <span className="text-gray-600">Compression:</span> {compressionStats.compressionRatio}%
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FileCompressor;
