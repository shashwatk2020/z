
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Mic, Play, Square, Download, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast = () => {} } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      recordedChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      setRecordedAudioUrl(null);

      toast({
        title: "Recording Started",
        description: "Voice recording is now active."
      });

      intervalRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Recording Failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      toast({
        title: "Recording Stopped",
        description: "Voice recording has finished."
      });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Mic className="h-12 w-12 mx-auto text-green-600" />
          <h1 className="text-3xl font-bold">Voice Recorder</h1>
          <p className="text-gray-600">Record high-quality audio directly from your microphone</p>
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

        {recordedAudioUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Recorded Audio Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <audio controls src={recordedAudioUrl} className="w-full"></audio>
              <Button asChild className="w-full">
                <a href={recordedAudioUrl} download="voice_recording.wav">
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

export default VoiceRecorder;
