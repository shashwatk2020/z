
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar as CalendarIcon, ArrowLeft, Plus, Users, Clock, MapPin, Edit, Trash2 } from 'lucide-react';

interface TeamEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  organizer: string;
  location: string;
  type: 'meeting' | 'deadline' | 'event' | 'holiday';
  color: string;
  description: string;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

const TeamCalendar = () => {
  const [events, setEvents] = useState<TeamEvent[]>([
    {
      id: '1',
      title: 'Team Standup',
      date: '2024-01-16',
      startTime: '09:00',
      endTime: '09:30',
      attendees: ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
      organizer: 'Alice Johnson',
      location: 'Conference Room A',
      type: 'meeting',
      color: 'blue',
      description: 'Daily team standup meeting'
    },
    {
      id: '2',
      title: 'Project Alpha Deadline',
      date: '2024-01-20',
      startTime: '23:59',
      endTime: '23:59',
      attendees: ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson'],
      organizer: 'Alice Johnson',
      location: '',
      type: 'deadline',
      color: 'red',
      description: 'Final deadline for Project Alpha deliverables'
    },
    {
      id: '3',
      title: 'Team Building Event',
      date: '2024-01-25',
      startTime: '14:00',
      endTime: '17:00',
      attendees: ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson'],
      organizer: 'Carol Davis',
      location: 'Bowling Alley',
      type: 'event',
      color: 'green',
      description: 'Fun team building activities'
    }
  ]);

  const [teamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'Alice Johnson', avatar: 'AJ', role: 'Team Lead' },
    { id: '2', name: 'Bob Smith', avatar: 'BS', role: 'Developer' },
    { id: '3', name: 'Carol Davis', avatar: 'CD', role: 'Designer' },
    { id: '4', name: 'David Wilson', avatar: 'DW', role: 'Developer' }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    attendees: [] as string[],
    organizer: 'Alice Johnson',
    location: '',
    type: 'meeting' as const,
    description: ''
  });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const addEvent = () => {
    if (!newEvent.title.trim()) return;

    const event: TeamEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      attendees: newEvent.attendees,
      organizer: newEvent.organizer,
      location: newEvent.location,
      type: newEvent.type,
      color: getColorForType(newEvent.type),
      description: newEvent.description
    };

    setEvents([...events, event]);
    setNewEvent({
      title: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      attendees: [],
      organizer: 'Alice Johnson',
      location: '',
      type: 'meeting',
      description: ''
    });
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'meeting': return 'blue';
      case 'deadline': return 'red';
      case 'event': return 'green';
      case 'holiday': return 'purple';
      default: return 'gray';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'deadline': return 'bg-red-100 text-red-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'holiday': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === dateStr);
      days.push({ day, dateStr, events: dayEvents });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const eventsForSelectedDate = events.filter(event => event.date === selectedDate);

  const toggleAttendee = (memberName: string) => {
    const updatedAttendees = newEvent.attendees.includes(memberName)
      ? newEvent.attendees.filter(name => name !== memberName)
      : [...newEvent.attendees, memberName];
    
    setNewEvent({ ...newEvent, attendees: updatedAttendees });
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Team Calendar</h1>
                    <p className="text-gray-600">Shared calendar for team events and meetings</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Add Event Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="h-5 w-5 mr-2" />
                      Add Event
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Event Title *</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        placeholder="Event title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent({...newEvent, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="deadline">Deadline</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="holiday">Holiday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="startTime">Start</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={newEvent.startTime}
                          onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">End</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={newEvent.endTime}
                          onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                        placeholder="Event location"
                      />
                    </div>
                    <div>
                      <Label>Attendees</Label>
                      <div className="space-y-2 mt-2">
                        {teamMembers.map((member) => (
                          <div key={member.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`attendee-${member.id}`}
                              checked={newEvent.attendees.includes(member.name)}
                              onChange={() => toggleAttendee(member.name)}
                              className="rounded"
                            />
                            <label htmlFor={`attendee-${member.id}`} className="flex items-center space-x-2 text-sm">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                              </Avatar>
                              <span>{member.name}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={addEvent} 
                      className="w-full" 
                      disabled={!newEvent.title.trim()}
                    >
                      Add Event
                    </Button>
                  </CardContent>
                </Card>

                {/* Team Members */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{member.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                          <p className="text-gray-500 text-xs">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Calendar View */}
              <div className="lg:col-span-3 space-y-6">
                {/* Calendar Grid */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2 text-center font-semibold text-gray-600 text-sm">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((dayInfo, index) => (
                        <div
                          key={index}
                          className={`p-2 h-24 border rounded cursor-pointer hover:bg-gray-50 ${
                            dayInfo?.dateStr === selectedDate ? 'bg-blue-100 border-blue-300' : 'border-gray-200'
                          }`}
                          onClick={() => dayInfo && setSelectedDate(dayInfo.dateStr)}
                        >
                          {dayInfo && (
                            <div>
                              <div className="font-medium text-sm mb-1">{dayInfo.day}</div>
                              <div className="space-y-1">
                                {dayInfo.events.slice(0, 2).map((event) => (
                                  <div
                                    key={event.id}
                                    className={`text-xs p-1 rounded truncate ${
                                      event.color === 'blue' ? 'bg-blue-200 text-blue-800' :
                                      event.color === 'red' ? 'bg-red-200 text-red-800' :
                                      event.color === 'green' ? 'bg-green-200 text-green-800' :
                                      'bg-gray-200 text-gray-800'
                                    }`}
                                  >
                                    {event.title}
                                  </div>
                                ))}
                                {dayInfo.events.length > 2 && (
                                  <div className="text-xs text-gray-500">
                                    +{dayInfo.events.length - 2} more
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Events for Selected Date */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Events for {new Date(selectedDate).toLocaleDateString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {eventsForSelectedDate.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">No events for this date</p>
                    ) : (
                      <div className="space-y-4">
                        {eventsForSelectedDate.map((event) => (
                          <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => deleteEvent(event.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{event.startTime} - {event.endTime}</span>
                                  </div>
                                  {event.location && (
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="h-4 w-4" />
                                      <span>{event.location}</span>
                                    </div>
                                  )}
                                </div>

                                {event.description && (
                                  <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                                )}

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Badge className={getTypeColor(event.type)}>
                                      {event.type}
                                    </Badge>
                                    <span className="text-sm text-gray-600">by {event.organizer}</span>
                                  </div>
                                  {event.attendees.length > 0 && (
                                    <div className="flex items-center space-x-2">
                                      <Users className="h-4 w-4 text-gray-500" />
                                      <div className="flex -space-x-1">
                                        {event.attendees.slice(0, 3).map((attendee, index) => (
                                          <Avatar key={index} className="h-6 w-6 border-2 border-white">
                                            <AvatarFallback className="text-xs">
                                              {attendee.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                          </Avatar>
                                        ))}
                                        {event.attendees.length > 3 && (
                                          <div className="h-6 w-6 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center">
                                            <span className="text-xs text-gray-600">+{event.attendees.length - 3}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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

export default TeamCalendar;
