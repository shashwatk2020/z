
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, BarChart3, DollarSign, Target, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ROICalculator = () => {
  // Basic ROI
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [finalValue, setFinalValue] = useState(12000);
  const [timePeriod, setTimePeriod] = useState(12); // months

  // Marketing ROI
  const [marketingCost, setMarketingCost] = useState(5000);
  const [revenue, setRevenue] = useState(25000);
  const [costOfGoodsSold, setCostOfGoodsSold] = useState(10000);

  // Real Estate ROI
  const [purchasePrice, setPurchasePrice] = useState(200000);
  const [downPayment, setDownPayment] = useState(40000);
  const [monthlyRent, setMonthlyRent] = useState(1800);
  const [monthlyExpenses, setMonthlyExpenses] = useState(400);
  const [annualAppreciation, setAnnualAppreciation] = useState(3);

  // Stock ROI
  const [numberOfShares, setNumberOfShares] = useState(100);
  const [buyPrice, setBuyPrice] = useState(50);
  const [sellPrice, setSellPrice] = useState(60);
  const [dividends, setDividends] = useState(200);
  const [commissions, setCommissions] = useState(20);

  // Results
  const [basicROI, setBasicROI] = useState<any>(null);
  const [marketingROI, setMarketingROI] = useState<any>(null);
  const [realEstateROI, setRealEstateROI] = useState<any>(null);
  const [stockROI, setStockROI] = useState<any>(null);

  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const calculateBasicROI = () => {
    const gain = finalValue - initialInvestment;
    const roiPercent = (gain / initialInvestment) * 100;
    const annualizedROI = timePeriod > 0 ? ((Math.pow(finalValue / initialInvestment, 12 / timePeriod) - 1) * 100) : 0;

    const results = {
      gain,
      roiPercent,
      annualizedROI,
      timePeriod
    };

    setBasicROI(results);

    addToHistory(`ROI: $${initialInvestment.toLocaleString()} → $${finalValue.toLocaleString()} = ${roiPercent.toFixed(1)}% (${timePeriod} months)`);
    
    toast({
      title: "ROI Calculated",
      description: `${roiPercent.toFixed(1)}% return over ${timePeriod} months`
    });
  };

  const calculateMarketingROI = () => {
    const grossProfit = revenue - costOfGoodsSold;
    const netProfit = grossProfit - marketingCost;
    const roiPercent = (netProfit / marketingCost) * 100;
    const roas = revenue / marketingCost; // Return on Ad Spend

    const results = {
      grossProfit,
      netProfit,
      roiPercent,
      roas
    };

    setMarketingROI(results);

    addToHistory(`Marketing ROI: $${marketingCost.toLocaleString()} → ${roiPercent.toFixed(1)}% ROI, ${roas.toFixed(1)}x ROAS`);
    
    toast({
      title: "Marketing ROI Calculated",
      description: `${roiPercent.toFixed(1)}% ROI, ${roas.toFixed(1)}x ROAS`
    });
  };

  const calculateRealEstateROI = () => {
    const annualRent = monthlyRent * 12;
    const annualExpenses = monthlyExpenses * 12;
    const netRentalIncome = annualRent - annualExpenses;
    const cashOnCashReturn = (netRentalIncome / downPayment) * 100;
    
    // Simple appreciation calculation
    const appreciationValue = purchasePrice * (annualAppreciation / 100);
    const totalAnnualReturn = netRentalIncome + appreciationValue;
    const totalROI = (totalAnnualReturn / downPayment) * 100;

    const results = {
      annualRent,
      annualExpenses,
      netRentalIncome,
      cashOnCashReturn,
      appreciationValue,
      totalAnnualReturn,
      totalROI
    };

    setRealEstateROI(results);

    addToHistory(`Real Estate ROI: ${cashOnCashReturn.toFixed(1)}% cash-on-cash, ${totalROI.toFixed(1)}% total ROI`);
    
    toast({
      title: "Real Estate ROI Calculated",
      description: `${cashOnCashReturn.toFixed(1)}% cash-on-cash return`
    });
  };

  const calculateStockROI = () => {
    const totalCost = (numberOfShares * buyPrice) + commissions;
    const totalReceived = (numberOfShares * sellPrice) + dividends - commissions;
    const gain = totalReceived - totalCost;
    const roiPercent = (gain / totalCost) * 100;

    const capitalGain = numberOfShares * (sellPrice - buyPrice);
    const dividendYield = dividends > 0 ? (dividends / totalCost) * 100 : 0;

    const results = {
      totalCost,
      totalReceived,
      gain,
      roiPercent,
      capitalGain,
      dividendYield
    };

    setStockROI(results);

    addToHistory(`Stock ROI: ${numberOfShares} shares @ $${buyPrice} → $${sellPrice} = ${roiPercent.toFixed(1)}% ROI`);
    
    toast({
      title: "Stock ROI Calculated",
      description: `${roiPercent.toFixed(1)}% return on stock investment`
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ROI Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate Return on Investment for various scenarios including basic investments, marketing campaigns, real estate, and stocks.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic ROI</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
                <TabsTrigger value="realestate">Real Estate</TabsTrigger>
                <TabsTrigger value="stocks">Stocks</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6" />
                      Basic ROI Calculator
                    </CardTitle>
                    <CardDescription>Calculate return on investment for any investment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Initial Investment ($)</Label>
                        <Input
                          type="number"
                          value={initialInvestment}
                          onChange={(e) => setInitialInvestment(parseFloat(e.target.value) || 0)}
                          placeholder="Amount invested"
                        />
                      </div>
                      <div>
                        <Label>Final Value ($)</Label>
                        <Input
                          type="number"
                          value={finalValue}
                          onChange={(e) => setFinalValue(parseFloat(e.target.value) || 0)}
                          placeholder="Current/final value"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Time Period (months)</Label>
                        <Input
                          type="number"
                          value={timePeriod}
                          onChange={(e) => setTimePeriod(parseFloat(e.target.value) || 0)}
                          placeholder="Investment duration in months"
                        />
                      </div>
                    </div>

                    <Button onClick={calculateBasicROI} className="w-full">
                      Calculate ROI
                    </Button>

                    {basicROI && (
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="grid md:grid-cols-3 gap-4 text-center">
                          <div>
                            <div className={`text-2xl font-bold ${basicROI.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {basicROI.gain >= 0 ? '+' : ''}${basicROI.gain.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Gain/Loss</div>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${basicROI.roiPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {basicROI.roiPercent.toFixed(2)}%
                            </div>
                            <div className="text-sm text-gray-600">Total ROI</div>
                          </div>
                          <div>
                            <div className={`text-2xl font-bold ${basicROI.annualizedROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {basicROI.annualizedROI.toFixed(2)}%
                            </div>
                            <div className="text-sm text-gray-600">Annualized ROI</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">ROI Interpretation:</h4>
                      <div className="text-sm space-y-1">
                        <div>• Positive ROI: Investment gained value</div>
                        <div>• Negative ROI: Investment lost value</div>
                        <div>• 7-10% annual ROI is typical for stock market</div>
                        <div>• Compare to inflation rate (usually 2-3%)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="marketing">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-6 w-6" />
                      Marketing ROI Calculator
                    </CardTitle>
                    <CardDescription>Calculate return on marketing investment and ROAS</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Marketing Cost ($)</Label>
                        <Input
                          type="number"
                          value={marketingCost}
                          onChange={(e) => setMarketingCost(parseFloat(e.target.value) || 0)}
                          placeholder="Total marketing spend"
                        />
                      </div>
                      <div>
                        <Label>Revenue Generated ($)</Label>
                        <Input
                          type="number"
                          value={revenue}
                          onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)}
                          placeholder="Revenue from campaign"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Cost of Goods Sold ($)</Label>
                        <Input
                          type="number"
                          value={costOfGoodsSold}
                          onChange={(e) => setCostOfGoodsSold(parseFloat(e.target.value) || 0)}
                          placeholder="COGS for products sold"
                        />
                      </div>
                    </div>

                    <Button onClick={calculateMarketingROI} className="w-full">
                      Calculate Marketing ROI
                    </Button>

                    {marketingROI && (
                      <div className="bg-green-50 p-6 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-4 text-center">
                          <div>
                            <div className={`text-2xl font-bold ${marketingROI.roiPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {marketingROI.roiPercent.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">Marketing ROI</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              {marketingROI.roas.toFixed(1)}x
                            </div>
                            <div className="text-sm text-gray-600">ROAS</div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-green-200 text-center">
                          <div className="text-sm text-gray-600">
                            Net Profit: ${marketingROI.netProfit.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Marketing ROI Benchmarks:</h4>
                      <div className="text-sm space-y-1">
                        <div>• Good ROI: 400% or 4:1 ratio</div>
                        <div>• Great ROI: 500% or 5:1 ratio</div>
                        <div>• ROAS of 3:1 means $3 revenue per $1 spent</div>
                        <div>• Include all costs: ads, staff, tools, etc.</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="realestate">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-6 w-6" />
                      Real Estate ROI Calculator
                    </CardTitle>
                    <CardDescription>Calculate rental property cash-on-cash return and total ROI</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Purchase Price ($)</Label>
                        <Input
                          type="number"
                          value={purchasePrice}
                          onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                          placeholder="Property purchase price"
                        />
                      </div>
                      <div>
                        <Label>Down Payment ($)</Label>
                        <Input
                          type="number"
                          value={downPayment}
                          onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                          placeholder="Cash invested"
                        />
                      </div>
                      <div>
                        <Label>Monthly Rent ($)</Label>
                        <Input
                          type="number"
                          value={monthlyRent}
                          onChange={(e) => setMonthlyRent(parseFloat(e.target.value) || 0)}
                          placeholder="Monthly rental income"
                        />
                      </div>
                      <div>
                        <Label>Monthly Expenses ($)</Label>
                        <Input
                          type="number"
                          value={monthlyExpenses}
                          onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)}
                          placeholder="Taxes, insurance, maintenance"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Annual Appreciation (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={annualAppreciation}
                          onChange={(e) => setAnnualAppreciation(parseFloat(e.target.value) || 0)}
                          placeholder="Expected annual appreciation"
                        />
                      </div>
                    </div>

                    <Button onClick={calculateRealEstateROI} className="w-full">
                      Calculate Real Estate ROI
                    </Button>

                    {realEstateROI && (
                      <div className="bg-purple-50 p-6 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              {realEstateROI.cashOnCashReturn.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">Cash-on-Cash Return</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              {realEstateROI.totalROI.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">Total ROI (with appreciation)</div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-purple-200">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>Net Rental Income: ${realEstateROI.netRentalIncome.toLocaleString()}/year</div>
                            <div>Appreciation Value: ${realEstateROI.appreciationValue.toLocaleString()}/year</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Real Estate ROI Guidelines:</h4>
                      <div className="text-sm space-y-1">
                        <div>• Good cash-on-cash return: 8-12%</div>
                        <div>• 1% rule: Monthly rent ≥ 1% of purchase price</div>
                        <div>• Include vacancy, repairs, management costs</div>
                        <div>• Don't forget depreciation tax benefits</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stocks">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-6 w-6" />
                      Stock Investment ROI Calculator
                    </CardTitle>
                    <CardDescription>Calculate stock investment returns including dividends</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Number of Shares</Label>
                        <Input
                          type="number"
                          value={numberOfShares}
                          onChange={(e) => setNumberOfShares(parseFloat(e.target.value) || 0)}
                          placeholder="Shares purchased"
                        />
                      </div>
                      <div>
                        <Label>Buy Price per Share ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={buyPrice}
                          onChange={(e) => setBuyPrice(parseFloat(e.target.value) || 0)}
                          placeholder="Purchase price"
                        />
                      </div>
                      <div>
                        <Label>Sell Price per Share ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={sellPrice}
                          onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
                          placeholder="Current/sell price"
                        />
                      </div>
                      <div>
                        <Label>Total Dividends Received ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={dividends}
                          onChange={(e) => setDividends(parseFloat(e.target.value) || 0)}
                          placeholder="Dividend income"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Trading Commissions ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={commissions}
                          onChange={(e) => setCommissions(parseFloat(e.target.value) || 0)}
                          placeholder="Total commission fees"
                        />
                      </div>
                    </div>

                    <Button onClick={calculateStockROI} className="w-full">
                      Calculate Stock ROI
                    </Button>

                    {stockROI && (
                      <div className="bg-orange-50 p-6 rounded-lg">
                        <div className="grid md:grid-cols-3 gap-4 text-center">
                          <div>
                            <div className={`text-2xl font-bold ${stockROI.roiPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {stockROI.roiPercent.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">Total ROI</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              ${stockROI.capitalGain.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Capital Gain</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              {stockROI.dividendYield.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">Dividend Yield</div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-orange-200 text-center">
                          <div className="text-sm text-gray-600">
                            Total Gain: ${stockROI.gain.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}
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
                <CardDescription>Recent ROI calculations</CardDescription>
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

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>ROI Quick Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Savings Account:</span>
                    <span className="font-semibold">1-3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bonds:</span>
                    <span className="font-semibold">3-6%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stock Market:</span>
                    <span className="font-semibold">7-10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Real Estate:</span>
                    <span className="font-semibold">8-12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Small Business:</span>
                    <span className="font-semibold">15-30%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ROICalculator;
