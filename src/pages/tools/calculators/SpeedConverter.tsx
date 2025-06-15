
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gauge, ArrowLeftRight, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SpeedConverter = () => {
  const [speed, setSpeed] = useState(100);
  const [fromUnit, setFromUnit] = useState('kph');
  const [toUnit, setToUnit] = useState('mph');
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  // Conversion factors to meters per second
  const speedUnits = {
    // Common units
    mps: { name: 'Meters per Second (m/s)', factor: 1 },
    kph: { name: 'Kilometers per Hour (km/h)', factor: 0.277778 },
    mph: { name: 'Miles per Hour (mph)', factor: 0.44704 },
    fps: { name: 'Feet per Second (ft/s)', factor: 0.3048 },
    
    // Nautical
    knots: { name: 'Knots (kn)', factor: 0.514444 },
    
    // Scientific
    cps: { name: 'Centimeters per Second (cm/s)', factor: 0.01 },
    
    // Uncommon but useful
    milesPerMinute: { name: 'Miles per Minute', factor: 26.8224 },
    feetPerMinute: { name: 'Feet per Minute (ft/min)', factor: 0.00508 },
    kmPerMinute: { name: 'Kilometers per Minute', factor: 16.6667 },
    
    // Special
    mach: { name: 'Mach (at sea level)', factor: 343 },
    lightSpeed: { name: 'Speed of Light (c)', factor: 299792458 }
  };

  const unitCategories = {
    common: ['mps', 'kph', 'mph', 'fps'],
    nautical: ['knots'],
    time: ['milesPerMinute', 'feetPerMinute', 'kmPerMinute'],
    scientific: ['cps', 'mach', 'lightSpeed']
  };

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const convertSpeed = () => {
    const fromFactor = speedUnits[fromUnit as keyof typeof speedUnits].factor;
    const toFactor = speedUnits[toUnit as keyof typeof speedUnits].factor;
    
    if (!fromFactor || !toFactor) return;
    
    // Convert to m/s first, then to target unit
    const mps = speed * fromFactor;
    const converted = mps / toFactor;
    
    setResult(converted);

    const fromName = speedUnits[fromUnit as keyof typeof speedUnits].name.split(' ')[0];
    const toName = speedUnits[toUnit as keyof typeof speedUnits].name.split(' ')[0];

    addToHistory(`${speed} ${fromName} = ${converted.toFixed(6)} ${toName}`);
    
    toast({
      title: "Speed Converted",
      description: `${speed} ${fromName} = ${converted.toFixed(6)} ${toName}`
    });
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const getSpeedContext = (speedMps: number) => {
    if (speedMps < 1) return "Walking pace";
    if (speedMps < 5) return "Running pace";
    if (speedMps < 15) return "Cycling speed";
    if (speedMps < 30) return "City driving";
    if (speedMps < 50) return "Highway speed";
    if (speedMps < 100) return "High speed";
    if (speedMps < 300) return "Aircraft speed";
    return "Supersonic";
  };

  const commonSpeeds = [
    { mps: 1.4, label: "Walking (5 km/h)" },
    { mps: 5, label: "Running (18 km/h)" },
    { mps: 14, label: "Cycling (50 km/h)" },
    { mps: 28, label: "City limit (100 km/h)" },
    { mps: 33, label: "Highway (120 km/h)" },
    { mps: 100, label: "High-speed train" }
  ];

  const setQuickSpeed = (speedMps: number) => {
    setSpeed(speedMps);
    setFromUnit('mps');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Speed Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert between different speed units including km/h, mph, m/s, knots, and more.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-6 w-6" />
                  Speed Unit Converter
                </CardTitle>
                <CardDescription>Convert between different speed measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Speed Value</Label>
                  <Input
                    type="number"
                    step="any"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value) || 0)}
                    placeholder="Enter speed"
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
                                {speedUnits[unit as keyof typeof speedUnits].name}
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
                                {speedUnits[unit as keyof typeof speedUnits].name}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={convertSpeed} className="w-full" size="lg">
                  Convert Speed
                </Button>

                {result !== null && (
                  <div className="bg-red-50 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {result.toFixed(6)}
                    </div>
                    <div className="text-gray-600">
                      {speed} {speedUnits[fromUnit as keyof typeof speedUnits].name.split(' ')[0]} = {result.toFixed(6)} {speedUnits[toUnit as keyof typeof speedUnits].name.split(' ')[0]}
                    </div>
                    <div className="text-sm text-red-500 mt-2">
                      Context: {getSpeedContext(speed * speedUnits[fromUnit as keyof typeof speedUnits].factor)}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-lg font-semibold mb-4 block">Common Speeds</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonSpeeds.map((speedRef, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => setQuickSpeed(speedRef.mps)}
                        className="text-sm p-2 h-auto"
                      >
                        {speedRef.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Speed Facts:</h4>
                  <div className="text-sm space-y-1">
                    <div>• 1 km/h = 0.278 m/s = 0.621 mph</div>
                    <div>• 1 mph = 1.609 km/h = 0.447 m/s</div>
                    <div>• 1 knot = 1.852 km/h = 1.151 mph</div>
                    <div>• Sound travels at ~343 m/s (Mach 1)</div>
                    <div>• Light travels at ~300,000 km/s</div>
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
                <CardDescription>Recent speed conversions</CardDescription>
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
                <CardTitle>Speed Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold">Walking:</div>
                    <div className="text-gray-600">1-2 m/s (3-7 km/h)</div>
                  </div>
                  <div>
                    <div className="font-semibold">Running:</div>
                    <div className="text-gray-600">3-6 m/s (10-20 km/h)</div>
                  </div>
                  <div>
                    <div className="font-semibold">Cycling:</div>
                    <div className="text-gray-600">5-15 m/s (18-54 km/h)</div>
                  </div>
                  <div>
                    <div className="font-semibold">Cars:</div>
                    <div className="text-gray-600">14-40 m/s (50-144 km/h)</div>
                  </div>
                  <div>
                    <div className="font-semibold">Aircraft:</div>
                    <div className="text-gray-600">50-300 m/s (180-1080 km/h)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Conversions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>60 mph:</span>
                    <span>96.6 km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>100 km/h:</span>
                    <span>62.1 mph</span>
                  </div>
                  <div className="flex justify-between">
                    <span>30 knots:</span>
                    <span>55.6 km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>10 m/s:</span>
                    <span>36 km/h</span>
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

export default SpeedConverter;
