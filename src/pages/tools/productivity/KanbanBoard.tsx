
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, ArrowLeft } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'progress', title: 'In Progress', tasks: [] },
    { id: 'review', title: 'Review', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] }
  ]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as const });
  const [activeColumn, setActiveColumn] = useState('todo');

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      assignee: 'You'
    };

    setColumns(columns.map(col => 
      col.id === activeColumn 
        ? { ...col, tasks: [...col.tasks, task] }
        : col
    ));

    setNewTask({ title: '', description: '', priority: 'medium' });
  };

  const moveTask = (taskId: string, fromColumn: string, toColumn: string) => {
    const fromCol = columns.find(col => col.id === fromColumn);
    const task = fromCol?.tasks.find(t => t.id === taskId);
    
    if (!task) return;

    setColumns(columns.map(col => {
      if (col.id === fromColumn) {
        return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
      }
      if (col.id === toColumn) {
        return { ...col, tasks: [...col.tasks, task] };
      }
      return col;
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
              <p className="text-gray-600">Visual task management with drag-and-drop workflow</p>
            </div>

            {/* Add Task Form */}
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
                    <Input
                      placeholder="Description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>
                  <select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <select 
                    value={activeColumn}
                    onChange={(e) => setActiveColumn(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {columns.map(col => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                  <Button onClick={addTask}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {columns.map((column) => (
                <div key={column.id} className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">{column.title}</h3>
                    <Badge variant="secondary">{column.tasks.length}</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {column.tasks.map((task) => (
                      <Card key={task.id} className="cursor-move hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{task.title}</h4>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                          {task.description && (
                            <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <span className="text-xs text-gray-500">{task.assignee}</span>
                          </div>
                          
                          {/* Move buttons */}
                          <div className="flex justify-between mt-3 gap-1">
                            {column.id !== 'todo' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const currentIndex = columns.findIndex(c => c.id === column.id);
                                  if (currentIndex > 0) {
                                    moveTask(task.id, column.id, columns[currentIndex - 1].id);
                                  }
                                }}
                                className="text-xs"
                              >
                                ←
                              </Button>
                            )}
                            {column.id !== 'done' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const currentIndex = columns.findIndex(c => c.id === column.id);
                                  if (currentIndex < columns.length - 1) {
                                    moveTask(task.id, column.id, columns[currentIndex + 1].id);
                                  }
                                }}
                                className="text-xs"
                              >
                                →
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {column.tasks.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No tasks</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KanbanBoard;
