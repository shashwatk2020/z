
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FolderOpen, File, Folder, Eye, Info, Shield, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArchiveFile {
  name: string;
  size: number;
  compressedSize: number;
  type: 'file' | 'folder';
  path: string;
  modified: Date;
  crc32?: string;
  method?: string;
}

const ArchiveInspector = () => {
  const [archiveFile, setArchiveFile] = useState<File | null>(null);
  const [archiveContents, setArchiveContents] = useState<ArchiveFile[]>([]);
  const [archiveInfo, setArchiveInfo] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPath, setSelectedPath] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setArchiveFile(file);
    setIsAnalyzing(true);

    try {
      // Simulate archive analysis
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock archive contents
      const mockContents: ArchiveFile[] = [
        {
          name: 'documents',
          size: 0,
          compressedSize: 0,
          type: 'folder',
          path: '/documents',
          modified: new Date('2024-01-15')
        },
        {
          name: 'report.pdf',
          size: 2457600,
          compressedSize: 1843200,
          type: 'file',
          path: '/documents/report.pdf',
          modified: new Date('2024-01-15'),
          crc32: 'A1B2C3D4',
          method: 'Deflate'
        },
        {
          name: 'images',
          size: 0,
          compressedSize: 0,
          type: 'folder',
          path: '/images',
          modified: new Date('2024-01-10')
        },
        {
          name: 'photo1.jpg',
          size: 5242880,
          compressedSize: 5100000,
          type: 'file',
          path: '/images/photo1.jpg',
          modified: new Date('2024-01-10'),
          crc32: 'E5F6A7B8',
          method: 'Store'
        },
        {
          name: 'config.txt',
          size: 1024,
          compressedSize: 512,
          type: 'file',
          path: '/config.txt',
          modified: new Date('2024-01-12'),
          crc32: 'C9D0E1F2',
          method: 'Deflate'
        }
      ];

      setArchiveContents(mockContents);

      // Mock archive info
      setArchiveInfo({
        fileName: file.name,
        fileSize: file.size,
        format: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
        filesCount: mockContents.filter(f => f.type === 'file').length,
        foldersCount: mockContents.filter(f => f.type === 'folder').length,
        compressionRatio: 75,
        created: new Date('2024-01-15'),
        encrypted: Math.random() > 0.7,
        solid: Math.random() > 0.5,
        multivolume: false
      });

      toast({
        title: "Archive Analyzed",
        description: `Successfully analyzed ${file.name}`
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze archive file.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionRatio = (original: number, compressed: number) => {
    if (original === 0) return 0;
    return Math.round(((original - compressed) / original) * 100);
  };

  const getCurrentFolderContents = () => {
    if (!selectedPath) {
      return archiveContents.filter(item => !item.path.includes('/', 1));
    }
    return archiveContents.filter(item => 
      item.path.startsWith(selectedPath) && 
      item.path !== selectedPath &&
      !item.path.substring(selectedPath.length + 1).includes('/')
    );
  };

  const getTotalStats = () => {
    const files = archiveContents.filter(f => f.type === 'file');
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const totalCompressed = files.reduce((sum, f) => sum + f.compressedSize, 0);
    return {
      totalSize,
      totalCompressed,
      compressionRatio: getCompressionRatio(totalSize, totalCompressed)
    };
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Eye className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Archive Inspector</h1>
          <p className="text-gray-600">Examine archive contents without extracting files</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Archive File</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
              <FolderOpen className="h-4 w-4 mr-2" />
              {archiveFile ? `Selected: ${archiveFile.name}` : 'Choose Archive File'}
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".zip,.rar,.7z,.tar,.gz,.bz2,.xz,.iso,.cab,.dmg"
              onChange={handleFileSelect} 
              className="hidden" 
            />
          </CardContent>
        </Card>

        {isAnalyzing && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing archive structure...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {archiveInfo && !isAnalyzing && (
          <Tabs defaultValue="contents" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contents">Contents</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="contents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Folder className="h-5 w-5 mr-2" />
                    Archive Contents
                    <Badge variant="secondary" className="ml-2">
                      {archiveContents.length} items
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPath && (
                    <div className="mb-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedPath('')}
                        className="text-blue-600"
                      >
                        ← Back to root
                      </Button>
                      <p className="text-sm text-gray-600 mt-1">Current path: {selectedPath || '/'}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {getCurrentFolderContents().map((item, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center p-3 border rounded-lg hover:bg-gray-50 ${
                          item.type === 'folder' ? 'cursor-pointer' : ''
                        }`}
                        onClick={() => item.type === 'folder' && setSelectedPath(item.path)}
                      >
                        {item.type === 'folder' ? (
                          <Folder className="h-5 w-5 mr-3 text-blue-500" />
                        ) : (
                          <File className="h-5 w-5 mr-3 text-gray-500" />
                        )}
                        
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            Modified: {item.modified.toLocaleDateString()}
                          </div>
                        </div>
                        
                        {item.type === 'file' && (
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {formatFileSize(item.size)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Compressed: {formatFileSize(item.compressedSize)} 
                              ({getCompressionRatio(item.size, item.compressedSize)}%)
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    Archive Properties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">File Name</Label>
                        <p className="font-medium">{archiveInfo.fileName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Format</Label>
                        <p className="font-medium">{archiveInfo.format}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">File Size</Label>
                        <p className="font-medium">{formatFileSize(archiveInfo.fileSize)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Created</Label>
                        <p className="font-medium">{archiveInfo.created.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Files</Label>
                        <p className="font-medium">{archiveInfo.filesCount}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Folders</Label>
                        <p className="font-medium">{archiveInfo.foldersCount}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Compression</Label>
                        <p className="font-medium">{archiveInfo.compressionRatio}%</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        {archiveInfo.encrypted && (
                          <Badge variant="destructive" className="flex items-center">
                            <Shield className="h-3 w-3 mr-1" />
                            Encrypted
                          </Badge>
                        )}
                        {archiveInfo.solid && (
                          <Badge variant="secondary">
                            Solid Archive
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {getTotalStats().totalSize ? formatFileSize(getTotalStats().totalSize) : '0 B'}
                      </div>
                      <p className="text-sm text-gray-600">Original Size</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {getTotalStats().totalCompressed ? formatFileSize(getTotalStats().totalCompressed) : '0 B'}
                      </div>
                      <p className="text-sm text-gray-600">Compressed Size</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {getTotalStats().compressionRatio}%
                      </div>
                      <p className="text-sm text-gray-600">Space Saved</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>File Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['pdf', 'jpg', 'txt'].map((ext, index) => (
                      <div key={ext} className="flex items-center">
                        <div className="w-12 text-sm font-medium">.{ext}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${[60, 30, 10][index]}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-600 w-12">{[60, 30, 10][index]}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <label className={className}>{children}</label>
);

export default ArchiveInspector;
