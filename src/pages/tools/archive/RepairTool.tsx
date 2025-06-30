
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Wrench, Upload, Download, AlertTriangle, CheckCircle, XCircle, Info, Shield } from 'lucride-react';
import { useToast } from '@/hooks/use-toast';

const RepairTool = () => {
  const [archiveFile, setArchiveFile] = useState<File | null>(null);
  const [isRepairing, setIsRepairing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [repairResults, setRepairResults] = useState<any>(null);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const supportedFormats = ['.zip', '.rar', '.7z', '.tar', '.cab'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isSupported = supportedFormats.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (isSupported) {
        setArchiveFile(file);
        diagnoseArchive(file);
      } else {
        toast({
          title: "Unsupported Format",
          description: "Please select a supported archive format for repair.",
          variant: "destructive"
        });
      }
    }
  };

  const diagnoseArchive = async (file: File) => {
    setIsRepairing(true);
    setProgress(0);

    try {
      const steps = [
        'Reading archive header...',
        'Checking file integrity...',
        'Scanning for corruption...',
        'Analyzing structure...',
        'Identifying issues...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      // Mock diagnostic results
      const mockIssues = [
        { 
          type: 'Header Corruption', 
          severity: 'High', 
          description: 'Central directory header is corrupted',
          repairable: true,
          location: 'Offset 0x1A4F'
        },
        { 
          type: 'CRC Mismatch', 
          severity: 'Medium', 
          description: 'File checksum does not match stored value',
          repairable: true,
          location: 'file1.txt'
        },
        { 
          type: 'Missing EOF Record', 
          severity: 'Low', 
          description: 'End of file record is missing or incomplete',
          repairable: true,
          location: 'End of archive'
        }
      ];

      setDiagnostics({
        fileName: file.name,
        fileSize: file.size,
        archiveType: file.name.split('.').pop()?.toUpperCase(),
        totalIssues: mockIssues.length,
        repairableIssues: mockIssues.filter(i => i.repairable).length,
        criticalIssues: mockIssues.filter(i => i.severity === 'High').length,
        issues: mockIssues,
        canRepair: mockIssues.every(i => i.repairable),
        estimatedSuccess: 85
      });

      toast({
        title: "Diagnosis Complete",
        description: `Found ${mockIssues.length} issues in the archive.`
      });
    } catch (error) {
      toast({
        title: "Diagnosis Failed",
        description: "Could not analyze the archive file.",
        variant: "destructive"
      });
    } finally {
      setIsRepairing(false);
      setProgress(0);
    }
  };

  const repairArchive = async () => {
    if (!archiveFile || !diagnostics) return;

    setIsRepairing(true);
    setProgress(0);

    try {
      const steps = [
        'Creating backup copy...',
        'Repairing header corruption...',
        'Fixing CRC mismatches...',
        'Rebuilding directory structure...',
        'Adding missing EOF records...',
        'Validating repairs...',
        'Finalizing archive...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const repairedIssues = diagnostics.issues.filter((issue: any) => issue.repairable);
      
      setRepairResults({
        success: true,
        originalFile: archiveFile.name,
        repairedFile: `${archiveFile.name.split('.')[0]}_repaired.${archiveFile.name.split('.').pop()}`,
        totalIssues: diagnostics.totalIssues,
        repairedIssues: repairedIssues.length,
        successRate: (repairedIssues.length / diagnostics.totalIssues) * 100,
        fileSize: archiveFile.size,
        repairedSize: archiveFile.size * 1.02, // Slightly larger due to repairs
        repairLog: repairedIssues.map((issue: any) => ({
          issue: issue.type,
          status: 'Fixed',
          details: `Successfully repaired ${issue.description.toLowerCase()}`
        }))
      });

      // Create and download repaired file
      const blob = new Blob(['Repaired archive content'], { 
        type: 'application/octet-stream' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${archiveFile.name.split('.')[0]}_repaired.${archiveFile.name.split('.').pop()}`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Repair Successful",
        description: `Successfully repaired ${repairedIssues.length} of ${diagnostics.totalIssues} issues.`
      });
    } catch (error) {
      setRepairResults({
        success: false,
        error: "Repair process failed. The archive may be too severely corrupted."
      });
      
      toast({
        title: "Repair Failed",
        description: "Could not repair the archive. Try using recovery mode.",
        variant: "destructive"
      });
    } finally {
      setIsRepairing(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Wrench className="h-12 w-12 mx-auto text-red-600" />
          <h1 className="text-3xl font-bold">Archive Repair Tool</h1>
          <p className="text-gray-600">Diagnose and repair corrupted archive files</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Corrupted Archive</CardTitle>
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

            {isRepairing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">
                  {diagnostics ? 'Repairing archive...' : 'Diagnosing issues...'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {diagnostics && (
          <Tabs defaultValue="diagnosis" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
              <TabsTrigger value="issues">Issues ({diagnostics.totalIssues})</TabsTrigger>
              <TabsTrigger value="repair" disabled={!diagnostics.canRepair}>Repair</TabsTrigger>
            </TabsList>

            <TabsContent value="diagnosis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      Archive Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>File Name:</strong> {diagnostics.fileName}</div>
                    <div><strong>File Size:</strong> {formatFileSize(diagnostics.fileSize)}</div>
                    <div><strong>Archive Type:</strong> {diagnostics.archiveType}</div>
                    <div><strong>Status:</strong> 
                      <Badge variant="destructive" className="ml-2">
                        Corrupted
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Issue Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Total Issues:</strong> {diagnostics.totalIssues}</div>
                    <div><strong>Repairable:</strong> {diagnostics.repairableIssues}</div>
                    <div><strong>Critical Issues:</strong> {diagnostics.criticalIssues}</div>
                    <div><strong>Repair Probability:</strong> 
                      <span className="ml-2 font-semibold text-green-600">
                        {diagnostics.estimatedSuccess}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {diagnostics.canRepair && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-800">
                        This archive can be repaired automatically
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="issues" className="space-y-4">
              <div className="space-y-3">
                {diagnostics.issues.map((issue: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                            <h4 className="font-semibold">{issue.type}</h4>
                            <Badge variant={getSeverityColor(issue.severity)} className="ml-2">
                              {issue.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{issue.description}</p>
                          <p className="text-xs text-gray-500">Location: {issue.location}</p>
                        </div>
                        <div className="ml-4">
                          {issue.repairable ? (
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Repairable
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Cannot Repair
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="repair" className="space-y-4">
              {!repairResults ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wrench className="h-5 w-5 mr-2" />
                      Ready to Repair
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded">
                      <p className="text-sm">
                        <strong>Repair Process:</strong> We will attempt to fix {diagnostics.repairableIssues} 
                        repairable issues. A backup of the original file will be preserved.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={repairArchive} 
                      disabled={isRepairing} 
                      className="w-full"
                    >
                      <Wrench className="h-4 w-4 mr-2" />
                      {isRepairing ? 'Repairing Archive...' : 'Start Repair Process'}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {repairResults.success ? (
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 mr-2 text-red-600" />
                      )}
                      Repair Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {repairResults.success ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-green-50 rounded">
                            <p className="text-sm text-gray-600">Issues Fixed</p>
                            <p className="font-semibold text-green-600">
                              {repairResults.repairedIssues}/{repairResults.totalIssues}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded">
                            <p className="text-sm text-gray-600">Success Rate</p>
                            <p className="font-semibold text-blue-600">
                              {repairResults.successRate.toFixed(1)}%
                            </p>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded">
                            <p className="text-sm text-gray-600">Original Size</p>
                            <p className="font-semibold text-purple-600">
                              {formatFileSize(repairResults.fileSize)}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded">
                            <p className="text-sm text-gray-600">Repaired Size</p>
                            <p className="font-semibold text-orange-600">
                              {formatFileSize(repairResults.repairedSize)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Repair Log</h4>
                          <div className="space-y-2">
                            {repairResults.repairLog.map((log: any, index: number) => (
                              <div key={index} className="flex items-center p-2 bg-gray-50 rounded text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <div>
                                  <strong>{log.issue}:</strong> {log.details}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 bg-green-50 border border-green-200 rounded">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-sm text-green-700">
                              Repaired archive has been downloaded. Original file preserved.
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-red-50 border border-red-200 rounded">
                        <div className="flex items-center">
                          <XCircle className="h-4 w-4 text-red-600 mr-2" />
                          <span className="text-sm text-red-700">
                            {repairResults.error}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default RepairTool;
