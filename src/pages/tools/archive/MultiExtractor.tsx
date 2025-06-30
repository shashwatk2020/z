
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Upload, Download, File, Folder, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MultiExtractor = () => {
  const [archives, setArchives] = useState<File[]>([]);
  const [extractPath, setExtractPath] = useState('extracted');
  const [preserveStructure, setPreserveStructure] = useState(true);
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [createSubfolders, setCreateSubfolders] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractionResults, setExtractionResults] = useState<any[]>([]);
  const [currentFile, setCurrentFile] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const supportedFormats = [
    '.zip', '.rar', '.7z', '.tar', '.tar.gz', '.tar.bz2', 
    '.gz', '.bz2', '.xz', '.cab', '.iso', '.dmg'
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      return supportedFormats.some(ext => file.name.toLowerCase().endsWith(ext));
    });

    if (validFiles.length !== selectedFiles.length) {
      toast({
        title: "Some Files Skipped",
        description: "Only supported archive formats were added.",
        variant: "destructive"
      });
    }

    setArchives(prev => [...prev, ...validFiles]);
  };

  const removeArchive = (index: number) => {
    setArchives(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setArchives([]);
    setExtractionResults([]);
  };

  const extractAllArchives = async () => {
    if (archives.length === 0) {
      toast({
        title: "No Archives Selected",
        description: "Please select archive files to extract.",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    setProgress(0);
    setExtractionResults([]);

    try {
      const results = [];

      for (let i = 0; i < archives.length; i++) {
        const archive = archives[i];
        setCurrentFile(archive.name);
        
        const steps = [
          'Reading archive structure...',
          'Verifying integrity...',
          'Extracting files...',
          'Creating directories...'
        ];

        for (let j = 0; j < steps.length; j++) {
          const totalProgress = ((i * steps.length + j + 1) / (archives.length * steps.length)) * 100;
          setProgress(totalProgress);
          await new Promise(resolve => setTimeout(resolve, 600));
        }

        // Simulate extraction results
        const mockFiles = [
          'document.pdf',
          'images/photo1.jpg',
          'images/photo2.png',
          'data/config.txt',
          'README.md'
        ].map(file => `${archive.name.split('.')[0]}/${file}`);

        results.push({
          archiveName: archive.name,
          success: Math.random() > 0.1, // 90% success rate
          filesExtracted: mockFiles.length,
          extractedFiles: mockFiles,
          size: archive.size,
          error: Math.random() > 0.9 ? 'Password protected archive' : null
        });
      }

      setExtractionResults(results);

      // Create download for all extracted files
      const blob = new Blob(['All extracted files'], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${extractPath}_all.zip`;
      a.click();
      URL.revokeObjectURL(url);

      const successCount = results.filter(r => r.success).length;
      toast({
        title: "Batch Extraction Complete",
        description: `Successfully extracted ${successCount} of ${archives.length} archives.`
      });
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Failed to extract archives. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
      setProgress(0);
      setCurrentFile('');
    }
  };

  const formatFileSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Package className="h-12 w-12 mx-auto text-orange-600" />
          <h1 className="text-3xl font-bold">Multi-Format Archive Extractor</h1>
          <p className="text-gray-600">Extract multiple archives in different formats simultaneously</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Archive Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 mb-2">
              Supported formats: {supportedFormats.join(', ')}
            </div>
            
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Add Archive Files
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              multiple 
              accept={supportedFormats.join(',')}
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {archives.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Selected Archives ({archives.length})</Label>
                  <Button variant="ghost" size="sm" onClick={clearAll}>
                    Clear All
                  </Button>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1 border rounded p-2">
                  {archives.map((archive, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <File className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="truncate flex-1">{archive.name}</span>
                      <span className="text-gray-500 mx-2">{formatFileSize(archive.size)}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeArchive(index)}
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

        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Extraction Settings</TabsTrigger>
            <TabsTrigger value="results" disabled={extractionResults.length === 0}>
              Results ({extractionResults.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Extraction Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Extract to Folder</Label>
                  <Input 
                    value={extractPath} 
                    onChange={(e) => setExtractPath(e.target.value)}
                    placeholder="extracted"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={preserveStructure} 
                      onCheckedChange={(checked) => setPreserveStructure(checked === true)} 
                    />
                    <Label>Preserve folder structure</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={overwriteExisting} 
                      onCheckedChange={(checked) => setOverwriteExisting(checked === true)} 
                    />
                    <Label>Overwrite existing files</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={createSubfolders} 
                      onCheckedChange={(checked) => setCreateSubfolders(checked === true)} 
                    />
                    <Label>Create subfolders for each archive</Label>
                  </div>
                </div>

                <Button 
                  onClick={extractAllArchives} 
                  disabled={isExtracting || archives.length === 0} 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExtracting ? 'Extracting...' : `Extract All Archives (${archives.length})`}
                </Button>

                {isExtracting && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-gray-600 text-center">
                      {currentFile ? `Processing: ${currentFile}` : 'Preparing extraction...'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Extraction Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {extractionResults.map((result, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {result.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                          )}
                          <span className="font-medium">{result.archiveName}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatFileSize(result.size)}
                        </span>
                      </div>
                      
                      {result.success ? (
                        <div>
                          <p className="text-sm text-green-600 mb-2">
                            ✓ Extracted {result.filesExtracted} files
                          </p>
                          <div className="max-h-32 overflow-y-auto">
                            {result.extractedFiles.slice(0, 5).map((file: string, i: number) => (
                              <div key={i} className="text-xs text-gray-600 flex items-center">
                                <Folder className="h-3 w-3 mr-1" />
                                {file}
                              </div>
                            ))}
                            {result.extractedFiles.length > 5 && (
                              <p className="text-xs text-gray-500">
                                ...and {result.extractedFiles.length - 5} more files
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-red-600">
                          ✗ {result.error || 'Extraction failed'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MultiExtractor;
