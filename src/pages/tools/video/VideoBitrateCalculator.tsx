
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Info } from 'lucide-react';

const VideoBitrateCalculator = () => {
  const [videoLength, setVideoLength] = useState(''); // in seconds
  const [targetFileSize, setTargetFileSize] = useState(''); // in MB
  const [audioBitrate, setAudioBitrate] = useState('128'); // in kbps
  const [calculatedVideoBitrate, setCalculatedVideoBitrate] = useState<string | null>(null);

  const calculateBitrate = () => {
    const lengthSeconds = parseFloat(videoLength);
    const fileSizeMB = parseFloat(targetFileSize);
    const audioKbps = parseFloat(audioBitrate);

    if (isNaN(lengthSeconds) || isNaN(fileSizeMB) || lengthSeconds <= 0 || fileSizeMB <= 0) {
      setCalculatedVideoBitrate('Please enter valid numbers for length and target size.');
      return;
    }

    // Convert target file size from MB to kilobits
    const targetFileKilobits = fileSizeMB * 8 * 1024; // MB * 8 bits/byte * 1024 KB/MB * 1024 bytes/KB

    // Calculate total bits available for video
    const totalAudioKilobits = audioKbps * lengthSeconds;
    const videoKilobits = targetFileKilobits - totalAudioKilobits;

    if (videoKilobits <= 0) {
      setCalculatedVideoBitrate('Target file size is too small for the given audio bitrate and length.');
      return;
    }

    // Calculate video bitrate in kbps
    const videoBitrateKbps = videoKilobits / lengthSeconds;

    setCalculatedVideoBitrate(`${videoBitrateKbps.toFixed(2)} kbps`);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Calculator className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Video Bitrate Calculator</h1>
          <p className="text-gray-600">Calculate the optimal video bitrate for a target file size</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Input Video Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="videoLength">Video Length (seconds)</Label>
              <Input 
                id="videoLength" 
                type="number" 
                value={videoLength} 
                onChange={(e) => setVideoLength(e.target.value)} 
                placeholder="e.g., 120 (for 2 minutes)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetFileSize">Target File Size (MB)</Label>
              <Input 
                id="targetFileSize" 
                type="number" 
                value={targetFileSize} 
                onChange={(e) => setTargetFileSize(e.target.value)} 
                placeholder="e.g., 50 (for 50 MB)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audioBitrate">Audio Bitrate (kbps)</Label>
              <Select value={audioBitrate} onValueChange={setAudioBitrate}>
                <SelectTrigger id="audioBitrate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="64">64 kbps</SelectItem>
                  <SelectItem value="96">96 kbps</SelectItem>
                  <SelectItem value="128">128 kbps (Standard)</SelectItem>
                  <SelectItem value="192">192 kbps</SelectItem>
                  <SelectItem value="256">256 kbps</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calculateBitrate} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Video Bitrate
            </Button>
          </CardContent>
        </Card>

        {calculatedVideoBitrate && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Calculated Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-center">
                Required Video Bitrate: <span className="text-green-600">{calculatedVideoBitrate}</span>
              </p>
              <p className="text-sm text-gray-600 mt-2 text-center">
                This is the video bitrate needed to achieve your target file size, assuming the specified audio bitrate.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default VideoBitrateCalculator;
