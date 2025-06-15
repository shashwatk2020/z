
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Plus, Trash2, Calendar, Users, Target, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: number;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate: string;
  progress: number;
  budget: number;
  spent: number;
  teamMembers: string[];
  tasks: ProjectTask[];
  milestones: Milestone[];
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectTask {
  id: number;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignee: string;
  dueDate: string;
}

interface Milestone {
  id: number;
  title: string;
  date: string;
  completed: boolean;
  description: string;
}

const ProjectDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'planning' as const,
    priority: 'medium' as const,
    startDate: '',
    endDate: '',
    budget: '',
    teamMembers: '',
    category: 'General',
    tags: ''
  });
  const [newTask, setNewTask] = useState({
    title: '',
    assignee: '',
    dueDate: ''
  });
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    date: '',
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedProjects = localStorage.getItem('projectDashboard');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projectDashboard', JSON.stringify(projects));
  }, [projects]);

  const addProject = () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive"
      });
      return;
    }

    const project: Project = {
      id: Date.now(),
      name: newProject.name,
      description: newProject.description,
      status: newProject.status,
      priority: newProject.priority,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      progress: 0,
      budget: parseFloat(newProject.budget) || 0,
      spent: 0,
      teamMembers: newProject.teamMembers.split(',').map(m => m.trim()).filter(Boolean),
      tasks: [],
      milestones: [],
      category: newProject.category,
      tags: newProject.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setProjects([project, ...projects]);
    setSelectedProject(project);
    setNewProject({
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      startDate: '',
      endDate: '',
      budget: '',
      teamMembers: '',
      category: 'General',
      tags: ''
    });

    toast({
      title: "Success",
      description: "Project created successfully"
    });
  };

  const updateProjectProgress = (projectId: number, progress: number) => {
    setProjects(projects.map(project =>
      project.id === projectId ? { ...project, progress, updatedAt: new Date() } : project
    ));
    
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({ ...selectedProject, progress });
    }
  };

  const addTaskToProject = (projectId: number) => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive"
      });
      return;
    }

    const task: ProjectTask = {
      id: Date.now(),
      title: newTask.title,
      status: 'todo',
      assignee: newTask.assignee,
      dueDate: newTask.dueDate
    };

    setProjects(projects.map(project =>
      project.id === projectId
        ? { ...project, tasks: [...project.tasks, task], updatedAt: new Date() }
        : project
    ));

    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({ ...selectedProject, tasks: [...selectedProject.tasks, task] });
    }

    setNewTask({ title: '', assignee: '', dueDate: '' });
    toast({
      title: "Success",
      description: "Task added to project"
    });
  };

  const addMilestoneToProject = (projectId: number) => {
    if (!newMilestone.title.trim() || !newMilestone.date) {
      toast({
        title: "Error",
        description: "Please enter milestone title and date",
        variant: "destructive"
      });
      return;
    }

    const milestone: Milestone = {
      id: Date.now(),
      title: newMilestone.title,
      date: newMilestone.date,
      completed: false,
      description: newMilestone.description
    };

    setProjects(projects.map(project =>
      project.id === projectId
        ? { ...project, milestones: [...project.milestones, milestone], updatedAt: new Date() }
        : project
    ));

    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({ ...selectedProject, milestones: [...selectedProject.milestones, milestone] });
    }

    setNewMilestone({ title: '', date: '', description: '' });
    toast({
      title: "Success",
      description: "Milestone added to project"
    });
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id));
    if (selectedProject && selectedProject.id === id) {
      setSelectedProject(null);
    }
    toast({
      title: "Success",
      description: "Project deleted successfully"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectHealth = (project: Project) => {
    if (project.status === 'completed') return 'healthy';
    if (project.status === 'cancelled') return 'critical';
    
    const today = new Date();
    const endDate = new Date(project.endDate);
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) return 'critical';
    if (daysRemaining < 7 && project.progress < 80) return 'warning';
    if (project.progress < 25 && daysRemaining < 30) return 'warning';
    
    return 'healthy';
  };

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    overdue: projects.filter(p => {
      const today = new Date();
      const endDate = new Date(p.endDate);
      return endDate < today && p.status !== 'completed';
    }).length
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Project Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Overview dashboard for project management with progress tracking and team collaboration.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-gray-600">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <div className="text-sm text-gray-600">Overdue</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Project */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Project Name *</Label>
                  <Input
                    placeholder="Website Redesign"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Project description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <select
                      value={newProject.status}
                      onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label>Priority</Label>
                    <select
                      value={newProject.priority}
                      onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as any })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={newProject.endDate}
                      onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Budget</Label>
                  <Input
                    type="number"
                    placeholder="10000"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Team Members</Label>
                  <Input
                    placeholder="John, Sarah, Mike"
                    value={newProject.teamMembers}
                    onChange={(e) => setNewProject({ ...newProject, teamMembers: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Input
                      placeholder="Web Development"
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>Tags</Label>
                    <Input
                      placeholder="urgent, client"
                      value={newProject.tags}
                      onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={addProject} className="w-full">
                  Create Project
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Projects List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {projects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No projects created yet
                    </div>
                  ) : (
                    projects.map((project) => {
                      const health = getProjectHealth(project);
                      const healthIcon = health === 'critical' ? AlertTriangle : 
                                        health === 'warning' ? AlertTriangle : Target;
                      const healthColor = health === 'critical' ? 'text-red-500' : 
                                         health === 'warning' ? 'text-yellow-500' : 'text-green-500';
                      
                      return (
                        <div 
                          key={project.id} 
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedProject?.id === project.id ? 'border-blue-500 bg-blue-50' : 'bg-white hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedProject(project)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{project.name}</h4>
                                <healthIcon className={`h-4 w-4 ${healthColor}`} />
                              </div>
                              {project.description && (
                                <p className="text-sm text-gray-600">{project.description}</p>
                              )}
                            </div>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteProject(project.id);
                              }}
                              variant="ghost"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={getStatusColor(project.status)}>
                                {project.status}
                              </Badge>
                              <Badge className={getPriorityColor(project.priority)}>
                                {project.priority}
                              </Badge>
                              <Badge variant="outline">{project.category}</Badge>
                              {project.teamMembers.length > 0 && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {project.teamMembers.length}
                                </Badge>
                              )}
                              {project.endDate && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {project.endDate}
                                </Badge>
                              )}
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Progress</span>
                                <span className="text-sm font-medium">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div>{project.tasks.length} tasks</div>
                              <div>{project.milestones.length} milestones</div>
                              {project.budget > 0 && (
                                <div>Budget: ${project.budget.toLocaleString()}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Project Details */}
        {selectedProject && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{selectedProject.name} - Details</CardTitle>
              <CardDescription>
                Manage tasks, milestones, and project progress
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Progress & Tasks */}
                <div className="space-y-4">
                  <div>
                    <Label>Project Progress</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={selectedProject.progress}
                        onChange={(e) => updateProjectProgress(selectedProject.id, parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-500">%</span>
                      <Progress value={selectedProject.progress} className="flex-1" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Add Task</Label>
                      <span className="text-sm text-gray-500">{selectedProject.tasks.length} tasks</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <Input
                        placeholder="Task title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      />
                      <Input
                        placeholder="Assignee"
                        value={newTask.assignee}
                        onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                      />
                      <Input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>
                    <Button onClick={() => addTaskToProject(selectedProject.id)} size="sm">
                      Add Task
                    </Button>
                  </div>
                </div>
                
                {/* Milestones */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Add Milestone</Label>
                      <span className="text-sm text-gray-500">{selectedProject.milestones.length} milestones</span>
                    </div>
                    <div className="space-y-2 mb-2">
                      <Input
                        placeholder="Milestone title"
                        value={newMilestone.title}
                        onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={newMilestone.date}
                          onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                        />
                        <Input
                          placeholder="Description"
                          value={newMilestone.description}
                          onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button onClick={() => addMilestoneToProject(selectedProject.id)} size="sm">
                      Add Milestone
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ProjectDashboard;
