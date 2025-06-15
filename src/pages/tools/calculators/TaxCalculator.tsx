
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Receipt, FileText, TrendingDown, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TaxCalculator = () => {
  // Income tax calculation
  const [income, setIncome] = useState(75000);
  const [filingStatus, setFilingStatus] = useState('single');
  const [deductions, setDeductions] = useState(12950); // Standard deduction 2023
  const [exemptions, setExemptions] = useState(0);

  // Sales tax calculation
  const [purchaseAmount, setPurchaseAmount] = useState(1000);
  const [salesTaxRate, setSalesTaxRate] = useState(8.5);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Property tax calculation
  const [homeValue, setHomeValue] = useState(400000);
  const [assessedValue, setAssessedValue] = useState(320000);
  const [millageRate, setMillageRate] = useState(12.5);

  // Capital gains
  const [purchasePrice, setPurchasePrice] = useState(50000);
  const [salePrice, setSalePrice] = useState(75000);
  const [holdingPeriod, setHoldingPeriod] = useState('long'); // long or short
  const [capitalGainsRate, setCapitalGainsRate] = useState(15);

  // Results
  const [federalTax, setFederalTax] = useState<number | null>(null);
  const [effectiveRate, setEffectiveRate] = useState<number | null>(null);
  const [afterTaxIncome, setAfterTaxIncome] = useState<number | null>(null);
  const [totalSalesTax, setTotalSalesTax] = useState<number | null>(null);
  const [propertyTax, setPropertyTax] = useState<number | null>(null);
  const [capitalGainsTax, setCapitalGainsTax] = useState<number | null>(null);

  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  // 2023 Federal Tax Brackets
  const taxBrackets = {
    single: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11000, max: 44725, rate: 0.12 },
      { min: 44725, max: 95375, rate: 0.22 },
      { min: 95375, max: 182050, rate: 0.24 },
      { min: 182050, max: 231250, rate: 0.32 },
      { min: 231250, max: 578125, rate: 0.35 },
      { min: 578125, max: Infinity, rate: 0.37 }
    ],
    married: [
      { min: 0, max: 22000, rate: 0.10 },
      { min: 22000, max: 89450, rate: 0.12 },
      { min: 89450, max: 190750, rate: 0.22 },
      { min: 190750, max: 364200, rate: 0.24 },
      { min: 364200, max: 462500, rate: 0.32 },
      { min: 462500, max: 693750, rate: 0.35 },
      { min: 693750, max: Infinity, rate: 0.37 }
    ]
  };

  const calculateIncomeTax = () => {
    const taxableIncome = Math.max(0, income - deductions);
    const brackets = taxBrackets[filingStatus as keyof typeof taxBrackets];
    
    let totalTax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;
      
      const taxableAtThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      totalTax += taxableAtThisBracket * bracket.rate;
      remainingIncome -= taxableAtThisBracket;
    }

    const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
    const afterTax = income - totalTax;

    setFederalTax(totalTax);
    setEffectiveRate(effectiveRate);
    setAfterTaxIncome(afterTax);

    addToHistory(`Income Tax: $${income.toLocaleString()} → $${totalTax.toFixed(0)} tax (${effectiveRate.toFixed(1)}% rate)`);
    
    toast({
      title: "Income Tax Calculated",
      description: `Federal tax: $${totalTax.toFixed(2)} (${effectiveRate.toFixed(1)}% effective rate)`
    });
  };

  const calculateSalesTax = () => {
    const discountedAmount = purchaseAmount - discountAmount;
    const taxAmount = discountedAmount * (salesTaxRate / 100);
    const totalWithTax = discountedAmount + taxAmount;

    setTotalSalesTax(taxAmount);

    addToHistory(`Sales Tax: $${discountedAmount.toFixed(2)} + ${salesTaxRate}% tax = $${totalWithTax.toFixed(2)}`);
    
    toast({
      title: "Sales Tax Calculated",
      description: `Sales tax: $${taxAmount.toFixed(2)}, Total: $${totalWithTax.toFixed(2)}`
    });
  };

  const calculatePropertyTax = () => {
    const annualTax = (assessedValue * millageRate) / 1000;
    setPropertyTax(annualTax);

    addToHistory(`Property Tax: $${assessedValue.toLocaleString()} × ${millageRate} mills = $${annualTax.toFixed(0)}/year`);
    
    toast({
      title: "Property Tax Calculated",
      description: `Annual property tax: $${annualTax.toLocaleString()}`
    });
  };

  const calculateCapitalGains = () => {
    const gain = salePrice - purchasePrice;
    let taxRate = capitalGainsRate;
    
    if (holdingPeriod === 'short') {
      // Short-term gains taxed as ordinary income (simplified)
      taxRate = 22; // Example rate
    }

    const tax = gain > 0 ? gain * (taxRate / 100) : 0;
    setCapitalGainsTax(tax);

    addToHistory(`Capital Gains: $${gain.toFixed(0)} gain × ${taxRate}% (${holdingPeriod}-term) = $${tax.toFixed(0)} tax`);
    
    toast({
      title: "Capital Gains Calculated",
      description: `Tax on $${gain.toFixed(0)} gain: $${tax.toFixed(2)}`
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tax Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate income tax, sales tax, property tax, and capital gains tax with current rates and brackets.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="income" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="income">Income Tax</TabsTrigger>
                <TabsTrigger value="sales">Sales Tax</TabsTrigger>
                <TabsTrigger value="property">Property Tax</TabsTrigger>
                <TabsTrigger value="capital">Capital Gains</TabsTrigger>
              </TabsList>

              <TabsContent value="income">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-6 w-6" />
                      Federal Income Tax Calculator
                    </CardTitle>
                    <CardDescription>Calculate your federal income tax based on 2023 tax brackets</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Annual Income ($)</Label>
                        <Input
                          type="number"
                          value={income}
                          onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                          placeholder="Your annual income"
                        />
                      </div>
                      <div>
                        <Label>Filing Status</Label>
                        <Select value={filingStatus} onValueChange={setFilingStatus}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married Filing Jointly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Deductions ($)</Label>
                        <Input
                          type="number"
                          value={deductions}
                          onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)}
                          placeholder="Total deductions"
                        />
                      </div>
                      <div>
                        <Label>Additional Exemptions ($)</Label>
                        <Input
                          type="number"
                          value={exemptions}
                          onChange={(e) => setExemptions(parseFloat(e.target.value) || 0)}
                          placeholder="Additional exemptions"
                        />
                      </div>
                    </div>

                    <Button onClick={calculateIncomeTax} className="w-full">
                      Calculate Income Tax
                    </Button>

                    {federalTax !== null && (
                      <div className="bg-red-50 p-6 rounded-lg">
                        <div className="grid md:grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-red-600">
                              ${federalTax.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Federal Tax</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-red-600">
                              {effectiveRate?.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">Effective Rate</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              ${afterTaxIncome?.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">After-Tax Income</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">2023 Tax Brackets (Single):</h4>
                      <div className="text-sm space-y-1">
                        <div>• 10%: $0 - $11,000</div>
                        <div>• 12%: $11,001 - $44,725</div>
                        <div>• 22%: $44,726 - $95,375</div>
                        <div>• 24%: $95,376 - $182,050</div>
                        <div>• 32%: $182,051 - $231,250</div>
                        <div>• 35%: $231,251 - $578,125</div>
                        <div>• 37%: $578,126+</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sales">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-6 w-6" />
                      Sales Tax Calculator
                    </CardTitle>
                    <CardDescription>Calculate sales tax on purchases</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Purchase Amount ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={purchaseAmount}
                          onChange={(e) => setPurchaseAmount(parseFloat(e.target.value) || 0)}
                          placeholder="Purchase amount"
                        />
                      </div>
                      <div>
                        <Label>Sales Tax Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={salesTaxRate}
                          onChange={(e) => setSalesTaxRate(parseFloat(e.target.value) || 0)}
                          placeholder="Sales tax rate"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Discount Amount ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={discountAmount}
                          onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                          placeholder="Discount or coupon amount"
                        />
                      </div>
                    </div>

                    <Button onClick={calculateSalesTax} className="w-full">
                      Calculate Sales Tax
                    </Button>

                    {totalSalesTax !== null && (
                      <div className="bg-orange-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                          ${totalSalesTax.toFixed(2)}
                        </div>
                        <div className="text-gray-600">
                          Sales Tax Amount
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          Total with tax: ${(purchaseAmount - discountAmount + totalSalesTax).toFixed(2)}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="property">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-6 w-6" />
                      Property Tax Calculator
                    </CardTitle>
                    <CardDescription>Calculate annual property tax</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Home Value ($)</Label>
                        <Input
                          type="number"
                          value={homeValue}
                          onChange={(e) => setHomeValue(parseFloat(e.target.value) || 0)}
                          placeholder="Market value of home"
                        />
                      </div>
                      <div>
                        <Label>Assessed Value ($)</Label>
                        <Input
                          type="number"
                          value={assessedValue}
                          onChange={(e) => setAssessedValue(parseFloat(e.target.value) || 0)}
                          placeholder="Assessed value"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Millage Rate (mills)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={millageRate}
                          onChange={(e) => setMillageRate(parseFloat(e.target.value) || 0)}
                          placeholder="Tax rate in mills"
                        />
                      </div>
                    </div>

                    <Button onClick={calculatePropertyTax} className="w-full">
                      Calculate Property Tax
                    </Button>

                    {propertyTax !== null && (
                      <div className="bg-purple-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          ${propertyTax.toLocaleString()}
                        </div>
                        <div className="text-gray-600">
                          Annual Property Tax
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          Monthly: ${(propertyTax / 12).toFixed(2)}
                        </div>
                      </div>
                    )}

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Property Tax Info:</h4>
                      <div className="text-sm space-y-1">
                        <div>• 1 mill = $1 per $1,000 of assessed value</div>
                        <div>• Assessed value is often 80-90% of market value</div>
                        <div>• Rates vary significantly by location</div>
                        <div>• May include school, county, and city taxes</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="capital">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="h-6 w-6" />
                      Capital Gains Tax Calculator
                    </CardTitle>
                    <CardDescription>Calculate tax on investment gains</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Purchase Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={purchasePrice}
                          onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                          placeholder="Original purchase price"
                        />
                      </div>
                      <div>
                        <Label>Sale Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={salePrice}
                          onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                          placeholder="Sale price"
                        />
                      </div>
                      <div>
                        <Label>Holding Period</Label>
                        <Select value={holdingPeriod} onValueChange={setHoldingPeriod}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">Short-term (≤1 year)</SelectItem>
                            <SelectItem value="long">Long-term (&gt;1 year)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Capital Gains Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={capitalGainsRate}
                          onChange={(e) => setCapitalGainsRate(parseFloat(e.target.value) || 0)}
                          placeholder="Tax rate"
                        />
                      </div>
                    </div>

                    <Button onClick={calculateCapitalGains} className="w-full">
                      Calculate Capital Gains Tax
                    </Button>

                    {capitalGainsTax !== null && (
                      <div className="bg-green-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          ${capitalGainsTax.toFixed(2)}
                        </div>
                        <div className="text-gray-600">
                          Capital Gains Tax
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          Gain: ${(salePrice - purchasePrice).toFixed(2)}
                        </div>
                      </div>
                    )}

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Capital Gains Rates (2023):</h4>
                      <div className="text-sm space-y-1">
                        <div>• Long-term: 0%, 15%, or 20% (based on income)</div>
                        <div>• Short-term: Taxed as ordinary income</div>
                        <div>• Hold &gt;1 year for long-term rates</div>
                        <div>• Consider tax-loss harvesting</div>
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
                <CardDescription>Recent tax calculations</CardDescription>
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TaxCalculator;
