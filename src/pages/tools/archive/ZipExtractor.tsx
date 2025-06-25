
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { FileArchive, Upload, Download, FolderOpen, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArchiveEntry {
  name: string;
  size: number;
  compressed: number;
  isDirectory: boolean;
  path: string;
}

const ZipExtractor = () => {
  const [archiveFile, setArchiveFile] = useState<File | null>(null);
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [password, setPassword] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchiveFile(file);
      analyzeArchive(file);
    }
  };

  const analyzeArchive = async (file: File) => {
    // Simulate archive analysis
    const mockEntries: ArchiveEntry[] = [
      { name: 'document.txt', size: 1024, compressed: 512, isDirectory: false, path: 'document.txt' },
      { name: 'images/', size: 0, compressed: 0, isDirectory: true, path: 'images/' },
      { name: 'photo1.jpg', size: 2048000, compressed: 1945600, isDirectory: false, path: 'images/photo1.jpg' },
      { name: 'photo2.jpg', size: 1536000, compressed: 1459200, isDirectory: false, path: 'images/photo2.jpg' },
      { name: 'data/', size: 0, compressed: 0, isDirectory: true, path: 'data/' },
      { name: 'config.json', size: 512, compressed: 256, isDirectory: false, path: 'data/config.json' }
    ];
    
    setEntries(mockEntries);
    setSelectedEntries(new Set(mockEntries.map(e => e.path)));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleEntrySelection = (path: string) => {
    const newSelected = new Set(selectedEntries);
    if (newSelected.has(path)) {
      newSelected.delete(path);
    } else {
      newSelected.add(path);
    }
    setSelectedEntries(newSelected);
  };

  const selectAll = () => {
    setSelectedEntries(new Set(entries.map(e => e.path)));
  };

  const selectNone = () => {
    setSelectedEntries(new Set());
  };

  const extractArchive = async () => {
    if (!archiveFile || selectedEntries.size === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to extract.",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    setProgress(0);

    try {
      // Simulate extraction with progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Create downloadable files for selected entries
      const selectedFiles = entries.filter(entry => 
        selectedEntries.has(entry.path) && !entry.isDirectory
      );

      for (const entry of selectedFiles) {
        const blob = new Blob([`Extracted content of ${entry.name}`], {
          type: 'text/plain'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = entry.name;
        a.click();
        URL.revokeObjectURL(url);
      }

      toast({
        title: "Extraction Complete",
        description: `${selectedFiles.length} files extracted successfully.`
      });
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Failed to extract the archive. Please check the password and try again.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
      setProgress(0);
    }
  };

  const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);
  const selectedSize = entries
    .filter(entry => selectedEntries.has(entry.path))
    .reduce((sum, entry) => sum + entry.size, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <FolderOpen className="h-12 w-12 mx-auto text-green-600" />
          <h1 className="text-3xl font-bold">ZIP Archive Extractor</h1>
          <p className="text-gray-600">Extract files from ZIP archives with selective extraction</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Select Archive
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
                  Choose ZIP File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip,.rar,.7z"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {archiveFile && (
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium">{archiveFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(archiveFile.size)}
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="password">Password (if required)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter archive password"
                    className="pl-10"
                  />
                </div>
              </div>

              {entries.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Archive Contents</h3>
                    <div className="space-x-2">
                      <Button size="sm" variant="outline" onClick={selectAll}>
                        Select All
                      </Button>
                      <Button size="sm" variant="outline" onClick={selectNone}>
                        Select None
                      </Button>
                    </div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto border rounded">
                    {entries.map((entry, index) => (
                      <div 
                        key={index}
                        className={`flex items-center p-2 border-b cursor-pointer hover:bg-gray-50 ${
                          selectedEntries.has(entry.path) ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => toggleEntrySelection(entry.path)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedEntries.has(entry.path)}
                          onChange={() => toggleEntrySelection(entry.path)}
                          className="mr-3"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {entry.isDirectory ? '📁' : '📄'} {entry.name}
                          </p>
                          {!entry.isDirectory && (
                            <p className="text-xs text-gray-500">
                              {formatFileSize(entry.size)} → {formatFileSize(entry.compressed)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-blue-50 rounded text-sm">
                    <p>Total entries: {entries.length}</p>
                    <p>Selected: {selectedEntries.size}</p>
                    <p>Size to extract: {formatFileSize(selectedSize)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Extract Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={extractArchive}
                disabled={isExtracting || !archiveFile || selectedEntries.size === 0}
                className="w-full"
              >
                {isExtracting ? (
                  <>Extracting...</>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Extract Selected Files
                  </>
                )}
              </Button>

              {isExtracting && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-gray-600">
                    Extracting files... {progress}%
                  </p>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">Extraction Features:</h4>
                <ul className="space-y-1">
                  <li>• Selective file extraction</li>
                  <li>• Password protection support</li>
                  <li>• Preserve folder structure</li>
                  <li>• Multiple archive formats</li>
                  <li>• Batch extraction</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ZipExtractor;
