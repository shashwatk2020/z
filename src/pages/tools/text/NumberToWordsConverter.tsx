
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NumberToWordsConverter = () => {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState('');
  const [language, setLanguage] = useState('english');
  const [format, setFormat] = useState('lowercase');
  const { toast } = useToast();

  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const thousands = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];

  const convertNumberToWords = (num: number): string => {
    if (num === 0) return 'zero';

    const convertHundreds = (n: number): string => {
      let result = '';
      
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + ' hundred';
        n %= 100;
        if (n > 0) result += ' ';
      }
      
      if (n >= 20) {
        result += tens[Math.floor(n / 10)];
        n %= 10;
        if (n > 0) result += '-' + ones[n];
      } else if (n >= 10) {
        result += teens[n - 10];
      } else if (n > 0) {
        result += ones[n];
      }
      
      return result;
    };

    let result = '';
    let thousandIndex = 0;
    
    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        const chunkWords = convertHundreds(chunk);
        if (thousandIndex > 0) {
          result = chunkWords + ' ' + thousands[thousandIndex] + (result ? ' ' + result : '');
        } else {
          result = chunkWords;
        }
      }
      num = Math.floor(num / 1000);
      thousandIndex++;
    }
    
    return result;
  };

  const formatResult = (text: string): string => {
    switch (format) {
      case 'uppercase':
        return text.toUpperCase();
      case 'capitalize':
        return text.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      case 'sentence':
        return text.charAt(0).toUpperCase() + text.slice(1);
      default:
        return text;
    }
  };

  const handleConvert = () => {
    const cleanNumber = number.replace(/[^\d.-]/g, '');
    const numValue = parseFloat(cleanNumber);
    
    if (isNaN(numValue)) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return;
    }

    if (numValue < 0) {
      const positiveWords = convertNumberToWords(Math.abs(numValue));
      setResult(formatResult('negative ' + positiveWords));
    } else if (numValue % 1 !== 0) {
      const integerPart = Math.floor(numValue);
      const decimalPart = (numValue - integerPart).toFixed(2).slice(2);
      const integerWords = integerPart === 0 ? 'zero' : convertNumberToWords(integerPart);
      const decimalWords = decimalPart.split('').map(digit => ones[parseInt(digit)]).join(' ');
      setResult(formatResult(`${integerWords} point ${decimalWords}`));
    } else {
      setResult(formatResult(convertNumberToWords(numValue)));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard"
    });
  };

  const clearAll = () => {
    setNumber('');
    setResult('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Number to Words Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Convert numbers to their written form with support for decimals, negatives, and multiple formatting options.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Enter Number</CardTitle>
                <CardDescription>Input any number to convert to words</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="number">Number</Label>
                  <Input
                    id="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Enter a number (e.g., 123.45, -456)"
                    className="text-lg"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Format</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lowercase">lowercase</SelectItem>
                        <SelectItem value="uppercase">UPPERCASE</SelectItem>
                        <SelectItem value="capitalize">Capitalize Each Word</SelectItem>
                        <SelectItem value="sentence">Sentence case</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleConvert} className="flex-1">
                    Convert to Words
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>Number converted to words</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="min-h-[200px] p-4 bg-gray-50 rounded-lg border">
                    <p className="text-lg leading-relaxed">{result || 'Enter a number to see the result'}</p>
                  </div>
                  
                  {result && (
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">
                        {result.length} characters
                      </Badge>
                      <Button variant="outline" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Supported Formats</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Whole numbers (123 → one hundred twenty-three)</li>
                    <li>• Decimal numbers (123.45 → one hundred twenty-three point four five)</li>
                    <li>• Negative numbers (-123 → negative one hundred twenty-three)</li>
                    <li>• Large numbers up to quadrillions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Formatting Options</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Lowercase</li>
                    <li>• UPPERCASE</li>
                    <li>• Capitalize Each Word</li>
                    <li>• Sentence case</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NumberToWordsConverter;
