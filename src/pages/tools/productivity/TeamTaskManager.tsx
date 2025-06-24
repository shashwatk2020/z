
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Plus, Calendar, ArrowLeft, Clock } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  dueDate: string;
  createdAt: string;
}

const TeamTaskManager = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'You', email: 'you@example.com', role: 'Manager' },
    { id: '2', name: 'Alice Johnson', email: 'alice@example.com', role: 'Developer' },
    { id: '3', name: 'Bob Smith', email: 'bob@example.com', role: 'Designer' }
  ]);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as const,
    dueDate: ''
  });
  const [newMember, setNewMember] = useState({ name: '', email: '', role: '' });
  const [filterAssignee, setFilterAssignee] = useState('all');

  const addTeamMember = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) return;

    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role || 'Member'
    };

    setTeamMembers([...teamMembers, member]);
    setNewMember({ name: '', email: '', role: '' });
  };

  const addTask = () => {
    if (!newTask.title.trim() || !newTask.assignedTo) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      priority: newTask.priority,
      status: 'todo',
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const getAssigneeName = (assigneeId: string) => {
    const member = teamMembers.find(m => m.id === assigneeId);
    return member ? member.name : 'Unassigned';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = tasks.filter(task => 
    filterAssignee === 'all' || task.assignedTo === filterAssignee
  );

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
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Team Task Manager</h1>
                  <p className="text-gray-600">Assign and track tasks across team members</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Team Members & Add Task */}
              <div className="space-y-6">
                {/* Team Members */}
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Member */}
                    <div className="border-t pt-3 mt-3 space-y-2">
                      <Input
                        placeholder="Name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        className="text-sm"
                      />
                      <Input
                        placeholder="Email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        className="text-sm"
                      />
                      <Input
                        placeholder="Role"
                        value={newMember.role}
                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                        className="text-sm"
                      />
                      <Button onClick={addTeamMember} size="sm" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Member
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Add Task */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Task</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                    <Textarea
                      placeholder="Description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      rows={3}
                    />
                    <select
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select assignee</option>
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.id}>{member.name}</option>
                      ))}
                    </select>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                    <Button onClick={addTask} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Tasks */}
              <div className="lg:col-span-3 space-y-6">
                {/* Filters */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={filterAssignee === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterAssignee('all')}
                      >
                        All Tasks ({tasks.length})
                      </Button>
                      {teamMembers.map(member => (
                        <Button
                          key={member.id}
                          variant={filterAssignee === member.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFilterAssignee(member.id)}
                        >
                          {member.name} ({tasks.filter(t => t.assignedTo === member.id).length})
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Task List */}
                <div className="space-y-4">
                  {filteredTasks.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {filterAssignee === 'all' 
                            ? 'No tasks yet. Add your first task!' 
                            : `No tasks assigned to ${getAssigneeName(filterAssignee)}.`
                          }
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredTasks.map((task) => (
                      <Card key={task.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold">{task.title}</h3>
                                <Badge className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                                <Badge className={getStatusColor(task.status)}>
                                  {task.status}
                                </Badge>
                              </div>
                              
                              {task.description && (
                                <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                              )}
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {getInitials(getAssigneeName(task.assignedTo))}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{getAssigneeName(task.assignedTo)}</span>
                                </div>
                                
                                {task.dueDate && (
                                  <span className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                                
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  Created: {new Date(task.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            <div className="ml-4">
                              <select
                                value={task.status}
                                onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                                className="px-3 py-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="review">Review</option>
                                <option value="completed">Completed</option>
                              </select>
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

export default TeamTaskManager;
