
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Volume2, Upload, Download, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VolumeAdjuster = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [volume, setVolume] = useState([100]); // 0-200, 100 is original
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
        description: "Please select an audio file to adjust volume.",
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
        'Adjusting volume...',
        'Re-encoding audio...',
        'Finalizing...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Simulate output audio URL
      const mockAudioBlob = new Blob(['mock volume adjusted audio content'], { type: audioFile.type });
      const url = URL.createObjectURL(mockAudioBlob);
      setOutputAudioUrl(url);

      toast({
        title: "Processing Complete",
        description: "Audio volume adjusted successfully."
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "An error occurred during volume adjustment.",
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
          <Volume2 className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Volume Adjuster</h1>
          <p className="text-gray-600">Increase or decrease the volume of your audio files</p>
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
            <CardTitle>Volume Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Volume Level ({volume[0]}%)</Label>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={200}
                min={0}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-gray-500">100% is original volume. Above 100% increases, below decreases.</p>
            </div>

            <Button onClick={startProcessing} disabled={isProcessing || !audioFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Adjusting Volume...' : 'Adjust Volume'}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing volume adjustment...</p>
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
                <a href={outputAudioUrl} download={`volume_adjusted_audio.${audioFile?.name.split('.').pop()}`}>
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

export default VolumeAdjuster;
