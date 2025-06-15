import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scale, ArrowLeftRight, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WeightConverter = () => {
  const [weight, setWeight] = useState(1);
  const [fromUnit, setFromUnit] = useState('kilograms');
  const [toUnit, setToUnit] = useState('pounds');
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  // Conversion factors to grams
  const weightUnits = {
    // Metric
    milligrams: 0.001,
    grams: 1,
    kilograms: 1000,
    tonnes: 1000000,
    
    // Imperial/US
    ounces: 28.3495,
    pounds: 453.592,
    stones: 6350.29,
    shortTons: 907185,
    longTons: 1016047,
    
    // Precious metals
    carats: 0.2,
    grains: 0.0647989,
    
    // Other
    slugs: 14593.9,
    quarters: 12700.6,
    hundredweights: 50802.3
  };

  const unitCategories = {
    metric: ['milligrams', 'grams', 'kilograms', 'tonnes'],
    imperial: ['ounces', 'pounds', 'stones', 'shortTons', 'longTons'],
    precious: ['carats', 'grains'],
    other: ['slugs', 'quarters', 'hundredweights']
  };

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const convertWeight = () => {
    const fromFactor = weightUnits[fromUnit as keyof typeof weightUnits];
    const toFactor = weightUnits[toUnit as keyof typeof weightUnits];
    
    if (!fromFactor || !toFactor) return;
    
    // Convert to grams first, then to target unit
    const grams = weight * fromFactor;
    const converted = grams / toFactor;
    
    setResult(converted);

    addToHistory(`${weight} ${fromUnit} = ${converted.toFixed(8)} ${toUnit}`);
    
    toast({
      title: "Weight Converted",
      description: `${weight} ${fromUnit} = ${converted.toFixed(6)} ${toUnit}`
    });
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const formatUnitName = (unit: string) => {
    const names: { [key: string]: string } = {
      milligrams: 'Milligrams (mg)',
      grams: 'Grams (g)',
      kilograms: 'Kilograms (kg)',
      tonnes: 'Tonnes (t)',
      ounces: 'Ounces (oz)',
      pounds: 'Pounds (lb)',
      stones: 'Stones (st)',
      shortTons: 'Short Tons (US)',
      longTons: 'Long Tons (UK)',
      carats: 'Carats (ct)',
      grains: 'Grains (gr)',
      slugs: 'Slugs',
      quarters: 'Quarters (qr)',
      hundredweights: 'Hundredweights (cwt)'
    };
    return names[unit] || unit;
  };

  const commonConversions = [
    { from: 'kilograms', to: 'pounds', value: 1, label: '1kg → lb' },
    { from: 'pounds', to: 'kilograms', value: 1, label: '1lb → kg' },
    { from: 'ounces', to: 'grams', value: 1, label: '1oz → g' },
    { from: 'grams', to: 'ounces', value: 100, label: '100g → oz' },
    { from: 'stones', to: 'kilograms', value: 1, label: '1st → kg' },
    { from: 'tonnes', to: 'shortTons', value: 1, label: '1t → US ton' }
  ];

  const quickConvert = (from: string, to: string, value: number) => {
    setFromUnit(from);
    setToUnit(to);
    setWeight(value);
    
    setTimeout(() => convertWeight(), 100);
  };

  const getWeightCategory = (weightKg: number) => {
    if (weightKg < 0.001) return "Microscopic";
    if (weightKg < 0.1) return "Very light";
    if (weightKg < 1) return "Light";
    if (weightKg < 50) return "Medium";
    if (weightKg < 500) return "Heavy";
    if (weightKg < 5000) return "Very heavy";
    return "Extremely heavy";
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Weight Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert between metric, imperial, and specialized weight units for all your measurement needs.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-6 w-6" />
                  Weight Unit Converter
                </CardTitle>
                <CardDescription>Convert between different weight measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Weight Value</Label>
                  <Input
                    type="number"
                    step="any"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    placeholder="Enter weight"
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

                <Button onClick={convertWeight} className="w-full" size="lg">
                  Convert Weight
                </Button>

                {result !== null && (
                  <div className="bg-purple-50 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {result.toFixed(8)}
                    </div>
                    <div className="text-gray-600">
                      {weight} {fromUnit} = {result.toFixed(8)} {toUnit}
                    </div>
                    <div className="text-sm text-purple-500 mt-2">
                      Category: {getWeightCategory(weight * (weightUnits[fromUnit as keyof typeof weightUnits] / 1000))}
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
                  <h4 className="font-semibold mb-2">Weight Facts:</h4>
                  <div className="text-sm space-y-1">
                    <div>• 1 kilogram = 2.20462 pounds = 35.274 ounces</div>
                    <div>• 1 stone = 14 pounds = 6.35 kilograms</div>
                    <div>• 1 tonne = 1000 kg = 2204.62 pounds</div>
                    <div>• 1 carat = 200 milligrams (for gems)</div>
                    <div>• 1 grain = 64.8 milligrams (smallest unit)</div>
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
                <CardDescription>Recent weight conversions</CardDescription>
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
                <CardTitle>Unit Systems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold">Metric System:</div>
                    <div className="text-gray-600">mg, g, kg, tonnes</div>
                  </div>
                  <div>
                    <div className="font-semibold">Imperial System:</div>
                    <div className="text-gray-600">oz, lb, st, tons</div>
                  </div>
                  <div>
                    <div className="font-semibold">Precious Metals:</div>
                    <div className="text-gray-600">carats, grains</div>
                  </div>
                  <div>
                    <div className="font-semibold">Scientific:</div>
                    <div className="text-gray-600">slugs, quarters</div>
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

export default WeightConverter;
