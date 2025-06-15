
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: number;
  name: string;
  credits: number;
  grade: string;
  gpa?: number;
}

interface GPAHistory {
  id: number;
  semester: string;
  courses: Course[];
  gpa: number;
  totalCredits: number;
  timestamp: Date;
}

type GradeScale = '4.0' | '5.0';

const GPACalculator = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState({
    name: '',
    credits: '',
    grade: ''
  });
  const [gradeScale, setGradeScale] = useState<GradeScale>('4.0');
  const [semesterName, setSemesterName] = useState('');
  const [history, setHistory] = useState<GPAHistory[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedHistory = localStorage.getItem('gpaHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gpaHistory', JSON.stringify(history));
  }, [history]);

  const gradePoints: Record<GradeScale, Record<string, number>> = {
    '4.0': {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    },
    '5.0': {
      'A+': 5.0, 'A': 4.5, 'A-': 4.0,
      'B+': 3.5, 'B': 3.0, 'B-': 2.5,
      'C+': 2.0, 'C': 1.5, 'C-': 1.0,
      'D+': 0.5, 'D': 0.0, 'D-': 0.0,
      'F': 0.0
    }
  };

  const getGradePoint = (grade: string, scale: GradeScale): number => {
    return gradePoints[scale][grade] || 0;
  };

  const addCourse = () => {
    if (!newCourse.name.trim() || !newCourse.credits || !newCourse.grade) {
      toast({
        title: "Error",
        description: "Please fill in all course details",
        variant: "destructive"
      });
      return;
    }

    const credits = parseFloat(newCourse.credits);
    if (isNaN(credits) || credits <= 0) {
      toast({
        title: "Error",
        description: "Credits must be a positive number",
        variant: "destructive"
      });
      return;
    }

    const course: Course = {
      id: Date.now(),
      name: newCourse.name,
      credits: credits,
      grade: newCourse.grade,
      gpa: getGradePoint(newCourse.grade, gradeScale)
    };

    setCourses([...courses, course]);
    setNewCourse({ name: '', credits: '', grade: '' });
    
    toast({
      title: "Success",
      description: "Course added successfully"
    });
  };

  const removeCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
    toast({
      title: "Success",
      description: "Course removed successfully"
    });
  };

  const calculateGPA = () => {
    if (courses.length === 0) return { gpa: 0, totalCredits: 0 };

    const totalPoints = courses.reduce((sum, course) => {
      const gradePoint = getGradePoint(course.grade, gradeScale);
      return sum + (gradePoint * course.credits);
    }, 0);

    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    return { gpa: Math.round(gpa * 100) / 100, totalCredits };
  };

  const saveToHistory = () => {
    if (courses.length === 0) {
      toast({
        title: "Error",
        description: "Add courses before saving to history",
        variant: "destructive"
      });
      return;
    }

    if (!semesterName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a semester name",
        variant: "destructive"
      });
      return;
    }

    const { gpa, totalCredits } = calculateGPA();
    const semesterRecord: GPAHistory = {
      id: Date.now(),
      semester: semesterName,
      courses: [...courses],
      gpa,
      totalCredits,
      timestamp: new Date()
    };

    setHistory([semesterRecord, ...history]);
    setCourses([]);
    setSemesterName('');

    toast({
      title: "Success",
      description: "Semester saved to history"
    });
  };

  const clearHistory = () => {
    setHistory([]);
    toast({
      title: "Success",
      description: "History cleared"
    });
  };

  const calculateCumulativeGPA = () => {
    if (history.length === 0) return 0;

    const totalPoints = history.reduce((sum, semester) => {
      return sum + (semester.gpa * semester.totalCredits);
    }, 0);

    const totalCredits = history.reduce((sum, semester) => sum + semester.totalCredits, 0);
    
    return totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-green-600';
    if (gpa >= 3.0) return 'text-blue-600';
    if (gpa >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const { gpa: currentGPA, totalCredits: currentCredits } = calculateGPA();
  const cumulativeGPA = calculateCumulativeGPA();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GPA Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate your Grade Point Average with support for multiple grading scales and semester tracking.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculator Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Grade Scale Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Grading Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={gradeScale} onValueChange={(value: GradeScale) => setGradeScale(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4.0">4.0 Scale</SelectItem>
                    <SelectItem value="5.0">5.0 Scale</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Add Course */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Course
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Course Name</Label>
                    <Input
                      placeholder="Mathematics"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>Credits</Label>
                    <Input
                      type="number"
                      placeholder="3"
                      min="0"
                      step="0.5"
                      value={newCourse.credits}
                      onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>Grade</Label>
                    <Select value={newCourse.grade} onValueChange={(value) => setNewCourse({ ...newCourse, grade: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(gradePoints[gradeScale]).map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade} ({gradePoints[gradeScale][grade]})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={addCourse} className="w-full">
                  Add Course
                </Button>
              </CardContent>
            </Card>

            {/* Courses List */}
            <Card>
              <CardHeader>
                <CardTitle>Current Courses</CardTitle>
              </CardHeader>
              <CardContent>
                {courses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No courses added yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{course.name}</div>
                          <div className="text-sm text-gray-600">
                            {course.credits} credits • Grade: {course.grade}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>
                            {getGradePoint(course.grade, gradeScale)} points
                          </Badge>
                          <Button
                            onClick={() => removeCourse(course.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Semester */}
            {courses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Save Semester</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Semester Name</Label>
                    <Input
                      placeholder="Fall 2024"
                      value={semesterName}
                      onChange={(e) => setSemesterName(e.target.value)}
                    />
                  </div>
                  <Button onClick={saveToHistory} className="w-full">
                    Save to History
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results and History */}
          <div className="space-y-6">
            {/* Current GPA */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Current GPA
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`text-4xl font-bold ${getGPAColor(currentGPA)} mb-2`}>
                  {currentGPA.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  {currentCredits} total credits
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Scale: {gradeScale}
                </div>
              </CardContent>
            </Card>

            {/* Cumulative GPA */}
            {history.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Cumulative GPA</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className={`text-3xl font-bold ${getGPAColor(cumulativeGPA)} mb-2`}>
                    {cumulativeGPA.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {history.reduce((sum, s) => sum + s.totalCredits, 0)} total credits
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Across {history.length} semester{history.length !== 1 ? 's' : ''}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* GPA Guide */}
            <Card>
              <CardHeader>
                <CardTitle>GPA Guide ({gradeScale} Scale)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {Object.entries(gradePoints[gradeScale]).map(([grade, points]) => (
                    <div key={grade} className="flex justify-between">
                      <span className="font-medium">{grade}</span>
                      <span>{points.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* History */}
            {history.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Semester History</CardTitle>
                    <Button onClick={clearHistory} variant="outline" size="sm">
                      Clear History
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                  {history.map((semester) => (
                    <div key={semester.id} className="p-3 border rounded-lg">
                      <div className="font-medium">{semester.semester}</div>
                      <div className="text-sm text-gray-600">
                        GPA: <span className={getGPAColor(semester.gpa)}>{semester.gpa.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {semester.totalCredits} credits • {semester.courses.length} courses
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GPACalculator;
