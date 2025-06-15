
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Globe, Plus, Trash2, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimeZone {
  id: number;
  label: string;
  timezone: string;
  city: string;
}

interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: number;
  timezone: string;
}

const TimeZonePlanner = () => {
  const [timeZones, setTimeZones] = useState<TimeZone[]>([
    { id: 1, label: 'Local', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, city: 'Local Time' }
  ]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [newTimeZone, setNewTimeZone] = useState({
    label: '',
    timezone: '',
    city: ''
  });
  
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    duration: 60,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const { toast } = useToast();

  const commonTimeZones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)', city: 'New York' },
    { value: 'America/Chicago', label: 'Central Time (CT)', city: 'Chicago' },
    { value: 'America/Denver', label: 'Mountain Time (MT)', city: 'Denver' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', city: 'Los Angeles' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)', city: 'London' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)', city: 'Paris' },
    { value: 'Europe/Moscow', label: 'Moscow Time (MSK)', city: 'Moscow' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', city: 'Tokyo' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)', city: 'Shanghai' },
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST)', city: 'Mumbai' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)', city: 'Sydney' },
    { value: 'Pacific/Auckland', label: 'New Zealand Time (NZST)', city: 'Auckland' }
  ];

  useEffect(() => {
    const savedTimeZones = localStorage.getItem('timeZonePlanner_zones');
    if (savedTimeZones) {
      setTimeZones(JSON.parse(savedTimeZones));
    }
    
    const savedMeetings = localStorage.getItem('timeZonePlanner_meetings');
    if (savedMeetings) {
      setMeetings(JSON.parse(savedMeetings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timeZonePlanner_zones', JSON.stringify(timeZones));
  }, [timeZones]);

  useEffect(() => {
    localStorage.setItem('timeZonePlanner_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const addTimeZone = () => {
    if (!newTimeZone.label.trim() || !newTimeZone.timezone) {
      toast({
        title: "Error",
        description: "Please fill in all timezone fields",
        variant: "destructive"
      });
      return;
    }

    const timeZone: TimeZone = {
      id: Date.now(),
      label: newTimeZone.label,
      timezone: newTimeZone.timezone,
      city: newTimeZone.city
    };

    setTimeZones([...timeZones, timeZone]);
    setNewTimeZone({ label: '', timezone: '', city: '' });

    toast({
      title: "Success",
      description: "Time zone added successfully"
    });
  };

  const addMeeting = () => {
    if (!newMeeting.title.trim() || !newMeeting.date || !newMeeting.time) {
      toast({
        title: "Error",
        description: "Please fill in all meeting fields",
        variant: "destructive"
      });
      return;
    }

    const meeting: Meeting = {
      id: Date.now(),
      title: newMeeting.title,
      date: newMeeting.date,
      time: newMeeting.time,
      duration: newMeeting.duration,
      timezone: newMeeting.timezone
    };

    setMeetings([...meetings, meeting]);
    setNewMeeting({
      title: '',
      date: '',
      time: '',
      duration: 60,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    toast({
      title: "Success",
      description: "Meeting added successfully"
    });
  };

  const deleteTimeZone = (id: number) => {
    if (timeZones.length <= 1) {
      toast({
        title: "Error",
        description: "You must have at least one time zone",
        variant: "destructive"
      });
      return;
    }
    
    setTimeZones(timeZones.filter(tz => tz.id !== id));
    toast({
      title: "Success",
      description: "Time zone removed"
    });
  };

  const deleteMeeting = (id: number) => {
    setMeetings(meetings.filter(m => m.id !== id));
    toast({
      title: "Success",
      description: "Meeting deleted"
    });
  };

  const formatTimeInTimezone = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatDateInTimezone = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const convertMeetingTime = (meeting: Meeting, targetTimezone: string) => {
    const meetingDate = new Date(`${meeting.date}T${meeting.time}`);
    
    // Create a date in the meeting's timezone
    const meetingInOriginalTz = new Date(meetingDate.toLocaleString('en-US', { timeZone: meeting.timezone }));
    const offset = meetingDate.getTime() - meetingInOriginalTz.getTime();
    const adjustedDate = new Date(meetingDate.getTime() + offset);
    
    return formatTimeInTimezone(adjustedDate, targetTimezone);
  };

  const isWorkingHours = (timezone: string) => {
    const time = formatTimeInTimezone(currentTime, timezone);
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM');
    const hour24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
    
    return hour24 >= 9 && hour24 < 17; // 9 AM to 5 PM
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Time Zone Planner
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Plan meetings across different time zones and keep track of times around the world.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Time Zone Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add Time Zone */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Time Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Label</Label>
                  <Input
                    placeholder="Team, Client, etc."
                    value={newTimeZone.label}
                    onChange={(e) => setNewTimeZone({ ...newTimeZone, label: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Time Zone</Label>
                  <Select value={newTimeZone.timezone} onValueChange={(value) => {
                    const selected = commonTimeZones.find(tz => tz.value === value);
                    setNewTimeZone({ 
                      ...newTimeZone, 
                      timezone: value,
                      city: selected?.city || ''
                    });
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonTimeZones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={addTimeZone} className="w-full">
                  Add Time Zone
                </Button>
              </CardContent>
            </Card>

            {/* Add Meeting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Schedule Meeting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Meeting Title</Label>
                  <Input
                    placeholder="Team standup"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newMeeting.date}
                      onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={newMeeting.time}
                      onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Time Zone</Label>
                  <Select value={newMeeting.timezone} onValueChange={(value) => setNewMeeting({ ...newMeeting, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {commonTimeZones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting({ ...newMeeting, duration: parseInt(e.target.value) || 60 })}
                    min="15"
                    max="480"
                    step="15"
                  />
                </div>

                <Button onClick={addMeeting} className="w-full">
                  Add Meeting
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Time Zone Display and Meetings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Times */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Current Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {timeZones.map((tz) => (
                    <div key={tz.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{tz.label}</div>
                        <div className="text-sm text-gray-600">{tz.city}</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-mono">
                          {formatTimeInTimezone(currentTime, tz.timezone)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDateInTimezone(currentTime, tz.timezone)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {isWorkingHours(tz.timezone) ? (
                          <Badge className="bg-green-100 text-green-800">Work Hours</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Off Hours</Badge>
                        )}
                        
                        {tz.id !== timeZones[0]?.id && (
                          <Button
                            onClick={() => deleteTimeZone(tz.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Meetings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Scheduled Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meetings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No meetings scheduled
                    </div>
                  ) : (
                    meetings.map((meeting) => (
                      <div key={meeting.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium">{meeting.title}</h4>
                            <div className="text-sm text-gray-600">
                              {meeting.date} • {meeting.duration} minutes
                            </div>
                          </div>
                          <Button
                            onClick={() => deleteMeeting(meeting.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="grid gap-2">
                          {timeZones.map((tz) => (
                            <div key={tz.id} className="flex justify-between text-sm">
                              <span className="font-medium">{tz.label}:</span>
                              <span className="font-mono">
                                {convertMeetingTime(meeting, tz.timezone)}
                              </span>
                            </div>
                          ))}
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

export default TimeZonePlanner;
