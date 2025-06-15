import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ruler, ArrowLeftRight, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LengthConverter = () => {
  const [length, setLength] = useState(1);
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  // Conversion factors to meters
  const lengthUnits = {
    // Metric
    millimeters: 0.001,
    centimeters: 0.01,
    meters: 1,
    kilometers: 1000,
    
    // Imperial/US
    inches: 0.0254,
    feet: 0.3048,
    yards: 0.9144,
    miles: 1609.344,
    
    // Nautical
    nauticalMiles: 1852,
    
    // Scientific/Astronomical
    micrometers: 0.000001,
    lightYears: 9.461e15,
    astronomicalUnits: 1.496e11,
    
    // Other
    chains: 20.1168,
    furlongs: 201.168,
    leagues: 4828.032
  };

  const unitCategories = {
    metric: ['millimeters', 'centimeters', 'meters', 'kilometers'],
    imperial: ['inches', 'feet', 'yards', 'miles'],
    nautical: ['nauticalMiles'],
    scientific: ['micrometers', 'lightYears', 'astronomicalUnits'],
    other: ['chains', 'furlongs', 'leagues']
  };

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const convertLength = () => {
    const fromFactor = lengthUnits[fromUnit as keyof typeof lengthUnits];
    const toFactor = lengthUnits[toUnit as keyof typeof lengthUnits];
    
    if (!fromFactor || !toFactor) return;
    
    // Convert to meters first, then to target unit
    const meters = length * fromFactor;
    const converted = meters / toFactor;
    
    setResult(converted);

    addToHistory(`${length} ${fromUnit} = ${converted.toFixed(8)} ${toUnit}`);
    
    toast({
      title: "Length Converted",
      description: `${length} ${fromUnit} = ${converted.toFixed(8)} ${toUnit}`
    });
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const formatUnitName = (unit: string) => {
    const names: { [key: string]: string } = {
      millimeters: 'Millimeters (mm)',
      centimeters: 'Centimeters (cm)',
      meters: 'Meters (m)',
      kilometers: 'Kilometers (km)',
      inches: 'Inches (in)',
      feet: 'Feet (ft)',
      yards: 'Yards (yd)',
      miles: 'Miles (mi)',
      nauticalMiles: 'Nautical Miles (nmi)',
      micrometers: 'Micrometers (μm)',
      lightYears: 'Light Years (ly)',
      astronomicalUnits: 'Astronomical Units (AU)',
      chains: 'Chains (ch)',
      furlongs: 'Furlongs (fur)',
      leagues: 'Leagues (lea)'
    };
    return names[unit] || unit;
  };

  const commonConversions = [
    { from: 'meters', to: 'feet', value: 1, label: '1m → ft' },
    { from: 'feet', to: 'meters', value: 1, label: '1ft → m' },
    { from: 'inches', to: 'centimeters', value: 1, label: '1in → cm' },
    { from: 'miles', to: 'kilometers', value: 1, label: '1mi → km' },
    { from: 'kilometers', to: 'miles', value: 1, label: '1km → mi' },
    { from: 'yards', to: 'meters', value: 1, label: '1yd → m' }
  ];

  const quickConvert = (from: string, to: string, value: number) => {
    setFromUnit(from);
    setToUnit(to);
    setLength(value);
    
    setTimeout(() => convertLength(), 100);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Length Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert between metric, imperial, nautical, and scientific length units with precision.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-6 w-6" />
                  Length Unit Converter
                </CardTitle>
                <CardDescription>Convert between different length measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Length Value</Label>
                  <Input
                    type="number"
                    step="any"
                    value={length}
                    onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                    placeholder="Enter length"
                    className="text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="md:col-span-2">
                    <Label>From Unit</Label>
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(unitCategories).map(([category, units]) => (
                          <div key={category}>
                            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                              {category}
                            </div>
                            {units.map(unit => (
                              <SelectItem key={unit} value={unit}>
                                {formatUnitName(unit)}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      onClick={swapUnits} 
                      variant="outline" 
                      size="sm"
                      className="h-10 w-10 p-0"
                    >
                      <ArrowLeftRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label>To Unit</Label>
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(unitCategories).map(([category, units]) => (
                          <div key={category}>
                            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                              {category}
                            </div>
                            {units.map(unit => (
                              <SelectItem key={unit} value={unit}>
                                {formatUnitName(unit)}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={convertLength} className="w-full" size="lg">
                  Convert Length
                </Button>

                {result !== null && (
                  <div className="bg-green-50 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {result.toExponential(6)}
                    </div>
                    <div className="text-gray-600">
                      {length} {fromUnit} = {result.toExponential(6)} {toUnit}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Standard form: {result.toFixed(8)}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-lg font-semibold mb-4 block">Common Conversions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonConversions.map((conversion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => quickConvert(conversion.from, conversion.to, conversion.value)}
                        className="text-sm p-2 h-auto"
                      >
                        {conversion.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Length Facts:</h4>
                  <div className="text-sm space-y-1">
                    <div>• 1 meter = 3.28084 feet = 39.3701 inches</div>
                    <div>• 1 mile = 5,280 feet = 1.609 kilometers</div>
                    <div>• 1 nautical mile = 1.852 kilometers</div>
                    <div>• 1 light year ≈ 9.46 trillion kilometers</div>
                    <div>• 1 AU (Earth-Sun distance) ≈ 150 million km</div>
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
                <CardDescription>Recent length conversions</CardDescription>
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
                <CardTitle>Unit Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold">Metric System:</div>
                    <div className="text-gray-600">mm, cm, m, km</div>
                  </div>
                  <div>
                    <div className="font-semibold">Imperial System:</div>
                    <div className="text-gray-600">in, ft, yd, mi</div>
                  </div>
                  <div>
                    <div className="font-semibold">Nautical:</div>
                    <div className="text-gray-600">nmi</div>
                  </div>
                  <div>
                    <div className="font-semibold">Scientific:</div>
                    <div className="text-gray-600">μm, ly, AU</div>
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

export default LengthConverter;
