
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Plus, Trash2, Calendar, Flame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Habit {
  id: number;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: string;
  streak: number;
  completions: { [date: string]: boolean };
  createdAt: Date;
}

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    frequency: 'daily' as const,
    category: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedHabits = localStorage.getItem('habitTracker');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habitTracker', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (!newHabit.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a habit name",
        variant: "destructive"
      });
      return;
    }

    const habit: Habit = {
      id: Date.now(),
      name: newHabit.name,
      description: newHabit.description,
      frequency: newHabit.frequency,
      category: newHabit.category || 'General',
      streak: 0,
      completions: {},
      createdAt: new Date()
    };

    setHabits([...habits, habit]);
    setNewHabit({
      name: '',
      description: '',
      frequency: 'daily',
      category: ''
    });

    toast({
      title: "Success",
      description: "Habit added successfully"
    });
  };

  const toggleCompletion = (habitId: number, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const updatedCompletions = {
          ...habit.completions,
          [date]: !habit.completions[date]
        };
        
        // Calculate streak
        let streak = 0;
        const today = new Date();
        let currentDate = new Date(today);
        
        while (true) {
          const dateStr = currentDate.toISOString().split('T')[0];
          if (updatedCompletions[dateStr]) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }
        
        return {
          ...habit,
          completions: updatedCompletions,
          streak
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id: number) => {
    setHabits(habits.filter(habit => habit.id !== id));
    toast({
      title: "Success",
      description: "Habit deleted successfully"
    });
  };

  const getLastWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getCompletionRate = (habit: Habit) => {
    const lastWeekDates = getLastWeekDates();
    const completions = lastWeekDates.filter(date => habit.completions[date]).length;
    return Math.round((completions / lastWeekDates.length) * 100);
  };

  const lastWeekDates = getLastWeekDates();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Habit Tracker
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Build and maintain positive habits with daily tracking and streak monitoring.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Add New Habit */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Habit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    placeholder="Exercise"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Input
                    placeholder="30 minutes daily"
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Frequency</Label>
                  <Select value={newHabit.frequency} onValueChange={(value: any) => setNewHabit({ ...newHabit, frequency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Category</Label>
                  <Input
                    placeholder="Health"
                    value={newHabit.category}
                    onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                  />
                </div>

                <Button onClick={addHabit} className="w-full">
                  Add Habit
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Habits List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Your Habits
                </CardTitle>
                <CardDescription>
                  Track your daily habits and build streaks
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {habits.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No habits added yet
                    </div>
                  ) : (
                    habits.map((habit) => (
                      <div key={habit.id} className="p-4 border rounded-lg bg-white">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-medium">{habit.name}</h4>
                            {habit.description && (
                              <p className="text-sm text-gray-600">{habit.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{habit.category}</Badge>
                              <Badge variant="outline">{habit.frequency}</Badge>
                              <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                {habit.streak} day streak
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-800">
                                {getCompletionRate(habit)}% this week
                              </Badge>
                            </div>
                          </div>
                          <Button
                            onClick={() => deleteHabit(habit.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700">Last 7 days</div>
                          <div className="grid grid-cols-7 gap-2">
                            {lastWeekDates.map((date) => (
                              <div key={date} className="text-center">
                                <div className="text-xs text-gray-500 mb-1">
                                  {new Date(date).toLocaleDateString('en', { weekday: 'short' })}
                                </div>
                                <div className="flex justify-center">
                                  <Checkbox
                                    checked={habit.completions[date] || false}
                                    onCheckedChange={() => toggleCompletion(habit.id, date)}
                                  />
                                </div>
                              </div>
                            ))}
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

export default HabitTracker;
