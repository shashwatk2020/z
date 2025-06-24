
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Plus, Flame, ArrowLeft, Calendar } from 'lucide-react';

interface HabitEntry {
  date: string;
  completed: boolean;
}

interface Habit {
  id: string;
  name: string;
  description: string;
  category: 'health' | 'productivity' | 'learning' | 'personal' | 'social';
  frequency: 'daily' | 'weekly';
  entries: HabitEntry[];
  createdAt: string;
}

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'health' as const,
    frequency: 'daily' as const
  });

  const addHabit = () => {
    if (!newHabit.name.trim()) return;

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      description: newHabit.description,
      category: newHabit.category,
      frequency: newHabit.frequency,
      entries: [],
      createdAt: new Date().toISOString()
    };

    setHabits([...habits, habit]);
    setNewHabit({ name: '', description: '', category: 'health', frequency: 'daily' });
  };

  const toggleHabitForDate = (habitId: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const existingEntry = habit.entries.find(entry => entry.date === date);
        let newEntries;
        
        if (existingEntry) {
          newEntries = habit.entries.map(entry =>
            entry.date === date ? { ...entry, completed: !entry.completed } : entry
          );
        } else {
          newEntries = [...habit.entries, { date, completed: true }];
        }
        
        return { ...habit, entries: newEntries };
      }
      return habit;
    }));
  };

  const getStreakCount = (habit: Habit) => {
    if (habit.entries.length === 0) return 0;
    
    const sortedEntries = habit.entries
      .filter(entry => entry.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (sortedEntries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) {
      const dateString = currentDate.toISOString().split('T')[0];
      const hasEntry = sortedEntries.some(entry => entry.date === dateString);
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  const getCompletionRate = (habit: Habit) => {
    if (habit.entries.length === 0) return 0;
    const completed = habit.entries.filter(entry => entry.completed).length;
    return Math.round((completed / habit.entries.length) * 100);
  };

  const isCompletedForDate = (habit: Habit, date: string) => {
    const entry = habit.entries.find(entry => entry.date === date);
    return entry?.completed || false;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'bg-green-100 text-green-800';
      case 'productivity': return 'bg-blue-100 text-blue-800';
      case 'learning': return 'bg-purple-100 text-purple-800';
      case 'personal': return 'bg-yellow-100 text-yellow-800';
      case 'social': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();
  const today = new Date().toISOString().split('T')[0];

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
                <CheckCircle className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Habit Tracker</h1>
                  <p className="text-gray-600">Build positive habits with daily tracking and streaks</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Add Habit */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Habit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Habit name"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  />
                  <select
                    value={newHabit.category}
                    onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="health">Health</option>
                    <option value="productivity">Productivity</option>
                    <option value="learning">Learning</option>
                    <option value="personal">Personal</option>
                    <option value="social">Social</option>
                  </select>
                  <select
                    value={newHabit.frequency}
                    onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                  <Button onClick={addHabit} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Habit
                  </Button>
                </CardContent>
              </Card>

              {/* Habits List */}
              <div className="lg:col-span-3 space-y-6">
                {habits.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No habits yet. Add your first habit to get started!</p>
                    </CardContent>
                  </Card>
                ) : (
                  habits.map((habit) => {
                    const streak = getStreakCount(habit);
                    const completionRate = getCompletionRate(habit);
                    
                    return (
                      <Card key={habit.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-lg">{habit.name}</h3>
                                <Badge className={getCategoryColor(habit.category)}>
                                  {habit.category}
                                </Badge>
                                <Badge variant="outline">
                                  {habit.frequency}
                                </Badge>
                              </div>
                              
                              {habit.description && (
                                <p className="text-gray-600 text-sm mb-3">{habit.description}</p>
                              )}

                              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                                <span className="flex items-center">
                                  <Flame className="h-4 w-4 mr-1 text-orange-500" />
                                  {streak} day streak
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {completionRate}% completion rate
                                </span>
                                <span>
                                  Created: {new Date(habit.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Last 7 Days */}
                          <div>
                            <h4 className="font-medium mb-3">Last 7 Days</h4>
                            <div className="grid grid-cols-7 gap-2">
                              {last7Days.map((date) => {
                                const isCompleted = isCompletedForDate(habit, date);
                                const isToday = date === today;
                                const dayName = new Date(date).toLocaleDateString('en', { weekday: 'short' });
                                const dayNumber = new Date(date).getDate();
                                
                                return (
                                  <div key={date} className="text-center">
                                    <div className="text-xs text-gray-500 mb-1">{dayName}</div>
                                    <button
                                      onClick={() => toggleHabitForDate(habit.id, date)}
                                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                        isCompleted
                                          ? 'bg-green-500 text-white'
                                          : isToday
                                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }`}
                                    >
                                      {isCompleted ? (
                                        <CheckCircle className="h-5 w-5" />
                                      ) : (
                                        <Circle className="h-5 w-5" />
                                      )}
                                    </button>
                                    <div className="text-xs text-gray-500 mt-1">{dayNumber}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Today's Action */}
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Today ({new Date().toLocaleDateString()})</span>
                              <Button
                                onClick={() => toggleHabitForDate(habit.id, today)}
                                variant={isCompletedForDate(habit, today) ? "default" : "outline"}
                                size="sm"
                              >
                                {isCompletedForDate(habit, today) ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Completed
                                  </>
                                ) : (
                                  <>
                                    <Circle className="h-4 w-4 mr-2" />
                                    Mark Complete
                                  </>
                                )}
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
      </main>
      <Footer />
    </div>
  );
};

export default HabitTracker;
