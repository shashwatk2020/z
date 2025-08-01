
import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Webcam, Play, Square, Download, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WebcamRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [outputFormat, setOutputFormat] = useState('webm');
  const [videoQuality, setVideoQuality] = useState('medium');
  const [audioInput, setAudioInput] = useState('default');
  const [videoInput, setVideoInput] = useState('default');
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast = () => {} } = useToast();

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: videoInput === 'default' ? undefined : videoInput },
        audio: { deviceId: audioInput === 'default' ? undefined : audioInput },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: `video/${outputFormat}` });
      recordedChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: `video/${outputFormat}` });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      setRecordedVideoUrl(null);

      toast({
        title: "Recording Started",
        description: "Webcam recording is now active."
      });

    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast({
        title: "Recording Failed",
        description: "Could not access webcam or microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Webcam recording has finished."
      });
    }
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
          <Webcam className="h-12 w-12 mx-auto text-purple-600" />
          <h1 className="text-3xl font-bold">Webcam Recorder</h1>
          <p className="text-gray-600">Record video directly from your webcam with various quality and format options</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Webcam Feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <video ref={videoRef} className="w-full rounded-md bg-gray-200" autoPlay muted></video>
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
                    <SelectItem value="webm">WebM (Recommended)</SelectItem>
                    <SelectItem value="mp4">MP4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Video Quality</Label>
                <Select value={videoQuality} onValueChange={setVideoQuality} disabled={isRecording}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Video Input</Label>
                <Select value={videoInput} onValueChange={setVideoInput} disabled={isRecording}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Webcam</SelectItem>
                    {/* Add more options dynamically if multiple webcams are detected */}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Audio Input</Label>
                <Select value={audioInput} onValueChange={setAudioInput} disabled={isRecording}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Microphone</SelectItem>
                    {/* Add more options dynamically if multiple microphones are detected */}
                  </SelectContent>
                </Select>
              </div>
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
                <a href={recordedVideoUrl} download={`webcam_recording.${outputFormat}`}>
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

export default WebcamRecorder;
