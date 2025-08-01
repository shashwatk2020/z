
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Video, Upload, Download, Settings, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MOVVideoConverter = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState('mov');
  const [resolution, setResolution] = useState('original');
  const [bitrate, setBitrate] = useState('auto');
  const [frameRate, setFrameRate] = useState('original');
  const [aspectRatio, setAspectRatio] = useState('original');
  const [trimStart, setTrimStart] = useState('00:00:00');
  const [trimEnd, setTrimEnd] = useState('00:00:00');
  const [addWatermark, setAddWatermark] = useState(false);
  const [watermarkText, setWatermarkText] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedVideoUrl, setConvertedVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast(); // Provide a default empty function for toast

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setConvertedVideoUrl(null);
      // Simulate getting video duration for trim end default
      setTimeout(() => {
        const mockDuration = '00:01:30'; // Example duration
        setTrimEnd(mockDuration);
      }, 500);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a video file.",
        variant: "destructive"
      });
    }
  };

  const startConversion = async () => {
    if (!videoFile) {
      toast({
        title: "No Video Selected",
        description: "Please select a video file to convert.",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setConvertedVideoUrl(null);

    try {
      const steps = [
        'Analyzing video properties...',
        'Applying conversion settings...',
        'Processing video frames...',
        'Encoding audio...',
        'Finalizing output...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate longer process
      }

      // Simulate converted video URL
      const mockVideoBlob = new Blob(['mock video content'], { type: `video/${outputFormat}` });
      const url = URL.createObjectURL(mockVideoBlob);
      setConvertedVideoUrl(url);

      toast({
        title: "Conversion Complete",
        description: `Your video has been successfully converted to ${outputFormat.toUpperCase()}.`
      });
    } catch (error) {
      toast({
        title: "Conversion Failed",
        description: "An error occurred during video conversion.",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
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
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Video className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">MOV Video Converter</h1>
          <p className="text-gray-600">Convert videos to MOV with advanced settings</p>
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
                  <strong>File:</strong> {videoFile.name} ({formatFileSize(videoFile.size)})
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Conversion Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mov">MOV</SelectItem>
                    <SelectItem value="mp4">MP4</SelectItem>
                    <SelectItem value="avi">AVI</SelectItem>
                    <SelectItem value="webm">WebM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Resolution</Label>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Original</SelectItem>
                    <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                    <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                    <SelectItem value="854x480">854x480 (SD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Bitrate (kbps)</Label>
                <Input 
                  value={bitrate} 
                  onChange={(e) => setBitrate(e.target.value)} 
                  placeholder="Auto" 
                />
              </div>

              <div className="space-y-2">
                <Label>Frame Rate (fps)</Label>
                <Input 
                  value={frameRate} 
                  onChange={(e) => setFrameRate(e.target.value)} 
                  placeholder="Original" 
                />
              </div>

              <div className="space-y-2">
                <Label>Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Original</SelectItem>
                    <SelectItem value="16:9">16:9</SelectItem>
                    <SelectItem value="4:3">4:3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Trim Video (HH:MM:SS)</Label>
              <div className="flex space-x-2">
                <Input 
                  value={trimStart} 
                  onChange={(e) => setTrimStart(e.target.value)} 
                  placeholder="00:00:00" 
                />
                <Input 
                  value={trimEnd} 
                  onChange={(e) => setTrimEnd(e.target.value)} 
                  placeholder="00:00:00" 
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={addWatermark} 
                  onCheckedChange={(checked) => setAddWatermark(checked === true)} 
                />
                <Label>Add Watermark</Label>
              </div>
              {addWatermark && (
                <Input 
                  value={watermarkText} 
                  onChange={(e) => setWatermarkText(e.target.value)} 
                  placeholder="Enter watermark text" 
                />
              )}
            </div>

            <Button onClick={startConversion} disabled={isConverting || !videoFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isConverting ? 'Converting...' : 'Convert Video'}
            </Button>

            {isConverting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing video...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {convertedVideoUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Converted Video Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <video controls src={convertedVideoUrl} className="w-full rounded-md"></video>
              <Button asChild className="w-full">
                <a href={convertedVideoUrl} download={`converted_video.${outputFormat}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Converted Video
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default MOVVideoConverter;
