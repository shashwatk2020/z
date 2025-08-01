
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Monitor, Play, Square, Download, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ScreenRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [resolution, setResolution] = useState('auto');
  const [frameRate, setFrameRate] = useState('30');
  const [includeAudio, setIncludeAudio] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [systemAudioEnabled, setSystemAudioEnabled] = useState(true);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast = () => {} } = useToast();

  const startRecording = async () => {
    setIsRecording(true);
    setRecordingTime(0);
    setRecordedVideoUrl(null);

    toast({
      title: "Recording Started",
      description: "Screen recording is now active."
    });

    intervalRef.current = setInterval(() => {
      setRecordingTime(prevTime => prevTime + 1);
    }, 1000);

    // Simulate recording process
    await new Promise(resolve => setTimeout(resolve, 10000)); // Simulate 10 seconds of recording
    stopRecording();
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Simulate recorded video
    const mockVideoBlob = new Blob(['mock screen recording'], { type: `video/${outputFormat}` });
    const url = URL.createObjectURL(mockVideoBlob);
    setRecordedVideoUrl(url);

    toast({
      title: "Recording Stopped",
      description: "Screen recording has finished."
    });
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [
      h,
      m > 9 ? m : (h ? '0' + m : m || '0'),
      s > 9 ? s : '0' + s,
    ].filter(Boolean).join(':');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Monitor className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Screen Recorder</h1>
          <p className="text-gray-600">Record your computer screen with audio for tutorials, presentations, or gameplay</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recording Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center items-center space-x-4">
              {!isRecording ? (
                <Button onClick={startRecording} size="lg">
                  <Play className="h-6 w-6 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button onClick={stopRecording} size="lg" variant="destructive">
                  <Square className="h-6 w-6 mr-2" />
                  Stop Recording
                </Button>
              )}
            </div>

            {isRecording && (
              <div className="text-center text-lg font-semibold text-red-600">
                Recording: {formatTime(recordingTime)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Recording Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat} disabled={isRecording}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp4">MP4</SelectItem>
                    <SelectItem value="webm">WebM</SelectItem>
                    <SelectItem value="gif">GIF (Short clips)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Resolution</Label>
                <Select value={resolution} onValueChange={setResolution} disabled={isRecording}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (Full Screen)</SelectItem>
                    <SelectItem value="1920x1080">1920x1080</SelectItem>
                    <SelectItem value="1280x720">1280x720</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Frame Rate (fps)</Label>
                <Select value={frameRate} onValueChange={setFrameRate} disabled={isRecording}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 fps</SelectItem>
                    <SelectItem value="30">30 fps</SelectItem>
                    <SelectItem value="60">60 fps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Audio Settings</Label>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="includeAudio" 
                  checked={includeAudio} 
                  onChange={(e) => setIncludeAudio(e.target.checked)} 
                  className="form-checkbox"
                  disabled={isRecording}
                />
                <Label htmlFor="includeAudio">Include Audio</Label>
              </div>

              {includeAudio && (
                <div className="space-y-2 ml-6">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="microphoneEnabled" 
                      checked={microphoneEnabled} 
                      onChange={(e) => setMicrophoneEnabled(e.target.checked)} 
                      className="form-checkbox"
                      disabled={isRecording}
                    />
                    <Label htmlFor="microphoneEnabled">Record Microphone</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="systemAudioEnabled" 
                      checked={systemAudioEnabled} 
                      onChange={(e) => setSystemAudioEnabled(e.target.checked)} 
                      className="form-checkbox"
                      disabled={isRecording}
                    />
                    <Label htmlFor="systemAudioEnabled">Record System Audio</Label>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {recordedVideoUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Recorded Video Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <video controls src={recordedVideoUrl} className="w-full rounded-md"></video>
              <Button asChild className="w-full">
                <a href={recordedVideoUrl} download={`screen_recording.${outputFormat}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Recording
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ScreenRecorder;
