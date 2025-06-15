
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, Type, Wand2, Download } from 'lucide-react';

// Unicode character mappings for different bold styles
const BOLD_STYLES = {
  'mathematical-bold': {
    name: 'Mathematical Bold',
    description: 'Bold mathematical symbols',
    map: {
      'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉',
      'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓',
      'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
      'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣',
      'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭',
      'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
      '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
    }
  },
  'bold-serif': {
    name: 'Bold Serif',
    description: 'Bold serif letters',
    map: {
      'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉',
      'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓',
      'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
      'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣',
      'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭',
      'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳'
    }
  },
  'bold-sans-serif': {
    name: 'Bold Sans-Serif',
    description: 'Bold sans-serif letters',
    map: {
      'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝',
      'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧',
      'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
      'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷',
      'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁',
      'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
      '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    }
  },
  'bold-italic': {
    name: 'Bold Italic',
    description: 'Bold italic letters',
    map: {
      'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱',
      'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻',
      'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
      'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋',
      'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕',
      'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛'
    }
  },
  'bold-script': {
    name: 'Bold Script',
    description: 'Bold script/cursive letters',
    map: {
      'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗', 'I': '𝓘', 'J': '𝓙',
      'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣',
      'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩',
      'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲', 'j': '𝓳',
      'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽',
      'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃'
    }
  },
  'bold-fraktur': {
    name: 'Bold Fraktur',
    description: 'Bold fraktur/blackletter style',
    map: {
      'A': '𝔄', 'B': '𝔅', 'C': '𝔞', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': '𞤭', 'I': '𝔦', 'J': '𝔍',
      'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': '𝔯', 'S': '𝔖', 'T': '𝔗',
      'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': '𝔝',
      'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥', 'i': '𝔦', 'j': '𝔧',
      'k': '𝔨',   'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭', 'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱',
      'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵', 'y': '𝔶', 'z': '𝔷'
    }
  },
  'circled': {
    name: 'Circled Bold',
    description: 'Bold letters in circles',
    map: {
      'A': '🅐', 'B': '🅑', 'C': '🅒', 'D': '🅓', 'E': '🅔', 'F': '🅕', 'G': '🅖', 'H': '🅗', 'I': '🅘', 'J': '🅙',
      'K': '🅚', 'L': '🅛', 'M': '🅜', 'N': '🅝', 'O': '🅞', 'P': '🅟', 'Q': '🅠', 'R': '🅡', 'S': '🅢', 'T': '🅣',
      'U': '🅤', 'V': '🅥', 'W': '🅦', 'X': '🅧', 'Y': '🅨', 'Z': '🅩',
      '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
    }
  },
  'squared': {
    name: 'Squared Bold',
    description: 'Bold letters in squares',
    map: {
      'A': '🅰', 'B': '🅱', 'C': '🅲', 'D': '🅳', 'E': '🅴', 'F': '🅵', 'G': '🅶', 'H': '🅷', 'I': '🅸', 'J': '🅹',
      'K': '🅺', 'L': '🅻', 'M': '🅼', 'N': '🅽', 'O': '🅾', 'P': '🅿', 'Q': '🆀', 'R': '🆁', 'S': '🆂', 'T': '🆃',
      'U': '🆄', 'V': '🆅', 'W': '🆆', 'X': '🆇', 'Y': '🆈', 'Z': '🆉'
    }
  }
};

const BoldTextGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('mathematical-bold');
  const [generatedTexts, setGeneratedTexts] = useState<Array<{style: string, text: string}>>([]);
  const { toast } = useToast();

  const generateBoldText = () => {
    if (!inputText.trim()) {
      toast({ 
        title: "No text entered", 
        description: "Please enter some text to convert.", 
        variant: "destructive" 
      });
      return;
    }

    if (selectedStyle === 'all') {
      // Generate all styles
      const allStyles = Object.keys(BOLD_STYLES).map(styleKey => {
        const style = BOLD_STYLES[styleKey as keyof typeof BOLD_STYLES];
        const convertedText = inputText.split('').map(char => 
          style.map[char] || char
        ).join('');
        
        return {
          style: style.name,
          text: convertedText
        };
      });
      setGeneratedTexts(allStyles);
    } else {
      // Generate single style
      const style = BOLD_STYLES[selectedStyle as keyof typeof BOLD_STYLES];
      const convertedText = inputText.split('').map(char => 
        style.map[char] || char
      ).join('');
      
      setGeneratedTexts([{
        style: style.name,
        text: convertedText
      }]);
    }

    toast({ 
      title: "Success", 
      description: "Bold text generated successfully!" 
    });
  };

  const copyToClipboard = (text: string, styleName: string) => {
    navigator.clipboard.writeText(text);
    toast({ 
      title: "Copied!", 
      description: `${styleName} text copied to clipboard.` 
    });
  };

  const downloadAsFile = () => {
    if (generatedTexts.length === 0) return;

    let content = `Bold Text Generator Output\n`;
    content += `Original Text: ${inputText}\n`;
    content += `Generated on: ${new Date().toLocaleString()}\n\n`;

    generatedTexts.forEach(item => {
      content += `${item.style}:\n${item.text}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bold-text-output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ 
      title: "Downloaded!", 
      description: "Bold text file has been downloaded." 
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Advanced Bold Text Generator</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Transform your text with various Unicode bold styles including mathematical bold, serif, sans-serif, script, and decorative options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5 text-blue-500" />
                Text Input & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="input-text">Enter Text</Label>
                <Textarea
                  id="input-text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your text here..."
                  className="mt-2 min-h-[100px]"
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">{inputText.length}/500 characters</p>
              </div>

              <div>
                <Label>Bold Style</Label>
                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Styles</SelectItem>
                    {Object.entries(BOLD_STYLES).map(([key, style]) => (
                      <SelectItem key={key} value={key}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedStyle !== 'all' && BOLD_STYLES[selectedStyle as keyof typeof BOLD_STYLES] && (
                  <p className="text-sm text-gray-500 mt-1">
                    {BOLD_STYLES[selectedStyle as keyof typeof BOLD_STYLES].description}
                  </p>
                )}
              </div>

              <Button 
                onClick={generateBoldText} 
                disabled={!inputText.trim()} 
                className="w-full" 
                size="lg"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Bold Text
              </Button>

              {generatedTexts.length > 0 && (
                <Button 
                  onClick={downloadAsFile} 
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download as File
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5 text-green-500" />
                Generated Bold Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedTexts.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {generatedTexts.map((item, index) => (
                    <div key={index} className="border rounded-md p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-700">{item.style}</h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(item.text, item.style)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <div className="p-3 bg-white rounded border font-mono text-lg break-all">
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center h-full">
                  <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Your bold text will appear here.</p>
                  <p className="text-sm mt-2">Enter some text and select a style to generate.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Available Styles</h2>
            <div className="space-y-3">
              {Object.entries(BOLD_STYLES).map(([key, style]) => (
                <div key={key} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-800">{style.name}</h3>
                  <p className="text-sm text-gray-600">{style.description}</p>
                  <div className="text-lg font-mono mt-1">
                    {style.map['A'] || 'A'}{style.map['B'] || 'B'}{style.map['C'] || 'C'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Features & Tips</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-gray-800">Multiple Styles</h3>
                  <p className="text-sm text-gray-600">Choose from 8 different bold Unicode styles</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-gray-800">Generate All Styles</h3>
                  <p className="text-sm text-gray-600">Generate all styles at once for comparison</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-gray-800">Copy & Download</h3>
                  <p className="text-sm text-gray-600">Easy copy to clipboard or download as file</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-gray-800">Unicode Compatible</h3>
                  <p className="text-sm text-gray-600">Works across platforms and social media</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BoldTextGenerator;
