
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Video, Scissors, Merge, RotateCw, Maximize, FastForward, Sparkles, Globe, Smartphone, Calculator, Edit, Image, Music, Subtitles, Wrench, Monitor, Webcam, Download } from 'lucide-react';

const videoTools = [
  {
    name: 'MP4 Video Converter',
    description: 'Convert videos to MP4 format with advanced settings.',
    link: '/tools/video/mp4-video-converter',
    icon: <Video className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'AVI Video Converter',
    description: 'Convert videos to AVI format with advanced settings.',
    link: '/tools/video/avi-video-converter',
    icon: <Video className="h-8 w-8 text-green-500" />
  },
  {
    name: 'MOV Video Converter',
    description: 'Convert videos to MOV format with advanced settings.',
    link: '/tools/video/mov-video-converter',
    icon: <Video className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'WMV Video Converter',
    description: 'Convert videos to WMV format with advanced settings.',
    link: '/tools/video/wmv-video-converter',
    icon: <Video className="h-8 w-8 text-red-500" />
  },
  {
    name: 'MKV Video Converter',
    description: 'Convert videos to MKV format with advanced settings.',
    link: '/tools/video/mkv-video-converter',
    icon: <Video className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'WebM Video Converter',
    description: 'Convert videos to WebM format with advanced settings.',
    link: '/tools/video/webm-video-converter',
    icon: <Video className="h-8 w-8 text-indigo-500" />
  },
  {
    name: 'FLV Video Converter',
    description: 'Convert videos to FLV format with advanced settings.',
    link: '/tools/video/flv-video-converter',
    icon: <Video className="h-8 w-8 text-yellow-500" />
  },
  {
    name: 'Batch Video Converter',
    description: 'Convert multiple video files at once with customizable settings.',
    link: '/tools/video/batch-video-converter',
    icon: <Video className="h-8 w-8 text-teal-500" />
  },
  {
    name: 'Video Trimmer & Cutter',
    description: 'Trim and cut video clips with precision to remove unwanted parts.',
    link: '/tools/video/video-trimmer-cutter',
    icon: <Scissors className="h-8 w-8 text-pink-500" />
  },
  {
    name: 'Video Merger',
    description: 'Combine multiple video clips into one seamless video file.',
    link: '/tools/video/video-merger',
    icon: <Merge className="h-8 w-8 text-cyan-500" />
  },
  {
    name: 'Video Splitter',
    description: 'Split a single video file into multiple segments at specified time points.',
    link: '/tools/video/video-splitter',
    icon: <Scissors className="h-8 w-8 text-lime-500" />
  },
  {
    name: 'Video Rotator',
    description: 'Rotate video orientation by 90, 180, or 270 degrees.',
    link: '/tools/video/video-rotator',
    icon: <RotateCw className="h-8 w-8 text-amber-500" />
  },
  {
    name: 'Video Resizer',
    description: 'Change video resolution and dimensions to fit different screens or platforms.',
    link: '/tools/video/video-resizer',
    icon: <Maximize className="h-8 w-8 text-lightBlue-500" />
  },
  {
    name: 'Video Speed Changer',
    description: 'Adjust video playback speed to create slow-motion or fast-motion effects.',
    link: '/tools/video/video-speed-changer',
    icon: <FastForward className="h-8 w-8 text-deepPurple-500" />
  },
  {
    name: 'Video Stabilizer',
    description: 'Reduce camera shake and stabilize shaky footage for smoother playback.',
    link: '/tools/video/video-stabilizer',
    icon: <Video className="h-8 w-8 text-blueGray-500" />
  },
  {
    name: 'Video Color Corrector',
    description: 'Adjust brightness, contrast, saturation, and other color parameters of your videos.',
    link: '/tools/video/video-color-corrector',
    icon: <Sparkles className="h-8 w-8 text-brown-500" />
  },
  {
    name: 'Video Compressor',
    description: 'Reduce video file size without significant quality loss for easier sharing and storage.',
    link: '/tools/video/video-compressor',
    icon: <Video className="h-8 w-8 text-gray-500" />
  },
  {
    name: 'Video Quality Enhancer',
    description: 'Improve video clarity, reduce noise, and sharpen details for a better viewing experience.',
    link: '/tools/video/video-quality-enhancer',
    icon: <Sparkles className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'Video Optimizer for Web',
    description: 'Optimize videos for fast loading and smooth playback on websites and online platforms.',
    link: '/tools/video/video-optimizer-for-web',
    icon: <Globe className="h-8 w-8 text-green-500" />
  },
  {
    name: 'Mobile Video Optimizer',
    description: 'Optimize videos for playback on mobile devices with various presets and quality options.',
    link: '/tools/video/mobile-video-optimizer',
    icon: <Smartphone className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'Video Bitrate Calculator',
    description: 'Calculate the optimal video bitrate for a target file size and quality.',
    link: '/tools/video/video-bitrate-calculator',
    icon: <Calculator className="h-8 w-8 text-red-500" />
  },
  {
    name: 'Video Metadata Editor',
    description: 'View and edit metadata (title, artist, genre, etc.) of your video files.',
    link: '/tools/video/video-metadata-editor',
    icon: <Edit className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'Video Thumbnail Generator',
    description: 'Generate high-quality thumbnails from your video files at specified time points.',
    link: '/tools/video/video-thumbnail-generator',
    icon: <Image className="h-8 w-8 text-indigo-500" />
  },
  {
    name: 'Video Frame Extractor',
    description: 'Extract single frames from video at specified time points as images.',
    link: '/tools/video/video-frame-extractor',
    icon: <Image className="h-8 w-8 text-yellow-500" />
  },
  {
    name: 'Audio Extractor',
    description: 'Extract audio tracks from video files and save them in various audio formats.',
    link: '/tools/video/audio-extractor',
    icon: <Music className="h-8 w-8 text-teal-500" />
  },
  {
    name: 'Video to GIF Converter',
    description: 'Convert video clips into animated GIF images with customizable settings.',
    link: '/tools/video/video-to-gif-converter',
    icon: <Video className="h-8 w-8 text-pink-500" />
  },
  {
    name: 'Subtitle Extractor',
    description: 'Extract embedded subtitles from video files and save them as SRT or VTT.',
    link: '/tools/video/subtitle-extractor',
    icon: <Subtitles className="h-8 w-8 text-cyan-500" />
  },
  {
    name: 'Video Info Analyzer',
    description: 'Get detailed information about video files, including codecs, resolution, bitrate, and more.',
    link: '/tools/video/video-info-analyzer',
    icon: <Info className="h-8 w-8 text-lime-500" />
  },
  {
    name: 'Video Repair Tool',
    description: 'Repair corrupted or unplayable video files to restore them to a working state.',
    link: '/tools/video/video-repair-tool',
    icon: <Wrench className="h-8 w-8 text-amber-500" />
  },
  {
    name: 'Screen Recorder',
    description: 'Record your computer screen with audio for tutorials, presentations, or gameplay.',
    link: '/tools/video/screen-recorder',
    icon: <Monitor className="h-8 w-8 text-lightBlue-500" />
  },
  {
    name: 'Webcam Recorder',
    description: 'Record video directly from your webcam with various quality and format options.',
    link: '/tools/video/webcam-recorder',
    icon: <Webcam className="h-8 w-8 text-deepPurple-500" />
  },
  {
    name: 'Video Downloader',
    description: 'Download videos from popular online platforms for offline viewing.',
    link: '/tools/video/video-downloader',
    icon: <Download className="h-8 w-8 text-blueGray-500" />
  },
];

const VideoTools = () => {
  return (
    <Layout>
      <div className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Comprehensive Video Tools
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
              Edit, convert, optimize, and manage your video files with our powerful suite of tools.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoTools.map((tool) => (
              <Link to={tool.link} key={tool.name} className="block group">
                <Card className="h-full hover:shadow-lg hover:border-blue-500 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center space-x-4">
                    <div>{tool.icon}</div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoTools;
