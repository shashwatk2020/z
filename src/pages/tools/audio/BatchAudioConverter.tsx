
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

const BatchAudioConverter = () => {
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState('mp3');
  const [bitrate, setBitrate] = useState('128');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedCount, setConvertedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAudioFiles(prev => [...prev, ...files.filter(file => file.type.startsWith('audio/'))]);
  };

  const startBatchConversion = async () => {
    if (audioFiles.length === 0) {
      toast({
        title: "No Audio Selected",
        description: "Please select audio files to convert.",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setConvertedCount(0);

    for (let i = 0; i < audioFiles.length; i++) {
      const file = audioFiles[i];
      try {
        // Simulate conversion process for each file
        await new Promise(resolve => setTimeout(resolve, 1000));
        setConvertedCount(i + 1);
        setProgress(((i + 1) / audioFiles.length) * 100);

        // Simulate download of each converted file
        const mockAudioBlob = new Blob([`converted ${file.name}`], { type: `audio/${outputFormat}` });
        const url = URL.createObjectURL(mockAudioBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.split('.')[0]}_converted.${outputFormat}`;
        a.click();
        URL.revokeObjectURL(url);

      } catch (error) {
        toast({
          title: "Conversion Failed",
          description: `Failed to convert ${file.name}.`,
          variant: "destructive"
        });
      }
    }

    toast({
      title: "Batch Conversion Complete",
      description: `Successfully converted ${convertedCount} of ${audioFiles.length} audios.`
    });
    setIsConverting(false);
    setProgress(0);
    setAudioFiles([]);
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
          <h1 className="text-3xl font-bold">Batch Audio Converter</h1>
          <p className="text-gray-600">Convert multiple audio files at once</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Audio Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Add Audio Files
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              multiple
              accept="audio/*"
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {audioFiles.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>Selected Files:</strong> {audioFiles.length}
                </p>
                <ul className="text-xs mt-2 max-h-40 overflow-y-auto">
                  {audioFiles.map((file, index) => (
                    <li key={index}>{file.name} ({formatFileSize(file.size)})</li>
                  ))}
                </ul>
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
                    <SelectItem value="mp3">MP3</SelectItem>
                    <SelectItem value="wav">WAV</SelectItem>
                    <SelectItem value="aac">AAC</SelectItem>
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
            </div>

            <Button onClick={startBatchConversion} disabled={isConverting || audioFiles.length === 0} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isConverting ? `Converting ${convertedCount}/${audioFiles.length}...` : 'Start Batch Conversion'}
            </Button>

            {isConverting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing audios...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BatchAudioConverter;
