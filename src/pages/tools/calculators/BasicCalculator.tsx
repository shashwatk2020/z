
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Delete, History, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BasicCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      
      if ('0123456789'.includes(key)) {
        inputNumber(key);
      } else if ('+-*/'.includes(key)) {
        performOperation(key);
      } else if (key === 'Enter' || key === '=') {
        calculate();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clear();
      } else if (key === 'Backspace') {
        backspace();
      } else if (key === '.') {
        inputDecimal();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display, previousValue, operation, waitingForOperand]);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(display);
    } else if (operation) {
      const currentValue = previousValue || '0';
      const newValue = calculate(parseFloat(currentValue), inputValue, operation);
      
      setDisplay(String(newValue));
      setPreviousValue(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue?: number, secondValue?: number, operation?: string) => {
    const prev = firstValue ?? parseFloat(previousValue || '0');
    const current = secondValue ?? parseFloat(display);
    const op = operation || operation;

    let result = 0;
    const calculation = `${prev} ${op} ${current}`;

    switch (op) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        if (current === 0) {
          toast({
            title: "Error",
            description: "Cannot divide by zero",
            variant: "destructive"
          });
          return prev;
        }
        result = prev / current;
        break;
      default:
        return current;
    }

    if (firstValue === undefined) {
      setHistory(prev => [...prev.slice(-9), `${calculation} = ${result}`]);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }

    return result;
  };

  const percentage = () => {
    const value = parseFloat(display) / 100;
    setDisplay(String(value));
  };

  const sqrt = () => {
    const value = Math.sqrt(parseFloat(display));
    setDisplay(String(value));
    setHistory(prev => [...prev.slice(-9), `√${display} = ${value}`]);
  };

  const square = () => {
    const value = Math.pow(parseFloat(display), 2);
    setDisplay(String(value));
    setHistory(prev => [...prev.slice(-9), `${display}² = ${value}`]);
  };

  const inverse = () => {
    const value = 1 / parseFloat(display);
    setDisplay(String(value));
    setHistory(prev => [...prev.slice(-9), `1/${display} = ${value}`]);
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
    toast({
      title: "Memory",
      description: `Added ${display} to memory`
    });
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
    toast({
      title: "Memory",
      description: `Subtracted ${display} from memory`
    });
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
  };

  const memoryClear = () => {
    setMemory(0);
    toast({
      title: "Memory",
      description: "Memory cleared"
    });
  };

  const buttons = [
    ['MC', 'MR', 'M+', 'M-'],
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '√', '=']
  ];

  const handleButtonClick = (btn: string) => {
    switch (btn) {
      case 'C':
        clear();
        break;
      case '±':
        setDisplay(String(-parseFloat(display)));
        break;
      case '%':
        percentage();
        break;
      case '÷':
        performOperation('/');
        break;
      case '×':
        performOperation('*');
        break;
      case '-':
        performOperation('-');
        break;
      case '+':
        performOperation('+');
        break;
      case '=':
        calculate();
        break;
      case '.':
        inputDecimal();
        break;
      case '√':
        sqrt();
        break;
      case 'MC':
        memoryClear();
        break;
      case 'MR':
        memoryRecall();
        break;
      case 'M+':
        memoryAdd();
        break;
      case 'M-':
        memorySubtract();
        break;
      default:
        if ('0123456789'.includes(btn)) {
          inputNumber(btn);
        }
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Basic Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Professional calculator with memory functions, history tracking, and keyboard support for all your calculation needs.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  Calculator
                </CardTitle>
                <CardDescription>Full-featured calculator with memory and advanced functions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-white p-6 rounded-lg mb-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-2">
                      {previousValue && operation ? `${previousValue} ${operation}` : ''}
                    </div>
                    <div className="text-3xl font-mono break-all">
                      {display}
                    </div>
                    {memory !== 0 && (
                      <div className="text-sm text-blue-400 mt-2">
                        Memory: {memory}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {buttons.flat().map((btn, index) => (
                    <Button
                      key={index}
                      onClick={() => handleButtonClick(btn)}
                      variant={
                        ['=', '+', '-', '×', '÷'].includes(btn) ? 'default' :
                        ['C', '±', '%', '√'].includes(btn) ? 'secondary' :
                        ['MC', 'MR', 'M+', 'M-'].includes(btn) ? 'outline' : 'ghost'
                      }
                      className={`h-12 text-lg font-semibold ${
                        btn === '0' ? 'col-span-1' : ''
                      } ${
                        ['='].includes(btn) ? 'bg-blue-600 hover:bg-blue-700' : ''
                      }`}
                    >
                      {btn}
                    </Button>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <Button onClick={square} variant="outline" className="h-10">
                    x²
                  </Button>
                  <Button onClick={inverse} variant="outline" className="h-10">
                    1/x
                  </Button>
                  <Button onClick={backspace} variant="outline" className="h-10">
                    <Delete className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>Keyboard shortcuts:</strong> Numbers (0-9), operators (+, -, *, /), Enter (=), Escape (C), Backspace (delete)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  History
                </CardTitle>
                <CardDescription>Recent calculations</CardDescription>
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

export default BasicCalculator;
