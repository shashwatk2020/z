
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PiggyBank, TrendingUp, Calendar, Target, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RetirementCalculator = () => {
  // Basic retirement planning
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [inflationRate, setInflationRate] = useState(3);

  // Retirement needs
  const [desiredIncome, setDesiredIncome] = useState(80000);
  const [currentIncome, setCurrentIncome] = useState(100000);
  const [socialSecurity, setSocialSecurity] = useState(2000);
  const [pensionIncome, setPensionIncome] = useState(0);

  // 401k planning
  const [salary, setSalary] = useState(100000);
  const [contribution401k, setContribution401k] = useState(10);
  const [employerMatch, setEmployerMatch] = useState(50);
  const [maxMatch, setMaxMatch] = useState(6);

  // Results
  const [projectedSavings, setProjectedSavings] = useState<number | null>(null);
  const [monthlyNeeded, setMonthlyNeeded] = useState<number | null>(null);
  const [shortfall, setShortfall] = useState<number | null>(null);

  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const calculateRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyRate = annualReturn / 100 / 12;

    // Future value of current savings
    const futureCurrentSavings = currentSavings * Math.pow(1 + annualReturn / 100, yearsToRetirement);

    // Future value of monthly contributions
    const futureContributions = monthlyContribution * 
      ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate);

    const totalSavings = futureCurrentSavings + futureContributions;

    // Calculate monthly income needed in future dollars
    const futureIncomeNeeded = desiredIncome * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    const monthlyIncomeNeeded = futureIncomeNeeded / 12;

    // Calculate shortfall
    const totalMonthlyIncome = socialSecurity + pensionIncome;
    const incomeGap = monthlyIncomeNeeded - totalMonthlyIncome;

    setProjectedSavings(totalSavings);
    setMonthlyNeeded(monthlyIncomeNeeded);
    setShortfall(incomeGap);

    addToHistory(`Retirement in ${yearsToRetirement}Y: $${totalSavings.toFixed(0)} projected, need $${monthlyIncomeNeeded.toFixed(0)}/mo`);
    
    toast({
      title: "Retirement Calculated",
      description: `Projected savings: $${totalSavings.toLocaleString()}`
    });
  };

  const calculate401k = () => {
    const annualContribution = salary * (contribution401k / 100);
    const employerContrib = Math.min(salary * (maxMatch / 100), annualContribution * (employerMatch / 100));
    const totalAnnual = annualContribution + employerContrib;

    addToHistory(`401k: $${annualContribution.toFixed(0)} + $${employerContrib.toFixed(0)} employer match = $${totalAnnual.toFixed(0)}/year`);
    
    toast({
      title: "401k Analysis",
      description: `Total annual contribution: $${totalAnnual.toLocaleString()}`
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Retirement Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Plan your retirement savings, calculate 401k contributions, and determine if you're on track for your retirement goals.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="retirement" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="retirement">Retirement Planning</TabsTrigger>
                <TabsTrigger value="needs">Income Needs</TabsTrigger>
                <TabsTrigger value="401k">401k Planning</TabsTrigger>
              </TabsList>

              <TabsContent value="retirement">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PiggyBank className="h-6 w-6" />
                      Retirement Savings Calculator
                    </CardTitle>
                    <CardDescription>Calculate your projected retirement savings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Current Age</Label>
                        <Input
                          type="number"
                          value={currentAge}
                          onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)}
                          placeholder="Your current age"
                        />
                      </div>
                      <div>
                        <Label>Retirement Age</Label>
                        <Input
                          type="number"
                          value={retirementAge}
                          onChange={(e) => setRetirementAge(parseInt(e.target.value) || 0)}
                          placeholder="Target retirement age"
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
                        <Label>Monthly Contribution ($)</Label>
                        <Input
                          type="number"
                          value={monthlyContribution}
                          onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                          placeholder="Monthly savings amount"
                        />
                      </div>
                      <div>
                        <Label>Expected Annual Return (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={annualReturn}
                          onChange={(e) => setAnnualReturn(parseFloat(e.target.value) || 0)}
                          placeholder="Expected return rate"
                        />
                      </div>
                      <div>
                        <Label>Inflation Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={inflationRate}
                          onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                          placeholder="Expected inflation"
                        />
                      </div>
                    </div>

                    <Button onClick={calculateRetirement} className="w-full">
                      Calculate Retirement Savings
                    </Button>

                    {projectedSavings !== null && (
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="grid md:grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              ${projectedSavings.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Projected Savings</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              {retirementAge - currentAge} Years
                            </div>
                            <div className="text-sm text-gray-600">Until Retirement</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              ${(monthlyContribution * 12).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Annual Contribution</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="needs">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-6 w-6" />
                      Retirement Income Needs
                    </CardTitle>
                    <CardDescription>Calculate how much income you'll need in retirement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Desired Annual Income ($)</Label>
                        <Input
                          type="number"
                          value={desiredIncome}
                          onChange={(e) => setDesiredIncome(parseFloat(e.target.value) || 0)}
                          placeholder="Income needed in retirement"
                        />
                      </div>
                      <div>
                        <Label>Current Annual Income ($)</Label>
                        <Input
                          type="number"
                          value={currentIncome}
                          onChange={(e) => setCurrentIncome(parseFloat(e.target.value) || 0)}
                          placeholder="Your current income"
                        />
                      </div>
                      <div>
                        <Label>Expected Social Security ($/month)</Label>
                        <Input
                          type="number"
                          value={socialSecurity}
                          onChange={(e) => setSocialSecurity(parseFloat(e.target.value) || 0)}
                          placeholder="Monthly Social Security"
                        />
                      </div>
                      <div>
                        <Label>Pension Income ($/month)</Label>
                        <Input
                          type="number"
                          value={pensionIncome}
                          onChange={(e) => setPensionIncome(parseFloat(e.target.value) || 0)}
                          placeholder="Monthly pension income"
                        />
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Income Replacement Guidelines:</h4>
                      <div className="text-sm space-y-1">
                        <div>• 70-80% of pre-retirement income is typically needed</div>
                        <div>• Lower earners may need 90% replacement</div>
                        <div>• Higher earners may be comfortable with 70%</div>
                        <div>• Consider reduced expenses (mortgage paid off, etc.)</div>
                      </div>
                    </div>

                    {shortfall !== null && (
                      <div className="bg-red-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-red-600 mb-2">
                          ${shortfall.toFixed(0)}
                        </div>
                        <div className="text-gray-600">
                          Monthly Income Gap to Fill
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="401k">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6" />
                      401k Contribution Calculator
                    </CardTitle>
                    <CardDescription>Optimize your 401k contributions and employer match</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Annual Salary ($)</Label>
                        <Input
                          type="number"
                          value={salary}
                          onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
                          placeholder="Your annual salary"
                        />
                      </div>
                      <div>
                        <Label>Your Contribution (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={contribution401k}
                          onChange={(e) => setContribution401k(parseFloat(e.target.value) || 0)}
                          placeholder="Your 401k contribution %"
                        />
                      </div>
                      <div>
                        <Label>Employer Match (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={employerMatch}
                          onChange={(e) => setEmployerMatch(parseFloat(e.target.value) || 0)}
                          placeholder="Employer match percentage"
                        />
                      </div>
                      <div>
                        <Label>Max Match at (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={maxMatch}
                          onChange={(e) => setMaxMatch(parseFloat(e.target.value) || 0)}
                          placeholder="Max contribution for full match"
                        />
                      </div>
                    </div>

                    <Button onClick={calculate401k} className="w-full">
                      Calculate 401k Contributions
                    </Button>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">401k Tips:</h4>
                      <div className="text-sm space-y-1">
                        <div>• Contribute at least enough to get full employer match</div>
                        <div>• 2024 contribution limit: $23,000 ($30,500 if 50+)</div>
                        <div>• Consider Roth 401k for tax diversification</div>
                        <div>• Increase contributions with salary raises</div>
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
                <CardDescription>Recent retirement calculations</CardDescription>
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
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Retirement Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Age 50:</span>
                    <span className="font-semibold">Catch-up contributions</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Age 59½:</span>
                    <span className="font-semibold">No early withdrawal penalty</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Age 62:</span>
                    <span className="font-semibold">Early Social Security</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Age 67:</span>
                    <span className="font-semibold">Full Social Security</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Age 73:</span>
                    <span className="font-semibold">Required distributions</span>
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

export default RetirementCalculator;
