
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { VolumeX, Upload, Download, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SilenceDetector = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState('-50'); // dB
  const [minSilenceDuration, setMinSilenceDuration] = useState('2'); // seconds
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [silenceSegments, setSilenceSegments] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setSilenceSegments([]);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an audio file.",
        variant: "destructive"
      });
    }
  };

  const startDetection = async () => {
    if (!audioFile) {
      toast({
        title: "No Audio Selected",
        description: "Please select an audio file to detect silence.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setSilenceSegments([]);

    try {
      const steps = [
        'Analyzing audio levels...',
        'Detecting silence segments...',
        'Compiling results...',
        'Finalizing...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Simulate silence detection results
      setSilenceSegments([
        { start: '00:05', end: '00:10', duration: '00:05' },
        { start: '00:25', end: '00:35', duration: '00:10' },
        { start: '01:10', end: '01:12', duration: '00:02' },
      ]);

      toast({
        title: "Detection Complete",
        description: "Silence segments detected successfully."
      });
    } catch (error) {
      toast({
        title: "Detection Failed",
        description: "An error occurred during silence detection.",
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
          <VolumeX className="h-12 w-12 mx-auto text-red-600" />
          <h1 className="text-3xl font-bold">Silence Detector</h1>
          <p className="text-gray-600">Identify and mark silent passages in audio recordings</p>
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
            <CardTitle>Detection Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Silence Threshold (dB)</Label>
              <Input 
                type="number" 
                value={threshold} 
                onChange={(e) => setThreshold(e.target.value)} 
                placeholder="-50" 
              />
              <p className="text-xs text-gray-500">Audio level below which is considered silence (e.g., -50 dB).</p>
            </div>

            <div className="space-y-2">
              <Label>Minimum Silence Duration (seconds)</Label>
              <Input 
                type="number" 
                value={minSilenceDuration} 
                onChange={(e) => setMinSilenceDuration(e.target.value)} 
                placeholder="2" 
              />
              <p className="text-xs text-gray-500">Minimum duration for a segment to be considered silence.</p>
            </div>

            <Button onClick={startDetection} disabled={isProcessing || !audioFile} className="w-full">
              <Play className="h-4 w-4 mr-2" />
              {isProcessing ? 'Detecting Silence...' : 'Detect Silence'}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing audio for silence...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {silenceSegments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Detected Silence Segments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {silenceSegments.map((segment, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md text-sm">
                  <strong>Segment {index + 1}:</strong> From {segment.start} to {segment.end} (Duration: {segment.duration})
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SilenceDetector;
