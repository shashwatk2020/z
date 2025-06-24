
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
import { Calendar, ArrowLeft, Clock, Users, VideoIcon, MapPin, Link as LinkIcon, Plus, Edit, Trash2 } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  attendees: string[];
  location: string;
  meetingType: 'in-person' | 'video' | 'phone';
  videoLink: string;
  agenda: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const timeZones = [
  'UTC',
  'EST (UTC-5)',
  'CST (UTC-6)',
  'MST (UTC-7)',
  'PST (UTC-8)',
  'GMT (UTC+0)',
  'CET (UTC+1)',
  'JST (UTC+9)',
];

const MeetingScheduler = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [selectedTimeZone, setSelectedTimeZone] = useState('UTC');
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    attendees: '',
    location: '',
    meetingType: 'video' as const,
    videoLink: '',
    agenda: '',
    notes: ''
  });

  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    return endMinutes - startMinutes;
  };

  const addMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.startTime || !newMeeting.endTime) return;

    const duration = calculateDuration(newMeeting.startTime, newMeeting.endTime);
    if (duration <= 0) return;

    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title,
      date: newMeeting.date,
      startTime: newMeeting.startTime,
      endTime: newMeeting.endTime,
      duration,
      attendees: newMeeting.attendees.split(',').map(email => email.trim()).filter(email => email),
      location: newMeeting.location,
      meetingType: newMeeting.meetingType,
      videoLink: newMeeting.videoLink,
      agenda: newMeeting.agenda,
      notes: newMeeting.notes,
      status: 'scheduled'
    };

    setMeetings(prev => [...prev, meeting].sort((a, b) => 
      new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime()
    ));

    setNewMeeting({
      title: '',
      date: '',
      startTime: '09:00',
      endTime: '10:00',
      attendees: '',
      location: '',
      meetingType: 'video',
      videoLink: '',
      agenda: '',
      notes: ''
    });
  };

  const updateMeeting = (updatedMeeting: Meeting) => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === updatedMeeting.id ? updatedMeeting : meeting
    ).sort((a, b) => 
      new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime()
    ));
    setEditingMeeting(null);
  };

  const deleteMeeting = (meetingId: string) => {
    setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
  };

  const updateMeetingStatus = (meetingId: string, status: Meeting['status']) => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === meetingId ? { ...meeting, status } : meeting
    ));
  };

  const generateCalendarLink = (meeting: Meeting) => {
    const startDateTime = new Date(`${meeting.date}T${meeting.startTime}`);
    const endDateTime = new Date(`${meeting.date}T${meeting.endTime}`);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: meeting.title,
      dates: `${formatDate(startDateTime)}/${formatDate(endDateTime)}`,
      details: `${meeting.agenda}\n\n${meeting.videoLink ? `Video Link: ${meeting.videoLink}` : ''}`,
      location: meeting.location || meeting.videoLink || '',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <VideoIcon className="h-4 w-4" />;
      case 'phone': return <Clock className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const upcomingMeetings = meetings.filter(meeting => {
    const meetingDateTime = new Date(`${meeting.date}T${meeting.startTime}`);
    return meetingDateTime >= new Date() && meeting.status === 'scheduled';
  });

  const todaysMeetings = meetings.filter(meeting => {
    const today = new Date().toISOString().split('T')[0];
    return meeting.date === today && meeting.status === 'scheduled';
  });

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
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Meeting Scheduler</h1>
                  <p className="text-gray-600">Schedule meetings across time zones with availability</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Meetings List */}
              <div className="lg:col-span-3 space-y-6">
                {/* Today's Meetings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Meetings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {todaysMeetings.length === 0 ? (
                      <div className="text-center py-4">
                        <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No meetings scheduled for today</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {todaysMeetings.map((meeting) => (
                          <div key={meeting.id} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                  <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {meeting.startTime} - {meeting.endTime}
                                  </span>
                                  <span className="flex items-center">
                                    {getTypeIcon(meeting.meetingType)}
                                    <span className="ml-1 capitalize">{meeting.meetingType}</span>
                                  </span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                {meeting.videoLink && (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={meeting.videoLink} target="_blank" rel="noopener noreferrer">
                                      <LinkIcon className="h-4 w-4" />
                                    </a>
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setEditingMeeting(meeting)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* All Meetings */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>All Meetings</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="timezone">Time Zone:</Label>
                      <Select value={selectedTimeZone} onValueChange={setSelectedTimeZone}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeZones.map(tz => (
                            <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {meetings.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No meetings scheduled. Create your first meeting!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {meetings.map((meeting) => (
                          <div key={meeting.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(meeting.status)}`}>
                                    {meeting.status}
                                  </span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div className="flex items-center space-x-4">
                                    <span className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      {new Date(meeting.date).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center">
                                      <Clock className="h-4 w-4 mr-1" />
                                      {meeting.startTime} - {meeting.endTime} ({meeting.duration} min)
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <span className="flex items-center">
                                      {getTypeIcon(meeting.meetingType)}
                                      <span className="ml-1 capitalize">{meeting.meetingType}</span>
                                    </span>
                                    {meeting.attendees.length > 0 && (
                                      <span className="flex items-center">
                                        <Users className="h-4 w-4 mr-1" />
                                        {meeting.attendees.length} attendees
                                      </span>
                                    )}
                                  </div>
                                  {meeting.location && (
                                    <div className="flex items-center">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      {meeting.location}
                                    </div>
                                  )}
                                  {meeting.agenda && (
                                    <div className="mt-2 text-xs text-gray-500">
                                      <strong>Agenda:</strong> {meeting.agenda}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col space-y-2">
                                <div className="flex space-x-2">
                                  {meeting.videoLink && (
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={meeting.videoLink} target="_blank" rel="noopener noreferrer">
                                        <LinkIcon className="h-4 w-4" />
                                      </a>
                                    </Button>
                                  )}
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={generateCalendarLink(meeting)} target="_blank" rel="noopener noreferrer">
                                      <Calendar className="h-4 w-4" />
                                    </a>
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setEditingMeeting(meeting)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => deleteMeeting(meeting.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                {meeting.status === 'scheduled' && (
                                  <div className="flex space-x-1">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => updateMeetingStatus(meeting.id, 'completed')}
                                      className="text-xs"
                                    >
                                      Complete
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => updateMeetingStatus(meeting.id, 'cancelled')}
                                      className="text-xs"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Add Meeting Form */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{upcomingMeetings.length}</div>
                        <div className="text-sm text-gray-600">Upcoming Meetings</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{todaysMeetings.length}</div>
                        <div className="text-sm text-gray-600">Today's Meetings</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {Math.round(meetings.reduce((acc, m) => acc + m.duration, 0) / 60 * 10) / 10}h
                        </div>
                        <div className="text-sm text-gray-600">Total Meeting Time</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Add Meeting Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {editingMeeting ? 'Edit Meeting' : 'Schedule New Meeting'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="meeting-title">Meeting Title</Label>
                      <Input
                        id="meeting-title"
                        value={editingMeeting ? editingMeeting.title : newMeeting.title}
                        onChange={(e) => editingMeeting 
                          ? setEditingMeeting({...editingMeeting, title: e.target.value})
                          : setNewMeeting({...newMeeting, title: e.target.value})
                        }
                        placeholder="Weekly standup"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="meeting-date">Date</Label>
                      <Input
                        id="meeting-date"
                        type="date"
                        value={editingMeeting ? editingMeeting.date : newMeeting.date}
                        onChange={(e) => editingMeeting 
                          ? setEditingMeeting({...editingMeeting, date: e.target.value})
                          : setNewMeeting({...newMeeting, date: e.target.value})
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={editingMeeting ? editingMeeting.startTime : newMeeting.startTime}
                          onChange={(e) => editingMeeting 
                            ? setEditingMeeting({...editingMeeting, startTime: e.target.value})
                            : setNewMeeting({...newMeeting, startTime: e.target.value})
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="end-time">End Time</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={editingMeeting ? editingMeeting.endTime : newMeeting.endTime}
                          onChange={(e) => editingMeeting 
                            ? setEditingMeeting({...editingMeeting, endTime: e.target.value})
                            : setNewMeeting({...newMeeting, endTime: e.target.value})
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="meeting-type">Meeting Type</Label>
                      <Select
                        value={editingMeeting ? editingMeeting.meetingType : newMeeting.meetingType}
                        onValueChange={(value) => editingMeeting 
                          ? setEditingMeeting({...editingMeeting, meetingType: value as any})
                          : setNewMeeting({...newMeeting, meetingType: value as any})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video Call</SelectItem>
                          <SelectItem value="phone">Phone Call</SelectItem>
                          <SelectItem value="in-person">In Person</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="attendees">Attendees (emails, comma separated)</Label>
                      <Input
                        id="attendees"
                        value={editingMeeting ? editingMeeting.attendees.join(', ') : newMeeting.attendees}
                        onChange={(e) => editingMeeting 
                          ? setEditingMeeting({...editingMeeting, attendees: e.target.value.split(',').map(email => email.trim())})
                          : setNewMeeting({...newMeeting, attendees: e.target.value})
                        }
                        placeholder="john@example.com, jane@example.com"
                      />
                    </div>

                    {(editingMeeting?.meetingType === 'video' || newMeeting.meetingType === 'video') && (
                      <div>
                        <Label htmlFor="video-link">Video Link</Label>
                        <Input
                          id="video-link"
                          value={editingMeeting ? editingMeeting.videoLink : newMeeting.videoLink}
                          onChange={(e) => editingMeeting 
                            ? setEditingMeeting({...editingMeeting, videoLink: e.target.value})
                            : setNewMeeting({...newMeeting, videoLink: e.target.value})
                          }
                          placeholder="https://zoom.us/j/..."
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editingMeeting ? editingMeeting.location : newMeeting.location}
                        onChange={(e) => editingMeeting 
                          ? setEditingMeeting({...editingMeeting, location: e.target.value})
                          : setNewMeeting({...newMeeting, location: e.target.value})
                        }
                        placeholder="Conference Room A"
                      />
                    </div>

                    <div>
                      <Label htmlFor="agenda">Agenda</Label>
                      <Textarea
                        id="agenda"
                        value={editingMeeting ? editingMeeting.agenda : newMeeting.agenda}
                        onChange={(e) => editingMeeting 
                          ? setEditingMeeting({...editingMeeting, agenda: e.target.value})
                          : setNewMeeting({...newMeeting, agenda: e.target.value})
                        }
                        placeholder="Meeting agenda and topics"
                        rows={3}
                      />
                    </div>

                    {editingMeeting ? (
                      <div className="flex space-x-2">
                        <Button onClick={() => updateMeeting(editingMeeting)} className="flex-1">
                          Update Meeting
                        </Button>
                        <Button onClick={() => setEditingMeeting(null)} variant="outline">
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={addMeeting} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Meeting
                      </Button>
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

export default MeetingScheduler;
