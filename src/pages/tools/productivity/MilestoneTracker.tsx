
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
import { Milestone, Plus, Calendar, Target, ArrowLeft, CheckCircle, Clock } from 'lucide-react';

interface MilestoneItem {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  category: 'personal' | 'professional' | 'project' | 'learning' | 'health';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
  createdAt: string;
  completedAt?: string;
}

const MilestoneTracker = () => {
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: 'personal' as const
  });
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const addMilestone = () => {
    if (!newMilestone.title.trim() || !newMilestone.targetDate) return;

    const milestone: MilestoneItem = {
      id: Date.now().toString(),
      title: newMilestone.title,
      description: newMilestone.description,
      targetDate: newMilestone.targetDate,
      category: newMilestone.category,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString()
    };

    setMilestones([...milestones, milestone]);
    setNewMilestone({ title: '', description: '', targetDate: '', category: 'personal' });
  };

  const updateMilestoneProgress = (milestoneId: string, progress: number) => {
    setMilestones(milestones.map(milestone => {
      if (milestone.id === milestoneId) {
        const updatedMilestone = { ...milestone, progress };
        
        // Update status based on progress and date
        if (progress >= 100) {
          updatedMilestone.status = 'completed';
          updatedMilestone.completedAt = new Date().toISOString();
        } else if (progress > 0) {
          updatedMilestone.status = 'in-progress';
        } else {
          updatedMilestone.status = 'pending';
        }
        
        // Check if overdue
        const today = new Date();
        const targetDate = new Date(milestone.targetDate);
        if (targetDate < today && updatedMilestone.status !== 'completed') {
          updatedMilestone.status = 'overdue';
        }
        
        return updatedMilestone;
      }
      return milestone;
    }));
  };

  const completeMilestone = (milestoneId: string) => {
    updateMilestoneProgress(milestoneId, 100);
  };

  const getDaysUntilTarget = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return 'bg-blue-100 text-blue-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'project': return 'bg-green-100 text-green-800';
      case 'learning': return 'bg-yellow-100 text-yellow-800';
      case 'health': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <Target className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <Clock className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredMilestones = milestones.filter(milestone => {
    const matchesCategory = filterCategory === 'all' || milestone.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || milestone.status === filterStatus;
    return matchesCategory && matchesStatus;
  });

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
                <Milestone className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Milestone Tracker</h1>
                  <p className="text-gray-600">Track important project and personal milestones</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Add Milestone */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Milestone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Milestone title"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                    rows={3}
                  />
                  <select
                    value={newMilestone.category}
                    onChange={(e) => setNewMilestone({ ...newMilestone, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="personal">Personal</option>
                    <option value="professional">Professional</option>
                    <option value="project">Project</option>
                    <option value="learning">Learning</option>
                    <option value="health">Health</option>
                  </select>
                  <div>
                    <label className="block text-sm font-medium mb-1">Target Date</label>
                    <Input
                      type="date"
                      value={newMilestone.targetDate}
                      onChange={(e) => setNewMilestone({ ...newMilestone, targetDate: e.target.value })}
                    />
                  </div>
                  <Button onClick={addMilestone} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone
                  </Button>
                </CardContent>
              </Card>

              {/* Milestones List */}
              <div className="lg:col-span-3 space-y-6">
                {/* Filters */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Filter by Category:</label>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={filterCategory === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterCategory('all')}
                          >
                            All ({milestones.length})
                          </Button>
                          {['personal', 'professional', 'project', 'learning', 'health'].map(category => (
                            <Button
                              key={category}
                              variant={filterCategory === category ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setFilterCategory(category)}
                            >
                              {category.charAt(0).toUpperCase() + category.slice(1)} 
                              ({milestones.filter(m => m.category === category).length})
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Filter by Status:</label>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={filterStatus === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStatus('all')}
                          >
                            All
                          </Button>
                          {['pending', 'in-progress', 'completed', 'overdue'].map(status => (
                            <Button
                              key={status}
                              variant={filterStatus === status ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setFilterStatus(status)}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Milestones */}
                <div className="space-y-4">
                  {filteredMilestones.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Milestone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {milestones.length === 0 
                            ? 'No milestones yet. Add your first milestone!' 
                            : 'No milestones match your current filters.'
                          }
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredMilestones.map((milestone) => {
                      const daysUntilTarget = getDaysUntilTarget(milestone.targetDate);
                      
                      return (
                        <Card key={milestone.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold text-lg">{milestone.title}</h3>
                                  <Badge className={getCategoryColor(milestone.category)}>
                                    {milestone.category}
                                  </Badge>
                                  <Badge className={getStatusColor(milestone.status)}>
                                    <span className="flex items-center space-x-1">
                                      {getStatusIcon(milestone.status)}
                                      <span>{milestone.status.replace('-', ' ')}</span>
                                    </span>
                                  </Badge>
                                </div>
                                
                                {milestone.description && (
                                  <p className="text-gray-600 text-sm mb-3">{milestone.description}</p>
                                )}

                                <div className="space-y-3">
                                  <div>
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-sm font-medium">Progress</span>
                                      <span className="text-sm text-gray-600">{milestone.progress}%</span>
                                    </div>
                                    <Progress value={milestone.progress} className="h-2" />
                                  </div>

                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      Target: {new Date(milestone.targetDate).toLocaleDateString()}
                                    </span>
                                    
                                    {milestone.status !== 'completed' && (
                                      <span className={`flex items-center ${
                                        daysUntilTarget < 0 ? 'text-red-600' : 
                                        daysUntilTarget <= 7 ? 'text-orange-600' : 'text-green-600'
                                      }`}>
                                        <Clock className="h-4 w-4 mr-1" />
                                        {daysUntilTarget < 0 
                                          ? `${Math.abs(daysUntilTarget)} days overdue`
                                          : `${daysUntilTarget} days remaining`
                                        }
                                      </span>
                                    )}
                                    
                                    {milestone.completedAt && (
                                      <span className="flex items-center text-green-600">
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Completed: {new Date(milestone.completedAt).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col space-y-2 ml-6">
                                {milestone.status !== 'completed' && (
                                  <>
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={milestone.progress}
                                      onChange={(e) => updateMilestoneProgress(milestone.id, parseInt(e.target.value) || 0)}
                                      className="w-20"
                                      placeholder="%"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => completeMilestone(milestone.id)}
                                      className="w-full"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Complete
                                    </Button>
                                  </>
                                )}
                                
                                {milestone.status === 'completed' && (
                                  <div className="text-center p-3 bg-green-50 rounded">
                                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-1" />
                                    <span className="text-sm font-medium text-green-800">Completed!</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
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

export default MilestoneTracker;
