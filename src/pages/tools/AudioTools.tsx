import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Music, Headphones, Mic, Volume2, Radio, AudioLines } from 'lucide-react';

const tools = [
  {
    name: 'Audio Converter',
    description: 'Convert audio files between different formats including MP3, WAV, AAC, FLAC, and more. Maintain quality while ensuring compatibility across all devices and players.',
    link: '/tools/audio/audio-converter',
    icon: <Music className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'Audio Compressor',
    description: 'Reduce audio file sizes without significant quality loss. Perfect for podcasts, music streaming, and storage optimization while maintaining audio clarity.',
    link: '/tools/audio/audio-compressor',
    icon: <Volume2 className="h-8 w-8 text-green-500" />
  },
  {
    name: 'Audio Editor',
    description: 'Edit audio files with trimming, cutting, and merging capabilities. Add effects, adjust volume, and enhance your audio with professional editing tools.',
    link: '/tools/audio/audio-editor',
    icon: <AudioLines className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'Voice Recorder',
    description: 'Record high-quality audio directly from your microphone. Perfect for podcasts, voice notes, interviews, and music recording with various quality settings.',
    link: '/tools/audio/voice-recorder',
    icon: <Mic className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'Audio Player',
    description: 'Play audio files in multiple formats with advanced controls. Support for playlists, equalizer, and playback speed adjustment for enhanced listening experience.',
    link: '/tools/audio/audio-player',
    icon: <Headphones className="h-8 w-8 text-red-500" />
  },
  {
    name: 'Audio Analyzer',
    description: 'Analyze audio properties including frequency spectrum, waveform visualization, and technical audio metrics. Perfect for audio engineers and quality assessment.',
    link: '/tools/audio/audio-analyzer',
    icon: <Radio className="h-8 w-8 text-indigo-500" />
  },
];

const conversionTools = [
    { name: 'MP3 Audio Converter', description: 'Convert audio files to MP3 format with quality options.', link: '/tools/audio/mp3-converter' },
    { name: 'WAV Audio Converter', description: 'Convert audio to uncompressed WAV format.', link: '/tools/audio/wav-converter' },
    { name: 'AAC Audio Converter', description: 'Convert audio to AAC format for Apple devices.', link: '/tools/audio/aac-converter' },
    { name: 'FLAC Audio Converter', description: 'Convert audio to lossless FLAC format.', link: '/tools/audio/flac-converter' },
    { name: 'OGG Audio Converter', description: 'Convert audio to open-source OGG Vorbis format.', link: '/tools/audio/ogg-converter' },
    { name: 'M4A Audio Converter', description: 'Convert audio to M4A format for iTunes compatibility.', link: '/tools/audio/m4a-converter' },
    { name: 'WMA Audio Converter', description: 'Convert Windows Media Audio files to other formats.', link: '/tools/audio/wma-converter' },
    { name: 'Batch Audio Converter', description: 'Convert multiple audio files simultaneously.', link: '/tools/audio/batch-converter' },
];

const editingTools = [
    { name: 'Audio Trimmer & Cutter', description: 'Cut audio files to specific time ranges with precision.', link: '/tools/audio/audio-trimmer' },
    { name: 'Audio Merger', description: 'Combine multiple audio files into one seamless track.', link: '/tools/audio/audio-merger' },
    { name: 'Audio Splitter', description: 'Split audio files into multiple segments or tracks.', link: '/tools/audio/audio-splitter' },
    { name: 'Volume Adjuster', description: 'Adjust audio volume levels and normalize audio.', link: '/tools/audio/volume-adjuster' },
    { name: 'Audio Speed Changer', description: 'Change audio playback speed without pitch alteration.', link: '/tools/audio/speed-changer' },
    { name: 'Pitch Shifter', description: 'Change audio pitch without affecting playback speed.', link: '/tools/audio/pitch-shifter' },
    { name: 'Audio Reverb Tool', description: 'Add reverb and echo effects to audio recordings.', link: '/tools/audio/reverb-tool' },
    { name: 'Noise Reducer', description: 'Remove background noise and improve audio clarity.', link: '/tools/audio/noise-reducer' },
];

const recordingTools = [
    { name: 'Voice Recorder', description: 'Record high-quality audio from microphone with various settings.', link: '/tools/audio/voice-recorder' },
    { name: 'Screen Audio Recorder', description: 'Record system audio and screen sounds.', link: '/tools/audio/screen-audio-recorder' },
    { name: 'Podcast Recorder', description: 'Record multi-track audio for podcast production.', link: '/tools/audio/podcast-recorder' },
    { name: 'Interview Recorder', description: 'Record phone calls and remote interviews.', link: '/tools/audio/interview-recorder' },
    { name: 'Music Recorder', description: 'Record instruments and musical performances.', link: '/tools/audio/music-recorder' },
    { name: 'Dictation Recorder', description: 'Record voice notes and dictation with transcription.', link: '/tools/audio/dictation-recorder' },
    { name: 'Meeting Recorder', description: 'Record conference calls and online meetings.', link: '/tools/audio/meeting-recorder' },
    { name: 'Radio Recorder', description: 'Record streaming radio and online audio content.', link: '/tools/audio/radio-recorder' },
];

const analysisTools = [
    { name: 'Audio Spectrum Analyzer', description: 'Visualize audio frequency spectrum and analyze audio content.', link: '/tools/audio/spectrum-analyzer' },
    { name: 'Audio Waveform Viewer', description: 'Display detailed audio waveforms for visual analysis.', link: '/tools/audio/waveform-viewer' },
    { name: 'Audio Quality Analyzer', description: 'Analyze audio quality metrics and identify issues.', link: '/tools/audio/quality-analyzer' },
    { name: 'Audio Metadata Editor', description: 'Edit audio metadata, tags, and file information.', link: '/tools/audio/metadata-editor' },
    { name: 'Audio Bitrate Calculator', description: 'Calculate optimal bitrates for different audio applications.', link: '/tools/audio/bitrate-calculator' },
    { name: 'Silence Detector', description: 'Detect and analyze silent portions in audio files.', link: '/tools/audio/silence-detector' },
    { name: 'Audio File Info', description: 'Display detailed technical information about audio files.', link: '/tools/audio/file-info' },
    { name: 'Peak Level Meter', description: 'Monitor audio levels and peak detection in real-time.', link: '/tools/audio/peak-meter' },
];

const AudioTools = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Professional Audio Processing Tools
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
                Comprehensive audio editing, conversion, and recording tools for musicians, podcasters, and audio professionals. Process, enhance, and create high-quality audio content.
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
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">All Our Audio Tools</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">Complete audio processing suite covering conversion, editing, recording, and analysis for all your audio production needs.</p>
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recording & Capture</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recordingTools.map((tool) => (
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis & Utilities</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {analysisTools.map((tool) => (
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

export default AudioTools;
