
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Download, RotateCcw, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NumberToWordsConverter = () => {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [showCurrency, setShowCurrency] = useState(false);
  const { toast } = useToast();

  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const thousands = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];

  const currencies = {
    USD: { major: 'dollar', minor: 'cent', majorPlural: 'dollars', minorPlural: 'cents' },
    EUR: { major: 'euro', minor: 'cent', majorPlural: 'euros', minorPlural: 'cents' },
    GBP: { major: 'pound', minor: 'penny', majorPlural: 'pounds', minorPlural: 'pence' },
    JPY: { major: 'yen', minor: 'sen', majorPlural: 'yen', minorPlural: 'sen' },
    CAD: { major: 'dollar', minor: 'cent', majorPlural: 'dollars', minorPlural: 'cents' },
    AUD: { major: 'dollar', minor: 'cent', majorPlural: 'dollars', minorPlural: 'cents' },
  };

  const convertHundreds = (num: number): string => {
    let result = '';
    
    if (num >= 100) {
      result += ones[Math.floor(num / 100)] + ' hundred';
      num %= 100;
      if (num > 0) result += ' ';
    }
    
    if (num >= 20) {
      result += tens[Math.floor(num / 10)];
      num %= 10;
      if (num > 0) result += '-' + ones[num];
    } else if (num >= 10) {
      result += teens[num - 10];
    } else if (num > 0) {
      result += ones[num];
    }
    
    return result;
  };

  const convertToWords = (num: number): string => {
    if (num === 0) return 'zero';
    
    let result = '';
    let thousandIndex = 0;
    
    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        const chunkWords = convertHundreds(chunk);
        const thousandWord = thousands[thousandIndex];
        result = chunkWords + (thousandWord ? ' ' + thousandWord : '') + (result ? ' ' + result : '');
      }
      num = Math.floor(num / 1000);
      thousandIndex++;
    }
    
    return result;
  };

  const convertNumber = () => {
    try {
      const cleanNumber = number.replace(/[^\d.-]/g, '');
      
      if (!cleanNumber || isNaN(parseFloat(cleanNumber))) {
        throw new Error('Please enter a valid number');
      }
      
      const numValue = parseFloat(cleanNumber);
      
      if (numValue > 999999999999999) {
        throw new Error('Number is too large (maximum: 999,999,999,999,999)');
      }
      
      if (numValue < -999999999999999) {
        throw new Error('Number is too small (minimum: -999,999,999,999,999)');
      }
      
      let words = '';
      let absNum = Math.abs(numValue);
      
      if (showCurrency) {
        // Handle currency conversion
        const integerPart = Math.floor(absNum);
        const decimalPart = Math.round((absNum - integerPart) * 100);
        
        const currencyInfo = currencies[currency as keyof typeof currencies];
        
        if (integerPart === 0) {
          words = 'zero';
        } else {
          words = convertToWords(integerPart);
        }
        
        words += integerPart === 1 ? ` ${currencyInfo.major}` : ` ${currencyInfo.majorPlural}`;
        
        if (decimalPart > 0) {
          words += ' and ' + convertToWords(decimalPart);
          words += decimalPart === 1 ? ` ${currencyInfo.minor}` : ` ${currencyInfo.minorPlural}`;
        }
      } else {
        // Handle regular number conversion
        if (absNum === Math.floor(absNum)) {
          // Integer
          words = convertToWords(absNum);
        } else {
          // Decimal
          const integerPart = Math.floor(absNum);
          const decimalPart = absNum - integerPart;
          const decimalString = decimalPart.toString().split('.')[1];
          
          if (integerPart === 0) {
            words = 'zero';
          } else {
            words = convertToWords(integerPart);
          }
          
          words += ' point';
          
          for (let digit of decimalString) {
            words += ' ' + ones[parseInt(digit)];
          }
        }
      }
      
      if (numValue < 0) {
        words = 'negative ' + words;
      }
      
      // Capitalize first letter
      words = words.charAt(0).toUpperCase() + words.slice(1);
      
      setResult(words);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to convert number to words.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard successfully.",
      });
    }
  };

  const downloadText = () => {
    if (result) {
      const content = `Number: ${number}\nWords: ${result}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'number-to-words.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const clearAll = () => {
    setNumber('');
    setResult('');
  };

  const quickNumbers = [
    { num: '123', label: '123' },
    { num: '1000', label: '1,000' },
    { num: '1000000', label: '1 Million' },
    { num: '1234567', label: '1,234,567' },
    { num: '99.99', label: '$99.99' },
    { num: '2024', label: 'Year 2024' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Number to Words Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Convert numbers to their written word form. Perfect for writing checks, legal documents, and formal writing.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Free Tool</Badge>
              <Badge variant="secondary">Currency Support</Badge>
              <Badge variant="secondary">Large Numbers</Badge>
            </div>
          </div>

          {/* Main Tool */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                Number to Words Converter
              </CardTitle>
              <CardDescription>
                Enter a number to convert it to its written word form
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Number Input</label>
                    <Button variant="outline" size="sm" onClick={clearAll}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                  
                  <Input
                    type="text"
                    placeholder="Enter a number (e.g., 123, 99.99, 1000000)"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="text-lg text-center"
                  />
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="currency-mode"
                        checked={showCurrency}
                        onChange={(e) => setShowCurrency(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="currency-mode" className="text-sm font-medium">
                        Currency Mode
                      </label>
                    </div>
                    
                    {showCurrency && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Currency</label>
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">US Dollar (USD)</SelectItem>
                            <SelectItem value="EUR">Euro (EUR)</SelectItem>
                            <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                            <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                            <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                            <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  
                  <Button onClick={convertNumber} className="w-full" disabled={!number}>
                    Convert to Words
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Result</label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        disabled={!result}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadText}
                        disabled={!result}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="min-h-[200px] p-4 bg-gray-50 border rounded-lg">
                    {result ? (
                      <p className="text-lg leading-relaxed">{result}</p>
                    ) : (
                      <p className="text-gray-500 italic">Your converted text will appear here...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Examples */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Quick Examples</label>
                <div className="flex flex-wrap gap-2">
                  {quickNumbers.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setNumber(item.num)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>When to Use Number-to-Words Conversion</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p>
                    Converting numbers to words is essential in many formal and legal contexts where precision 
                    and clarity are important. This practice helps prevent errors and fraud, especially in 
                    financial documents.
                  </p>
                  <p>
                    Our converter handles integers, decimals, negative numbers, and currency amounts with 
                    proper formatting and grammar rules. It supports numbers up to 999 trillion and includes 
                    currency-specific terminology for major world currencies.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Use the Number to Words Converter</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <ol>
                    <li><strong>Enter Number:</strong> Type any number (integer or decimal) in the input field.</li>
                    <li><strong>Choose Mode:</strong> Toggle currency mode if you want to convert monetary amounts.</li>
                    <li><strong>Select Currency:</strong> Choose the appropriate currency if in currency mode.</li>
                    <li><strong>Convert:</strong> Click "Convert to Words" to see the written form.</li>
                    <li><strong>Copy or Download:</strong> Use the buttons to copy or save your result.</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Use Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">•</span>
                      <span><strong>Check Writing:</strong> Convert dollar amounts to words on checks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">•</span>
                      <span><strong>Legal Documents:</strong> Contracts, agreements, and official forms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">•</span>
                      <span><strong>Wedding Invitations:</strong> Formal date and time representations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">•</span>
                      <span><strong>Academic Writing:</strong> Formal papers requiring spelled-out numbers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">•</span>
                      <span><strong>Invoice Writing:</strong> Professional invoices with written amounts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">•</span>
                      <span><strong>Educational Materials:</strong> Teaching number recognition and spelling</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supported Number Formats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Integer Numbers</h4>
                      <ul className="space-y-1 text-xs">
                        <li>Positive: 123 → One hundred twenty-three</li>
                        <li>Negative: -456 → Negative four hundred fifty-six</li>
                        <li>Large: 1000000 → One million</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Decimal Numbers</h4>
                      <ul className="space-y-1 text-xs">
                        <li>Simple: 12.5 → Twelve point five</li>
                        <li>Currency: $99.99 → Ninety-nine dollars and ninety-nine cents</li>
                        <li>Precise: 3.14159 → Three point one four one five nine</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Number: 1,234</h4>
                    <p className="text-sm bg-blue-50 p-3 rounded border border-blue-200">
                      One thousand two hundred thirty-four
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Currency: $99.99</h4>
                    <p className="text-sm bg-green-50 p-3 rounded border border-green-200">
                      Ninety-nine dollars and ninety-nine cents
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Decimal: 3.14</h4>
                    <p className="text-sm bg-purple-50 p-3 rounded border border-purple-200">
                      Three point one four
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Number Limits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-semibold text-green-600">Maximum: 999,999,999,999,999</p>
                    <p className="text-gray-600">Nine hundred ninety-nine trillion...</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-red-600">Minimum: -999,999,999,999,999</p>
                    <p className="text-gray-600">Negative nine hundred ninety-nine trillion...</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-blue-600">Decimals: Up to 10 decimal places</p>
                    <p className="text-gray-600">Automatically handles precision</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Q: How do I write numbers on checks?</h4>
                    <p className="text-sm text-gray-600">
                      Use currency mode to get the proper format with "dollars and cents" for check writing.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: Can I convert fractions?</h4>
                    <p className="text-sm text-gray-600">
                      Currently, the tool converts decimal numbers. Convert fractions to decimals first (e.g., 1/2 = 0.5).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: Are there different styles for different countries?</h4>
                    <p className="text-sm text-gray-600">
                      The tool uses American English conventions. Currency names change based on the selected currency type.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: What about scientific notation?</h4>
                    <p className="text-sm text-gray-600">
                      Enter the full number instead of scientific notation (e.g., 1000000 instead of 1e6).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NumberToWordsConverter;
