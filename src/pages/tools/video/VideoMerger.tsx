
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Video, Upload, Download, Plus, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VideoMerger = () => {
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [outputFileName, setOutputFileName] = useState('merged_video.mp4');
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedVideoUrl, setMergedVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const videoOnlyFiles = files.filter(file => file.type.startsWith('video/'));
    if (videoOnlyFiles.length > 0) {
      setVideoFiles(prev => [...prev, ...videoOnlyFiles]);
      setMergedVideoUrl(null);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please select video files only.",
        variant: "destructive"
      });
    }
  };

  const removeFile = (index: number) => {
    setVideoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startMerging = async () => {
    if (videoFiles.length < 2) {
      toast({
        title: "Not Enough Videos",
        description: "Please select at least two video files to merge.",
        variant: "destructive"
      });
      return;
    }

    setIsMerging(true);
    setProgress(0);
    setMergedVideoUrl(null);

    try {
      const steps = [
        'Analyzing video files...',
        'Concatenating streams...',
        'Re-encoding output...',
        'Finalizing merged video...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Simulate merged video URL
      const mockVideoBlob = new Blob(['mock merged video content'], { type: 'video/mp4' });
      const url = URL.createObjectURL(mockVideoBlob);
      setMergedVideoUrl(url);

      toast({
        title: "Merging Complete",
        description: "Videos merged successfully."
      });
    } catch (error) {
      toast({
        title: "Merging Failed",
        description: "An error occurred during video merging.",
        variant: "destructive"
      });
    } finally {
      setIsMerging(false);
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
          <Video className="h-12 w-12 mx-auto text-green-600" />
          <h1 className="text-3xl font-bold">Video Merger</h1>
          <p className="text-gray-600">Combine multiple video clips into one file</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Video Files to Merge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Video Files
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              multiple 
              accept="video/*"
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {videoFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Videos ({videoFiles.length})</Label>
                <div className="max-h-40 overflow-y-auto border rounded p-2">
                  {videoFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-1 bg-gray-50 rounded mb-1">
                      <span>{file.name} ({formatFileSize(file.size)})</span>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                        X
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Merge Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Output File Name</Label>
              <Input 
                value={outputFileName} 
                onChange={(e) => setOutputFileName(e.target.value)} 
                placeholder="merged_video.mp4" 
              />
            </div>

            <Button onClick={startMerging} disabled={isMerging || videoFiles.length < 2} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isMerging ? 'Merging Videos...' : 'Merge Videos'}
            </Button>

            {isMerging && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing video merge...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {mergedVideoUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Merged Video Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <video controls src={mergedVideoUrl} className="w-full rounded-md"></video>
              <Button asChild className="w-full">
                <a href={mergedVideoUrl} download={outputFileName}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Merged Video
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default VideoMerger;
