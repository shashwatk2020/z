
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Plus, Trash2, Edit, Calendar, ArrowLeft } from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  createdAt: string;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: ''
  });
  const [filter, setFilter] = useState('all');

  const addTodo = () => {
    if (!newTodo.title.trim()) return;

    const todo: Todo = {
      id: Date.now().toString(),
      title: newTodo.title,
      description: newTodo.description,
      priority: newTodo.priority,
      status: 'pending',
      dueDate: newTodo.dueDate,
      createdAt: new Date().toISOString()
    };

    setTodos([...todos, todo]);
    setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '' });
  };

  const updateTodoStatus = (id: string, status: Todo['status']) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, status } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    return todo.status === filter;
  });

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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link to="/tools/productivity" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Productivity Tools
              </Link>
              <div className="flex items-center space-x-3">
                <CheckSquare className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Advanced Todo List</h1>
                  <p className="text-gray-600">Feature-rich task management with priorities and deadlines</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Add New Todo */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Add New Task</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Task title"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                    rows={3}
                  />
                  <Select value={newTodo.priority} onValueChange={(value: any) => setNewTodo({ ...newTodo, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={newTodo.dueDate}
                    onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                  />
                  <Button onClick={addTodo} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </CardContent>
              </Card>

              {/* Todo List */}
              <div className="lg:col-span-2 space-y-6">
                {/* Filters */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}
                      >
                        All ({todos.length})
                      </Button>
                      <Button
                        variant={filter === 'pending' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('pending')}
                      >
                        Pending ({todos.filter(t => t.status === 'pending').length})
                      </Button>
                      <Button
                        variant={filter === 'in-progress' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('in-progress')}
                      >
                        In Progress ({todos.filter(t => t.status === 'in-progress').length})
                      </Button>
                      <Button
                        variant={filter === 'completed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('completed')}
                      >
                        Completed ({todos.filter(t => t.status === 'completed').length})
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Tasks */}
                <div className="space-y-4">
                  {filteredTodos.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {filter === 'all' ? 'No tasks yet. Add your first task!' : `No ${filter} tasks.`}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredTodos.map((todo) => (
                      <Card key={todo.id} className={todo.status === 'completed' ? 'opacity-75' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className={`font-semibold ${todo.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                                  {todo.title}
                                </h3>
                                <Badge className={getPriorityColor(todo.priority)}>
                                  {todo.priority}
                                </Badge>
                              </div>
                              {todo.description && (
                                <p className="text-gray-600 text-sm mb-2">{todo.description}</p>
                              )}
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                {todo.dueDate && (
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Due: {new Date(todo.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                                <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2 ml-4">
                              <Select value={todo.status} onValueChange={(value: any) => updateTodoStatus(todo.id, value)}>
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteTodo(todo.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TodoList;
