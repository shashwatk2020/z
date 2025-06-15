
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Timer, Play, Pause, Square, Plus, Trash2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimeEntry {
  id: number;
  project: string;
  task: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  isRunning: boolean;
}

const TimeTracker = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    project: '',
    task: ''
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    const savedEntries = localStorage.getItem('timeTracker');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timeTracker', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const startTimer = () => {
    if (!newEntry.project.trim() || !newEntry.task.trim()) {
      toast({
        title: "Error",
        description: "Please enter project and task names",
        variant: "destructive"
      });
      return;
    }

    // Stop any running timers
    setEntries(prev => prev.map(entry => ({
      ...entry,
      isRunning: false,
      endTime: entry.isRunning ? new Date() : entry.endTime,
      duration: entry.isRunning ? 
        entry.duration + Math.floor((new Date().getTime() - new Date(entry.startTime).getTime()) / 1000) : 
        entry.duration
    })));

    const entry: TimeEntry = {
      id: Date.now(),
      project: newEntry.project,
      task: newEntry.task,
      startTime: new Date(),
      duration: 0,
      isRunning: true
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({ project: '', task: '' });

    toast({
      title: "Success",
      description: "Timer started"
    });
  };

  const stopTimer = (id: number) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === id && entry.isRunning) {
        const endTime = new Date();
        const duration = entry.duration + Math.floor((endTime.getTime() - new Date(entry.startTime).getTime()) / 1000);
        return {
          ...entry,
          endTime,
          duration,
          isRunning: false
        };
      }
      return entry;
    }));

    toast({
      title: "Success",
      description: "Timer stopped"
    });
  };

  const deleteEntry = (id: number) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: "Success",
      description: "Entry deleted"
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getCurrentDuration = (entry: TimeEntry) => {
    if (!entry.isRunning) return entry.duration;
    
    const now = currentTime.getTime();
    const start = new Date(entry.startTime).getTime();
    return entry.duration + Math.floor((now - start) / 1000);
  };

  const getTotalTime = () => {
    return entries.reduce((total, entry) => total + getCurrentDuration(entry), 0);
  };

  const getTodayTime = () => {
    const today = new Date().toDateString();
    return entries
      .filter(entry => new Date(entry.startTime).toDateString() === today)
      .reduce((total, entry) => total + getCurrentDuration(entry), 0);
  };

  const getProjectTime = (project: string) => {
    return entries
      .filter(entry => entry.project === project)
      .reduce((total, entry) => total + getCurrentDuration(entry), 0);
  };

  const projects = [...new Set(entries.map(entry => entry.project))];
  const runningEntry = entries.find(entry => entry.isRunning);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Time Tracker
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Track time spent on projects and tasks to improve productivity and billing accuracy.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{formatDuration(getTotalTime())}</div>
              <div className="text-sm text-gray-600">Total Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{formatDuration(getTodayTime())}</div>
              <div className="text-sm text-gray-600">Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{entries.length}</div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timer Control */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Start Timer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Project</Label>
                  <Input
                    placeholder="Project name"
                    value={newEntry.project}
                    onChange={(e) => setNewEntry({ ...newEntry, project: e.target.value })}
                    disabled={!!runningEntry}
                  />
                </div>
                
                <div>
                  <Label>Task</Label>
                  <Input
                    placeholder="Task description"
                    value={newEntry.task}
                    onChange={(e) => setNewEntry({ ...newEntry, task: e.target.value })}
                    disabled={!!runningEntry}
                  />
                </div>

                {runningEntry ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-medium text-green-800">Currently Tracking</div>
                      <div className="text-sm text-green-600">{runningEntry.project} - {runningEntry.task}</div>
                      <div className="text-lg font-mono text-green-800 mt-1">
                        {formatDuration(getCurrentDuration(runningEntry))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => stopTimer(runningEntry.id)} 
                      variant="destructive" 
                      className="w-full"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop Timer
                    </Button>
                  </div>
                ) : (
                  <Button onClick={startTimer} className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Timer
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Project Summary */}
            {projects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div key={project} className="flex justify-between items-center">
                        <div className="font-medium">{project}</div>
                        <Badge variant="outline">
                          {formatDuration(getProjectTime(project))}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Time Entries */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time Entries
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {entries.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No time entries yet
                    </div>
                  ) : (
                    entries.map((entry) => (
                      <div key={entry.id} className={`p-4 border rounded-lg ${entry.isRunning ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{entry.project}</h4>
                              {entry.isRunning && (
                                <Badge className="bg-green-100 text-green-800">
                                  Running
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{entry.task}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Started: {new Date(entry.startTime).toLocaleTimeString()}</span>
                              {entry.endTime && (
                                <span>Ended: {new Date(entry.endTime).toLocaleTimeString()}</span>
                              )}
                              <span>Date: {new Date(entry.startTime).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="font-mono text-lg font-semibold">
                                {formatDuration(getCurrentDuration(entry))}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                              {entry.isRunning ? (
                                <Button
                                  onClick={() => stopTimer(entry.id)}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Pause className="h-3 w-3" />
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => deleteEntry(entry.id)}
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
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

export default TimeTracker;
