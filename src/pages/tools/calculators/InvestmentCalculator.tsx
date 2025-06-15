
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, PieChart, Calculator, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InvestmentCalculator = () => {
  // Compound interest calculator
  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [years, setYears] = useState(20);
  const [compoundFrequency, setCompoundFrequency] = useState('monthly');

  // Retirement savings
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [retirementGoal, setRetirementGoal] = useState(1000000);

  // SIP calculator
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(15);

  // Investment comparison
  const [investment1, setInvestment1] = useState({ amount: 100000, rate: 6, years: 10 });
  const [investment2, setInvestment2] = useState({ amount: 100000, rate: 8, years: 10 });

  // Results
  const [futureValue, setFutureValue] = useState<number | null>(null);
  const [totalContributions, setTotalContributions] = useState<number | null>(null);
  const [totalEarnings, setTotalEarnings] = useState<number | null>(null);
  const [monthlyRequired, setMonthlyRequired] = useState<number | null>(null);
  const [sipMaturity, setSipMaturity] = useState<number | null>(null);
  const [comparisonResults, setComparisonResults] = useState<{inv1: number, inv2: number} | null>(null);

  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const calculateCompoundInterest = () => {
    const rate = annualReturn / 100;
    const periods = compoundFrequency === 'monthly' ? 12 : compoundFrequency === 'quarterly' ? 4 : 1;
    const totalPeriods = years * periods;
    const periodRate = rate / periods;
    
    // Future value of initial investment
    const fvPrincipal = principal * Math.pow(1 + periodRate, totalPeriods);
    
    // Future value of monthly contributions
    const monthlyPeriods = years * 12;
    const monthlyRate = rate / 12;
    const fvContributions = monthlyContribution * 
      ((Math.pow(1 + monthlyRate, monthlyPeriods) - 1) / monthlyRate);
    
    const totalFV = fvPrincipal + fvContributions;
    const totalContrib = principal + (monthlyContribution * monthlyPeriods);
    const earnings = totalFV - totalContrib;

    setFutureValue(totalFV);
    setTotalContributions(totalContrib);
    setTotalEarnings(earnings);

    addToHistory(`Investment: $${principal.toLocaleString()} + $${monthlyContribution}/mo at ${annualReturn}% for ${years}Y → $${totalFV.toFixed(2)}`);
    
    toast({
      title: "Investment Calculated",
      description: `Future value: $${totalFV.toFixed(2)}`
    });
  };

  const calculateRetirementSavings = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const rate = annualReturn / 100 / 12;
    const months = yearsToRetirement * 12;
    
    // Future value of current savings
    const fvCurrent = currentSavings * Math.pow(1 + rate, months);
    
    // Required additional savings
    const additionalNeeded = retirementGoal - fvCurrent;
    
    // Monthly payment needed
    const monthlyNeeded = additionalNeeded / (((Math.pow(1 + rate, months) - 1) / rate));

    setMonthlyRequired(monthlyNeeded);

    addToHistory(`Retirement: Need $${monthlyNeeded.toFixed(2)}/mo to reach $${retirementGoal.toLocaleString()} by age ${retirementAge}`);
    
    toast({
      title: "Retirement Planning",
      description: `Monthly savings needed: $${monthlyNeeded.toFixed(2)}`
    });
  };

  const calculateSIP = () => {
    const rate = sipRate / 100 / 12;
    const months = sipYears * 12;
    
    const maturityValue = sipAmount * (((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate));
    const totalInvested = sipAmount * months;
    const gains = maturityValue - totalInvested;

    setSipMaturity(maturityValue);

    addToHistory(`SIP: $${sipAmount}/mo at ${sipRate}% for ${sipYears}Y → Maturity: $${maturityValue.toFixed(2)} (Gains: $${gains.toFixed(2)})`);
    
    toast({
      title: "SIP Calculation Complete",
      description: `Maturity amount: $${maturityValue.toFixed(2)}`
    });
  };

  const compareInvestments = () => {
    const fv1 = investment1.amount * Math.pow(1 + investment1.rate / 100, investment1.years);
    const fv2 = investment2.amount * Math.pow(1 + investment2.rate / 100, investment2.years);

    setComparisonResults({ inv1: fv1, inv2: fv2 });

    addToHistory(`Comparison: Inv1 $${fv1.toFixed(2)} vs Inv2 $${fv2.toFixed(2)} (Difference: $${Math.abs(fv1 - fv2).toFixed(2)})`);
    
    toast({
      title: "Investment Comparison",
      description: `Better option: Investment ${fv1 > fv2 ? '1' : '2'}`
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Investment Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate compound interest, plan for retirement, analyze SIP investments, and compare different investment options.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="compound" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="compound">Compound</TabsTrigger>
                <TabsTrigger value="retirement">Retirement</TabsTrigger>
                <TabsTrigger value="sip">SIP</TabsTrigger>
                <TabsTrigger value="compare">Compare</TabsTrigger>
              </TabsList>

              <TabsContent value="compound">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6" />
                      Compound Interest Calculator
                    </CardTitle>
                    <CardDescription>Calculate the future value of your investments with compound interest</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Initial Investment ($)</Label>
                        <Input
                          type="number"
                          value={principal}
                          onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
                          placeholder="Enter initial amount"
                        />
                      </div>
                      <div>
                        <Label>Monthly Contribution ($)</Label>
                        <Input
                          type="number"
                          value={monthlyContribution}
                          onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                          placeholder="Monthly addition"
                        />
                      </div>
                      <div>
                        <Label>Annual Return (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={annualReturn}
                          onChange={(e) => setAnnualReturn(parseFloat(e.target.value) || 0)}
                          placeholder="Expected annual return"
                        />
                      </div>
                      <div>
                        <Label>Investment Period (Years)</Label>
                        <Input
                          type="number"
                          value={years}
                          onChange={(e) => setYears(parseFloat(e.target.value) || 0)}
                          placeholder="Investment duration"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Compound Frequency</Label>
                        <Select value={compoundFrequency} onValueChange={setCompoundFrequency}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={calculateCompoundInterest} className="w-full">
                      Calculate Future Value
                    </Button>

                    {futureValue !== null && (
                      <div className="bg-green-50 p-6 rounded-lg">
                        <div className="grid md:grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              ${futureValue.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Future Value</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              ${totalContributions?.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Total Invested</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              ${totalEarnings?.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Total Earnings</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="retirement">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-6 w-6" />
                      Retirement Planning Calculator
                    </CardTitle>
                    <CardDescription>Calculate how much you need to save monthly for retirement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Current Age</Label>
                        <Input
                          type="number"
                          value={currentAge}
                          onChange={(e) => setCurrentAge(parseFloat(e.target.value) || 0)}
                          placeholder="Your current age"
                        />
                      </div>
                      <div>
                        <Label>Retirement Age</Label>
                        <Input
                          type="number"
                          value={retirementAge}
                          onChange={(e) => setRetirementAge(parseFloat(e.target.value) || 0)}
                          placeholder="Planned retirement age"
                        />
                      </div>
                      <div>
                        <Label>Current Savings ($)</Label>
                        <Input
                          type="number"
                          value={currentSavings}
                          onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || 0)}
                          placeholder="Current retirement savings"
                        />
                      </div>
                      <div>
                        <Label>Retirement Goal ($)</Label>
                        <Input
                          type="number"
                          value={retirementGoal}
                          onChange={(e) => setRetirementGoal(parseFloat(e.target.value) || 0)}
                          placeholder="Target retirement amount"
                        />
                      </div>
                    </div>

                    <Button onClick={calculateRetirementSavings} className="w-full">
                      Calculate Required Savings
                    </Button>

                    {monthlyRequired !== null && (
                      <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          ${monthlyRequired.toFixed(2)}
                        </div>
                        <div className="text-gray-600">
                          Monthly Savings Required
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sip">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-6 w-6" />
                      SIP Calculator
                    </CardTitle>
                    <CardDescription>Systematic Investment Plan calculator for mutual funds</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label>Monthly SIP Amount ($)</Label>
                        <Input
                          type="number"
                          value={sipAmount}
                          onChange={(e) => setSipAmount(parseFloat(e.target.value) || 0)}
                          placeholder="Monthly investment"
                        />
                      </div>
                      <div>
                        <Label>Expected Annual Return (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={sipRate}
                          onChange={(e) => setSipRate(parseFloat(e.target.value) || 0)}
                          placeholder="Expected return rate"
                        />
                      </div>
                      <div>
                        <Label>Investment Period (Years)</Label>
                        <Input
                          type="number"
                          value={sipYears}
                          onChange={(e) => setSipYears(parseFloat(e.target.value) || 0)}
                          placeholder="Investment duration"
                        />
                      </div>
                    </div>

                    <Button onClick={calculateSIP} className="w-full">
                      Calculate SIP Maturity
                    </Button>

                    {sipMaturity !== null && (
                      <div className="bg-purple-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          ${sipMaturity.toFixed(2)}
                        </div>
                        <div className="text-gray-600">
                          Maturity Amount
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          Total Invested: ${(sipAmount * sipYears * 12).toFixed(2)}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compare">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6" />
                      Investment Comparison
                    </CardTitle>
                    <CardDescription>Compare two different investment options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Investment Option 1</h3>
                        <div>
                          <Label>Amount ($)</Label>
                          <Input
                            type="number"
                            value={investment1.amount}
                            onChange={(e) => setInvestment1({...investment1, amount: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                        <div>
                          <Label>Annual Return (%)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={investment1.rate}
                            onChange={(e) => setInvestment1({...investment1, rate: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                        <div>
                          <Label>Years</Label>
                          <Input
                            type="number"
                            value={investment1.years}
                            onChange={(e) => setInvestment1({...investment1, years: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-semibold">Investment Option 2</h3>
                        <div>
                          <Label>Amount ($)</Label>
                          <Input
                            type="number"
                            value={investment2.amount}
                            onChange={(e) => setInvestment2({...investment2, amount: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                        <div>
                          <Label>Annual Return (%)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={investment2.rate}
                            onChange={(e) => setInvestment2({...investment2, rate: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                        <div>
                          <Label>Years</Label>
                          <Input
                            type="number"
                            value={investment2.years}
                            onChange={(e) => setInvestment2({...investment2, years: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                      </div>
                    </div>

                    <Button onClick={compareInvestments} className="w-full">
                      Compare Investments
                    </Button>

                    {comparisonResults && (
                      <div className="bg-orange-50 p-6 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-orange-600">
                              ${comparisonResults.inv1.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Investment 1 Future Value</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-orange-600">
                              ${comparisonResults.inv2.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Investment 2 Future Value</div>
                          </div>
                        </div>
                        <div className="text-center mt-4">
                          <div className="text-lg font-semibold">
                            Better Option: Investment {comparisonResults.inv1 > comparisonResults.inv2 ? '1' : '2'}
                          </div>
                          <div className="text-sm text-gray-600">
                            Difference: ${Math.abs(comparisonResults.inv1 - comparisonResults.inv2).toFixed(2)}
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
                <CardDescription>Recent investment calculations</CardDescription>
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

export default InvestmentCalculator;
