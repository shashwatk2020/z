
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Play, Pause, Square, ArrowLeft, BarChart3, Calendar } from 'lucide-react';

interface TimeEntry {
  id: string;
  project: string;
  task: string;
  description: string;
  startTime: string;
  endTime?: string;
  duration: number;
  date: string;
}

const TimeTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentEntry, setCurrentEntry] = useState({
    project: '',
    task: '',
    description: ''
  });
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTracking = () => {
    if (!currentEntry.project || !currentEntry.task) return;
    
    const now = new Date();
    setStartTime(now);
    setIsTracking(true);
    setCurrentTime(0);
  };

  const pauseTracking = () => {
    setIsTracking(false);
  };

  const stopTracking = () => {
    if (!startTime) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    const entry: TimeEntry = {
      id: Date.now().toString(),
      project: currentEntry.project,
      task: currentEntry.task,
      description: currentEntry.description,
      startTime: startTime.toLocaleTimeString(),
      endTime: endTime.toLocaleTimeString(),
      duration,
      date: startTime.toLocaleDateString()
    };

    setTimeEntries([entry, ...timeEntries]);
    setIsTracking(false);
    setCurrentTime(0);
    setStartTime(null);
    setCurrentEntry({ project: '', task: '', description: '' });
  };

  const getTotalTimeToday = () => {
    const today = new Date().toLocaleDateString();
    return timeEntries
      .filter(entry => entry.date === today)
      .reduce((total, entry) => total + entry.duration, 0);
  };

  const getProjectTotals = () => {
    const projectTotals: { [key: string]: number } = {};
    timeEntries.forEach(entry => {
      projectTotals[entry.project] = (projectTotals[entry.project] || 0) + entry.duration;
    });
    return projectTotals;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link to="/tools/productivity" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Productivity Tools
              </Link>
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Time Tracker</h1>
                  <p className="text-gray-600">Track time spent on projects with detailed reporting</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Timer */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Timer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-mono font-bold text-blue-600 mb-4">
                        {formatTime(currentTime)}
                      </div>
                      {isTracking && (
                        <p className="text-sm text-gray-600">
                          {currentEntry.project} - {currentEntry.task}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="project">Project</Label>
                        <Input
                          id="project"
                          value={currentEntry.project}
                          onChange={(e) => setCurrentEntry({...currentEntry, project: e.target.value})}
                          placeholder="Enter project name"
                          disabled={isTracking}
                        />
                      </div>
                      <div>
                        <Label htmlFor="task">Task</Label>
                        <Input
                          id="task"
                          value={currentEntry.task}
                          onChange={(e) => setCurrentEntry({...currentEntry, task: e.target.value})}
                          placeholder="Enter task name"
                          disabled={isTracking}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={currentEntry.description}
                          onChange={(e) => setCurrentEntry({...currentEntry, description: e.target.value})}
                          placeholder="Optional description"
                          disabled={isTracking}
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {!isTracking ? (
                        <Button onClick={startTracking} className="flex-1" disabled={!currentEntry.project || !currentEntry.task}>
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      ) : (
                        <>
                          <Button onClick={pauseTracking} variant="outline" className="flex-1">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                          <Button onClick={stopTracking} variant="destructive" className="flex-1">
                            <Square className="h-4 w-4 mr-2" />
                            Stop
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Today's Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatTime(getTotalTimeToday())}
                    </div>
                    <p className="text-sm text-gray-600">Total time tracked today</p>
                  </CardContent>
                </Card>
              </div>

              {/* Time Entries */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Time Entries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {timeEntries.length === 0 ? (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No time entries yet. Start tracking your first task!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {timeEntries.slice(0, 10).map((entry) => (
                          <div key={entry.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-900">{entry.project}</h3>
                                <p className="text-gray-600">{entry.task}</p>
                                {entry.description && (
                                  <p className="text-sm text-gray-500 mt-1">{entry.description}</p>
                                )}
                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {entry.date} • {entry.startTime} - {entry.endTime}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-blue-600">{formatTime(entry.duration)}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Project Summary */}
                {Object.keys(getProjectTotals()).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(getProjectTotals()).map(([project, duration]) => (
                          <div key={project} className="flex justify-between items-center">
                            <span className="font-medium">{project}</span>
                            <span className="font-mono text-blue-600">{formatTime(duration)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
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

export default TimeTracker;
