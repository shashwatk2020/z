import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Music, Upload, Download, Scissors, Merge, Volume2, FastForward, Mic, Monitor, Radio, BarChart2, Waveform, Headphones, Edit, Calculator, VolumeX, Info } from 'lucide-react';

const audioTools = [
  {
    name: 'MP3 Audio Converter',
    description: 'Convert audio files to MP3 format with advanced settings.',
    link: '/tools/audio/mp3-audio-converter',
    icon: <Music className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'WAV Audio Converter',
    description: 'Convert audio files to WAV format with advanced settings.',
    link: '/tools/audio/wav-audio-converter',
    icon: <Music className="h-8 w-8 text-green-500" />
  },
  {
    name: 'AAC Audio Converter',
    description: 'Convert audio files to AAC format with advanced settings.',
    link: '/tools/audio/aac-audio-converter',
    icon: <Music className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'FLAC Audio Converter',
    description: 'Convert audio files to FLAC format with advanced settings.',
    link: '/tools/audio/flac-audio-converter',
    icon: <Music className="h-8 w-8 text-red-500" />
  },
  {
    name: 'OGG Audio Converter',
    description: 'Convert audio files to OGG format with advanced settings.',
    link: '/tools/audio/ogg-audio-converter',
    icon: <Music className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'M4A Audio Converter',
    description: 'Convert audio files to M4A format with advanced settings.',
    link: '/tools/audio/m4a-audio-converter',
    icon: <Music className="h-8 w-8 text-indigo-500" />
  },
  {
    name: 'WMA Audio Converter',
    description: 'Convert audio files to WMA format with advanced settings.',
    link: '/tools/audio/wma-audio-converter',
    icon: <Music className="h-8 w-8 text-yellow-500" />
  },
  {
    name: 'Batch Audio Converter',
    description: 'Convert multiple audio files at once with customizable settings.',
    link: '/tools/audio/batch-audio-converter',
    icon: <Music className="h-8 w-8 text-teal-500" />
  },
  {
    name: 'Audio Trimmer & Cutter',
    description: 'Trim and cut audio clips with precision to remove unwanted parts.',
    link: '/tools/audio/audio-trimmer-cutter',
    icon: <Scissors className="h-8 w-8 text-pink-500" />
  },
  {
    name: 'Audio Merger',
    description: 'Combine multiple audio clips into one seamless audio file.',
    link: '/tools/audio/audio-merger',
    icon: <Merge className="h-8 w-8 text-cyan-500" />
  },
  {
    name: 'Audio Splitter',
    description: 'Split a single audio file into multiple segments at specified time points.',
    link: '/tools/audio/audio-splitter',
    icon: <Scissors className="h-8 w-8 text-lime-500" />
  },
  {
    name: 'Volume Adjuster',
    description: 'Increase or decrease the volume of your audio files.',
    link: '/tools/audio/volume-adjuster',
    icon: <Volume2 className="h-8 w-8 text-amber-500" />
  },
  {
    name: 'Audio Speed Changer',
    description: 'Adjust audio playback speed to create slow-motion or fast-motion effects.',
    link: '/tools/audio/audio-speed-changer',
    icon: <FastForward className="h-8 w-8 text-lightBlue-500" />
  },
  {
    name: 'Pitch Shifter',
    description: 'Change the pitch of audio without altering tempo.',
    link: '/tools/audio/pitch-shifter',
    icon: <Music className="h-8 w-8 text-deepPurple-500" />
  },
  {
    name: 'Audio Reverb Tool',
    description: 'Add reverb effects to your audio files for a richer sound.',
    link: '/tools/audio/audio-reverb-tool',
    icon: <Music className="h-8 w-8 text-blueGray-500" />
  },
  {
    name: 'Noise Reducer',
    description: 'Remove unwanted background noise from your audio files.',
    link: '/tools/audio/noise-reducer',
    icon: <VolumeX className="h-8 w-8 text-brown-500" />
  },
  {
    name: 'Voice Recorder',
    description: 'Record high-quality audio directly from your microphone.',
    link: '/tools/audio/voice-recorder',
    icon: <Mic className="h-8 w-8 text-gray-500" />
  },
  {
    name: 'Screen Audio Recorder',
    description: 'Record audio from your computer screen, including system sounds and microphone.',
    link: '/tools/audio/screen-audio-recorder',
    icon: <Monitor className="h-8 w-8 text-black" />
  },
  {
    name: 'Podcast Recorder',
    description: 'Record high-quality audio for your podcasts with advanced settings.',
    link: '/tools/audio/podcast-recorder',
    icon: <Mic className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'Interview Recorder',
    description: 'Record high-quality audio for interviews with multiple participants.',
    link: '/tools/audio/interview-recorder',
    icon: <Mic className="h-8 w-8 text-green-500" />
  },
  {
    name: 'Music Recorder',
    description: 'Record high-quality audio for your music projects and compositions.',
    link: '/tools/audio/music-recorder',
    icon: <Music className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'Dictation Recorder',
    description: 'Record your voice for dictation and transcription purposes.',
    link: '/tools/audio/dictation-recorder',
    icon: <Mic className="h-8 w-8 text-red-500" />
  },
  {
    name: 'Meeting Recorder',
    description: 'Record audio from your meetings for notes or transcription.',
    link: '/tools/audio/meeting-recorder',
    icon: <Mic className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'Radio Recorder',
    description: 'Record audio streams from online radio stations or other sources.',
    link: '/tools/audio/radio-recorder',
    icon: <Radio className="h-8 w-8 text-indigo-500" />
  },
  {
    name: 'Audio Spectrum Analyzer',
    description: 'Visualize and analyze the frequency content of audio files.',
    link: '/tools/audio/audio-spectrum-analyzer',
    icon: <BarChart2 className="h-8 w-8 text-yellow-500" />
  },
  {
    name: 'Audio Waveform Viewer',
    description: 'Visualize the waveform of your audio files for detailed analysis.',
    link: '/tools/audio/audio-waveform-viewer',
    icon: <Waveform className="h-8 w-8 text-teal-500" />
  },
  {
    name: 'Audio Quality Analyzer',
    description: 'Analyze audio files for quality, loudness, and potential issues.',
    link: '/tools/audio/audio-quality-analyzer',
    icon: <Headphones className="h-8 w-8 text-pink-500" />
  },
  {
    name: 'Audio Metadata Editor',
    description: 'View and edit metadata (title, artist, genre, etc.) of your audio files.',
    link: '/tools/audio/audio-metadata-editor',
    icon: <Edit className="h-8 w-8 text-cyan-500" />
  },
  {
    name: 'Audio Bitrate Calculator',
    description: 'Calculate the optimal audio bitrate for a target file size and quality.',
    link: '/tools/audio/audio-bitrate-calculator',
    icon: <Calculator className="h-8 w-8 text-lime-500" />
  },
  {
    name: 'Silence Detector',
    description: 'Identify and mark silent passages in audio recordings for editing or analysis.',
    link: '/tools/audio/silence-detector',
    icon: <VolumeX className="h-8 w-8 text-amber-500" />
  },
  {
    name: 'Audio File Info',
    description: 'Get detailed information about audio files, including codecs, sample rate, channels, and more.',
    link: '/tools/audio/audio-file-info',
    icon: <Info className="h-8 w-8 text-lightBlue-500" />
  },
  {
    name: 'Peak Level Meter',
    description: 'Measure the peak amplitude of your audio files to prevent clipping and distortion.',
    link: '/tools/audio/peak-level-meter',
    icon: <Volume2 className="h-8 w-8 text-deepPurple-500" />
  },
];

const AudioTools = () => {
  return (
    <Layout>
      <div className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Comprehensive Audio Tools
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
              Edit, convert, optimize, and manage your audio files with our powerful suite of tools.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {audioTools.map((tool) => (
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

export default AudioTools;