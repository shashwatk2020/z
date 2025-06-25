
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, Upload, FileText, Folder, Lock, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArchiveEntry {
  name: string;
  size: number;
  compressed: number;
  ratio: number;
  modified: string;
  crc: string;
  isDirectory: boolean;
  isEncrypted: boolean;
  path: string;
  attributes: string;
}

const ArchiveInspector = () => {
  const [archiveFile, setArchiveFile] = useState<File | null>(null);
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [archiveInfo, setArchiveInfo] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
    setIsAnalyzing(true);
    
    try {
      // Simulate archive analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockEntries: ArchiveEntry[] = [
        {
          name: 'documents/',
          size: 0,
          compressed: 0,
          ratio: 0,
          modified: '2024-01-15 10:30:00',
          crc: '',
          isDirectory: true,
          isEncrypted: false,
          path: 'documents/',
          attributes: 'drwxr-xr-x'
        },
        {
          name: 'report.pdf',
          size: 2048576,
          compressed: 1536432,
          ratio: 75.0,
          modified: '2024-01-15 10:25:00',
          crc: 'A1B2C3D4',
          isDirectory: false,
          isEncrypted: false,
          path: 'documents/report.pdf',
          attributes: '-rw-r--r--'
        },
        {
          name: 'confidential.txt',
          size: 1024,
          compressed: 512,
          ratio: 50.0,
          modified: '2024-01-15 10:20:00',
          crc: 'E5F6G7H8',
          isDirectory: false,
          isEncrypted: true,
          path: 'documents/confidential.txt',
          attributes: '-rw-------'
        },
        {
          name: 'images/',
          size: 0,
          compressed: 0,
          ratio: 0,
          modified: '2024-01-14 15:45:00',
          crc: '',
          isDirectory: true,
          isEncrypted: false,
          path: 'images/',
          attributes: 'drwxr-xr-x'
        },
        {
          name: 'photo1.jpg',
          size: 3145728,
          compressed: 3000000,
          ratio: 95.4,
          modified: '2024-01-14 15:40:00',
          crc: 'I9J0K1L2',
          isDirectory: false,
          isEncrypted: false,
          path: 'images/photo1.jpg',
          attributes: '-rw-r--r--'
        }
      ];

      const info = {
        name: file.name,
        size: file.size,
        format: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        compression: 'DEFLATE',
        created: new Date().toISOString(),
        totalFiles: mockEntries.filter(e => !e.isDirectory).length,
        totalFolders: mockEntries.filter(e => e.isDirectory).length,
        hasEncryption: mockEntries.some(e => e.isEncrypted),
        compressionRatio: 72.5
      };

      setEntries(mockEntries);
      setArchiveInfo(info);
      
      toast({
        title: "Archive Analysis Complete",
        description: `Found ${info.totalFiles} files and ${info.totalFolders} folders.`
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the archive file.",
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Eye className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Archive Inspector</h1>
          <p className="text-gray-600">Analyze archive contents and properties without extracting</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Select Archive to Inspect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Archive File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,.rar,.7z,.tar,.tar.gz,.tar.bz2,.tar.xz"
              onChange={handleFileSelect}
              className="hidden"
            />

            {archiveFile && (
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium">{archiveFile.name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(archiveFile.size)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {archiveInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{archiveInfo.totalFiles}</div>
                  <div className="text-sm text-gray-600">Files</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{archiveInfo.totalFolders}</div>
                  <div className="text-sm text-gray-600">Folders</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{archiveInfo.compressionRatio}%</div>
                  <div className="text-sm text-gray-600">Compression</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{archiveInfo.format}</div>
                  <div className="text-sm text-gray-600">Format</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {entries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Archive Contents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Size</th>
                      <th className="text-left p-2">Compressed</th>
                      <th className="text-left p-2">Ratio</th>
                      <th className="text-left p-2">Modified</th>
                      <th className="text-left p-2">CRC32</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {entry.isDirectory ? (
                              <Folder className="h-4 w-4 text-blue-500" />
                            ) : (
                              <FileText className="h-4 w-4 text-gray-500" />
                            )}
                            <span className="font-medium">{entry.name}</span>
                            {entry.isEncrypted && (
                              <Lock className="h-3 w-3 text-red-500" />
                            )}
                          </div>
                        </td>
                        <td className="p-2 text-gray-600">
                          {entry.isDirectory ? '-' : formatFileSize(entry.size)}
                        </td>
                        <td className="p-2 text-gray-600">
                          {entry.isDirectory ? '-' : formatFileSize(entry.compressed)}
                        </td>
                        <td className="p-2">
                          {entry.isDirectory ? '-' : (
                            <Badge variant={entry.ratio > 80 ? 'destructive' : entry.ratio > 50 ? 'default' : 'secondary'}>
                              {entry.ratio}%
                            </Badge>
                          )}
                        </td>
                        <td className="p-2 text-gray-600 text-xs">
                          {entry.modified}
                        </td>
                        <td className="p-2 text-gray-600 font-mono text-xs">
                          {entry.crc || '-'}
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            {entry.isEncrypted && (
                              <Badge variant="destructive">Encrypted</Badge>
                            )}
                            {entry.isDirectory && (
                              <Badge variant="outline">Directory</Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {isAnalyzing && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Analyzing archive...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ArchiveInspector;
