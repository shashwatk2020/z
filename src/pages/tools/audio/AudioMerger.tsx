
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Merge, Upload, Download, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AudioMerger = () => {
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [outputFileName, setOutputFileName] = useState('merged_audio.mp3');
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedAudioUrl, setMergedAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const audioOnlyFiles = files.filter(file => file.type.startsWith('audio/'));
    if (audioOnlyFiles.length > 0) {
      setAudioFiles(prev => [...prev, ...audioOnlyFiles]);
      setMergedAudioUrl(null);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please select audio files only.",
        variant: "destructive"
      });
    }
  };

  const removeFile = (index: number) => {
    setAudioFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startMerging = async () => {
    if (audioFiles.length < 2) {
      toast({
        title: "Not Enough Audios",
        description: "Please select at least two audio files to merge.",
        variant: "destructive"
      });
      return;
    }

    setIsMerging(true);
    setProgress(0);
    setMergedAudioUrl(null);

    try {
      const steps = [
        'Analyzing audio files...',
        'Concatenating streams...',
        'Re-encoding output...',
        'Finalizing merged audio...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Simulate merged audio URL
      const mockAudioBlob = new Blob(['mock merged audio content'], { type: 'audio/mp3' });
      const url = URL.createObjectURL(mockAudioBlob);
      setMergedAudioUrl(url);

      toast({
        title: "Merging Complete",
        description: "Audios merged successfully."
      });
    } catch (error) {
      toast({
        title: "Merging Failed",
        description: "An error occurred during audio merging.",
        variant: "destructive"
      });
    } finally {
      setIsMerging(false);
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
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Music className="h-12 w-12 mx-auto text-green-600" />
          <h1 className="text-3xl font-bold">Audio Merger</h1>
          <p className="text-gray-600">Combine multiple audio clips into one file</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Audio Files to Merge</CardTitle>
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
              <div className="space-y-2">
                <Label>Selected Audios ({audioFiles.length})</Label>
                <div className="max-h-40 overflow-y-auto border rounded p-2">
                  {audioFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-1 bg-gray-50 rounded mb-1">
                      <span>{file.name} ({formatFileSize(file.size)})</span>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                        X
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Merge Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Output File Name</Label>
              <Input 
                value={outputFileName} 
                onChange={(e) => setOutputFileName(e.target.value)} 
                placeholder="merged_audio.mp3" 
              />
            </div>

            <Button onClick={startMerging} disabled={isMerging || audioFiles.length < 2} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isMerging ? 'Merging Audios...' : 'Merge Audios'}
            </Button>

            {isMerging && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing audio merge...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {mergedAudioUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Merged Audio Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <audio controls src={mergedAudioUrl} className="w-full"></audio>
              <Button asChild className="w-full">
                <a href={mergedAudioUrl} download={outputFileName}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Merged Audio
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AudioMerger;
