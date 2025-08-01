
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Edit, Upload, Download, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AudioMetadataEditor = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    year: '',
    comment: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      // Simulate reading existing metadata
      setMetadata({
        title: 'Example Song Title',
        artist: 'Example Artist',
        album: 'Example Album',
        genre: 'Pop',
        year: '2023',
        comment: 'This is an example comment.',
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an audio file.",
        variant: "destructive"
      });
    }
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const saveMetadata = async () => {
    if (!audioFile) {
      toast({
        title: "No Audio Selected",
        description: "Please select an audio file to edit metadata.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const steps = [
        'Reading audio file...',
        'Updating metadata...',
        'Writing new file...',
        'Finalizing...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Simulate download of the modified file
      const mockAudioBlob = new Blob(['mock audio with new metadata'], { type: audioFile.type });
      const url = URL.createObjectURL(mockAudioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `edited_${audioFile.name}`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Metadata Saved",
        description: "Audio metadata updated successfully."
      });
    } catch (error) {
      toast({
        title: "Saving Failed",
        description: "An error occurred while saving metadata.",
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
          <Edit className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Audio Metadata Editor</h1>
          <p className="text-gray-600">View and edit metadata of your audio files</p>
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
            <CardTitle>Edit Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={metadata.title} onChange={handleMetadataChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Artist</Label>
                <Input id="artist" name="artist" value={metadata.artist} onChange={handleMetadataChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="album">Album</Label>
                <Input id="album" name="album" value={metadata.album} onChange={handleMetadataChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Input id="genre" name="genre" value={metadata.genre} onChange={handleMetadataChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" name="year" value={metadata.year} onChange={handleMetadataChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea id="comment" name="comment" value={metadata.comment} onChange={handleMetadataChange} rows={3} />
            </div>

            <Button onClick={saveMetadata} disabled={isProcessing || !audioFile} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Saving Metadata...' : 'Save Metadata'}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing audio metadata...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AudioMetadataEditor;
