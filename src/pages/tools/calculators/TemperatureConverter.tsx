
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Thermometer, ArrowLeftRight, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TemperatureConverter = () => {
  const [temperature, setTemperature] = useState(0);
  const [fromScale, setFromScale] = useState('celsius');
  const [toScale, setToScale] = useState('fahrenheit');
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const scales = [
    { value: 'celsius', label: 'Celsius (°C)', symbol: '°C' },
    { value: 'fahrenheit', label: 'Fahrenheit (°F)', symbol: '°F' },
    { value: 'kelvin', label: 'Kelvin (K)', symbol: 'K' },
    { value: 'rankine', label: 'Rankine (°R)', symbol: '°R' },
    { value: 'reaumur', label: 'Réaumur (°Ré)', symbol: '°Ré' }
  ];

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const convertTemperature = () => {
    let celsius: number;
    
    // Convert to Celsius first
    switch (fromScale) {
      case 'celsius':
        celsius = temperature;
        break;
      case 'fahrenheit':
        celsius = (temperature - 32) * 5/9;
        break;
      case 'kelvin':
        celsius = temperature - 273.15;
        break;
      case 'rankine':
        celsius = (temperature - 491.67) * 5/9;
        break;
      case 'reaumur':
        celsius = temperature * 5/4;
        break;
      default:
        celsius = temperature;
    }

    // Convert from Celsius to target scale
    let converted: number;
    switch (toScale) {
      case 'celsius':
        converted = celsius;
        break;
      case 'fahrenheit':
        converted = celsius * 9/5 + 32;
        break;
      case 'kelvin':
        converted = celsius + 273.15;
        break;
      case 'rankine':
        converted = (celsius + 273.15) * 9/5;
        break;
      case 'reaumur':
        converted = celsius * 4/5;
        break;
      default:
        converted = celsius;
    }

    setResult(converted);

    const fromSymbol = scales.find(s => s.value === fromScale)?.symbol || '';
    const toSymbol = scales.find(s => s.value === toScale)?.symbol || '';

    addToHistory(`${temperature}${fromSymbol} = ${converted.toFixed(2)}${toSymbol}`);
    
    toast({
      title: "Temperature Converted",
      description: `${temperature}${fromSymbol} = ${converted.toFixed(2)}${toSymbol}`
    });
  };

  const swapScales = () => {
    const temp = fromScale;
    setFromScale(toScale);
    setToScale(temp);
  };

  const getTemperatureInfo = (temp: number, scale: string) => {
    if (scale === 'celsius') {
      if (temp === 0) return "Water freezing point";
      if (temp === 100) return "Water boiling point";
      if (temp === -273.15) return "Absolute zero";
      if (temp === 37) return "Normal body temperature";
    } else if (scale === 'fahrenheit') {
      if (temp === 32) return "Water freezing point";
      if (temp === 212) return "Water boiling point";
      if (temp === -459.67) return "Absolute zero";
      if (temp === 98.6) return "Normal body temperature";
    } else if (scale === 'kelvin') {
      if (temp === 273.15) return "Water freezing point";
      if (temp === 373.15) return "Water boiling point";
      if (temp === 0) return "Absolute zero";
      if (temp === 310.15) return "Normal body temperature";
    }
    return null;
  };

  const quickTemperatures = [
    { celsius: 0, label: "Water freezes" },
    { celsius: 20, label: "Room temperature" },
    { celsius: 37, label: "Body temperature" },
    { celsius: 100, label: "Water boils" },
    { celsius: -40, label: "Very cold" },
    { celsius: 50, label: "Very hot day" }
  ];

  const setQuickTemp = (temp: number) => {
    setTemperature(temp);
    setFromScale('celsius');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Temperature Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert temperatures between Celsius, Fahrenheit, Kelvin, Rankine, and Réaumur scales.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-6 w-6" />
                  Temperature Converter
                </CardTitle>
                <CardDescription>Convert between temperature scales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Temperature Value</Label>
                  <Input
                    type="number"
                    step="any"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
                    placeholder="Enter temperature"
                    className="text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="md:col-span-2">
                    <Label>From Scale</Label>
                    <Select value={fromScale} onValueChange={setFromScale}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {scales.map(scale => (
                          <SelectItem key={scale.value} value={scale.value}>
                            {scale.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      onClick={swapScales} 
                      variant="outline" 
                      size="sm"
                      className="h-10 w-10 p-0"
                    >
                      <ArrowLeftRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label>To Scale</Label>
                    <Select value={toScale} onValueChange={setToScale}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {scales.map(scale => (
                          <SelectItem key={scale.value} value={scale.value}>
                            {scale.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={convertTemperature} className="w-full" size="lg">
                  Convert Temperature
                </Button>

                {result !== null && (
                  <div className="bg-orange-50 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {result.toFixed(2)}{scales.find(s => s.value === toScale)?.symbol}
                    </div>
                    <div className="text-gray-600">
                      {temperature}{scales.find(s => s.value === fromScale)?.symbol} = {result.toFixed(2)}{scales.find(s => s.value === toScale)?.symbol}
                    </div>
                    {getTemperatureInfo(result, toScale) && (
                      <div className="text-sm text-orange-500 mt-2">
                        {getTemperatureInfo(result, toScale)}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <Label className="text-lg font-semibold mb-4 block">Quick Temperatures</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {quickTemperatures.map((temp, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => setQuickTemp(temp.celsius)}
                        className="text-sm p-2 h-auto"
                      >
                        {temp.celsius}°C<br/>{temp.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Temperature Scales:</h4>
                  <div className="text-sm space-y-1">
                    <div>• Celsius: Based on water freezing (0°) and boiling (100°)</div>
                    <div>• Fahrenheit: Common in US, water freezes at 32°F</div>
                    <div>• Kelvin: Scientific scale, absolute zero at 0K</div>
                    <div>• Rankine: Fahrenheit-based absolute scale</div>
                    <div>• Réaumur: Historical scale, water boils at 80°Ré</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Conversion History
                </CardTitle>
                <CardDescription>Recent temperature conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No conversions yet</p>
                  ) : (
                    history.slice().reverse().map((calc, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm break-all">
                        {calc}
                      </div>
                    ))
                  )}
                </div>
                {history.length > 0 && (
                  <Button 
                    onClick={() => setHistory([])} 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                  >
                    Clear History
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Reference Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Absolute Zero:</span>
                    <span>-273.15°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Water Freezes:</span>
                    <span>0°C / 32°F</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Room Temp:</span>
                    <span>20°C / 68°F</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Body Temp:</span>
                    <span>37°C / 98.6°F</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Water Boils:</span>
                    <span>100°C / 212°F</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TemperatureConverter;
