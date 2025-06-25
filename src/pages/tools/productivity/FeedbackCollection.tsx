
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
import { Progress } from '@/components/ui/progress';
import { MessageSquare, ArrowLeft, Star, ThumbsUp, ThumbsDown, TrendingUp, AlertCircle } from 'lucide-react';

interface FeedbackItem {
  id: string;
  title: string;
  content: string;
  rating: number;
  category: string;
  source: string;
  status: 'new' | 'reviewed' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  submittedAt: string;
  submittedBy: string;
  tags: string[];
}

const FeedbackCollection = () => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([
    {
      id: '1',
      title: 'Great new feature!',
      content: 'Love the new dashboard layout. Much more intuitive and user-friendly.',
      rating: 5,
      category: 'feature',
      source: 'website',
      status: 'reviewed',
      priority: 'medium',
      submittedAt: '2024-01-15T10:30:00Z',
      submittedBy: 'john.doe@email.com',
      tags: ['dashboard', 'ui', 'positive']
    },
    {
      id: '2',
      title: 'Bug in mobile app',
      content: 'The app crashes when trying to upload large files. This needs urgent attention.',
      rating: 2,
      category: 'bug',
      source: 'mobile',
      status: 'in-progress',
      priority: 'high',
      submittedAt: '2024-01-14T16:45:00Z',
      submittedBy: 'jane.smith@email.com',
      tags: ['mobile', 'crash', 'upload']
    }
  ]);

  const [newFeedback, setNewFeedback] = useState({
    title: '',
    content: '',
    rating: 5,
    category: 'general',
    source: 'website',
    submittedBy: ''
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const categories = ['all', 'general', 'feature', 'bug', 'improvement', 'complaint'];
  const statuses = ['all', 'new', 'reviewed', 'in-progress', 'resolved'];

  const addFeedback = () => {
    if (!newFeedback.title.trim() || !newFeedback.content.trim()) return;

    const feedbackItem: FeedbackItem = {
      id: Date.now().toString(),
      title: newFeedback.title,
      content: newFeedback.content,
      rating: newFeedback.rating,
      category: newFeedback.category,
      source: newFeedback.source,
      status: 'new',
      priority: newFeedback.rating <= 2 ? 'high' : newFeedback.rating <= 3 ? 'medium' : 'low',
      submittedAt: new Date().toISOString(),
      submittedBy: newFeedback.submittedBy || 'Anonymous',
      tags: []
    };

    setFeedback([feedbackItem, ...feedback]);
    setNewFeedback({
      title: '',
      content: '',
      rating: 5,
      category: 'general',
      source: 'website',
      submittedBy: ''
    });
  };

  const updateFeedbackStatus = (feedbackId: string, newStatus: string) => {
    setFeedback(feedback.map(item =>
      item.id === feedbackId ? { ...item, status: newStatus as any } : item
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
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

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const filteredFeedback = feedback.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  // Calculate feedback statistics
  const totalFeedback = feedback.length;
  const avgRating = feedback.length > 0 ? feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length : 0;
  const positivePercentage = feedback.length > 0 ? (feedback.filter(item => item.rating >= 4).length / feedback.length) * 100 : 0;

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
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Feedback Collection</h1>
                  <p className="text-gray-600">Collect and manage customer feedback and reviews</p>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                      <p className="text-3xl font-bold text-gray-900">{totalFeedback}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Rating</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-3xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                        <div className="flex">{renderStars(Math.round(avgRating))}</div>
                      </div>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Positive Feedback</p>
                      <p className="text-3xl font-bold text-gray-900">{positivePercentage.toFixed(0)}%</p>
                      <Progress value={positivePercentage} className="mt-2" />
                    </div>
                    <ThumbsUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Add Feedback Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Submit New Feedback</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newFeedback.title}
                        onChange={(e) => setNewFeedback({...newFeedback, title: e.target.value})}
                        placeholder="Feedback title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        value={newFeedback.content}
                        onChange={(e) => setNewFeedback({...newFeedback, content: e.target.value})}
                        placeholder="Detailed feedback"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Select value={newFeedback.rating.toString()} onValueChange={(value) => setNewFeedback({...newFeedback, rating: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Star - Poor</SelectItem>
                          <SelectItem value="2">2 Stars - Fair</SelectItem>
                          <SelectItem value="3">3 Stars - Good</SelectItem>
                          <SelectItem value="4">4 Stars - Very Good</SelectItem>
                          <SelectItem value="5">5 Stars - Excellent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newFeedback.category} onValueChange={(value) => setNewFeedback({...newFeedback, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="improvement">Improvement</SelectItem>
                          <SelectItem value="complaint">Complaint</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="source">Source</Label>
                      <Select value={newFeedback.source} onValueChange={(value) => setNewFeedback({...newFeedback, source: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="mobile">Mobile App</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="submittedBy">Email (Optional)</Label>
                      <Input
                        id="submittedBy"
                        type="email"
                        value={newFeedback.submittedBy}
                        onChange={(e) => setNewFeedback({...newFeedback, submittedBy: e.target.value})}
                        placeholder="your@email.com"
                      />
                    </div>
                    <Button 
                      onClick={addFeedback} 
                      className="w-full" 
                      disabled={!newFeedback.title.trim() || !newFeedback.content.trim()}
                    >
                      Submit Feedback
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Feedback List */}
              <div className="lg:col-span-3 space-y-6">
                {/* Filters */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full sm:w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-full sm:w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map(status => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Feedback Items */}
                {filteredFeedback.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No feedback matches your filters</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredFeedback.map((item) => (
                      <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                              <div className="flex items-center space-x-2 mb-3">
                                <div className="flex">{renderStars(item.rating)}</div>
                                <span className="text-sm text-gray-600">by {item.submittedBy}</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(item.submittedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Select
                                value={item.status}
                                onValueChange={(value) => updateFeedbackStatus(item.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="reviewed">Reviewed</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{item.content}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{item.category}</Badge>
                              <Badge variant="outline">{item.source}</Badge>
                              <Badge className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                              <Badge className={getPriorityColor(item.priority)}>
                                {item.priority} priority
                              </Badge>
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

export default FeedbackCollection;
