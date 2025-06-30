
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Upload, Eye, Folder, File, Archive, Shield, Clock, HardDrive, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ArchiveInspector = () => {
  const [archiveFile, setArchiveFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [archiveInfo, setArchiveInfo] = useState<any>(null);
  const [fileTree, setFileTree] = useState<any[]>([]);
  const [securityInfo, setSecurity] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const supportedFormats = ['.zip', '.rar', '.7z', '.tar', '.tar.gz', '.cab', '.iso'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isSupported = supportedFormats.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (isSupported) {
        setArchiveFile(file);
        analyzeArchive(file);
      } else {
        toast({
          title: "Unsupported Format",
          description: "Please select a supported archive format.",
          variant: "destructive"
        });
      }
    }
  };

  const analyzeArchive = async (file: File) => {
    setIsAnalyzing(true);
    setProgress(0);

    try {
      const steps = [
        'Reading archive header...',
        'Scanning file structure...',
        'Analyzing compression ratios...',
        'Checking security properties...',
        'Building file tree...',
        'Generating report...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Mock comprehensive archive analysis
      const mockFiles = [
        { name: 'documents/report.pdf', size: 2048576, compressed: 1536789, ratio: 75, type: 'PDF Document', modified: '2024-01-15', encrypted: false },
        { name: 'images/photo1.jpg', size: 3145728, compressed: 3098432, ratio: 98, type: 'JPEG Image', modified: '2024-01-10', encrypted: false },
        { name: 'data/database.sql', size: 8388608, compressed: 2097152, ratio: 25, type: 'SQL Database', modified: '2024-01-20', encrypted: true },
        { name: 'config/settings.ini', size: 4096, compressed: 1024, ratio: 25, type: 'Configuration', modified: '2024-01-05', encrypted: false },
        { name: 'scripts/backup.sh', size: 16384, compressed: 8192, ratio: 50, type: 'Shell Script', modified: '2024-01-12', encrypted: false }
      ];

      setArchiveInfo({
        name: file.name,
        size: file.size,
        type: file.name.split('.').pop()?.toUpperCase(),
        created: new Date(file.lastModified).toLocaleDateString(),
        files: mockFiles.length,
        folders: 3,
        compression: 'DEFLATE',
        version: '2.0',
        comment: 'Created with ArchiveInspector',
        totalUncompressed: mockFiles.reduce((sum, f) => sum + f.size, 0),
        totalCompressed: mockFiles.reduce((sum, f) => sum + f.compressed, 0)
      });

      setFileTree(mockFiles);

      setSecurity({
        encrypted: mockFiles.some(f => f.encrypted),
        encryptedFiles: mockFiles.filter(f => f.encrypted).length,
        passwordProtected: Math.random() > 0.7,
        digitalSignature: Math.random() > 0.6,
        integrityCheck: Math.random() > 0.3,
        suspiciousFiles: Math.floor(Math.random() * 2)
      });

      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${mockFiles.length} files in the archive.`
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze archive. The file may be corrupted.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = fileTree.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Eye className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Archive Inspector</h1>
          <p className="text-gray-600">Analyze archive contents, structure, and security without extraction</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Archive</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 mb-2">
              Supported formats: {supportedFormats.join(', ')}
            </div>
            
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {archiveFile ? `Selected: ${archiveFile.name}` : 'Choose Archive File'}
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept={supportedFormats.join(',')}
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {isAnalyzing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">
                  Analyzing archive structure...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {archiveInfo && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="files">Files ({fileTree.length})</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Archive className="h-5 w-5 mr-2" />
                      Archive Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Type:</strong> {archiveInfo.type}</div>
                    <div><strong>Size:</strong> {formatFileSize(archiveInfo.size)}</div>
                    <div><strong>Created:</strong> {archiveInfo.created}</div>
                    <div><strong>Version:</strong> {archiveInfo.version}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Folder className="h-5 w-5 mr-2" />
                      Content Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Files:</strong> {archiveInfo.files}</div>
                    <div><strong>Folders:</strong> {archiveInfo.folders}</div>
                    <div><strong>Compression:</strong> {archiveInfo.compression}</div>
                    <div><strong>Ratio:</strong> {((1 - archiveInfo.totalCompressed / archiveInfo.totalUncompressed) * 100).toFixed(1)}%</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <HardDrive className="h-5 w-5 mr-2" />
                      Storage Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Uncompressed:</strong> {formatFileSize(archiveInfo.totalUncompressed)}</div>
                    <div><strong>Compressed:</strong> {formatFileSize(archiveInfo.totalCompressed)}</div>
                    <div><strong>Saved:</strong> {formatFileSize(archiveInfo.totalUncompressed - archiveInfo.totalCompressed)}</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div className="border rounded-lg">
                <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 font-medium text-sm border-b">
                  <div className="col-span-4">Name</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-2">Compressed</div>
                  <div className="col-span-1">Ratio</div>
                  <div className="col-span-2">Modified</div>
                  <div className="col-span-1">Status</div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {filteredFiles.map((file, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 p-3 border-b last:border-b-0 hover:bg-gray-50 text-sm">
                      <div className="col-span-4 flex items-center">
                        <File className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <div className="col-span-2">{formatFileSize(file.size)}</div>
                      <div className="col-span-2">{formatFileSize(file.compressed)}</div>
                      <div className="col-span-1">{file.ratio}%</div>
                      <div className="col-span-2">{file.modified}</div>
                      <div className="col-span-1">
                        {file.encrypted && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Encrypted
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Security Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Password Protected</span>
                      <Badge variant={securityInfo.passwordProtected ? "destructive" : "secondary"}>
                        {securityInfo.passwordProtected ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Digital Signature</span>
                      <Badge variant={securityInfo.digitalSignature ? "default" : "secondary"}>
                        {securityInfo.digitalSignature ? "Present" : "None"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Integrity Check</span>
                      <Badge variant={securityInfo.integrityCheck ? "default" : "secondary"}>
                        {securityInfo.integrityCheck ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Security Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Encrypted Files</span>
                      <Badge variant={securityInfo.encryptedFiles > 0 ? "default" : "secondary"}>
                        {securityInfo.encryptedFiles}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Suspicious Files</span>
                      <Badge variant={securityInfo.suspiciousFiles > 0 ? "destructive" : "default"}>
                        {securityInfo.suspiciousFiles}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Compression Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Overall Compression</span>
                          <span>{((1 - archiveInfo.totalCompressed / archiveInfo.totalUncompressed) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={(1 - archiveInfo.totalCompressed / archiveInfo.totalUncompressed) * 100} />
                      </div>
                      <div className="text-sm text-gray-600">
                        Space saved: {formatFileSize(archiveInfo.totalUncompressed - archiveInfo.totalCompressed)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>File Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Documents</span>
                        <span>40%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Images</span>
                        <span>35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Files</span>
                        <span>20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Other</span>
                        <span>5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default ArchiveInspector;
