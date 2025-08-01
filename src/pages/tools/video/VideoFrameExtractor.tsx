
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Image, Upload, Download, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VideoFrameExtractor = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [timePoint, setTimePoint] = useState('00:00:01'); // HH:MM:SS
  const [frameFormat, setFrameFormat] = useState('png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedFrameUrl, setExtractedFrameUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setExtractedFrameUrl(null);
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
        description: "Please select a video file to extract frames.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setExtractedFrameUrl(null);

    try {
      const steps = [
        'Analyzing video...',
        'Extracting frame...',
        'Converting format...',
        'Finalizing...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simulate extracted frame URL
      const mockBlob = new Blob(['mock extracted frame image'], { type: `image/${frameFormat}` });
      const url = URL.createObjectURL(mockBlob);
      setExtractedFrameUrl(url);

      toast({
        title: "Processing Complete",
        description: "Frame extracted successfully."
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "An error occurred during frame extraction.",
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
          <Image className="h-12 w-12 mx-auto text-green-600" />
          <h1 className="text-3xl font-bold">Video Frame Extractor</h1>
          <p className="text-gray-600">Extract single frames from video at specified time points</p>
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
            <CardTitle>Extraction Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Time Point (HH:MM:SS)</Label>
              <Input 
                value={timePoint} 
                onChange={(e) => setTimePoint(e.target.value)} 
                placeholder="00:00:01" 
              />
              <p className="text-xs text-gray-500">Specify the exact time to extract the frame.</p>
            </div>

            <div className="space-y-2">
              <Label>Output Image Format</Label>
              <Select value={frameFormat} onValueChange={setFrameFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={startProcessing} disabled={isProcessing || !videoFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Extracting Frame...' : 'Extract Frame'}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing frame extraction...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {extractedFrameUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Extracted Frame Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <img src={extractedFrameUrl} alt="Extracted Video Frame" className="w-full h-auto rounded-md" />
              <Button asChild className="w-full">
                <a href={extractedFrameUrl} download={`extracted_frame.${frameFormat}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Frame
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default VideoFrameExtractor;
