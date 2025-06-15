
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Trash2, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Goal {
  id: number;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  createdAt: Date;
}

const GoalTracker = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: '',
    targetDate: '',
    priority: 'medium' as const
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedGoals = localStorage.getItem('goalTracker');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('goalTracker', JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (!newGoal.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a goal title",
        variant: "destructive"
      });
      return;
    }

    const goal: Goal = {
      id: Date.now(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category || 'Personal',
      targetDate: newGoal.targetDate,
      priority: newGoal.priority,
      status: 'not-started',
      progress: 0,
      createdAt: new Date()
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: '',
      targetDate: '',
      priority: 'medium'
    });

    toast({
      title: "Success",
      description: "Goal added successfully"
    });
  };

  const updateProgress = (id: number, progress: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const status = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started';
        return { ...goal, progress, status };
      }
      return goal;
    }));
  };

  const deleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast({
      title: "Success",
      description: "Goal deleted successfully"
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Goal Tracker
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Set, track, and achieve your personal and professional goals with progress monitoring.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add New Goal */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Goal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    placeholder="Enter goal title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Enter goal description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Priority</Label>
                    <Select value={newGoal.priority} onValueChange={(value: any) => setNewGoal({ ...newGoal, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Category</Label>
                    <Input
                      placeholder="Category"
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Target Date</Label>
                  <Input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  />
                </div>

                <Button onClick={addGoal} className="w-full">
                  Add Goal
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Goals List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your Goals
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {goals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No goals added yet
                    </div>
                  ) : (
                    goals.map((goal) => (
                      <div key={goal.id} className="p-4 border rounded-lg bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium">{goal.title}</h4>
                            {goal.description && (
                              <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                            )}
                          </div>
                          <Button
                            onClick={() => deleteGoal(goal.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(goal.priority)}>
                              {goal.priority}
                            </Badge>
                            <Badge className={getStatusColor(goal.status)}>
                              {goal.status.replace('-', ' ')}
                            </Badge>
                            <Badge variant="outline">
                              {goal.category}
                            </Badge>
                            {goal.targetDate && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {goal.targetDate}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Progress</span>
                              <span className="text-sm font-medium">{goal.progress}%</span>
                            </div>
                            <Progress value={goal.progress} className="h-2" />
                            
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={goal.progress}
                                onChange={(e) => updateProgress(goal.id, parseInt(e.target.value) || 0)}
                                className="w-20 h-8"
                              />
                              <span className="text-sm text-gray-500">%</span>
                              {goal.status === 'completed' && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GoalTracker;
