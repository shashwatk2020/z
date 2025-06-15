
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Plus, Trash2, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: number;
  name: string;
  grade: string;
  credits: number;
}

interface GradeScale {
  [key: string]: number;
}

interface GradeScales {
  [key: string]: GradeScale;
}

const GPACalculator = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: '', grade: '', credits: 3 }
  ]);
  const [scale, setScale] = useState('4.0');
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const gradeScales: GradeScales = {
    '4.0': {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    },
    '5.0': {
      'A+': 5.0, 'A': 4.8, 'A-': 4.5,
      'B+': 4.2, 'B': 3.8, 'B-': 3.5,
      'C+': 3.2, 'C': 2.8, 'C-': 2.5,
      'D+': 2.2, 'D': 1.8, 'D-': 1.5,
      'F': 0.0
    }
  };

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const addCourse = () => {
    const newId = Math.max(...courses.map(c => c.id), 0) + 1;
    setCourses([...courses, { id: newId, name: '', grade: '', credits: 3 }]);
  };

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: number, field: keyof Course, value: string | number) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const calculateGPA = () => {
    const validCourses = courses.filter(course => 
      course.name.trim() && course.grade && course.credits > 0
    );

    if (validCourses.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one valid course",
        variant: "destructive"
      });
      return;
    }

    const currentScale = gradeScales[scale] as GradeScale;
    let totalPoints = 0;
    let totalCredits = 0;
    const courseDetails = [];

    for (const course of validCourses) {
      const gradePoint = currentScale[course.grade];
      if (gradePoint !== undefined) {
        const points = gradePoint * course.credits;
        totalPoints += points;
        totalCredits += course.credits;
        courseDetails.push({
          ...course,
          gradePoint,
          points
        });
      }
    }

    if (totalCredits === 0) {
      toast({
        title: "Error",
        description: "No valid courses found",
        variant: "destructive"
      });
      return;
    }

    const gpa = totalPoints / totalCredits;
    const gpaCategory = getGPACategory(gpa, scale);

    const gpaResult = {
      gpa: parseFloat(gpa.toFixed(3)),
      totalCredits,
      totalPoints: parseFloat(totalPoints.toFixed(2)),
      courseDetails,
      category: gpaCategory,
      scale,
      averageGrade: getAverageGradeLetter(gpa, scale)
    };

    setResult(gpaResult);
    addToHistory(`GPA: ${gpa.toFixed(3)} (${totalCredits} credits, ${scale} scale)`);
    
    toast({
      title: "GPA Calculated",
      description: `Your GPA is ${gpa.toFixed(3)} on a ${scale} scale`
    });
  };

  const getGPACategory = (gpa: number, scaleType: string) => {
    const maxScale = parseFloat(scaleType);
    const percentage = (gpa / maxScale) * 100;
    
    if (percentage >= 90) return { category: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (percentage >= 80) return { category: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (percentage >= 70) return { category: 'Satisfactory', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (percentage >= 60) return { category: 'Below Average', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { category: 'Poor', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getAverageGradeLetter = (gpa: number, scaleType: string) => {
    const currentScale = gradeScales[scaleType] as GradeScale;
    
    for (const [grade, value] of Object.entries(currentScale)) {
      if (gpa >= value) {
        return grade;
      }
    }
    return 'F';
  };

  const getImprovementSuggestions = (gpa: number) => {
    const suggestions = [];
    
    if (gpa < 2.0) {
      suggestions.push("Consider meeting with academic advisors");
      suggestions.push("Form study groups with classmates");
      suggestions.push("Utilize tutoring services");
      suggestions.push("Reduce course load to focus on quality");
    } else if (gpa < 3.0) {
      suggestions.push("Improve time management skills");
      suggestions.push("Seek help from professors during office hours");
      suggestions.push("Review and improve study techniques");
      suggestions.push("Consider study skills workshops");
    } else if (gpa < 3.5) {
      suggestions.push("Set specific grade goals for each course");
      suggestions.push("Participate actively in class discussions");
      suggestions.push("Form study partnerships");
      suggestions.push("Seek challenging coursework to grow");
    } else {
      suggestions.push("Maintain excellent study habits");
      suggestions.push("Consider honor courses or research opportunities");
      suggestions.push("Help other students through tutoring");
      suggestions.push("Explore leadership opportunities");
    }
    
    return suggestions;
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GPA Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate your Grade Point Average with detailed course analysis and improvement recommendations.
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
                <CardDescription>Enter your courses and grades to calculate your GPA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Grading Scale</Label>
                  <Select value={scale} onValueChange={setScale}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4.0">4.0 Scale (Standard)</SelectItem>
                      <SelectItem value="5.0">5.0 Scale (Weighted)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Courses</h3>
                    <Button onClick={addCourse} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Course
                    </Button>
                  </div>

                  {courses.map((course) => (
                    <div key={course.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                      <div>
                        <Label>Course Name</Label>
                        <Input
                          placeholder="Course name"
                          value={course.name}
                          onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Grade</Label>
                        <Select 
                          value={course.grade} 
                          onValueChange={(value) => updateCourse(course.id, 'grade', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(gradeScales[scale] as GradeScale).map(grade => (
                              <SelectItem key={grade} value={grade}>
                                {grade} ({gradeScales[scale][grade]})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Credit Hours</Label>
                        <Input
                          type="number"
                          min="0"
                          max="6"
                          step="0.5"
                          value={course.credits}
                          onChange={(e) => updateCourse(course.id, 'credits', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button 
                          onClick={() => removeCourse(course.id)}
                          variant="outline"
                          size="sm"
                          disabled={courses.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={calculateGPA} className="w-full" size="lg">
                  Calculate GPA
                </Button>

                {result && (
                  <div className="space-y-6">
                    <div className={`${result.category.bg} p-6 rounded-lg text-center`}>
                      <div className={`text-4xl font-bold ${result.category.color} mb-2`}>
                        {result.gpa}
                      </div>
                      <div className={`text-xl font-semibold ${result.category.color} mb-2`}>
                        {result.category.category}
                      </div>
                      <div className="text-gray-600">
                        GPA on {result.scale} scale ({result.averageGrade} average)
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{result.totalCredits}</div>
                        <div className="text-sm text-gray-600">Total Credit Hours</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{result.totalPoints}</div>
                        <div className="text-sm text-gray-600">Total Grade Points</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">{result.courseDetails.length}</div>
                        <div className="text-sm text-gray-600">Courses Calculated</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Course Breakdown</h4>
                      <div className="space-y-2">
                        {result.courseDetails.map((course: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                            <div>
                              <span className="font-medium">{course.name}</span>
                              <span className="text-gray-500 ml-2">({course.credits} credits)</span>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{course.grade}</div>
                              <div className="text-sm text-gray-500">{course.points.toFixed(2)} pts</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Improvement Suggestions</h4>
                      <ul className="space-y-2">
                        {getImprovementSuggestions(result.gpa).map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{suggestion}</span>
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
                <CardTitle>Grade Scale Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold">{scale} Scale:</div>
                  {Object.entries(gradeScales[scale] as GradeScale).map(([grade, value]) => (
                    <div key={grade} className="flex justify-between">
                      <span>{grade}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
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
