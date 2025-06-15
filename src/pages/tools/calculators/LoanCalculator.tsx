
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Calculator, TrendingUp, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoanCalculation {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: {
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(250000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [extraPayment, setExtraPayment] = useState(0);
  const [result, setResult] = useState<LoanCalculation | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  // Comparison calculations
  const [comparison, setComparison] = useState({
    scenario1: { rate: 6.5, term: 30, payment: 0, totalInterest: 0 },
    scenario2: { rate: 5.5, term: 30, payment: 0, totalInterest: 0 },
    scenario3: { rate: 6.5, term: 15, payment: 0, totalInterest: 0 }
  });

  const { toast } = useToast();

  const calculateLoan = (): LoanCalculation => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly payment using the formula
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    let balance = principal;
    const amortizationSchedule = [];
    let totalInterestPaid = 0;

    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = balance * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment + extraPayment;
      
      // Don't overpay the remaining balance
      if (principalPayment > balance) {
        principalPayment = balance;
      }

      balance -= principalPayment;
      totalInterestPaid += interestPayment;

      amortizationSchedule.push({
        payment: month,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });

      // If balance is paid off, stop calculating
      if (balance <= 0) break;
    }

    return {
      monthlyPayment: monthlyPayment + extraPayment,
      totalPayment: amortizationSchedule.reduce((sum, payment) => 
        sum + payment.principal + payment.interest, 0),
      totalInterest: totalInterestPaid,
      amortizationSchedule
    };
  };

  const calculateComparison = () => {
    const scenarios = [
      { rate: comparison.scenario1.rate, term: comparison.scenario1.term },
      { rate: comparison.scenario2.rate, term: comparison.scenario2.term },
      { rate: comparison.scenario3.rate, term: comparison.scenario3.term }
    ];

    const results = scenarios.map(scenario => {
      const monthlyRate = scenario.rate / 100 / 12;
      const numberOfPayments = scenario.term * 12;
      
      const payment = loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      const totalPayment = payment * numberOfPayments;
      const totalInterest = totalPayment - loanAmount;

      return {
        payment: payment,
        totalInterest: totalInterest
      };
    });

    setComparison({
      scenario1: { ...comparison.scenario1, ...results[0] },
      scenario2: { ...comparison.scenario2, ...results[1] },
      scenario3: { ...comparison.scenario3, ...results[2] }
    });
  };

  const handleCalculate = () => {
    try {
      const calculation = calculateLoan();
      setResult(calculation);
      
      toast({
        title: "Loan Calculated",
        description: `Monthly payment: $${calculation.monthlyPayment.toFixed(2)}`
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Please check your input values",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    calculateComparison();
  }, [loanAmount, comparison.scenario1.rate, comparison.scenario1.term, 
      comparison.scenario2.rate, comparison.scenario2.term,
      comparison.scenario3.rate, comparison.scenario3.term]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPayoffDate = () => {
    if (!result) return null;
    const months = result.amortizationSchedule.length;
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Loan Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate loan payments, compare scenarios, and generate detailed amortization schedules for informed financial decisions.
          </p>
        </div>
        
        <Tabs defaultValue="calculator" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">Loan Calculator</TabsTrigger>
            <TabsTrigger value="comparison">Compare Scenarios</TabsTrigger>
            <TabsTrigger value="schedule">Amortization Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-6 w-6" />
                    Loan Details
                  </CardTitle>
                  <CardDescription>Enter your loan information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Loan Amount ($)</Label>
                      <Input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                        placeholder="Enter loan amount"
                      />
                    </div>
                    <div>
                      <Label>Interest Rate (%)</Label>
                      <Input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                        placeholder="Enter interest rate"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Loan Term (years)</Label>
                      <Input
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(parseInt(e.target.value) || 0)}
                        placeholder="Enter loan term"
                      />
                    </div>
                    <div>
                      <Label>Payment Frequency</Label>
                      <Select value={paymentFrequency} onValueChange={setPaymentFrequency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Extra Monthly Payment ($)</Label>
                    <Input
                      type="number"
                      value={extraPayment}
                      onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                      placeholder="Optional extra payment"
                    />
                  </div>

                  <Button onClick={handleCalculate} className="w-full">
                    Calculate Loan
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6" />
                    Loan Summary
                  </CardTitle>
                  <CardDescription>Your loan calculation results</CardDescription>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <div className="text-sm text-gray-600">Monthly Payment</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(result.monthlyPayment)}
                          </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <div className="text-sm text-gray-600">Total Interest</div>
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(result.totalInterest)}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Total Payment:</span>
                            <span className="font-semibold ml-2">
                              {formatCurrency(result.totalPayment)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Payoff Date:</span>
                            <span className="font-semibold ml-2">
                              {getPayoffDate()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Payments:</span>
                            <span className="font-semibold ml-2">
                              {result.amortizationSchedule.length} payments
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Interest Rate:</span>
                            <span className="font-semibold ml-2">
                              {interestRate}% APR
                            </span>
                          </div>
                        </div>
                      </div>

                      {extraPayment > 0 && (
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-yellow-800 mb-2">Extra Payment Impact</h4>
                          <div className="text-sm text-yellow-700">
                            <div>Extra payment reduces loan term by approximately {Math.max(0, (loanTerm * 12) - result.amortizationSchedule.length)} payments</div>
                            <div>Interest savings: {formatCurrency((loanAmount * (interestRate/100) * loanTerm) - result.totalInterest)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p>Click "Calculate Loan" to see your results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Scenario Comparison
                </CardTitle>
                <CardDescription>Compare different loan scenarios for {formatCurrency(loanAmount)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Scenario 1</h3>
                    <div>
                      <Label>Interest Rate (%)</Label>
                      <Input
                        type="number"
                        value={comparison.scenario1.rate}
                        onChange={(e) => setComparison(prev => ({
                          ...prev,
                          scenario1: { ...prev.scenario1, rate: parseFloat(e.target.value) || 0 }
                        }))}
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label>Term (years)</Label>
                      <Input
                        type="number"
                        value={comparison.scenario1.term}
                        onChange={(e) => setComparison(prev => ({
                          ...prev,
                          scenario1: { ...prev.scenario1, term: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-600">Monthly Payment</div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(comparison.scenario1.payment)}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">Total Interest</div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(comparison.scenario1.totalInterest)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Scenario 2</h3>
                    <div>
                      <Label>Interest Rate (%)</Label>
                      <Input
                        type="number"
                        value={comparison.scenario2.rate}
                        onChange={(e) => setComparison(prev => ({
                          ...prev,
                          scenario2: { ...prev.scenario2, rate: parseFloat(e.target.value) || 0 }
                        }))}
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label>Term (years)</Label>
                      <Input
                        type="number"
                        value={comparison.scenario2.term}
                        onChange={(e) => setComparison(prev => ({
                          ...prev,
                          scenario2: { ...prev.scenario2, term: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-600">Monthly Payment</div>
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(comparison.scenario2.payment)}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">Total Interest</div>
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(comparison.scenario2.totalInterest)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Scenario 3</h3>
                    <div>
                      <Label>Interest Rate (%)</Label>
                      <Input
                        type="number"
                        value={comparison.scenario3.rate}
                        onChange={(e) => setComparison(prev => ({
                          ...prev,
                          scenario3: { ...prev.scenario3, rate: parseFloat(e.target.value) || 0 }
                        }))}
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label>Term (years)</Label>
                      <Input
                        type="number"
                        value={comparison.scenario3.term}
                        onChange={(e) => setComparison(prev => ({
                          ...prev,
                          scenario3: { ...prev.scenario3, term: parseInt(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-600">Monthly Payment</div>
                      <div className="text-lg font-bold text-purple-600">
                        {formatCurrency(comparison.scenario3.payment)}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">Total Interest</div>
                      <div className="text-lg font-bold text-purple-600">
                        {formatCurrency(comparison.scenario3.totalInterest)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Comparison Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Lowest Payment:</span>
                      <span className="font-semibold ml-2">
                        {formatCurrency(Math.min(comparison.scenario1.payment, comparison.scenario2.payment, comparison.scenario3.payment))}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Lowest Total Interest:</span>
                      <span className="font-semibold ml-2">
                        {formatCurrency(Math.min(comparison.scenario1.totalInterest, comparison.scenario2.totalInterest, comparison.scenario3.totalInterest))}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Interest Difference:</span>
                      <span className="font-semibold ml-2">
                        {formatCurrency(Math.max(comparison.scenario1.totalInterest, comparison.scenario2.totalInterest, comparison.scenario3.totalInterest) - 
                                       Math.min(comparison.scenario1.totalInterest, comparison.scenario2.totalInterest, comparison.scenario3.totalInterest))}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Amortization Schedule
                </CardTitle>
                <CardDescription>Detailed payment breakdown over the loan term</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Payment Schedule ({result.amortizationSchedule.length} payments)
                      </h3>
                      <Button
                        onClick={() => setShowFullSchedule(!showFullSchedule)}
                        variant="outline"
                      >
                        {showFullSchedule ? 'Show Summary' : 'Show All Payments'}
                      </Button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="p-2 text-left">Payment #</th>
                            <th className="p-2 text-right">Principal</th>
                            <th className="p-2 text-right">Interest</th>
                            <th className="p-2 text-right">Total Payment</th>
                            <th className="p-2 text-right">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(showFullSchedule 
                            ? result.amortizationSchedule 
                            : result.amortizationSchedule.slice(0, 12)
                          ).map((payment, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="p-2">{payment.payment}</td>
                              <td className="p-2 text-right">
                                {formatCurrency(payment.principal)}
                              </td>
                              <td className="p-2 text-right">
                                {formatCurrency(payment.interest)}
                              </td>
                              <td className="p-2 text-right">
                                {formatCurrency(payment.principal + payment.interest)}
                              </td>
                              <td className="p-2 text-right">
                                {formatCurrency(payment.balance)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {!showFullSchedule && result.amortizationSchedule.length > 12 && (
                      <p className="text-sm text-gray-600 text-center">
                        Showing first 12 payments of {result.amortizationSchedule.length} total payments
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Calculate a loan first to see the amortization schedule</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LoanCalculator;
