
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Play, Pause, RotateCcw, ArrowLeft, Coffee, Target } from 'lucide-react';

interface PomodoroSession {
  id: string;
  type: 'work' | 'short-break' | 'long-break';
  duration: number;
  completed: boolean;
  timestamp: string;
}

const PomodoroTimer = () => {
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [currentSession, setCurrentSession] = useState<'work' | 'short-break' | 'long-break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSessionComplete = () => {
    const session: PomodoroSession = {
      id: Date.now().toString(),
      type: currentSession,
      duration: getCurrentDuration(),
      completed: true,
      timestamp: new Date().toISOString()
    };
    
    setSessions(prev => [session, ...prev]);
    
    if (currentSession === 'work') {
      setCompletedPomodoros(prev => prev + 1);
      // After 4 work sessions, take a long break
      if ((completedPomodoros + 1) % 4 === 0) {
        setCurrentSession('long-break');
        setTimeLeft(longBreakDuration * 60);
      } else {
        setCurrentSession('short-break');
        setTimeLeft(shortBreakDuration * 60);
      }
    } else {
      setCurrentSession('work');
      setTimeLeft(workDuration * 60);
      if (currentSession === 'long-break') {
        setCurrentCycle(prev => prev + 1);
      }
    }
    
    setIsActive(false);
    
    // Play notification sound (browser notification)
    if (Notification.permission === 'granted') {
      new Notification(`${currentSession === 'work' ? 'Work' : 'Break'} session completed!`, {
        body: `Time for a ${currentSession === 'work' ? (completedPomodoros + 1) % 4 === 0 ? 'long break' : 'short break' : 'work session'}`,
        icon: '/favicon.ico'
      });
    }
  };

  const getCurrentDuration = () => {
    switch (currentSession) {
      case 'work': return workDuration;
      case 'short-break': return shortBreakDuration;
      case 'long-break': return longBreakDuration;
    }
  };

  const startTimer = () => {
    setIsActive(true);
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getCurrentDuration() * 60);
  };

  const skipSession = () => {
    setTimeLeft(0);
  };

  const resetAll = () => {
    setIsActive(false);
    setCurrentSession('work');
    setTimeLeft(workDuration * 60);
    setCompletedPomodoros(0);
    setCurrentCycle(1);
    setSessions([]);
  };

  const getSessionIcon = () => {
    switch (currentSession) {
      case 'work': return <Target className="h-6 w-6" />;
      case 'short-break': 
      case 'long-break': return <Coffee className="h-6 w-6" />;
    }
  };

  const getSessionColor = () => {
    switch (currentSession) {
      case 'work': return 'text-red-600 bg-red-50 border-red-200';
      case 'short-break': return 'text-green-600 bg-green-50 border-green-200';
      case 'long-break': return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getProgressPercentage = () => {
    const totalTime = getCurrentDuration() * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link to="/tools/productivity" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Productivity Tools
              </Link>
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-red-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Pomodoro Timer</h1>
                  <p className="text-gray-600">Boost focus with the Pomodoro Technique</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Timer */}
              <div className="lg:col-span-2">
                <Card className={`${getSessionColor()} border-2`}>
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        {getSessionIcon()}
                        <h2 className="text-xl font-semibold capitalize">
                          {currentSession.replace('-', ' ')} Session
                        </h2>
                      </div>
                      <p className="text-sm opacity-75">
                        Cycle {currentCycle} • Pomodoro {completedPomodoros + 1}
                      </p>
                    </div>

                    <div className="mb-8">
                      <div className="text-6xl font-mono font-bold mb-4">
                        {formatTime(timeLeft)}
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-white/30 rounded-full h-2 mb-4">
                        <div 
                          className="bg-current h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${getProgressPercentage()}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                      {!isActive ? (
                        <Button onClick={startTimer} size="lg">
                          <Play className="h-5 w-5 mr-2" />
                          Start
                        </Button>
                      ) : (
                        <Button onClick={pauseTimer} variant="outline" size="lg">
                          <Pause className="h-5 w-5 mr-2" />
                          Pause
                        </Button>
                      )}
                      <Button onClick={resetTimer} variant="outline" size="lg">
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Reset
                      </Button>
                      <Button onClick={skipSession} variant="ghost" size="lg">
                        Skip
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Sessions History */}
                <Card className="mt-6">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Session History</CardTitle>
                    <Button onClick={resetAll} variant="outline" size="sm">
                      Reset All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {sessions.length === 0 ? (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No sessions completed yet. Start your first Pomodoro!</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {sessions.map((session, index) => (
                          <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {session.type === 'work' ? <Target className="h-4 w-4 text-red-600" /> : <Coffee className="h-4 w-4 text-green-600" />}
                              <span className="capitalize font-medium">{session.type.replace('-', ' ')}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {session.duration} min • {new Date(session.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Settings */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Timer Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="work-duration">Work Duration (minutes)</Label>
                      <Input
                        id="work-duration"
                        type="number"
                        value={workDuration}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setWorkDuration(value);
                          if (currentSession === 'work' && !isActive) {
                            setTimeLeft(value * 60);
                          }
                        }}
                        min={1}
                        max={60}
                        disabled={isActive}
                      />
                    </div>
                    <div>
                      <Label htmlFor="short-break">Short Break (minutes)</Label>
                      <Input
                        id="short-break"
                        type="number"
                        value={shortBreakDuration}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setShortBreakDuration(value);
                          if (currentSession === 'short-break' && !isActive) {
                            setTimeLeft(value * 60);
                          }
                        }}
                        min={1}
                        max={30}
                        disabled={isActive}
                      />
                    </div>
                    <div>
                      <Label htmlFor="long-break">Long Break (minutes)</Label>
                      <Input
                        id="long-break"
                        type="number"
                        value={longBreakDuration}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setLongBreakDuration(value);
                          if (currentSession === 'long-break' && !isActive) {
                            setTimeLeft(value * 60);
                          }
                        }}
                        min={1}
                        max={60}
                        disabled={isActive}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Today's Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-2xl font-bold text-red-600">{completedPomodoros}</div>
                        <div className="text-sm text-gray-600">Completed Pomodoros</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{currentCycle}</div>
                        <div className="text-sm text-gray-600">Current Cycle</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {Math.floor(sessions.filter(s => s.type === 'work').reduce((acc, s) => acc + s.duration, 0) / 60)}h {sessions.filter(s => s.type === 'work').reduce((acc, s) => acc + s.duration, 0) % 60}m
                        </div>
                        <div className="text-sm text-gray-600">Focus Time</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PomodoroTimer;
