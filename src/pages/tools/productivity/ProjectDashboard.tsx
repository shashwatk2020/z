
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Target, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: number;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  health: 'critical' | 'warning' | 'healthy';
  createdAt: Date;
}

const ProjectDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'planning' as const,
    health: 'healthy' as const
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedProjects = localStorage.getItem('projectDashboard');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (error) {
        console.log('Error loading projects:', error);
      }
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
      health: newProject.health,
      createdAt: new Date()
    };

    setProjects([...projects, project]);
    setNewProject({
      name: '',
      description: '',
      status: 'planning',
      health: 'healthy'
    });

    toast({
      title: "Success",
      description: "Project added successfully"
    });
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id));
    toast({
      title: "Success",
      description: "Project deleted successfully"
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Project Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Manage and monitor your projects with ease, track progress, and ensure project health.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add New Project */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    placeholder="Project Name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Project Description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
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
                  <Target className="h-5 w-5" />
                  Your Projects
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {projects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 md:col-span-2">
                      No projects added yet
                    </div>
                  ) : (
                    projects.map((project) => {
                      const health = project.health;
                      const HealthIcon = health === 'critical' ? AlertTriangle : 
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
                                <HealthIcon className={`h-4 w-4 ${healthColor}`} />
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
                          
                          <div className="text-xs text-gray-500">
                            Added {new Date(project.createdAt).toLocaleDateString()}
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

export default ProjectDashboard;
