
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Scissors, Upload, Download, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VideoSplitter = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [splitPoints, setSplitPoints] = useState<string>(''); // Comma-separated HH:MM:SS
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputVideoUrls, setOutputVideoUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setOutputVideoUrls([]);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a video file.",
        variant: "destructive"
      });
    }
  };

  const startSplitting = async () => {
    if (!videoFile) {
      toast({
        title: "No Video Selected",
        description: "Please select a video file to split.",
        variant: "destructive"
      });
      return;
    }

    const points = splitPoints.split(',').map(p => p.trim()).filter(p => p);
    if (points.length === 0) {
      toast({
        title: "No Split Points",
        description: "Please enter at least one split point (HH:MM:SS).",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setOutputVideoUrls([]);

    try {
      const steps = [
        'Analyzing video...',
        'Splitting video...',
        'Encoding segments...',
        'Finalizing...'
      ];

      const mockOutputUrls = [];
      for (let i = 0; i < points.length + 1; i++) { // +1 for the first segment before the first split point
        const mockVideoBlob = new Blob([`mock video segment ${i + 1}`], { type: videoFile.type });
        mockOutputUrls.push(URL.createObjectURL(mockVideoBlob));
      }

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setOutputVideoUrls(mockOutputUrls);

      toast({
        title: "Processing Complete",
        description: `Video split into ${mockOutputUrls.length} segments successfully.`
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "An error occurred during video splitting.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Scissors className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Video Splitter</h1>
          <p className="text-gray-600">Split a single video file into multiple segments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Video File</CardTitle>
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
            <CardTitle>Split Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Split Points (comma-separated HH:MM:SS)</Label>
              <Input 
                value={splitPoints} 
                onChange={(e) => setSplitPoints(e.target.value)} 
                placeholder="00:00:30, 00:01:00" 
              />
              <p className="text-xs text-gray-500">Example: 00:00:30, 00:01:00 (splits at 30 seconds and 1 minute)</p>
            </div>

            <Button onClick={startSplitting} disabled={isProcessing || !videoFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Splitting Video...' : 'Split Video'}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing video split...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {outputVideoUrls.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Split Video Segments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {outputVideoUrls.map((url, index) => (
                <div key={index} className="space-y-2 border p-3 rounded-md">
                  <p className="text-sm font-medium">Segment {index + 1}</p>
                  <video controls src={url} className="w-full rounded-md"></video>
                  <Button asChild className="w-full">
                    <a href={url} download={`video_segment_${index + 1}.${videoFile?.name.split('.').pop()}`}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Segment {index + 1}
                    </a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default VideoSplitter;
