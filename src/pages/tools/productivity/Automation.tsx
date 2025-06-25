
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
import { Switch } from '@/components/ui/switch';
import { Zap, ArrowLeft, Plus, Play, Pause, Settings, Trash2, Clock, Mail, FileText } from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'time' | 'email' | 'file' | 'webhook';
    condition: string;
  };
  action: {
    type: 'email' | 'notification' | 'file_move' | 'api_call';
    details: string;
  };
  isActive: boolean;
  lastRun: string | null;
  runCount: number;
  category: string;
}

const Automation = () => {
  const [automations, setAutomations] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Daily Report Email',
      description: 'Send daily productivity report every weekday at 6 PM',
      trigger: {
        type: 'time',
        condition: 'Every weekday at 18:00'
      },
      action: {
        type: 'email',
        details: 'Send report to team@company.com'
      },
      isActive: true,
      lastRun: '2024-01-15T18:00:00Z',
      runCount: 45,
      category: 'reporting'
    },
    {
      id: '2',
      name: 'File Organization',
      description: 'Move downloaded files to appropriate folders based on file type',
      trigger: {
        type: 'file',
        condition: 'New file in Downloads folder'
      },
      action: {
        type: 'file_move',
        details: 'Move to categorized folders'
      },
      isActive: true,
      lastRun: '2024-01-15T14:30:00Z',
      runCount: 128,
      category: 'organization'
    }
  ]);

  const [newAutomation, setNewAutomation] = useState({
    name: '',
    description: '',
    triggerType: 'time' as const,
    triggerCondition: '',
    actionType: 'email' as const,
    actionDetails: '',
    category: 'general'
  });

  const addAutomation = () => {
    if (!newAutomation.name.trim()) return;

    const automation: AutomationRule = {
      id: Date.now().toString(),
      name: newAutomation.name,
      description: newAutomation.description,
      trigger: {
        type: newAutomation.triggerType,
        condition: newAutomation.triggerCondition
      },
      action: {
        type: newAutomation.actionType,
        details: newAutomation.actionDetails
      },
      isActive: false,
      lastRun: null,
      runCount: 0,
      category: newAutomation.category
    };

    setAutomations([automation, ...automations]);
    setNewAutomation({
      name: '',
      description: '',
      triggerType: 'time',
      triggerCondition: '',
      actionType: 'email',
      actionDetails: '',
      category: 'general'
    });
  };

  const toggleAutomation = (automationId: string) => {
    setAutomations(automations.map(automation => 
      automation.id === automationId ? { ...automation, isActive: !automation.isActive } : automation
    ));
  };

  const deleteAutomation = (automationId: string) => {
    setAutomations(automations.filter(automation => automation.id !== automationId));
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'time': return <Clock className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'file': return <FileText className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reporting': return 'bg-blue-100 text-blue-800';
      case 'organization': return 'bg-green-100 text-green-800';
      case 'communication': return 'bg-purple-100 text-purple-800';
      case 'backup': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                <Zap className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Automation Rules</h1>
                  <p className="text-gray-600">Create automated workflows to streamline your tasks</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Add Automation Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="h-5 w-5 mr-2" />
                      New Automation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={newAutomation.name}
                        onChange={(e) => setNewAutomation({...newAutomation, name: e.target.value})}
                        placeholder="Automation name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newAutomation.description}
                        onChange={(e) => setNewAutomation({...newAutomation, description: e.target.value})}
                        placeholder="What does this automation do?"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="triggerType">Trigger Type</Label>
                      <Select value={newAutomation.triggerType} onValueChange={(value: any) => setNewAutomation({...newAutomation, triggerType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="time">Time-based</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="file">File Event</SelectItem>
                          <SelectItem value="webhook">Webhook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="triggerCondition">Trigger Condition</Label>
                      <Input
                        id="triggerCondition"
                        value={newAutomation.triggerCondition}
                        onChange={(e) => setNewAutomation({...newAutomation, triggerCondition: e.target.value})}
                        placeholder="e.g., Daily at 9:00 AM"
                      />
                    </div>
                    <div>
                      <Label htmlFor="actionType">Action Type</Label>
                      <Select value={newAutomation.actionType} onValueChange={(value: any) => setNewAutomation({...newAutomation, actionType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Send Email</SelectItem>
                          <SelectItem value="notification">Show Notification</SelectItem>
                          <SelectItem value="file_move">Move File</SelectItem>
                          <SelectItem value="api_call">API Call</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="actionDetails">Action Details</Label>
                      <Input
                        id="actionDetails"
                        value={newAutomation.actionDetails}
                        onChange={(e) => setNewAutomation({...newAutomation, actionDetails: e.target.value})}
                        placeholder="Action details"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newAutomation.category} onValueChange={(value) => setNewAutomation({...newAutomation, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="reporting">Reporting</SelectItem>
                          <SelectItem value="organization">Organization</SelectItem>
                          <SelectItem value="communication">Communication</SelectItem>
                          <SelectItem value="backup">Backup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={addAutomation} 
                      className="w-full" 
                      disabled={!newAutomation.name.trim()}
                    >
                      Create Automation
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Automations List */}
              <div className="lg:col-span-3 space-y-6">
                {automations.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No automations yet. Create your first automation!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {automations.map((automation) => (
                      <Card key={automation.id} className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <h3 className="font-semibold text-gray-900">{automation.name}</h3>
                                  <Switch
                                    checked={automation.isActive}
                                    onCheckedChange={() => toggleAutomation(automation.id)}
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteAutomation(automation.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 text-sm mb-3">{automation.description}</p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center space-x-2 text-sm">
                                  {getTriggerIcon(automation.trigger.type)}
                                  <span className="text-gray-600">Trigger:</span>
                                  <span className="font-medium">{automation.trigger.condition}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <Zap className="h-4 w-4" />
                                  <span className="text-gray-600">Action:</span>
                                  <span className="font-medium">{automation.action.details}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Badge className={getCategoryColor(automation.category)}>
                                    {automation.category}
                                  </Badge>
                                  <Badge variant={automation.isActive ? "default" : "secondary"}>
                                    {automation.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-500">
                                  <div>Runs: {automation.runCount}</div>
                                  {automation.lastRun && (
                                    <div>Last: {new Date(automation.lastRun).toLocaleString()}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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

export default Automation;
