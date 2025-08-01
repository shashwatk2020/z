
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Video, Upload, Download, Settings, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BatchVideoConverter = () => {
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [resolution, setResolution] = useState('original');
  const [bitrate, setBitrate] = useState('auto');
  const [addWatermark, setAddWatermark] = useState(false);
  const [watermarkText, setWatermarkText] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedCount, setConvertedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast = () => {} } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setVideoFiles(prev => [...prev, ...files.filter(file => file.type.startsWith('video/'))]);
  };

  const startBatchConversion = async () => {
    if (videoFiles.length === 0) {
      toast({
        title: "No Videos Selected",
        description: "Please select video files to convert.",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setConvertedCount(0);

    for (let i = 0; i < videoFiles.length; i++) {
      const file = videoFiles[i];
      try {
        // Simulate conversion process for each file
        await new Promise(resolve => setTimeout(resolve, 1000));
        setConvertedCount(i + 1);
        setProgress(((i + 1) / videoFiles.length) * 100);

        // Simulate download of each converted file
        const mockVideoBlob = new Blob([`converted ${file.name}`], { type: `video/${outputFormat}` });
        const url = URL.createObjectURL(mockVideoBlob);
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
      description: `Successfully converted ${convertedCount} of ${videoFiles.length} videos.`
    });
    setIsConverting(false);
    setProgress(0);
    setVideoFiles([]);
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
          <Video className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Batch Video Converter</h1>
          <p className="text-gray-600">Convert multiple video files at once</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Video Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Add Video Files
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              multiple
              accept="video/*"
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {videoFiles.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>Selected Files:</strong> {videoFiles.length}
                </p>
                <ul className="text-xs mt-2 max-h-40 overflow-y-auto">
                  {videoFiles.map((file, index) => (
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
                    <SelectItem value="mp4">MP4</SelectItem>
                    <SelectItem value="mov">MOV</SelectItem>
                    <SelectItem value="avi">AVI</SelectItem>
                    <SelectItem value="webm">WebM</SelectItem>
                    <SelectItem value="mkv">MKV</SelectItem>
                    <SelectItem value="flv">FLV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Resolution</Label>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Original</SelectItem>
                    <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                    <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                    <SelectItem value="854x480">854x480 (SD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Bitrate (kbps)</Label>
                <Input 
                  value={bitrate} 
                  onChange={(e) => setBitrate(e.target.value)} 
                  placeholder="Auto" 
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={addWatermark} 
                  onCheckedChange={(checked) => setAddWatermark(checked === true)} 
                />
                <Label>Add Watermark</Label>
              </div>
              {addWatermark && (
                <Input 
                  value={watermarkText} 
                  onChange={(e) => setWatermarkText(e.target.value)} 
                  placeholder="Enter watermark text" 
                />
              )}
            </div>

            <Button onClick={startBatchConversion} disabled={isConverting || videoFiles.length === 0} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isConverting ? `Converting ${convertedCount}/${videoFiles.length}...` : 'Start Batch Conversion'}
            </Button>

            {isConverting && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">Processing videos...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BatchVideoConverter;
