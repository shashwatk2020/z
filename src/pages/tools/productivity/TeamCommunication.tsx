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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  ArrowLeft, 
  Send, 
  Plus, 
  Hash, 
  Users, 
  Settings,
  Phone,
  Video,
  Paperclip,
  Search,
  Bell
} from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  memberCount: number;
  unreadCount: number;
  lastActivity: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  channelId: string;
  type: 'text' | 'file' | 'system';
  reactions?: { emoji: string; count: number; users: string[] }[];
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  role: string;
}

const TeamCommunication = () => {
  const [channels] = useState<Channel[]>([
    {
      id: '1',
      name: 'general',
      description: 'General team discussions',
      type: 'public',
      memberCount: 8,
      unreadCount: 3,
      lastActivity: '2024-01-16T10:30:00Z'
    },
    {
      id: '2',
      name: 'project-alpha',
      description: 'Project Alpha development',
      type: 'public',
      memberCount: 5,
      unreadCount: 0,
      lastActivity: '2024-01-16T09:15:00Z'
    },
    {
      id: '3',
      name: 'design-team',
      description: 'Design team collaboration',
      type: 'private',
      memberCount: 3,
      unreadCount: 1,
      lastActivity: '2024-01-16T08:45:00Z'
    }
  ]);

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      avatar: 'AJ',
      status: 'online',
      role: 'Team Lead'
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: 'BS',
      status: 'busy',
      role: 'Developer'
    },
    {
      id: '3',
      name: 'Carol Davis',
      avatar: 'CD',
      status: 'online',
      role: 'Designer'
    },
    {
      id: '4',
      name: 'David Wilson',
      avatar: 'DW',
      status: 'away',
      role: 'Developer'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Alice Johnson',
      content: 'Good morning team! Ready for today\'s sprint review?',
      timestamp: '2024-01-16T09:00:00Z',
      channelId: '1',
      type: 'text'
    },
    {
      id: '2',
      sender: 'Bob Smith',
      content: 'Yes! I\'ve finished the authentication module. Ready for testing.',
      timestamp: '2024-01-16T09:15:00Z',
      channelId: '1',
      type: 'text',
      reactions: [{ emoji: '👍', count: 2, users: ['Alice Johnson', 'Carol Davis'] }]
    },
    {
      id: '3',
      sender: 'Carol Davis',
      content: 'The new design mockups are ready for review. Let me know what you think!',
      timestamp: '2024-01-16T10:30:00Z',
      channelId: '1',
      type: 'text'
    }
  ]);

  const [activeChannel, setActiveChannel] = useState('1');
  const [newMessage, setNewMessage] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDescription, setNewChannelDescription] = useState('');
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
      timestamp: new Date().toISOString(),
      channelId: activeChannel,
      type: 'text'
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const channelMessages = messages.filter(msg => msg.channelId === activeChannel);
  const activeChannelInfo = channels.find(ch => ch.id === activeChannel);

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
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Team Communication</h1>
                  <p className="text-gray-600">Real-time team chat and collaboration</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[600px]">
              {/* Sidebar - Channels & Members */}
              <div className="lg:col-span-1 space-y-4">
                {/* Channels */}
                <Card className="h-80">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Channels</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCreateChannel(!showCreateChannel)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {showCreateChannel && (
                      <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                        <Input
                          placeholder="Channel name"
                          value={newChannelName}
                          onChange={(e) => setNewChannelName(e.target.value)}
                        />
                        <Input
                          placeholder="Description"
                          value={newChannelDescription}
                          onChange={(e) => setNewChannelDescription(e.target.value)}
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">Create</Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowCreateChannel(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                    {channels.map((channel) => (
                      <div
                        key={channel.id}
                        className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                          activeChannel === channel.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                        }`}
                        onClick={() => setActiveChannel(channel.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <Hash className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">{channel.name}</span>
                          {channel.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs px-1">
                              {channel.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 ml-6 truncate">{channel.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Team Members */}
                <Card className="flex-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Team ({teamMembers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-sm">{member.avatar}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Main Chat Area */}
              <div className="lg:col-span-4">
                <Card className="h-full flex flex-col">
                  {/* Chat Header */}
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Hash className="h-5 w-5 text-gray-500" />
                        <div>
                          <h3 className="font-semibold">{activeChannelInfo?.name}</h3>
                          <p className="text-sm text-gray-600">{activeChannelInfo?.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Search className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages Area */}
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {channelMessages.map((message) => (
                      <div key={message.id} className="flex space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-sm">
                            {message.sender.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{message.sender}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{message.content}</p>
                          {message.reactions && (
                            <div className="flex space-x-2 mt-2">
                              {message.reactions.map((reaction, index) => (
                                <button
                                  key={index}
                                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200 text-xs"
                                >
                                  <span>{reaction.emoji}</span>
                                  <span>{reaction.count}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder={`Message #${activeChannelInfo?.name}`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
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

export default TeamCommunication;
