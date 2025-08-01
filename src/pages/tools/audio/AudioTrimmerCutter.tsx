
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Scissors, Upload, Download, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AudioTrimmerCutter = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [trimStart, setTrimStart] = useState('00:00');
  const [trimEnd, setTrimEnd] = useState('00:00');
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
      // Simulate getting audio duration for trim end default
      setTimeout(() => {
        const mockDuration = '00:30'; // Example duration
        setTrimEnd(mockDuration);
      }, 500);
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
        description: "Please select an audio file to trim/cut.",
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
        'Trimming/Cutting audio...',
        'Encoding output...',
        'Finalizing...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simulate output audio URL
      const mockAudioBlob = new Blob(['mock trimmed audio content'], { type: audioFile.type });
      const url = URL.createObjectURL(mockAudioBlob);
      setOutputAudioUrl(url);

      toast({
        title: "Processing Complete",
        description: "Audio trimmed/cut successfully."
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "An error occurred during audio processing.",
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
          <Scissors className="h-12 w-12 mx-auto text-purple-600" />
          <h1 className="text-3xl font-bold">Audio Trimmer & Cutter</h1>
          <p className="text-gray-600">Trim and cut audio clips with precision</p>
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
            <CardTitle>Trim/Cut Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Start Time (MM:SS)</Label>
              <Input 
                value={trimStart} 
                onChange={(e) => setTrimStart(e.target.value)} 
                placeholder="00:00" 
              />
            </div>
            <div className="space-y-2">
              <Label>End Time (MM:SS)</Label>
              <Input 
                value={trimEnd} 
                onChange={(e) => setTrimEnd(e.target.value)} 
                placeholder="00:00" 
              />
            </div>

            <Button onClick={startProcessing} disabled={isProcessing || !audioFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Trim/Cut Audio'}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing audio...</p>
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
                <a href={outputAudioUrl} download={`trimmed_audio.${audioFile?.name.split('.').pop()}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Trimmed Audio
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AudioTrimmerCutter;
