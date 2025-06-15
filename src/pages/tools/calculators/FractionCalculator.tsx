import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Fraction {
  numerator: number;
  denominator: number;
}

const FractionCalculator = () => {
  const [fraction1, setFraction1] = useState<Fraction>({ numerator: 1, denominator: 2 });
  const [fraction2, setFraction2] = useState<Fraction>({ numerator: 1, denominator: 3 });
  const [operation, setOperation] = useState('+');
  const [result, setResult] = useState<Fraction | null>(null);
  const [decimalResult, setDecimalResult] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const gcd = (a: number, b: number): number => {
    return b === 0 ? Math.abs(a) : gcd(b, a % b);
  };

  const lcm = (a: number, b: number): number => {
    return Math.abs(a * b) / gcd(a, b);
  };

  const simplifyFraction = (fraction: Fraction): Fraction => {
    if (fraction.denominator === 0) {
      throw new Error('Division by zero');
    }
    
    const divisor = gcd(fraction.numerator, fraction.denominator);
    let num = fraction.numerator / divisor;
    let den = fraction.denominator / divisor;
    
    // Keep denominator positive
    if (den < 0) {
      num = -num;
      den = -den;
    }
    
    return { numerator: num, denominator: den };
  };

  const addFractions = (f1: Fraction, f2: Fraction): Fraction => {
    const commonDenom = lcm(f1.denominator, f2.denominator);
    const num1 = f1.numerator * (commonDenom / f1.denominator);
    const num2 = f2.numerator * (commonDenom / f2.denominator);
    
    return simplifyFraction({
      numerator: num1 + num2,
      denominator: commonDenom
    });
  };

  const subtractFractions = (f1: Fraction, f2: Fraction): Fraction => {
    const commonDenom = lcm(f1.denominator, f2.denominator);
    const num1 = f1.numerator * (commonDenom / f1.denominator);
    const num2 = f2.numerator * (commonDenom / f2.denominator);
    
    return simplifyFraction({
      numerator: num1 - num2,
      denominator: commonDenom
    });
  };

  const multiplyFractions = (f1: Fraction, f2: Fraction): Fraction => {
    return simplifyFraction({
      numerator: f1.numerator * f2.numerator,
      denominator: f1.denominator * f2.denominator
    });
  };

  const divideFractions = (f1: Fraction, f2: Fraction): Fraction => {
    if (f2.numerator === 0) {
      throw new Error('Division by zero');
    }
    
    return simplifyFraction({
      numerator: f1.numerator * f2.denominator,
      denominator: f1.denominator * f2.numerator
    });
  };

  const calculate = () => {
    try {
      let calculationResult: Fraction;
      
      switch (operation) {
        case '+':
          calculationResult = addFractions(fraction1, fraction2);
          break;
        case '-':
          calculationResult = subtractFractions(fraction1, fraction2);
          break;
        case '×':
          calculationResult = multiplyFractions(fraction1, fraction2);
          break;
        case '÷':
          calculationResult = divideFractions(fraction1, fraction2);
          break;
        default:
          throw new Error('Invalid operation');
      }
      
      setResult(calculationResult);
      setDecimalResult(calculationResult.numerator / calculationResult.denominator);
      
      const f1Str = formatFraction(fraction1);
      const f2Str = formatFraction(fraction2);
      const resultStr = formatFraction(calculationResult);
      const calculation = `${f1Str} ${operation} ${f2Str} = ${resultStr}`;
      
      setHistory(prev => [...prev.slice(-9), calculation]);
      
      toast({
        title: "Calculation Complete",
        description: `Result: ${resultStr}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Calculation error",
        variant: "destructive"
      });
    }
  };

  const formatFraction = (fraction: Fraction): string => {
    if (fraction.denominator === 1) {
      return fraction.numerator.toString();
    }
    
    const wholePart = Math.floor(Math.abs(fraction.numerator) / fraction.denominator);
    const remainderNum = Math.abs(fraction.numerator) % fraction.denominator;
    const isNegative = fraction.numerator < 0;
    
    if (wholePart > 0 && remainderNum > 0) {
      return `${isNegative ? '-' : ''}${wholePart} ${remainderNum}/${fraction.denominator}`;
    } else if (remainderNum === 0) {
      return `${isNegative ? '-' : ''}${wholePart}`;
    } else {
      return `${fraction.numerator}/${fraction.denominator}`;
    }
  };

  const fractionToDecimal = (fraction: Fraction): number => {
    return fraction.numerator / fraction.denominator;
  };

  const parseDecimalToFraction = (decimal: number): Fraction => {
    const tolerance = 1.0e-6;
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = decimal;
    
    do {
      const a = Math.floor(b);
      let aux = h1;
      h1 = a * h1 + h2;
      h2 = aux;
      aux = k1;
      k1 = a * k1 + k2;
      k2 = aux;
      b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);
    
    return simplifyFraction({ numerator: h1, denominator: k1 });
  };

  const quickFractions = [
    { label: '1/2', frac: { numerator: 1, denominator: 2 } },
    { label: '1/3', frac: { numerator: 1, denominator: 3 } },
    { label: '1/4', frac: { numerator: 1, denominator: 4 } },
    { label: '2/3', frac: { numerator: 2, denominator: 3 } },
    { label: '3/4', frac: { numerator: 3, denominator: 4 } },
    { label: '1/8', frac: { numerator: 1, denominator: 8 } }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fraction Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Perform calculations with fractions, mixed numbers, and decimals. Automatic simplification and step-by-step solutions.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  Fraction Calculator
                </CardTitle>
                <CardDescription>Calculate with fractions and mixed numbers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="space-y-4">
                    <Label>First Fraction</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm">Numerator</Label>
                        <Input
                          type="number"
                          value={fraction1.numerator}
                          onChange={(e) => setFraction1(prev => ({ ...prev, numerator: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Denominator</Label>
                        <Input
                          type="number"
                          value={fraction1.denominator}
                          onChange={(e) => setFraction1(prev => ({ ...prev, denominator: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                    </div>
                    <div className="text-center text-2xl font-bold border p-4 rounded">
                      {formatFraction(fraction1)}
                    </div>
                    <div className="text-center text-sm text-gray-600">
                      = {fractionToDecimal(fraction1).toFixed(6)}
                    </div>
                  </div>

                  <div className="text-center">
                    <Label>Operation</Label>
                    <Select value={operation} onValueChange={setOperation}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+">Addition (+)</SelectItem>
                        <SelectItem value="-">Subtraction (−)</SelectItem>
                        <SelectItem value="×">Multiplication (×)</SelectItem>
                        <SelectItem value="÷">Division (÷)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Second Fraction</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm">Numerator</Label>
                        <Input
                          type="number"
                          value={fraction2.numerator}
                          onChange={(e) => setFraction2(prev => ({ ...prev, numerator: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Denominator</Label>
                        <Input
                          type="number"
                          value={fraction2.denominator}
                          onChange={(e) => setFraction2(prev => ({ ...prev, denominator: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                    </div>
                    <div className="text-center text-2xl font-bold border p-4 rounded">
                      {formatFraction(fraction2)}
                    </div>
                    <div className="text-center text-sm text-gray-600">
                      = {fractionToDecimal(fraction2).toFixed(6)}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button onClick={calculate} className="px-8 py-3 text-lg">
                    Calculate
                  </Button>
                </div>

                {result && (
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Result</h3>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {formatFraction(result)}
                      </div>
                      <div className="text-lg text-gray-600">
                        = {decimalResult?.toFixed(6)}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        ({result.numerator}/{result.denominator})
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-lg font-semibold mb-4 block">Quick Fractions</Label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {quickFractions.map((qf) => (
                      <Button
                        key={qf.label}
                        variant="outline"
                        size="sm"
                        onClick={() => setFraction1(qf.frac)}
                        className="h-12"
                      >
                        {qf.label}
                      </Button>
                    ))}
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
                  Calculation History
                </CardTitle>
                <CardDescription>Recent fraction calculations</CardDescription>
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FractionCalculator;
