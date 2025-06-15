
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, User, Calendar, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  tags: string[];
  createdAt: Date;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'inprogress', title: 'In Progress', tasks: [] },
    { id: 'review', title: 'Review', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] }
  ]);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    assignee: '',
    dueDate: '',
    tags: '',
    columnId: 'todo'
  });
  
  const [draggedTask, setDraggedTask] = useState<{ task: Task; fromColumn: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedBoard = localStorage.getItem('kanbanBoard');
    if (savedBoard) {
      setColumns(JSON.parse(savedBoard));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kanbanBoard', JSON.stringify(columns));
  }, [columns]);

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
      priority: newTask.priority,
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date()
    };

    setColumns(columns.map(column =>
      column.id === newTask.columnId
        ? { ...column, tasks: [...column.tasks, task] }
        : column
    ));

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      dueDate: '',
      tags: '',
      columnId: 'todo'
    });

    toast({
      title: "Success",
      description: "Task added successfully"
    });
  };

  const deleteTask = (taskId: number, columnId: string) => {
    setColumns(columns.map(column =>
      column.id === columnId
        ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) }
        : column
    ));

    toast({
      title: "Success",
      description: "Task deleted successfully"
    });
  };

  const handleDragStart = (task: Task, fromColumn: string) => {
    setDraggedTask({ task, fromColumn });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toColumn: string) => {
    e.preventDefault();
    
    if (!draggedTask) return;

    const { task, fromColumn } = draggedTask;

    if (fromColumn === toColumn) {
      setDraggedTask(null);
      return;
    }

    setColumns(columns.map(column => {
      if (column.id === fromColumn) {
        return { ...column, tasks: column.tasks.filter(t => t.id !== task.id) };
      }
      if (column.id === toColumn) {
        return { ...column, tasks: [...column.tasks, task] };
      }
      return column;
    }));

    setDraggedTask(null);
    
    toast({
      title: "Success",
      description: `Task moved to ${columns.find(c => c.id === toColumn)?.title}`
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'todo': return 'border-blue-200 bg-blue-50';
      case 'inprogress': return 'border-yellow-200 bg-yellow-50';
      case 'review': return 'border-purple-200 bg-purple-50';
      case 'done': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTotalTasks = () => columns.reduce((total, column) => total + column.tasks.length, 0);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kanban Board
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Visual project management with drag-and-drop task boards to organize your workflow.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {columns.map((column) => (
            <Card key={column.id}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{column.tasks.length}</div>
                <div className="text-sm text-gray-600">{column.title}</div>
              </CardContent>
            </Card>
          ))}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Priority</Label>
                <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Assignee</Label>
                <Input
                  placeholder="Assigned to"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Column</Label>
                <Select value={newTask.columnId} onValueChange={(value) => setNewTask({ ...newTask, columnId: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Tags</Label>
                <Input
                  placeholder="urgent, feature"
                  value={newTask.tags}
                  onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                />
              </div>
            </div>
            
            <Button onClick={addTask} className="mt-4">
              Add Task
            </Button>
          </CardContent>
        </Card>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <Card
              key={column.id}
              className={`${getColumnColor(column.id)} min-h-96`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {column.title}
                  <Badge variant="secondary" className="ml-2">
                    {column.tasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {column.tasks.map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-move hover:shadow-md transition-shadow bg-white"
                    draggable
                    onDragStart={() => handleDragStart(task, column.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <Button
                          onClick={() => deleteTask(task.id, column.id)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                      
                      {task.description && (
                        <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                      )}
                      
                      <div className="space-y-2">
                        <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                          {task.priority}
                        </Badge>
                        
                        {task.assignee && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <User className="h-3 w-3" />
                            {task.assignee}
                          </div>
                        )}
                        
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Calendar className="h-3 w-3" />
                            {task.dueDate}
                          </div>
                        )}
                        
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {column.tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No tasks in {column.title.toLowerCase()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default KanbanBoard;
