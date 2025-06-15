
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: number;
  title: string;
  description: string;
  quadrant: 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';
  createdAt: Date;
}

const PriorityMatrix = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    quadrant: 'urgent-important' as const
  });
  const { toast } = useToast();

  const quadrants = [
    {
      id: 'urgent-important',
      title: 'Do First',
      subtitle: 'Urgent & Important',
      color: 'bg-red-50 border-red-200',
      headerColor: 'bg-red-100 text-red-800'
    },
    {
      id: 'not-urgent-important',
      title: 'Schedule',
      subtitle: 'Not Urgent & Important',
      color: 'bg-blue-50 border-blue-200',
      headerColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'urgent-not-important',
      title: 'Delegate',
      subtitle: 'Urgent & Not Important',
      color: 'bg-yellow-50 border-yellow-200',
      headerColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'not-urgent-not-important',
      title: 'Eliminate',
      subtitle: 'Not Urgent & Not Important',
      color: 'bg-gray-50 border-gray-200',
      headerColor: 'bg-gray-100 text-gray-800'
    }
  ];

  useEffect(() => {
    const savedTasks = localStorage.getItem('priorityMatrix');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('priorityMatrix', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      quadrant: newTask.quadrant,
      createdAt: new Date()
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      quadrant: 'urgent-important'
    });

    toast({
      title: "Success",
      description: "Task added to matrix"
    });
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Success",
      description: "Task deleted successfully"
    });
  };

  const getTasksForQuadrant = (quadrantId: string) => {
    return tasks.filter(task => task.quadrant === quadrantId);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Priority Matrix
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Organize your tasks using the Eisenhower Priority Matrix to focus on what matters most.
          </p>
        </div>

        {/* Add New Task */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              
              <div className="flex flex-col justify-end">
                <Button onClick={addTask} className="w-full">
                  Add to Matrix
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {quadrants.map((quadrant) => (
            <Card key={quadrant.id} className={`${quadrant.color} min-h-96`}>
              <CardHeader>
                <div className={`p-2 rounded-lg ${quadrant.headerColor}`}>
                  <CardTitle className="text-lg font-semibold">{quadrant.title}</CardTitle>
                  <CardDescription className="text-sm font-medium">
                    {quadrant.subtitle}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {getTasksForQuadrant(quadrant.id).length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No tasks in this quadrant
                  </div>
                ) : (
                  getTasksForQuadrant(quadrant.id).map((task) => (
                    <Card key={task.id} className="bg-white shadow-sm">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{task.title}</h4>
                            {task.description && (
                              <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                              Added {new Date(task.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Button
                            onClick={() => deleteTask(task.id)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legend */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Matrix Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg border">
                <div className="font-semibold text-red-800">Do First</div>
                <div className="text-sm text-red-600">Handle immediately</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border">
                <div className="font-semibold text-blue-800">Schedule</div>
                <div className="text-sm text-blue-600">Plan when to do</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border">
                <div className="font-semibold text-yellow-800">Delegate</div>
                <div className="text-sm text-yellow-600">Assign to others</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border">
                <div className="font-semibold text-gray-800">Eliminate</div>
                <div className="text-sm text-gray-600">Remove or minimize</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PriorityMatrix;
