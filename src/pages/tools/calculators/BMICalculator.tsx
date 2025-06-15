
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Scale, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BMICalculator = () => {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [weightUnit, setWeightUnit] = useState('kg');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-600', bg: 'bg-green-50' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { category: 'Obese', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getIdealWeight = (heightInM: number, gender: string) => {
    // Using Devine formula
    const heightInCm = heightInM * 100;
    let idealWeight;
    
    if (gender === 'male') {
      idealWeight = 50 + 2.3 * ((heightInCm - 152.4) / 2.54);
    } else {
      idealWeight = 45.5 + 2.3 * ((heightInCm - 152.4) / 2.54);
    }
    
    return Math.max(idealWeight, 40); // Minimum reasonable weight
  };

  const calculateBMI = () => {
    if (!weight || !height || weight <= 0 || height <= 0) {
      toast({
        title: "Error",
        description: "Please enter valid weight and height values",
        variant: "destructive"
      });
      return;
    }

    // Convert to metric units
    let weightInKg = weight;
    let heightInM = height;

    if (weightUnit === 'lbs') {
      weightInKg = weight * 0.453592;
    }

    if (heightUnit === 'ft') {
      heightInM = height * 0.3048;
    } else if (heightUnit === 'in') {
      heightInM = height * 0.0254;
    } else if (heightUnit === 'cm') {
      heightInM = height / 100;
    }

    const bmi = weightInKg / (heightInM * heightInM);
    const { category, color, bg } = getBMICategory(bmi);
    const idealWeight = getIdealWeight(heightInM, gender);
    const weightDifference = weightInKg - idealWeight;

    // Calculate body fat percentage (rough estimation)
    let bodyFatPercentage;
    if (gender === 'male') {
      bodyFatPercentage = (1.20 * bmi) + (0.23 * age) - 16.2;
    } else {
      bodyFatPercentage = (1.20 * bmi) + (0.23 * age) - 5.4;
    }

    // Calculate calories for weight goals
    const bmr = gender === 'male' 
      ? 88.362 + (13.397 * weightInKg) + (4.799 * heightInM * 100) - (5.677 * age)
      : 447.593 + (9.247 * weightInKg) + (3.098 * heightInM * 100) - (4.330 * age);

    const bmiResult = {
      bmi: parseFloat(bmi.toFixed(1)),
      category,
      color,
      bg,
      idealWeight: parseFloat(idealWeight.toFixed(1)),
      weightDifference: parseFloat(weightDifference.toFixed(1)),
      bodyFatPercentage: Math.max(0, parseFloat(bodyFatPercentage.toFixed(1))),
      bmr: Math.round(bmr),
      tdee: Math.round(bmr * 1.55) // Moderate activity level
    };

    setResult(bmiResult);
    addToHistory(`BMI: ${bmi.toFixed(1)} (${category})`);
    
    toast({
      title: "BMI Calculated",
      description: `Your BMI is ${bmi.toFixed(1)} - ${category}`
    });
  };

  const getHealthAdvice = (bmi: number, category: string) => {
    const advice = {
      'Underweight': [
        'Consider consulting a healthcare provider',
        'Focus on nutrient-dense, calorie-rich foods',
        'Include strength training exercises',
        'Monitor your health regularly'
      ],
      'Normal weight': [
        'Maintain your current healthy lifestyle',
        'Continue regular physical activity',
        'Eat a balanced, nutritious diet',
        'Keep monitoring your weight'
      ],
      'Overweight': [
        'Consider a balanced diet with portion control',
        'Increase physical activity gradually',
        'Focus on sustainable lifestyle changes',
        'Consult a healthcare provider if needed'
      ],
      'Obese': [
        'Consult a healthcare provider',
        'Create a structured weight loss plan',
        'Consider professional nutritional guidance',
        'Incorporate regular physical activity safely'
      ]
    };

    return advice[category] || [];
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            BMI Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate your Body Mass Index (BMI) and get personalized health insights and recommendations.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-6 w-6" />
                  BMI Calculator
                </CardTitle>
                <CardDescription>Enter your details to calculate your BMI and health metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="metric" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="metric">Metric Units</TabsTrigger>
                    <TabsTrigger value="imperial">Imperial Units</TabsTrigger>
                  </TabsList>

                  <TabsContent value="metric" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Weight (kg)</Label>
                        <Input
                          type="number"
                          value={weight}
                          onChange={(e) => {
                            setWeight(parseFloat(e.target.value) || 0);
                            setWeightUnit('kg');
                          }}
                          placeholder="Enter weight in kg"
                        />
                      </div>
                      <div>
                        <Label>Height (cm)</Label>
                        <Input
                          type="number"
                          value={height}
                          onChange={(e) => {
                            setHeight(parseFloat(e.target.value) || 0);
                            setHeightUnit('cm');
                          }}
                          placeholder="Enter height in cm"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="imperial" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Weight (lbs)</Label>
                        <Input
                          type="number"
                          value={weight}
                          onChange={(e) => {
                            setWeight(parseFloat(e.target.value) || 0);
                            setWeightUnit('lbs');
                          }}
                          placeholder="Enter weight in pounds"
                        />
                      </div>
                      <div>
                        <Label>Height (feet)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={height}
                          onChange={(e) => {
                            setHeight(parseFloat(e.target.value) || 0);
                            setHeightUnit('ft');
                          }}
                          placeholder="Enter height in feet (e.g., 5.9)"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={calculateBMI} className="w-full" size="lg">
                  Calculate BMI
                </Button>

                {result && (
                  <div className="space-y-6">
                    <div className={`${result.bg} p-6 rounded-lg text-center`}>
                      <div className={`text-4xl font-bold ${result.color} mb-2`}>
                        {result.bmi}
                      </div>
                      <div className={`text-xl font-semibold ${result.color} mb-2`}>
                        {result.category}
                      </div>
                      <div className="text-gray-600">
                        Body Mass Index
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-600 mb-2">Ideal Weight</h4>
                        <div className="text-2xl font-bold text-blue-600">{result.idealWeight} kg</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {result.weightDifference > 0 ? 
                            `${result.weightDifference.toFixed(1)} kg above ideal` : 
                            `${Math.abs(result.weightDifference).toFixed(1)} kg below ideal`
                          }
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-600 mb-2">Body Fat %</h4>
                        <div className="text-2xl font-bold text-purple-600">{result.bodyFatPercentage}%</div>
                        <div className="text-sm text-gray-600 mt-1">Estimated</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-600 mb-2">BMR</h4>
                        <div className="text-2xl font-bold text-green-600">{result.bmr}</div>
                        <div className="text-sm text-gray-600 mt-1">calories/day at rest</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-600 mb-2">TDEE</h4>
                        <div className="text-2xl font-bold text-orange-600">{result.tdee}</div>
                        <div className="text-sm text-gray-600 mt-1">calories/day active</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Health Recommendations</h4>
                      <ul className="space-y-2">
                        {getHealthAdvice(result.bmi, result.category).map((advice, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{advice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Calculation History
                </CardTitle>
                <CardDescription>Recent BMI calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No calculations yet</p>
                  ) : (
                    history.slice().reverse().map((calc, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
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
                <CardTitle>BMI Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Underweight:</span>
                    <span>&lt; 18.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Normal weight:</span>
                    <span>18.5 - 24.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overweight:</span>
                    <span>25 - 29.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Obese:</span>
                    <span>&gt; 30</span>
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

export default BMICalculator;
