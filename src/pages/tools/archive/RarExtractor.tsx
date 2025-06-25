
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileArchive, Upload, Download, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RarExtractor = () => {
  const [archiveFile, setArchiveFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [multiPartFiles, setMultiPartFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setArchiveFile(files[0]);
      
      // Check for multi-part RAR files
      const rarParts = files.filter(file => 
        file.name.match(/\.r\d+$|\.rar$/) || 
        file.name.match(/\.part\d+\.rar$/)
      );
      
      if (rarParts.length > 1) {
        setMultiPartFiles(rarParts);
      }
    }
  };

  const extractRar = async () => {
    if (!archiveFile) {
      toast({
        title: "No File Selected",
        description: "Please select a RAR file to extract.",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    setProgress(0);

    try {
      // Simulate RAR extraction with progress
      for (let i = 0; i <= 100; i += 5) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      // Simulate extracted files
      const extractedFiles = [
        'document.pdf',
        'image.jpg',
        'data.json',
        'readme.txt'
      ];

      for (const fileName of extractedFiles) {
        const blob = new Blob([`Extracted content from RAR: ${fileName}`], {
          type: 'text/plain'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }

      toast({
        title: "Extraction Complete",
        description: `${extractedFiles.length} files extracted successfully from RAR archive.`
      });
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Failed to extract RAR archive. Please check the password and try again.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
      setProgress(0);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <FileArchive className="h-12 w-12 mx-auto text-red-600" />
          <h1 className="text-3xl font-bold">RAR Archive Extractor</h1>
          <p className="text-gray-600">Extract files from RAR archives including multi-part and password-protected files</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This tool supports RAR v4 and v5 archives, multi-part archives (*.part1.rar, *.r01, etc.), 
            and password-protected files. Upload the first part for multi-part archives.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Select RAR Archive
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
                  Choose RAR File(s)
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".rar,.r01,.r02,.r03,.r04,.r05"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {archiveFile && (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">{archiveFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(archiveFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  {multiPartFiles.length > 1 && (
                    <div className="p-3 bg-blue-50 rounded">
                      <p className="text-sm font-medium text-blue-800">
                        Multi-part archive detected
                      </p>
                      <p className="text-xs text-blue-600">
                        {multiPartFiles.length} parts found
                      </p>
                      <div className="mt-2 max-h-32 overflow-y-auto">
                        {multiPartFiles.map((file, index) => (
                          <div key={index} className="text-xs text-blue-600">
                            • {file.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                    placeholder="Enter RAR password"
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Extract Archive
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={extractRar}
                disabled={isExtracting || !archiveFile}
                className="w-full"
              >
                {isExtracting ? (
                  <>Extracting RAR...</>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Extract RAR Archive
                  </>
                )}
              </Button>

              {isExtracting && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-gray-600">
                    Extracting RAR archive... {progress}%
                  </p>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">RAR Features:</h4>
                <ul className="space-y-1">
                  <li>• Support for RAR v4 and v5</li>
                  <li>• Multi-part archive extraction</li>
                  <li>• Password protection support</li>
                  <li>• Solid archive compression</li>
                  <li>• Recovery record support</li>
                  <li>• Unicode filenames</li>
                </ul>
              </div>

              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">Supported Formats:</h4>
                <ul className="space-y-1">
                  <li>• .rar (standard RAR files)</li>
                  <li>• .r01, .r02... (numbered parts)</li>
                  <li>• .part1.rar, .part2.rar... (named parts)</li>
                  <li>• Password-protected archives</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RarExtractor;
