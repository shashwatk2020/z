
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Info } from 'lucide-react';

const AudioBitrateCalculator = () => {
  const [audioLength, setAudioLength] = useState(''); // in seconds
  const [targetFileSize, setTargetFileSize] = useState(''); // in MB
  const [calculatedBitrate, setCalculatedBitrate] = useState<string | null>(null);

  const calculateBitrate = () => {
    const lengthSeconds = parseFloat(audioLength);
    const fileSizeMB = parseFloat(targetFileSize);

    if (isNaN(lengthSeconds) || isNaN(fileSizeMB) || lengthSeconds <= 0 || fileSizeMB <= 0) {
      setCalculatedBitrate('Please enter valid numbers for length and target size.');
      return;
    }

    // Convert target file size from MB to kilobits
    const targetFileKilobits = fileSizeMB * 8 * 1024; // MB * 8 bits/byte * 1024 KB/MB * 1024 bytes/KB

    // Calculate bitrate in kbps
    const bitrateKbps = targetFileKilobits / lengthSeconds;

    setCalculatedBitrate(`${bitrateKbps.toFixed(2)} kbps`);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Calculator className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Audio Bitrate Calculator</h1>
          <p className="text-gray-600">Calculate the optimal audio bitrate for a target file size</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Input Audio Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audioLength">Audio Length (seconds)</Label>
              <Input 
                id="audioLength" 
                type="number" 
                value={audioLength} 
                onChange={(e) => setAudioLength(e.target.value)} 
                placeholder="e.g., 180 (for 3 minutes)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetFileSize">Target File Size (MB)</Label>
              <Input 
                id="targetFileSize" 
                type="number" 
                value={targetFileSize} 
                onChange={(e) => setTargetFileSize(e.target.value)} 
                placeholder="e.g., 5 (for 5 MB)"
              />
            </div>

            <Button onClick={calculateBitrate} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Audio Bitrate
            </Button>
          </CardContent>
        </Card>

        {calculatedBitrate && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Calculated Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-center">
                Required Audio Bitrate: <span className="text-green-600">{calculatedBitrate}</span>
              </p>
              <p className="text-sm text-gray-600 mt-2 text-center">
                This is the audio bitrate needed to achieve your target file size.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AudioBitrateCalculator;
