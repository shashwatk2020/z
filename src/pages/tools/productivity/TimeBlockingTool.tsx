
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Trash2, Calendar, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimeBlock {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  category: string;
  color: string;
  description: string;
}

const TimeBlockingTool = () => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newBlock, setNewBlock] = useState({
    title: '',
    startTime: '',
    endTime: '',
    category: 'work',
    description: ''
  });
  const { toast } = useToast();

  const categories = {
    work: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Work' },
    meeting: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Meeting' },
    personal: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Personal' },
    break: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Break' },
    exercise: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Exercise' },
    learning: { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'Learning' }
  };

  useEffect(() => {
    const savedBlocks = localStorage.getItem('timeBlocking');
    if (savedBlocks) {
      setTimeBlocks(JSON.parse(savedBlocks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timeBlocking', JSON.stringify(timeBlocks));
  }, [timeBlocks]);

  const addTimeBlock = () => {
    if (!newBlock.title.trim() || !newBlock.startTime || !newBlock.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (newBlock.startTime >= newBlock.endTime) {
      toast({
        title: "Error",
        description: "End time must be after start time",
        variant: "destructive"
      });
      return;
    }

    // Check for conflicts
    const dayBlocks = getBlocksForDate(selectedDate);
    const newStartTime = new Date(`${selectedDate}T${newBlock.startTime}`);
    const newEndTime = new Date(`${selectedDate}T${newBlock.endTime}`);

    const hasConflict = dayBlocks.some(block => {
      const blockStart = new Date(`${block.date}T${block.startTime}`);
      const blockEnd = new Date(`${block.date}T${block.endTime}`);
      
      return (newStartTime < blockEnd && newEndTime > blockStart);
    });

    if (hasConflict) {
      toast({
        title: "Error",
        description: "Time block conflicts with existing block",
        variant: "destructive"
      });
      return;
    }

    const block: TimeBlock = {
      id: Date.now(),
      title: newBlock.title,
      startTime: newBlock.startTime,
      endTime: newBlock.endTime,
      date: selectedDate,
      category: newBlock.category,
      color: categories[newBlock.category as keyof typeof categories].color,
      description: newBlock.description
    };

    setTimeBlocks([...timeBlocks, block]);
    setNewBlock({
      title: '',
      startTime: '',
      endTime: '',
      category: 'work',
      description: ''
    });

    toast({
      title: "Success",
      description: "Time block added successfully"
    });
  };

  const deleteTimeBlock = (id: number) => {
    setTimeBlocks(timeBlocks.filter(block => block.id !== id));
    toast({
      title: "Success",
      description: "Time block deleted"
    });
  };

  const getBlocksForDate = (date: string) => {
    return timeBlocks
      .filter(block => block.date === date)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diff = end.getTime() - start.getTime();
    const minutes = diff / (1000 * 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    } else {
      return `${remainingMinutes}m`;
    }
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 23; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(time);
    }
    return slots;
  };

  const getTotalPlannedTime = (date: string) => {
    const blocks = getBlocksForDate(date);
    let totalMinutes = 0;
    
    blocks.forEach(block => {
      const start = new Date(`2000-01-01T${block.startTime}`);
      const end = new Date(`2000-01-01T${block.endTime}`);
      const diff = end.getTime() - start.getTime();
      totalMinutes += diff / (1000 * 60);
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const getCategoryStats = (date: string) => {
    const blocks = getBlocksForDate(date);
    const stats: { [key: string]: number } = {};
    
    blocks.forEach(block => {
      const start = new Date(`2000-01-01T${block.startTime}`);
      const end = new Date(`2000-01-01T${block.endTime}`);
      const diff = end.getTime() - start.getTime();
      const minutes = diff / (1000 * 60);
      
      stats[block.category] = (stats[block.category] || 0) + minutes;
    });
    
    return stats;
  };

  const dayBlocks = getBlocksForDate(selectedDate);
  const timeSlots = getTimeSlots();
  const categoryStats = getCategoryStats(selectedDate);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Time Blocking Tool
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Organize your day with time blocking techniques to maximize productivity and focus.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Add Time Block */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Time Block
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Title</Label>
                  <Input
                    placeholder="Deep work session"
                    value={newBlock.title}
                    onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Input
                    placeholder="Optional description"
                    value={newBlock.description}
                    onChange={(e) => setNewBlock({ ...newBlock, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={newBlock.startTime}
                      onChange={(e) => setNewBlock({ ...newBlock, startTime: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={newBlock.endTime}
                      onChange={(e) => setNewBlock({ ...newBlock, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Category</Label>
                  <Select value={newBlock.category} onValueChange={(value) => setNewBlock({ ...newBlock, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categories).map(([key, cat]) => (
                        <SelectItem key={key} value={key}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={addTimeBlock} className="w-full">
                  Add Time Block
                </Button>
              </CardContent>
            </Card>

            {/* Category Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Daily Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium">Total Planned:</span>
                    <span className="ml-2">{getTotalPlannedTime(selectedDate)}</span>
                  </div>
                  
                  {Object.entries(categoryStats).map(([category, minutes]) => (
                    <div key={category} className="flex justify-between text-sm">
                      <span className="capitalize">{category}:</span>
                      <span>{Math.floor(minutes / 60)}h {minutes % 60}m</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Blocks Display */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Schedule for {new Date(selectedDate).toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {dayBlocks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No time blocks scheduled for this day
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {dayBlocks.map((block) => (
                        <div
                          key={block.id}
                          className={`p-4 rounded-lg border ${block.color}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{block.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {categories[block.category as keyof typeof categories].label}
                                </Badge>
                              </div>
                              
                              {block.description && (
                                <p className="text-sm opacity-75 mb-2">{block.description}</p>
                              )}
                              
                              <div className="flex items-center gap-4 text-sm opacity-75">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(block.startTime)} - {formatTime(block.endTime)}
                                </div>
                                <div>
                                  Duration: {getDuration(block.startTime, block.endTime)}
                                </div>
                              </div>
                            </div>
                            
                            <Button
                              onClick={() => deleteTimeBlock(block.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Category Legend */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(categories).map(([key, category]) => (
                <div key={key} className={`p-3 rounded-lg text-center ${category.color}`}>
                  <div className="font-medium">{category.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TimeBlockingTool;
