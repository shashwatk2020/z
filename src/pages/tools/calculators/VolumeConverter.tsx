import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Beaker, ArrowLeftRight, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VolumeConverter = () => {
  const [volume, setVolume] = useState(1);
  const [fromUnit, setFromUnit] = useState('liters');
  const [toUnit, setToUnit] = useState('gallons');
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  // Conversion factors to liters
  const volumeUnits = {
    // Metric
    milliliters: 0.001,
    liters: 1,
    cubicCentimeters: 0.001,
    cubicMeters: 1000,
    
    // US Liquid
    fluidOunces: 0.0295735,
    cups: 0.236588,
    pints: 0.473176,
    quarts: 0.946353,
    gallons: 3.78541,
    
    // US Dry
    dryPints: 0.550610,
    dryQuarts: 1.101221,
    pecks: 8.809768,
    bushels: 35.23907,
    
    // Imperial
    imperialFluidOunces: 0.0284131,
    imperialCups: 0.284131,
    imperialPints: 0.568261,
    imperialQuarts: 1.13652,
    imperialGallons: 4.54609,
    
    // Cooking
    teaspoons: 0.00492892,
    tablespoons: 0.0147868,
    
    // Other
    cubicInches: 0.0163871,
    cubicFeet: 28.3168,
    cubicYards: 764.555,
    barrels: 158.987
  };

  const unitCategories = {
    metric: ['milliliters', 'liters', 'cubicCentimeters', 'cubicMeters'],
    usLiquid: ['fluidOunces', 'cups', 'pints', 'quarts', 'gallons'],
    usDry: ['dryPints', 'dryQuarts', 'pecks', 'bushels'],
    imperial: ['imperialFluidOunces', 'imperialCups', 'imperialPints', 'imperialQuarts', 'imperialGallons'],
    cooking: ['teaspoons', 'tablespoons'],
    other: ['cubicInches', 'cubicFeet', 'cubicYards', 'barrels']
  };

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const convertVolume = () => {
    const fromFactor = volumeUnits[fromUnit as keyof typeof volumeUnits];
    const toFactor = volumeUnits[toUnit as keyof typeof volumeUnits];
    
    if (!fromFactor || !toFactor) return;
    
    // Convert to liters first, then to target unit
    const liters = volume * fromFactor;
    const converted = liters / toFactor;
    
    setResult(converted);

    addToHistory(`${volume} ${fromUnit} = ${converted.toFixed(8)} ${toUnit}`);
    
    toast({
      title: "Volume Converted",
      description: `${volume} ${fromUnit} = ${converted.toFixed(6)} ${toUnit}`
    });
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const formatUnitName = (unit: string) => {
    const names: { [key: string]: string } = {
      milliliters: 'Milliliters (mL)',
      liters: 'Liters (L)',
      cubicCentimeters: 'Cubic Centimeters (cm³)',
      cubicMeters: 'Cubic Meters (m³)',
      fluidOunces: 'Fluid Ounces (fl oz)',
      cups: 'Cups (US)',
      pints: 'Pints (US liquid)',
      quarts: 'Quarts (US liquid)',
      gallons: 'Gallons (US liquid)',
      dryPints: 'Dry Pints (US)',
      dryQuarts: 'Dry Quarts (US)',
      pecks: 'Pecks (US)',
      bushels: 'Bushels (US)',
      imperialFluidOunces: 'Imperial Fluid Ounces',
      imperialCups: 'Imperial Cups',
      imperialPints: 'Imperial Pints',
      imperialQuarts: 'Imperial Quarts',
      imperialGallons: 'Imperial Gallons',
      teaspoons: 'Teaspoons (tsp)',
      tablespoons: 'Tablespoons (tbsp)',
      cubicInches: 'Cubic Inches (in³)',
      cubicFeet: 'Cubic Feet (ft³)',
      cubicYards: 'Cubic Yards (yd³)',
      barrels: 'Barrels (oil)'
    };
    return names[unit] || unit;
  };

  const commonConversions = [
    { from: 'liters', to: 'gallons', value: 1, label: '1L → gal' },
    { from: 'gallons', to: 'liters', value: 1, label: '1gal → L' },
    { from: 'cups', to: 'milliliters', value: 1, label: '1cup → mL' },
    { from: 'fluidOunces', to: 'milliliters', value: 8, label: '8fl oz → mL' },
    { from: 'pints', to: 'liters', value: 1, label: '1pt → L' },
    { from: 'cubicFeet', to: 'liters', value: 1, label: '1ft³ → L' }
  ];

  const quickConvert = (from: string, to: string, value: number) => {
    setFromUnit(from);
    setToUnit(to);
    setVolume(value);
    
    setTimeout(() => convertVolume(), 100);
  };

  const getVolumeContext = (volumeLiters: number) => {
    if (volumeLiters < 0.001) return "Drop size";
    if (volumeLiters < 0.1) return "Small container";
    if (volumeLiters < 1) return "Bottle size";
    if (volumeLiters < 10) return "Large container";
    if (volumeLiters < 100) return "Tank size";
    if (volumeLiters < 1000) return "Large tank";
    return "Industrial scale";
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Volume Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert between metric, US, imperial, and cooking volume units with precision.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-6 w-6" />
                  Volume Unit Converter
                </CardTitle>
                <CardDescription>Convert between different volume measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Volume Value</Label>
                  <Input
                    type="number"
                    step="any"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value) || 0)}
                    placeholder="Enter volume"
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
                              {category.replace(/([A-Z])/g, ' $1').trim()}
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
                              {category.replace(/([A-Z])/g, ' $1').trim()}
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

                <Button onClick={convertVolume} className="w-full" size="lg">
                  Convert Volume
                </Button>

                {result !== null && (
                  <div className="bg-cyan-50 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-cyan-600 mb-2">
                      {result.toFixed(8)}
                    </div>
                    <div className="text-gray-600">
                      {volume} {fromUnit} = {result.toFixed(8)} {toUnit}
                    </div>
                    <div className="text-sm text-cyan-500 mt-2">
                      Scale: {getVolumeContext(volume * volumeUnits[fromUnit as keyof typeof volumeUnits])}
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
                  <h4 className="font-semibold mb-2">Volume Facts:</h4>
                  <div className="text-sm space-y-1">
                    <div>• 1 liter = 1000 mL = 1.057 US quarts</div>
                    <div>• 1 US gallon = 3.785 liters = 0.833 imperial gallons</div>
                    <div>• 1 cup (US) = 236.6 mL = 8 fluid ounces</div>
                    <div>• 1 cubic meter = 1000 liters = 264.2 US gallons</div>
                    <div>• 1 tablespoon = 3 teaspoons = 14.8 mL</div>
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
                <CardDescription>Recent volume conversions</CardDescription>
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
                <CardTitle>Measurement Systems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold">Metric:</div>
                    <div className="text-gray-600">mL, L, cm³, m³</div>
                  </div>
                  <div>
                    <div className="font-semibold">US Liquid:</div>
                    <div className="text-gray-600">fl oz, cups, pints, quarts, gal</div>
                  </div>
                  <div>
                    <div className="font-semibold">Imperial:</div>
                    <div className="text-gray-600">UK measurements</div>
                  </div>
                  <div>
                    <div className="font-semibold">Cooking:</div>
                    <div className="text-gray-600">tsp, tbsp</div>
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

export default VolumeConverter;
