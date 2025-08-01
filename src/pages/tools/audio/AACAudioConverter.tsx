
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Music, Upload, Download, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AACAudioConverter = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState('aac');
  const [bitrate, setBitrate] = useState('128');
  const [sampleRate, setSampleRate] = useState('44100');
  const [channels, setChannels] = useState('stereo');
  const [trimStart, setTrimStart] = useState('00:00');
  const [trimEnd, setTrimEnd] = useState('00:00');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedAudioUrl, setConvertedAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setConvertedAudioUrl(null);
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

  const startConversion = async () => {
    if (!audioFile) {
      toast({
        title: "No Audio Selected",
        description: "Please select an audio file to convert.",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setConvertedAudioUrl(null);

    try {
      const steps = [
        'Analyzing audio properties...',
        'Applying conversion settings...',
        'Encoding audio...',
        'Finalizing output...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate longer process
      }

      // Simulate converted audio URL
      const mockAudioBlob = new Blob(['mock audio content'], { type: `audio/${outputFormat}` });
      const url = URL.createObjectURL(mockAudioBlob);
      setConvertedAudioUrl(url);

      toast({
        title: "Conversion Complete",
        description: `Your audio has been successfully converted to ${outputFormat.toUpperCase()}.`
      });
    } catch (error) {
      toast({
        title: "Conversion Failed",
        description: "An error occurred during audio conversion.",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
      setProgress(0);
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
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Music className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">AAC Audio Converter</h1>
          <p className="text-gray-600">Convert audio files to AAC format with advanced settings</p>
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
                  <strong>File:</strong> {audioFile.name} ({formatFileSize(audioFile.size)})
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Conversion Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aac">AAC</SelectItem>
                    <SelectItem value="mp3">MP3</SelectItem>
                    <SelectItem value="wav">WAV</SelectItem>
                    <SelectItem value="flac">FLAC</SelectItem>
                    <SelectItem value="ogg">OGG</SelectItem>
                    <SelectItem value="m4a">M4A</SelectItem>
                    <SelectItem value="wma">WMA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Bitrate (kbps)</Label>
                <Select value={bitrate} onValueChange={setBitrate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="64">64 kbps</SelectItem>
                    <SelectItem value="128">128 kbps (Standard)</SelectItem>
                    <SelectItem value="192">192 kbps</SelectItem>
                    <SelectItem value="256">256 kbps</SelectItem>
                    <SelectItem value="320">320 kbps (High Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sample Rate (Hz)</Label>
                <Select value={sampleRate} onValueChange={setSampleRate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="44100">44100 Hz (CD Quality)</SelectItem>
                    <SelectItem value="48000">48000 Hz (DVD Quality)</SelectItem>
                    <SelectItem value="22050">22050 Hz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Channels</Label>
                <Select value={channels} onValueChange={setChannels}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mono">Mono</SelectItem>
                    <SelectItem value="stereo">Stereo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Trim Audio (MM:SS)</Label>
              <div className="flex space-x-2">
                <Input 
                  value={trimStart} 
                  onChange={(e) => setTrimStart(e.target.value)} 
                  placeholder="00:00" 
                />
                <Input 
                  value={trimEnd} 
                  onChange={(e) => setTrimEnd(e.target.value)} 
                  placeholder="00:00" 
                />
              </div>
            </div>

            <Button onClick={startConversion} disabled={isConverting || !audioFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isConverting ? 'Converting...' : 'Convert Audio'}
            </Button>

            {isConverting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing audio...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {convertedAudioUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Converted Audio Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <audio controls src={convertedAudioUrl} className="w-full"></audio>
              <Button asChild className="w-full">
                <a href={convertedAudioUrl} download={`converted_audio.${outputFormat}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Converted Audio
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AACAudioConverter;
