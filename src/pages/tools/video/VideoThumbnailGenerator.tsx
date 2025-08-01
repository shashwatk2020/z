
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

const VideoThumbnailGenerator = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [timePoint, setTimePoint] = useState('00:00:01'); // HH:MM:SS
  const [thumbnailCount, setThumbnailCount] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setThumbnailUrls([]);
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
        description: "Please select a video file to generate thumbnails.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setThumbnailUrls([]);

    try {
      const steps = [
        'Analyzing video...',
        'Extracting frames...',
        'Generating thumbnails...',
        'Finalizing...'
      ];

      const generatedUrls = [];
      const count = parseInt(thumbnailCount);
      for (let i = 0; i < count; i++) {
        // Simulate thumbnail generation
        const mockBlob = new Blob(['mock thumbnail image'], { type: 'image/png' });
        generatedUrls.push(URL.createObjectURL(mockBlob));
      }

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setThumbnailUrls(generatedUrls);

      toast({
        title: "Processing Complete",
        description: `Generated ${generatedUrls.length} thumbnails successfully.`
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "An error occurred during thumbnail generation.",
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
          <Image className="h-12 w-12 mx-auto text-purple-600" />
          <h1 className="text-3xl font-bold">Video Thumbnail Generator</h1>
          <p className="text-gray-600">Generate high-quality thumbnails from your video files</p>
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
            <CardTitle>Thumbnail Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Time Point (HH:MM:SS)</Label>
              <Input 
                value={timePoint} 
                onChange={(e) => setTimePoint(e.target.value)} 
                placeholder="00:00:01" 
              />
              <p className="text-xs text-gray-500">Specify a time point to extract a single thumbnail.</p>
            </div>

            <div className="space-y-2">
              <Label>Number of Thumbnails</Label>
              <Input 
                type="number" 
                value={thumbnailCount} 
                onChange={(e) => setThumbnailCount(e.target.value)} 
                min="1" 
                max="10" 
              />
              <p className="text-xs text-gray-500">Generate multiple thumbnails at even intervals.</p>
            </div>

            <Button onClick={startProcessing} disabled={isProcessing || !videoFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Generating Thumbnails...' : 'Generate Thumbnails'}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing thumbnail generation...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {thumbnailUrls.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Generated Thumbnails
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {thumbnailUrls.map((url, index) => (
                <div key={index} className="space-y-2">
                  <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-auto rounded-md" />
                  <Button asChild className="w-full" variant="outline" size="sm">
                    <a href={url} download={`thumbnail_${index + 1}.png`}>
                      <Download className="h-3 w-3 mr-1" />
                      Download
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

export default VideoThumbnailGenerator;
