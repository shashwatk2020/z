
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Play, Pause, SkipForward, RotateCcw, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PomodoroSession {
  id: number;
  type: 'work' | 'short-break' | 'long-break';
  duration: number;
  completed: boolean;
  date: string;
}

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentType, setCurrentType] = useState<'work' | 'short-break' | 'long-break'>('work');
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedSessions = localStorage.getItem('pomodoroSessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pomodoroSessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    const session: PomodoroSession = {
      id: Date.now(),
      type: currentType,
      duration: getDuration(currentType),
      completed: true,
      date: new Date().toISOString().split('T')[0]
    };
    
    setSessions(prev => [session, ...prev]);
    
    if (currentType === 'work') {
      setCompletedPomodoros(prev => prev + 1);
      
      // Determine next session type
      const nextPomodoros = completedPomodoros + 1;
      if (nextPomodoros % settings.longBreakInterval === 0) {
        setCurrentType('long-break');
        setTimeLeft(settings.longBreakDuration * 60);
        toast({
          title: "Work session complete!",
          description: "Time for a long break"
        });
      } else {
        setCurrentType('short-break');
        setTimeLeft(settings.shortBreakDuration * 60);
        toast({
          title: "Work session complete!",
          description: "Time for a short break"
        });
      }
    } else {
      setCurrentType('work');
      setTimeLeft(settings.workDuration * 60);
      toast({
        title: "Break complete!",
        description: "Time to get back to work"
      });
    }
  };

  const getDuration = (type: 'work' | 'short-break' | 'long-break') => {
    switch (type) {
      case 'work': return settings.workDuration;
      case 'short-break': return settings.shortBreakDuration;
      case 'long-break': return settings.longBreakDuration;
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getDuration(currentType) * 60);
  };

  const skipSession = () => {
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = getDuration(currentType) * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'work': return 'bg-red-100 text-red-800';
      case 'short-break': return 'bg-green-100 text-green-800';
      case 'long-break': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(s => s.date === today);
    
    return {
      workSessions: todaySessions.filter(s => s.type === 'work').length,
      shortBreaks: todaySessions.filter(s => s.type === 'short-break').length,
      longBreaks: todaySessions.filter(s => s.type === 'long-break').length,
      totalTime: todaySessions.reduce((total, s) => total + s.duration, 0)
    };
  };

  const todayStats = getTodayStats();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pomodoro Timer
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Boost your productivity with the Pomodoro Technique - focused work sessions with regular breaks.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timer */}
          <div className="lg:col-span-2">
            <Card className="text-center">
              <CardHeader>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="h-6 w-6" />
                  <Badge className={getTypeColor(currentType)}>
                    {currentType.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className="text-6xl font-mono font-bold text-gray-900 mb-4">
                  {formatTime(timeLeft)}
                </div>
                <Progress value={getProgress()} className="h-3 mb-4" />
              </CardHeader>
              
              <CardContent>
                <div className="flex justify-center gap-4 mb-6">
                  <Button 
                    onClick={toggleTimer} 
                    size="lg"
                    className="px-8"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="h-5 w-5 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={resetTimer} 
                    variant="outline" 
                    size="lg"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reset
                  </Button>
                  
                  <Button 
                    onClick={skipSession} 
                    variant="outline" 
                    size="lg"
                  >
                    <SkipForward className="h-5 w-5 mr-2" />
                    Skip
                  </Button>
                </div>

                <div className="text-sm text-gray-600">
                  {currentType === 'work' 
                    ? `Pomodoro ${completedPomodoros + 1} • Next: ${(completedPomodoros + 1) % settings.longBreakInterval === 0 ? 'Long' : 'Short'} Break`
                    : `Break Time • Next: Work Session`
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats and Settings */}
          <div className="space-y-6">
            {/* Today's Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Work Sessions</span>
                  <Badge variant="outline">{todayStats.workSessions}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Short Breaks</span>
                  <Badge variant="outline">{todayStats.shortBreaks}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Long Breaks</span>
                  <Badge variant="outline">{todayStats.longBreaks}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total Time</span>
                  <Badge variant="outline">{todayStats.totalTime} min</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Settings
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    {showSettings ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardHeader>
              
              {showSettings && (
                <CardContent className="space-y-4">
                  <div>
                    <Label>Work Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={settings.workDuration}
                      onChange={(e) => setSettings({
                        ...settings,
                        workDuration: parseInt(e.target.value) || 25
                      })}
                      min="1"
                      max="60"
                    />
                  </div>
                  
                  <div>
                    <Label>Short Break (minutes)</Label>
                    <Input
                      type="number"
                      value={settings.shortBreakDuration}
                      onChange={(e) => setSettings({
                        ...settings,
                        shortBreakDuration: parseInt(e.target.value) || 5
                      })}
                      min="1"
                      max="30"
                    />
                  </div>
                  
                  <div>
                    <Label>Long Break (minutes)</Label>
                    <Input
                      type="number"
                      value={settings.longBreakDuration}
                      onChange={(e) => setSettings({
                        ...settings,
                        longBreakDuration: parseInt(e.target.value) || 15
                      })}
                      min="1"
                      max="60"
                    />
                  </div>
                  
                  <div>
                    <Label>Long Break Interval</Label>
                    <Input
                      type="number"
                      value={settings.longBreakInterval}
                      onChange={(e) => setSettings({
                        ...settings,
                        longBreakInterval: parseInt(e.target.value) || 4
                      })}
                      min="2"
                      max="10"
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {sessions.slice(0, 10).map((session) => (
                    <div key={session.id} className="flex items-center justify-between text-sm">
                      <Badge className={getTypeColor(session.type)} variant="outline">
                        {session.type.replace('-', ' ')}
                      </Badge>
                      <span className="text-gray-600">{session.duration}m</span>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <div className="text-center text-gray-500 text-sm">
                      No sessions yet
                    </div>
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

export default PomodoroTimer;
