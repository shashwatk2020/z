
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Download, Youtube, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VideoDownloader = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [quality, setQuality] = useState('720p');
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadedVideoUrl, setDownloadedVideoUrl] = useState<string | null>(null);
  const { toast = () => {} } = useToast();

  const startDownload = async () => {
    if (!videoUrl) {
      toast({
        title: "No URL Provided",
        description: "Please enter a video URL to download.",
        variant: "destructive"
      });
      return;
    }

    setIsDownloading(true);
    setProgress(0);
    setDownloadedVideoUrl(null);

    try {
      const steps = [
        'Fetching video information...',
        'Analyzing available qualities...',
        'Initiating download...',
        'Processing video stream...',
        'Finalizing download...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Simulate downloaded video URL
      const mockVideoBlob = new Blob(['mock downloaded video content'], { type: `video/${outputFormat}` });
      const url = URL.createObjectURL(mockVideoBlob);
      setDownloadedVideoUrl(url);

      toast({
        title: "Download Complete",
        description: "Video downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "An error occurred during video download. Check URL or try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
      setProgress(0);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Youtube className="h-12 w-12 mx-auto text-red-600" />
          <h1 className="text-3xl font-bold">Video Downloader</h1>
          <p className="text-gray-600">Download videos from popular online platforms for offline viewing</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter Video URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input 
                id="videoUrl" 
                type="url" 
                value={videoUrl} 
                onChange={(e) => setVideoUrl(e.target.value)} 
                placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quality</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                    <SelectItem value="720p">720p (HD)</SelectItem>
                    <SelectItem value="480p">480p (SD)</SelectItem>
                    <SelectItem value="360p">360p</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp4">MP4</SelectItem>
                    <SelectItem value="webm">WebM</SelectItem>
                    <SelectItem value="avi">AVI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={startDownload} disabled={isDownloading || !videoUrl} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download Video'}
            </Button>

            {isDownloading && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing download...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {downloadedVideoUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Downloaded Video Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <video controls src={downloadedVideoUrl} className="w-full rounded-md"></video>
              <Button asChild className="w-full">
                <a href={downloadedVideoUrl} download={`downloaded_video.${outputFormat}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Video
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default VideoDownloader;
