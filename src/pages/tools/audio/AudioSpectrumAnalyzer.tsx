
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { BarChart2, Upload, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AudioSpectrumAnalyzer = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAnalysisResults(null);
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
        description: "Please select an audio file to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate audio spectrum analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      setAnalysisResults({
        fileName: audioFile.name,
        duration: '00:01:30',
        sampleRate: '44.1 kHz',
        channels: 'Stereo',
        peakFrequency: '12.5 kHz',
        averageFrequency: '5.2 kHz',
        loudness: '-18 LUFS',
        dynamicRange: '10 dB',
        dominantFrequencies: ['100 Hz', '1 kHz', '5 kHz'],
      });

      toast({
        title: "Analysis Complete",
        description: "Audio spectrum analyzed successfully."
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "An error occurred during audio analysis.",
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
          <BarChart2 className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Audio Spectrum Analyzer</h1>
          <p className="text-gray-600">Visualize and analyze the frequency content of audio files</p>
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
              {isAnalyzing ? 'Analyzing...' : 'Analyze Audio Spectrum'}
            </Button>

            {isAnalyzing && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 text-center">Analyzing audio spectrum...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {analysisResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-2" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>File Name:</strong> {analysisResults.fileName}</div>
              <div><strong>Duration:</strong> {analysisResults.duration}</div>
              <div><strong>Sample Rate:</strong> {analysisResults.sampleRate}</div>
              <div><strong>Channels:</strong> {analysisResults.channels}</div>
              <div><strong>Peak Frequency:</strong> {analysisResults.peakFrequency}</div>
              <div><strong>Average Frequency:</strong> {analysisResults.averageFrequency}</div>
              <div><strong>Loudness (LUFS):</strong> {analysisResults.loudness}</div>
              <div><strong>Dynamic Range:</strong> {analysisResults.dynamicRange}</div>
              <div><strong>Dominant Frequencies:</strong> {analysisResults.dominantFrequencies.join(', ')}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AudioSpectrumAnalyzer;
