
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Flag, Plus, Trash2, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Milestone {
  id: number;
  title: string;
  description: string;
  project: string;
  targetDate: string;
  completed: boolean;
  completedDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

const MilestoneTracker = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    project: '',
    targetDate: '',
    priority: 'medium' as const
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedMilestones = localStorage.getItem('milestoneTracker');
    if (savedMilestones) {
      setMilestones(JSON.parse(savedMilestones));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('milestoneTracker', JSON.stringify(milestones));
  }, [milestones]);

  const addMilestone = () => {
    if (!newMilestone.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a milestone title",
        variant: "destructive"
      });
      return;
    }

    const milestone: Milestone = {
      id: Date.now(),
      title: newMilestone.title,
      description: newMilestone.description,
      project: newMilestone.project || 'General',
      targetDate: newMilestone.targetDate,
      completed: false,
      priority: newMilestone.priority,
      createdAt: new Date()
    };

    setMilestones([...milestones, milestone]);
    setNewMilestone({
      title: '',
      description: '',
      project: '',
      targetDate: '',
      priority: 'medium'
    });

    toast({
      title: "Success",
      description: "Milestone added successfully"
    });
  };

  const toggleCompletion = (id: number) => {
    setMilestones(milestones.map(milestone => {
      if (milestone.id === id) {
        return {
          ...milestone,
          completed: !milestone.completed,
          completedDate: !milestone.completed ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return milestone;
    }));
  };

  const deleteMilestone = (id: number) => {
    setMilestones(milestones.filter(milestone => milestone.id !== id));
    toast({
      title: "Success",
      description: "Milestone deleted successfully"
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (milestone: Milestone) => {
    if (milestone.completed) return 'bg-green-100 text-green-800';
    
    if (milestone.targetDate) {
      const today = new Date().toISOString().split('T')[0];
      if (milestone.targetDate < today) return 'bg-red-100 text-red-800';
      if (milestone.targetDate === today) return 'bg-yellow-100 text-yellow-800';
    }
    
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (milestone: Milestone) => {
    if (milestone.completed) return 'Completed';
    
    if (milestone.targetDate) {
      const today = new Date().toISOString().split('T')[0];
      if (milestone.targetDate < today) return 'Overdue';
      if (milestone.targetDate === today) return 'Due Today';
    }
    
    return 'In Progress';
  };

  const getCompletionRate = () => {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.completed).length;
    return Math.round((completed / milestones.length) * 100);
  };

  const projects = [...new Set(milestones.map(m => m.project))];
  const completionRate = getCompletionRate();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Milestone Tracker
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Track important milestones and achievements across your projects.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{milestones.length}</div>
              <div className="text-sm text-gray-600">Total Milestones</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {milestones.filter(m => m.completed).length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {milestones.filter(m => !m.completed && m.targetDate && m.targetDate < new Date().toISOString().split('T')[0]).length}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add New Milestone */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Milestone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    placeholder="Milestone title"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Milestone description"
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Project</Label>
                    <Input
                      placeholder="Project name"
                      value={newMilestone.project}
                      onChange={(e) => setNewMilestone({ ...newMilestone, project: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>Priority</Label>
                    <select
                      value={newMilestone.priority}
                      onChange={(e) => setNewMilestone({ ...newMilestone, priority: e.target.value as any })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Target Date</Label>
                  <Input
                    type="date"
                    value={newMilestone.targetDate}
                    onChange={(e) => setNewMilestone({ ...newMilestone, targetDate: e.target.value })}
                  />
                </div>

                <Button onClick={addMilestone} className="w-full">
                  Add Milestone
                </Button>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            {milestones.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{completionRate}%</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <Progress value={completionRate} className="h-3" />
                    <div className="text-sm text-gray-600 text-center">
                      {milestones.filter(m => m.completed).length} of {milestones.length} milestones
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Milestones List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5" />
                  Your Milestones
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {milestones.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No milestones added yet
                    </div>
                  ) : (
                    milestones.map((milestone) => (
                      <div key={milestone.id} className={`p-4 border rounded-lg ${milestone.completed ? 'bg-green-50' : 'bg-white'}`}>
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={milestone.completed}
                            onCheckedChange={() => toggleCompletion(milestone.id)}
                            className="mt-1"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h4 className={`font-medium ${milestone.completed ? 'line-through text-gray-500' : ''}`}>
                                {milestone.title}
                              </h4>
                              <Button
                                onClick={() => deleteMilestone(milestone.id)}
                                variant="ghost"
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                            
                            {milestone.description && (
                              <p className={`text-sm mt-1 ${milestone.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                {milestone.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getPriorityColor(milestone.priority)}>
                                {milestone.priority}
                              </Badge>
                              
                              <Badge className={getStatusColor(milestone)}>
                                {getStatusText(milestone)}
                              </Badge>
                              
                              <Badge variant="outline">
                                {milestone.project}
                              </Badge>
                              
                              {milestone.targetDate && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {milestone.targetDate}
                                </Badge>
                              )}
                              
                              {milestone.completed && milestone.completedDate && (
                                <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  {milestone.completedDate}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
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

export default MilestoneTracker;
