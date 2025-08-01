
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wrench, Upload, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VideoRepairTool = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isRepairing, setIsRepairing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [repairResults, setRepairResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setRepairResults(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a video file.",
        variant: "destructive"
      });
    }
  };

  const startRepair = async () => {
    if (!videoFile) {
      toast({
        title: "No Video Selected",
        description: "Please select a video file to repair.",
        variant: "destructive"
      });
      return;
    }

    setIsRepairing(true);
    setProgress(0);
    setRepairResults(null);

    try {
      const steps = [
        'Analyzing video file for corruption...',
        'Identifying damaged frames/headers...',
        'Attempting to repair...',
        'Reconstructing video stream...',
        'Finalizing repaired video...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Simulate repair success/failure
      const success = Math.random() > 0.2; // 80% success rate

      if (success) {
        const mockVideoBlob = new Blob(['mock repaired video content'], { type: videoFile.type });
        const url = URL.createObjectURL(mockVideoBlob);
        setRepairResults({
          success: true,
          message: "Video repaired successfully!",
          downloadUrl: url,
          originalSize: videoFile.size,
          repairedSize: videoFile.size * 0.98 // Slightly smaller or similar
        });

        toast({
          title: "Repair Complete",
          description: "Your video has been successfully repaired."
        });
      } else {
        setRepairResults({
          success: false,
          message: "Failed to repair video. The corruption might be too severe."
        });
        toast({
          title: "Repair Failed",
          description: "Could not repair the video file.",
          variant: "destructive"
        });
      }

    } catch (error) {
      toast({
        title: "Repair Failed",
        description: "An unexpected error occurred during repair.",
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Wrench className="h-12 w-12 mx-auto text-red-600" />
          <h1 className="text-3xl font-bold">Video Repair Tool</h1>
          <p className="text-gray-600">Repair corrupted or unplayable video files</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Corrupted Video File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {videoFile ? `Selected: ${videoFile.name}` : 'Choose Video File'}
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="video/*"
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {videoFile && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>File:</strong> {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Repair Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={startRepair} disabled={isRepairing || !videoFile} className="w-full">
              <Wrench className="h-4 w-4 mr-2" />
              {isRepairing ? 'Repairing Video...' : 'Start Repair'}
            </Button>

            {isRepairing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing video repair...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {repairResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {repairResults.success ? (
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                )}
                Repair Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg ${repairResults.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className={`font-medium ${repairResults.success ? 'text-green-800' : 'text-red-800'}`}>
                  {repairResults.message}
                </p>
              </div>

              {repairResults.success && repairResults.downloadUrl && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Original Size:</strong> {formatFileSize(repairResults.originalSize)}</div>
                    <div><strong>Repaired Size:</strong> {formatFileSize(repairResults.repairedSize)}</div>
                  </div>
                  <Button asChild className="w-full">
                    <a href={repairResults.downloadUrl} download={`repaired_${videoFile?.name}`}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Repaired Video
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default VideoRepairTool;
