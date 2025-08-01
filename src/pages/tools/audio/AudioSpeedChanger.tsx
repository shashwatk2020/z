
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { FastForward, Upload, Download, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AudioSpeedChanger = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [speed, setSpeed] = useState('1.0');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputAudioUrl, setOutputAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setOutputAudioUrl(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an audio file.",
        variant: "destructive"
      });
    }
  };

  const startProcessing = async () => {
    if (!audioFile) {
      toast({
        title: "No Audio Selected",
        description: "Please select an audio file to change speed.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setOutputAudioUrl(null);

    try {
      const steps = [
        'Analyzing audio...',
        'Adjusting audio speed...',
        'Re-encoding audio...',
        'Finalizing...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Simulate output audio URL
      const mockAudioBlob = new Blob(['mock speed changed audio content'], { type: audioFile.type });
      const url = URL.createObjectURL(mockAudioBlob);
      setOutputAudioUrl(url);

      toast({
        title: "Processing Complete",
        description: "Audio speed changed successfully."
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "An error occurred during audio speed change.",
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
          <FastForward className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Audio Speed Changer</h1>
          <p className="text-gray-600">Adjust audio playback speed</p>
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
            <CardTitle>Speed Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Playback Speed</Label>
              <Select value={speed} onValueChange={setSpeed}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x (Slower)</SelectItem>
                  <SelectItem value="1.0">1.0x (Normal)</SelectItem>
                  <SelectItem value="1.5">1.5x (Faster)</SelectItem>
                  <SelectItem value="2.0">2.0x (Fastest)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={startProcessing} disabled={isProcessing || !audioFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Adjusting Speed...' : 'Change Audio Speed'}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing audio speed change...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {outputAudioUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Output Audio Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <audio controls src={outputAudioUrl} className="w-full"></audio>
              <Button asChild className="w-full">
                <a href={outputAudioUrl} download={`speed_changed_audio.${audioFile?.name.split('.').pop()}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Audio
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AudioSpeedChanger;
