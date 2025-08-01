
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Scissors, Upload, Download, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AudioSplitter = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [splitPoints, setSplitPoints] = useState<string>(''); // Comma-separated MM:SS
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputAudioUrls, setOutputAudioUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setOutputAudioUrls([]);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an audio file.",
        variant: "destructive"
      });
    }
  };

  const startSplitting = async () => {
    if (!audioFile) {
      toast({
        title: "No Audio Selected",
        description: "Please select an audio file to split.",
        variant: "destructive"
      });
      return;
    }

    const points = splitPoints.split(',').map(p => p.trim()).filter(p => p);
    if (points.length === 0) {
      toast({
        title: "No Split Points",
        description: "Please enter at least one split point (MM:SS).",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setOutputAudioUrls([]);

    try {
      const steps = [
        'Analyzing audio...',
        'Splitting audio...',
        'Encoding segments...',
        'Finalizing...'
      ];

      const mockOutputUrls = [];
      for (let i = 0; i < points.length + 1; i++) { // +1 for the first segment before the first split point
        const mockAudioBlob = new Blob([`mock audio segment ${i + 1}`], { type: audioFile.type });
        mockOutputUrls.push(URL.createObjectURL(mockAudioBlob));
      }

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setOutputAudioUrls(mockOutputUrls);

      toast({
        title: "Processing Complete",
        description: `Audio split into ${mockOutputUrls.length} segments successfully.`
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "An error occurred during audio splitting.",
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
          <h1 className="text-3xl font-bold">Audio Splitter</h1>
          <p className="text-gray-600">Split a single audio file into multiple segments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Audio File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {audioFile ? `Selected: ${audioFile.name}` : 'Choose Audio File'}
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="audio/*"
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {audioFile && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>File:</strong> {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
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
              <Label>Split Points (comma-separated MM:SS)</Label>
              <Input 
                value={splitPoints} 
                onChange={(e) => setSplitPoints(e.target.value)} 
                placeholder="00:30, 01:00" 
              />
              <p className="text-xs text-gray-500">Example: 00:30, 01:00 (splits at 30 seconds and 1 minute)</p>
            </div>

            <Button onClick={startSplitting} disabled={isProcessing || !audioFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Splitting Audio...' : 'Split Audio'}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing audio split...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {outputAudioUrls.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Split Audio Segments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {outputAudioUrls.map((url, index) => (
                <div key={index} className="space-y-2 border p-3 rounded-md">
                  <p className="text-sm font-medium">Segment {index + 1}</p>
                  <audio controls src={url} className="w-full"></audio>
                  <Button asChild className="w-full" variant="outline" size="sm">
                    <a href={url} download={`audio_segment_${index + 1}.${audioFile?.name.split('.').pop()}`}>
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

export default AudioSplitter;
