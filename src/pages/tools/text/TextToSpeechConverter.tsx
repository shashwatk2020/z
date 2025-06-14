
import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, Volume2, Download, Upload, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TextToSpeechConverter = () => {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState([1.0]);
  const [pitch, setPitch] = useState([1.0]);
  const [volume, setVolume] = useState([1.0]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      
      // Load voices
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !selectedVoice) {
          setSelectedVoice(availableVoices[0].name);
        }
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  const speak = () => {
    if (!text.trim()) {
      toast({
        title: "No Text",
        description: "Please enter some text to convert to speech.",
        variant: "destructive",
      });
      return;
    }

    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate[0];
    utterance.pitch = pitch[0];
    utterance.volume = volume[0];

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      toast({
        title: "Speech Error",
        description: "An error occurred during speech synthesis.",
        variant: "destructive",
      });
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const pause = () => {
    speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const clearAll = () => {
    setText('');
    stop();
  };

  const downloadAudio = () => {
    toast({
      title: "Feature Not Available",
      description: "Audio download requires server-side processing. Use the play controls to listen to the speech.",
    });
  };

  if (!isSupported) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gray-50 py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Card>
              <CardContent className="pt-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Text to Speech Not Supported
                </h1>
                <p className="text-gray-600">
                  Your browser doesn't support the Web Speech API. Please use a modern browser like Chrome, Firefox, or Safari.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Text to Speech Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Convert any text to natural-sounding speech. Customize voice, speed, pitch, and volume for the perfect audio experience.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Free Tool</Badge>
              <Badge variant="secondary">Multiple Voices</Badge>
              <Badge variant="secondary">Customizable Settings</Badge>
            </div>
          </div>

          {/* Main Tool */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Volume2 className="h-6 w-6" />
                Text to Speech Converter
              </CardTitle>
              <CardDescription>
                Enter your text and customize the speech settings to generate natural-sounding audio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Text Input */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Text to Convert</label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button variant="outline" size="sm" onClick={clearAll}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
                <Textarea
                  placeholder="Enter the text you want to convert to speech..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] text-base"
                />
                <div className="text-sm text-gray-600">
                  Characters: {text.length} | Words: {text.trim().split(/\s+/).filter(word => word.length > 0).length}
                </div>
              </div>

              {/* Voice Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Voice Settings</h3>
                  
                  {/* Voice Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Voice</label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map((voice) => (
                          <SelectItem key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Speech Rate */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Speed: {rate[0].toFixed(1)}x</label>
                    <Slider
                      value={rate}
                      onValueChange={setRate}
                      max={2}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Pitch */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pitch: {pitch[0].toFixed(1)}</label>
                    <Slider
                      value={pitch}
                      onValueChange={setPitch}
                      max={2}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Volume */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Volume: {Math.round(volume[0] * 100)}%</label>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Playback Controls</h3>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={speak}
                      disabled={!text.trim()}
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      {isPaused ? 'Resume' : 'Play'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={pause}
                      disabled={!isPlaying}
                      className="flex items-center gap-2"
                    >
                      <Pause className="h-4 w-4" />
                      Pause
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={stop}
                      disabled={!isPlaying && !isPaused}
                      className="flex items-center gap-2"
                    >
                      <Square className="h-4 w-4" />
                      Stop
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={downloadAudio}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Audio
                    </Button>
                  </div>

                  {/* Status */}
                  <div className="text-sm text-gray-600">
                    Status: {isPlaying ? 'Playing' : isPaused ? 'Paused' : 'Stopped'}
                  </div>

                  {/* Quick Text Samples */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quick Samples</label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setText("Hello, this is a test of the text to speech converter.")}
                      >
                        Sample 1
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setText("The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.")}
                      >
                        Sample 2
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setText("Welcome to our text to speech converter. This tool can help you create audio from any text input.")}
                      >
                        Sample 3
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>About Text to Speech Technology</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p>
                    Text-to-speech (TTS) technology converts written text into spoken words using advanced algorithms 
                    and voice synthesis. Our tool uses the Web Speech API, which provides access to your browser's 
                    built-in speech synthesis capabilities.
                  </p>
                  <p>
                    Modern TTS systems can produce natural-sounding speech with various voice options, adjustable 
                    speed, pitch, and volume controls. This technology is essential for accessibility, language 
                    learning, and content creation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Use the Text to Speech Converter</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <ol>
                    <li><strong>Enter Text:</strong> Type or paste your text into the input area, or upload a text file.</li>
                    <li><strong>Choose Voice:</strong> Select from available voices in different languages and styles.</li>
                    <li><strong>Adjust Settings:</strong> Customize speed, pitch, and volume to your preference.</li>
                    <li><strong>Play Audio:</strong> Click play to hear your text converted to speech.</li>
                    <li><strong>Control Playback:</strong> Use pause, resume, and stop controls as needed.</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Applications and Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Accessibility:</strong> Help visually impaired users access written content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Language Learning:</strong> Improve pronunciation and listening skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Content Creation:</strong> Generate voiceovers for videos and presentations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Multitasking:</strong> Listen to documents while doing other tasks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Education:</strong> Support different learning styles and needs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>Proofreading:</strong> Hear mistakes that might be missed when reading</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Voice Settings Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm">Speed (0.1x - 2.0x)</h4>
                    <p className="text-xs text-gray-600">Controls how fast the speech is delivered. Normal speed is 1.0x.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Pitch (0.0 - 2.0)</h4>
                    <p className="text-xs text-gray-600">Adjusts the voice pitch. Higher values create a higher-pitched voice.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Volume (0% - 100%)</h4>
                    <p className="text-xs text-gray-600">Controls the playback volume level.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Browser Compatibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-semibold text-green-600">✓ Chrome</p>
                    <p className="text-gray-600">Full support with multiple voices</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-green-600">✓ Firefox</p>
                    <p className="text-gray-600">Good support with system voices</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-green-600">✓ Safari</p>
                    <p className="text-gray-600">Native support on macOS/iOS</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-orange-600">⚠ Edge</p>
                    <p className="text-gray-600">Limited voice options</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Q: Can I download the audio file?</h4>
                    <p className="text-sm text-gray-600">
                      The browser's Web Speech API doesn't provide direct audio file generation. Use screen recording or dedicated TTS services for file output.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: Why are there different voices available?</h4>
                    <p className="text-sm text-gray-600">
                      Voice availability depends on your operating system and browser. Different platforms provide different voice options.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: Is there a text length limit?</h4>
                    <p className="text-sm text-gray-600">
                      While there's no hard limit, very long texts may be interrupted or may not play completely due to browser limitations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TextToSpeechConverter;
