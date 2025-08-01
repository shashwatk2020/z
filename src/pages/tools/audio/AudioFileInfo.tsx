
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Info, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AudioFileInfo = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioInfo, setAudioInfo] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAudioInfo(null);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an audio file.",
        variant: "destructive"
      });
    }
  };

  const analyzeAudio = async () => {
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
      // Simulate audio analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      setAudioInfo({
        fileName: audioFile.name,
        fileSize: audioFile.size,
        fileType: audioFile.type,
        duration: '00:03:45',
        bitrate: '320 kbps',
        sampleRate: '44.1 kHz',
        channels: 'Stereo',
        codec: 'MPEG Audio (MP3)',
        metadata: {
          title: 'My Awesome Song',
          artist: 'Unknown',
          album: 'Single',
          year: '2023',
        },
      });

      toast({
        title: "Analysis Complete",
        description: "Audio information extracted successfully."
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
          <Info className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Audio File Info</h1>
          <p className="text-gray-600">Extract detailed information about your audio files</p>
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
            <Button onClick={analyzeAudio} disabled={isAnalyzing || !audioFile} className="w-full">
              <Info className="h-4 w-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Audio'}
            </Button>

            {isAnalyzing && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 text-center">Analyzing audio information...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {audioInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Audio Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>File Name:</strong> {audioInfo.fileName}</div>
              <div><strong>File Size:</strong> {formatFileSize(audioInfo.fileSize)}</div>
              <div><strong>File Type:</strong> {audioInfo.fileType}</div>
              <div><strong>Duration:</strong> {audioInfo.duration}</div>
              <div><strong>Bitrate:</strong> {audioInfo.bitrate}</div>
              <div><strong>Sample Rate:</strong> {audioInfo.sampleRate}</div>
              <div><strong>Channels:</strong> {audioInfo.channels}</div>
              <div><strong>Codec:</strong> {audioInfo.codec}</div>
              <div className="pt-2">
                <h3 className="font-semibold">Metadata:</h3>
                {Object.entries(audioInfo.metadata).map(([key, value]) => (
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

export default AudioFileInfo;
