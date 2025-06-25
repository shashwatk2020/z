
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
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, ArrowLeft, Plus, Search, Calendar, Users, CheckSquare, Download, Trash2 } from 'lucide-react';

interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
}

interface MeetingNote {
  id: string;
  title: string;
  date: string;
  duration: string;
  attendees: string[];
  agenda: string[];
  notes: string;
  actionItems: ActionItem[];
  status: 'upcoming' | 'completed' | 'cancelled';
  meetingType: string;
  location: string;
}

const MeetingNotes = () => {
  const [meetings, setMeetings] = useState<MeetingNote[]>([
    {
      id: '1',
      title: 'Weekly Team Standup',
      date: '2024-01-16',
      duration: '30 min',
      attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      agenda: ['Sprint review', 'Blockers discussion', 'Next week planning'],
      notes: 'Team discussed current sprint progress. All tasks are on track. Some concerns about API integration timeline.',
      actionItems: [
        {
          id: '1a',
          task: 'Review API documentation',
          assignee: 'John Doe',
          dueDate: '2024-01-18',
          completed: false
        },
        {
          id: '1b',
          task: 'Schedule client call',
          assignee: 'Jane Smith',
          dueDate: '2024-01-17',
          completed: true
        }
      ],
      status: 'completed',
      meetingType: 'standup',
      location: 'Conference Room A'
    }
  ]);

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    duration: '60 min',
    attendees: '',
    agenda: '',
    notes: '',
    meetingType: 'general',
    location: ''
  });

  const [newActionItem, setNewActionItem] = useState({
    task: '',
    assignee: '',
    dueDate: ''
  });

  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const addMeeting = () => {
    if (!newMeeting.title.trim()) return;

    const meeting: MeetingNote = {
      id: Date.now().toString(),
      title: newMeeting.title,
      date: newMeeting.date,
      duration: newMeeting.duration,
      attendees: newMeeting.attendees.split(',').map(name => name.trim()).filter(name => name),
      agenda: newMeeting.agenda.split('\n').filter(item => item.trim()),
      notes: newMeeting.notes,
      actionItems: [],
      status: new Date(newMeeting.date) > new Date() ? 'upcoming' : 'completed',
      meetingType: newMeeting.meetingType,
      location: newMeeting.location
    };

    setMeetings([meeting, ...meetings]);
    setNewMeeting({
      title: '',
      date: new Date().toISOString().split('T')[0],
      duration: '60 min',
      attendees: '',
      agenda: '',
      notes: '',
      meetingType: 'general',
      location: ''
    });
  };

  const addActionItem = (meetingId: string) => {
    if (!newActionItem.task.trim()) return;

    const actionItem: ActionItem = {
      id: Date.now().toString(),
      task: newActionItem.task,
      assignee: newActionItem.assignee,
      dueDate: newActionItem.dueDate,
      completed: false
    };

    setMeetings(meetings.map(meeting =>
      meeting.id === meetingId
        ? { ...meeting, actionItems: [...meeting.actionItems, actionItem] }
        : meeting
    ));

    setNewActionItem({ task: '', assignee: '', dueDate: '' });
  };

  const toggleActionItem = (meetingId: string, actionItemId: string) => {
    setMeetings(meetings.map(meeting =>
      meeting.id === meetingId
        ? {
          ...meeting,
          actionItems: meeting.actionItems.map(item =>
            item.id === actionItemId ? { ...item, completed: !item.completed } : item
          )
        }
        : meeting
    ));
  };

  const deleteMeeting = (meetingId: string) => {
    setMeetings(meetings.filter(meeting => meeting.id !== meetingId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'standup': return 'bg-purple-100 text-purple-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Meeting Notes</h1>
                  <p className="text-gray-600">Organize meeting notes and track action items</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Add Meeting Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="h-5 w-5 mr-2" />
                      New Meeting
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Meeting Title *</Label>
                      <Input
                        id="title"
                        value={newMeeting.title}
                        onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                        placeholder="Meeting title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newMeeting.date}
                        onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Select value={newMeeting.duration} onValueChange={(value) => setNewMeeting({...newMeeting, duration: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15 min">15 minutes</SelectItem>
                          <SelectItem value="30 min">30 minutes</SelectItem>
                          <SelectItem value="60 min">1 hour</SelectItem>
                          <SelectItem value="90 min">1.5 hours</SelectItem>
                          <SelectItem value="120 min">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="meetingType">Type</Label>
                      <Select value={newMeeting.meetingType} onValueChange={(value) => setNewMeeting({...newMeeting, meetingType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="standup">Standup</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="brainstorm">Brainstorm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newMeeting.location}
                        onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})}
                        placeholder="Conference room or video link"
                      />
                    </div>
                    <div>
                      <Label htmlFor="attendees">Attendees (comma separated)</Label>
                      <Textarea
                        id="attendees"
                        value={newMeeting.attendees}
                        onChange={(e) => setNewMeeting({...newMeeting, attendees: e.target.value})}
                        placeholder="John Doe, Jane Smith, Mike Johnson"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="agenda">Agenda (one per line)</Label>
                      <Textarea
                        id="agenda"
                        value={newMeeting.agenda}
                        onChange={(e) => setNewMeeting({...newMeeting, agenda: e.target.value})}
                        placeholder="Item 1&#10;Item 2&#10;Item 3"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newMeeting.notes}
                        onChange={(e) => setNewMeeting({...newMeeting, notes: e.target.value})}
                        placeholder="Meeting notes and discussion points"
                        rows={4}
                      />
                    </div>
                    <Button 
                      onClick={addMeeting} 
                      className="w-full" 
                      disabled={!newMeeting.title.trim()}
                    >
                      Create Meeting
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Meetings List */}
              <div className="lg:col-span-3 space-y-6">
                {/* Search */}
                <Card>
                  <CardContent className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search meetings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Meeting Cards */}
                {filteredMeetings.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {meetings.length === 0 ? 'No meetings yet. Create your first meeting!' : 'No meetings match your search.'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {filteredMeetings.map((meeting) => (
                      <Card key={meeting.id} className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">{meeting.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(meeting.date).toLocaleDateString()}</span>
                                </div>
                                <span>•</span>
                                <span>{meeting.duration}</span>
                                {meeting.location && (
                                  <>
                                    <span>•</span>
                                    <span>{meeting.location}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(meeting.status)}>
                                {meeting.status}
                              </Badge>
                              <Badge className={getTypeColor(meeting.meetingType)}>
                                {meeting.meetingType}
                              </Badge>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteMeeting(meeting.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {meeting.attendees.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Users className="h-4 w-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Attendees:</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {meeting.attendees.map((attendee, index) => (
                                  <Badge key={index} variant="outline">{attendee}</Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {meeting.agenda.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Agenda:</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {meeting.agenda.map((item, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <span className="text-gray-400">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {meeting.notes && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Notes:</h4>
                              <p className="text-sm text-gray-600 whitespace-pre-wrap">{meeting.notes}</p>
                            </div>
                          )}

                          {/* Action Items */}
                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-medium text-gray-700 flex items-center">
                                <CheckSquare className="h-4 w-4 mr-2" />
                                Action Items ({meeting.actionItems.filter(item => !item.completed).length} pending)
                              </h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedMeetingId(selectedMeetingId === meeting.id ? '' : meeting.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            {selectedMeetingId === meeting.id && (
                              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                  <Input
                                    placeholder="Task description"
                                    value={newActionItem.task}
                                    onChange={(e) => setNewActionItem({...newActionItem, task: e.target.value})}
                                  />
                                  <Input
                                    placeholder="Assignee"
                                    value={newActionItem.assignee}
                                    onChange={(e) => setNewActionItem({...newActionItem, assignee: e.target.value})}
                                  />
                                  <Input
                                    type="date"
                                    value={newActionItem.dueDate}
                                    onChange={(e) => setNewActionItem({...newActionItem, dueDate: e.target.value})}
                                  />
                                </div>
                                <Button
                                  onClick={() => addActionItem(meeting.id)}
                                  disabled={!newActionItem.task.trim()}
                                  size="sm"
                                >
                                  Add Action Item
                                </Button>
                              </div>
                            )}

                            <div className="space-y-2">
                              {meeting.actionItems.map((item) => (
                                <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                  <Checkbox
                                    checked={item.completed}
                                    onCheckedChange={() => toggleActionItem(meeting.id, item.id)}
                                  />
                                  <div className="flex-1">
                                    <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                      {item.task}
                                    </span>
                                    <div className="text-xs text-gray-500">
                                      {item.assignee && `Assigned to: ${item.assignee}`}
                                      {item.assignee && item.dueDate && ' • '}
                                      {item.dueDate && `Due: ${new Date(item.dueDate).toLocaleDateString()}`}
                                    </div>
                                  </div>
                                </div>
                              ))}
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

export default MeetingNotes;
