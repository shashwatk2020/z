
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, History, Function } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AlgebraCalculator = () => {
  // Linear equation ax + b = 0
  const [linearA, setLinearA] = useState(2);
  const [linearB, setLinearB] = useState(-6);
  const [linearSolution, setLinearSolution] = useState<number | null>(null);

  // Quadratic equation ax² + bx + c = 0
  const [quadA, setQuadA] = useState(1);
  const [quadB, setQuadB] = useState(-5);
  const [quadC, setQuadC] = useState(6);
  const [quadSolutions, setQuadSolutions] = useState<{x1: number | null, x2: number | null} | null>(null);
  const [quadDiscriminant, setQuadDiscriminant] = useState<number | null>(null);

  // System of equations
  const [systemA1, setSystemA1] = useState(2);
  const [systemB1, setSystemB1] = useState(3);
  const [systemC1, setSystemC1] = useState(7);
  const [systemA2, setSystemA2] = useState(1);
  const [systemB2, setSystemB2] = useState(-1);
  const [systemC2, setSystemC2] = useState(1);
  const [systemSolution, setSystemSolution] = useState<{x: number | null, y: number | null} | null>(null);

  // Expression evaluator
  const [expression, setExpression] = useState('2x + 3');
  const [xValue, setXValue] = useState(5);
  const [expressionResult, setExpressionResult] = useState<number | null>(null);

  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const solveLinearEquation = () => {
    if (linearA === 0) {
      if (linearB === 0) {
        toast({
          title: "Infinite Solutions",
          description: "0 = 0 is always true",
        });
        setLinearSolution(null);
        addToHistory(`${linearA}x + ${linearB} = 0 → Infinite solutions`);
      } else {
        toast({
          title: "No Solution",
          description: `${linearB} ≠ 0`,
          variant: "destructive"
        });
        setLinearSolution(null);
        addToHistory(`${linearA}x + ${linearB} = 0 → No solution`);
      }
      return;
    }

    const solution = -linearB / linearA;
    setLinearSolution(solution);
    addToHistory(`${linearA}x + ${linearB} = 0 → x = ${solution.toFixed(4)}`);
    
    toast({
      title: "Linear Equation Solved",
      description: `x = ${solution.toFixed(4)}`
    });
  };

  const solveQuadraticEquation = () => {
    if (quadA === 0) {
      toast({
        title: "Error",
        description: "Coefficient 'a' cannot be zero for quadratic equation",
        variant: "destructive"
      });
      return;
    }

    const discriminant = quadB * quadB - 4 * quadA * quadC;
    setQuadDiscriminant(discriminant);

    if (discriminant < 0) {
      setQuadSolutions({ x1: null, x2: null });
      addToHistory(`${quadA}x² + ${quadB}x + ${quadC} = 0 → No real solutions (Δ = ${discriminant.toFixed(2)})`);
      toast({
        title: "No Real Solutions",
        description: `Discriminant = ${discriminant.toFixed(2)} < 0`,
        variant: "destructive"
      });
    } else if (discriminant === 0) {
      const x = -quadB / (2 * quadA);
      setQuadSolutions({ x1: x, x2: x });
      addToHistory(`${quadA}x² + ${quadB}x + ${quadC} = 0 → x = ${x.toFixed(4)} (double root)`);
      toast({
        title: "One Solution (Double Root)",
        description: `x = ${x.toFixed(4)}`
      });
    } else {
      const x1 = (-quadB + Math.sqrt(discriminant)) / (2 * quadA);
      const x2 = (-quadB - Math.sqrt(discriminant)) / (2 * quadA);
      setQuadSolutions({ x1, x2 });
      addToHistory(`${quadA}x² + ${quadB}x + ${quadC} = 0 → x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`);
      toast({
        title: "Two Solutions",
        description: `x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`
      });
    }
  };

  const solveSystemOfEquations = () => {
    // Cramer's rule: determinant method
    const det = systemA1 * systemB2 - systemA2 * systemB1;
    
    if (det === 0) {
      toast({
        title: "No Unique Solution",
        description: "System may have no solution or infinite solutions",
        variant: "destructive"
      });
      setSystemSolution({ x: null, y: null });
      addToHistory(`System: No unique solution (det = 0)`);
      return;
    }

    const x = (systemC1 * systemB2 - systemC2 * systemB1) / det;
    const y = (systemA1 * systemC2 - systemA2 * systemC1) / det;
    
    setSystemSolution({ x, y });
    addToHistory(`System: x = ${x.toFixed(4)}, y = ${y.toFixed(4)}`);
    
    toast({
      title: "System Solved",
      description: `x = ${x.toFixed(4)}, y = ${y.toFixed(4)}`
    });
  };

  const evaluateExpression = () => {
    try {
      // Simple expression parser for basic algebraic expressions
      let expr = expression.toLowerCase()
        .replace(/\s/g, '')
        .replace(/x/g, `(${xValue})`)
        .replace(/\^/g, '**');
      
      // Handle implicit multiplication (e.g., "2x" -> "2*x")
      expr = expr.replace(/(\d)(\()/g, '$1*$2');
      expr = expr.replace(/(\))(\d)/g, '$1*$2');
      expr = expr.replace(/(\d)([a-z])/g, '$1*$2');
      
      const result = eval(expr);
      setExpressionResult(result);
      addToHistory(`${expression} at x=${xValue} → ${result.toFixed(4)}`);
      
      toast({
        title: "Expression Evaluated",
        description: `Result: ${result.toFixed(4)}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid expression",
        variant: "destructive"
      });
    }
  };

  const quadraticFormula = quadA !== 0 ? {
    vertex: {
      x: -quadB / (2 * quadA),
      y: quadC - (quadB * quadB) / (4 * quadA)
    },
    axisOfSymmetry: -quadB / (2 * quadA),
    opensUpward: quadA > 0
  } : null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Algebra Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Solve linear equations, quadratic equations, systems of equations, and evaluate algebraic expressions with step-by-step solutions.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="linear" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="linear">Linear</TabsTrigger>
                <TabsTrigger value="quadratic">Quadratic</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="expression">Expression</TabsTrigger>
              </TabsList>

              <TabsContent value="linear">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Function className="h-6 w-6" />
                      Linear Equation Solver
                    </CardTitle>
                    <CardDescription>Solve equations of the form ax + b = 0</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                      <div>
                        <Label>Coefficient a</Label>
                        <Input
                          type="number"
                          value={linearA}
                          onChange={(e) => setLinearA(parseFloat(e.target.value) || 0)}
                          placeholder="Enter coefficient a"
                        />
                      </div>
                      <div>
                        <Label>Constant b</Label>
                        <Input
                          type="number"
                          value={linearB}
                          onChange={(e) => setLinearB(parseFloat(e.target.value) || 0)}
                          placeholder="Enter constant b"
                        />
                      </div>
                      <Button onClick={solveLinearEquation}>Solve</Button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-semibold mb-2">
                        {linearA}x + {linearB} = 0
                      </div>
                    </div>

                    {linearSolution !== null && (
                      <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          x = {linearSolution.toFixed(4)}
                        </div>
                        <div className="text-gray-600">
                          Verification: {linearA} × {linearSolution.toFixed(4)} + {linearB} = {(linearA * linearSolution + linearB).toFixed(4)}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quadratic">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Function className="h-6 w-6" />
                      Quadratic Equation Solver
                    </CardTitle>
                    <CardDescription>Solve equations of the form ax² + bx + c = 0</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                      <div>
                        <Label>Coefficient a</Label>
                        <Input
                          type="number"
                          value={quadA}
                          onChange={(e) => setQuadA(parseFloat(e.target.value) || 1)}
                          placeholder="Enter coefficient a"
                        />
                      </div>
                      <div>
                        <Label>Coefficient b</Label>
                        <Input
                          type="number"
                          value={quadB}
                          onChange={(e) => setQuadB(parseFloat(e.target.value) || 0)}
                          placeholder="Enter coefficient b"
                        />
                      </div>
                      <div>
                        <Label>Constant c</Label>
                        <Input
                          type="number"
                          value={quadC}
                          onChange={(e) => setQuadC(parseFloat(e.target.value) || 0)}
                          placeholder="Enter constant c"
                        />
                      </div>
                      <Button onClick={solveQuadraticEquation}>Solve</Button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-semibold mb-2">
                        {quadA}x² + {quadB}x + {quadC} = 0
                      </div>
                      {quadDiscriminant !== null && (
                        <div className="text-sm text-gray-600">
                          Discriminant (Δ) = b² - 4ac = {quadDiscriminant.toFixed(2)}
                        </div>
                      )}
                    </div>

                    {quadSolutions && (
                      <div className="bg-green-50 p-6 rounded-lg">
                        <div className="text-center mb-4">
                          <div className="text-2xl font-bold text-green-600">
                            {quadSolutions.x1 !== null && quadSolutions.x2 !== null ? (
                              quadSolutions.x1 === quadSolutions.x2 ? (
                                `x = ${quadSolutions.x1.toFixed(4)} (double root)`
                              ) : (
                                `x₁ = ${quadSolutions.x1.toFixed(4)}, x₂ = ${quadSolutions.x2.toFixed(4)}`
                              )
                            ) : (
                              'No real solutions'
                            )}
                          </div>
                        </div>
                        
                        {quadraticFormula && (
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-white p-3 rounded">
                              <strong>Vertex:</strong> ({quadraticFormula.vertex.x.toFixed(2)}, {quadraticFormula.vertex.y.toFixed(2)})
                            </div>
                            <div className="bg-white p-3 rounded">
                              <strong>Axis of Symmetry:</strong> x = {quadraticFormula.axisOfSymmetry.toFixed(2)}
                            </div>
                            <div className="bg-white p-3 rounded">
                              <strong>Opens:</strong> {quadraticFormula.opensUpward ? 'Upward' : 'Downward'}
                            </div>
                            <div className="bg-white p-3 rounded">
                              <strong>Discriminant:</strong> {quadDiscriminant?.toFixed(2)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="system">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-6 w-6" />
                      System of Linear Equations
                    </CardTitle>
                    <CardDescription>Solve 2×2 systems using Cramer's rule</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <Input
                          type="number"
                          value={systemA1}
                          onChange={(e) => setSystemA1(parseFloat(e.target.value) || 0)}
                          placeholder="a₁"
                        />
                        <span className="text-center">x +</span>
                        <Input
                          type="number"
                          value={systemB1}
                          onChange={(e) => setSystemB1(parseFloat(e.target.value) || 0)}
                          placeholder="b₁"
                        />
                        <div className="flex items-center gap-2">
                          <span>y =</span>
                          <Input
                            type="number"
                            value={systemC1}
                            onChange={(e) => setSystemC1(parseFloat(e.target.value) || 0)}
                            placeholder="c₁"
                            className="w-20"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <Input
                          type="number"
                          value={systemA2}
                          onChange={(e) => setSystemA2(parseFloat(e.target.value) || 0)}
                          placeholder="a₂"
                        />
                        <span className="text-center">x +</span>
                        <Input
                          type="number"
                          value={systemB2}
                          onChange={(e) => setSystemB2(parseFloat(e.target.value) || 0)}
                          placeholder="b₂"
                        />
                        <div className="flex items-center gap-2">
                          <span>y =</span>
                          <Input
                            type="number"
                            value={systemC2}
                            onChange={(e) => setSystemC2(parseFloat(e.target.value) || 0)}
                            placeholder="c₂"
                            className="w-20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="font-semibold">
                        {systemA1}x + {systemB1}y = {systemC1}
                      </div>
                      <div className="font-semibold">
                        {systemA2}x + {systemB2}y = {systemC2}
                      </div>
                    </div>

                    <Button onClick={solveSystemOfEquations} className="w-full">
                      Solve System
                    </Button>

                    {systemSolution && systemSolution.x !== null && systemSolution.y !== null && (
                      <div className="bg-purple-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          x = {systemSolution.x.toFixed(4)}
                        </div>
                        <div className="text-3xl font-bold text-purple-600 mb-4">
                          y = {systemSolution.y.toFixed(4)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Verification:</div>
                          <div>{systemA1} × {systemSolution.x.toFixed(2)} + {systemB1} × {systemSolution.y.toFixed(2)} = {(systemA1 * systemSolution.x + systemB1 * systemSolution.y).toFixed(2)}</div>
                          <div>{systemA2} × {systemSolution.x.toFixed(2)} + {systemB2} × {systemSolution.y.toFixed(2)} = {(systemA2 * systemSolution.x + systemB2 * systemSolution.y).toFixed(2)}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="expression">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Function className="h-6 w-6" />
                      Expression Evaluator
                    </CardTitle>
                    <CardDescription>Evaluate algebraic expressions for given values</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                      <div>
                        <Label>Expression</Label>
                        <Input
                          value={expression}
                          onChange={(e) => setExpression(e.target.value)}
                          placeholder="e.g., 2x + 3, x^2 - 4x + 1"
                        />
                      </div>
                      <div>
                        <Label>Value of x</Label>
                        <Input
                          type="number"
                          value={xValue}
                          onChange={(e) => setXValue(parseFloat(e.target.value) || 0)}
                          placeholder="Enter x value"
                        />
                      </div>
                      <Button onClick={evaluateExpression}>Evaluate</Button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-semibold">
                        f(x) = {expression}
                      </div>
                      <div className="text-lg text-gray-600">
                        f({xValue}) = ?
                      </div>
                    </div>

                    {expressionResult !== null && (
                      <div className="bg-orange-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-orange-600">
                          f({xValue}) = {expressionResult.toFixed(4)}
                        </div>
                      </div>
                    )}

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Supported Operations:</h4>
                      <div className="text-sm space-y-1">
                        <div>• Basic operations: +, -, *, /</div>
                        <div>• Exponents: x^2, x^3, etc.</div>
                        <div>• Parentheses: (x + 1), (2x - 3), etc.</div>
                        <div>• Examples: 2x + 3, x^2 - 4x + 1, (x + 1)^2</div>
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
                  Solution History
                </CardTitle>
                <CardDescription>Recent algebraic solutions</CardDescription>
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

export default AlgebraCalculator;
