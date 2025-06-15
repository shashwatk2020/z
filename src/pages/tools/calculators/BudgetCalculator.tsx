
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Plus, Minus, Wallet, Target, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BudgetCalculator = () => {
  // Income
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [additionalIncome, setAdditionalIncome] = useState(0);

  // Expenses
  const [expenses, setExpenses] = useState([
    { category: 'Housing', amount: 1500, type: 'fixed' },
    { category: 'Transportation', amount: 400, type: 'variable' },
    { category: 'Food', amount: 600, type: 'variable' },
    { category: 'Utilities', amount: 200, type: 'fixed' },
    { category: 'Insurance', amount: 300, type: 'fixed' },
    { category: 'Entertainment', amount: 300, type: 'variable' }
  ]);

  // Savings goals
  const [savingsGoals, setSavingsGoals] = useState([
    { name: 'Emergency Fund', target: 10000, current: 5000, priority: 'high' },
    { name: 'Vacation', target: 3000, current: 1200, priority: 'medium' },
    { name: 'Car', target: 15000, current: 8000, priority: 'high' }
  ]);

  // 50/30/20 rule inputs
  const [fiftyThirtyTwentyIncome, setFiftyThirtyTwentyIncome] = useState(5000);

  // Results
  const [budgetSummary, setBudgetSummary] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const addExpense = () => {
    setExpenses([...expenses, { category: '', amount: 0, type: 'variable' }]);
  };

  const removeExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const updateExpense = (index: number, field: string, value: any) => {
    const updated = expenses.map((expense, i) => 
      i === index ? { ...expense, [field]: value } : expense
    );
    setExpenses(updated);
  };

  const addSavingsGoal = () => {
    setSavingsGoals([...savingsGoals, { name: '', target: 0, current: 0, priority: 'medium' }]);
  };

  const removeSavingsGoal = (index: number) => {
    setSavingsGoals(savingsGoals.filter((_, i) => i !== index));
  };

  const updateSavingsGoal = (index: number, field: string, value: any) => {
    const updated = savingsGoals.map((goal, i) => 
      i === index ? { ...goal, [field]: value } : goal
    );
    setSavingsGoals(updated);
  };

  const calculateBudget = () => {
    const totalIncome = monthlyIncome + additionalIncome;
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const fixedExpenses = expenses.filter(exp => exp.type === 'fixed').reduce((sum, exp) => sum + exp.amount, 0);
    const variableExpenses = expenses.filter(exp => exp.type === 'variable').reduce((sum, exp) => sum + exp.amount, 0);
    
    const remainingMoney = totalIncome - totalExpenses;
    const expenseRatio = (totalExpenses / totalIncome) * 100;
    
    // Calculate savings needed for goals
    const totalSavingsNeeded = savingsGoals.reduce((sum, goal) => sum + (goal.target - goal.current), 0);
    
    const summary = {
      totalIncome,
      totalExpenses,
      fixedExpenses,
      variableExpenses,
      remainingMoney,
      expenseRatio,
      totalSavingsNeeded,
      expensesByCategory: expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {} as Record<string, number>)
    };

    setBudgetSummary(summary);

    // Generate recommendations
    const newRecommendations = [];
    if (remainingMoney < 0) {
      newRecommendations.push("You're overspending. Consider reducing variable expenses.");
    }
    if (expenseRatio > 80) {
      newRecommendations.push("Your expenses are high. Aim for 70-80% of income.");
    }
    if (remainingMoney > 0 && remainingMoney < totalIncome * 0.2) {
      newRecommendations.push("Try to save at least 20% of your income.");
    }
    if (fixedExpenses > totalIncome * 0.5) {
      newRecommendations.push("Fixed expenses are high. Consider reducing housing or insurance costs.");
    }

    setRecommendations(newRecommendations);

    addToHistory(`Budget: $${totalIncome.toLocaleString()} income - $${totalExpenses.toLocaleString()} expenses = $${remainingMoney.toLocaleString()} remaining`);
    
    toast({
      title: "Budget Calculated",
      description: remainingMoney >= 0 ? 
        `You have $${remainingMoney.toLocaleString()} remaining` : 
        `You're overspending by $${Math.abs(remainingMoney).toLocaleString()}`
    });
  };

  const calculate502020 = () => {
    const needs = fiftyThirtyTwentyIncome * 0.5;
    const wants = fiftyThirtyTwentyIncome * 0.3;
    const savings = fiftyThirtyTwentyIncome * 0.2;

    addToHistory(`50/30/20 Rule: $${fiftyThirtyTwentyIncome.toLocaleString()} → Needs: $${needs.toFixed(0)}, Wants: $${wants.toFixed(0)}, Savings: $${savings.toFixed(0)}`);
    
    toast({
      title: "50/30/20 Rule Applied",
      description: `Needs: $${needs.toFixed(0)}, Wants: $${wants.toFixed(0)}, Savings: $${savings.toFixed(0)}`
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Budget Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create and manage your budget, track expenses, set savings goals, and get personalized recommendations.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="budget" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="budget">Budget Planner</TabsTrigger>
                <TabsTrigger value="goals">Savings Goals</TabsTrigger>
                <TabsTrigger value="rules">Budget Rules</TabsTrigger>
              </TabsList>

              <TabsContent value="budget">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-6 w-6" />
                      Monthly Budget Planner
                    </CardTitle>
                    <CardDescription>Track your income and expenses to create a balanced budget</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Monthly Income ($)</Label>
                        <Input
                          type="number"
                          value={monthlyIncome}
                          onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                          placeholder="Primary income"
                        />
                      </div>
                      <div>
                        <Label>Additional Income ($)</Label>
                        <Input
                          type="number"
                          value={additionalIncome}
                          onChange={(e) => setAdditionalIncome(parseFloat(e.target.value) || 0)}
                          placeholder="Side income, bonuses, etc."
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <Label className="text-lg font-semibold">Monthly Expenses</Label>
                        <Button onClick={addExpense} size="sm" variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Expense
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {expenses.map((expense, index) => (
                          <div key={index} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-4">
                              <Input
                                placeholder="Category"
                                value={expense.category}
                                onChange={(e) => updateExpense(index, 'category', e.target.value)}
                              />
                            </div>
                            <div className="col-span-3">
                              <Input
                                type="number"
                                placeholder="Amount"
                                value={expense.amount}
                                onChange={(e) => updateExpense(index, 'amount', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div className="col-span-3">
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={expense.type}
                                onChange={(e) => updateExpense(index, 'type', e.target.value)}
                              >
                                <option value="fixed">Fixed</option>
                                <option value="variable">Variable</option>
                              </select>
                            </div>
                            <div className="col-span-2">
                              <Button 
                                onClick={() => removeExpense(index)} 
                                size="sm" 
                                variant="outline"
                                className="w-full"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button onClick={calculateBudget} className="w-full">
                      Calculate Budget
                    </Button>

                    {budgetSummary && (
                      <div className="space-y-4">
                        <div className={`p-6 rounded-lg ${budgetSummary.remainingMoney >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                          <div className="grid md:grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold text-blue-600">
                                ${budgetSummary.totalIncome.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">Total Income</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-red-600">
                                ${budgetSummary.totalExpenses.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">Total Expenses</div>
                            </div>
                            <div>
                              <div className={`text-2xl font-bold ${budgetSummary.remainingMoney >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${Math.abs(budgetSummary.remainingMoney).toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">
                                {budgetSummary.remainingMoney >= 0 ? 'Remaining' : 'Overspending'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {recommendations.length > 0 && (
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Recommendations:</h4>
                            <ul className="space-y-1">
                              {recommendations.map((rec, index) => (
                                <li key={index} className="text-sm">• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="goals">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-6 w-6" />
                      Savings Goals Tracker
                    </CardTitle>
                    <CardDescription>Set and track your financial savings goals</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-semibold">Savings Goals</Label>
                      <Button onClick={addSavingsGoal} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Goal
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {savingsGoals.map((goal, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <Label>Goal Name</Label>
                              <Input
                                placeholder="Goal name"
                                value={goal.name}
                                onChange={(e) => updateSavingsGoal(index, 'name', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Target Amount ($)</Label>
                              <Input
                                type="number"
                                placeholder="Target"
                                value={goal.target}
                                onChange={(e) => updateSavingsGoal(index, 'target', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div>
                              <Label>Current Amount ($)</Label>
                              <Input
                                type="number"
                                placeholder="Current"
                                value={goal.current}
                                onChange={(e) => updateSavingsGoal(index, 'current', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div>
                              <Label>Priority</Label>
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={goal.priority}
                                onChange={(e) => updateSavingsGoal(index, 'priority', e.target.value)}
                              >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                              </select>
                            </div>
                          </div>
                          
                          {goal.target > 0 && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress: {((goal.current / goal.target) * 100).toFixed(1)}%</span>
                                <span>Remaining: ${(goal.target - goal.current).toLocaleString()}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          <Button 
                            onClick={() => removeSavingsGoal(index)} 
                            size="sm" 
                            variant="outline"
                            className="mt-3"
                          >
                            <Minus className="h-4 w-4 mr-2" />
                            Remove Goal
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rules">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-6 w-6" />
                      Budget Rules & Guidelines
                    </CardTitle>
                    <CardDescription>Apply popular budgeting rules to your finances</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">50/30/20 Rule</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Allocate 50% to needs, 30% to wants, and 20% to savings and debt repayment.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label>Monthly Income ($)</Label>
                          <Input
                            type="number"
                            value={fiftyThirtyTwentyIncome}
                            onChange={(e) => setFiftyThirtyTwentyIncome(parseFloat(e.target.value) || 0)}
                            placeholder="Monthly income"
                          />
                        </div>
                      </div>
                      
                      <Button onClick={calculate502020} className="mb-4">
                        Apply 50/30/20 Rule
                      </Button>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded text-center">
                          <div className="text-xl font-bold text-blue-600">
                            ${(fiftyThirtyTwentyIncome * 0.5).toFixed(0)}
                          </div>
                          <div className="text-sm text-gray-600">Needs (50%)</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded text-center">
                          <div className="text-xl font-bold text-green-600">
                            ${(fiftyThirtyTwentyIncome * 0.3).toFixed(0)}
                          </div>
                          <div className="text-sm text-gray-600">Wants (30%)</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded text-center">
                          <div className="text-xl font-bold text-purple-600">
                            ${(fiftyThirtyTwentyIncome * 0.2).toFixed(0)}
                          </div>
                          <div className="text-sm text-gray-600">Savings (20%)</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Other Budget Guidelines:</h4>
                      <div className="text-sm space-y-1">
                        <div>• Housing: No more than 28-30% of gross income</div>
                        <div>• Transportation: 15-20% of income</div>
                        <div>• Food: 10-15% of income</div>
                        <div>• Savings: At least 20% of income</div>
                        <div>• Emergency fund: 3-6 months of expenses</div>
                        <div>• Debt payments: No more than 36% of income</div>
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
                <CardDescription>Recent budget calculations</CardDescription>
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
                <CardTitle>Budget Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>• Track expenses for a month before creating a budget</div>
                  <div>• Use the envelope method for variable expenses</div>
                  <div>• Review and adjust your budget monthly</div>
                  <div>• Automate savings and bill payments</div>
                  <div>• Build an emergency fund first</div>
                  <div>• Include fun money in your budget</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BudgetCalculator;
