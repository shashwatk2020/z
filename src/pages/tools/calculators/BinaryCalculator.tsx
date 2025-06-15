
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, History, Binary } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BinaryCalculator = () => {
  const [decimal, setDecimal] = useState(42);
  const [binary, setBinary] = useState('101010');
  const [octal, setOctal] = useState('52');
  const [hexadecimal, setHexadecimal] = useState('2A');
  
  const [operand1, setOperand1] = useState('1010');
  const [operand2, setOperand2] = useState('1100');
  const [operation, setOperation] = useState('add');
  const [operationBase, setOperationBase] = useState('binary');
  const [operationResult, setOperationResult] = useState('');
  
  const [bitNumber, setBitNumber] = useState(255);
  const [bitPosition, setBitPosition] = useState(3);
  const [bitOperationResult, setBitOperationResult] = useState<number | null>(null);
  
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const isValidBinary = (str: string): boolean => {
    return /^[01]+$/.test(str);
  };

  const isValidOctal = (str: string): boolean => {
    return /^[0-7]+$/.test(str);
  };

  const isValidHex = (str: string): boolean => {
    return /^[0-9A-Fa-f]+$/.test(str);
  };

  const convertFromDecimal = () => {
    const bin = decimal.toString(2);
    const oct = decimal.toString(8);
    const hex = decimal.toString(16).toUpperCase();
    
    setBinary(bin);
    setOctal(oct);
    setHexadecimal(hex);
    
    addToHistory(`Dec ${decimal} → Bin ${bin}, Oct ${oct}, Hex ${hex}`);
    
    toast({
      title: "Conversion Complete",
      description: `Decimal ${decimal} converted to all bases`
    });
  };

  const convertFromBinary = () => {
    if (!isValidBinary(binary)) {
      toast({
        title: "Invalid Binary",
        description: "Binary numbers can only contain 0 and 1",
        variant: "destructive"
      });
      return;
    }
    
    const dec = parseInt(binary, 2);
    const oct = dec.toString(8);
    const hex = dec.toString(16).toUpperCase();
    
    setDecimal(dec);
    setOctal(oct);
    setHexadecimal(hex);
    
    addToHistory(`Bin ${binary} → Dec ${dec}, Oct ${oct}, Hex ${hex}`);
    
    toast({
      title: "Conversion Complete",
      description: `Binary ${binary} converted to all bases`
    });
  };

  const convertFromOctal = () => {
    if (!isValidOctal(octal)) {
      toast({
        title: "Invalid Octal",
        description: "Octal numbers can only contain digits 0-7",
        variant: "destructive"
      });
      return;
    }
    
    const dec = parseInt(octal, 8);
    const bin = dec.toString(2);
    const hex = dec.toString(16).toUpperCase();
    
    setDecimal(dec);
    setBinary(bin);
    setHexadecimal(hex);
    
    addToHistory(`Oct ${octal} → Dec ${dec}, Bin ${bin}, Hex ${hex}`);
    
    toast({
      title: "Conversion Complete",
      description: `Octal ${octal} converted to all bases`
    });
  };

  const convertFromHex = () => {
    if (!isValidHex(hexadecimal)) {
      toast({
        title: "Invalid Hexadecimal",
        description: "Hex numbers can only contain 0-9 and A-F",
        variant: "destructive"
      });
      return;
    }
    
    const dec = parseInt(hexadecimal, 16);
    const bin = dec.toString(2);
    const oct = dec.toString(8);
    
    setDecimal(dec);
    setBinary(bin);
    setOctal(oct);
    
    addToHistory(`Hex ${hexadecimal} → Dec ${dec}, Bin ${bin}, Oct ${oct}`);
    
    toast({
      title: "Conversion Complete",
      description: `Hexadecimal ${hexadecimal} converted to all bases`
    });
  };

  const performBinaryOperation = () => {
    try {
      let val1: number, val2: number;
      
      switch (operationBase) {
        case 'binary':
          if (!isValidBinary(operand1) || !isValidBinary(operand2)) {
            throw new Error('Invalid binary numbers');
          }
          val1 = parseInt(operand1, 2);
          val2 = parseInt(operand2, 2);
          break;
        case 'decimal':
          val1 = parseInt(operand1);
          val2 = parseInt(operand2);
          if (isNaN(val1) || isNaN(val2)) {
            throw new Error('Invalid decimal numbers');
          }
          break;
        case 'hex':
          if (!isValidHex(operand1) || !isValidHex(operand2)) {
            throw new Error('Invalid hexadecimal numbers');
          }
          val1 = parseInt(operand1, 16);
          val2 = parseInt(operand2, 16);
          break;
        default:
          throw new Error('Invalid base');
      }

      let result: number;
      let operatorSymbol: string;
      
      switch (operation) {
        case 'add':
          result = val1 + val2;
          operatorSymbol = '+';
          break;
        case 'subtract':
          result = val1 - val2;
          operatorSymbol = '-';
          break;
        case 'multiply':
          result = val1 * val2;
          operatorSymbol = '×';
          break;
        case 'divide':
          if (val2 === 0) throw new Error('Division by zero');
          result = Math.floor(val1 / val2);
          operatorSymbol = '÷';
          break;
        case 'and':
          result = val1 & val2;
          operatorSymbol = 'AND';
          break;
        case 'or':
          result = val1 | val2;
          operatorSymbol = 'OR';
          break;
        case 'xor':
          result = val1 ^ val2;
          operatorSymbol = 'XOR';
          break;
        case 'leftShift':
          result = val1 << val2;
          operatorSymbol = '<<';
          break;
        case 'rightShift':
          result = val1 >> val2;
          operatorSymbol = '>>';
          break;
        default:
          throw new Error('Invalid operation');
      }

      const resultInBase = operationBase === 'binary' ? result.toString(2) :
                          operationBase === 'hex' ? result.toString(16).toUpperCase() :
                          result.toString();
      
      setOperationResult(resultInBase);
      addToHistory(`${operand1} ${operatorSymbol} ${operand2} = ${resultInBase} (${operationBase})`);
      
      toast({
        title: "Operation Complete",
        description: `Result: ${resultInBase}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Calculation error",
        variant: "destructive"
      });
    }
  };

  const setBit = () => {
    const result = bitNumber | (1 << bitPosition);
    setBitOperationResult(result);
    addToHistory(`Set bit ${bitPosition} in ${bitNumber} → ${result} (binary: ${result.toString(2)})`);
  };

  const clearBit = () => {
    const result = bitNumber & ~(1 << bitPosition);
    setBitOperationResult(result);
    addToHistory(`Clear bit ${bitPosition} in ${bitNumber} → ${result} (binary: ${result.toString(2)})`);
  };

  const toggleBit = () => {
    const result = bitNumber ^ (1 << bitPosition);
    setBitOperationResult(result);
    addToHistory(`Toggle bit ${bitPosition} in ${bitNumber} → ${result} (binary: ${result.toString(2)})`);
  };

  const checkBit = () => {
    const isSet = (bitNumber & (1 << bitPosition)) !== 0;
    toast({
      title: "Bit Check",
      description: `Bit ${bitPosition} in ${bitNumber} is ${isSet ? 'SET (1)' : 'CLEAR (0)'}`
    });
    addToHistory(`Check bit ${bitPosition} in ${bitNumber} → ${isSet ? '1' : '0'}`);
  };

  const binaryTable = Array.from({ length: 16 }, (_, i) => ({
    decimal: i,
    binary: i.toString(2).padStart(4, '0'),
    octal: i.toString(8),
    hex: i.toString(16).toUpperCase()
  }));

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Binary Calculator & Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert between number systems, perform binary operations, and manipulate individual bits.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="converter" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="converter">Converter</TabsTrigger>
                <TabsTrigger value="operations">Operations</TabsTrigger>
                <TabsTrigger value="bits">Bit Manipulation</TabsTrigger>
              </TabsList>

              <TabsContent value="converter">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Binary className="h-6 w-6" />
                      Number System Converter
                    </CardTitle>
                    <CardDescription>Convert between decimal, binary, octal, and hexadecimal</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label>Decimal</Label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              value={decimal}
                              onChange={(e) => setDecimal(parseInt(e.target.value) || 0)}
                              placeholder="Enter decimal number"
                            />
                            <Button onClick={convertFromDecimal} variant="outline">
                              Convert
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Binary</Label>
                          <div className="flex gap-2">
                            <Input
                              value={binary}
                              onChange={(e) => setBinary(e.target.value)}
                              placeholder="Enter binary number"
                            />
                            <Button onClick={convertFromBinary} variant="outline">
                              Convert
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label>Octal</Label>
                          <div className="flex gap-2">
                            <Input
                              value={octal}
                              onChange={(e) => setOctal(e.target.value)}
                              placeholder="Enter octal number"
                            />
                            <Button onClick={convertFromOctal} variant="outline">
                              Convert
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Hexadecimal</Label>
                          <div className="flex gap-2">
                            <Input
                              value={hexadecimal}
                              onChange={(e) => setHexadecimal(e.target.value)}
                              placeholder="Enter hex number"
                            />
                            <Button onClick={convertFromHex} variant="outline">
                              Convert
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Current Values</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-white p-3 rounded text-center">
                          <div className="font-semibold">Decimal</div>
                          <div className="text-lg">{decimal}</div>
                        </div>
                        <div className="bg-white p-3 rounded text-center">
                          <div className="font-semibold">Binary</div>
                          <div className="text-lg font-mono break-all">{binary}</div>
                        </div>
                        <div className="bg-white p-3 rounded text-center">
                          <div className="font-semibold">Octal</div>
                          <div className="text-lg">{octal}</div>
                        </div>
                        <div className="bg-white p-3 rounded text-center">
                          <div className="font-semibold">Hex</div>
                          <div className="text-lg">{hexadecimal}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="operations">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-6 w-6" />
                      Binary Operations
                    </CardTitle>
                    <CardDescription>Perform arithmetic and bitwise operations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Number Base</Label>
                        <Select value={operationBase} onValueChange={setOperationBase}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="binary">Binary</SelectItem>
                            <SelectItem value="decimal">Decimal</SelectItem>
                            <SelectItem value="hex">Hexadecimal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>First Operand</Label>
                        <Input
                          value={operand1}
                          onChange={(e) => setOperand1(e.target.value)}
                          placeholder={`Enter ${operationBase} number`}
                        />
                      </div>
                      
                      <div>
                        <Label>Second Operand</Label>
                        <Input
                          value={operand2}
                          onChange={(e) => setOperand2(e.target.value)}
                          placeholder={`Enter ${operationBase} number`}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Operation</Label>
                      <Select value={operation} onValueChange={setOperation}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="add">Addition (+)</SelectItem>
                          <SelectItem value="subtract">Subtraction (-)</SelectItem>
                          <SelectItem value="multiply">Multiplication (×)</SelectItem>
                          <SelectItem value="divide">Division (÷)</SelectItem>
                          <SelectItem value="and">Bitwise AND (&)</SelectItem>
                          <SelectItem value="or">Bitwise OR (|)</SelectItem>
                          <SelectItem value="xor">Bitwise XOR (^)</SelectItem>
                          <SelectItem value="leftShift">Left Shift (<<)</SelectItem>
                          <SelectItem value="rightShift">Right Shift (>>)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={performBinaryOperation} className="w-full">
                      Calculate
                    </Button>

                    {operationResult && (
                      <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          Result: {operationResult}
                        </div>
                        <div className="text-sm text-gray-600">
                          Base: {operationBase}
                        </div>
                        {operationBase !== 'decimal' && (
                          <div className="text-sm text-gray-500 mt-1">
                            Decimal: {parseInt(operationResult, operationBase === 'binary' ? 2 : 16)}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bits">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Binary className="h-6 w-6" />
                      Bit Manipulation
                    </CardTitle>
                    <CardDescription>Set, clear, toggle, and check individual bits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Number (Decimal)</Label>
                        <Input
                          type="number"
                          value={bitNumber}
                          onChange={(e) => setBitNumber(parseInt(e.target.value) || 0)}
                          placeholder="Enter number"
                        />
                      </div>
                      
                      <div>
                        <Label>Bit Position (0-31)</Label>
                        <Input
                          type="number"
                          value={bitPosition}
                          onChange={(e) => setBitPosition(Math.max(0, Math.min(31, parseInt(e.target.value) || 0)))}
                          placeholder="Enter bit position"
                          min="0"
                          max="31"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-center mb-4">
                        <div className="text-lg font-semibold">Current Number</div>
                        <div className="text-2xl font-bold text-blue-600">{bitNumber}</div>
                        <div className="text-sm text-gray-600 font-mono break-all">
                          Binary: {bitNumber.toString(2).padStart(8, '0')}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button onClick={setBit} variant="outline">
                        Set Bit
                      </Button>
                      <Button onClick={clearBit} variant="outline">
                        Clear Bit
                      </Button>
                      <Button onClick={toggleBit} variant="outline">
                        Toggle Bit
                      </Button>
                      <Button onClick={checkBit} variant="outline">
                        Check Bit
                      </Button>
                    </div>

                    {bitOperationResult !== null && (
                      <div className="bg-green-50 p-6 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          Result: {bitOperationResult}
                        </div>
                        <div className="text-sm text-gray-600 font-mono">
                          Binary: {bitOperationResult.toString(2).padStart(8, '0')}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Reference Table</CardTitle>
                <CardDescription>Common number conversions (0-15)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="font-semibold p-2 bg-gray-100">Dec</div>
                  <div className="font-semibold p-2 bg-gray-100">Bin</div>
                  <div className="font-semibold p-2 bg-gray-100">Oct</div>
                  <div className="font-semibold p-2 bg-gray-100">Hex</div>
                  {binaryTable.map((row) => (
                    <React.Fragment key={row.decimal}>
                      <div className="p-1 text-center">{row.decimal}</div>
                      <div className="p-1 text-center font-mono">{row.binary}</div>
                      <div className="p-1 text-center">{row.octal}</div>
                      <div className="p-1 text-center">{row.hex}</div>
                    </React.Fragment>
                  ))}
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
                <CardDescription>Recent binary operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No calculations yet</p>
                  ) : (
                    history.slice().reverse().map((calc, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm font-mono break-all">
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

export default BinaryCalculator;
