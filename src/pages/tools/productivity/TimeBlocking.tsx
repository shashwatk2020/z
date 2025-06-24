
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
import { Clock, ArrowLeft, Plus, Edit, Trash2, Copy, Calendar, Focus } from 'lucide-react';

interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: 'work' | 'personal' | 'meeting' | 'break' | 'deep-work' | 'admin';
  description: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  date: string;
}

interface Template {
  id: string;
  name: string;
  blocks: Omit<TimeBlock, 'id' | 'date' | 'completed'>[];
}

const categories = [
  { value: 'work', label: 'Work', color: 'bg-blue-100 text-blue-800' },
  { value: 'personal', label: 'Personal', color: 'bg-green-100 text-green-800' },
  { value: 'meeting', label: 'Meeting', color: 'bg-purple-100 text-purple-800' },
  { value: 'break', label: 'Break', color: 'bg-gray-100 text-gray-800' },
  { value: 'deep-work', label: 'Deep Work', color: 'bg-orange-100 text-orange-800' },
  { value: 'admin', label: 'Administrative', color: 'bg-yellow-100 text-yellow-800' }
];

const TimeBlocking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([
    {
      id: '1',
      title: 'Morning Review',
      startTime: '09:00',
      endTime: '09:30',
      category: 'admin',
      description: 'Review daily goals and priorities',
      priority: 'high',
      completed: false,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '2',
      title: 'Deep Work Session',
      startTime: '09:30',
      endTime: '11:30',
      category: 'deep-work',
      description: 'Focus on important project work',
      priority: 'high',
      completed: false,
      date: new Date().toISOString().split('T')[0]
    }
  ]);

  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'template-1',
      name: 'Standard Workday',
      blocks: [
        { title: 'Morning Review', startTime: '09:00', endTime: '09:30', category: 'admin', description: 'Daily planning', priority: 'medium' },
        { title: 'Deep Work', startTime: '09:30', endTime: '11:30', category: 'deep-work', description: 'Focus time', priority: 'high' },
        { title: 'Meetings', startTime: '11:30', endTime: '12:30', category: 'meeting', description: 'Team meetings', priority: 'medium' },
        { title: 'Lunch Break', startTime: '12:30', endTime: '13:30', category: 'break', description: 'Lunch and rest', priority: 'low' },
        { title: 'Admin Tasks', startTime: '13:30', endTime: '15:00', category: 'admin', description: 'Email and admin', priority: 'medium' },
        { title: 'Project Work', startTime: '15:00', endTime: '17:00', category: 'work', description: 'Project tasks', priority: 'high' }
      ]
    }
  ]);

  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const [newBlock, setNewBlock] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    category: 'work' as const,
    description: '',
    priority: 'medium' as const
  });

  const [newTemplate, setNewTemplate] = useState({
    name: ''
  });

  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);

  const calculateBlockDuration = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const duration = endMinutes - startMinutes;
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const addTimeBlock = () => {
    if (!newBlock.title || !newBlock.startTime || !newBlock.endTime) return;

    const block: TimeBlock = {
      id: Date.now().toString(),
      title: newBlock.title,
      startTime: newBlock.startTime,
      endTime: newBlock.endTime,
      category: newBlock.category,
      description: newBlock.description,
      priority: newBlock.priority,
      completed: false,
      date: selectedDate
    };

    setTimeBlocks([...timeBlocks, block].sort((a, b) => 
      a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date)
    ));

    setNewBlock({
      title: '',
      startTime: '09:00',
      endTime: '10:00',
      category: 'work',
      description: '',
      priority: 'medium'
    });
  };

  const updateTimeBlock = (updatedBlock: TimeBlock) => {
    setTimeBlocks(timeBlocks.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ).sort((a, b) => 
      a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date)
    ));
    setEditingBlock(null);
  };

  const deleteTimeBlock = (blockId: string) => {
    setTimeBlocks(timeBlocks.filter(block => block.id !== blockId));
  };

  const duplicateTimeBlock = (block: TimeBlock) => {
    const newBlock: TimeBlock = {
      ...block,
      id: Date.now().toString(),
      title: `${block.title} (Copy)`,
      completed: false
    };
    setTimeBlocks([...timeBlocks, newBlock]);
  };

  const toggleBlockCompletion = (blockId: string) => {
    setTimeBlocks(timeBlocks.map(block => 
      block.id === blockId ? { ...block, completed: !block.completed } : block
    ));
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const newBlocks: TimeBlock[] = template.blocks.map(block => ({
      ...block,
      id: `${Date.now()}-${Math.random()}`,
      date: selectedDate,
      completed: false
    }));

    // Remove existing blocks for the selected date
    const otherBlocks = timeBlocks.filter(block => block.date !== selectedDate);
    setTimeBlocks([...otherBlocks, ...newBlocks].sort((a, b) => 
      a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date)
    ));
  };

  const saveAsTemplate = () => {
    if (!newTemplate.name) return;

    const todaysBlocks = timeBlocks.filter(block => block.date === selectedDate);
    const templateBlocks = todaysBlocks.map(({ id, date, completed, ...block }) => block);

    const template: Template = {
      id: Date.now().toString(),
      name: newTemplate.name,
      blocks: templateBlocks
    };

    setTemplates([...templates, template]);
    setNewTemplate({ name: '' });
    setIsCreatingTemplate(false);
  };

  const getCategoryStyle = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getDailyStats = () => {
    const todaysBlocks = timeBlocks.filter(block => block.date === selectedDate);
    const totalBlocks = todaysBlocks.length;
    const completedBlocks = todaysBlocks.filter(block => block.completed).length;
    
    let totalMinutes = 0;
    let completedMinutes = 0;
    
    todaysBlocks.forEach(block => {
      const [startHour, startMinute] = block.startTime.split(':').map(Number);
      const [endHour, endMinute] = block.endTime.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      const blockDuration = endMinutes - startMinutes;
      
      totalMinutes += blockDuration;
      if (block.completed) {
        completedMinutes += blockDuration;
      }
    });
    
    const totalHours = Math.round(totalMinutes / 60 * 10) / 10;
    const completedHours = Math.round(completedMinutes / 60 * 10) / 10;
    
    return {
      totalBlocks,
      completedBlocks,
      totalHours,
      completedHours,
      completionRate: totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0
    };
  };

  const todaysBlocks = timeBlocks.filter(block => block.date === selectedDate);
  const stats = getDailyStats();

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
                <Focus className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Time Blocking Tool</h1>
                  <p className="text-gray-600">Block time for focused work and deep work sessions</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Time Blocks */}
              <div className="lg:col-span-3 space-y-6">
                {/* Date Selector and Stats */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                      <div>
                        <Label htmlFor="date-selector">Select Date</Label>
                        <Input
                          id="date-selector"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-auto"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{stats.totalBlocks}</div>
                          <div className="text-sm text-gray-600">Total Blocks</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{stats.completedBlocks}</div>
                          <div className="text-sm text-gray-600">Completed</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{stats.totalHours}h</div>
                          <div className="text-sm text-gray-600">Planned Time</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">{stats.completionRate}%</div>
                          <div className="text-sm text-gray-600">Completion</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Time Blocks List */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>
                      Time Blocks - {new Date(selectedDate).toLocaleDateString()}
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Select onValueChange={applyTemplate}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Apply template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={() => setIsCreatingTemplate(true)} variant="outline" size="sm">
                        Save as Template
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {todaysBlocks.length === 0 ? (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No time blocks scheduled for this date. Create your first block!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {todaysBlocks.map((block) => (
                          <div key={block.id} className={`border-l-4 ${getPriorityColor(block.priority)} bg-white rounded-lg p-4 shadow-sm`}>
                            <div className="flex justify-between items-start">
                              <div className="flex items-start space-x-3 flex-1">
                                <input
                                  type="checkbox"
                                  checked={block.completed}
                                  onChange={() => toggleBlockCompletion(block.id)}
                                  className="mt-1 h-4 w-4 text-blue-600 rounded"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className={`font-semibold text-gray-900 ${block.completed ? 'line-through opacity-60' : ''}`}>
                                      {block.title}
                                    </h3>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryStyle(block.category)}`}>
                                      {categories.find(c => c.value === block.category)?.label}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-1" />
                                      {block.startTime} - {block.endTime}
                                    </div>
                                    <div className="font-medium text-blue-600">
                                      {calculateBlockDuration(block.startTime, block.endTime)}
                                    </div>
                                  </div>
                                  
                                  {block.description && (
                                    <p className={`text-sm text-gray-600 ${block.completed ? 'opacity-60' : ''}`}>
                                      {block.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex space-x-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => duplicateTimeBlock(block)}
                                  title="Duplicate"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => setEditingBlock(block)}
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => deleteTimeBlock(block.id)}
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Add/Edit Time Block */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {editingBlock ? 'Edit Time Block' : 'Add Time Block'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="block-title">Title</Label>
                      <Input
                        id="block-title"
                        value={editingBlock ? editingBlock.title : newBlock.title}
                        onChange={(e) => editingBlock 
                          ? setEditingBlock({...editingBlock, title: e.target.value})
                          : setNewBlock({...newBlock, title: e.target.value})
                        }
                        placeholder="Deep work session"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={editingBlock ? editingBlock.startTime : newBlock.startTime}
                          onChange={(e) => editingBlock 
                            ? setEditingBlock({...editingBlock, startTime: e.target.value})
                            : setNewBlock({...newBlock, startTime: e.target.value})
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="end-time">End Time</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={editingBlock ? editingBlock.endTime : newBlock.endTime}
                          onChange={(e) => editingBlock 
                            ? setEditingBlock({...editingBlock, endTime: e.target.value})
                            : setNewBlock({...newBlock, endTime: e.target.value})
                          }
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={editingBlock ? editingBlock.category : newBlock.category}
                        onValueChange={(value) => editingBlock 
                          ? setEditingBlock({...editingBlock, category: value as any})
                          : setNewBlock({...newBlock, category: value as any})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={editingBlock ? editingBlock.priority : newBlock.priority}
                        onValueChange={(value) => editingBlock 
                          ? setEditingBlock({...editingBlock, priority: value as any})
                          : setNewBlock({...newBlock, priority: value as any})
                        }
                      >
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
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={editingBlock ? editingBlock.description : newBlock.description}
                        onChange={(e) => editingBlock 
                          ? setEditingBlock({...editingBlock, description: e.target.value})
                          : setNewBlock({...newBlock, description: e.target.value})
                        }
                        placeholder="Block description and goals"
                        rows={3}
                      />
                    </div>

                    {editingBlock ? (
                      <div className="flex space-x-2">
                        <Button onClick={() => updateTimeBlock(editingBlock)} className="flex-1">
                          Update Block
                        </Button>
                        <Button onClick={() => setEditingBlock(null)} variant="outline">
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={addTimeBlock} className="w-full" disabled={!newBlock.title}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Time Block
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Save Template Modal */}
                {isCreatingTemplate && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Save as Template</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input
                          id="template-name"
                          value={newTemplate.name}
                          onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                          placeholder="My Daily Schedule"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={saveAsTemplate} className="flex-1" disabled={!newTemplate.name}>
                          Save Template
                        </Button>
                        <Button onClick={() => setIsCreatingTemplate(false)} variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {templates.length === 0 ? (
                      <p className="text-gray-600 text-sm">No templates saved yet</p>
                    ) : (
                      <div className="space-y-2">
                        {templates.map(template => (
                          <div key={template.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm text-gray-600">{template.blocks.length} blocks</div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => applyTemplate(template.id)}
                            >
                              Apply
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Go to Today
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          setSelectedDate(tomorrow.toISOString().split('T')[0]);
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Go to Tomorrow
                      </Button>
                    </div>
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

export default TimeBlocking;
