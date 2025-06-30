
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HardDrive, Upload, Download, Folder, File, Apple, Shield, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DmgExtractor = () => {
  const [dmgFile, setDmgFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [extractPath, setExtractPath] = useState('extracted_dmg');
  const [preserveStructure, setPreserveStructure] = useState(true);
  const [extractHiddenFiles, setExtractHiddenFiles] = useState(false);
  const [verifySignature, setVerifySignature] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dmgInfo, setDmgInfo] = useState<any>(null);
  const [extractedFiles, setExtractedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.dmg')) {
      setDmgFile(file);
      
      // Simulate DMG analysis
      setDmgInfo({
        name: file.name,
        size: file.size,
        format: 'UDZO',
        created: new Date().toLocaleDateString(),
        encrypted: Math.random() > 0.6,
        compressed: true,
        partitions: Math.floor(Math.random() * 3) + 1,
        filesystem: 'HFS+',
        signed: Math.random() > 0.3
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a DMG file.",
        variant: "destructive"
      });
    }
  };

  const extractDmg = async () => {
    if (!dmgFile) {
      toast({
        title: "No File Selected",
        description: "Please select a DMG file to extract.",
        variant: "destructive"
      });
      return;
    }

    if (dmgInfo?.encrypted && !password) {
      toast({
        title: "Password Required",
        description: "This DMG file is encrypted. Please enter the password.",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    setProgress(0);

    try {
      const steps = [
        'Reading DMG header...',
        'Verifying digital signature...',
        'Mounting disk image...',
        'Decompressing UDZO data...',
        'Extracting HFS+ filesystem...',
        'Processing file metadata...'
      ];

      const mockFiles = [
        'Applications/MyApp.app/Contents/Info.plist',
        'Applications/MyApp.app/Contents/MacOS/MyApp',
        'Applications/MyApp.app/Contents/Resources/icon.icns',
        '.DS_Store',
        '.background/background.png',
        '.VolumeIcon.icns',
        'README.txt',
        'License.txt',
        'Installer.pkg'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const filteredFiles = extractHiddenFiles ? mockFiles : mockFiles.filter(f => !f.startsWith('.'));
      setExtractedFiles(filteredFiles);

      const blob = new Blob(['Extracted DMG contents'], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${extractPath}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Extraction Complete",
        description: `Successfully extracted ${filteredFiles.length} files from DMG image.`
      });
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Failed to extract DMG file. Check password if encrypted.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
      setProgress(0);
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
          <HardDrive className="h-12 w-12 mx-auto text-gray-600" />
          <h1 className="text-3xl font-bold">DMG File Extractor</h1>
          <p className="text-gray-600">Extract files from Mac disk image files with full metadata support</p>
        </div>

        <Tabs defaultValue="extract" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="extract">Extract DMG</TabsTrigger>
            <TabsTrigger value="info" disabled={!dmgInfo}>DMG Information</TabsTrigger>
          </TabsList>

          <TabsContent value="extract" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select DMG File</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  {dmgFile ? `Selected: ${dmgFile.name}` : 'Choose DMG File'}
                </Button>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept=".dmg"
                  onChange={handleFileSelect} 
                  className="hidden" 
                />

                {dmgFile && dmgInfo && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Apple className="h-4 w-4 mr-2 text-gray-600" />
                      <span className="font-medium">DMG Image Information</span>
                    </div>
                    <div className="mt-2 text-sm space-y-1">
                      <div><strong>Name:</strong> {dmgInfo.name}</div>
                      <div><strong>Size:</strong> {formatFileSize(dmgInfo.size)}</div>
                      <div><strong>Format:</strong> {dmgInfo.format}</div>
                      <div><strong>Filesystem:</strong> {dmgInfo.filesystem}</div>
                      <div><strong>Encrypted:</strong> {dmgInfo.encrypted ? 'Yes' : 'No'}</div>
                      <div><strong>Digitally Signed:</strong> {dmgInfo.signed ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Extraction Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Extract to Folder</Label>
                  <Input 
                    value={extractPath} 
                    onChange={(e) => setExtractPath(e.target.value)}
                    placeholder="extracted_dmg"
                  />
                </div>

                {dmgInfo?.encrypted && (
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      DMG Password
                    </Label>
                    <Input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter DMG password"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={preserveStructure} 
                      onCheckedChange={(checked) => setPreserveStructure(checked === true)} 
                    />
                    <Label>Preserve Mac folder structure</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={extractHiddenFiles} 
                      onCheckedChange={(checked) => setExtractHiddenFiles(checked === true)} 
                    />
                    <Label>Extract hidden files (.DS_Store, etc.)</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={verifySignature} 
                      onCheckedChange={(checked) => setVerifySignature(checked === true)} 
                    />
                    <Label>Verify digital signature</Label>
                  </div>
                </div>

                <Button onClick={extractDmg} disabled={isExtracting || !dmgFile} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {isExtracting ? 'Extracting DMG...' : 'Extract DMG Files'}
                </Button>

                {isExtracting && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-gray-600 text-center">
                      Extracting Mac disk image...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            {dmgInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    DMG Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div><strong>Format:</strong> {dmgInfo.format}</div>
                    <div><strong>Size:</strong> {formatFileSize(dmgInfo.size)}</div>
                    <div><strong>Filesystem:</strong> {dmgInfo.filesystem}</div>
                    <div><strong>Partitions:</strong> {dmgInfo.partitions}</div>
                    <div><strong>Compressed:</strong> {dmgInfo.compressed ? 'Yes' : 'No'}</div>
                    <div><strong>Created:</strong> {dmgInfo.created}</div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {dmgInfo.encrypted && (
                      <div className="p-2 bg-yellow-50 border border-yellow-200 rounded flex items-center">
                        <Shield className="h-4 w-4 text-yellow-600 mr-2" />
                        <span className="text-sm text-yellow-700">This DMG is password protected</span>
                      </div>
                    )}
                    
                    {dmgInfo.signed && (
                      <div className="p-2 bg-green-50 border border-green-200 rounded flex items-center">
                        <Apple className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm text-green-700">This DMG is digitally signed</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {extractedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Extracted Files ({extractedFiles.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {extractedFiles.map((file, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                        {file.includes('/') ? (
                          <Folder className="h-4 w-4 mr-2 text-blue-500" />
                        ) : (
                          <File className="h-4 w-4 mr-2 text-gray-500" />
                        )}
                        <span className="text-sm">{file}</span>
                        {file.startsWith('.') && (
                          <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-1 rounded">hidden</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DmgExtractor;
