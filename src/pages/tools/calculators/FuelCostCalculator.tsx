
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, MapPin, DollarSign, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FuelCostCalculator = () => {
  const [distance, setDistance] = useState(100);
  const [fuelEfficiency, setFuelEfficiency] = useState(25);
  const [fuelPrice, setFuelPrice] = useState(3.50);
  const [distanceUnit, setDistanceUnit] = useState('miles');
  const [efficiencyUnit, setEfficiencyUnit] = useState('mpg');
  const [priceUnit, setPriceUnit] = useState('gallon');
  const [currencyUnit, setCurrencyUnit] = useState('USD');
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const convertToMiles = (distance: number, unit: string) => {
    switch (unit) {
      case 'km': return distance * 0.621371;
      case 'miles': return distance;
      default: return distance;
    }
  };

  const convertToMPG = (efficiency: number, unit: string) => {
    switch (unit) {
      case 'mpg': return efficiency;
      case 'l100km': return efficiency > 0 ? 235.214583 / efficiency : 0;
      case 'kmpl': return efficiency * 2.35214583;
      default: return efficiency;
    }
  };

  const convertToPricePerGallon = (price: number, unit: string) => {
    switch (unit) {
      case 'gallon': return price;
      case 'liter': return price * 3.78541;
      default: return price;
    }
  };

  const calculateFuelCost = () => {
    if (!distance || !fuelEfficiency || !fuelPrice || distance <= 0 || fuelEfficiency <= 0 || fuelPrice <= 0) {
      toast({
        title: "Error",
        description: "Please enter valid positive values for all fields",
        variant: "destructive"
      });
      return;
    }

    // Convert everything to standard units (miles, mpg, price per gallon)
    const distanceInMiles = convertToMiles(distance, distanceUnit);
    const efficiencyInMPG = convertToMPG(fuelEfficiency, efficiencyUnit);
    const pricePerGallon = convertToPricePerGallon(fuelPrice, priceUnit);

    // Calculate fuel needed and cost
    const fuelNeeded = distanceInMiles / efficiencyInMPG;
    const totalCost = fuelNeeded * pricePerGallon;

    // Calculate cost per mile/km
    const costPerMile = totalCost / distanceInMiles;
    const costPerKm = costPerMile / 0.621371;

    // Calculate for different trip scenarios
    const scenarios = {
      roundTrip: totalCost * 2,
      weekly: totalCost * 7,
      monthly: totalCost * 30,
      yearly: totalCost * 365
    };

    // Calculate carbon footprint (rough estimate: 19.6 lbs CO2 per gallon)
    const carbonFootprint = fuelNeeded * 19.6;

    const fuelResult = {
      fuelNeeded: parseFloat(fuelNeeded.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      costPerMile: parseFloat(costPerMile.toFixed(3)),
      costPerKm: parseFloat(costPerKm.toFixed(3)),
      scenarios,
      carbonFootprint: parseFloat(carbonFootprint.toFixed(1)),
      efficiency: {
        original: fuelEfficiency,
        mpg: parseFloat(efficiencyInMPG.toFixed(1))
      }
    };

    setResult(fuelResult);
    addToHistory(`${distance} ${distanceUnit}: $${totalCost.toFixed(2)} (${fuelNeeded.toFixed(1)} ${priceUnit === 'liter' ? 'L' : 'gal'})`);
    
    toast({
      title: "Fuel Cost Calculated",
      description: `Total cost: $${totalCost.toFixed(2)} for ${distance} ${distanceUnit}`
    });
  };

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$'
  };

  const getEfficiencyLabel = (unit: string) => {
    switch (unit) {
      case 'mpg': return 'Miles per Gallon';
      case 'l100km': return 'Liters per 100km';
      case 'kmpl': return 'Kilometers per Liter';
      default: return unit;
    }
  };

  const getFuelEfficiencyTips = (mpg: number) => {
    if (mpg >= 40) return { level: 'Excellent', color: 'text-green-600', tips: ['Your vehicle is very fuel efficient!', 'Maintain regular service for optimal performance'] };
    if (mpg >= 30) return { level: 'Good', color: 'text-blue-600', tips: ['Good fuel efficiency', 'Consider eco-driving techniques'] };
    if (mpg >= 20) return { level: 'Average', color: 'text-yellow-600', tips: ['Average efficiency', 'Regular maintenance can help', 'Drive at steady speeds'] };
    return { level: 'Poor', color: 'text-red-600', tips: ['Consider a more fuel-efficient vehicle', 'Check tire pressure regularly', 'Remove excess weight from vehicle'] };
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fuel Cost Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate fuel costs for your trips and get insights on fuel efficiency and environmental impact.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-6 w-6" />
                  Fuel Cost Calculator
                </CardTitle>
                <CardDescription>Calculate fuel costs for your journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Distance</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                        placeholder="Enter distance"
                        className="flex-1"
                      />
                      <Select value={distanceUnit} onValueChange={setDistanceUnit}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="miles">Miles</SelectItem>
                          <SelectItem value="km">KM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>{getEfficiencyLabel(efficiencyUnit)}</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={fuelEfficiency}
                        onChange={(e) => setFuelEfficiency(parseFloat(e.target.value) || 0)}
                        placeholder="Enter efficiency"
                        className="flex-1"
                      />
                      <Select value={efficiencyUnit} onValueChange={setEfficiencyUnit}>
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mpg">MPG</SelectItem>
                          <SelectItem value="l100km">L/100km</SelectItem>
                          <SelectItem value="kmpl">KM/L</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Fuel Price per {priceUnit === 'liter' ? 'Liter' : 'Gallon'}</Label>
                    <div className="flex gap-2">
                      <div className="flex">
                        <Select value={currencyUnit} onValueChange={setCurrencyUnit}>
                          <SelectTrigger className="w-20 rounded-r-none">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="CAD">CAD</SelectItem>
                            <SelectItem value="AUD">AUD</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          step="0.01"
                          value={fuelPrice}
                          onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
                          placeholder="Enter price"
                          className="rounded-l-none flex-1"
                        />
                      </div>
                      <Select value={priceUnit} onValueChange={setPriceUnit}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gallon">Gallon</SelectItem>
                          <SelectItem value="liter">Liter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button onClick={calculateFuelCost} className="w-full" size="lg">
                  Calculate Fuel Cost
                </Button>

                {result && (
                  <div className="space-y-6">
                    <div className="bg-green-50 p-6 rounded-lg text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {currencySymbols[currencyUnit as keyof typeof currencySymbols]}{result.totalCost}
                      </div>
                      <div className="text-xl font-semibold text-green-600 mb-2">
                        Total Fuel Cost
                      </div>
                      <div className="text-gray-600">
                        {result.fuelNeeded} {priceUnit === 'liter' ? 'liters' : 'gallons'} needed
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {currencySymbols[currencyUnit as keyof typeof currencySymbols]}{result.scenarios.roundTrip.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Round Trip</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {currencySymbols[currencyUnit as keyof typeof currencySymbols]}{result.scenarios.weekly.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Weekly</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {currencySymbols[currencyUnit as keyof typeof currencySymbols]}{result.scenarios.monthly.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Monthly</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {currencySymbols[currencyUnit as keyof typeof currencySymbols]}{result.scenarios.yearly.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Yearly</div>
                      </div>
                    </div>

                    <Tabs defaultValue="efficiency" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
                        <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
                        <TabsTrigger value="environment">Environment</TabsTrigger>
                      </TabsList>

                      <TabsContent value="efficiency">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3">Fuel Efficiency Analysis</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-600">Your Vehicle Efficiency</div>
                              <div className={`text-2xl font-bold ${getFuelEfficiencyTips(result.efficiency.mpg).color}`}>
                                {result.efficiency.mpg} MPG
                              </div>
                              <div className={`text-sm ${getFuelEfficiencyTips(result.efficiency.mpg).color}`}>
                                {getFuelEfficiencyTips(result.efficiency.mpg).level}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Efficiency Tips</div>
                              <ul className="text-sm space-y-1">
                                {getFuelEfficiencyTips(result.efficiency.mpg).tips.map((tip, index) => (
                                  <li key={index} className="flex items-start gap-1">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="breakdown">
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3">Cost per Distance</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-gray-600">Cost per Mile</div>
                                <div className="text-xl font-bold">
                                  {currencySymbols[currencyUnit as keyof typeof currencySymbols]}{result.costPerMile}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">Cost per Kilometer</div>
                                <div className="text-xl font-bold">
                                  {currencySymbols[currencyUnit as keyof typeof currencySymbols]}{result.costPerKm}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="environment">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3">Environmental Impact</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-600">CO₂ Emissions</div>
                              <div className="text-2xl font-bold text-green-600">
                                {result.carbonFootprint} lbs
                              </div>
                              <div className="text-sm text-gray-500">For this trip</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Environmental Tips</div>
                              <ul className="text-sm space-y-1">
                                <li>🚗 Consider carpooling</li>
                                <li>🚌 Use public transport when possible</li>
                                <li>🚴 Bike for short distances</li>
                                <li>🏠 Work from home to reduce commuting</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Calculation History
                </CardTitle>
                <CardDescription>Recent fuel cost calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No calculations yet</p>
                  ) : (
                    history.slice().reverse().map((calc, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
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
                <CardTitle>Fuel Saving Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>⚡ Maintain steady speeds</div>
                  <div>🔧 Regular vehicle maintenance</div>
                  <div>🛞 Keep tires properly inflated</div>
                  <div>❄️ Remove excess weight</div>
                  <div>🌡️ Use A/C efficiently</div>
                  <div>🛣️ Plan efficient routes</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FuelCostCalculator;
