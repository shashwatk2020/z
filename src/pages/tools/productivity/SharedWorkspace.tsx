
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  ArrowLeft, 
  Plus, 
  FileText, 
  MessageCircle, 
  Calendar, 
  Settings,
  Activity,
  Folder,
  Clock,
  Share2
} from 'lucide-react';

interface WorkspaceFile {
  id: string;
  name: string;
  type: 'document' | 'spreadsheet' | 'presentation' | 'image' | 'other';
  size: string;
  modifiedAt: string;
  modifiedBy: string;
  shared: boolean;
}

interface WorkspaceMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'message' | 'file' | 'announcement';
}

interface WorkspaceMember {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'online' | 'offline' | 'away';
  avatar: string;
  joinedAt: string;
}

const SharedWorkspace = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const [workspaceInfo] = useState({
    name: 'Project Alpha Workspace',
    description: 'Collaborative workspace for Project Alpha development and design',
    createdAt: '2024-01-10',
    memberCount: 8,
    fileCount: 24,
    lastActivity: '2024-01-16T10:30:00Z'
  });

  const [members] = useState<WorkspaceMember[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      role: 'owner',
      status: 'online',
      avatar: 'AJ',
      joinedAt: '2024-01-10'
    },
    {
      id: '2',
      name: 'Bob Smith',
      role: 'admin',
      status: 'online',
      avatar: 'BS',
      joinedAt: '2024-01-11'
    },
    {
      id: '3',
      name: 'Carol Davis',
      role: 'member',
      status: 'away',
      avatar: 'CD',
      joinedAt: '2024-01-12'
    },
    {
      id: '4',
      name: 'David Wilson',
      role: 'member',
      status: 'offline',
      avatar: 'DW',
      joinedAt: '2024-01-13'
    }
  ]);

  const [files] = useState<WorkspaceFile[]>([
    {
      id: '1',
      name: 'Project Requirements.docx',
      type: 'document',
      size: '2.4 MB',
      modifiedAt: '2024-01-16T09:30:00Z',
      modifiedBy: 'Alice Johnson',
      shared: true
    },
    {
      id: '2',
      name: 'Design Mockups.sketch',
      type: 'other',
      size: '15.2 MB',
      modifiedAt: '2024-01-15T16:45:00Z',
      modifiedBy: 'Carol Davis',
      shared: false
    },
    {
      id: '3',
      name: 'Budget Analysis.xlsx',
      type: 'spreadsheet',
      size: '1.8 MB',
      modifiedAt: '2024-01-15T14:20:00Z',
      modifiedBy: 'Bob Smith',
      shared: true
    }
  ]);

  const [messages, setMessages] = useState<WorkspaceMessage[]>([
    {
      id: '1',
      sender: 'Alice Johnson',
      content: 'Welcome everyone to the Project Alpha workspace! Let\'s collaborate effectively.',
      timestamp: '2024-01-16T09:00:00Z',
      type: 'announcement'
    },
    {
      id: '2',
      sender: 'Bob Smith',
      content: 'I\'ve updated the budget analysis. Please review when you have a chance.',
      timestamp: '2024-01-16T10:15:00Z',
      type: 'message'
    },
    {
      id: '3',
      sender: 'Carol Davis',
      content: 'New design mockups are ready for feedback!',
      timestamp: '2024-01-16T11:30:00Z',
      type: 'message'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: WorkspaceMessage = {
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
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return '📄';
      case 'spreadsheet': return '📊';
      case 'presentation': return '📽️';
      case 'image': return '🖼️';
      default: return '📁';
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{workspaceInfo.name}</h1>
                    <p className="text-gray-600">{workspaceInfo.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button>
                    <Share2 className="h-4 w-4 mr-2" />
                    Invite
                  </Button>
                </div>
              </div>
            </div>

            {/* Workspace Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Members</p>
                      <p className="text-3xl font-bold text-gray-900">{workspaceInfo.memberCount}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Files</p>
                      <p className="text-3xl font-bold text-gray-900">{workspaceInfo.fileCount}</p>
                    </div>
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Messages</p>
                      <p className="text-3xl font-bold text-gray-900">{messages.length}</p>
                    </div>
                    <MessageCircle className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Last Activity</p>
                      <p className="text-sm text-gray-900">
                        {new Date(workspaceInfo.lastActivity).toLocaleDateString()}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="h-5 w-5 mr-2" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>AJ</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">Alice Johnson</span> updated Project Requirements.docx
                          </p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>CD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">Carol Davis</span> uploaded Design Mockups.sketch
                          </p>
                          <p className="text-xs text-gray-500">5 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>BS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">Bob Smith</span> shared Budget Analysis.xlsx
                          </p>
                          <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Upload File
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Start Discussion
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Meeting
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Share2 className="h-4 w-4 mr-2" />
                        Invite Member
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value="files" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Folder className="h-5 w-5 mr-2" />
                        Workspace Files
                      </CardTitle>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Upload File
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <span className="text-2xl">{getFileIcon(file.type)}</span>
                            <div>
                              <h4 className="font-medium text-gray-900">{file.name}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{file.size}</span>
                                <span>Modified by {file.modifiedBy}</span>
                                <span>{new Date(file.modifiedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {file.shared && (
                              <Badge variant="outline">Shared</Badge>
                            )}
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Chat Tab */}
              <TabsContent value="chat" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Team Chat
                    </CardTitle>
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
                              {message.type === 'announcement' && (
                                <Badge variant="secondary" className="text-xs">Announcement</Badge>
                              )}
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
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Members Tab */}
              <TabsContent value="members" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Workspace Members
                      </CardTitle>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Invite Member
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{member.avatar}</AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{member.name}</h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                                <span>•</span>
                                <span className="capitalize">{member.status}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getRoleColor(member.role)}>
                              {member.role}
                            </Badge>
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SharedWorkspace;
