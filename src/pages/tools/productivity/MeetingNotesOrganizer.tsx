
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Trash2, Search, Calendar, Users, Download, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MeetingNote {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  agenda: string;
  notes: string;
  actionItems: ActionItem[];
  decisions: string[];
  nextMeeting: string;
  category: string;
  tags: string[];
  important: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ActionItem {
  id: number;
  task: string;
  assignee: string;
  deadline: string;
  completed: boolean;
}

const MeetingNotesOrganizer = () => {
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingNote, setEditingNote] = useState<MeetingNote | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    attendees: '',
    agenda: '',
    notes: '',
    decisions: '',
    nextMeeting: '',
    category: 'General',
    tags: ''
  });
  const [newActionItem, setNewActionItem] = useState({
    task: '',
    assignee: '',
    deadline: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedNotes = localStorage.getItem('meetingNotesOrganizer');
    if (savedNotes) {
      setMeetingNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('meetingNotesOrganizer', JSON.stringify(meetingNotes));
  }, [meetingNotes]);

  const addMeetingNote = () => {
    if (!newNote.title.trim() || !newNote.date) {
      toast({
        title: "Error",
        description: "Please enter meeting title and date",
        variant: "destructive"
      });
      return;
    }

    const note: MeetingNote = {
      id: Date.now(),
      title: newNote.title,
      date: newNote.date,
      startTime: newNote.startTime,
      endTime: newNote.endTime,
      attendees: newNote.attendees.split(',').map(a => a.trim()).filter(Boolean),
      agenda: newNote.agenda,
      notes: newNote.notes,
      actionItems: [],
      decisions: newNote.decisions.split('\n').filter(Boolean),
      nextMeeting: newNote.nextMeeting,
      category: newNote.category,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      important: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setMeetingNotes([note, ...meetingNotes]);
    setNewNote({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      attendees: '',
      agenda: '',
      notes: '',
      decisions: '',
      nextMeeting: '',
      category: 'General',
      tags: ''
    });

    toast({
      title: "Success",
      description: "Meeting notes added successfully"
    });
  };

  const updateMeetingNote = () => {
    if (!editingNote) return;

    setMeetingNotes(meetingNotes.map(note =>
      note.id === editingNote.id 
        ? { ...editingNote, updatedAt: new Date() }
        : note
    ));

    setEditingNote(null);
    toast({
      title: "Success",
      description: "Meeting notes updated successfully"
    });
  };

  const deleteMeetingNote = (id: number) => {
    setMeetingNotes(meetingNotes.filter(note => note.id !== id));
    setEditingNote(null);
    toast({
      title: "Success",
      description: "Meeting notes deleted successfully"
    });
  };

  const toggleImportant = (id: number) => {
    setMeetingNotes(meetingNotes.map(note =>
      note.id === id ? { ...note, important: !note.important } : note
    ));
  };

  const addActionItem = (noteId: number) => {
    if (!newActionItem.task.trim()) {
      toast({
        title: "Error",
        description: "Please enter action item task",
        variant: "destructive"
      });
      return;
    }

    const actionItem: ActionItem = {
      id: Date.now(),
      task: newActionItem.task,
      assignee: newActionItem.assignee,
      deadline: newActionItem.deadline,
      completed: false
    };

    setMeetingNotes(meetingNotes.map(note =>
      note.id === noteId
        ? { ...note, actionItems: [...note.actionItems, actionItem] }
        : note
    ));

    setNewActionItem({ task: '', assignee: '', deadline: '' });
    toast({
      title: "Success",
      description: "Action item added"
    });
  };

  const toggleActionItem = (noteId: number, actionId: number) => {
    setMeetingNotes(meetingNotes.map(note =>
      note.id === noteId
        ? {
            ...note,
            actionItems: note.actionItems.map(action =>
              action.id === actionId
                ? { ...action, completed: !action.completed }
                : action
            )
          }
        : note
    ));
  };

  const exportMeetingNotes = () => {
    const notesText = meetingNotes.map(note => {
      return `
MEETING: ${note.title}
DATE: ${note.date} ${note.startTime ? `${note.startTime} - ${note.endTime}` : ''}
ATTENDEES: ${note.attendees.join(', ')}
CATEGORY: ${note.category}

AGENDA:
${note.agenda}

NOTES:
${note.notes}

DECISIONS:
${note.decisions.map(d => `- ${d}`).join('\n')}

ACTION ITEMS:
${note.actionItems.map(a => `- ${a.task} (${a.assignee}) [${a.deadline}] ${a.completed ? '✓' : '○'}`).join('\n')}

NEXT MEETING: ${note.nextMeeting}

---
`.trim();
    }).join('\n\n');

    const blob = new Blob([notesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-notes-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Meeting notes exported"
    });
  };

  const filteredNotes = meetingNotes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.attendees.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || 
      selectedCategory === 'important' ? note.important : 
      note.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'important', ...new Set(meetingNotes.map(note => note.category))];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meeting Notes Organizer
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Organize and manage meeting notes with action items, decisions, and attendee tracking.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{meetingNotes.length}</div>
              <div className="text-sm text-gray-600">Total Meetings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {meetingNotes.filter(n => n.important).length}
              </div>
              <div className="text-sm text-gray-600">Important</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {meetingNotes.reduce((total, note) => total + note.actionItems.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Action Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {meetingNotes.reduce((total, note) => total + note.decisions.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Decisions</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add/Edit Meeting Notes */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {editingNote ? 'Edit Meeting Notes' : 'Add Meeting Notes'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Meeting Title *</Label>
                  <Input
                    placeholder="Weekly Team Meeting"
                    value={editingNote ? editingNote.title : newNote.title}
                    onChange={(e) => {
                      if (editingNote) {
                        setEditingNote({ ...editingNote, title: e.target.value });
                      } else {
                        setNewNote({ ...newNote, title: e.target.value });
                      }
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={editingNote ? editingNote.date : newNote.date}
                      onChange={(e) => {
                        if (editingNote) {
                          setEditingNote({ ...editingNote, date: e.target.value });
                        } else {
                          setNewNote({ ...newNote, date: e.target.value });
                        }
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label>Start</Label>
                    <Input
                      type="time"
                      value={editingNote ? editingNote.startTime : newNote.startTime}
                      onChange={(e) => {
                        if (editingNote) {
                          setEditingNote({ ...editingNote, startTime: e.target.value });
                        } else {
                          setNewNote({ ...newNote, startTime: e.target.value });
                        }
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label>End</Label>
                    <Input
                      type="time"
                      value={editingNote ? editingNote.endTime : newNote.endTime}
                      onChange={(e) => {
                        if (editingNote) {
                          setEditingNote({ ...editingNote, endTime: e.target.value });
                        } else {
                          setNewNote({ ...newNote, endTime: e.target.value });
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Label>Attendees</Label>
                  <Input
                    placeholder="John, Sarah, Mike"
                    value={editingNote ? editingNote.attendees.join(', ') : newNote.attendees}
                    onChange={(e) => {
                      if (editingNote) {
                        setEditingNote({ 
                          ...editingNote, 
                          attendees: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
                        });
                      } else {
                        setNewNote({ ...newNote, attendees: e.target.value });
                      }
                    }}
                  />
                </div>

                <div>
                  <Label>Agenda</Label>
                  <Textarea
                    placeholder="Meeting agenda items..."
                    value={editingNote ? editingNote.agenda : newNote.agenda}
                    onChange={(e) => {
                      if (editingNote) {
                        setEditingNote({ ...editingNote, agenda: e.target.value });
                      } else {
                        setNewNote({ ...newNote, agenda: e.target.value });
                      }
                    }}
                  />
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Meeting notes and discussion points..."
                    value={editingNote ? editingNote.notes : newNote.notes}
                    onChange={(e) => {
                      if (editingNote) {
                        setEditingNote({ ...editingNote, notes: e.target.value });
                      } else {
                        setNewNote({ ...newNote, notes: e.target.value });
                      }
                    }}
                    className="min-h-24"
                  />
                </div>

                <div>
                  <Label>Decisions (one per line)</Label>
                  <Textarea
                    placeholder="Key decisions made..."
                    value={editingNote ? editingNote.decisions.join('\n') : newNote.decisions}
                    onChange={(e) => {
                      if (editingNote) {
                        setEditingNote({ 
                          ...editingNote, 
                          decisions: e.target.value.split('\n').filter(Boolean)
                        });
                      } else {
                        setNewNote({ ...newNote, decisions: e.target.value });
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Input
                      placeholder="General, Project..."
                      value={editingNote ? editingNote.category : newNote.category}
                      onChange={(e) => {
                        if (editingNote) {
                          setEditingNote({ ...editingNote, category: e.target.value });
                        } else {
                          setNewNote({ ...newNote, category: e.target.value });
                        }
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label>Tags</Label>
                    <Input
                      placeholder="weekly, planning"
                      value={editingNote ? editingNote.tags.join(', ') : newNote.tags}
                      onChange={(e) => {
                        if (editingNote) {
                          setEditingNote({ 
                            ...editingNote, 
                            tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                          });
                        } else {
                          setNewNote({ ...newNote, tags: e.target.value });
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Label>Next Meeting</Label>
                  <Input
                    placeholder="Next meeting date/notes"
                    value={editingNote ? editingNote.nextMeeting : newNote.nextMeeting}
                    onChange={(e) => {
                      if (editingNote) {
                        setEditingNote({ ...editingNote, nextMeeting: e.target.value });
                      } else {
                        setNewNote({ ...newNote, nextMeeting: e.target.value });
                      }
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  {editingNote ? (
                    <>
                      <Button onClick={updateMeetingNote} className="flex-1">
                        Update Notes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingNote(null)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={addMeetingNote} className="w-full">
                      Add Meeting Notes
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Meeting Notes List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Meeting Notes
                  </CardTitle>
                  <Button
                    onClick={exportMeetingNotes}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                
                {/* Search and Filter */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search meeting notes..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category === 'all' ? 'All Meetings' : 
                         category === 'important' ? 'Important' : category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredNotes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No meeting notes found matching your search' : 'No meeting notes added yet'}
                    </div>
                  ) : (
                    filteredNotes.map((note) => (
                      <div key={note.id} className="p-4 border rounded-lg bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium cursor-pointer hover:text-blue-600"
                                onClick={() => setEditingNote(note)}>
                              {note.title}
                            </h4>
                            {note.important && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              onClick={() => toggleImportant(note.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <Star className={`h-4 w-4 ${note.important ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                            </Button>
                            <Button
                              onClick={() => deleteMeetingNote(note.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {note.date}
                            </div>
                            {note.startTime && (
                              <div>{note.startTime} - {note.endTime}</div>
                            )}
                            {note.attendees.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {note.attendees.length} attendees
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {note.agenda && (
                          <div className="mb-3">
                            <div className="text-sm font-medium text-gray-700">Agenda:</div>
                            <div className="text-sm text-gray-600">{note.agenda}</div>
                          </div>
                        )}
                        
                        {note.notes && (
                          <div className="mb-3">
                            <div className="text-sm font-medium text-gray-700">Notes:</div>
                            <div className="text-sm text-gray-600 line-clamp-3">{note.notes}</div>
                          </div>
                        )}
                        
                        {note.actionItems.length > 0 && (
                          <div className="mb-3">
                            <div className="text-sm font-medium text-gray-700 mb-1">Action Items:</div>
                            <div className="space-y-1">
                              {note.actionItems.slice(0, 3).map((action) => (
                                <div key={action.id} className="flex items-center gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={action.completed}
                                    onChange={() => toggleActionItem(note.id, action.id)}
                                    className="rounded"
                                  />
                                  <span className={action.completed ? 'line-through text-gray-500' : ''}>
                                    {action.task}
                                  </span>
                                  {action.assignee && (
                                    <Badge variant="outline" className="text-xs">
                                      {action.assignee}
                                    </Badge>
                                  )}
                                </div>
                              ))}
                              {note.actionItems.length > 3 && (
                                <div className="text-xs text-gray-500">
                                  +{note.actionItems.length - 3} more action items
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{note.category}</Badge>
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Created: {new Date(note.createdAt).toLocaleDateString()}
                          {note.updatedAt !== note.createdAt && (
                            <span className="ml-4">
                              Updated: {new Date(note.updatedAt).toLocaleDateString()}
                            </span>
                          )}
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

export default MeetingNotesOrganizer;
