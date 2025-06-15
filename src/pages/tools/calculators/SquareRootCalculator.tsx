
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, History, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SquareRootCalculator = () => {
  const [number, setNumber] = useState(25);
  const [squareRoot, setSquareRoot] = useState(5);
  const [cubeNumber, setCubeNumber] = useState(27);
  const [cubeRoot, setCubeRoot] = useState(3);
  const [nthNumber, setNthNumber] = useState(32);
  const [nthRoot, setNthRoot] = useState(2);
  const [nthRootResult, setNthRootResult] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const calculateSquareRoot = () => {
    if (number < 0) {
      toast({
        title: "Error",
        description: "Cannot calculate square root of negative numbers",
        variant: "destructive"
      });
      return;
    }
    
    const result = Math.sqrt(number);
    setSquareRoot(result);
    addToHistory(`√${number} = ${result.toFixed(6)}`);
    
    toast({
      title: "Square Root Calculated",
      description: `√${number} = ${result.toFixed(6)}`
    });
  };

  const calculateCubeRoot = () => {
    const result = Math.cbrt(cubeNumber);
    setCubeRoot(result);
    addToHistory(`∛${cubeNumber} = ${result.toFixed(6)}`);
    
    toast({
      title: "Cube Root Calculated",
      description: `∛${cubeNumber} = ${result.toFixed(6)}`
    });
  };

  const calculateNthRoot = () => {
    if (nthRoot === 0) {
      toast({
        title: "Error",
        description: "Root cannot be zero",
        variant: "destructive"
      });
      return;
    }
    
    if (nthNumber < 0 && nthRoot % 2 === 0) {
      toast({
        title: "Error",
        description: "Cannot calculate even root of negative numbers",
        variant: "destructive"
      });
      return;
    }
    
    const result = Math.pow(Math.abs(nthNumber), 1 / nthRoot) * (nthNumber < 0 ? -1 : 1);
    setNthRootResult(result);
    addToHistory(`${nthRoot}√${nthNumber} = ${result.toFixed(6)}`);
    
    toast({
      title: "Nth Root Calculated",
      description: `${nthRoot}√${nthNumber} = ${result.toFixed(6)}`
    });
  };

  const perfectSquares = [
    { number: 1, root: 1 },
    { number: 4, root: 2 },
    { number: 9, root: 3 },
    { number: 16, root: 4 },
    { number: 25, root: 5 },
    { number: 36, root: 6 },
    { number: 49, root: 7 },
    { number: 64, root: 8 },
    { number: 81, root: 9 },
    { number: 100, root: 10 },
    { number: 121, root: 11 },
    { number: 144, root: 12 },
    { number: 169, root: 13 },
    { number: 196, root: 14 },
    { number: 225, root: 15 },
    { number: 256, root: 16 }
  ];

  const perfectCubes = [
    { number: 1, root: 1 },
    { number: 8, root: 2 },
    { number: 27, root: 3 },
    { number: 64, root: 4 },
    { number: 125, root: 5 },
    { number: 216, root: 6 },
    { number: 343, root: 7 },
    { number: 512, root: 8 },
    { number: 729, root: 9 },
    { number: 1000, root: 10 }
  ];

  const estimateSquareRoot = (num: number): { estimate: number, steps: string[] } => {
    if (num < 0) return { estimate: NaN, steps: [] };
    if (num === 0) return { estimate: 0, steps: ['√0 = 0'] };
    if (num === 1) return { estimate: 1, steps: ['√1 = 1'] };
    
    const steps: string[] = [];
    let x = num / 2; // Initial guess
    steps.push(`Initial guess: x₀ = ${num}/2 = ${x}`);
    
    for (let i = 1; i <= 5; i++) {
      const newX = 0.5 * (x + num / x);
      steps.push(`x${i} = ½(${x.toFixed(4)} + ${num}/${x.toFixed(4)}) = ½(${x.toFixed(4)} + ${(num/x).toFixed(4)}) = ${newX.toFixed(4)}`);
      
      if (Math.abs(newX - x) < 0.000001) break;
      x = newX;
    }
    
    return { estimate: x, steps };
  };

  const babylonianMethod = estimateSquareRoot(number);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Square Root Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate square roots, cube roots, nth roots with step-by-step solutions and reference tables.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="square" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="square">Square Root</TabsTrigger>
                <TabsTrigger value="cube">Cube Root</TabsTrigger>
                <TabsTrigger value="nth">Nth Root</TabsTrigger>
              </TabsList>

              <TabsContent value="square">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Square className="h-6 w-6" />
                      Square Root Calculator
                    </CardTitle>
                    <CardDescription>Calculate square roots with detailed steps</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                      <div>
                        <Label>Number</Label>
                        <Input
                          type="number"
                          value={number}
                          onChange={(e) => setNumber(parseFloat(e.target.value) || 0)}
                          placeholder="Enter number"
                        />
                      </div>
                      <Button onClick={calculateSquareRoot}>Calculate √</Button>
                    </div>
                    
                    <div className="bg-blue-50 p-6 rounded-lg text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        √{number} = {squareRoot.toFixed(6)}
                      </div>
                      <div className="text-gray-600">
                        Verification: {squareRoot.toFixed(6)} × {squareRoot.toFixed(6)} = {(squareRoot * squareRoot).toFixed(6)}
                      </div>
                    </div>

                    {number > 0 && babylonianMethod.steps.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-semibold mb-4">Babylonian Method (Step-by-step)</h3>
                        <div className="space-y-2 text-sm font-mono">
                          {babylonianMethod.steps.map((step, index) => (
                            <div key={index} className="text-gray-700">{step}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cube">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-6 w-6" />
                      Cube Root Calculator
                    </CardTitle>
                    <CardDescription>Calculate cube roots of any number</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                      <div>
                        <Label>Number</Label>
                        <Input
                          type="number"
                          value={cubeNumber}
                          onChange={(e) => setCubeNumber(parseFloat(e.target.value) || 0)}
                          placeholder="Enter number"
                        />
                      </div>
                      <Button onClick={calculateCubeRoot}>Calculate ∛</Button>
                    </div>
                    
                    <div className="bg-green-50 p-6 rounded-lg text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        ∛{cubeNumber} = {cubeRoot.toFixed(6)}
                      </div>
                      <div className="text-gray-600">
                        Verification: {cubeRoot.toFixed(6)}³ = {(cubeRoot * cubeRoot * cubeRoot).toFixed(6)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="nth">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-6 w-6" />
                      Nth Root Calculator
                    </CardTitle>
                    <CardDescription>Calculate any root of a number</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                      <div>
                        <Label>Root (n)</Label>
                        <Input
                          type="number"
                          value={nthRoot}
                          onChange={(e) => setNthRoot(parseFloat(e.target.value) || 2)}
                          placeholder="Enter root"
                        />
                      </div>
                      <div>
                        <Label>Number</Label>
                        <Input
                          type="number"
                          value={nthNumber}
                          onChange={(e) => setNthNumber(parseFloat(e.target.value) || 0)}
                          placeholder="Enter number"
                        />
                      </div>
                      <Button onClick={calculateNthRoot}>Calculate</Button>
                    </div>
                    
                    <div className="bg-purple-50 p-6 rounded-lg text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        <sup>{nthRoot}</sup>√{nthNumber} = {nthRootResult.toFixed(6)}
                      </div>
                      <div className="text-gray-600">
                        Verification: {nthRootResult.toFixed(6)}<sup>{nthRoot}</sup> = {Math.pow(nthRootResult, nthRoot).toFixed(6)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Perfect Squares Reference</CardTitle>
                  <CardDescription>Common perfect squares and their roots</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {perfectSquares.map((square) => (
                      <div key={square.number} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>√{square.number}</span>
                        <span className="font-semibold">{square.root}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Perfect Cubes Reference</CardTitle>
                  <CardDescription>Common perfect cubes and their roots</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {perfectCubes.map((cube) => (
                      <div key={cube.number} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>∛{cube.number}</span>
                        <span className="font-semibold">{cube.root}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Calculation History
                </CardTitle>
                <CardDescription>Recent root calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No calculations yet</p>
                  ) : (
                    history.slice().reverse().map((calc, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded font-mono text-sm">
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

export default SquareRootCalculator;
