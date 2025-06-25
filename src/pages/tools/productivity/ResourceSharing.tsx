
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
import { Share2, ArrowLeft, Plus, Search, Download, Star, Eye, ThumbsUp, FileText, Link as LinkIcon, BookOpen } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'link' | 'template' | 'tool' | 'tutorial';
  url: string;
  category: string;
  tags: string[];
  sharedBy: string;
  sharedAt: string;
  views: number;
  likes: number;
  isStarred: boolean;
  fileSize?: string;
  format?: string;
}

const ResourceSharing = () => {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'React Best Practices Guide',
      description: 'Comprehensive guide covering React development best practices, performance optimization, and code organization.',
      type: 'document',
      url: 'https://example.com/react-guide.pdf',
      category: 'development',
      tags: ['react', 'javascript', 'best-practices'],
      sharedBy: 'John Developer',
      sharedAt: '2024-01-15T10:00:00Z',
      views: 45,
      likes: 12,
      isStarred: true,
      fileSize: '2.4 MB',
      format: 'PDF'
    },
    {
      id: '2',
      title: 'Design System Template',
      description: 'Complete design system template with components, colors, typography, and guidelines.',
      type: 'template',
      url: 'https://figma.com/design-system-template',
      category: 'design',
      tags: ['design-system', 'ui', 'template'],
      sharedBy: 'Sarah Designer',
      sharedAt: '2024-01-14T14:30:00Z',
      views: 28,
      likes: 8,
      isStarred: false
    }
  ]);

  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'document' as const,
    url: '',
    category: 'general',
    tags: '',
    sharedBy: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const categories = ['all', 'general', 'development', 'design', 'marketing', 'productivity', 'business'];
  const types = ['all', 'document', 'link', 'template', 'tool', 'tutorial'];

  const addResource = () => {
    if (!newResource.title.trim() || !newResource.url.trim()) return;

    const resource: Resource = {
      id: Date.now().toString(),
      title: newResource.title,
      description: newResource.description,
      type: newResource.type,
      url: newResource.url,
      category: newResource.category,
      tags: newResource.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      sharedBy: newResource.sharedBy || 'Anonymous',
      sharedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      isStarred: false
    };

    setResources([resource, ...resources]);
    setNewResource({
      title: '',
      description: '',
      type: 'document',
      url: '',
      category: 'general',
      tags: '',
      sharedBy: ''
    });
  };

  const toggleStar = (resourceId: string) => {
    setResources(resources.map(resource =>
      resource.id === resourceId ? { ...resource, isStarred: !resource.isStarred } : resource
    ));
  };

  const incrementViews = (resourceId: string) => {
    setResources(resources.map(resource =>
      resource.id === resourceId ? { ...resource, views: resource.views + 1 } : resource
    ));
  };

  const incrementLikes = (resourceId: string) => {
    setResources(resources.map(resource =>
      resource.id === resourceId ? { ...resource, likes: resource.likes + 1 } : resource
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-5 w-5" />;
      case 'link': return <LinkIcon className="h-5 w-5" />;
      case 'template': return <FileText className="h-5 w-5" />;
      case 'tool': return <Share2 className="h-5 w-5" />;
      case 'tutorial': return <BookOpen className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'link': return 'bg-green-100 text-green-800';
      case 'template': return 'bg-purple-100 text-purple-800';
      case 'tool': return 'bg-orange-100 text-orange-800';
      case 'tutorial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'development': return 'bg-indigo-100 text-indigo-800';
      case 'design': return 'bg-pink-100 text-pink-800';
      case 'marketing': return 'bg-green-100 text-green-800';
      case 'productivity': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
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
                <Share2 className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Resource Sharing</h1>
                  <p className="text-gray-600">Share and discover useful resources with your team</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Add Resource Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="h-5 w-5 mr-2" />
                      Share Resource
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newResource.title}
                        onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                        placeholder="Resource title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="url">URL *</Label>
                      <Input
                        id="url"
                        type="url"
                        value={newResource.url}
                        onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={newResource.type} onValueChange={(value: any) => setNewResource({...newResource, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="link">Link</SelectItem>
                          <SelectItem value="template">Template</SelectItem>
                          <SelectItem value="tool">Tool</SelectItem>
                          <SelectItem value="tutorial">Tutorial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newResource.category} onValueChange={(value) => setNewResource({...newResource, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="productivity">Productivity</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newResource.description}
                        onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                        placeholder="Brief description of the resource"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={newResource.tags}
                        onChange={(e) => setNewResource({...newResource, tags: e.target.value})}
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sharedBy">Your Name</Label>
                      <Input
                        id="sharedBy"
                        value={newResource.sharedBy}
                        onChange={(e) => setNewResource({...newResource, sharedBy: e.target.value})}
                        placeholder="Your name"
                      />
                    </div>
                    <Button 
                      onClick={addResource} 
                      className="w-full" 
                      disabled={!newResource.title.trim() || !newResource.url.trim()}
                    >
                      Share Resource
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Resources List */}
              <div className="lg:col-span-3 space-y-6">
                {/* Search and Filters */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search resources..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-40">
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
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {types.map(type => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Resources Grid */}
                {filteredResources.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {resources.length === 0 ? 'No resources yet. Share your first resource!' : 'No resources match your search criteria.'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredResources.map((resource) => (
                      <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="flex-shrink-0 text-blue-600">
                                {getTypeIcon(resource.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                                      <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => incrementViews(resource.id)}
                                      >
                                        {resource.title}
                                      </a>
                                    </h3>
                                    <p className="text-sm text-blue-600 hover:text-blue-800 truncate mt-1">
                                      {resource.url}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2 ml-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleStar(resource.id)}
                                      className={resource.isStarred ? 'text-yellow-500' : 'text-gray-400'}
                                    >
                                      <Star className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {resource.description && (
                                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{resource.description}</p>
                                )}

                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center space-x-2">
                                    <Badge className={getTypeColor(resource.type)}>
                                      {resource.type}
                                    </Badge>
                                    <Badge className={getCategoryColor(resource.category)}>
                                      {resource.category}
                                    </Badge>
                                    {resource.tags.slice(0, 2).map((tag, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {resource.tags.length > 2 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{resource.tags.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <Avatar className="h-5 w-5">
                                        <AvatarFallback className="text-xs">
                                          {resource.sharedBy.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span>by {resource.sharedBy}</span>
                                    </div>
                                    <span>{new Date(resource.sharedAt).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <Eye className="h-4 w-4" />
                                      <span>{resource.views}</span>
                                    </div>
                                    <button
                                      onClick={() => incrementLikes(resource.id)}
                                      className="flex items-center space-x-1 hover:text-blue-600"
                                    >
                                      <ThumbsUp className="h-4 w-4" />
                                      <span>{resource.likes}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
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

export default ResourceSharing;
