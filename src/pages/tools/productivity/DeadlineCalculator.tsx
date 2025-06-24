
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ArrowLeft, Clock, AlertTriangle, CheckCircle, Plus, Edit, Trash2, Target } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
  estimatedHours: number;
  actualHours: number;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  name: string;
  date: string;
  completed: boolean;
  description: string;
}

const DeadlineCalculator = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      startDate: '2024-01-01',
      endDate: '2024-02-15',
      priority: 'high',
      status: 'in-progress',
      progress: 65,
      estimatedHours: 120,
      actualHours: 78,
      milestones: [
        { id: '1', name: 'Design Mockups', date: '2024-01-15', completed: true, description: 'Complete all page mockups' },
        { id: '2', name: 'Frontend Development', date: '2024-02-01', completed: false, description: 'Build responsive frontend' },
        { id: '3', name: 'Testing & Launch', date: '2024-02-15', completed: false, description: 'Final testing and deployment' }
      ]
    }
  ]);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    priority: 'medium' as const,
    estimatedHours: 40
  });

  const [newMilestone, setNewMilestone] = useState({
    name: '',
    date: '',
    description: ''
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const calculateDaysRemaining = (endDate: string) => {
    const today = new Date();
    const deadline = new Date(endDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateWorkingDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let workingDays = 0;
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude weekends
        workingDays++;
      }
    }
    
    return workingDays;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyIndicator = (daysRemaining: number) => {
    if (daysRemaining < 0) return { icon: AlertTriangle, color: 'text-red-600', text: 'Overdue' };
    if (daysRemaining <= 3) return { icon: AlertTriangle, color: 'text-red-600', text: 'Critical' };
    if (daysRemaining <= 7) return { icon: Clock, color: 'text-orange-600', text: 'Urgent' };
    if (daysRemaining <= 14) return { icon: Clock, color: 'text-yellow-600', text: 'Soon' };
    return { icon: CheckCircle, color: 'text-green-600', text: 'On Track' };
  };

  const addProject = () => {
    if (!newProject.name || !newProject.endDate) return;

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      priority: newProject.priority,
      status: 'not-started',
      progress: 0,
      estimatedHours: newProject.estimatedHours,
      actualHours: 0,
      milestones: []
    };

    setProjects([...projects, project]);
    setNewProject({
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      priority: 'medium',
      estimatedHours: 40
    });
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setEditingProject(null);
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const addMilestone = () => {
    if (!newMilestone.name || !newMilestone.date || !selectedProjectId) return;

    const milestone: Milestone = {
      id: Date.now().toString(),
      name: newMilestone.name,
      date: newMilestone.date,
      completed: false,
      description: newMilestone.description
    };

    setProjects(projects.map(p => 
      p.id === selectedProjectId 
        ? { ...p, milestones: [...p.milestones, milestone].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) }
        : p
    ));

    setNewMilestone({ name: '', date: '', description: '' });
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects(projects.map(p => 
      p.id === projectId 
        ? {
            ...p, 
            milestones: p.milestones.map(m => 
              m.id === milestoneId ? { ...m, completed: !m.completed } : m
            )
          }
        : p
    ));
  };

  const updateProjectProgress = (projectId: string, progress: number) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, progress } : p
    ));
  };

  const getProjectStats = () => {
    const total = projects.length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const overdue = projects.filter(p => calculateDaysRemaining(p.endDate) < 0).length;
    const urgent = projects.filter(p => {
      const days = calculateDaysRemaining(p.endDate);
      return days >= 0 && days <= 7;
    }).length;

    return { total, completed, overdue, urgent };
  };

  const stats = getProjectStats();

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
                <Target className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Deadline Calculator</h1>
                  <p className="text-gray-600">Calculate and track project deadlines and milestones</p>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Projects</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-orange-600">{stats.urgent}</div>
                  <div className="text-sm text-gray-600">Urgent</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                  <div className="text-sm text-gray-600">Overdue</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Projects List */}
              <div className="lg:col-span-3 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Deadlines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {projects.length === 0 ? (
                      <div className="text-center py-8">
                        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No projects yet. Create your first project!</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {projects.map((project) => {
                          const daysRemaining = calculateDaysRemaining(project.endDate);
                          const workingDays = calculateWorkingDays(project.startDate, project.endDate);
                          const urgency = getUrgencyIndicator(daysRemaining);
                          const completedMilestones = project.milestones.filter(m => m.completed).length;
                          
                          return (
                            <div key={project.id} className="border rounded-lg p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                                      {project.status.replace('-', ' ')}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(project.priority)}`}>
                                      {project.priority}
                                    </span>
                                  </div>
                                  {project.description && (
                                    <p className="text-gray-600 mb-3">{project.description}</p>
                                  )}
                                  
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-500">Start Date:</span>
                                      <div className="font-medium">{new Date(project.startDate).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">End Date:</span>
                                      <div className="font-medium">{new Date(project.endDate).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Working Days:</span>
                                      <div className="font-medium">{workingDays} days</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Hours:</span>
                                      <div className="font-medium">{project.actualHours}/{project.estimatedHours}h</div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className={`flex items-center space-x-1 ${urgency.color} mb-2`}>
                                    <urgency.icon className="h-4 w-4" />
                                    <span className="font-medium">{urgency.text}</span>
                                  </div>
                                  <div className="text-2xl font-bold">
                                    {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
                                  </div>
                                  <div className="flex space-x-2 mt-2">
                                    <Button size="sm" variant="outline" onClick={() => setEditingProject(project)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => deleteProject(project.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Progress Bar */}
                              <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-gray-600">Progress</span>
                                  <span className="text-sm font-medium">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${project.progress}%` }}
                                  />
                                </div>
                                <div className="mt-2">
                                  <Label htmlFor={`progress-${project.id}`} className="text-sm">Update Progress:</Label>
                                  <Input
                                    id={`progress-${project.id}`}
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={project.progress}
                                    onChange={(e) => updateProjectProgress(project.id, parseInt(e.target.value))}
                                    className="w-full"
                                  />
                                </div>
                              </div>
                              
                              {/* Milestones */}
                              {project.milestones.length > 0 && (
                                <div>
                                  <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-900">Milestones</h4>
                                    <span className="text-sm text-gray-600">
                                      {completedMilestones}/{project.milestones.length} completed
                                    </span>
                                  </div>
                                  <div className="space-y-2">
                                    {project.milestones.map((milestone) => {
                                      const milestoneDate = new Date(milestone.date);
                                      const isOverdue = milestoneDate < new Date() && !milestone.completed;
                                      
                                      return (
                                        <div key={milestone.id} className={`flex items-center space-x-3 p-2 rounded ${
                                          milestone.completed ? 'bg-green-50' : isOverdue ? 'bg-red-50' : 'bg-gray-50'
                                        }`}>
                                          <input
                                            type="checkbox"
                                            checked={milestone.completed}
                                            onChange={() => toggleMilestone(project.id, milestone.id)}
                                            className="h-4 w-4 text-blue-600"
                                          />
                                          <div className="flex-1">
                                            <div className={`font-medium ${milestone.completed ? 'line-through text-gray-500' : ''}`}>
                                              {milestone.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                              Due: {milestoneDate.toLocaleDateString()}
                                              {isOverdue && <span className="text-red-600 ml-2">(Overdue)</span>}
                                            </div>
                                            {milestone.description && (
                                              <div className="text-xs text-gray-500 mt-1">{milestone.description}</div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Add Project */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {editingProject ? 'Edit Project' : 'Add New Project'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        value={editingProject ? editingProject.name : newProject.name}
                        onChange={(e) => editingProject 
                          ? setEditingProject({...editingProject, name: e.target.value})
                          : setNewProject({...newProject, name: e.target.value})
                        }
                        placeholder="Website redesign"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="project-description">Description</Label>
                      <Textarea
                        id="project-description"
                        value={editingProject ? editingProject.description : newProject.description}
                        onChange={(e) => editingProject 
                          ? setEditingProject({...editingProject, description: e.target.value})
                          : setNewProject({...newProject, description: e.target.value})
                        }
                        placeholder="Project description"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input
                          id="start-date"
                          type="date"
                          value={editingProject ? editingProject.startDate : newProject.startDate}
                          onChange={(e) => editingProject 
                            ? setEditingProject({...editingProject, startDate: e.target.value})
                            : setNewProject({...newProject, startDate: e.target.value})
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="end-date">End Date</Label>
                        <Input
                          id="end-date"
                          type="date"
                          value={editingProject ? editingProject.endDate : newProject.endDate}
                          onChange={(e) => editingProject 
                            ? setEditingProject({...editingProject, endDate: e.target.value})
                            : setNewProject({...newProject, endDate: e.target.value})
                          }
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={editingProject ? editingProject.priority : newProject.priority}
                        onValueChange={(value) => editingProject 
                          ? setEditingProject({...editingProject, priority: value as any})
                          : setNewProject({...newProject, priority: value as any})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="estimated-hours">Estimated Hours</Label>
                      <Input
                        id="estimated-hours"
                        type="number"
                        value={editingProject ? editingProject.estimatedHours : newProject.estimatedHours}
                        onChange={(e) => editingProject 
                          ? setEditingProject({...editingProject, estimatedHours: parseInt(e.target.value) || 0})
                          : setNewProject({...newProject, estimatedHours: parseInt(e.target.value) || 0})
                        }
                        min={1}
                      />
                    </div>

                    {editingProject ? (
                      <div className="flex space-x-2">
                        <Button onClick={() => updateProject(editingProject)} className="flex-1">
                          Update Project
                        </Button>
                        <Button onClick={() => setEditingProject(null)} variant="outline">
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={addProject} className="w-full" disabled={!newProject.name || !newProject.endDate}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Add Milestone */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add Milestone</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="project-select">Select Project</Label>
                      <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map(project => (
                            <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="milestone-name">Milestone Name</Label>
                      <Input
                        id="milestone-name"
                        value={newMilestone.name}
                        onChange={(e) => setNewMilestone({...newMilestone, name: e.target.value})}
                        placeholder="Design completion"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="milestone-date">Due Date</Label>
                      <Input
                        id="milestone-date"
                        type="date"
                        value={newMilestone.date}
                        onChange={(e) => setNewMilestone({...newMilestone, date: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="milestone-description">Description</Label>
                      <Textarea
                        id="milestone-description"
                        value={newMilestone.description}
                        onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                        placeholder="Milestone description"
                        rows={2}
                      />
                    </div>
                    
                    <Button 
                      onClick={addMilestone} 
                      className="w-full" 
                      disabled={!newMilestone.name || !newMilestone.date || !selectedProjectId}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Milestone
                    </Button>
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

export default DeadlineCalculator;
