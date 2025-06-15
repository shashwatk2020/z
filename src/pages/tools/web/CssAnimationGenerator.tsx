
import React, { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Copy, Play, Pause, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CssAnimationGenerator = () => {
  const [animationType, setAnimationType] = useState('fadeIn');
  const [duration, setDuration] = useState(1);
  const [delay, setDelay] = useState(0);
  const [iterations, setIterations] = useState('1');
  const [direction, setDirection] = useState('normal');
  const [fillMode, setFillMode] = useState('both');
  const [timingFunction, setTimingFunction] = useState('ease');
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const animations = [
    { value: 'fadeIn', label: 'Fade In' },
    { value: 'fadeOut', label: 'Fade Out' },
    { value: 'slideInLeft', label: 'Slide In Left' },
    { value: 'slideInRight', label: 'Slide In Right' },
    { value: 'slideInUp', label: 'Slide In Up' },
    { value: 'slideInDown', label: 'Slide In Down' },
    { value: 'bounceIn', label: 'Bounce In' },
    { value: 'zoomIn', label: 'Zoom In' },
    { value: 'rotateIn', label: 'Rotate In' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'shake', label: 'Shake' },
    { value: 'flip', label: 'Flip' }
  ];

  const timingFunctions = [
    'ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear',
    'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
  ];

  const generateKeyframes = useCallback(() => {
    const keyframes: Record<string, string> = {
      fadeIn: `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`,
      fadeOut: `@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}`,
      slideInLeft: `@keyframes slideInLeft {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`,
      slideInRight: `@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`,
      slideInUp: `@keyframes slideInUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}`,
      slideInDown: `@keyframes slideInDown {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}`,
      bounceIn: `@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}`,
      zoomIn: `@keyframes zoomIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}`,
      rotateIn: `@keyframes rotateIn {
  from { transform: rotate(-200deg); opacity: 0; }
  to { transform: rotate(0); opacity: 1; }
}`,
      pulse: `@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}`,
      shake: `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}`,
      flip: `@keyframes flip {
  from { transform: perspective(400px) rotateY(0); }
  to { transform: perspective(400px) rotateY(360deg); }
}`
    };
    return keyframes[animationType] || '';
  }, [animationType]);

  const generateCSS = useCallback(() => {
    const keyframes = generateKeyframes();
    const animationCSS = `animation: ${animationType} ${duration}s ${timingFunction} ${delay}s ${iterations} ${direction} ${fillMode};`;
    
    return `${keyframes}

.animated-element {
  ${animationCSS}
}`;
  }, [animationType, duration, delay, iterations, direction, fillMode, timingFunction, generateKeyframes]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`
    });
  };

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 100);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              CSS Animation Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create beautiful CSS animations with a visual editor. Customize timing, effects, and generate code.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Animation Settings</CardTitle>
                  <CardDescription>Configure your animation properties</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Animation Type</Label>
                    <Select value={animationType} onValueChange={setAnimationType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {animations.map((anim) => (
                          <SelectItem key={anim.value} value={anim.value}>{anim.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Duration: {duration}s</Label>
                    <Slider value={[duration]} onValueChange={(v) => setDuration(v[0])} min={0.1} max={5} step={0.1} />
                  </div>

                  <div className="space-y-2">
                    <Label>Delay: {delay}s</Label>
                    <Slider value={[delay]} onValueChange={(v) => setDelay(v[0])} min={0} max={3} step={0.1} />
                  </div>

                  <div className="space-y-2">
                    <Label>Timing Function</Label>
                    <Select value={timingFunction} onValueChange={setTimingFunction}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timingFunctions.map((func) => (
                          <SelectItem key={func} value={func}>{func}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Iterations</Label>
                    <Select value={iterations} onValueChange={setIterations}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="infinite">Infinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Direction</Label>
                    <Select value={direction} onValueChange={setDirection}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="reverse">Reverse</SelectItem>
                        <SelectItem value="alternate">Alternate</SelectItem>
                        <SelectItem value="alternate-reverse">Alternate Reverse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Fill Mode</Label>
                    <Select value={fillMode} onValueChange={setFillMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="forwards">Forwards</SelectItem>
                        <SelectItem value="backwards">Backwards</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={toggleAnimation} className="flex-1">
                      {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <Button variant="outline" onClick={resetAnimation}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Animation Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-12 bg-gray-100 rounded-lg min-h-[300px]">
                    <div
                      className="w-24 h-24 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                      style={{
                        animation: isPlaying ? `${animationType} ${duration}s ${timingFunction} ${delay}s ${iterations} ${direction} ${fillMode}` : 'none'
                      }}
                    >
                      DIV
                    </div>
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
                  <pre className="p-3 bg-gray-900 rounded-lg text-green-400 font-mono text-sm overflow-x-auto max-h-96">
                    <code>{generateCSS()}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes rotateIn {
          from { transform: rotate(-200deg); opacity: 0; }
          to { transform: rotate(0); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        @keyframes flip {
          from { transform: perspective(400px) rotateY(0); }
          to { transform: perspective(400px) rotateY(360deg); }
        }
      `}</style>
      <Footer />
    </div>
  );
};

export default CssAnimationGenerator;
