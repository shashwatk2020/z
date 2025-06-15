
import React, { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Copy, RefreshCw, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FlexboxGenerator = () => {
  const [flexDirection, setFlexDirection] = useState('row');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('stretch');
  const [flexWrap, setFlexWrap] = useState('nowrap');
  const [alignContent, setAlignContent] = useState('stretch');
  const [gap, setGap] = useState(16);
  const [itemCount, setItemCount] = useState(5);
  const { toast } = useToast();

  const generateCSS = useCallback(() => {
    return {
      container: `display: flex;\nflex-direction: ${flexDirection};\njustify-content: ${justifyContent};\nalign-items: ${alignItems};\nflex-wrap: ${flexWrap};\nalign-content: ${alignContent};\ngap: ${gap}px;`,
      item: `background-color: #3498db;\ncolor: white;\npadding: 1rem;\nborder-radius: 4px;\nmin-width: 80px;\nmin-height: 60px;\ndisplay: flex;\nalign-items: center;\njustify-content: center;`
    };
  }, [flexDirection, justifyContent, alignItems, flexWrap, alignContent, gap]);

  const generateHTML = useCallback(() => {
    let html = '<div class="flex-container">\n';
    for (let i = 1; i <= itemCount; i++) {
      html += `  <div class="flex-item">Item ${i}</div>\n`;
    }
    html += '</div>';
    return html;
  }, [itemCount]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`
    });
  };

  const resetSettings = () => {
    setFlexDirection('row');
    setJustifyContent('flex-start');
    setAlignItems('stretch');
    setFlexWrap('nowrap');
    setAlignContent('stretch');
    setGap(16);
    setItemCount(5);
  };

  const { container: containerCSS, item: itemCSS } = generateCSS();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Flexbox Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Visually create CSS flexbox layouts. Adjust properties and see the code in real-time.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Flexbox Properties</CardTitle>
                  <CardDescription>Configure your flex container</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Flex Direction</Label>
                    <Select value={flexDirection} onValueChange={setFlexDirection}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="row">Row</SelectItem>
                        <SelectItem value="row-reverse">Row Reverse</SelectItem>
                        <SelectItem value="column">Column</SelectItem>
                        <SelectItem value="column-reverse">Column Reverse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Justify Content</Label>
                    <Select value={justifyContent} onValueChange={setJustifyContent}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flex-start">Flex Start</SelectItem>
                        <SelectItem value="flex-end">Flex End</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="space-between">Space Between</SelectItem>
                        <SelectItem value="space-around">Space Around</SelectItem>
                        <SelectItem value="space-evenly">Space Evenly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Align Items</Label>
                    <Select value={alignItems} onValueChange={setAlignItems}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stretch">Stretch</SelectItem>
                        <SelectItem value="flex-start">Flex Start</SelectItem>
                        <SelectItem value="flex-end">Flex End</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="baseline">Baseline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Flex Wrap</Label>
                    <Select value={flexWrap} onValueChange={setFlexWrap}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nowrap">No Wrap</SelectItem>
                        <SelectItem value="wrap">Wrap</SelectItem>
                        <SelectItem value="wrap-reverse">Wrap Reverse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Align Content</Label>
                    <Select value={alignContent} onValueChange={setAlignContent}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stretch">Stretch</SelectItem>
                        <SelectItem value="flex-start">Flex Start</SelectItem>
                        <SelectItem value="flex-end">Flex End</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="space-between">Space Between</SelectItem>
                        <SelectItem value="space-around">Space Around</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Gap: {gap}px</Label>
                    <Slider value={[gap]} onValueChange={(v) => setGap(v[0])} min={0} max={50} step={1} />
                  </div>

                  <div className="space-y-2">
                    <Label>Number of Items</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setItemCount(Math.max(1, itemCount - 1))}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        type="number" 
                        value={itemCount} 
                        onChange={(e) => setItemCount(Math.max(1, Number(e.target.value)))}
                        className="text-center"
                        min="1"
                        max="20"
                      />
                      <Button variant="outline" size="sm" onClick={() => setItemCount(Math.min(20, itemCount + 1))}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button variant="outline" onClick={resetSettings} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-100 rounded-lg min-h-[300px]">
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: flexDirection as any,
                        justifyContent: justifyContent as any,
                        alignItems: alignItems as any,
                        flexWrap: flexWrap as any,
                        alignContent: alignContent as any,
                        gap: `${gap}px`,
                        minHeight: '250px',
                        border: '2px dashed #ccc',
                        padding: '1rem'
                      }}
                    >
                      {[...Array(itemCount)].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            backgroundColor: '#3498db',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '4px',
                            minWidth: '80px',
                            minHeight: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          Item {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Generated Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">Container CSS</h4>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(containerCSS, 'Container CSS')}>
                        <Copy className="h-4 w-4 mr-2" /> Copy
                      </Button>
                    </div>
                    <pre className="p-3 bg-gray-900 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                      <code>{`.flex-container {\n${containerCSS}\n}`}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">Item CSS</h4>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(itemCSS, 'Item CSS')}>
                        <Copy className="h-4 w-4 mr-2" /> Copy
                      </Button>
                    </div>
                    <pre className="p-3 bg-gray-900 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                      <code>{`.flex-item {\n${itemCSS}\n}`}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">HTML</h4>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generateHTML(), 'HTML')}>
                        <Copy className="h-4 w-4 mr-2" /> Copy
                      </Button>
                    </div>
                    <pre className="p-3 bg-gray-900 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                      <code>{generateHTML()}</code>
                    </pre>
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

export default FlexboxGenerator;
