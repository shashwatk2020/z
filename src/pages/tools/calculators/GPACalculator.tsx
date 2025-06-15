
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Plus, Trash2, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

const GPACalculator = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Mathematics', grade: 'A', credits: 3 }
  ]);
  const [currentGPA, setCurrentGPA] = useState(0);
  const [currentCredits, setCurrentCredits] = useState(0);
  const [scale, setScale] = useState('4.0');
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const gradePoints = {
    '4.0': {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    },
    '5.0': {
      'A+': 5.0, 'A': 4.7, 'A-': 4.3,
      'B+': 4.0, 'B': 3.7, 'B-': 3.3,
      'C+': 3.0, 'C': 2.7, 'C-': 2.3,
      'D+': 2.0, 'D': 1.7, 'D-': 1.3,
      'F': 0.0
    }
  };

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: `Course ${courses.length + 1}`,
      grade: 'A',
      credits: 3
    };
    setCourses([...courses, newCourse]);
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const calculateGPA = () => {
    if (courses.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one course",
        variant: "destructive"
      });
      return;
    }

    const gradeScale = gradePoints[scale as keyof typeof gradePoints];
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      if (course.grade && course.credits > 0) {
        const points = gradeScale[course.grade as keyof typeof gradeScale] || 0;
        totalPoints += points * course.credits;
        totalCredits += course.credits;
      }
    });

    if (totalCredits === 0) {
      toast({
        title: "Error",
        description: "Please enter valid credits for your courses",
        variant: "destructive"
      });
      return;
    }

    const semesterGPA = totalPoints / totalCredits;

    // Calculate cumulative GPA if current GPA is provided
    let cumulativeGPA = semesterGPA;
    let totalCumulativeCredits = totalCredits;

    if (currentGPA > 0 && currentCredits > 0) {
      const currentTotalPoints = currentGPA * currentCredits;
      const newTotalPoints = currentTotalPoints + totalPoints;
      totalCumulativeCredits = currentCredits + totalCredits;
      cumulativeGPA = newTotalPoints / totalCumulativeCredits;
    }

    // Calculate what's needed for target GPA
    const getCreditsForTarget = (targetGPA: number) => {
      if (currentCredits === 0) return 0;
      const requiredTotalPoints = targetGPA * (currentCredits + totalCredits);
      const currentTotalPoints = currentGPA * currentCredits + totalPoints;
      const additionalPointsNeeded = requiredTotalPoints - currentTotalPoints;
      const maxGradePoints = parseFloat(scale);
      return additionalPointsNeeded > 0 ? Math.ceil(additionalPointsNeeded / maxGradePoints) : 0;
    };

    const gpaResult = {
      semesterGPA: parseFloat(semesterGPA.toFixed(3)),
      cumulativeGPA: parseFloat(cumulativeGPA.toFixed(3)),
      totalCredits,
      totalCumulativeCredits,
      totalPoints: parseFloat(totalPoints.toFixed(2)),
      creditsForTargets: {
        3.0: getCreditsForTarget(3.0),
        3.5: getCreditsForTarget(3.5),
        3.8: getCreditsForTarget(3.8),
        4.0: getCreditsForTarget(4.0)
      },
      gradeDistribution: calculateGradeDistribution()
    };

    setResult(gpaResult);
    addToHistory(`GPA: ${semesterGPA.toFixed(3)} (${totalCredits} credits)`);
    
    toast({
      title: "GPA Calculated",
      description: `Your semester GPA is ${semesterGPA.toFixed(3)}`
    });
  };

  const calculateGradeDistribution = () => {
    const distribution: { [key: string]: number } = {};
    courses.forEach(course => {
      distribution[course.grade] = (distribution[course.grade] || 0) + 1;
    });
    return distribution;
  };

  const getGPACategory = (gpa: number) => {
    if (gpa >= 3.9) return { category: 'Summa Cum Laude', color: 'text-green-600', bg: 'bg-green-50' };
    if (gpa >= 3.7) return { category: 'Magna Cum Laude', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (gpa >= 3.5) return { category: 'Cum Laude', color: 'text-purple-600', bg: 'bg-purple-50' };
    if (gpa >= 3.0) return { category: 'Good Standing', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (gpa >= 2.0) return { category: 'Satisfactory', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { category: 'Below Standard', color: 'text-red-600', bg: 'bg-red-50' };
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GPA Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate your Grade Point Average with detailed analysis and academic standing information.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6" />
                  GPA Calculator
                </CardTitle>
                <CardDescription>Add your courses and grades to calculate your GPA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>GPA Scale</Label>
                    <Select value={scale} onValueChange={setScale}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4.0">4.0 Scale</SelectItem>
                        <SelectItem value="5.0">5.0 Scale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Current GPA (optional)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={currentGPA}
                      onChange={(e) => setCurrentGPA(parseFloat(e.target.value) || 0)}
                      placeholder="Enter current GPA"
                    />
                  </div>
                  <div>
                    <Label>Current Credits (optional)</Label>
                    <Input
                      type="number"
                      value={currentCredits}
                      onChange={(e) => setCurrentCredits(parseInt(e.target.value) || 0)}
                      placeholder="Enter current credits"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Label className="text-lg font-semibold">Courses</Label>
                    <Button onClick={addCourse} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Course
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {courses.map((course, index) => (
                      <div key={course.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border rounded-lg">
                        <div>
                          <Label className="text-sm">Course Name</Label>
                          <Input
                            value={course.name}
                            onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                            placeholder="Course name"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Grade</Label>
                          <Select 
                            value={course.grade} 
                            onValueChange={(value) => updateCourse(course.id, 'grade', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(gradePoints[scale as keyof typeof gradePoints]).map(grade => (
                                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm">Credits</Label>
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            value={course.credits}
                            onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value) || 0)}
                            placeholder="Credits"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Points</Label>
                          <div className="h-10 flex items-center px-3 bg-gray-50 rounded text-sm">
                            {((gradePoints[scale as keyof typeof gradePoints][course.grade as keyof typeof gradePoints[typeof scale]] || 0) * course.credits).toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-end">
                          <Button 
                            onClick={() => removeCourse(course.id)} 
                            variant="outline" 
                            size="sm"
                            className="w-full"
                            disabled={courses.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={calculateGPA} className="w-full" size="lg">
                  Calculate GPA
                </Button>

                {result && (
                  <div className="space-y-6">
                    <div className={`${getGPACategory(result.semesterGPA).bg} p-6 rounded-lg text-center`}>
                      <div className={`text-4xl font-bold ${getGPACategory(result.semesterGPA).color} mb-2`}>
                        {result.semesterGPA}
                      </div>
                      <div className={`text-xl font-semibold ${getGPACategory(result.semesterGPA).color} mb-2`}>
                        Semester GPA
                      </div>
                      <div className="text-gray-600">
                        {getGPACategory(result.semesterGPA).category}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentGPA > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-600 mb-2">Cumulative GPA</h4>
                          <div className="text-2xl font-bold text-blue-600">{result.cumulativeGPA}</div>
                          <div className="text-sm text-gray-600">{result.totalCumulativeCredits} total credits</div>
                        </div>
                      )}
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-600 mb-2">Quality Points</h4>
                        <div className="text-2xl font-bold text-green-600">{result.totalPoints}</div>
                        <div className="text-sm text-gray-600">{result.totalCredits} credits this semester</div>
                      </div>
                    </div>

                    <Tabs defaultValue="targets" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="targets">Target GPA</TabsTrigger>
                        <TabsTrigger value="distribution">Grade Distribution</TabsTrigger>
                        <TabsTrigger value="scale">Grade Scale</TabsTrigger>
                      </TabsList>

                      <TabsContent value="targets">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(result.creditsForTargets).map(([target, credits]) => (
                            <div key={target} className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-lg font-bold text-gray-700">{target}</div>
                              <div className="text-sm text-gray-600">Target GPA</div>
                              <div className="text-sm mt-2">
                                {credits > 0 ? `${credits} more A credits needed` : 'Already achieved!'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="distribution">
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                          {Object.entries(result.gradeDistribution).map(([grade, count]) => (
                            <div key={grade} className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-gray-700">{count}</div>
                              <div className="text-sm text-gray-600">Grade {grade}</div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="scale">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(gradePoints[scale as keyof typeof gradePoints]).map(([grade, points]) => (
                            <div key={grade} className="bg-gray-50 p-3 rounded-lg text-center">
                              <div className="font-bold">{grade}</div>
                              <div className="text-sm text-gray-600">{points} points</div>
                            </div>
                          ))}
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
                <CardDescription>Recent GPA calculations</CardDescription>
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
                <CardTitle>Academic Standing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Summa Cum Laude:</span>
                    <span>3.9+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Magna Cum Laude:</span>
                    <span>3.7+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cum Laude:</span>
                    <span>3.5+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Good Standing:</span>
                    <span>3.0+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Probation:</span>
                    <span>&lt; 2.0</span>
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

export default GPACalculator;
