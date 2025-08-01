
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Info, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VideoInfoAnalyzer = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoInfo(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a video file.",
        variant: "destructive"
      });
    }
  };

  const analyzeVideo = async () => {
    if (!videoFile) {
      toast({
        title: "No Video Selected",
        description: "Please select a video file to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate video analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      setVideoInfo({
        fileName: videoFile.name,
        fileSize: videoFile.size,
        fileType: videoFile.type,
        duration: '00:01:30',
        resolution: '1920x1080',
        frameRate: '30 fps',
        bitrate: '5000 kbps',
        codec: 'H.264',
        audioCodec: 'AAC',
        channels: 'Stereo',
        sampleRate: '48 kHz',
        metadata: {
          title: 'My Awesome Video',
          artist: 'Unknown',
          creationDate: '2023-10-26',
        },
      });

      toast({
        title: "Analysis Complete",
        description: "Video information extracted successfully."
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "An error occurred during video analysis.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
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
          <Info className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Video Info Analyzer</h1>
          <p className="text-gray-600">Extract detailed information about your video files</p>
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
            <CardTitle>Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={analyzeVideo} disabled={isAnalyzing || !videoFile} className="w-full">
              <Info className="h-4 w-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Video'}
            </Button>

            {isAnalyzing && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 text-center">Analyzing video information...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {videoInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Video Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>File Name:</strong> {videoInfo.fileName}</div>
              <div><strong>File Size:</strong> {formatFileSize(videoInfo.fileSize)}</div>
              <div><strong>File Type:</strong> {videoInfo.fileType}</div>
              <div><strong>Duration:</strong> {videoInfo.duration}</div>
              <div><strong>Resolution:</strong> {videoInfo.resolution}</div>
              <div><strong>Frame Rate:</strong> {videoInfo.frameRate}</div>
              <div><strong>Bitrate:</strong> {videoInfo.bitrate}</div>
              <div><strong>Video Codec:</strong> {videoInfo.codec}</div>
              <div><strong>Audio Codec:</strong> {videoInfo.audioCodec}</div>
              <div><strong>Audio Channels:</strong> {videoInfo.channels}</div>
              <div><strong>Sample Rate:</strong> {videoInfo.sampleRate}</div>
              <div className="pt-2">
                <h3 className="font-semibold">Metadata:</h3>
                {Object.entries(videoInfo.metadata).map(([key, value]) => (
                  <div key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default VideoInfoAnalyzer;
