
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Grid, Plus, ArrowLeft, AlertTriangle, Clock } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  quadrant: 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';
  createdAt: string;
}

const PriorityMatrix = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    quadrant: 'urgent-important' as const
  });

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      quadrant: newTask.quadrant,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', quadrant: 'urgent-important' });
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getTasksByQuadrant = (quadrant: Task['quadrant']) => {
    return tasks.filter(task => task.quadrant === quadrant);
  };

  const getQuadrantInfo = (quadrant: Task['quadrant']) => {
    switch (quadrant) {
      case 'urgent-important':
        return {
          title: 'Do First',
          subtitle: 'Urgent & Important',
          description: 'Critical tasks that need immediate attention',
          color: 'bg-red-50 border-red-200',
          headerColor: 'bg-red-100 text-red-800',
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />
        };
      case 'not-urgent-important':
        return {
          title: 'Schedule',
          subtitle: 'Important, Not Urgent',
          description: 'Important tasks to plan and schedule',
          color: 'bg-blue-50 border-blue-200',
          headerColor: 'bg-blue-100 text-blue-800',
          icon: <Clock className="h-5 w-5 text-blue-500" />
        };
      case 'urgent-not-important':
        return {
          title: 'Delegate',
          subtitle: 'Urgent, Not Important',
          description: 'Tasks that are urgent but can be delegated',
          color: 'bg-yellow-50 border-yellow-200',
          headerColor: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="h-5 w-5 text-yellow-500" />
        };
      case 'not-urgent-not-important':
        return {
          title: 'Eliminate',
          subtitle: 'Neither Urgent nor Important',
          description: 'Low priority tasks to minimize or eliminate',
          color: 'bg-gray-50 border-gray-200',
          headerColor: 'bg-gray-100 text-gray-800',
          icon: <Grid className="h-5 w-5 text-gray-500" />
        };
    }
  };

  const quadrants: Task['quadrant'][] = [
    'urgent-important',
    'not-urgent-important',
    'urgent-not-important',
    'not-urgent-not-important'
  ];

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
                <Grid className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Priority Matrix</h1>
                  <p className="text-gray-600">Organize tasks using Eisenhower priority matrix</p>
                </div>
              </div>
            </div>

            {/* Add Task */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Add New Task</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-48">
                    <Input
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>
                  <div className="flex-1 min-w-48">
                    <Textarea
                      placeholder="Description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <select 
                    value={newTask.quadrant}
                    onChange={(e) => setNewTask({ ...newTask, quadrant: e.target.value as any })}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="urgent-important">Urgent & Important</option>
                    <option value="not-urgent-important">Important, Not Urgent</option>
                    <option value="urgent-not-important">Urgent, Not Important</option>
                    <option value="not-urgent-not-important">Neither Urgent nor Important</option>
                  </select>
                  <Button onClick={addTask}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Priority Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quadrants.map((quadrant) => {
                const info = getQuadrantInfo(quadrant);
                const quadrantTasks = getTasksByQuadrant(quadrant);
                
                return (
                  <Card key={quadrant} className={`${info.color} border-2`}>
                    <CardHeader className={`${info.headerColor} rounded-t-lg`}>
                      <div className="flex items-center space-x-2">
                        {info.icon}
                        <div>
                          <CardTitle className="text-lg">{info.title}</CardTitle>
                          <p className="text-sm opacity-90">{info.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-xs opacity-75 mt-1">{info.description}</p>
                    </CardHeader>
                    
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <Badge variant="secondary">{quadrantTasks.length} tasks</Badge>
                      </div>
                      
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {quadrantTasks.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Grid className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No tasks in this quadrant</p>
                          </div>
                        ) : (
                          quadrantTasks.map((task) => (
                            <div
                              key={task.id}
                              className="bg-white rounded-lg p-3 shadow-sm border"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                                  {task.description && (
                                    <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                                  )}
                                  <p className="text-xs text-gray-500">
                                    Added: {new Date(task.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteTask(task.id)}
                                  className="ml-2"
                                >
                                  ✕
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Matrix Guide */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>How to Use the Eisenhower Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-red-800">🔥 Do First (Urgent & Important)</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Crisis situations, emergencies, deadline-driven projects, and pressing problems.
                    </p>
                    
                    <h4 className="font-semibold mb-2 text-blue-800">📅 Schedule (Important, Not Urgent)</h4>
                    <p className="text-sm text-gray-600">
                      Long-term development, strategic planning, prevention, and relationship building.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-yellow-800">👥 Delegate (Urgent, Not Important)</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Interruptions, some emails, some meetings, and tasks others can do.
                    </p>
                    
                    <h4 className="font-semibold mb-2 text-gray-800">🗑️ Eliminate (Neither Urgent nor Important)</h4>
                    <p className="text-sm text-gray-600">
                      Time wasters, excessive social media, unnecessary meetings, and trivial activities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PriorityMatrix;
