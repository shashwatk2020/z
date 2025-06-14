
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Video, Film, Play, Scissors, Volume2, Download } from 'lucide-react';

const tools = [
  {
    name: 'Video Converter',
    description: 'Convert videos between different formats including MP4, AVI, MOV, WMV, and more. Maintain quality while ensuring compatibility across all devices and platforms.',
    link: '/tools/video/video-converter',
    icon: <Video className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'Video Compressor',
    description: 'Reduce video file sizes without significant quality loss. Perfect for web uploads, email attachments, and storage optimization while maintaining visual clarity.',
    link: '/tools/video/video-compressor',
    icon: <Film className="h-8 w-8 text-green-500" />
  },
  {
    name: 'Video Trimmer',
    description: 'Cut and trim videos to specific time ranges. Remove unwanted sections, create clips, and extract the best parts of your videos with precision editing.',
    link: '/tools/video/video-trimmer',
    icon: <Scissors className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'Audio Extractor',
    description: 'Extract audio tracks from video files in various formats. Convert video soundtracks to MP3, WAV, or other audio formats for music and podcast creation.',
    link: '/tools/video/audio-extractor',
    icon: <Volume2 className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'Video Player',
    description: 'Play videos in multiple formats with advanced controls. Support for subtitles, playback speed adjustment, and frame-by-frame navigation for detailed viewing.',
    link: '/tools/video/video-player',
    icon: <Play className="h-8 w-8 text-red-500" />
  },
  {
    name: 'Video Downloader',
    description: 'Download videos from popular platforms in various quality options. Save content for offline viewing with format and resolution selection capabilities.',
    link: '/tools/video/video-downloader',
    icon: <Download className="h-8 w-8 text-indigo-500" />
  },
];

const conversionTools = [
    { name: 'MP4 Video Converter', description: 'Convert videos to MP4 format for universal compatibility.', link: '/tools/video/mp4-converter' },
    { name: 'AVI Video Converter', description: 'Convert videos to AVI format with quality options.', link: '/tools/video/avi-converter' },
    { name: 'MOV Video Converter', description: 'Convert videos to QuickTime MOV format.', link: '/tools/video/mov-converter' },
    { name: 'WMV Video Converter', description: 'Convert videos to Windows Media Video format.', link: '/tools/video/wmv-converter' },
    { name: 'MKV Video Converter', description: 'Convert videos to Matroska MKV format.', link: '/tools/video/mkv-converter' },
    { name: 'WebM Video Converter', description: 'Convert videos to WebM format for web optimization.', link: '/tools/video/webm-converter' },
    { name: 'FLV Video Converter', description: 'Convert Flash Video files to modern formats.', link: '/tools/video/flv-converter' },
    { name: 'Batch Video Converter', description: 'Convert multiple videos simultaneously.', link: '/tools/video/batch-converter' },
];

const editingTools = [
    { name: 'Video Trimmer & Cutter', description: 'Cut videos to specific time ranges with precision.', link: '/tools/video/video-trimmer' },
    { name: 'Video Merger', description: 'Combine multiple video files into one seamless video.', link: '/tools/video/video-merger' },
    { name: 'Video Splitter', description: 'Split videos into multiple segments or clips.', link: '/tools/video/video-splitter' },
    { name: 'Video Rotator', description: 'Rotate videos to correct orientation issues.', link: '/tools/video/video-rotator' },
    { name: 'Video Resizer', description: 'Change video dimensions and aspect ratios.', link: '/tools/video/video-resizer' },
    { name: 'Video Speed Changer', description: 'Adjust video playback speed for slow motion or time-lapse.', link: '/tools/video/speed-changer' },
    { name: 'Video Stabilizer', description: 'Reduce camera shake and stabilize shaky footage.', link: '/tools/video/stabilizer' },
    { name: 'Video Color Corrector', description: 'Adjust brightness, contrast, saturation, and color balance.', link: '/tools/video/color-corrector' },
];

const optimizationTools = [
    { name: 'Video Compressor', description: 'Reduce file sizes while maintaining visual quality.', link: '/tools/video/video-compressor' },
    { name: 'Video Quality Enhancer', description: 'Improve video quality and resolution with AI upscaling.', link: '/tools/video/quality-enhancer' },
    { name: 'Video Optimizer for Web', description: 'Optimize videos for web streaming and fast loading.', link: '/tools/video/web-optimizer' },
    { name: 'Mobile Video Optimizer', description: 'Optimize videos for mobile devices and apps.', link: '/tools/video/mobile-optimizer' },
    { name: 'Video Bitrate Calculator', description: 'Calculate optimal bitrates for different platforms.', link: '/tools/video/bitrate-calculator' },
    { name: 'Video Metadata Editor', description: 'Edit video metadata, titles, and descriptions.', link: '/tools/video/metadata-editor' },
    { name: 'Video Thumbnail Generator', description: 'Generate custom thumbnails from video frames.', link: '/tools/video/thumbnail-generator' },
    { name: 'Video Frame Extractor', description: 'Extract individual frames as image files.', link: '/tools/video/frame-extractor' },
];

const utilityTools = [
    { name: 'Audio Extractor', description: 'Extract audio tracks from video files in various formats.', link: '/tools/video/audio-extractor' },
    { name: 'Video to GIF Converter', description: 'Convert video clips to animated GIF images.', link: '/tools/video/video-to-gif' },
    { name: 'Subtitle Extractor', description: 'Extract subtitle files from videos with embedded subtitles.', link: '/tools/video/subtitle-extractor' },
    { name: 'Video Info Analyzer', description: 'Analyze video properties, codecs, and technical details.', link: '/tools/video/info-analyzer' },
    { name: 'Video Repair Tool', description: 'Attempt to repair corrupted or damaged video files.', link: '/tools/video/repair-tool' },
    { name: 'Screen Recorder', description: 'Record screen activity and create tutorial videos.', link: '/tools/video/screen-recorder' },
    { name: 'Webcam Recorder', description: 'Record videos using your webcam with audio.', link: '/tools/video/webcam-recorder' },
    { name: 'Video Downloader', description: 'Download videos from popular platforms and websites.', link: '/tools/video/video-downloader' },
];

const VideoTools = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Professional Video Processing Tools
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
                Comprehensive video editing, conversion, and optimization tools for content creators, marketers, and professionals. Process, enhance, and optimize your videos with ease.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool) => (
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

        <div className="py-12 md:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">All Our Video Tools</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">Complete video processing suite covering conversion, editing, optimization, and specialized utilities for all your video needs.</p>
                </div>

                <div className="space-y-16">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Conversion & Format</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {conversionTools.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Editing & Enhancement</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {editingTools.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Optimization & Compression</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {optimizationTools.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Utilities & Specialized</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {utilityTools.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VideoTools;
