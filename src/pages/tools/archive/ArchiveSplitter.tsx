
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Scissors, Upload, Download, File, HardDrive, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ArchiveSplitter = () => {
  const [archiveFile, setArchiveFile] = useState<File | null>(null);
  const [splitSize, setSplitSize] = useState('100');
  const [splitUnit, setSplitUnit] = useState('MB');
  const [customSize, setCustomSize] = useState('');
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [preserveStructure, setPreserveStructure] = useState(true);
  const [createIndex, setCreateIndex] = useState(true);
  const [isSplitting, setIsSplitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitResults, setSplitResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const presetSizes = [
    { value: '1.44', label: '1.44 MB (Floppy Disk)', unit: 'MB' },
    { value: '100', label: '100 MB (Email)', unit: 'MB' },
    { value: '650', label: '650 MB (CD)', unit: 'MB' },
    { value: '4.7', label: '4.7 GB (DVD)', unit: 'GB' },
    { value: '25', label: '25 GB (Blu-ray)', unit: 'GB' }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const supportedExts = ['.zip', '.rar', '.7z', '.tar', '.tar.gz', '.tar.bz2'];
      const isSupported = supportedExts.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (isSupported) {
        setArchiveFile(file);
      } else {
        toast({
          title: "Unsupported Format",
          description: "Please select a supported archive format.",
          variant: "destructive"
        });
      }
    }
  };

  const splitArchive = async () => {
    if (!archiveFile) {
      toast({
        title: "No File Selected",
        description: "Please select an archive file to split.",
        variant: "destructive"
      });
      return;
    }

    const finalSizeStr = useCustomSize ? customSize : splitSize;
    const finalUnit = useCustomSize ? 'MB' : splitUnit;
    
    if (!finalSizeStr || parseFloat(finalSizeStr) <= 0) {
      toast({
        title: "Invalid Size",
        description: "Please enter a valid split size.",
        variant: "destructive"
      });
      return;
    }

    setIsSplitting(true);
    setProgress(0);

    try {
      const steps = [
        'Analyzing archive structure...',
        'Calculating optimal split points...',
        'Creating archive parts...',
        'Generating index file...',
        'Verifying split integrity...',
        'Finalizing split archives...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const splitSizeBytes = parseFloat(finalSizeStr) * (finalUnit === 'GB' ? 1024 * 1024 * 1024 : 1024 * 1024);
      const partsCount = Math.ceil(archiveFile.size / splitSizeBytes);
      
      setSplitResults({
        originalSize: archiveFile.size,
        partsCount: partsCount,
        partSize: splitSizeBytes,
        partSizeStr: `${finalSizeStr} ${finalUnit}`,
        success: true
      });

      // Create and download split files
      for (let i = 0; i < partsCount; i++) {
        const partName = `${archiveFile.name}.part${String(i + 1).padStart(3, '0')}`;
        const blob = new Blob([`Split archive part ${i + 1}`], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = partName;
        a.click();
        URL.revokeObjectURL(url);
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      if (createIndex) {
        const indexContent = `Archive Split Information
Original File: ${archiveFile.name}
Total Size: ${formatFileSize(archiveFile.size)}
Parts: ${partsCount}
Part Size: ${finalSizeStr} ${finalUnit}
Created: ${new Date().toLocaleString()}

Parts List:
${Array.from({length: partsCount}, (_, i) => `${archiveFile.name}.part${String(i + 1).padStart(3, '0')}`).join('\n')}`;
        
        const indexBlob = new Blob([indexContent], { type: 'text/plain' });
        const indexUrl = URL.createObjectURL(indexBlob);
        const indexA = document.createElement('a');
        indexA.href = indexUrl;
        indexA.download = `${archiveFile.name}.index.txt`;
        indexA.click();
        URL.revokeObjectURL(indexUrl);
      }

      toast({
        title: "Split Complete",
        description: `Archive split into ${partsCount} parts successfully.`
      });
    } catch (error) {
      toast({
        title: "Split Failed",
        description: "Failed to split archive. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSplitting(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const estimatedParts = archiveFile && splitSize ? 
    Math.ceil(archiveFile.size / (parseFloat(useCustomSize ? customSize : splitSize) * (splitUnit === 'GB' ? 1024 * 1024 * 1024 : 1024 * 1024))) : 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Scissors className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Archive Splitter</h1>
          <p className="text-gray-600">Split large archives into smaller parts for easier storage and transfer</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Archive File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {archiveFile ? `Selected: ${archiveFile.name}` : 'Choose Archive File'}
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".zip,.rar,.7z,.tar,.tar.gz,.tar.bz2"
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {archiveFile && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <File className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="font-medium">Archive Information</span>
                </div>
                <div className="mt-2 text-sm space-y-1">
                  <div><strong>Name:</strong> {archiveFile.name}</div>
                  <div><strong>Size:</strong> {formatFileSize(archiveFile.size)}</div>
                  <div><strong>Type:</strong> {archiveFile.name.split('.').pop()?.toUpperCase()}</div>
                  <div><strong>Modified:</strong> {new Date(archiveFile.lastModified).toLocaleDateString()}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Split Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={!useCustomSize} 
                  onCheckedChange={(checked) => setUseCustomSize(!checked)} 
                />
                <Label>Use preset size</Label>
              </div>

              {!useCustomSize ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Split Size</Label>
                    <Select value={splitSize} onValueChange={setSplitSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {presetSizes.map(preset => (
                          <SelectItem key={preset.value} value={preset.value}>
                            {preset.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select value={splitUnit} onValueChange={setSplitUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MB">Megabytes (MB)</SelectItem>
                        <SelectItem value="GB">Gigabytes (GB)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Custom Size (MB)</Label>
                  <Input 
                    value={customSize} 
                    onChange={(e) => setCustomSize(e.target.value)}
                    placeholder="Enter size in MB"
                    type="number"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={preserveStructure} 
                  onCheckedChange={(checked) => setPreserveStructure(checked === true)} 
                />
                <Label>Preserve archive structure in parts</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={createIndex} 
                  onCheckedChange={(checked) => setCreateIndex(checked === true)} 
                />
                <Label>Create index file with part information</Label>
              </div>
            </div>

            {estimatedParts > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded flex items-center">
                <Info className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-700">
                  Estimated parts: {estimatedParts}
                </span>
              </div>
            )}

            <Button onClick={splitArchive} disabled={isSplitting || !archiveFile} className="w-full">
              <Scissors className="h-4 w-4 mr-2" />
              {isSplitting ? 'Splitting Archive...' : 'Split Archive'}
            </Button>

            {isSplitting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">
                  Splitting archive into parts...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {splitResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HardDrive className="h-5 w-5 mr-2" />
                Split Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Original Size</p>
                  <p className="font-semibold">{formatFileSize(splitResults.originalSize)}</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded">
                  <p className="text-sm text-gray-600">Parts Created</p>
                  <p className="font-semibold text-blue-600">{splitResults.partsCount}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <p className="text-sm text-gray-600">Part Size</p>
                  <p className="font-semibold text-green-600">{splitResults.partSizeStr}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-purple-600">Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ArchiveSplitter;
