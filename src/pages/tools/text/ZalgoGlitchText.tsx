
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, RotateCcw, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ZalgoGlitchText = () => {
  const [inputText, setInputText] = useState('');
  const [output, setOutput] = useState('');
  const [intensity, setIntensity] = useState([3]);
  const { toast } = useToast();

  // Zalgo combining characters
  const zalgoUp = [
    '\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357',
    '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343', '\u0344', '\u034a', '\u034b', '\u034c',
    '\u0303', '\u0302', '\u030c', '\u0350', '\u0300', '\u0301', '\u030b', '\u030f', '\u0312', '\u0313',
    '\u0314', '\u033d', '\u0309', '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369',
    '\u036a', '\u036b', '\u036c', '\u036d', '\u036e', '\u036f', '\u033e', '\u035b', '\u0346', '\u031a'
  ];

  const zalgoMid = [
    '\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327', '\u0328', '\u0334',
    '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e', '\u035f', '\u0360', '\u0362', '\u0338',
    '\u0337', '\u0361', '\u0489'
  ];

  const zalgoDown = [
    '\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f', '\u0320', '\u0324',
    '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c', '\u032d', '\u032e', '\u032f', '\u0330',
    '\u0331', '\u0332', '\u0333', '\u0339', '\u033a', '\u033b', '\u033c', '\u0345', '\u0347', '\u0348',
    '\u0349', '\u034d', '\u034e', '\u0353', '\u0354', '\u0355', '\u0356', '\u0359', '\u035a', '\u0323'
  ];

  const generateZalgo = () => {
    if (!inputText) {
      toast({
        title: "Error",
        description: "Please enter some text to transform.",
        variant: "destructive",
      });
      return;
    }

    const zalgoText = inputText
      .split('')
      .map(char => {
        if (char === ' ') return char;
        
        let result = char;
        const currentIntensity = intensity[0];
        
        // Add random combining characters based on intensity
        for (let i = 0; i < currentIntensity; i++) {
          if (Math.random() < 0.7) {
            result += zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
          }
          if (Math.random() < 0.7) {
            result += zalgoMid[Math.floor(Math.random() * zalgoMid.length)];
          }
          if (Math.random() < 0.7) {
            result += zalgoDown[Math.floor(Math.random() * zalgoDown.length)];
          }
        }
        
        return result;
      })
      .join('');

    setOutput(zalgoText);
  };

  useEffect(() => {
    if (inputText) {
      generateZalgo();
    } else {
      setOutput('');
    }
  }, [inputText, intensity]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "Zalgo text copied to clipboard.",
    });
  };

  const clearAll = () => {
    setInputText('');
    setOutput('');
  };

  const sampleTexts = [
    "Hello World",
    "Glitch Effect",
    "Scary Text",
    "Zalgo Power"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Zalgo Glitch Text Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create spooky, glitched text with combining Unicode characters. Perfect for horror themes, social media, and creative projects.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Real-time Generation</Badge>
              <Badge variant="secondary">Adjustable Intensity</Badge>
              <Badge variant="secondary">Unicode Magic</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Normal Text Input
                </CardTitle>
                <CardDescription>
                  Enter text to transform into glitched Zalgo text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Type your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[150px] text-base"
                />

                <div>
                  <Label>Glitch Intensity: {intensity[0]}</Label>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Mild</span>
                    <span>Extreme</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={generateZalgo} className="flex-1">
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Zalgo
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Try these examples:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {sampleTexts.map((text, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputText(text)}
                        className="text-xs"
                      >
                        {text}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Zalgo Output</CardTitle>
                    <CardDescription>
                      Your glitched text appears here
                    </CardDescription>
                  </div>
                  {output && (
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={output}
                  readOnly
                  placeholder="Zalgo text will appear here..."
                  className="min-h-[150px] text-lg"
                  style={{ lineHeight: '2' }}
                />
                {output && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Original: {inputText.length} characters</p>
                    <p>Zalgo: {output.length} characters</p>
                    <p>Added: {output.length - inputText.length} combining marks</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>About Zalgo Text</CardTitle>
              <CardDescription>Understanding the glitch text phenomenon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-3">What is Zalgo?</h4>
                  <p className="mb-2">Zalgo text is created by adding Unicode combining characters to normal text, creating a "corrupted" or "glitched" appearance.</p>
                  <p className="text-gray-600">The effect comes from combining marks that stack above, below, and through the base characters.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Use Cases</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Horror-themed content</li>
                    <li>• Social media posts</li>
                    <li>• Creative writing</li>
                    <li>• Gaming usernames</li>
                    <li>• Artistic projects</li>
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

export default ZalgoGlitchText;
