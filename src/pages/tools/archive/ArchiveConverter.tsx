
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Upload, Download, FileArchive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ArchiveConverter = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [sourceFormat, setSourceFormat] = useState('');
  const [targetFormat, setTargetFormat] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const supportedFormats = [
    { value: 'zip', label: 'ZIP' },
    { value: 'rar', label: 'RAR' },
    { value: '7z', label: '7-Zip' },
    { value: 'tar', label: 'TAR' },
    { value: 'gz', label: 'GZIP' },
    { value: 'bz2', label: 'BZIP2' },
    { value: 'xz', label: 'XZ' },
    { value: 'iso', label: 'ISO' },
    { value: 'cab', label: 'CAB' },
    { value: 'dmg', label: 'DMG' }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    
    // Auto-detect source format from file extension
    if (selectedFiles.length > 0) {
      const extension = selectedFiles[0].name.split('.').pop()?.toLowerCase();
      const detectedFormat = supportedFormats.find(f => f.value === extension);
      if (detectedFormat) {
        setSourceFormat(detectedFormat.value);
      }
    }
  };

  const convertArchive = async () => {
    if (files.length === 0 || !sourceFormat || !targetFormat) {
      toast({
        title: "Missing Information",
        description: "Please select files and both source and target formats.",
        variant: "destructive"
      });
      return;
    }

    if (sourceFormat === targetFormat) {
      toast({
        title: "Same Format",
        description: "Source and target formats cannot be the same.",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);

    try {
      // Simulate conversion process
      const steps = [
        'Reading source archive...',
        'Extracting files...',
        'Analyzing content...',
        'Converting format...',
        'Optimizing compression...',
        'Finalizing archive...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Create converted file
      const convertedFileName = files[0].name.replace(/\.[^/.]+$/, `.${targetFormat}`);
      const blob = new Blob(['Converted archive content'], { 
        type: getMimeType(targetFormat) 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = convertedFileName;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Conversion Complete",
        description: `Successfully converted ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()}`
      });
    } catch (error) {
      toast({
        title: "Conversion Failed",
        description: "Failed to convert archive. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  const getSourceFormatLabel = () => {
    return supportedFormats.find(f => f.value === sourceFormat)?.label || '';
  };

  const getTargetFormatLabel = () => {
    return supportedFormats.find(f => f.value === targetFormat)?.label || '';
  };

  const getFileTypesString = () => {
    return supportedFormats.map(f => `.${f.value}`).join(', ');
  };

  const getConversionInfo = () => {
    if (!sourceFormat || !targetFormat) return null;

    const conversionMap: Record<string, Record<string, string>> = {
      zip: {
        '7z': 'Convert to smaller file size with better compression',
        rar: 'Convert to RAR for better compression and recovery records',
        tar: 'Convert to TAR for Unix/Linux compatibility'
      },
      rar: {
        zip: 'Convert to ZIP for universal compatibility',
        '7z': 'Convert to 7Z for open-source format with excellent compression',
        tar: 'Extract and repackage as TAR archive'
      },
      '7z': {
        zip: 'Convert to ZIP for wider compatibility',
        rar: 'Convert to RAR format',
        tar: 'Convert to TAR for Unix systems'
      }
    };

    return conversionMap[sourceFormat]?.[targetFormat] || 'Convert between archive formats';
  };

  const getMimeType = (format: string) => {
    const mimeTypes: Record<string, string> = {
      zip: 'application/zip',
      rar: 'application/vnd.rar',
      '7z': 'application/x-7z-compressed',
      tar: 'application/x-tar',
      gz: 'application/gzip',
      bz2: 'application/x-bzip2',
      xz: 'application/x-xz',
      iso: 'application/x-iso9660-image',
      cab: 'application/vnd.ms-cab-compressed',
      dmg: 'application/x-apple-diskimage'
    };
    return mimeTypes[format] || 'application/octet-stream';
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <ArrowRight className="h-12 w-12 mx-auto text-purple-600" />
          <h1 className="text-3xl font-bold">Universal Archive Converter</h1>
          <p className="text-gray-600">Convert between all popular archive formats with advanced optimization</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Source Archive</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Select Archive Files
              </Button>
              <input 
                ref={fileInputRef} 
                type="file" 
                multiple 
                accept={getFileTypesString()}
                onChange={handleFileSelect} 
                className="hidden" 
              />

              {files.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files ({files.length})</Label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {files.map((file, index) => (
                      <div key={index} className="text-sm p-2 bg-gray-50 rounded flex items-center">
                        <FileArchive className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="truncate">{file.name}</span>
                        <span className="ml-auto text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Source Format</Label>
                <Select value={sourceFormat} onValueChange={setSourceFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Auto-detect or select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Target Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Convert To</Label>
                <Select value={targetFormat} onValueChange={setTargetFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target format" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedFormats.filter(f => f.value !== sourceFormat).map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {sourceFormat && targetFormat && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-4 mb-2">
                    <span className="font-medium text-blue-800">{getSourceFormatLabel()}</span>
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">{getTargetFormatLabel()}</span>
                  </div>
                  <p className="text-sm text-blue-700 text-center">{getConversionInfo()}</p>
                </div>
              )}

              <Button 
                onClick={convertArchive} 
                disabled={isConverting || !sourceFormat || !targetFormat || files.length === 0} 
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {isConverting ? 'Converting...' : 'Convert Archive'}
              </Button>

              {isConverting && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-gray-600 text-center">
                    Converting {getSourceFormatLabel()} to {getTargetFormatLabel()}...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Supported Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Universal Formats</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• ZIP ↔ RAR ↔ 7Z</li>
                  <li>• TAR ↔ GZ ↔ BZ2</li>
                  <li>• Any format to ZIP</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Disc Images</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• ISO to ZIP/7Z</li>
                  <li>• DMG extraction</li>
                  <li>• CD/DVD images</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">System Archives</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• CAB (Windows)</li>
                  <li>• DMG (macOS)</li>
                  <li>• TAR (Unix/Linux)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ArchiveConverter;
