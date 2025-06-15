
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Square, Circle, Triangle, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AreaCalculator = () => {
  // Rectangle/Square
  const [length, setLength] = useState(10);
  const [width, setWidth] = useState(5);
  
  // Circle
  const [radius, setRadius] = useState(5);
  
  // Triangle
  const [base, setBase] = useState(10);
  const [height, setHeight] = useState(8);
  const [side1, setSide1] = useState(3);
  const [side2, setSide2] = useState(4);
  const [side3, setSide3] = useState(5);
  
  // Trapezoid
  const [parallel1, setParallel1] = useState(8);
  const [parallel2, setParallel2] = useState(12);
  const [trapHeight, setTrapHeight] = useState(6);
  
  // Ellipse
  const [majorAxis, setMajorAxis] = useState(8);
  const [minorAxis, setMinorAxis] = useState(6);

  // Units
  const [unit, setUnit] = useState('squareMeters');
  
  const [results, setResults] = useState<{ [key: string]: number }>({});
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const areaUnits = {
    squareMeters: { name: 'Square Meters (m²)', factor: 1 },
    squareFeet: { name: 'Square Feet (ft²)', factor: 10.7639 },
    squareInches: { name: 'Square Inches (in²)', factor: 1550 },
    acres: { name: 'Acres', factor: 0.000247105 },
    hectares: { name: 'Hectares (ha)', factor: 0.0001 },
    squareKilometers: { name: 'Square Kilometers (km²)', factor: 0.000001 },
    squareMiles: { name: 'Square Miles (mi²)', factor: 3.861e-7 },
    squareYards: { name: 'Square Yards (yd²)', factor: 1.19599 }
  };

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const convertArea = (areaInSquareMeters: number) => {
    const factor = areaUnits[unit as keyof typeof areaUnits].factor;
    return areaInSquareMeters * factor;
  };

  const calculateRectangle = () => {
    const area = length * width;
    const converted = convertArea(area);
    setResults(prev => ({ ...prev, rectangle: converted }));
    
    addToHistory(`Rectangle: ${length} × ${width} = ${converted.toFixed(4)} ${unit}`);
    toast({
      title: "Rectangle Area Calculated",
      description: `Area: ${converted.toFixed(4)} ${unit}`
    });
  };

  const calculateSquare = () => {
    const area = length * length;
    const converted = convertArea(area);
    setResults(prev => ({ ...prev, square: converted }));
    
    addToHistory(`Square: ${length}² = ${converted.toFixed(4)} ${unit}`);
    toast({
      title: "Square Area Calculated",
      description: `Area: ${converted.toFixed(4)} ${unit}`
    });
  };

  const calculateCircle = () => {
    const area = Math.PI * radius * radius;
    const converted = convertArea(area);
    setResults(prev => ({ ...prev, circle: converted }));
    
    addToHistory(`Circle: π × ${radius}² = ${converted.toFixed(4)} ${unit}`);
    toast({
      title: "Circle Area Calculated",
      description: `Area: ${converted.toFixed(4)} ${unit}`
    });
  };

  const calculateTriangleBase = () => {
    const area = 0.5 * base * height;
    const converted = convertArea(area);
    setResults(prev => ({ ...prev, triangleBase: converted }));
    
    addToHistory(`Triangle (base×height): ½ × ${base} × ${height} = ${converted.toFixed(4)} ${unit}`);
    toast({
      title: "Triangle Area Calculated",
      description: `Area: ${converted.toFixed(4)} ${unit}`
    });
  };

  const calculateTriangleHeron = () => {
    const s = (side1 + side2 + side3) / 2;
    const area = Math.sqrt(s * (s - side1) * (s - side2) * (s - side3));
    const converted = convertArea(area);
    setResults(prev => ({ ...prev, triangleHeron: converted }));
    
    addToHistory(`Triangle (Heron's): sides ${side1}, ${side2}, ${side3} = ${converted.toFixed(4)} ${unit}`);
    toast({
      title: "Triangle Area Calculated (Heron's Formula)",
      description: `Area: ${converted.toFixed(4)} ${unit}`
    });
  };

  const calculateTrapezoid = () => {
    const area = 0.5 * (parallel1 + parallel2) * trapHeight;
    const converted = convertArea(area);
    setResults(prev => ({ ...prev, trapezoid: converted }));
    
    addToHistory(`Trapezoid: ½ × (${parallel1} + ${parallel2}) × ${trapHeight} = ${converted.toFixed(4)} ${unit}`);
    toast({
      title: "Trapezoid Area Calculated",
      description: `Area: ${converted.toFixed(4)} ${unit}`
    });
  };

  const calculateEllipse = () => {
    const area = Math.PI * (majorAxis / 2) * (minorAxis / 2);
    const converted = convertArea(area);
    setResults(prev => ({ ...prev, ellipse: converted }));
    
    addToHistory(`Ellipse: π × ${majorAxis/2} × ${minorAxis/2} = ${converted.toFixed(4)} ${unit}`);
    toast({
      title: "Ellipse Area Calculated",
      description: `Area: ${converted.toFixed(4)} ${unit}`
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Area Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate areas of various geometric shapes including rectangles, circles, triangles, and more.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Label>Area Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(areaUnits).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="rectangle" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="rectangle">Rectangle</TabsTrigger>
                <TabsTrigger value="circle">Circle</TabsTrigger>
                <TabsTrigger value="triangle">Triangle</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>

              <TabsContent value="rectangle">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Square className="h-6 w-6" />
                        Rectangle Area
                      </CardTitle>
                      <CardDescription>Calculate area of rectangle or square</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Length</Label>
                          <Input
                            type="number"
                            step="any"
                            value={length}
                            onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Width</Label>
                          <Input
                            type="number"
                            step="any"
                            value={width}
                            onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Button onClick={calculateRectangle} className="w-full">
                          Calculate Rectangle
                        </Button>
                        <Button onClick={calculateSquare} variant="outline" className="w-full">
                          Calculate Square (using length)
                        </Button>
                      </div>
                      {(results.rectangle || results.square) && (
                        <div className="space-y-2">
                          {results.rectangle && (
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {results.rectangle.toFixed(4)} {areaUnits[unit as keyof typeof areaUnits].name.split(' ')[2]}
                              </div>
                              <div className="text-gray-600">Rectangle Area</div>
                            </div>
                          )}
                          {results.square && (
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {results.square.toFixed(4)} {areaUnits[unit as keyof typeof areaUnits].name.split(' ')[2]}
                              </div>
                              <div className="text-gray-600">Square Area</div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="circle">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Circle className="h-6 w-6" />
                      Circle Area
                    </CardTitle>
                    <CardDescription>Calculate area using radius</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Radius</Label>
                      <Input
                        type="number"
                        step="any"
                        value={radius}
                        onChange={(e) => setRadius(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <Button onClick={calculateCircle} className="w-full">
                      Calculate Circle Area
                    </Button>
                    {results.circle && (
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {results.circle.toFixed(4)} {areaUnits[unit as keyof typeof areaUnits].name.split(' ')[2]}
                        </div>
                        <div className="text-gray-600">Circle Area</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Formula: π × r² = π × {radius}²
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="triangle">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Triangle className="h-6 w-6" />
                        Triangle Area (Base × Height)
                      </CardTitle>
                      <CardDescription>Calculate using base and height</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Base</Label>
                          <Input
                            type="number"
                            step="any"
                            value={base}
                            onChange={(e) => setBase(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Height</Label>
                          <Input
                            type="number"
                            step="any"
                            value={height}
                            onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <Button onClick={calculateTriangleBase} className="w-full">
                        Calculate Triangle Area
                      </Button>
                      {results.triangleBase && (
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {results.triangleBase.toFixed(4)} {areaUnits[unit as keyof typeof areaUnits].name.split(' ')[2]}
                          </div>
                          <div className="text-gray-600">Triangle Area</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Triangle Area (Heron's Formula)</CardTitle>
                      <CardDescription>Calculate using three sides</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Side A</Label>
                          <Input
                            type="number"
                            step="any"
                            value={side1}
                            onChange={(e) => setSide1(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Side B</Label>
                          <Input
                            type="number"
                            step="any"
                            value={side2}
                            onChange={(e) => setSide2(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Side C</Label>
                          <Input
                            type="number"
                            step="any"
                            value={side3}
                            onChange={(e) => setSide3(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <Button onClick={calculateTriangleHeron} className="w-full">
                        Calculate Using Heron's Formula
                      </Button>
                      {results.triangleHeron && (
                        <div className="bg-indigo-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-indigo-600">
                            {results.triangleHeron.toFixed(4)} {areaUnits[unit as keyof typeof areaUnits].name.split(' ')[2]}
                          </div>
                          <div className="text-gray-600">Triangle Area (Heron's)</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="other">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Trapezoid Area</CardTitle>
                      <CardDescription>Calculate using parallel sides and height</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Parallel Side 1</Label>
                          <Input
                            type="number"
                            step="any"
                            value={parallel1}
                            onChange={(e) => setParallel1(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Parallel Side 2</Label>
                          <Input
                            type="number"
                            step="any"
                            value={parallel2}
                            onChange={(e) => setParallel2(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Height</Label>
                        <Input
                          type="number"
                          step="any"
                          value={trapHeight}
                          onChange={(e) => setTrapHeight(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <Button onClick={calculateTrapezoid} className="w-full">
                        Calculate Trapezoid Area
                      </Button>
                      {results.trapezoid && (
                        <div className="bg-red-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {results.trapezoid.toFixed(4)} {areaUnits[unit as keyof typeof areaUnits].name.split(' ')[2]}
                          </div>
                          <div className="text-gray-600">Trapezoid Area</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ellipse Area</CardTitle>
                      <CardDescription>Calculate using major and minor axes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Major Axis</Label>
                          <Input
                            type="number"
                            step="any"
                            value={majorAxis}
                            onChange={(e) => setMajorAxis(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Minor Axis</Label>
                          <Input
                            type="number"
                            step="any"
                            value={minorAxis}
                            onChange={(e) => setMinorAxis(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <Button onClick={calculateEllipse} className="w-full">
                        Calculate Ellipse Area
                      </Button>
                      {results.ellipse && (
                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {results.ellipse.toFixed(4)} {areaUnits[unit as keyof typeof areaUnits].name.split(' ')[2]}
                          </div>
                          <div className="text-gray-600">Ellipse Area</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
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
                <CardDescription>Recent area calculations</CardDescription>
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
                <CardTitle>Area Formulas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Rectangle:</strong> length × width</div>
                  <div><strong>Square:</strong> side²</div>
                  <div><strong>Circle:</strong> π × radius²</div>
                  <div><strong>Triangle:</strong> ½ × base × height</div>
                  <div><strong>Trapezoid:</strong> ½ × (a + b) × height</div>
                  <div><strong>Ellipse:</strong> π × a × b</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AreaCalculator;
