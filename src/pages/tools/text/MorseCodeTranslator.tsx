import React, { useState } from 'react';
import { Radio, Volume2, Copy, RotateCcw, ArrowRightLeft, Play, Pause } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

const MorseCodeTranslator = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState([200]);
  const { toast } = useToast();

  const morseCodeMap: { [key: string]: string } = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', ' ': '/', '.': '.-.-.-', ',': '--..--',
    '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.',
    ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
    '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-',
    '@': '.--.-.'
  };

  const reverseMorseMap: { [key: string]: string } = {};
  Object.entries(morseCodeMap).forEach(([letter, morse]) => {
    reverseMorseMap[morse] = letter;
  });

  const encodeToMorse = (text: string): string => {
    return text
      .toUpperCase()
      .split('')
      .map(char => morseCodeMap[char] || char)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const decodeFromMorse = (morse: string): string => {
    return morse
      .split(' ')
      .map(code => {
        if (code === '/') return ' ';
        return reverseMorseMap[code] || code;
      })
      .join('')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const translate = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to translate.",
        variant: "destructive",
      });
      return;
    }

    let result: string;
    if (mode === 'encode') {
      result = encodeToMorse(inputText);
    } else {
      result = decodeFromMorse(inputText);
    }

    setOutputText(result);
    
    toast({
      title: "Translation Complete!",
      description: `Text ${mode === 'encode' ? 'encoded to' : 'decoded from'} Morse code.`,
    });
  };

  const switchMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    
    // Swap input and output if there's content
    if (inputText || outputText) {
      setInputText(outputText);
      setOutputText(inputText);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const reset = () => {
    setInputText('');
    setOutputText('');
    setMode('encode');
  };

  // Audio playback functions
  const playMorseCode = async () => {
    if (!outputText || mode !== 'encode') {
      toast({
        title: "No Morse Code",
        description: "Please encode some text to Morse code first.",
        variant: "destructive",
      });
      return;
    }

    setIsPlaying(true);
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const dotDuration = playbackSpeed[0]; // milliseconds
      const dashDuration = dotDuration * 3;
      const gapDuration = dotDuration;
      const letterGap = dotDuration * 3;
      const wordGap = dotDuration * 7;

      let currentTime = audioContext.currentTime;

      const playTone = (frequency: number, duration: number, startTime: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, startTime);
        gainNode.gain.setValueAtTime(0.1, startTime + duration / 1000);
        gainNode.gain.setValueAtTime(0, startTime + duration / 1000 + 0.01);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration / 1000 + 0.01);
        
        return startTime + duration / 1000 + gapDuration / 1000;
      };

      for (const char of outputText) {
        if (char === '.') {
          currentTime = playTone(800, dotDuration, currentTime);
        } else if (char === '-') {
          currentTime = playTone(800, dashDuration, currentTime);
        } else if (char === ' ') {
          currentTime += letterGap / 1000;
        } else if (char === '/') {
          currentTime += wordGap / 1000;
        }
      }

      // Stop playing indicator when audio finishes
      setTimeout(() => {
        setIsPlaying(false);
      }, (currentTime - audioContext.currentTime) * 1000);

    } catch (error) {
      setIsPlaying(false);
      toast({
        title: "Audio Error",
        description: "Could not play Morse code audio. Your browser may not support this feature.",
        variant: "destructive",
      });
    }
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    // Note: In a real implementation, you'd want to keep track of audio nodes to stop them
  };

  const examples = [
    {
      name: 'SOS Emergency Signal',
      text: 'SOS',
      morse: '... --- ...',
      description: 'International distress signal'
    },
    {
      name: 'Hello World',
      text: 'HELLO WORLD',
      morse: '.... . .-.. .-.. --- / .-- --- .-. .-.. -..',
      description: 'Classic programming greeting'
    },
    {
      name: 'Numbers',
      text: '12345',
      morse: '.---- ..--- ...-- ....- .....',
      description: 'Morse code numbers 1-5'
    },
    {
      name: 'Punctuation',
      text: 'HELLO, WORLD!',
      morse: '.... . .-.. .-.. --- --..-- / .-- --- .-. .-.. -.. -.-.--',
      description: 'Text with punctuation marks'
    }
  ];

  const morseAlphabet = Object.entries(morseCodeMap).slice(0, 26);
  const morseNumbers = Object.entries(morseCodeMap).slice(26, 36);
  const morsePunctuation = Object.entries(morseCodeMap).slice(36);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Morse Code Translator
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Convert text to Morse code and vice versa. Learn Morse code, send secret messages, or practice your telegraphy skills with audio playback support.
              </p>
            </div>

            <Tabs defaultValue="translator" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="translator">Translator</TabsTrigger>
                <TabsTrigger value="reference">Morse Code Chart</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>

              <TabsContent value="translator" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Radio className="h-5 w-5" />
                        <span>Morse Code Translator</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={mode === 'encode' ? 'default' : 'secondary'}>
                          {mode === 'encode' ? 'Text → Morse' : 'Morse → Text'}
                        </Badge>
                        <Button onClick={switchMode} variant="outline" size="sm">
                          <ArrowRightLeft className="h-4 w-4 mr-2" />
                          Switch
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {mode === 'encode' 
                        ? 'Enter text to convert to Morse code'
                        : 'Enter Morse code to convert to text (use spaces between letters, / for word breaks)'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="input-text">
                        {mode === 'encode' ? 'Text Input' : 'Morse Code Input'}
                      </Label>
                      <Textarea
                        id="input-text"
                        placeholder={mode === 'encode' 
                          ? 'Enter your text here...' 
                          : 'Enter Morse code here (e.g., .... . .-.. .-.. --- / .-- --- .-. .-.. -..)'}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[120px] mt-2"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={translate} size="lg">
                        <ArrowRightLeft className="h-4 w-4 mr-2" />
                        Translate
                      </Button>
                      <Button onClick={reset} variant="outline" size="lg">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>

                    {outputText && (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>
                              {mode === 'encode' ? 'Morse Code Output' : 'Text Output'}
                            </Label>
                            <div className="flex gap-2">
                              {mode === 'encode' && (
                                <>
                                  <Button
                                    onClick={isPlaying ? stopPlayback : playMorseCode}
                                    variant="outline"
                                    size="sm"
                                  >
                                    {isPlaying ? (
                                      <>
                                        <Pause className="h-4 w-4 mr-2" />
                                        Stop
                                      </>
                                    ) : (
                                      <>
                                        <Play className="h-4 w-4 mr-2" />
                                        Play Audio
                                      </>
                                    )}
                                  </Button>
                                </>
                              )}
                              <Button
                                onClick={() => copyToClipboard(outputText)}
                                variant="outline"
                                size="sm"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </Button>
                            </div>
                          </div>
                          <Textarea
                            value={outputText}
                            readOnly
                            className="min-h-[120px] font-mono bg-gray-50"
                          />
                        </div>

                        {mode === 'encode' && (
                          <div className="space-y-2">
                            <Label>Audio Playback Speed (WPM: {Math.round(1200 / playbackSpeed[0])})</Label>
                            <Slider
                              value={playbackSpeed}
                              onValueChange={setPlaybackSpeed}
                              max={500}
                              min={100}
                              step={25}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Fast ({Math.round(1200 / 100)} WPM)</span>
                              <span>Slow ({Math.round(1200 / 500)} WPM)</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reference" className="space-y-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Letters (A-Z)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {morseAlphabet.map(([letter, morse]) => (
                          <div key={letter} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="font-bold text-lg">{letter}</span>
                            <span className="font-mono text-blue-600">{morse}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Numbers (0-9)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {morseNumbers.map(([number, morse]) => (
                          <div key={number} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="font-bold text-lg">{number}</span>
                            <span className="font-mono text-green-600">{morse}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Punctuation & Special Characters</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {morsePunctuation.map(([char, morse]) => (
                          <div key={char} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="font-bold text-lg">{char === ' ' ? 'SPACE' : char}</span>
                            <span className="font-mono text-purple-600">{morse}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="examples" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Volume2 className="h-5 w-5" />
                      <span>Morse Code Examples</span>
                    </CardTitle>
                    <CardDescription>
                      Click on any example to load it into the translator.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {examples.map((example, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            setInputText(example.text);
                            setOutputText(example.morse);
                            setMode('encode');
                          }}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{example.name}</h3>
                              <Badge variant="outline">Click to try</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600">Text: </span>
                                <span className="font-mono">{example.text}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Morse: </span>
                                <span className="font-mono text-blue-600">{example.morse}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{example.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Morse Code Facts & Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p><strong>History:</strong> Morse code was developed by Samuel Morse in the 1830s for telegraph communication.</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p><strong>SOS:</strong> The international distress signal "SOS" (... --- ...) was chosen because it's easy to recognize, not because it stands for "Save Our Ship".</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p><strong>Timing:</strong> A dash is three times as long as a dot. Gaps between elements of the same letter equal one dot duration.</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p><strong>Learning:</strong> Start with common letters like E (.), T (-), A (.-), and I (..) to build your Morse code skills.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MorseCodeTranslator;
