
import React, { useState, useCallback, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Copy, Code, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CssGridGenerator = () => {
  const [gridCols, setGridCols] = useState(12);
  const [gridRows, setGridRows] = useState(6);
  const [colGap, setColGap] = useState(16);
  const [rowGap, setRowGap] = useState(16);
  const [itemCount, setItemCount] = useState(12);
  const { toast } = useToast();

  const generateCSS = useCallback(() => {
    return {
      container: `display: grid;\ngrid-template-columns: repeat(${gridCols}, 1fr);\ngrid-template-rows: repeat(${gridRows}, 1fr);\ngap: ${rowGap}px ${colGap}px;`,
      item: `background-color: #3498db;\nborder: 1px solid #2980b9;\ncolor: white;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\npadding: 1rem;\nborder-radius: 4px;`
    }
  }, [gridCols, gridRows, colGap, rowGap]);
  
  const generateHTML = useMemo(() => {
    let html = '<div class="grid-container">\n';
    for (let i = 1; i <= itemCount; i++) {
      html += `  <div class="grid-item">Item ${i}</div>\n`;
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
    setGridCols(12);
    setGridRows(6);
    setColGap(16);
    setRowGap(16);
    setItemCount(12);
    toast({
      title: 'Reset!',
      description: 'Grid settings have been reset to default.'
    })
  };

  const { container: containerCss, item: itemCss } = generateCSS();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              CSS Grid Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Visually create complex CSS grid layouts. Adjust columns, rows, gaps and see the code in real-time.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grid Settings</CardTitle>
                  <CardDescription>Configure your grid layout</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Columns</Label>
                      <Select value={String(gridCols)} onValueChange={(value) => setGridCols(Number(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(24)].map((_, i) => (
                            <SelectItem key={i} value={String(i + 1)}>{i + 1}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Rows</Label>
                      <Select value={String(gridRows)} onValueChange={(value) => setGridRows(Number(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(12)].map((_, i) => (
                            <SelectItem key={i} value={String(i + 1)}>{i + 1}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Column Gap: {colGap}px</Label>
                    <Slider value={[colGap]} onValueChange={(v) => setColGap(v[0])} min={0} max={50} step={1} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Row Gap: {rowGap}px</Label>
                    <Slider value={[rowGap]} onValueChange={(v) => setRowGap(v[0])} min={0} max={50} step={1} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Number of Items: {itemCount}</Label>
                    <Slider value={[itemCount]} onValueChange={(v) => setItemCount(v[0])} min={1} max={gridCols * gridRows} step={1} />
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
                  <div
                    className="p-4 bg-gray-100 rounded-lg"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                      gridTemplateRows: `repeat(${gridRows}, minmax(50px, auto))`,
                      gap: `${rowGap}px ${colGap}px`,
                      minHeight: '200px',
                    }}
                  >
                    {[...Array(itemCount)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-blue-500 text-white flex items-center justify-center p-2 rounded text-sm"
                        style={{ gridColumn: 'auto / span 1', gridRow: 'auto / span 1' }}
                      >
                        Item {i + 1}
                      </div>
                    ))}
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
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(containerCss, 'Container CSS')}>
                        <Copy className="h-4 w-4 mr-2" /> Copy
                      </Button>
                    </div>
                    <pre className="p-3 bg-gray-900 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                      <code>{`.grid-container {\n${containerCss}\n}`}</code>
                    </pre>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">Item CSS</h4>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(itemCss, 'Item CSS')}>
                        <Copy className="h-4 w-4 mr-2" /> Copy
                      </Button>
                    </div>
                    <pre className="p-3 bg-gray-900 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                      <code>{`.grid-item {\n${itemCss}\n}`}</code>
                    </pre>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">HTML</h4>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generateHTML, 'HTML')}>
                        <Copy className="h-4 w-4 mr-2" /> Copy
                      </Button>
                    </div>
                    <pre className="p-3 bg-gray-900 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                      <code>{generateHTML}</code>
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

export default CssGridGenerator;
