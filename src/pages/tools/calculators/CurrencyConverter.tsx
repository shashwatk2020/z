
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight, Globe, TrendingUp, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(0.85);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());

  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  // Mock exchange rates (in a real app, you'd fetch from an API)
  const exchangeRates = {
    USD: {
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110.0,
      CAD: 1.25,
      AUD: 1.35,
      CHF: 0.92,
      CNY: 6.45,
      INR: 74.5,
      BRL: 5.2,
      MXN: 20.1
    },
    EUR: {
      USD: 1.18,
      GBP: 0.86,
      JPY: 129.4,
      CAD: 1.47,
      AUD: 1.59,
      CHF: 1.08,
      CNY: 7.6,
      INR: 87.8,
      BRL: 6.1,
      MXN: 23.7
    },
    GBP: {
      USD: 1.37,
      EUR: 1.16,
      JPY: 150.7,
      CAD: 1.71,
      AUD: 1.85,
      CHF: 1.26,
      CNY: 8.84,
      INR: 102.1,
      BRL: 7.1,
      MXN: 27.5
    }
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' }
  ];

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const updateExchangeRate = () => {
    if (fromCurrency === toCurrency) {
      setExchangeRate(1);
      return;
    }

    // Mock rate lookup (in real app, fetch from API)
    const rates = exchangeRates[fromCurrency as keyof typeof exchangeRates];
    if (rates) {
      const rate = rates[toCurrency as keyof typeof rates] || 1;
      setExchangeRate(rate);
    }
  };

  useEffect(() => {
    updateExchangeRate();
  }, [fromCurrency, toCurrency]);

  const convertCurrency = () => {
    const result = amount * exchangeRate;
    setConvertedAmount(result);

    const fromSymbol = currencies.find(c => c.code === fromCurrency)?.symbol || fromCurrency;
    const toSymbol = currencies.find(c => c.code === toCurrency)?.symbol || toCurrency;

    addToHistory(`${fromSymbol}${amount.toLocaleString()} ${fromCurrency} = ${toSymbol}${result.toFixed(2)} ${toCurrency} (Rate: ${exchangeRate})`);
    
    toast({
      title: "Currency Converted",
      description: `${fromSymbol}${amount} ${fromCurrency} = ${toSymbol}${result.toFixed(2)} ${toCurrency}`
    });
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const popularConversions = [
    { from: 'USD', to: 'EUR', amount: 100 },
    { from: 'USD', to: 'GBP', amount: 100 },
    { from: 'EUR', to: 'USD', amount: 100 },
    { from: 'GBP', to: 'USD', amount: 100 },
    { from: 'USD', to: 'JPY', amount: 100 },
    { from: 'USD', to: 'CAD', amount: 100 }
  ];

  const quickConvert = (from: string, to: string, amt: number) => {
    setFromCurrency(from);
    setToCurrency(to);
    setAmount(amt);
    
    // Trigger conversion after state updates
    setTimeout(() => {
      convertCurrency();
    }, 100);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Currency Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert between different currencies with real-time exchange rates and track conversion history.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-6 w-6" />
                  Currency Converter
                </CardTitle>
                <CardDescription>Convert between world currencies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      placeholder="Enter amount"
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <Label>Exchange Rate</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
                      placeholder="Exchange rate"
                      className="text-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="md:col-span-2">
                    <Label>From Currency</Label>
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map(currency => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      onClick={swapCurrencies} 
                      variant="outline" 
                      size="sm"
                      className="h-10 w-10 p-0"
                    >
                      <ArrowLeftRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label>To Currency</Label>
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map(currency => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={convertCurrency} className="w-full" size="lg">
                  Convert Currency
                </Button>

                {convertedAmount !== null && (
                  <div className="bg-green-50 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {currencies.find(c => c.code === toCurrency)?.symbol || toCurrency}
                      {convertedAmount.toFixed(2)}
                    </div>
                    <div className="text-gray-600">
                      {currencies.find(c => c.code === fromCurrency)?.symbol || fromCurrency}
                      {amount} {fromCurrency} = {currencies.find(c => c.code === toCurrency)?.symbol || toCurrency}
                      {convertedAmount.toFixed(2)} {toCurrency}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Exchange rate: 1 {fromCurrency} = {exchangeRate} {toCurrency}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-lg font-semibold mb-4 block">Popular Conversions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {popularConversions.map((conversion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => quickConvert(conversion.from, conversion.to, conversion.amount)}
                        className="text-sm p-2 h-auto"
                      >
                        {conversion.amount} {conversion.from} → {conversion.to}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Currency Info:</h4>
                  <div className="text-sm space-y-1">
                    <div>• Rates update in real-time during market hours</div>
                    <div>• Weekend rates may reflect Friday closing</div>
                    <div>• Consider bank fees for actual exchanges</div>
                    <div>• Rates shown are for reference only</div>
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
                  Conversion History
                </CardTitle>
                <CardDescription>Recent currency conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No conversions yet</p>
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
                  <TrendingUp className="h-5 w-5" />
                  Exchange Rate Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold">Last Updated:</div>
                    <div className="text-gray-600">{lastUpdated}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Market Status:</div>
                    <div className="text-green-600">Open</div>
                  </div>
                  <div>
                    <div className="font-semibold">Data Source:</div>
                    <div className="text-gray-600">Mock Exchange API</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="text-xs text-gray-500">
                    * Rates shown are for demonstration purposes. 
                    Use official financial sources for real transactions.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Major Currencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {currencies.slice(0, 6).map(currency => (
                    <div key={currency.code} className="flex justify-between">
                      <span>{currency.code}</span>
                      <span className="text-gray-600">{currency.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CurrencyConverter;
