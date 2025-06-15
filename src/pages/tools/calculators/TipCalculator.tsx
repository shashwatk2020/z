
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Users, Calculator, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TipCalculator = () => {
  // Basic tip calculation
  const [billAmount, setBillAmount] = useState(100);
  const [tipPercentage, setTipPercentage] = useState(18);
  const [customTip, setCustomTip] = useState(0);
  const [tipType, setTipType] = useState('percentage');

  // Bill splitting
  const [numberOfPeople, setNumberOfPeople] = useState(4);
  const [splitType, setSplitType] = useState('equal');

  // Service quality presets
  const servicePresets = {
    poor: 10,
    average: 15,
    good: 18,
    excellent: 20,
    exceptional: 25
  };

  // Results
  const [tipAmount, setTipAmount] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [perPersonAmount, setPerPersonAmount] = useState<number | null>(null);
  const [perPersonTip, setPerPersonTip] = useState<number | null>(null);

  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const calculateTip = () => {
    const tip = tipType === 'percentage' 
      ? (billAmount * tipPercentage) / 100
      : customTip;
    
    const total = billAmount + tip;
    const perPerson = total / numberOfPeople;
    const tipPerPerson = tip / numberOfPeople;

    setTipAmount(tip);
    setTotalAmount(total);
    setPerPersonAmount(perPerson);
    setPerPersonTip(tipPerPerson);

    const tipText = tipType === 'percentage' ? `${tipPercentage}%` : `$${customTip}`;
    addToHistory(`Bill: $${billAmount} + Tip: ${tipText} = $${total.toFixed(2)} (${numberOfPeople} people: $${perPerson.toFixed(2)}/person)`);
    
    toast({
      title: "Tip Calculated",
      description: `Total: $${total.toFixed(2)} (Tip: $${tip.toFixed(2)})`
    });
  };

  const setPresetTip = (service: keyof typeof servicePresets) => {
    setTipPercentage(servicePresets[service]);
    setTipType('percentage');
  };

  const quickCalculate = (percentage: number) => {
    setTipPercentage(percentage);
    setTipType('percentage');
    setTimeout(calculateTip, 100);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tip Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate tips easily, split bills among friends, and get suggestions based on service quality.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Calculator</TabsTrigger>
                <TabsTrigger value="split">Bill Splitting</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-6 w-6" />
                      Tip Calculator
                    </CardTitle>
                    <CardDescription>Calculate tips and total bill amount</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Bill Amount ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={billAmount}
                        onChange={(e) => setBillAmount(parseFloat(e.target.value) || 0)}
                        placeholder="Enter bill amount"
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Service Quality Presets</Label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {Object.entries(servicePresets).map(([service, percentage]) => (
                          <Button
                            key={service}
                            variant="outline"
                            onClick={() => setPresetTip(service as keyof typeof servicePresets)}
                            className="flex flex-col py-4 h-auto"
                          >
                            <span className="capitalize font-semibold">{service}</span>
                            <span className="text-sm text-gray-600">{percentage}%</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Tip Method</Label>
                      <Select value={tipType} onValueChange={setTipType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="custom">Custom Amount</SelectItem>
                        </SelectContent>
                      </Select>

                      {tipType === 'percentage' ? (
                        <div>
                          <Label>Tip Percentage (%)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={tipPercentage}
                            onChange={(e) => setTipPercentage(parseFloat(e.target.value) || 0)}
                            placeholder="Enter tip percentage"
                          />
                        </div>
                      ) : (
                        <div>
                          <Label>Custom Tip Amount ($)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={customTip}
                            onChange={(e) => setCustomTip(parseFloat(e.target.value) || 0)}
                            placeholder="Enter custom tip amount"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label>Quick Tip Calculations</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {[15, 18, 20, 25].map(percentage => (
                          <Button
                            key={percentage}
                            variant="secondary"
                            onClick={() => quickCalculate(percentage)}
                            className="flex flex-col py-3 h-auto"
                          >
                            <span className="font-semibold">{percentage}%</span>
                            <span className="text-xs">${((billAmount * percentage) / 100).toFixed(2)}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button onClick={calculateTip} className="w-full" size="lg">
                      Calculate Tip
                    </Button>

                    {tipAmount !== null && (
                      <div className="bg-green-50 p-6 rounded-lg">
                        <div className="grid md:grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              ${tipAmount.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Tip Amount</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              ${totalAmount?.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Total Bill</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              {tipType === 'percentage' ? `${tipPercentage}%` : 'Custom'}
                            </div>
                            <div className="text-sm text-gray-600">Tip Rate</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="split">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-6 w-6" />
                      Bill Splitting Calculator
                    </CardTitle>
                    <CardDescription>Split the bill and tip among multiple people</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Bill Amount ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={billAmount}
                          onChange={(e) => setBillAmount(parseFloat(e.target.value) || 0)}
                          placeholder="Enter bill amount"
                        />
                      </div>
                      <div>
                        <Label>Number of People</Label>
                        <Input
                          type="number"
                          min="1"
                          value={numberOfPeople}
                          onChange={(e) => setNumberOfPeople(parseFloat(e.target.value) || 1)}
                          placeholder="Number of people"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Tip Percentage (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={tipPercentage}
                          onChange={(e) => setTipPercentage(parseFloat(e.target.value) || 0)}
                          placeholder="Enter tip percentage"
                        />
                      </div>
                      <div>
                        <Label>Split Method</Label>
                        <Select value={splitType} onValueChange={setSplitType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equal">Equal Split</SelectItem>
                            <SelectItem value="custom">Custom Split</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={calculateTip} className="w-full" size="lg">
                      Calculate Split Bill
                    </Button>

                    {perPersonAmount !== null && (
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                              ${perPersonAmount.toFixed(2)}
                            </div>
                            <div className="text-gray-600">Per Person Total</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                              ${perPersonTip?.toFixed(2)}
                            </div>
                            <div className="text-gray-600">Per Person Tip</div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <div className="text-center text-sm text-gray-600">
                            <div>Total Bill: ${billAmount.toFixed(2)} + Tip: ${tipAmount?.toFixed(2)} = ${totalAmount?.toFixed(2)}</div>
                            <div>Split {numberOfPeople} ways</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Tip Guidelines:</h4>
                      <div className="text-sm space-y-1">
                        <div>• Restaurant: 15-20% (18% is standard)</div>
                        <div>• Bar/Cocktails: $1-2 per drink or 15-20%</div>
                        <div>• Delivery: 15-20% (minimum $2-3)</div>
                        <div>• Taxi/Rideshare: 15-20%</div>
                        <div>• Hair salon: 15-20%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Calculation History
                </CardTitle>
                <CardDescription>Recent tip calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No calculations yet</p>
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
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Quick Reference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Poor Service:</span>
                    <span className="font-semibold">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Service:</span>
                    <span className="font-semibold">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Good Service:</span>
                    <span className="font-semibold">18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Excellent Service:</span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Exceptional:</span>
                    <span className="font-semibold">25%+</span>
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

export default TipCalculator;
