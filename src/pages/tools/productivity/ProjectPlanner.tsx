
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, Target, ArrowLeft, Plus } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  milestones: Milestone[];
  teamMembers: string[];
}

const ProjectPlanner = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  const createProject = () => {
    if (!newProject.name.trim()) return;

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      status: 'planning',
      milestones: [],
      teamMembers: ['You']
    };

    setProjects([...projects, project]);
    setNewProject({ name: '', description: '', startDate: '', endDate: '' });
  };

  const addMilestone = (projectId: string) => {
    if (!newMilestone.title.trim()) return;

    const milestone: Milestone = {
      id: Date.now().toString(),
      title: newMilestone.title,
      description: newMilestone.description,
      dueDate: newMilestone.dueDate,
      completed: false
    };

    setProjects(projects.map(project =>
      project.id === projectId
        ? { ...project, milestones: [...project.milestones, milestone] }
        : project
    ));

    setNewMilestone({ title: '', description: '', dueDate: '' });
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects(projects.map(project =>
      project.id === projectId
        ? {
            ...project,
            milestones: project.milestones.map(milestone =>
              milestone.id === milestoneId
                ? { ...milestone, completed: !milestone.completed }
                : milestone
            )
          }
        : project
    ));
  };

  const getProjectProgress = (project: Project) => {
    if (project.milestones.length === 0) return 0;
    const completed = project.milestones.filter(m => m.completed).length;
    return (completed / project.milestones.length) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
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
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Project Planner</h1>
                  <p className="text-gray-600">Plan projects with timelines, milestones, and dependencies</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Create Project */}
              <Card>
                <CardHeader>
                  <CardTitle>Create New Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Project name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                  <Textarea
                    placeholder="Project description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Input
                        type="date"
                        value={newProject.startDate}
                        onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <Input
                        type="date"
                        value={newProject.endDate}
                        onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={createProject} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </CardContent>
              </Card>

              {/* Projects List */}
              <div className="lg:col-span-2 space-y-6">
                {projects.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No projects yet. Create your first project!</p>
                    </CardContent>
                  </Card>
                ) : (
                  projects.map((project) => (
                    <Card key={project.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center space-x-2">
                              <span>{project.name}</span>
                              <Badge className={getStatusColor(project.status)}>
                                {project.status}
                              </Badge>
                            </CardTitle>
                            <p className="text-gray-600 mt-1">{project.description}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedProject(
                              selectedProject === project.id ? null : project.id
                            )}
                          >
                            {selectedProject === project.id ? 'Hide' : 'Manage'}
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'No start date'} - 
                            {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No end date'}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {project.teamMembers.length} member(s)
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-gray-600">
                              {project.milestones.filter(m => m.completed).length} / {project.milestones.length} milestones
                            </span>
                          </div>
                          <Progress value={getProjectProgress(project)} className="h-2" />
                        </div>
                      </CardHeader>

                      {selectedProject === project.id && (
                        <CardContent>
                          {/* Add Milestone */}
                          <div className="border-t pt-4 mb-4">
                            <h4 className="font-medium mb-3">Add Milestone</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <Input
                                placeholder="Milestone title"
                                value={newMilestone.title}
                                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                              />
                              <Input
                                placeholder="Description"
                                value={newMilestone.description}
                                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                              />
                              <Input
                                type="date"
                                value={newMilestone.dueDate}
                                onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                              />
                            </div>
                            <Button
                              onClick={() => addMilestone(project.id)}
                              size="sm"
                              className="mt-3"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Milestone
                            </Button>
                          </div>

                          {/* Milestones */}
                          <div>
                            <h4 className="font-medium mb-3">Milestones</h4>
                            {project.milestones.length === 0 ? (
                              <p className="text-gray-500 text-sm">No milestones added yet.</p>
                            ) : (
                              <div className="space-y-2">
                                {project.milestones.map((milestone) => (
                                  <div
                                    key={milestone.id}
                                    className="flex items-center space-x-3 p-3 border rounded-lg"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={milestone.completed}
                                      onChange={() => toggleMilestone(project.id, milestone.id)}
                                      className="rounded"
                                    />
                                    <div className="flex-1">
                                      <h5 className={`font-medium ${milestone.completed ? 'line-through text-gray-500' : ''}`}>
                                        {milestone.title}
                                      </h5>
                                      {milestone.description && (
                                        <p className="text-sm text-gray-600">{milestone.description}</p>
                                      )}
                                      {milestone.dueDate && (
                                        <p className="text-xs text-gray-500">
                                          Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectPlanner;
