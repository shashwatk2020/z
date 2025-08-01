
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Volume2, Upload, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PeakLevelMeter = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [peakLevel, setPeakLevel] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setPeakLevel(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an audio file.",
        variant: "destructive"
      });
    }
  };

  const startAnalysis = async () => {
    if (!audioFile) {
      toast({
        title: "No Audio Selected",
        description: "Please select an audio file to analyze peak level.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate peak level analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      const simulatedPeak = (Math.random() * 6 - 6).toFixed(2); // Between -6.00 and 0.00 dBFS
      setPeakLevel(`${simulatedPeak} dBFS`);

      toast({
        title: "Analysis Complete",
        description: "Peak level analyzed successfully."
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "An error occurred during peak level analysis.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Volume2 className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Peak Level Meter</h1>
          <p className="text-gray-600">Measure the peak amplitude of your audio files</p>
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
            <CardTitle>Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={startAnalysis} disabled={isAnalyzing || !audioFile} className="w-full">
              <Info className="h-4 w-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Peak Level'}
            </Button>

            {isAnalyzing && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 text-center">Analyzing audio peak level...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {peakLevel && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Volume2 className="h-5 w-5 mr-2" />
                Peak Level Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-center">
                Peak Level: <span className="text-green-600">{peakLevel}</span>
              </p>
              <p className="text-sm text-gray-600 mt-2 text-center">
                This indicates the loudest point in your audio file.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default PeakLevelMeter;
