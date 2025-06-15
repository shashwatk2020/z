
import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Copy, Download, RotateCcw, Smile, Heart, Star, Sparkles, Zap, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EmojiTextGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [generationMode, setGenerationMode] = useState('replace-words');
  const [emojiDensity, setEmojiDensity] = useState('medium');
  const [emojiStyle, setEmojiStyle] = useState('mixed');
  const [customEmojis, setCustomEmojis] = useState('');
  const [preserveCase, setPreserveCase] = useState(true);
  const [addSpacing, setAddSpacing] = useState(true);
  const [wrapEmojis, setWrapEmojis] = useState(false);
  const [randomSeed, setRandomSeed] = useState(1);
  const { toast } = useToast();

  // Emoji mappings by category
  const emojiMappings = {
    emotions: {
      'happy': ['😊', '😄', '😃', '🙂', '😁', '😆', '🤗', '😍'],
      'sad': ['😢', '😭', '😞', '☹️', '😿', '💔', '😔', '😟'],
      'love': ['❤️', '💕', '💖', '💗', '💝', '💘', '💞', '🥰'],
      'angry': ['😠', '😡', '🤬', '💢', '😤', '👿', '🔥', '⚡'],
      'surprised': ['😲', '😱', '🤯', '😮', '😯', '🫨', '💥', '✨'],
      'funny': ['😂', '🤣', '😆', '🤪', '😜', '🤭', '🙃', '😋'],
    },
    nature: {
      'sun': ['☀️', '🌞', '🌅', '🌄', '🔆', '💛', '🌻', '⭐'],
      'moon': ['🌙', '🌛', '🌜', '🌚', '🌝', '🌓', '✨', '⭐'],
      'flower': ['🌸', '🌺', '🌻', '🌷', '🌹', '🏵️', '💐', '🌼'],
      'tree': ['🌳', '🌲', '🌴', '🌿', '🍃', '🌱', '🎋', '🌾'],
      'water': ['💧', '🌊', '💦', '🏊', '🚿', '⛵', '🐠', '🌀'],
    },
    food: {
      'pizza': ['🍕', '🧀', '🍅', '🌶️', '🥓', '🍞', '😋', '🤤'],
      'coffee': ['☕', '🫘', '🤎', '💨', '😌', '🌅', '⚡', '💪'],
      'cake': ['🎂', '🧁', '🍰', '🎉', '🎈', '✨', '🎊', '🥳'],
      'fruit': ['🍎', '🍌', '🍇', '🍓', '🥝', '🍑', '🍊', '🥭'],
    },
    activities: {
      'work': ['💼', '💻', '📊', '📈', '⚡', '🎯', '💪', '🔥'],
      'study': ['📚', '✏️', '🎓', '🧠', '💡', '📝', '🔍', '⭐'],
      'party': ['🎉', '🎊', '🥳', '🎈', '🍾', '🎵', '💃', '🕺'],
      'travel': ['✈️', '🌍', '🗺️', '📍', '🎒', '📷', '🚗', '🏖️'],
      'music': ['🎵', '🎶', '🎸', '🎤', '🎧', '🎹', '🥁', '🎺'],
    }
  };

  const densitySettings = {
    low: { frequency: 0.1, maxPerSentence: 1 },
    medium: { frequency: 0.2, maxPerSentence: 2 },
    high: { frequency: 0.3, maxPerSentence: 3 },
    extreme: { frequency: 0.5, maxPerSentence: 5 }
  };

  const processedText = useMemo(() => {
    if (!inputText.trim()) return '';

    let result = inputText;
    const density = densitySettings[emojiDensity as keyof typeof densitySettings];
    
    // Parse custom emojis
    const customEmojiList = customEmojis.split(',').map(e => e.trim()).filter(e => e);
    
    // Seeded random function
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    switch (generationMode) {
      case 'replace-words': {
        const words = result.split(/(\s+)/);
        return words.map((word, index) => {
          if (/^\s+$/.test(word)) return word;
          
          const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
          let replacement = word;
          
          // Check all emoji categories
          for (const category of Object.values(emojiMappings)) {
            for (const [key, emojis] of Object.entries(category)) {
              if (cleanWord.includes(key) || key.includes(cleanWord)) {
                const shouldReplace = seededRandom(randomSeed + index) < density.frequency;
                if (shouldReplace) {
                  const emojiIndex = Math.floor(seededRandom(randomSeed + index + 1000) * emojis.length);
                  const emoji = emojis[emojiIndex];
                  replacement = wrapEmojis ? `(${emoji})` : emoji;
                  if (addSpacing) replacement += ' ';
                  break;
                }
              }
            }
          }
          
          return replacement;
        }).join('');
      }

      case 'add-between-words': {
        const sentences = result.split(/([.!?]+)/);
        return sentences.map(sentence => {
          if (/[.!?]+/.test(sentence)) return sentence;
          
          const words = sentence.split(' ').filter(w => w.trim());
          if (words.length < 2) return sentence;
          
          let emojiCount = 0;
          const maxEmojis = Math.min(density.maxPerSentence, Math.floor(words.length / 2));
          
          return words.map((word, index) => {
            if (index === words.length - 1) return word;
            
            const shouldAddEmoji = seededRandom(randomSeed + index) < density.frequency && emojiCount < maxEmojis;
            if (shouldAddEmoji) {
              emojiCount++;
              const allEmojis = customEmojiList.length > 0 ? customEmojiList : 
                Object.values(emojiMappings).flat().flat();
              const emojiIndex = Math.floor(seededRandom(randomSeed + index + 2000) * allEmojis.length);
              const emoji = allEmojis[emojiIndex];
              const spacing = addSpacing ? ' ' : '';
              return word + spacing + (wrapEmojis ? `(${emoji})` : emoji) + spacing;
            }
            
            return word + ' ';
          }).join('').trim();
        }).join('');
      }

      case 'sentence-endings': {
        return result.replace(/([.!?]+)/g, (match, punctuation) => {
          const shouldAddEmoji = seededRandom(randomSeed + punctuation.length) < density.frequency;
          if (shouldAddEmoji) {
            const allEmojis = customEmojiList.length > 0 ? customEmojiList : 
              Object.values(emojiMappings).flat().flat();
            const emojiIndex = Math.floor(seededRandom(randomSeed + 3000) * allEmojis.length);
            const emoji = allEmojis[emojiIndex];
            const spacing = addSpacing ? ' ' : '';
            return punctuation + spacing + (wrapEmojis ? `(${emoji})` : emoji);
          }
          return match;
        });
      }

      case 'random-insertion': {
        const chars = result.split('');
        let insertionCount = Math.floor(chars.length * density.frequency);
        const positions = [];
        
        for (let i = 0; i < insertionCount; i++) {
          const pos = Math.floor(seededRandom(randomSeed + i + 4000) * chars.length);
          positions.push(pos);
        }
        
        positions.sort((a, b) => b - a); // Sort in descending order
        
        positions.forEach(pos => {
          const allEmojis = customEmojiList.length > 0 ? customEmojiList : 
            Object.values(emojiMappings).flat().flat();
          const emojiIndex = Math.floor(seededRandom(randomSeed + pos + 5000) * allEmojis.length);
          const emoji = allEmojis[emojiIndex];
          const spacing = addSpacing ? ' ' : '';
          chars.splice(pos, 0, spacing + (wrapEmojis ? `(${emoji})` : emoji) + spacing);
        });
        
        return chars.join('');
      }

      case 'emoji-text-art': {
        const lines = result.split('\n');
        return lines.map(line => {
          if (!line.trim()) return line;
          
          const chars = line.split('');
          return chars.map(char => {
            if (char === ' ') return '  ';
            if (/[a-zA-Z0-9]/.test(char)) {
              const emojiOptions = ['⭐', '✨', '🌟', '💫', '🔥', '💎', '🎯', '⚡'];
              const emojiIndex = Math.floor(seededRandom(randomSeed + char.charCodeAt(0)) * emojiOptions.length);
              return emojiOptions[emojiIndex];
            }
            return char;
          }).join(' ');
        }).join('\n');
      }

      default:
        return result;
    }
  }, [inputText, generationMode, emojiDensity, emojiStyle, customEmojis, preserveCase, addSpacing, wrapEmojis, randomSeed]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Generated emoji text has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy text to clipboard.",
        variant: "destructive"
      });
    }
  };

  const downloadAsFile = () => {
    if (!processedText.trim()) {
      toast({
        title: "No text to download",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([processedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'emoji-text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "File downloaded",
      description: "The emoji text has been downloaded.",
    });
  };

  const clearAll = () => {
    setInputText('');
  };

  const loadSampleText = () => {
    const sampleTexts = [
      "I love working on exciting projects! Today was amazing and I feel so happy about the progress we made.",
      "The sun is shining bright today. I'm going to have coffee with friends and maybe eat some pizza later.",
      "Studying for exams is hard work but I know it will pay off. Music helps me focus and stay motivated.",
      "Planning a big party for my birthday next week! Can't wait to celebrate with cake and dancing."
    ];
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setInputText(sampleTexts[randomIndex]);
  };

  const regenerate = () => {
    setRandomSeed(Math.floor(Math.random() * 10000));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Smile className="h-8 w-8 text-yellow-500" />
                Advanced Emoji Text Generator
              </CardTitle>
              <CardDescription>
                Transform your text with emojis using various generation modes. Perfect for social media, messaging, creative writing, and adding fun to any text.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Configuration Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="generation-mode" className="text-sm font-medium">Generation Mode</Label>
                  <Select value={generationMode} onValueChange={setGenerationMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="replace-words">Replace Words</SelectItem>
                      <SelectItem value="add-between-words">Add Between Words</SelectItem>
                      <SelectItem value="sentence-endings">Sentence Endings</SelectItem>
                      <SelectItem value="random-insertion">Random Insertion</SelectItem>
                      <SelectItem value="emoji-text-art">Emoji Text Art</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emoji-density" className="text-sm font-medium">Emoji Density</Label>
                  <Select value={emojiDensity} onValueChange={setEmojiDensity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Subtle)</SelectItem>
                      <SelectItem value="medium">Medium (Balanced)</SelectItem>
                      <SelectItem value="high">High (Abundant)</SelectItem>
                      <SelectItem value="extreme">Extreme (Maximum)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emoji-style" className="text-sm font-medium">Emoji Style</Label>
                  <Select value={emojiStyle} onValueChange={setEmojiStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed">Mixed (All Categories)</SelectItem>
                      <SelectItem value="emotions">Emotions Only</SelectItem>
                      <SelectItem value="nature">Nature Only</SelectItem>
                      <SelectItem value="food">Food Only</SelectItem>
                      <SelectItem value="activities">Activities Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="preserve-case" className="text-sm font-medium">Preserve Case</Label>
                  <Switch
                    id="preserve-case"
                    checked={preserveCase}
                    onCheckedChange={setPreserveCase}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="add-spacing" className="text-sm font-medium">Add Spacing</Label>
                  <Switch
                    id="add-spacing"
                    checked={addSpacing}
                    onCheckedChange={setAddSpacing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="wrap-emojis" className="text-sm font-medium">Wrap in Brackets</Label>
                  <Switch
                    id="wrap-emojis"
                    checked={wrapEmojis}
                    onCheckedChange={setWrapEmojis}
                  />
                </div>
              </div>

              {/* Custom Emojis */}
              <div className="space-y-2">
                <Label htmlFor="custom-emojis" className="text-lg font-semibold">Custom Emojis (Optional)</Label>
                <Input
                  id="custom-emojis"
                  placeholder="Enter custom emojis separated by commas: 🎨, 🚀, 💡, ⭐"
                  value={customEmojis}
                  onChange={(e) => setCustomEmojis(e.target.value)}
                  className="text-base"
                />
              </div>

              {/* Input Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="input-text" className="text-lg font-semibold">Input Text</Label>
                  <div className="flex gap-2">
                    <Button onClick={loadSampleText} variant="outline" size="sm">
                      Load Sample
                    </Button>
                    <Button onClick={regenerate} variant="outline" size="sm" className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="input-text"
                  placeholder="Enter your text here to transform it with emojis..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[150px] text-base"
                />
              </div>

              {/* Result Section */}
              <div className="space-y-2">
                <Label htmlFor="result-text" className="text-lg font-semibold">Generated Emoji Text</Label>
                <Textarea
                  id="result-text"
                  value={processedText}
                  readOnly
                  className="min-h-[150px] text-base bg-gray-50 font-mono"
                  placeholder="Your emoji-enhanced text will appear here..."
                />
              </div>

              {/* Statistics */}
              {inputText.trim() && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{inputText.length}</div>
                    <div className="text-sm text-gray-600">Original Length</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{processedText.length}</div>
                    <div className="text-sm text-gray-600">New Length</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {(processedText.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length}
                    </div>
                    <div className="text-sm text-gray-600">Emojis Added</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{generationMode.replace('-', ' ')}</div>
                    <div className="text-sm text-gray-600">Mode</div>
                  </Card>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 justify-center pt-4">
                <Button 
                  onClick={() => copyToClipboard(processedText)} 
                  variant="outline" 
                  className="flex items-center gap-2"
                  disabled={!processedText.trim()}
                >
                  <Copy className="h-4 w-4" />
                  Copy Result
                </Button>
                <Button 
                  onClick={downloadAsFile} 
                  variant="outline" 
                  className="flex items-center gap-2"
                  disabled={!processedText.trim()}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button onClick={clearAll} variant="destructive" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Clear All
                </Button>
              </div>

              {/* Usage Examples */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generation Modes Explained:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Replace Words:</strong> Replaces keywords with relevant emojis based on context
                  </div>
                  <div>
                    <strong>Add Between Words:</strong> Inserts emojis between words randomly
                  </div>
                  <div>
                    <strong>Sentence Endings:</strong> Adds emojis at the end of sentences
                  </div>
                  <div>
                    <strong>Random Insertion:</strong> Places emojis randomly throughout the text
                  </div>
                  <div>
                    <strong>Emoji Text Art:</strong> Converts characters to emoji patterns for artistic effect
                  </div>
                </div>
              </div>

              {/* Feature Explanations */}
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Perfect For
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Social media posts and captions</li>
                    <li>• Text messages and chat conversations</li>
                    <li>• Creative writing and storytelling</li>
                    <li>• Marketing content and announcements</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Advanced Features
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Context-aware emoji replacement</li>
                    <li>• Custom emoji sets and categories</li>
                    <li>• Adjustable density and spacing</li>
                    <li>• Multiple generation algorithms</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmojiTextGenerator;
