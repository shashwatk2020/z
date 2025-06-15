
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calculator, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ScientificCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isRadians, setIsRadians] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState(0);
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-19), calculation]);
  };

  const evaluateExpression = (expr: string) => {
    try {
      // Replace display symbols with JavaScript operators
      let jsExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/\^/g, '**');

      // Handle angle conversions for trig functions
      if (!isRadians) {
        jsExpr = jsExpr
          .replace(/Math\.sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)')
          .replace(/Math\.cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)')
          .replace(/Math\.tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)');
      }

      const result = eval(jsExpr);
      
      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid calculation');
      }

      return result;
    } catch (error) {
      throw new Error('Invalid expression');
    }
  };

  const calculate = () => {
    try {
      const result = evaluateExpression(expression || display);
      const calculation = `${expression || display} = ${result}`;
      
      addToHistory(calculation);
      setDisplay(String(result));
      setExpression('');
      
      toast({
        title: "Calculation Complete",
        description: `Result: ${result}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid expression",
        variant: "destructive"
      });
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  const appendToExpression = (value: string) => {
    if (expression === '' && display !== '0') {
      setExpression(display + value);
    } else {
      setExpression(expression + value);
    }
    setDisplay(value);
  };

  const appendNumber = (num: string) => {
    if (expression === '' && display === '0') {
      setDisplay(num);
    } else if (expression !== '') {
      setExpression(expression + num);
      setDisplay(num);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const appendFunction = (func: string) => {
    setExpression((expression || display) + func + '(');
    setDisplay(func + '(');
  };

  const scientificFunctions = [
    { label: 'sin', func: 'sin' },
    { label: 'cos', func: 'cos' },
    { label: 'tan', func: 'tan' },
    { label: 'log', func: 'log' },
    { label: 'ln', func: 'ln' },
    { label: '√', func: '√' },
    { label: 'x²', func: '^2' },
    { label: 'x³', func: '^3' },
    { label: 'xʸ', func: '^' },
    { label: '10ˣ', func: '10^' },
    { label: 'eˣ', func: 'e^' },
    { label: '1/x', func: '1/' },
    { label: 'x!', func: '!' },
    { label: 'π', func: 'π' },
    { label: 'e', func: 'e' },
    { label: '|x|', func: 'abs(' }
  ];

  const basicButtons = [
    ['C', '(', ')', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '±', '=']
  ];

  const handleScientificFunction = (func: string) => {
    switch (func) {
      case 'sin':
      case 'cos':
      case 'tan':
      case 'log':
      case 'ln':
      case '√':
      case 'abs(':
        appendFunction(func);
        break;
      case 'x²':
        appendToExpression('^2');
        break;
      case 'x³':
        appendToExpression('^3');
        break;
      case 'xʸ':
      case '^':
        appendToExpression('^');
        break;
      case '10^':
        setExpression((expression || display) + '10^');
        setDisplay('10^');
        break;
      case 'e^':
        setExpression((expression || display) + 'e^');
        setDisplay('e^');
        break;
      case '1/x':
        setExpression('1/(' + (expression || display) + ')');
        calculate();
        break;
      case 'x!':
        const num = parseFloat(display);
        if (num >= 0 && num <= 170 && Number.isInteger(num)) {
          let factorial = 1;
          for (let i = 2; i <= num; i++) {
            factorial *= i;
          }
          setDisplay(String(factorial));
          addToHistory(`${num}! = ${factorial}`);
        } else {
          toast({
            title: "Error",
            description: "Factorial only works for non-negative integers ≤ 170",
            variant: "destructive"
          });
        }
        break;
      case 'π':
        appendToExpression('π');
        break;
      case 'e':
        appendToExpression('e');
        break;
    }
  };

  const handleBasicButton = (btn: string) => {
    switch (btn) {
      case 'C':
        clear();
        break;
      case '=':
        calculate();
        break;
      case '±':
        if (display.startsWith('-')) {
          setDisplay(display.slice(1));
        } else {
          setDisplay('-' + display);
        }
        break;
      case '.':
        if (!display.includes('.')) {
          setDisplay(display + '.');
        }
        break;
      case '+':
      case '-':
      case '×':
      case '÷':
      case '(':
      case ')':
        appendToExpression(btn);
        break;
      default:
        if ('0123456789'.includes(btn)) {
          appendNumber(btn);
        }
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Scientific Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Advanced scientific calculator with trigonometric functions, logarithms, and statistical operations.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  Scientific Calculator
                </CardTitle>
                <CardDescription>Professional scientific calculations with advanced functions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="angle-mode"
                      checked={isRadians}
                      onCheckedChange={setIsRadians}
                    />
                    <Label htmlFor="angle-mode">
                      {isRadians ? 'Radians' : 'Degrees'}
                    </Label>
                  </div>
                  {memory !== 0 && (
                    <div className="text-sm text-blue-600">
                      Memory: {memory}
                    </div>
                  )}
                </div>

                <div className="bg-gray-900 text-white p-6 rounded-lg mb-6">
                  <div className="text-right">
                    {expression && (
                      <div className="text-sm text-gray-400 mb-2 break-all">
                        {expression}
                      </div>
                    )}
                    <div className="text-3xl font-mono break-all">
                      {display}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    {scientificFunctions.map((func, index) => (
                      <Button
                        key={index}
                        onClick={() => handleScientificFunction(func.func)}
                        variant="outline"
                        className="h-10 text-sm"
                      >
                        {func.label}
                      </Button>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {basicButtons.flat().map((btn, index) => (
                      <Button
                        key={index}
                        onClick={() => handleBasicButton(btn)}
                        variant={
                          ['=', '+', '-', '×', '÷'].includes(btn) ? 'default' :
                          ['C', '±'].includes(btn) ? 'secondary' : 'ghost'
                        }
                        className={`h-12 text-lg font-semibold ${
                          btn === '=' ? 'bg-blue-600 hover:bg-blue-700' : ''
                        }`}
                      >
                        {btn}
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
                <CardDescription>Recent scientific calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No calculations yet</p>
                  ) : (
                    history.slice().reverse().map((calc, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded font-mono text-sm break-all">
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

export default ScientificCalculator;
