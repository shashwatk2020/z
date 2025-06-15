
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, Calendar, Calculator, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SalaryCalculator = () => {
  // Salary conversion
  const [salary, setSalary] = useState(75000);
  const [payPeriod, setPayPeriod] = useState('annual');
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);

  // Raise calculation
  const [currentSalary, setCurrentSalary] = useState(60000);
  const [raiseAmount, setRaiseAmount] = useState(5000);
  const [raiseType, setRaiseType] = useState('amount'); // amount or percentage

  // Take-home pay
  const [grossSalary, setGrossSalary] = useState(75000);
  const [federalTaxRate, setFederalTaxRate] = useState(22);
  const [stateTaxRate, setStateTaxRate] = useState(6);
  const [socialSecurityRate, setSocialSecurityRate] = useState(6.2);
  const [medicareRate, setMedicareRate] = useState(1.45);
  const [deductions, setDeductions] = useState(2000);

  // Hourly vs salary comparison
  const [hourlyRate, setHourlyRate] = useState(35);
  const [overtimeRate, setOvertimeRate] = useState(52.5);
  const [overtimeHours, setOvertimeHours] = useState(5);
  const [salaryEquivalent, setSalaryEquivalent] = useState(75000);

  // Results
  const [conversions, setConversions] = useState<any>(null);
  const [raiseResults, setRaiseResults] = useState<any>(null);
  const [takeHome, setTakeHome] = useState<any>(null);
  const [comparison, setComparison] = useState<any>(null);

  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const convertSalary = () => {
    const annual = payPeriod === 'annual' ? salary : 
                 payPeriod === 'monthly' ? salary * 12 :
                 payPeriod === 'weekly' ? salary * 52 :
                 payPeriod === 'daily' ? salary * 5 * 52 :
                 salary * hoursPerWeek * weeksPerYear;

    const results = {
      annual: annual,
      monthly: annual / 12,
      weekly: annual / 52,
      daily: annual / (5 * 52),
      hourly: annual / (hoursPerWeek * weeksPerYear)
    };

    setConversions(results);

    addToHistory(`Salary: $${annual.toLocaleString()}/year = $${results.hourly.toFixed(2)}/hour`);
    
    toast({
      title: "Salary Converted",
      description: `$${annual.toLocaleString()}/year = $${results.hourly.toFixed(2)}/hour`
    });
  };

  const calculateRaise = () => {
    const newSalary = raiseType === 'amount' ? 
      currentSalary + raiseAmount : 
      currentSalary * (1 + raiseAmount / 100);

    const increaseAmount = newSalary - currentSalary;
    const percentageIncrease = (increaseAmount / currentSalary) * 100;
    const monthlyIncrease = increaseAmount / 12;

    const results = {
      newSalary,
      increaseAmount,
      percentageIncrease,
      monthlyIncrease
    };

    setRaiseResults(results);

    addToHistory(`Raise: $${currentSalary.toLocaleString()} → $${newSalary.toLocaleString()} (+${percentageIncrease.toFixed(1)}%)`);
    
    toast({
      title: "Raise Calculated",
      description: `New salary: $${newSalary.toLocaleString()} (+${percentageIncrease.toFixed(1)}%)`
    });
  };

  const calculateTakeHome = () => {
    const federalTax = grossSalary * (federalTaxRate / 100);
    const stateTax = grossSalary * (stateTaxRate / 100);
    const socialSecurity = grossSalary * (socialSecurityRate / 100);
    const medicare = grossSalary * (medicareRate / 100);
    const totalTaxes = federalTax + stateTax + socialSecurity + medicare;
    const netSalary = grossSalary - totalTaxes - deductions;

    const results = {
      grossSalary,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      deductions,
      totalTaxes,
      netSalary,
      takeHomePercentage: (netSalary / grossSalary) * 100,
      monthlyNet: netSalary / 12,
      weeklyNet: netSalary / 52
    };

    setTakeHome(results);

    addToHistory(`Take-home: $${grossSalary.toLocaleString()} gross → $${netSalary.toLocaleString()} net (${results.takeHomePercentage.toFixed(1)}%)`);
    
    toast({
      title: "Take-Home Calculated",
      description: `Net salary: $${netSalary.toLocaleString()} (${results.takeHomePercentage.toFixed(1)}% of gross)`
    });
  };

  const compareHourlySalary = () => {
    const regularHours = Math.min(hoursPerWeek, 40);
    const overtimeWeeklyHours = Math.max(0, hoursPerWeek - 40);
    
    const weeklyPay = (regularHours * hourlyRate) + (overtimeWeeklyHours * overtimeRate);
    const annualHourly = weeklyPay * weeksPerYear;
    
    const salariedHourlyRate = salaryEquivalent / (hoursPerWeek * weeksPerYear);
    const difference = annualHourly - salaryEquivalent;

    const results = {
      hourlyAnnual: annualHourly,
      salaryAnnual: salaryEquivalent,
      difference,
      betterOption: difference > 0 ? 'hourly' : 'salary',
      hourlyRate: hourlyRate,
      salariedHourlyRate,
      weeklyPay
    };

    setComparison(results);

    addToHistory(`Hourly vs Salary: $${annualHourly.toLocaleString()} vs $${salaryEquivalent.toLocaleString()} (${results.betterOption} better by $${Math.abs(difference).toLocaleString()})`);
    
    toast({
      title: "Comparison Complete",
      description: `${results.betterOption === 'hourly' ? 'Hourly' : 'Salary'} is better by $${Math.abs(difference).toLocaleString()}`
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Salary Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert between salary formats, calculate raises, determine take-home pay, and compare hourly vs salary positions.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="convert" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="convert">Convert</TabsTrigger>
                <TabsTrigger value="raise">Raise</TabsTrigger>
                <TabsTrigger value="takehome">Take-Home</TabsTrigger>
                <TabsTrigger value="compare">Compare</TabsTrigger>
              </TabsList>

              <TabsContent value="convert">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-6 w-6" />
                      Salary Conversion Calculator
                    </CardTitle>
                    <CardDescription>Convert between annual, monthly, weekly, daily, and hourly pay</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Salary Amount</Label>
                        <Input
                          type="number"
                          value={salary}
                          onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
                          placeholder="Enter salary amount"
                        />
                      </div>
                      <div>
                        <Label>Pay Period</Label>
                        <Select value={payPeriod} onValueChange={setPayPeriod}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="annual">Annual</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Hours per Week</Label>
                        <Input
                          type="number"
                          value={hoursPerWeek}
                          onChange={(e) => setHoursPerWeek(parseFloat(e.target.value) || 0)}
                          placeholder="Hours worked per week"
                        />
                      </div>
                      <div>
                        <Label>Weeks per Year</Label>
                        <Input
                          type="number"
                          value={weeksPerYear}
                          onChange={(e) => setWeeksPerYear(parseFloat(e.target.value) || 0)}
                          placeholder="Working weeks per year"
                        />
                      </div>
                    </div>

                    <Button onClick={convertSalary} className="w-full">
                      Convert Salary
                    </Button>

                    {conversions && (
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-blue-600">
                              ${conversions.annual.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Annual</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-600">
                              ${conversions.monthly.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Monthly</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-600">
                              ${conversions.weekly.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Weekly</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-600">
                              ${conversions.daily.toFixed(0)}
                            </div>
                            <div className="text-sm text-gray-600">Daily</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-600">
                              ${conversions.hourly.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Hourly</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="raise">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6" />
                      Salary Raise Calculator
                    </CardTitle>
                    <CardDescription>Calculate the impact of a salary raise</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Current Salary ($)</Label>
                        <Input
                          type="number"
                          value={currentSalary}
                          onChange={(e) => setCurrentSalary(parseFloat(e.target.value) || 0)}
                          placeholder="Current annual salary"
                        />
                      </div>
                      <div>
                        <Label>Raise Type</Label>
                        <Select value={raiseType} onValueChange={setRaiseType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="amount">Dollar Amount</SelectItem>
                            <SelectItem value="percentage">Percentage</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label>
                          Raise {raiseType === 'amount' ? 'Amount ($)' : 'Percentage (%)'}
                        </Label>
                        <Input
                          type="number"
                          step={raiseType === 'amount' ? '1' : '0.1'}
                          value={raiseAmount}
                          onChange={(e) => setRaiseAmount(parseFloat(e.target.value) || 0)}
                          placeholder={raiseType === 'amount' ? 'Dollar amount' : 'Percentage'}
                        />
                      </div>
                    </div>

                    <Button onClick={calculateRaise} className="w-full">
                      Calculate Raise
                    </Button>

                    {raiseResults && (
                      <div className="bg-green-50 p-6 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              ${raiseResults.newSalary.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">New Salary</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              +{raiseResults.percentageIncrease.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">Percentage Increase</div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-green-200 text-center">
                          <div className="text-sm text-gray-600">
                            Monthly increase: ${raiseResults.monthlyIncrease.toFixed(0)}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="takehome">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-6 w-6" />
                      Take-Home Pay Calculator
                    </CardTitle>
                    <CardDescription>Calculate net salary after taxes and deductions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Gross Salary ($)</Label>
                        <Input
                          type="number"
                          value={grossSalary}
                          onChange={(e) => setGrossSalary(parseFloat(e.target.value) || 0)}
                          placeholder="Annual gross salary"
                        />
                      </div>
                      <div>
                        <Label>Federal Tax Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={federalTaxRate}
                          onChange={(e) => setFederalTaxRate(parseFloat(e.target.value) || 0)}
                          placeholder="Federal tax rate"
                        />
                      </div>
                      <div>
                        <Label>State Tax Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={stateTaxRate}
                          onChange={(e) => setStateTaxRate(parseFloat(e.target.value) || 0)}
                          placeholder="State tax rate"
                        />
                      </div>
                      <div>
                        <Label>Other Deductions ($)</Label>
                        <Input
                          type="number"
                          value={deductions}
                          onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)}
                          placeholder="401k, insurance, etc."
                        />
                      </div>
                    </div>

                    <Button onClick={calculateTakeHome} className="w-full">
                      Calculate Take-Home Pay
                    </Button>

                    {takeHome && (
                      <div className="space-y-4">
                        <div className="bg-green-50 p-6 rounded-lg text-center">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            ${takeHome.netSalary.toLocaleString()}
                          </div>
                          <div className="text-gray-600">Annual Take-Home Pay</div>
                          <div className="text-sm text-gray-500 mt-2">
                            {takeHome.takeHomePercentage.toFixed(1)}% of gross salary
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="bg-gray-50 p-4 rounded">
                            <div className="font-bold">${takeHome.monthlyNet.toFixed(0)}</div>
                            <div className="text-sm text-gray-600">Monthly</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded">
                            <div className="font-bold">${takeHome.weeklyNet.toFixed(0)}</div>
                            <div className="text-sm text-gray-600">Weekly</div>
                          </div>
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
                      <Calendar className="h-6 w-6" />
                      Hourly vs Salary Comparison
                    </CardTitle>
                    <CardDescription>Compare hourly and salary compensation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Hourly Rate ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                          placeholder="Hourly pay rate"
                        />
                      </div>
                      <div>
                        <Label>Overtime Rate ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={overtimeRate}
                          onChange={(e) => setOvertimeRate(parseFloat(e.target.value) || 0)}
                          placeholder="Overtime hourly rate"
                        />
                      </div>
                      <div>
                        <Label>Hours per Week</Label>
                        <Input
                          type="number"
                          value={hoursPerWeek}
                          onChange={(e) => setHoursPerWeek(parseFloat(e.target.value) || 0)}
                          placeholder="Total hours per week"
                        />
                      </div>
                      <div>
                        <Label>Salary Equivalent ($)</Label>
                        <Input
                          type="number"
                          value={salaryEquivalent}
                          onChange={(e) => setSalaryEquivalent(parseFloat(e.target.value) || 0)}
                          placeholder="Equivalent salary offer"
                        />
                      </div>
                    </div>

                    <Button onClick={compareHourlySalary} className="w-full">
                      Compare Options
                    </Button>

                    {comparison && (
                      <div className="bg-purple-50 p-6 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              ${comparison.hourlyAnnual.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Hourly Annual</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              ${comparison.salaryAnnual.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Salary Annual</div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-purple-200 text-center">
                          <div className="text-lg font-semibold">
                            {comparison.betterOption === 'hourly' ? 'Hourly' : 'Salary'} is better by ${Math.abs(comparison.difference).toLocaleString()}
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
                <CardDescription>Recent salary calculations</CardDescription>
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

export default SalaryCalculator;
