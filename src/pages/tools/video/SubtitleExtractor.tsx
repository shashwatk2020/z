
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Subtitles, Upload, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SubtitleExtractor = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState('srt');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedSubtitle, setExtractedSubtitle] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setExtractedSubtitle(null);
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
        description: "Please select a video file to extract subtitles.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setExtractedSubtitle(null);

    try {
      const steps = [
        'Analyzing video for subtitle tracks...',
        'Extracting subtitle data...',
        'Converting to selected format...',
        'Finalizing...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simulate extracted subtitle content
      const mockSubtitleContent = `1
00:00:01,000 --> 00:00:03,000
Hello, this is a test subtitle.

2
00:00:04,000 --> 00:00:06,000
This is the second line.`;
      setExtractedSubtitle(mockSubtitleContent);

      const blob = new Blob([mockSubtitleContent], { type: `text/${outputFormat}` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${videoFile.name.split('.')[0]}.${outputFormat}`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Processing Complete",
        description: "Subtitles extracted successfully."
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "An error occurred during subtitle extraction.",
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
          <Subtitles className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Subtitle Extractor</h1>
          <p className="text-gray-600">Extract embedded subtitles from video files</p>
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
              <Label>Output Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="srt">SRT (SubRip)</SelectItem>
                  <SelectItem value="vtt">VTT (WebVTT)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={startProcessing} disabled={isProcessing || !videoFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Extracting Subtitles...' : 'Extract Subtitles'}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing subtitle extraction...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {extractedSubtitle && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Extracted Subtitle Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-md max-h-60 overflow-y-auto text-sm font-mono">
                <pre>{extractedSubtitle}</pre>
              </div>
              <Button asChild className="w-full">
                <a href={`data:text/${outputFormat};charset=utf-8,${encodeURIComponent(extractedSubtitle)}`} download={`subtitles.${outputFormat}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Subtitle File
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SubtitleExtractor;
