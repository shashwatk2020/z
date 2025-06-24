
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, Calendar, TrendingUp, ArrowLeft, Trophy } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'professional' | 'health' | 'learning' | 'financial';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

const GoalTracker = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal' as const,
    targetValue: 0,
    unit: '',
    deadline: ''
  });
  const [filterCategory, setFilterCategory] = useState('all');

  const addGoal = () => {
    if (!newGoal.title.trim() || newGoal.targetValue <= 0) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      targetValue: newGoal.targetValue,
      currentValue: 0,
      unit: newGoal.unit,
      deadline: newGoal.deadline,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'personal',
      targetValue: 0,
      unit: '',
      deadline: ''
    });
  };

  const updateProgress = (goalId: string, newValue: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedGoal = { ...goal, currentValue: Math.max(0, newValue) };
        if (updatedGoal.currentValue >= updatedGoal.targetValue) {
          updatedGoal.status = 'completed';
        }
        return updatedGoal;
      }
      return goal;
    }));
  };

  const toggleGoalStatus = (goalId: string) => {
    setGoals(goals.map(goal =>
      goal.id === goalId
        ? { 
            ...goal, 
            status: goal.status === 'active' ? 'paused' : 'active'
          }
        : goal
    ));
  };

  const getProgress = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return 'bg-blue-100 text-blue-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'health': return 'bg-green-100 text-green-800';
      case 'learning': return 'bg-yellow-100 text-yellow-800';
      case 'financial': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysRemaining = (deadline: string) => {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredGoals = goals.filter(goal =>
    filterCategory === 'all' || goal.category === filterCategory
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link to="/tools/productivity" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Productivity Tools
              </Link>
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Goal Tracker</h1>
                  <p className="text-gray-600">Set and track personal and professional goals</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Add Goal */}
              <Card>
                <CardHeader>
                  <CardTitle>Create New Goal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Goal title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    rows={3}
                  />
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="personal">Personal</option>
                    <option value="professional">Professional</option>
                    <option value="health">Health</option>
                    <option value="learning">Learning</option>
                    <option value="financial">Financial</option>
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Target"
                      value={newGoal.targetValue || ''}
                      onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseInt(e.target.value) || 0 })}
                    />
                    <Input
                      placeholder="Unit"
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    />
                  </div>
                  <Input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                  <Button onClick={addGoal} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Goal
                  </Button>
                </CardContent>
              </Card>

              {/* Goals List */}
              <div className="lg:col-span-3 space-y-6">
                {/* Filters */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={filterCategory === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterCategory('all')}
                      >
                        All Goals ({goals.length})
                      </Button>
                      {['personal', 'professional', 'health', 'learning', 'financial'].map(category => (
                        <Button
                          key={category}
                          variant={filterCategory === category ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFilterCategory(category)}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)} 
                          ({goals.filter(g => g.category === category).length})
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Goals */}
                <div className="space-y-4">
                  {filteredGoals.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {filterCategory === 'all' 
                            ? 'No goals yet. Create your first goal!' 
                            : `No ${filterCategory} goals yet.`
                          }
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredGoals.map((goal) => {
                      const progress = getProgress(goal);
                      const daysRemaining = getDaysRemaining(goal.deadline);
                      
                      return (
                        <Card key={goal.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold text-lg">{goal.title}</h3>
                                  <Badge className={getCategoryColor(goal.category)}>
                                    {goal.category}
                                  </Badge>
                                  <Badge className={getStatusColor(goal.status)}>
                                    {goal.status}
                                  </Badge>
                                  {goal.status === 'completed' && (
                                    <Trophy className="h-5 w-5 text-yellow-500" />
                                  )}
                                </div>
                                
                                {goal.description && (
                                  <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                                )}

                                <div className="space-y-3">
                                  <div>
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-sm font-medium">Progress</span>
                                      <span className="text-sm text-gray-600">
                                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                                      </span>
                                    </div>
                                    <Progress value={progress} className="h-3" />
                                    <p className="text-xs text-gray-500 mt-1">
                                      {progress.toFixed(1)}% complete
                                    </p>
                                  </div>

                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      Created: {new Date(goal.createdAt).toLocaleDateString()}
                                    </span>
                                    
                                    {goal.deadline && (
                                      <span className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                                        {daysRemaining !== null && (
                                          <span className={`ml-1 ${daysRemaining < 0 ? 'text-red-600' : daysRemaining <= 7 ? 'text-orange-600' : 'text-green-600'}`}>
                                            ({daysRemaining < 0 ? 'overdue' : `${daysRemaining} days left`})
                                          </span>
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col space-y-2 ml-6">
                                {goal.status !== 'completed' && (
                                  <div className="flex space-x-2">
                                    <Input
                                      type="number"
                                      value={goal.currentValue}
                                      onChange={(e) => updateProgress(goal.id, parseInt(e.target.value) || 0)}
                                      className="w-20"
                                    />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateProgress(goal.id, goal.currentValue + 1)}
                                    >
                                      +1
                                    </Button>
                                  </div>
                                )}
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleGoalStatus(goal.id)}
                                  disabled={goal.status === 'completed'}
                                >
                                  {goal.status === 'active' ? 'Pause' : 'Resume'}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GoalTracker;
