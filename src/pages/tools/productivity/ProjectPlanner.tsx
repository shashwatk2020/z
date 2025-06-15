
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Trash2, Calendar, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Milestone {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  priority: 'low' | 'medium' | 'high';
  team: string[];
  milestones: Milestone[];
  budget: number;
  progress: number;
  createdAt: Date;
}

const ProjectPlanner = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'planning' as const,
    priority: 'medium' as const,
    team: '',
    budget: 0
  });
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as const
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedProjects = localStorage.getItem('projectPlanner');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projectPlanner', JSON.stringify(projects));
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
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      status: newProject.status,
      priority: newProject.priority,
      team: newProject.team.split(',').map(member => member.trim()).filter(Boolean),
      milestones: [],
      budget: newProject.budget,
      progress: 0,
      createdAt: new Date()
    };

    setProjects([...projects, project]);
    setNewProject({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'planning',
      priority: 'medium',
      team: '',
      budget: 0
    });

    toast({
      title: "Success",
      description: "Project created successfully"
    });
  };

  const addMilestone = () => {
    if (!selectedProject || !newMilestone.title.trim()) {
      toast({
        title: "Error",
        description: "Please select a project and enter milestone title",
        variant: "destructive"
      });
      return;
    }

    const milestone: Milestone = {
      id: Date.now(),
      title: newMilestone.title,
      description: newMilestone.description,
      dueDate: newMilestone.dueDate,
      completed: false,
      priority: newMilestone.priority
    };

    setProjects(projects.map(project =>
      project.id === selectedProject
        ? { ...project, milestones: [...project.milestones, milestone] }
        : project
    ));

    setNewMilestone({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    });

    toast({
      title: "Success",
      description: "Milestone added successfully"
    });
  };

  const toggleMilestone = (projectId: number, milestoneId: number) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const updatedMilestones = project.milestones.map(milestone =>
          milestone.id === milestoneId
            ? { ...milestone, completed: !milestone.completed }
            : milestone
        );
        
        const completedMilestones = updatedMilestones.filter(m => m.completed).length;
        const progress = updatedMilestones.length > 0 
          ? Math.round((completedMilestones / updatedMilestones.length) * 100)
          : 0;
        
        return { ...project, milestones: updatedMilestones, progress };
      }
      return project;
    }));
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id));
    if (selectedProject === id) {
      setSelectedProject(null);
    }
    toast({
      title: "Success",
      description: "Project deleted successfully"
    });
  };

  const updateProjectStatus = (projectId: number, status: Project['status']) => {
    setProjects(projects.map(project =>
      project.id === projectId ? { ...project, status } : project
    ));
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
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectStats = () => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const overdue = projects.filter(p => {
      const today = new Date().toISOString().split('T')[0];
      return p.endDate && p.endDate < today && p.status !== 'completed';
    }).length;

    return { total, active, completed, overdue };
  };

  const stats = getProjectStats();
  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Project Planner
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Plan and track complex projects with milestones, team management, and progress tracking.
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
              <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
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
          {/* Create New Project */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  New Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    placeholder="Enter project name"
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
                    <Label>Status</Label>
                    <Select value={newProject.status} onValueChange={(value: any) => setNewProject({ ...newProject, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Team Members (comma-separated)</Label>
                  <Input
                    placeholder="John, Jane, Mike"
                    value={newProject.team}
                    onChange={(e) => setNewProject({ ...newProject, team: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Budget ($)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: parseFloat(e.target.value) || 0 })}
                  />
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
                  <Target className="h-5 w-5" />
                  Your Projects
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {projects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No projects yet
                    </div>
                  ) : (
                    projects.map((project) => (
                      <div 
                        key={project.id} 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedProject === project.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{project.name}</h4>
                            {project.description && (
                              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                            )}
                            
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getPriorityColor(project.priority)}>
                                {project.priority}
                              </Badge>
                              
                              <Badge className={getStatusColor(project.status)}>
                                {project.status}
                              </Badge>
                              
                              {project.team.length > 0 && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {project.team.length}
                                </Badge>
                              )}
                              
                              {project.endDate && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {project.endDate}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="mt-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>
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
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            {selectedProjectData && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Project: {selectedProjectData.name}</CardTitle>
                  <CardDescription>Milestones and project details</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Add Milestone */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3">Add Milestone</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          placeholder="Milestone title"
                          value={newMilestone.title}
                          onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <Label>Due Date</Label>
                        <Input
                          type="date"
                          value={newMilestone.dueDate}
                          onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <Label>Priority</Label>
                        <Select value={newMilestone.priority} onValueChange={(value: any) => setNewMilestone({ ...newMilestone, priority: value })}>
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
                        <Label>Description</Label>
                        <Input
                          placeholder="Milestone description"
                          value={newMilestone.description}
                          onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={addMilestone} className="mt-4">
                      Add Milestone
                    </Button>
                  </div>

                  {/* Milestones List */}
                  <div>
                    <h4 className="font-medium mb-3">Milestones ({selectedProjectData.milestones.length})</h4>
                    <div className="space-y-3">
                      {selectedProjectData.milestones.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No milestones yet</p>
                      ) : (
                        selectedProjectData.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-start gap-3 p-3 border rounded-lg">
                            <input
                              type="checkbox"
                              checked={milestone.completed}
                              onChange={() => toggleMilestone(selectedProjectData.id, milestone.id)}
                              className="mt-1"
                            />
                            
                            <div className="flex-1">
                              <h5 className={`font-medium ${milestone.completed ? 'line-through text-gray-500' : ''}`}>
                                {milestone.title}
                              </h5>
                              {milestone.description && (
                                <p className={`text-sm mt-1 ${milestone.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                  {milestone.description}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={getPriorityColor(milestone.priority)}>
                                  {milestone.priority}
                                </Badge>
                                
                                {milestone.dueDate && (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {milestone.dueDate}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectPlanner;
