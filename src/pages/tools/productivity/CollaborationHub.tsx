
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, ArrowLeft, MessageCircle, FileText, Calendar, Video, Plus, Send } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy';
  avatar: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'message' | 'file' | 'announcement';
}

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  members: string[];
  dueDate: string;
  status: 'active' | 'completed' | 'on-hold';
}

const CollaborationHub = () => {
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      role: 'Project Manager',
      status: 'online',
      avatar: 'AJ'
    },
    {
      id: '2',
      name: 'Bob Smith',
      role: 'Developer',
      status: 'busy',
      avatar: 'BS'
    },
    {
      id: '3',
      name: 'Carol Davis',
      role: 'Designer',
      status: 'online',
      avatar: 'CD'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Alice Johnson',
      content: 'Good morning team! Ready for the sprint review today?',
      timestamp: '2024-01-16T09:00:00Z',
      type: 'message'
    },
    {
      id: '2',
      sender: 'Bob Smith',
      content: 'Just finished the user authentication feature. Ready for testing!',
      timestamp: '2024-01-16T09:15:00Z',
      type: 'message'
    }
  ]);

  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website',
      progress: 75,
      members: ['Alice Johnson', 'Carol Davis'],
      dueDate: '2024-02-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Mobile App',
      description: 'Native mobile application development',
      progress: 45,
      members: ['Bob Smith', 'Alice Johnson'],
      dueDate: '2024-03-01',
      status: 'active'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('messages');

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
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
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Collaboration Hub</h1>
                  <p className="text-gray-600">Central workspace for team collaboration and communication</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Team Members Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{member.avatar}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                          <p className="text-gray-500 text-xs">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Video className="h-4 w-4 mr-2" />
                      Start Meeting
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Share Document
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Event
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-3">
                {/* Tab Navigation */}
                <div className="flex space-x-4 mb-6">
                  <Button
                    variant={activeTab === 'messages' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('messages')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Messages
                  </Button>
                  <Button
                    variant={activeTab === 'projects' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('projects')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Projects
                  </Button>
                  <Button
                    variant={activeTab === 'calendar' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('calendar')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar
                  </Button>
                </div>

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Chat</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        {messages.map((message) => (
                          <div key={message.id} className="flex space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{message.sender.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">{message.sender}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm mt-1">{message.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    {projects.map((project) => (
                      <Card key={project.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">{project.name}</h3>
                              <p className="text-gray-600 text-sm">{project.description}</p>
                            </div>
                            <Badge className={getProjectStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Team:</span>
                              <div className="flex -space-x-1">
                                {project.members.map((member, index) => (
                                  <Avatar key={index} className="h-6 w-6 border-2 border-white">
                                    <AvatarFallback className="text-xs">
                                      {member.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              Due: {new Date(project.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Calendar Tab */}
                {activeTab === 'calendar' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Team Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Calendar integration coming soon</p>
                        <p className="text-sm text-gray-500 mt-2">View and manage team events and meetings</p>
                      </div>
                    </CardContent>
                  </Card>
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

export default CollaborationHub;
