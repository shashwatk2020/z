
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  ArrowLeft, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Users,
  Target,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Mock data for charts
  const productivityData = [
    { name: 'Mon', tasks: 12, hours: 8 },
    { name: 'Tue', tasks: 15, hours: 7.5 },
    { name: 'Wed', tasks: 8, hours: 9 },
    { name: 'Thu', tasks: 18, hours: 8.5 },
    { name: 'Fri', tasks: 14, hours: 7 },
    { name: 'Sat', tasks: 6, hours: 3 },
    { name: 'Sun', tasks: 4, hours: 2 }
  ];

  const categoryData = [
    { name: 'Work', value: 45, color: '#3B82F6' },
    { name: 'Personal', value: 25, color: '#10B981' },
    { name: 'Learning', value: 20, color: '#F59E0B' },
    { name: 'Health', value: 10, color: '#EF4444' }
  ];

  const quickStats = [
    {
      title: 'Tasks Completed',
      value: '47',
      change: '+12%',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Hours Tracked',
      value: '42.5',
      change: '+5%',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      title: 'Goals Progress',
      value: '73%',
      change: '+8%',
      icon: Target,
      color: 'text-purple-600'
    },
    {
      title: 'Team Projects',
      value: '8',
      change: '+2',
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  const recentTasks = [
    { id: 1, title: 'Review project proposals', status: 'completed', priority: 'high', dueDate: '2024-01-16' },
    { id: 2, title: 'Team standup meeting', status: 'completed', priority: 'medium', dueDate: '2024-01-16' },
    { id: 3, title: 'Update documentation', status: 'in-progress', priority: 'low', dueDate: '2024-01-17' },
    { id: 4, title: 'Client presentation prep', status: 'pending', priority: 'high', dueDate: '2024-01-18' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Project Review Meeting', time: '2:00 PM', date: '2024-01-17' },
    { id: 2, title: 'Team Lunch', time: '12:30 PM', date: '2024-01-17' },
    { id: 3, title: 'Client Call', time: '10:00 AM', date: '2024-01-18' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
                  <Activity className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Productivity Dashboard</h1>
                    <p className="text-gray-600">Your productivity overview and insights</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {['day', 'week', 'month'].map((range) => (
                    <Button
                      key={range}
                      variant={timeRange === range ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeRange(range)}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {quickStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                          <p className={`text-sm ${stat.color}`}>{stat.change} from last week</p>
                        </div>
                        <IconComponent className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Charts Section */}
              <div className="lg:col-span-2 space-y-8">
                {/* Productivity Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Weekly Productivity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={productivityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="tasks" fill="#3B82F6" name="Tasks Completed" />
                        <Bar dataKey="hours" fill="#10B981" name="Hours Worked" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Time Distribution by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-8">
                {/* Recent Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Recent Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentTasks.map((task) => (
                      <div key={task.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(task.status)} variant="secondary">
                              {task.status}
                            </Badge>
                            <Badge className={getPriorityColor(task.priority)} variant="secondary">
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                          <p className="text-xs text-gray-500">{event.time} • {event.date}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Goals Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Goals Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Complete React Course</span>
                        <span className="font-medium">80%</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Fitness Goal</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Save for Vacation</span>
                        <span className="font-medium">90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
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

export default Dashboard;
