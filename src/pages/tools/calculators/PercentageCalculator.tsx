
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Percent, TrendingUp, TrendingDown, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PercentageCalculator = () => {
  // Basic percentage
  const [basicValue, setBasicValue] = useState(25);
  const [basicTotal, setBasicTotal] = useState(100);
  const [basicPercentage, setBasicPercentage] = useState(25);

  // Percentage increase/decrease
  const [originalValue, setOriginalValue] = useState(100);
  const [newValue, setNewValue] = useState(120);
  const [percentageChange, setPercentageChange] = useState(0);

  // Percentage of a number
  const [percentageInput, setPercentageInput] = useState(15);
  const [numberInput, setNumberInput] = useState(200);
  const [percentageOfNumber, setPercentageOfNumber] = useState(0);

  // What percentage
  const [partValue, setPartValue] = useState(30);
  const [wholeValue, setWholeValue] = useState(150);
  const [whatPercentage, setWhatPercentage] = useState(0);

  // Percentage difference
  const [value1, setValue1] = useState(80);
  const [value2, setValue2] = useState(100);
  const [percentageDifference, setPercentageDifference] = useState(0);

  const { toast } = useToast();

  const calculateBasicPercentage = () => {
    const result = (basicValue / basicTotal) * 100;
    setBasicPercentage(result);
    toast({
      title: "Calculation Complete",
      description: `${basicValue} is ${result.toFixed(2)}% of ${basicTotal}`
    });
  };

  const calculatePercentageChange = () => {
    const change = ((newValue - originalValue) / originalValue) * 100;
    setPercentageChange(change);
    const isIncrease = change > 0;
    toast({
      title: "Percentage Change Calculated",
      description: `${isIncrease ? 'Increase' : 'Decrease'} of ${Math.abs(change).toFixed(2)}%`
    });
  };

  const calculatePercentageOfNumber = () => {
    const result = (percentageInput / 100) * numberInput;
    setPercentageOfNumber(result);
    toast({
      title: "Calculation Complete",
      description: `${percentageInput}% of ${numberInput} is ${result.toFixed(2)}`
    });
  };

  const calculateWhatPercentage = () => {
    const result = (partValue / wholeValue) * 100;
    setWhatPercentage(result);
    toast({
      title: "Calculation Complete",
      description: `${partValue} is ${result.toFixed(2)}% of ${wholeValue}`
    });
  };

  const calculatePercentageDifference = () => {
    const average = (value1 + value2) / 2;
    const difference = Math.abs(value1 - value2);
    const result = (difference / average) * 100;
    setPercentageDifference(result);
    toast({
      title: "Percentage Difference Calculated",
      description: `Difference: ${result.toFixed(2)}%`
    });
  };

  const tipCalculations = [
    { tip: 10, amount: numberInput, result: (numberInput * 0.10).toFixed(2), total: (numberInput * 1.10).toFixed(2) },
    { tip: 15, amount: numberInput, result: (numberInput * 0.15).toFixed(2), total: (numberInput * 1.15).toFixed(2) },
    { tip: 18, amount: numberInput, result: (numberInput * 0.18).toFixed(2), total: (numberInput * 1.18).toFixed(2) },
    { tip: 20, amount: numberInput, result: (numberInput * 0.20).toFixed(2), total: (numberInput * 1.20).toFixed(2) },
    { tip: 25, amount: numberInput, result: (numberInput * 0.25).toFixed(2), total: (numberInput * 1.25).toFixed(2) }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Percentage Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Complete percentage calculations including basic percentages, increases/decreases, tips, discounts, and more.
          </p>
        </div>
        
        <Tabs defaultValue="basic" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic %</TabsTrigger>
            <TabsTrigger value="change">% Change</TabsTrigger>
            <TabsTrigger value="of-number">% of Number</TabsTrigger>
            <TabsTrigger value="what-percent">What %</TabsTrigger>
            <TabsTrigger value="difference">% Difference</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-6 w-6" />
                  Basic Percentage
                </CardTitle>
                <CardDescription>Calculate what percentage one number is of another</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div>
                    <Label>Value</Label>
                    <Input
                      type="number"
                      value={basicValue}
                      onChange={(e) => setBasicValue(parseFloat(e.target.value) || 0)}
                      placeholder="Enter value"
                    />
                  </div>
                  <div>
                    <Label>Total</Label>
                    <Input
                      type="number"
                      value={basicTotal}
                      onChange={(e) => setBasicTotal(parseFloat(e.target.value) || 1)}
                      placeholder="Enter total"
                    />
                  </div>
                  <Button onClick={calculateBasicPercentage}>Calculate</Button>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {basicPercentage.toFixed(2)}%
                  </div>
                  <div className="text-gray-600 mt-2">
                    {basicValue} is {basicPercentage.toFixed(2)}% of {basicTotal}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="change">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Percentage Increase/Decrease
                </CardTitle>
                <CardDescription>Calculate percentage change between two values</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div>
                    <Label>Original Value</Label>
                    <Input
                      type="number"
                      value={originalValue}
                      onChange={(e) => setOriginalValue(parseFloat(e.target.value) || 0)}
                      placeholder="Enter original value"
                    />
                  </div>
                  <div>
                    <Label>New Value</Label>
                    <Input
                      type="number"
                      value={newValue}
                      onChange={(e) => setNewValue(parseFloat(e.target.value) || 0)}
                      placeholder="Enter new value"
                    />
                  </div>
                  <Button onClick={calculatePercentageChange}>Calculate</Button>
                </div>
                
                <div className={`p-6 rounded-lg text-center ${
                  percentageChange > 0 ? 'bg-green-50' : percentageChange < 0 ? 'bg-red-50' : 'bg-gray-50'
                }`}>
                  <div className={`text-3xl font-bold ${
                    percentageChange > 0 ? 'text-green-600' : percentageChange < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(2)}%
                  </div>
                  <div className="text-gray-600 mt-2 flex items-center justify-center gap-2">
                    {percentageChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : percentageChange < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    ) : null}
                    {percentageChange > 0 ? 'Increase' : percentageChange < 0 ? 'Decrease' : 'No change'}
                    of {Math.abs(percentageChange).toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    From {originalValue} to {newValue}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="of-number">
            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-6 w-6" />
                    Percentage of a Number
                  </CardTitle>
                  <CardDescription>Calculate what a certain percentage of a number is</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                      <Label>Percentage (%)</Label>
                      <Input
                        type="number"
                        value={percentageInput}
                        onChange={(e) => setPercentageInput(parseFloat(e.target.value) || 0)}
                        placeholder="Enter percentage"
                      />
                    </div>
                    <div>
                      <Label>Number</Label>
                      <Input
                        type="number"
                        value={numberInput}
                        onChange={(e) => setNumberInput(parseFloat(e.target.value) || 0)}
                        placeholder="Enter number"
                      />
                    </div>
                    <Button onClick={calculatePercentageOfNumber}>Calculate</Button>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {percentageOfNumber.toFixed(2)}
                    </div>
                    <div className="text-gray-600 mt-2">
                      {percentageInput}% of {numberInput} is {percentageOfNumber.toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tip Calculator</CardTitle>
                  <CardDescription>Common tip percentages for ${numberInput.toFixed(2)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {tipCalculations.map((tip) => (
                      <div key={tip.tip} className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="font-semibold text-lg">{tip.tip}%</div>
                        <div className="text-sm text-gray-600">Tip: ${tip.result}</div>
                        <div className="text-sm font-medium">Total: ${tip.total}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="what-percent">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-6 w-6" />
                  What Percentage Is
                </CardTitle>
                <CardDescription>Find what percentage one number is of another</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div>
                    <Label>Part</Label>
                    <Input
                      type="number"
                      value={partValue}
                      onChange={(e) => setPartValue(parseFloat(e.target.value) || 0)}
                      placeholder="Enter part value"
                    />
                  </div>
                  <div>
                    <Label>Whole</Label>
                    <Input
                      type="number"
                      value={wholeValue}
                      onChange={(e) => setWholeValue(parseFloat(e.target.value) || 1)}
                      placeholder="Enter whole value"
                    />
                  </div>
                  <Button onClick={calculateWhatPercentage}>Calculate</Button>
                </div>
                
                <div className="bg-orange-50 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {whatPercentage.toFixed(2)}%
                  </div>
                  <div className="text-gray-600 mt-2">
                    {partValue} is {whatPercentage.toFixed(2)}% of {wholeValue}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="difference">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Percentage Difference
                </CardTitle>
                <CardDescription>Calculate the percentage difference between two values</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div>
                    <Label>First Value</Label>
                    <Input
                      type="number"
                      value={value1}
                      onChange={(e) => setValue1(parseFloat(e.target.value) || 0)}
                      placeholder="Enter first value"
                    />
                  </div>
                  <div>
                    <Label>Second Value</Label>
                    <Input
                      type="number"
                      value={value2}
                      onChange={(e) => setValue2(parseFloat(e.target.value) || 0)}
                      placeholder="Enter second value"
                    />
                  </div>
                  <Button onClick={calculatePercentageDifference}>Calculate</Button>
                </div>
                
                <div className="bg-indigo-50 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-indigo-600">
                    {percentageDifference.toFixed(2)}%
                  </div>
                  <div className="text-gray-600 mt-2">
                    Percentage difference between {value1} and {value2}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Absolute difference: {Math.abs(value1 - value2).toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PercentageCalculator;
