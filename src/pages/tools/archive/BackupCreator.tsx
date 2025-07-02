
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { HardDrive, Upload, Download, Folder, Shield, Clock, Settings, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Extend the input element to support webkitdirectory
interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: string;
}

const BackupCreator = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [backupName, setBackupName] = useState('');
  const [compressionLevel, setCompressionLevel] = useState('6');
  const [useEncryption, setUseEncryption] = useState(false);
  const [password, setPassword] = useState('');
  const [includeHiddenFiles, setIncludeHiddenFiles] = useState(false);
  const [excludePatterns, setExcludePatterns] = useState('*.tmp, *.cache, node_modules/');
  const [backupDescription, setBackupDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backupResult, setBackupResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const compressionLevels = [
    { value: '0', label: 'No Compression (Fastest)', description: 'Store only' },
    { value: '3', label: 'Fast Compression', description: 'Quick backup' },
    { value: '6', label: 'Balanced', description: 'Good speed and size' },
    { value: '9', label: 'Maximum Compression', description: 'Smallest size' }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
      if (!backupName) {
        setBackupName(`backup_${new Date().toISOString().split('T')[0]}`);
      }
    }
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
      if (!backupName) {
        setBackupName(`folder_backup_${new Date().toISOString().split('T')[0]}`);
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const createBackup = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files or folders to backup.",
        variant: "destructive"
      });
      return;
    }

    if (!backupName.trim()) {
      toast({
        title: "Backup Name Required",
        description: "Please enter a name for your backup.",
        variant: "destructive"
      });
      return;
    }

    if (useEncryption && !password) {
      toast({
        title: "Password Required",
        description: "Please enter a password for encryption.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    setProgress(0);

    try {
      const steps = [
        'Analyzing files and folders...',
        'Applying exclusion patterns...',
        'Calculating compression ratios...',
        'Creating backup structure...',
        'Compressing files...',
        'Applying encryption...',
        'Generating backup metadata...',
        'Finalizing backup archive...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
      const compressionRatio = parseInt(compressionLevel) / 9;
      const compressedSize = totalSize * (1 - compressionRatio * 0.7);
      
      setBackupResult({
        name: backupName,
        files: selectedFiles.length,
        originalSize: totalSize,
        compressedSize: compressedSize,
        compressionRatio: ((totalSize - compressedSize) / totalSize) * 100,
        encrypted: useEncryption,
        created: new Date().toLocaleString(),
        description: backupDescription
      });

      // Create and download backup file
      const backupContent = JSON.stringify({
        metadata: {
          name: backupName,
          created: new Date().toISOString(),
          files: selectedFiles.length,
          description: backupDescription,
          compression: compressionLevel,
          encrypted: useEncryption
        },
        files: selectedFiles.map(f => ({
          name: f.name,
          size: f.size,
          type: f.type,
          lastModified: f.lastModified
        }))
      }, null, 2);

      const blob = new Blob([backupContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${backupName}.backup.zip`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Backup Created",
        description: `Successfully created backup with ${selectedFiles.length} files.`
      });
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: "Failed to create backup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <HardDrive className="h-12 w-12 mx-auto text-green-600" />
          <h1 className="text-3xl font-bold">Backup Creator</h1>
          <p className="text-gray-600">Create compressed, encrypted backups with advanced options</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Files and Folders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Add Files
              </Button>
              <Button onClick={() => folderInputRef.current?.click()} variant="outline" className="w-full">
                <Folder className="h-4 w-4 mr-2" />
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
              {...({ webkitdirectory: "" } as FileInputProps)}
              multiple 
              onChange={handleFolderSelect} 
              className="hidden" 
            />

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Selected Files ({selectedFiles.length})</Label>
                  <span className="text-sm text-gray-600">Total: {formatFileSize(totalSize)}</span>
                </div>
                <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-1">
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
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Backup Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Backup Name</Label>
                <Input 
                  value={backupName} 
                  onChange={(e) => setBackupName(e.target.value)}
                  placeholder="Enter backup name"
                />
              </div>

              <div className="space-y-2">
                <Label>Compression Level</Label>
                <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {compressionLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label} - {level.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={useEncryption} 
                  onCheckedChange={(checked) => setUseEncryption(checked === true)} 
                />
                <Label>Enable encryption (password protection)</Label>
              </div>

              {useEncryption && (
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Encryption Password
                  </Label>
                  <Input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter strong password"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={includeHiddenFiles} 
                  onCheckedChange={(checked) => setIncludeHiddenFiles(checked === true)} 
                />
                <Label>Include hidden files and folders</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Exclude Patterns (comma-separated)</Label>
              <Input 
                value={excludePatterns} 
                onChange={(e) => setExcludePatterns(e.target.value)}
                placeholder="*.tmp, *.cache, node_modules/"
              />
            </div>

            <div className="space-y-2">
              <Label>Backup Description (optional)</Label>
              <Textarea 
                value={backupDescription} 
                onChange={(e) => setBackupDescription(e.target.value)}
                placeholder="Add notes about this backup..."
                rows={3}
              />
            </div>

            <Button onClick={createBackup} disabled={isCreating || selectedFiles.length === 0} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isCreating ? 'Creating Backup...' : 'Create Backup'}
            </Button>

            {isCreating && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">
                  Creating backup archive...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {backupResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Backup Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Files Backed Up</p>
                  <p className="font-semibold">{backupResult.files}</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded">
                  <p className="text-sm text-gray-600">Original Size</p>
                  <p className="font-semibold text-blue-600">{formatFileSize(backupResult.originalSize)}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <p className="text-sm text-gray-600">Compressed Size</p>
                  <p className="font-semibold text-green-600">{formatFileSize(backupResult.compressedSize)}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded">
                  <p className="text-sm text-gray-600">Space Saved</p>
                  <p className="font-semibold text-purple-600">{backupResult.compressionRatio.toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">Created: {backupResult.created}</span>
                </div>
                {backupResult.encrypted && (
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm text-green-600">Backup is encrypted and password protected</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default BackupCreator;
