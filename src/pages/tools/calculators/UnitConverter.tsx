
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, ArrowLeftRight, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UnitConverter = () => {
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const unitCategories = {
    length: {
      meters: 1,
      feet: 3.28084,
      inches: 39.3701,
      centimeters: 100,
      millimeters: 1000,
      kilometers: 0.001,
      miles: 0.000621371,
      yards: 1.09361,
      nauticalMiles: 0.000539957
    },
    weight: {
      kilograms: 1,
      pounds: 2.20462,
      ounces: 35.274,
      grams: 1000,
      stones: 0.157473,
      tons: 0.001,
      shortTons: 0.00110231,
      longTons: 0.000984207
    },
    volume: {
      liters: 1,
      gallons: 0.264172,
      quarts: 1.05669,
      pints: 2.11338,
      cups: 4.22675,
      fluidOunces: 33.814,
      milliliters: 1000,
      cubicMeters: 0.001,
      cubicFeet: 0.0353147
    },
    area: {
      squareMeters: 1,
      squareFeet: 10.7639,
      squareInches: 1550,
      acres: 0.000247105,
      hectares: 0.0001,
      squareKilometers: 0.000001,
      squareMiles: 3.861e-7,
      squareYards: 1.19599
    }
  };

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const convert = (category: keyof typeof unitCategories) => {
    const units = unitCategories[category];
    const fromFactor = units[fromUnit as keyof typeof units];
    const toFactor = units[toUnit as keyof typeof units];
    
    if (!fromFactor || !toFactor) return;
    
    const converted = (value / fromFactor) * toFactor;
    setResult(converted);

    addToHistory(`${value} ${fromUnit} = ${converted.toFixed(6)} ${toUnit}`);
    
    toast({
      title: "Conversion Complete",
      description: `${value} ${fromUnit} = ${converted.toFixed(6)} ${toUnit}`
    });
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const renderCategoryConverter = (category: keyof typeof unitCategories, title: string) => {
    const units = Object.keys(unitCategories[category]);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            {title} Converter
          </CardTitle>
          <CardDescription>Convert between different {title.toLowerCase()} units</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Value</Label>
            <Input
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
              placeholder="Enter value"
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
                  {units.map(unit => (
                    <SelectItem key={unit} value={unit}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </SelectItem>
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
                  {units.map(unit => (
                    <SelectItem key={unit} value={unit}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={() => convert(category)} className="w-full">
            Convert {title}
          </Button>

          {result !== null && (
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {result.toFixed(6)}
              </div>
              <div className="text-gray-600">
                {value} {fromUnit} = {result.toFixed(6)} {toUnit}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unit Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert between different units of measurement with precision and ease.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="length" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="length">Length</TabsTrigger>
                <TabsTrigger value="weight">Weight</TabsTrigger>
                <TabsTrigger value="volume">Volume</TabsTrigger>
                <TabsTrigger value="area">Area</TabsTrigger>
              </TabsList>

              <TabsContent value="length">
                {renderCategoryConverter('length', 'Length')}
              </TabsContent>

              <TabsContent value="weight">
                {renderCategoryConverter('weight', 'Weight')}
              </TabsContent>

              <TabsContent value="volume">
                {renderCategoryConverter('volume', 'Volume')}
              </TabsContent>

              <TabsContent value="area">
                {renderCategoryConverter('area', 'Area')}
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Conversion History
                </CardTitle>
                <CardDescription>Recent conversions</CardDescription>
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UnitConverter;
