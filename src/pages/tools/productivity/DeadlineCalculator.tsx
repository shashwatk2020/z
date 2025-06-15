
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: number;
  name: string;
  deadline: string;
  startDate: string;
  bufferDays: number;
  priority: 'low' | 'medium' | 'high';
  status: 'not-started' | 'in-progress' | 'completed';
  description: string;
}

const DeadlineCalculator = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    name: '',
    deadline: '',
    startDate: '',
    bufferDays: 3,
    priority: 'medium' as const,
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedProjects = localStorage.getItem('deadlineCalculator');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('deadlineCalculator', JSON.stringify(projects));
  }, [projects]);

  const addProject = () => {
    if (!newProject.name.trim() || !newProject.deadline) {
      toast({
        title: "Error",
        description: "Please enter project name and deadline",
        variant: "destructive"
      });
      return;
    }

    const project: Project = {
      id: Date.now(),
      name: newProject.name,
      deadline: newProject.deadline,
      startDate: newProject.startDate || new Date().toISOString().split('T')[0],
      bufferDays: newProject.bufferDays,
      priority: newProject.priority,
      status: 'not-started',
      description: newProject.description
    };

    setProjects([...projects, project]);
    setNewProject({
      name: '',
      deadline: '',
      startDate: '',
      bufferDays: 3,
      priority: 'medium',
      description: ''
    });

    toast({
      title: "Success",
      description: "Project added successfully"
    });
  };

  const updateProjectStatus = (id: number, status: Project['status']) => {
    setProjects(projects.map(project =>
      project.id === id ? { ...project, status } : project
    ));
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id));
    toast({
      title: "Success",
      description: "Project deleted successfully"
    });
  };

  const calculateDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalDays = (startDate: string, deadline: string) => {
    const start = new Date(startDate);
    const end = new Date(deadline);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateProgress = (project: Project) => {
    const totalDays = calculateTotalDays(project.startDate, project.deadline);
    const daysRemaining = calculateDaysRemaining(project.deadline);
    const daysPassed = totalDays - daysRemaining;
    return Math.max(0, Math.min(100, Math.round((daysPassed / totalDays) * 100)));
  };

  const calculateRecommendedStartDate = (deadline: string, bufferDays: number, workingDays: number = 30) => {
    const deadlineDate = new Date(deadline);
    const totalDaysNeeded = workingDays + bufferDays;
    const recommendedStart = new Date(deadlineDate.getTime() - (totalDaysNeeded * 24 * 60 * 60 * 1000));
    return recommendedStart.toISOString().split('T')[0];
  };

  const getDeadlineStatus = (project: Project) => {
    const daysRemaining = calculateDaysRemaining(project.deadline);
    
    if (project.status === 'completed') {
      return { text: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
    
    if (daysRemaining < 0) {
      return { text: 'Overdue', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    }
    
    if (daysRemaining <= project.bufferDays) {
      return { text: 'Critical', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    }
    
    if (daysRemaining <= project.bufferDays * 2) {
      return { text: 'Warning', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
    }
    
    return { text: 'On Track', color: 'bg-green-100 text-green-800', icon: CheckCircle };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    // Sort by deadline, with overdue first
    const daysA = calculateDaysRemaining(a.deadline);
    const daysB = calculateDaysRemaining(b.deadline);
    
    if (daysA < 0 && daysB >= 0) return -1;
    if (daysA >= 0 && daysB < 0) return 1;
    
    return daysA - daysB;
  });

  const stats = {
    total: projects.length,
    overdue: projects.filter(p => calculateDaysRemaining(p.deadline) < 0 && p.status !== 'completed').length,
    critical: projects.filter(p => {
      const days = calculateDaysRemaining(p.deadline);
      return days >= 0 && days <= 3 && p.status !== 'completed';
    }).length,
    completed: projects.filter(p => p.status === 'completed').length
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Deadline Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate project deadlines and track progress with buffer time management.
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
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <div className="text-sm text-gray-600">Overdue</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.critical}</div>
              <div className="text-sm text-gray-600">Critical</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
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
                  Add Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    placeholder="Website redesign"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Input
                    placeholder="Brief description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
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
                    <Label>Deadline</Label>
                    <Input
                      type="date"
                      value={newProject.deadline}
                      onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Priority</Label>
                    <Select value={newProject.priority} onValueChange={(value: any) => setNewProject({ ...newProject, priority: value })}>
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
                    <Label>Buffer (days)</Label>
                    <Input
                      type="number"
                      value={newProject.bufferDays}
                      onChange={(e) => setNewProject({ ...newProject, bufferDays: parseInt(e.target.value) || 0 })}
                      min="0"
                      max="30"
                    />
                  </div>
                </div>

                <Button onClick={addProject} className="w-full">
                  Add Project
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Projects List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Project Deadlines
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {sortedProjects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No projects added yet
                    </div>
                  ) : (
                    sortedProjects.map((project) => {
                      const daysRemaining = calculateDaysRemaining(project.deadline);
                      const status = getDeadlineStatus(project);
                      const progress = calculateProgress(project);
                      const StatusIcon = status.icon;
                      
                      return (
                        <div key={project.id} className="p-4 border rounded-lg bg-white">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium">{project.name}</h4>
                              {project.description && (
                                <p className="text-sm text-gray-600">{project.description}</p>
                              )}
                            </div>
                            <Button
                              onClick={() => deleteProject(project.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={getPriorityColor(project.priority)}>
                                {project.priority}
                              </Badge>
                              
                              <Badge className={status.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {status.text}
                              </Badge>
                              
                              <Badge variant="outline">
                                Deadline: {project.deadline}
                              </Badge>
                              
                              <Badge variant="outline">
                                {daysRemaining >= 0 ? `${daysRemaining} days left` : `${Math.abs(daysRemaining)} days overdue`}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Label className="text-sm">Status:</Label>
                              <Select 
                                value={project.status} 
                                onValueChange={(value: any) => updateProjectStatus(project.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="not-started">Not Started</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
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
      </div>
    </Layout>
  );
};

export default DeadlineCalculator;
