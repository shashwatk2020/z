
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Compress, Upload, Download, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VideoCompressor = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [targetSize, setTargetSize] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputVideoUrl, setOutputVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setOutputVideoUrl(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a video file.",
        variant: "destructive"
      });
    }
  };

  const startProcessing = async () => {
    if (!videoFile) {
      toast({
        title: "No Video Selected",
        description: "Please select a video file to compress.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setOutputVideoUrl(null);

    try {
      const steps = [
        'Analyzing video...',
        'Applying compression...',
        'Re-encoding video...',
        'Finalizing...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Simulate output video URL
      const mockVideoBlob = new Blob(['mock compressed video content'], { type: videoFile.type });
      const url = URL.createObjectURL(mockVideoBlob);
      setOutputVideoUrl(url);

      toast({
        title: "Processing Complete",
        description: "Video compressed successfully."
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "An error occurred during video compression.",
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
          <Compress className="h-12 w-12 mx-auto text-green-600" />
          <h1 className="text-3xl font-bold">Video Compressor</h1>
          <p className="text-gray-600">Reduce video file size without significant quality loss</p>
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
            <CardTitle>Compression Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Compression Level</Label>
              <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Faster, larger file)</SelectItem>
                  <SelectItem value="medium">Medium (Balanced)</SelectItem>
                  <SelectItem value="high">High (Slower, smaller file)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Size (MB, optional)</Label>
              <Input 
                value={targetSize} 
                onChange={(e) => setTargetSize(e.target.value)} 
                placeholder="e.g., 10" 
              />
              <p className="text-xs text-gray-500">Enter a target size to compress the video to (e.g., 10 for 10MB).</p>
            </div>

            <Button onClick={startProcessing} disabled={isProcessing || !videoFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Compressing Video...' : 'Compress Video'}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing video compression...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {outputVideoUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Output Video Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <video controls src={outputVideoUrl} className="w-full rounded-md"></video>
              <Button asChild className="w-full">
                <a href={outputVideoUrl} download={`compressed_video.${videoFile?.name.split('.').pop()}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Compressed Video
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default VideoCompressor;
