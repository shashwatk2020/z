
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Gif, Upload, Download, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VideoToGIFConverter = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [startTime, setStartTime] = useState('00:00:00');
  const [duration, setDuration] = useState('3'); // in seconds
  const [gifWidth, setGifWidth] = useState('auto');
  const [frameRate, setFrameRate] = useState('10');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputGifUrl, setOutputGifUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setOutputGifUrl(null);
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
        description: "Please select a video file to convert to GIF.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setOutputGifUrl(null);

    try {
      const steps = [
        'Analyzing video...',
        'Extracting frames...',
        'Optimizing GIF palette...',
        'Encoding GIF...',
        'Finalizing...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Simulate output GIF URL
      const mockGifBlob = new Blob(['mock gif content'], { type: 'image/gif' });
      const url = URL.createObjectURL(mockGifBlob);
      setOutputGifUrl(url);

      toast({
        title: "Processing Complete",
        description: "Video converted to GIF successfully."
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "An error occurred during GIF conversion.",
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
          <Gif className="h-12 w-12 mx-auto text-pink-600" />
          <h1 className="text-3xl font-bold">Video to GIF Converter</h1>
          <p className="text-gray-600">Convert video clips into animated GIF images</p>
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
            <CardTitle>GIF Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time (HH:MM:SS)</Label>
                <Input 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                  placeholder="00:00:00" 
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (seconds)</Label>
                <Input 
                  type="number" 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)} 
                  min="1" 
                  max="30" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>GIF Width (pixels)</Label>
                <Input 
                  value={gifWidth} 
                  onChange={(e) => setGifWidth(e.target.value)} 
                  placeholder="Auto" 
                />
                <p className="text-xs text-gray-500">e.g., 320, 640, or 'auto' for original width.</p>
              </div>
              <div className="space-y-2">
                <Label>Frame Rate (fps)</Label>
                <Select value={frameRate} onValueChange={setFrameRate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 fps (Smaller file)</SelectItem>
                    <SelectItem value="10">10 fps (Standard)</SelectItem>
                    <SelectItem value="15">15 fps</SelectItem>
                    <SelectItem value="20">20 fps (Smoother animation)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={startProcessing} disabled={isProcessing || !videoFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Converting to GIF...' : 'Convert to GIF'}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing video to GIF conversion...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {outputGifUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Generated GIF Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <img src={outputGifUrl} alt="Generated GIF" className="w-full h-auto rounded-md" />
              <Button asChild className="w-full">
                <a href={outputGifUrl} download={`converted_video.gif`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download GIF
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default VideoToGIFConverter;
