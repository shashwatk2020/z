
import React, { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Copy, RefreshCw, Download, Plus, Minus, Grid3X3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GridItem {
  id: string;
  gridColumnStart: number;
  gridColumnEnd: number;
  gridRowStart: number;
  gridRowEnd: number;
  content: string;
  backgroundColor: string;
}

const CssGridGenerator = () => {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [columnUnit, setColumnUnit] = useState('1fr');
  const [rowUnit, setRowUnit] = useState('auto');
  const [gap, setGap] = useState(16);
  const [gapUnit, setGapUnit] = useState('px');
  const [containerWidth, setContainerWidth] = useState(100);
  const [containerHeight, setContainerHeight] = useState(400);
  const [showGridLines, setShowGridLines] = useState(true);
  const [autoPlacement, setAutoPlacement] = useState(true);
  const [gridItems, setGridItems] = useState<GridItem[]>([
    { id: '1', gridColumnStart: 1, gridColumnEnd: 2, gridRowStart: 1, gridRowEnd: 2, content: 'Item 1', backgroundColor: '#ff6b6b' },
    { id: '2', gridColumnStart: 2, gridColumnEnd: 3, gridRowStart: 1, gridRowEnd: 2, content: 'Item 2', backgroundColor: '#4ecdc4' },
    { id: '3', gridColumnStart: 3, gridColumnEnd: 4, gridRowStart: 1, gridRowEnd: 2, content: 'Item 3', backgroundColor: '#45b7d1' },
  ]);
  const [presets] = useState([
    { name: 'Basic 3x3', columns: 3, rows: 3, colUnit: '1fr', rowUnit: 'auto' },
    { name: 'Sidebar Layout', columns: '200px 1fr', rows: '1fr', colUnit: '', rowUnit: '' },
    { name: 'Header Footer', columns: '1fr', rows: 'auto 1fr auto', colUnit: '', rowUnit: '' },
    { name: 'Holy Grail', columns: '200px 1fr 200px', rows: 'auto 1fr auto', colUnit: '', rowUnit: '' },
    { name: 'Card Grid', columns: 4, rows: 2, colUnit: '1fr', rowUnit: '200px' },
    { name: 'Masonry', columns: 3, rows: 'auto', colUnit: '1fr', rowUnit: '' },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const generateGridTemplateColumns = () => {
    if (typeof columns === 'string') return columns;
    return Array(columns).fill(columnUnit).join(' ');
  };

  const generateGridTemplateRows = () => {
    if (typeof rows === 'string') return rows;
    return Array(rows).fill(rowUnit).join(' ');
  };

  const generateCSS = useCallback(() => {
    const gridTemplateColumns = generateGridTemplateColumns();
    const gridTemplateRows = generateGridTemplateRows();
    
    let css = `.grid-container {\n  display: grid;\n`;
    css += `  grid-template-columns: ${gridTemplateColumns};\n`;
    css += `  grid-template-rows: ${gridTemplateRows};\n`;
    css += `  gap: ${gap}${gapUnit};\n`;
    css += `  width: ${containerWidth}%;\n`;
    css += `  height: ${containerHeight}px;\n`;
    css += `}`;
    
    if (!autoPlacement && gridItems.length > 0) {
      css += '\n\n/* Grid Items */\n';
      gridItems.forEach((item, index) => {
        css += `.grid-item-${index + 1} {\n`;
        css += `  grid-column: ${item.gridColumnStart} / ${item.gridColumnEnd};\n`;
        css += `  grid-row: ${item.gridRowStart} / ${item.gridRowEnd};\n`;
        css += `}\n\n`;
      });
    }
    
    return css;
  }, [columns, rows, columnUnit, rowUnit, gap, gapUnit, containerWidth, containerHeight, autoPlacement, gridItems]);

  const addGridItem = () => {
    const newItem: GridItem = {
      id: Date.now().toString(),
      gridColumnStart: 1,
      gridColumnEnd: 2,
      gridRowStart: 1,
      gridRowEnd: 2,
      content: `Item ${gridItems.length + 1}`,
      backgroundColor: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    setGridItems([...gridItems, newItem]);
  };

  const removeGridItem = (id: string) => {
    setGridItems(gridItems.filter(item => item.id !== id));
  };

  const updateGridItem = (id: string, field: keyof GridItem, value: any) => {
    setGridItems(gridItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(generateCSS());
    toast({
      title: "Copied!",
      description: "CSS Grid code copied to clipboard"
    });
  };

  const saveToHistory = () => {
    const css = generateCSS();
    setHistory(prev => [css, ...prev.slice(0, 9)]);
    toast({
      title: "Saved!",
      description: "Grid layout saved to history"
    });
  };

  const loadPreset = (preset: typeof presets[0]) => {
    setColumns(preset.columns);
    setRows(preset.rows);
    if (preset.colUnit) setColumnUnit(preset.colUnit);
    if (preset.rowUnit) setRowUnit(preset.rowUnit);
  };

  const randomizeGrid = () => {
    setColumns(Math.floor(Math.random() * 5) + 2);
    setRows(Math.floor(Math.random() * 4) + 2);
    setGap(Math.floor(Math.random() * 30) + 10);
    
    // Randomize grid items
    const newItems = gridItems.map(item => ({
      ...item,
      backgroundColor: '#' + Math.floor(Math.random()*16777215).toString(16)
    }));
    setGridItems(newItems);
  };

  const exportCode = (format: string) => {
    let content = '';
    const timestamp = new Date().toISOString().slice(0, 10);
    
    switch (format) {
      case 'css':
        content = generateCSS();
        break;
      case 'html':
        content = `<div class="grid-container">\n${gridItems.map((item, index) => 
          `  <div class="grid-item grid-item-${index + 1}">${item.content}</div>`
        ).join('\n')}\n</div>`;
        break;
      case 'complete':
        content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Grid Layout</title>
    <style>
${generateCSS()}

.grid-item {
    background: #f0f0f0;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ddd;
}
    </style>
</head>
<body>
    <div class="grid-container">
${gridItems.map((item, index) => 
  `        <div class="grid-item grid-item-${index + 1}" style="background-color: ${item.backgroundColor};">${item.content}</div>`
).join('\n')}
    </div>
</body>
</html>`;
        break;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grid-${timestamp}.${format === 'complete' ? 'html' : format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentCSS = generateCSS();
  const maxCols = typeof columns === 'number' ? columns : 6;
  const maxRows = typeof rows === 'number' ? rows : 6;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced CSS Grid Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create complex CSS Grid layouts with visual controls. Design responsive grids and export clean CSS code.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grid Structure</CardTitle>
                  <CardDescription>Define your grid dimensions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Columns: {columns}</Label>
                    <Slider
                      value={[typeof columns === 'number' ? columns : 3]}
                      onValueChange={(value) => setColumns(value[0])}
                      min={1}
                      max={12}
                      step={1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Column Unit</Label>
                    <Select value={columnUnit} onValueChange={setColumnUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1fr">1fr (Flexible)</SelectItem>
                        <SelectItem value="auto">auto</SelectItem>
                        <SelectItem value="100px">100px</SelectItem>
                        <SelectItem value="200px">200px</SelectItem>
                        <SelectItem value="minmax(100px, 1fr)">minmax(100px, 1fr)</SelectItem>
                        <SelectItem value="repeat(auto-fit, minmax(200px, 1fr))">Auto-fit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Rows: {rows}</Label>
                    <Slider
                      value={[typeof rows === 'number' ? rows : 3]}
                      onValueChange={(value) => setRows(value[0])}
                      min={1}
                      max={8}
                      step={1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Row Unit</Label>
                    <Select value={rowUnit} onValueChange={setRowUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">auto</SelectItem>
                        <SelectItem value="1fr">1fr (Flexible)</SelectItem>
                        <SelectItem value="100px">100px</SelectItem>
                        <SelectItem value="200px">200px</SelectItem>
                        <SelectItem value="minmax(100px, 1fr)">minmax(100px, 1fr)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Gap: {gap}{gapUnit}</Label>
                    <Slider
                      value={[gap]}
                      onValueChange={(value) => setGap(value[0])}
                      min={0}
                      max={50}
                      step={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Gap Unit</Label>
                    <Select value={gapUnit} onValueChange={setGapUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="px">px</SelectItem>
                        <SelectItem value="rem">rem</SelectItem>
                        <SelectItem value="em">em</SelectItem>
                        <SelectItem value="%">%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Container Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Width: {containerWidth}%</Label>
                    <Slider
                      value={[containerWidth]}
                      onValueChange={(value) => setContainerWidth(value[0])}
                      min={50}
                      max={100}
                      step={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Height: {containerHeight}px</Label>
                    <Slider
                      value={[containerHeight]}
                      onValueChange={(value) => setContainerHeight(value[0])}
                      min={200}
                      max={600}
                      step={20}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Show Grid Lines</Label>
                    <Switch
                      checked={showGridLines}
                      onCheckedChange={setShowGridLines}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Auto Placement</Label>
                    <Switch
                      checked={autoPlacement}
                      onCheckedChange={setAutoPlacement}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Presets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {presets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        onClick={() => loadPreset(preset)}
                        className="w-full justify-start"
                      >
                        <Grid3X3 className="h-4 w-4 mr-2" />
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-2">
                <Button onClick={randomizeGrid} variant="outline" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Random
                </Button>
                <Button onClick={saveToHistory} variant="outline">
                  Save
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>Interactive grid layout preview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border-2 border-dashed border-gray-300 p-4"
                    style={{ width: `${containerWidth}%`, height: `${containerHeight}px`, margin: '0 auto' }}
                  >
                    <div
                      className={`h-full w-full ${showGridLines ? 'border border-gray-400' : ''}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: generateGridTemplateColumns(),
                        gridTemplateRows: generateGridTemplateRows(),
                        gap: `${gap}${gapUnit}`,
                        background: showGridLines ? 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 11px)' : 'transparent'
                      }}
                    >
                      {gridItems.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-center text-white font-medium text-sm border border-gray-300 rounded"
                          style={{
                            backgroundColor: item.backgroundColor,
                            gridColumn: autoPlacement ? 'auto' : `${item.gridColumnStart} / ${item.gridColumnEnd}`,
                            gridRow: autoPlacement ? 'auto' : `${item.gridRowStart} / ${item.gridRowEnd}`,
                          }}
                        >
                          {item.content}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Generated CSS</CardTitle>
                  <CardDescription>Copy or export your grid CSS</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={copyCSS}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy CSS
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => exportCode('css')}>
                          <Download className="h-4 w-4 mr-1" />
                          CSS
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => exportCode('html')}>
                          HTML
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => exportCode('complete')}>
                          Complete
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-900 rounded-lg text-green-400 font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto">
                      <pre>{currentCSS}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              {!autoPlacement && (
                <Card>
                  <CardHeader>
                    <CardTitle>Grid Items</CardTitle>
                    <CardDescription>Configure item positions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {gridItems.map((item, index) => (
                      <div key={item.id} className="space-y-2 p-3 border rounded">
                        <div className="flex items-center justify-between">
                          <Input
                            value={item.content}
                            onChange={(e) => updateGridItem(item.id, 'content', e.target.value)}
                            className="text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeGridItem(item.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <Label>Col Start</Label>
                            <Input
                              type="number"
                              value={item.gridColumnStart}
                              onChange={(e) => updateGridItem(item.id, 'gridColumnStart', parseInt(e.target.value))}
                              min={1}
                              max={maxCols + 1}
                            />
                          </div>
                          <div>
                            <Label>Col End</Label>
                            <Input
                              type="number"
                              value={item.gridColumnEnd}
                              onChange={(e) => updateGridItem(item.id, 'gridColumnEnd', parseInt(e.target.value))}
                              min={1}
                              max={maxCols + 1}
                            />
                          </div>
                          <div>
                            <Label>Row Start</Label>
                            <Input
                              type="number"
                              value={item.gridRowStart}
                              onChange={(e) => updateGridItem(item.id, 'gridRowStart', parseInt(e.target.value))}
                              min={1}
                              max={maxRows + 1}
                            />
                          </div>
                          <div>
                            <Label>Row End</Label>
                            <Input
                              type="number"
                              value={item.gridRowEnd}
                              onChange={(e) => updateGridItem(item.id, 'gridRowEnd', parseInt(e.target.value))}
                              min={1}
                              max={maxRows + 1}
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={item.backgroundColor}
                            onChange={(e) => updateGridItem(item.id, 'backgroundColor', e.target.value)}
                            className="w-12 h-8 p-1"
                          />
                          <Input
                            value={item.backgroundColor}
                            onChange={(e) => updateGridItem(item.id, 'backgroundColor', e.target.value)}
                            className="flex-1 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button onClick={addGridItem} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {history.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Grid History</CardTitle>
                    <CardDescription>Your saved grid layouts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {history.map((gridCSS, index) => (
                        <div key={index} className="p-2 border rounded">
                          <code className="text-xs text-gray-600 line-clamp-2">
                            {gridCSS.split('\n')[1]}...
                          </code>
                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-gray-500">Layout {index + 1}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigator.clipboard.writeText(gridCSS)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CssGridGenerator;
