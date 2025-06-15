
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Trash2, Clock, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScheduleItem {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  type: 'work' | 'meeting' | 'break' | 'personal';
  color: string;
  recurring: boolean;
}

const WorkSchedulePlanner = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [newItem, setNewItem] = useState({
    title: '',
    startTime: '',
    endTime: '',
    dayOfWeek: 1,
    type: 'work' as const,
    recurring: true
  });
  const { toast } = useToast();

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const typeColors = {
    work: 'bg-blue-100 text-blue-800 border-blue-200',
    meeting: 'bg-purple-100 text-purple-800 border-purple-200',
    break: 'bg-green-100 text-green-800 border-green-200',
    personal: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  useEffect(() => {
    const savedSchedule = localStorage.getItem('workSchedulePlanner');
    if (savedSchedule) {
      setScheduleItems(JSON.parse(savedSchedule));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workSchedulePlanner', JSON.stringify(scheduleItems));
  }, [scheduleItems]);

  const addScheduleItem = () => {
    if (!newItem.title.trim() || !newItem.startTime || !newItem.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (newItem.startTime >= newItem.endTime) {
      toast({
        title: "Error",
        description: "End time must be after start time",
        variant: "destructive"
      });
      return;
    }

    const item: ScheduleItem = {
      id: Date.now(),
      title: newItem.title,
      startTime: newItem.startTime,
      endTime: newItem.endTime,
      dayOfWeek: newItem.dayOfWeek,
      type: newItem.type,
      color: typeColors[newItem.type],
      recurring: newItem.recurring
    };

    setScheduleItems([...scheduleItems, item]);
    setNewItem({
      title: '',
      startTime: '',
      endTime: '',
      dayOfWeek: 1,
      type: 'work',
      recurring: true
    });

    toast({
      title: "Success",
      description: "Schedule item added successfully"
    });
  };

  const deleteItem = (id: number) => {
    setScheduleItems(scheduleItems.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Schedule item deleted"
    });
  };

  const getItemsForDay = (dayIndex: number) => {
    return scheduleItems
      .filter(item => item.dayOfWeek === dayIndex)
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

  const getTotalWeeklyHours = () => {
    return scheduleItems.reduce((total, item) => {
      const start = new Date(`2000-01-01T${item.startTime}`);
      const end = new Date(`2000-01-01T${item.endTime}`);
      const diff = end.getTime() - start.getTime();
      return total + (diff / (1000 * 60 * 60));
    }, 0);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Work Schedule Planner
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Plan and organize your weekly work schedule with time blocks for different activities.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{scheduleItems.length}</div>
              <div className="text-sm text-gray-600">Schedule Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{getTotalWeeklyHours().toFixed(1)}h</div>
              <div className="text-sm text-gray-600">Weekly Hours</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {scheduleItems.filter(item => item.type === 'meeting').length}
              </div>
              <div className="text-sm text-gray-600">Meetings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {scheduleItems.filter(item => item.type === 'break').length}
              </div>
              <div className="text-sm text-gray-600">Breaks</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Add Schedule Item */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Schedule Item
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    placeholder="Meeting, Work, Break..."
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Day</Label>
                  <Select value={newItem.dayOfWeek.toString()} onValueChange={(value) => setNewItem({ ...newItem, dayOfWeek: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={newItem.startTime}
                      onChange={(e) => setNewItem({ ...newItem, startTime: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={newItem.endTime}
                      onChange={(e) => setNewItem({ ...newItem, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Type</Label>
                  <Select value={newItem.type} onValueChange={(value: any) => setNewItem({ ...newItem, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="break">Break</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={addScheduleItem} className="w-full">
                  Add to Schedule
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Schedule */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Schedule
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                  {days.map((day, dayIndex) => (
                    <div key={dayIndex} className="border rounded-lg p-3 min-h-40">
                      <div className="font-medium text-center mb-3 pb-2 border-b">
                        {day}
                      </div>
                      
                      <div className="space-y-2">
                        {getItemsForDay(dayIndex).length === 0 ? (
                          <div className="text-center text-gray-400 text-xs py-4">
                            No schedule
                          </div>
                        ) : (
                          getItemsForDay(dayIndex).map((item) => (
                            <div
                              key={item.id}
                              className={`p-2 rounded text-xs ${item.color}`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <div className="font-medium truncate">{item.title}</div>
                                <Button
                                  onClick={() => deleteItem(item.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0"
                                >
                                  <Trash2 className="h-2 w-2" />
                                </Button>
                              </div>
                              
                              <div className="flex items-center gap-1 text-xs opacity-75">
                                <Clock className="h-2 w-2" />
                                {formatTime(item.startTime)} - {formatTime(item.endTime)}
                              </div>
                              
                              <div className="text-xs opacity-75">
                                {getDuration(item.startTime, item.endTime)}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Legend */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Schedule Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(typeColors).map(([type, color]) => (
                <div key={type} className={`p-3 rounded-lg text-center ${color}`}>
                  <div className="font-medium capitalize">{type}</div>
                  <div className="text-xs opacity-75">
                    {scheduleItems.filter(item => item.type === type).length} items
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default WorkSchedulePlanner;
