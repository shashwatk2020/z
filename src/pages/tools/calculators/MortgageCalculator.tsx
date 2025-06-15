
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, Calculator, DollarSign, TrendingUp, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MortgageCalculator = () => {
  // Basic mortgage calculation
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [downPayment, setDownPayment] = useState(60000);
  const [propertyTax, setPropertyTax] = useState(3000);
  const [insurance, setInsurance] = useState(1200);
  const [pmi, setPmi] = useState(150);

  // Refinance calculator
  const [currentBalance, setCurrentBalance] = useState(250000);
  const [currentRate, setCurrentRate] = useState(7.2);
  const [newRate, setNewRate] = useState(5.8);
  const [refinanceCosts, setRefinanceCosts] = useState(5000);
  const [remainingYears, setRemainingYears] = useState(25);

  // Extra payments
  const [extraPayment, setExtraPayment] = useState(200);
  const [extraPaymentType, setExtraPaymentType] = useState('monthly');

  // Results
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [refinanceSavings, setRefinanceSavings] = useState<number | null>(null);
  const [payoffTime, setPayoffTime] = useState<{years: number, months: number} | null>(null);

  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const calculateMortgage = () => {
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;

    const monthlyPrincipalInterest = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    const monthlyTaxInsurance = (propertyTax + insurance) / 12 + pmi;
    const totalMonthly = monthlyPrincipalInterest + monthlyTaxInsurance;
    const totalPaid = monthlyPrincipalInterest * totalPayments;
    const totalInt = totalPaid - principal;

    setMonthlyPayment(totalMonthly);
    setTotalInterest(totalInt);
    setTotalPayment(totalPaid + downPayment);

    addToHistory(`Mortgage: $${loanAmount.toLocaleString()} at ${interestRate}% for ${loanTerm}Y → $${totalMonthly.toFixed(2)}/mo`);
    
    toast({
      title: "Mortgage Calculated",
      description: `Monthly payment: $${totalMonthly.toFixed(2)}`
    });
  };

  const calculateRefinance = () => {
    const currentMonthlyRate = currentRate / 100 / 12;
    const newMonthlyRate = newRate / 100 / 12;
    const paymentsRemaining = remainingYears * 12;

    const currentPayment = currentBalance * 
      (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, paymentsRemaining)) / 
      (Math.pow(1 + currentMonthlyRate, paymentsRemaining) - 1);

    const newPayment = currentBalance * 
      (newMonthlyRate * Math.pow(1 + newMonthlyRate, paymentsRemaining)) / 
      (Math.pow(1 + newMonthlyRate, paymentsRemaining) - 1);

    const monthlySavings = currentPayment - newPayment;
    const totalSavings = (monthlySavings * paymentsRemaining) - refinanceCosts;
    const breakEvenMonths = refinanceCosts / monthlySavings;

    setRefinanceSavings(totalSavings);

    addToHistory(`Refinance: ${currentRate}% to ${newRate}% → Save $${monthlySavings.toFixed(2)}/mo, break-even: ${breakEvenMonths.toFixed(1)} months`);
    
    toast({
      title: "Refinance Analysis Complete",
      description: `Monthly savings: $${monthlySavings.toFixed(2)}, Total savings: $${totalSavings.toFixed(2)}`
    });
  };

  const calculateExtraPayments = () => {
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const regularPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, loanTerm * 12)) / 
      (Math.pow(1 + monthlyRate, loanTerm * 12) - 1);

    let balance = principal;
    let months = 0;
    const extra = extraPaymentType === 'yearly' ? extraPayment / 12 : extraPayment;

    while (balance > 0 && months < loanTerm * 12) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = regularPayment - interestPayment + extra;
      balance -= principalPayment;
      months++;

      if (balance <= 0) break;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    const timeSaved = (loanTerm * 12) - months;

    setPayoffTime({ years, months: remainingMonths });

    addToHistory(`Extra payments of $${extraPayment} ${extraPaymentType} → Payoff in ${years}Y ${remainingMonths}M (${timeSaved} months saved)`);
    
    toast({
      title: "Extra Payment Analysis",
      description: `Payoff time: ${years} years, ${remainingMonths} months`
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mortgage Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate mortgage payments, analyze refinancing options, and see the impact of extra payments on your loan.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="mortgage" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
                <TabsTrigger value="refinance">Refinance</TabsTrigger>
                <TabsTrigger value="extra">Extra Payments</TabsTrigger>
              </TabsList>

              <TabsContent value="mortgage">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-6 w-6" />
                      Mortgage Payment Calculator
                    </CardTitle>
                    <CardDescription>Calculate your monthly mortgage payment and total cost</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Home Price ($)</Label>
                        <Input
                          type="number"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                          placeholder="Enter home price"
                        />
                      </div>
                      <div>
                        <Label>Down Payment ($)</Label>
                        <Input
                          type="number"
                          value={downPayment}
                          onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                          placeholder="Enter down payment"
                        />
                      </div>
                      <div>
                        <Label>Interest Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={interestRate}
                          onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                          placeholder="Enter interest rate"
                        />
                      </div>
                      <div>
                        <Label>Loan Term (Years)</Label>
                        <Select value={loanTerm.toString()} onValueChange={(value) => setLoanTerm(parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 years</SelectItem>
                            <SelectItem value="20">20 years</SelectItem>
                            <SelectItem value="30">30 years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Property Tax (Annual $)</Label>
                        <Input
                          type="number"
                          value={propertyTax}
                          onChange={(e) => setPropertyTax(parseFloat(e.target.value) || 0)}
                          placeholder="Enter annual property tax"
                        />
                      </div>
                      <div>
                        <Label>Home Insurance (Annual $)</Label>
                        <Input
                          type="number"
                          value={insurance}
                          onChange={(e) => setInsurance(parseFloat(e.target.value) || 0)}
                          placeholder="Enter annual insurance"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>PMI (Monthly $)</Label>
                      <Input
                        type="number"
                        value={pmi}
                        onChange={(e) => setPmi(parseFloat(e.target.value) || 0)}
                        placeholder="Enter monthly PMI"
                      />
                    </div>

                    <Button onClick={calculateMortgage} className="w-full">
                      Calculate Mortgage
                    </Button>

                    {monthlyPayment !== null && (
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="grid md:grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              ${monthlyPayment.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Monthly Payment</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              ${totalInterest?.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Total Interest</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              ${totalPayment?.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Total Cost</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="refinance">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6" />
                      Refinance Calculator
                    </CardTitle>
                    <CardDescription>Analyze refinancing benefits and break-even point</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Current Loan Balance ($)</Label>
                        <Input
                          type="number"
                          value={currentBalance}
                          onChange={(e) => setCurrentBalance(parseFloat(e.target.value) || 0)}
                          placeholder="Current balance"
                        />
                      </div>
                      <div>
                        <Label>Current Interest Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={currentRate}
                          onChange={(e) => setCurrentRate(parseFloat(e.target.value) || 0)}
                          placeholder="Current rate"
                        />
                      </div>
                      <div>
                        <Label>New Interest Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newRate}
                          onChange={(e) => setNewRate(parseFloat(e.target.value) || 0)}
                          placeholder="New rate"
                        />
                      </div>
                      <div>
                        <Label>Remaining Years</Label>
                        <Input
                          type="number"
                          value={remainingYears}
                          onChange={(e) => setRemainingYears(parseFloat(e.target.value) || 0)}
                          placeholder="Years remaining"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Refinancing Costs ($)</Label>
                        <Input
                          type="number"
                          value={refinanceCosts}
                          onChange={(e) => setRefinanceCosts(parseFloat(e.target.value) || 0)}
                          placeholder="Total refinancing costs"
                        />
                      </div>
                    </div>

                    <Button onClick={calculateRefinance} className="w-full">
                      Analyze Refinance
                    </Button>

                    {refinanceSavings !== null && (
                      <div className="bg-green-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          ${refinanceSavings.toFixed(2)}
                        </div>
                        <div className="text-gray-600">
                          Total Savings Over Loan Term
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="extra">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-6 w-6" />
                      Extra Payment Calculator
                    </CardTitle>
                    <CardDescription>See how extra payments reduce your loan term</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Extra Payment Amount ($)</Label>
                        <Input
                          type="number"
                          value={extraPayment}
                          onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                          placeholder="Extra payment amount"
                        />
                      </div>
                      <div>
                        <Label>Payment Frequency</Label>
                        <Select value={extraPaymentType} onValueChange={setExtraPaymentType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={calculateExtraPayments} className="w-full">
                      Calculate Impact
                    </Button>

                    {payoffTime && (
                      <div className="bg-orange-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                          {payoffTime.years} Years, {payoffTime.months} Months
                        </div>
                        <div className="text-gray-600">
                          New Payoff Time
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
                <CardDescription>Recent mortgage calculations</CardDescription>
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

export default MortgageCalculator;
