
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Grid3X3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Matrix = number[][];

const MatrixCalculator = () => {
  const [matrixA, setMatrixA] = useState<Matrix>([[1, 2], [3, 4]]);
  const [matrixB, setMatrixB] = useState<Matrix>([[5, 6], [7, 8]]);
  const [result, setResult] = useState<Matrix | null>(null);
  const [operation, setOperation] = useState('add');
  const [matrixSize, setMatrixSize] = useState('2x2');
  const [scalar, setScalar] = useState(2);
  
  // Single matrix operations
  const [singleMatrix, setSingleMatrix] = useState<Matrix>([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  const [singleResult, setSingleResult] = useState<{
    determinant?: number;
    trace?: number;
    transpose?: Matrix;
    inverse?: Matrix | null;
  } | null>(null);

  const { toast } = useToast();

  const createEmptyMatrix = (rows: number, cols: number): Matrix => {
    return Array(rows).fill(0).map(() => Array(cols).fill(0));
  };

  const resizeMatrix = (matrix: Matrix, newRows: number, newCols: number): Matrix => {
    const resized = createEmptyMatrix(newRows, newCols);
    for (let i = 0; i < Math.min(matrix.length, newRows); i++) {
      for (let j = 0; j < Math.min(matrix[0]?.length || 0, newCols); j++) {
        resized[i][j] = matrix[i]?.[j] || 0;
      }
    }
    return resized;
  };

  const handleMatrixSizeChange = (size: string) => {
    setMatrixSize(size);
    const [rows, cols] = size.split('x').map(Number);
    setMatrixA(resizeMatrix(matrixA, rows, cols));
    setMatrixB(resizeMatrix(matrixB, rows, cols));
    setSingleMatrix(resizeMatrix(singleMatrix, rows, cols));
  };

  const updateMatrixValue = (
    matrix: Matrix,
    setMatrix: (matrix: Matrix) => void,
    row: number,
    col: number,
    value: string
  ) => {
    const newMatrix = matrix.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? parseFloat(value) || 0 : c)) : r
    );
    setMatrix(newMatrix);
  };

  const addMatrices = (a: Matrix, b: Matrix): Matrix => {
    if (a.length !== b.length || a[0].length !== b[0].length) {
      throw new Error('Matrices must have the same dimensions for addition');
    }
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
  };

  const subtractMatrices = (a: Matrix, b: Matrix): Matrix => {
    if (a.length !== b.length || a[0].length !== b[0].length) {
      throw new Error('Matrices must have the same dimensions for subtraction');
    }
    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
  };

  const multiplyMatrices = (a: Matrix, b: Matrix): Matrix => {
    if (a[0].length !== b.length) {
      throw new Error('Number of columns in first matrix must equal number of rows in second matrix');
    }
    
    const result = createEmptyMatrix(a.length, b[0].length);
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b[0].length; j++) {
        for (let k = 0; k < b.length; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return result;
  };

  const scalarMultiply = (matrix: Matrix, scalar: number): Matrix => {
    return matrix.map(row => row.map(val => val * scalar));
  };

  const transpose = (matrix: Matrix): Matrix => {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
  };

  const determinant = (matrix: Matrix): number => {
    const n = matrix.length;
    if (n !== matrix[0].length) {
      throw new Error('Matrix must be square to calculate determinant');
    }
    
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let i = 0; i < n; i++) {
      const subMatrix = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
      det += matrix[0][i] * Math.pow(-1, i) * determinant(subMatrix);
    }
    return det;
  };

  const trace = (matrix: Matrix): number => {
    if (matrix.length !== matrix[0].length) {
      throw new Error('Matrix must be square to calculate trace');
    }
    return matrix.reduce((sum, row, i) => sum + row[i], 0);
  };

  const inverse = (matrix: Matrix): Matrix | null => {
    const n = matrix.length;
    if (n !== matrix[0].length) {
      throw new Error('Matrix must be square to calculate inverse');
    }
    
    const det = determinant(matrix);
    if (Math.abs(det) < 1e-10) {
      return null; // Matrix is singular
    }
    
    if (n === 2) {
      const [[a, b], [c, d]] = matrix;
      return [
        [d / det, -b / det],
        [-c / det, a / det]
      ];
    }
    
    // For larger matrices, use Gauss-Jordan elimination
    const augmented = matrix.map((row, i) => [
      ...row,
      ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
    ]);
    
    // Forward elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
      
      // Make diagonal element 1
      const pivot = augmented[i][i];
      if (Math.abs(pivot) < 1e-10) return null;
      
      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= pivot;
      }
      
      // Eliminate column
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented[k][i];
          for (let j = 0; j < 2 * n; j++) {
            augmented[k][j] -= factor * augmented[i][j];
          }
        }
      }
    }
    
    return augmented.map(row => row.slice(n));
  };

  const performOperation = () => {
    try {
      let newResult: Matrix;
      
      switch (operation) {
        case 'add':
          newResult = addMatrices(matrixA, matrixB);
          break;
        case 'subtract':
          newResult = subtractMatrices(matrixA, matrixB);
          break;
        case 'multiply':
          newResult = multiplyMatrices(matrixA, matrixB);
          break;
        case 'scalar':
          newResult = scalarMultiply(matrixA, scalar);
          break;
        default:
          throw new Error('Invalid operation');
      }
      
      setResult(newResult);
      toast({
        title: "Operation Complete",
        description: `Matrix ${operation} calculated successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Calculation error",
        variant: "destructive"
      });
    }
  };

  const performSingleMatrixOperations = () => {
    try {
      const results: any = {};
      
      if (singleMatrix.length === singleMatrix[0].length) {
        results.determinant = determinant(singleMatrix);
        results.trace = trace(singleMatrix);
        results.inverse = inverse(singleMatrix);
      }
      
      results.transpose = transpose(singleMatrix);
      
      setSingleResult(results);
      
      toast({
        title: "Analysis Complete",
        description: "Matrix properties calculated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Calculation error",
        variant: "destructive"
      });
    }
  };

  const formatMatrix = (matrix: Matrix): string => {
    return matrix.map(row => `[${row.map(val => val.toFixed(2)).join(', ')}]`).join('\n');
  };

  const MatrixInput = ({ 
    matrix, 
    onChange, 
    label 
  }: { 
    matrix: Matrix; 
    onChange: (matrix: Matrix) => void; 
    label: string;
  }) => (
    <div className="space-y-3">
      <Label className="text-lg font-semibold">{label}</Label>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrix[0]?.length || 2}, 1fr)` }}>
        {matrix.map((row, i) =>
          row.map((val, j) => (
            <Input
              key={`${i}-${j}`}
              type="number"
              value={val}
              onChange={(e) => updateMatrixValue(matrix, onChange, i, j, e.target.value)}
              className="w-full text-center"
              step="0.1"
            />
          ))
        )}
      </div>
    </div>
  );

  const MatrixDisplay = ({ matrix, label }: { matrix: Matrix; label: string }) => (
    <div className="space-y-2">
      <Label className="font-semibold">{label}</Label>
      <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm whitespace-pre-line">
        {formatMatrix(matrix)}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Matrix Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Perform matrix operations including addition, multiplication, determinant, inverse, and more.
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Label>Matrix Size:</Label>
            <Select value={matrixSize} onValueChange={handleMatrixSizeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2x2">2×2</SelectItem>
                <SelectItem value="3x3">3×3</SelectItem>
                <SelectItem value="4x4">4×4</SelectItem>
                <SelectItem value="2x3">2×3</SelectItem>
                <SelectItem value="3x2">3×2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="operations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="operations">Matrix Operations</TabsTrigger>
              <TabsTrigger value="analysis">Matrix Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="operations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-6 w-6" />
                    Matrix Operations
                  </CardTitle>
                  <CardDescription>Perform operations between two matrices or with scalars</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Operation</Label>
                    <Select value={operation} onValueChange={setOperation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add">Addition (A + B)</SelectItem>
                        <SelectItem value="subtract">Subtraction (A - B)</SelectItem>
                        <SelectItem value="multiply">Multiplication (A × B)</SelectItem>
                        <SelectItem value="scalar">Scalar Multiplication (k × A)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {operation === 'scalar' && (
                    <div>
                      <Label>Scalar Value</Label>
                      <Input
                        type="number"
                        value={scalar}
                        onChange={(e) => setScalar(parseFloat(e.target.value) || 0)}
                        className="w-32"
                        step="0.1"
                      />
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-8">
                    <MatrixInput 
                      matrix={matrixA} 
                      onChange={setMatrixA} 
                      label="Matrix A" 
                    />
                    {operation !== 'scalar' && (
                      <MatrixInput 
                        matrix={matrixB} 
                        onChange={setMatrixB} 
                        label="Matrix B" 
                      />
                    )}
                  </div>

                  <Button onClick={performOperation} className="w-full">
                    Calculate
                  </Button>

                  {result && (
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Result</h3>
                      <MatrixDisplay matrix={result} label="" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid3X3 className="h-6 w-6" />
                    Matrix Analysis
                  </CardTitle>
                  <CardDescription>Calculate determinant, trace, inverse, and transpose</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <MatrixInput 
                    matrix={singleMatrix} 
                    onChange={setSingleMatrix} 
                    label="Matrix" 
                  />

                  <Button onClick={performSingleMatrixOperations} className="w-full">
                    Analyze Matrix
                  </Button>

                  {singleResult && (
                    <div className="space-y-6">
                      {singleResult.determinant !== undefined && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <Label className="font-semibold">Determinant</Label>
                          <div className="text-2xl font-bold text-green-600">
                            {singleResult.determinant.toFixed(4)}
                          </div>
                        </div>
                      )}

                      {singleResult.trace !== undefined && (
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <Label className="font-semibold">Trace</Label>
                          <div className="text-2xl font-bold text-purple-600">
                            {singleResult.trace.toFixed(4)}
                          </div>
                        </div>
                      )}

                      {singleResult.transpose && (
                        <div className="bg-orange-50 p-6 rounded-lg">
                          <MatrixDisplay matrix={singleResult.transpose} label="Transpose" />
                        </div>
                      )}

                      {singleResult.inverse !== undefined && (
                        <div className="bg-indigo-50 p-6 rounded-lg">
                          {singleResult.inverse ? (
                            <MatrixDisplay matrix={singleResult.inverse} label="Inverse" />
                          ) : (
                            <div>
                              <Label className="font-semibold">Inverse</Label>
                              <p className="text-red-600 mt-2">Matrix is singular (non-invertible)</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default MatrixCalculator;
