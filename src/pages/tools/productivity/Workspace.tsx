
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Layout, 
  ArrowLeft, 
  Plus, 
  Settings, 
  Users, 
  FileText, 
  Calendar,
  CheckCircle,
  Clock,
  Target,
  Activity,
  Star,
  Folder
} from 'lucide-react';

interface WorkspaceProject {
  id: string;
  name: string;
  description: string;
  progress: number;
  dueDate: string;
  status: 'active' | 'completed' | 'on-hold';
  team: string[];
  priority: 'low' | 'medium' | 'high';
}

interface WorkspaceTask {
  id: string;
  title: string;
  projectId: string;
  assignee: string;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface QuickLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: string;
}

const Workspace = () => {
  const [projects, setProjects] = useState<WorkspaceProject[]>([
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design and improved UX',
      progress: 75,
      dueDate: '2024-02-15',
      status: 'active',
      team: ['Alice', 'Bob', 'Carol'],
      priority: 'high'
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Native mobile application for iOS and Android platforms',
      progress: 40,
      dueDate: '2024-03-01',
      status: 'active',
      team: ['David', 'Eve'],
      priority: 'medium'
    },
    {
      id: '3',
      name: 'Marketing Campaign',
      description: 'Q1 marketing campaign for product launch',
      progress: 100,
      dueDate: '2024-01-31',
      status: 'completed',
      team: ['Frank', 'Grace'],
      priority: 'high'
    }
  ]);

  const [tasks, setTasks] = useState<WorkspaceTask[]>([
    {
      id: '1',
      title: 'Design homepage mockup',
      projectId: '1',
      assignee: 'Carol',
      dueDate: '2024-01-18',
      status: 'in-progress',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Set up authentication system',
      projectId: '2',
      assignee: 'David',
      dueDate: '2024-01-20',
      status: 'todo',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Write user documentation',
      projectId: '1',
      assignee: 'Alice',
      dueDate: '2024-01-22',
      status: 'todo',
      priority: 'low'
    }
  ]);

  const [quickLinks] = useState<QuickLink[]>([
    { id: '1', name: 'Google Drive', url: 'https://drive.google.com', icon: '📁', category: 'storage' },
    { id: '2', name: 'Slack', url: 'https://slack.com', icon: '💬', category: 'communication' },
    { id: '3', name: 'Figma', url: 'https://figma.com', icon: '🎨', category: 'design' },
    { id: '4', name: 'GitHub', url: 'https://github.com', icon: '💻', category: 'development' }
  ]);

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    dueDate: '',
    priority: 'medium' as const
  });

  const [activeTab, setActiveTab] = useState('overview');

  const addProject = () => {
    if (!newProject.name.trim()) return;

    const project: WorkspaceProject = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      progress: 0,
      dueDate: newProject.dueDate,
      status: 'active',
      team: [],
      priority: newProject.priority
    };

    setProjects([project, ...projects]);
    setNewProject({
      name: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate workspace statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const overallProgress = projects.length > 0 ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length : 0;

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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Layout className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Workspace</h1>
                    <p className="text-gray-600">Personal productivity dashboard and project management</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Projects</p>
                      <p className="text-3xl font-bold text-gray-900">{activeProjects}</p>
                      <p className="text-xs text-gray-500">of {totalProjects} total</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                      <p className="text-3xl font-bold text-gray-900">{completedTasks}</p>
                      <p className="text-xs text-gray-500">of {totalTasks} total</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                      <p className="text-3xl font-bold text-gray-900">{Math.round(overallProgress)}%</p>
                      <Progress value={overallProgress} className="mt-2" />
                    </div>
                    <Activity className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Due This Week</p>
                      <p className="text-3xl font-bold text-gray-900">3</p>
                      <p className="text-xs text-gray-500">tasks & projects</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="links">Quick Links</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Projects */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Folder className="h-5 w-5 mr-2" />
                        Recent Projects
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {projects.slice(0, 3).map((project) => (
                        <div key={project.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{project.name}</h4>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="mb-2" />
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                            <span>{project.team.length} team members</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Upcoming Tasks */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Upcoming Tasks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {tasks.filter(t => t.status !== 'completed').slice(0, 4).map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{task.title}</h4>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                              <span>Assigned to: {task.assignee}</span>
                              <span>•</span>
                              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(task.priority)} variant="secondary">
                              {task.priority}
                            </Badge>
                            <Badge className={getTaskStatusColor(task.status)} variant="secondary">
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Add Project Form */}
                  <div className="lg:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Plus className="h-5 w-5 mr-2" />
                          New Project
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="projectName">Project Name *</Label>
                          <Input
                            id="projectName"
                            value={newProject.name}
                            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                            placeholder="Project name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectDescription">Description</Label>
                          <Textarea
                            id="projectDescription"
                            value={newProject.description}
                            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                            placeholder="Project description"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectDueDate">Due Date</Label>
                          <Input
                            id="projectDueDate"
                            type="date"
                            value={newProject.dueDate}
                            onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectPriority">Priority</Label>
                          <Select value={newProject.priority} onValueChange={(value: any) => setNewProject({...newProject, priority: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          onClick={addProject} 
                          className="w-full" 
                          disabled={!newProject.name.trim()}
                        >
                          Create Project
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Projects List */}
                  <div className="lg:col-span-3">
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <Card key={project.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-lg">{project.name}</h3>
                                <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(project.status)}>
                                  {project.status}
                                </Badge>
                                <Badge className={getPriorityColor(project.priority)}>
                                  {project.priority} priority
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4 text-gray-500" />
                                  <span className="text-gray-600">{project.team.length} members</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-gray-600">Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>All Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{task.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <span>Project: {projects.find(p => p.id === task.projectId)?.name}</span>
                              <span>Assigned to: {task.assignee}</span>
                              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(task.priority)} variant="secondary">
                              {task.priority}
                            </Badge>
                            <Badge className={getTaskStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quick Links Tab */}
              <TabsContent value="links" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 mr-2" />
                      Quick Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {quickLinks.map((link) => (
                        <div key={link.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                            <div className="text-center">
                              <div className="text-3xl mb-2">{link.icon}</div>
                              <h4 className="font-medium text-gray-900">{link.name}</h4>
                              <p className="text-xs text-gray-500 capitalize">{link.category}</p>
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Workspace;
