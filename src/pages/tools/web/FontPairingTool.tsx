
import React, { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Copy, RefreshCw, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FontPairingTool = () => {
  const [headingFont, setHeadingFont] = useState('Inter');
  const [bodyFont, setBodyFont] = useState('Open Sans');
  const [headingSize, setHeadingSize] = useState(32);
  const [bodySize, setBodySize] = useState(16);
  const [headingWeight, setHeadingWeight] = useState('700');
  const [bodyWeight, setBodyWeight] = useState('400');
  const [lineHeight, setLineHeight] = useState(1.5);
  const [sampleText, setSampleText] = useState('The quick brown fox jumps over the lazy dog');
  const { toast } = useToast();

  const googleFonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro',
    'Raleway', 'PT Sans', 'Lora', 'Merriweather', 'Playfair Display',
    'Oswald', 'Nunito', 'Ubuntu', 'Poppins', 'Mukti', 'Fira Sans',
    'Crimson Text', 'PT Serif', 'Source Serif Pro', 'Libre Baskerville',
    'Cormorant Garamond', 'EB Garamond', 'Libre Franklin'
  ];

  const fontPairings = [
    { heading: 'Playfair Display', body: 'Source Sans Pro', category: 'Elegant' },
    { heading: 'Montserrat', body: 'Merriweather', category: 'Modern' },
    { heading: 'Oswald', body: 'Open Sans', category: 'Bold' },
    { heading: 'Lora', body: 'Lato', category: 'Classic' },
    { heading: 'Raleway', body: 'Crimson Text', category: 'Sophisticated' },
    { heading: 'Inter', body: 'PT Serif', category: 'Contemporary' }
  ];

  const generateCSS = useCallback(() => {
    return `/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=${headingFont.replace(' ', '+')}:wght@${headingWeight}&family=${bodyFont.replace(' ', '+')}:wght@${bodyWeight}&display=swap');

/* Heading Styles */
h1, h2, h3, h4, h5, h6 {
  font-family: '${headingFont}', sans-serif;
  font-weight: ${headingWeight};
  font-size: ${headingSize}px;
  line-height: ${lineHeight};
}

/* Body Text Styles */
body, p {
  font-family: '${bodyFont}', sans-serif;
  font-weight: ${bodyWeight};
  font-size: ${bodySize}px;
  line-height: ${lineHeight};
}`;
  }, [headingFont, bodyFont, headingSize, bodySize, headingWeight, bodyWeight, lineHeight]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`
    });
  };

  const applyPairing = (pairing: { heading: string; body: string }) => {
    setHeadingFont(pairing.heading);
    setBodyFont(pairing.body);
  };

  const randomizePairing = () => {
    const randomPairing = fontPairings[Math.floor(Math.random() * fontPairings.length)];
    applyPairing(randomPairing);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Font Pairing Tool
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover perfect font combinations for your designs. Test typography and generate CSS code.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Font Settings</CardTitle>
                  <CardDescription>Configure your typography</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Heading Font</Label>
                    <Select value={headingFont} onValueChange={setHeadingFont}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-48">
                        {googleFonts.map((font) => (
                          <SelectItem key={font} value={font}>{font}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Body Font</Label>
                    <Select value={bodyFont} onValueChange={setBodyFont}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-48">
                        {googleFonts.map((font) => (
                          <SelectItem key={font} value={font}>{font}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Heading Size: {headingSize}px</Label>
                      <Slider value={[headingSize]} onValueChange={(v) => setHeadingSize(v[0])} min={16} max={72} step={1} />
                    </div>
                    <div className="space-y-2">
                      <Label>Body Size: {bodySize}px</Label>
                      <Slider value={[bodySize]} onValueChange={(v) => setBodySize(v[0])} min={12} max={24} step={1} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Heading Weight</Label>
                      <Select value={headingWeight} onValueChange={setHeadingWeight}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="300">Light (300)</SelectItem>
                          <SelectItem value="400">Regular (400)</SelectItem>
                          <SelectItem value="500">Medium (500)</SelectItem>
                          <SelectItem value="600">Semi Bold (600)</SelectItem>
                          <SelectItem value="700">Bold (700)</SelectItem>
                          <SelectItem value="800">Extra Bold (800)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Body Weight</Label>
                      <Select value={bodyWeight} onValueChange={setBodyWeight}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="300">Light (300)</SelectItem>
                          <SelectItem value="400">Regular (400)</SelectItem>
                          <SelectItem value="500">Medium (500)</SelectItem>
                          <SelectItem value="600">Semi Bold (600)</SelectItem>
                          <SelectItem value="700">Bold (700)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Line Height: {lineHeight}</Label>
                    <Slider value={[lineHeight]} onValueChange={(v) => setLineHeight(v[0])} min={1} max={2.5} step={0.1} />
                  </div>

                  <div className="space-y-2">
                    <Label>Sample Text</Label>
                    <Input
                      value={sampleText}
                      onChange={(e) => setSampleText(e.target.value)}
                      placeholder="Enter your sample text..."
                    />
                  </div>

                  <Button variant="outline" onClick={randomizePairing} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Random Pairing
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Suggested Pairings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {fontPairings.map((pairing, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => applyPairing(pairing)}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-sm">{pairing.heading} + {pairing.body}</div>
                          <div className="text-xs text-gray-500">{pairing.category}</div>
                        </div>
                        <Eye className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Typography Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 p-6 bg-white rounded-lg border">
                    <h1 style={{ 
                      fontFamily: `'${headingFont}', sans-serif`, 
                      fontSize: `${headingSize}px`, 
                      fontWeight: headingWeight,
                      lineHeight: lineHeight,
                      margin: 0
                    }}>
                      {sampleText}
                    </h1>
                    
                    <h2 style={{ 
                      fontFamily: `'${headingFont}', sans-serif`, 
                      fontSize: `${Math.round(headingSize * 0.8)}px`, 
                      fontWeight: headingWeight,
                      lineHeight: lineHeight,
                      margin: 0
                    }}>
                      Secondary Heading Sample
                    </h2>
                    
                    <p style={{ 
                      fontFamily: `'${bodyFont}', sans-serif`, 
                      fontSize: `${bodySize}px`, 
                      fontWeight: bodyWeight,
                      lineHeight: lineHeight,
                      margin: 0
                    }}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                    
                    <p style={{ 
                      fontFamily: `'${bodyFont}', sans-serif`, 
                      fontSize: `${bodySize}px`, 
                      fontWeight: bodyWeight,
                      lineHeight: lineHeight,
                      margin: 0
                    }}>
                      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Generated CSS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Complete CSS Code</h4>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generateCSS(), 'CSS Code')}>
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                  </div>
                  <pre className="p-3 bg-gray-900 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                    <code>{generateCSS()}</code>
                  </pre>
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

export default FontPairingTool;
