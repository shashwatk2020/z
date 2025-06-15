
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Apple, Target, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CalorieCalculator = () => {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [timeframe, setTimeframe] = useState('1');
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const activityLevels = {
    sedentary: { multiplier: 1.2, label: 'Sedentary (little/no exercise)' },
    light: { multiplier: 1.375, label: 'Light (light exercise 1-3 days/week)' },
    moderate: { multiplier: 1.55, label: 'Moderate (moderate exercise 3-5 days/week)' },
    active: { multiplier: 1.725, label: 'Active (hard exercise 6-7 days/week)' },
    veryActive: { multiplier: 1.9, label: 'Very Active (very hard exercise, physical job)' }
  };

  const goals = {
    lose2: { label: 'Lose 2 lbs/week', deficit: 1000 },
    lose1: { label: 'Lose 1 lb/week', deficit: 500 },
    lose0_5: { label: 'Lose 0.5 lb/week', deficit: 250 },
    maintain: { label: 'Maintain weight', deficit: 0 },
    gain0_5: { label: 'Gain 0.5 lb/week', deficit: -250 },
    gain1: { label: 'Gain 1 lb/week', deficit: -500 }
  };

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const calculateCalories = () => {
    if (!weight || !height || !age || weight <= 0 || height <= 0 || age <= 0) {
      toast({
        title: "Error",
        description: "Please enter valid values for all fields",
        variant: "destructive"
      });
      return;
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityLevels[activityLevel as keyof typeof activityLevels].multiplier;

    // Calculate target calories based on goal
    const targetCalories = tdee - goals[goal as keyof typeof goals].deficit;

    // Calculate macronutrient breakdown (40% carbs, 30% protein, 30% fat)
    const protein = Math.round((targetCalories * 0.30) / 4); // 4 calories per gram
    const carbs = Math.round((targetCalories * 0.40) / 4); // 4 calories per gram
    const fat = Math.round((targetCalories * 0.30) / 9); // 9 calories per gram

    // Calculate weight change over time
    const weeklyWeightChange = -goals[goal as keyof typeof goals].deficit / 3500; // 3500 calories = 1 lb
    const totalWeightChange = weeklyWeightChange * parseFloat(timeframe);

    // Calculate water intake (basic recommendation)
    const waterIntake = Math.round(weight * 35); // 35ml per kg body weight

    const calorieResult = {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      macros: { protein, carbs, fat },
      weeklyWeightChange: parseFloat(weeklyWeightChange.toFixed(2)),
      totalWeightChange: parseFloat(totalWeightChange.toFixed(2)),
      finalWeight: parseFloat((weight + totalWeightChange).toFixed(1)),
      waterIntake,
      goalLabel: goals[goal as keyof typeof goals].label
    };

    setResult(calorieResult);
    addToHistory(`Target: ${Math.round(targetCalories)} cal/day (${calorieResult.goalLabel})`);
    
    toast({
      title: "Calories Calculated",
      description: `Your daily target is ${Math.round(targetCalories)} calories`
    });
  };

  const getMealPlan = (calories: number) => {
    return {
      breakfast: Math.round(calories * 0.25),
      lunch: Math.round(calories * 0.35),
      dinner: Math.round(calories * 0.30),
      snacks: Math.round(calories * 0.10)
    };
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Calorie Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate your daily calorie needs based on your goals and get personalized nutrition recommendations.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-6 w-6" />
                  Calorie Calculator
                </CardTitle>
                <CardDescription>Enter your details to calculate daily calorie needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Weight (kg)</Label>
                    <Input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                      placeholder="Enter weight"
                    />
                  </div>
                  <div>
                    <Label>Height (cm)</Label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                      placeholder="Enter height"
                    />
                  </div>
                  <div>
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                      placeholder="Enter age"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div>
                    <Label>Activity Level</Label>
                    <Select value={activityLevel} onValueChange={setActivityLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(activityLevels).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Goal</Label>
                    <Select value={goal} onValueChange={setGoal}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(goals).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Timeframe (weeks)</Label>
                    <Input
                      type="number"
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      placeholder="Enter weeks"
                      min="1"
                      max="52"
                    />
                  </div>
                </div>

                <Button onClick={calculateCalories} className="w-full" size="lg">
                  Calculate Calories
                </Button>

                {result && (
                  <div className="space-y-6">
                    <div className="bg-green-50 p-6 rounded-lg text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {result.targetCalories}
                      </div>
                      <div className="text-xl font-semibold text-green-600 mb-2">
                        Daily Calories
                      </div>
                      <div className="text-gray-600">
                        {result.goalLabel}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-600 mb-2">BMR</h4>
                        <div className="text-2xl font-bold text-blue-600">{result.bmr}</div>
                        <div className="text-sm text-gray-600">Calories at rest</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-600 mb-2">TDEE</h4>
                        <div className="text-2xl font-bold text-purple-600">{result.tdee}</div>
                        <div className="text-sm text-gray-600">Maintenance calories</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-600 mb-2">Weekly Change</h4>
                        <div className="text-2xl font-bold text-orange-600">
                          {result.weeklyWeightChange > 0 ? '+' : ''}{result.weeklyWeightChange} kg
                        </div>
                        <div className="text-sm text-gray-600">Expected per week</div>
                      </div>
                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-pink-600 mb-2">Final Weight</h4>
                        <div className="text-2xl font-bold text-pink-600">{result.finalWeight} kg</div>
                        <div className="text-sm text-gray-600">After {timeframe} weeks</div>
                      </div>
                    </div>

                    <Tabs defaultValue="macros" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="macros">Macros</TabsTrigger>
                        <TabsTrigger value="meals">Meal Plan</TabsTrigger>
                        <TabsTrigger value="tips">Tips</TabsTrigger>
                      </TabsList>

                      <TabsContent value="macros">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-red-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-red-600">{result.macros.protein}g</div>
                            <div className="text-sm text-gray-600">Protein (30%)</div>
                          </div>
                          <div className="bg-yellow-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-yellow-600">{result.macros.carbs}g</div>
                            <div className="text-sm text-gray-600">Carbs (40%)</div>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">{result.macros.fat}g</div>
                            <div className="text-sm text-gray-600">Fat (30%)</div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="meals">
                        {(() => {
                          const meals = getMealPlan(result.targetCalories);
                          return (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                                <div className="text-xl font-bold text-yellow-600">{meals.breakfast}</div>
                                <div className="text-sm text-gray-600">Breakfast (25%)</div>
                              </div>
                              <div className="bg-green-50 p-4 rounded-lg text-center">
                                <div className="text-xl font-bold text-green-600">{meals.lunch}</div>
                                <div className="text-sm text-gray-600">Lunch (35%)</div>
                              </div>
                              <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <div className="text-xl font-bold text-blue-600">{meals.dinner}</div>
                                <div className="text-sm text-gray-600">Dinner (30%)</div>
                              </div>
                              <div className="bg-purple-50 p-4 rounded-lg text-center">
                                <div className="text-xl font-bold text-purple-600">{meals.snacks}</div>
                                <div className="text-sm text-gray-600">Snacks (10%)</div>
                              </div>
                            </div>
                          );
                        })()}
                      </TabsContent>

                      <TabsContent value="tips">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3">Nutrition Tips</h4>
                          <ul className="space-y-2 text-sm">
                            <li>💧 Drink {result.waterIntake}ml of water daily</li>
                            <li>🥗 Fill half your plate with vegetables</li>
                            <li>🍗 Include lean protein with every meal</li>
                            <li>🌾 Choose whole grains over refined carbs</li>
                            <li>⏰ Eat regularly throughout the day</li>
                            <li>📱 Track your food intake for better results</li>
                          </ul>
                        </div>
                      </TabsContent>
                    </Tabs>
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
                <CardDescription>Recent calculations</CardDescription>
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
                <CardTitle>Calorie Facts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>🔥 1 pound = 3,500 calories</div>
                  <div>💪 Muscle burns more calories than fat</div>
                  <div>🏃 Exercise increases calorie burn</div>
                  <div>🌡️ Cold weather slightly increases BMR</div>
                  <div>😴 Poor sleep affects metabolism</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalorieCalculator;
