
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
import { Bookmark, ArrowLeft, Plus, Search, Tag, Star, Trash2, ExternalLink, Globe } from 'lucide-react';

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  favicon?: string;
}

const BookmarkManager = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([
    {
      id: '1',
      title: 'GitHub - React Repository',
      url: 'https://github.com/facebook/react',
      description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
      category: 'development',
      tags: ['react', 'javascript', 'frontend'],
      favorite: true,
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Tailwind CSS Documentation',
      url: 'https://tailwindcss.com/docs',
      description: 'Official documentation for Tailwind CSS framework',
      category: 'design',
      tags: ['css', 'tailwind', 'documentation'],
      favorite: false,
      createdAt: '2024-01-16T14:30:00Z'
    }
  ]);

  const [newBookmark, setNewBookmark] = useState({
    title: '',
    url: '',
    description: '',
    category: 'general',
    tags: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'general', 'development', 'design', 'productivity', 'entertainment', 'news', 'education'];

  const addBookmark = () => {
    if (!newBookmark.title.trim() || !newBookmark.url.trim()) return;

    const bookmark: BookmarkItem = {
      id: Date.now().toString(),
      title: newBookmark.title,
      url: newBookmark.url,
      description: newBookmark.description,
      category: newBookmark.category,
      tags: newBookmark.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      favorite: false,
      createdAt: new Date().toISOString()
    };

    setBookmarks([bookmark, ...bookmarks]);
    setNewBookmark({ title: '', url: '', description: '', category: 'general', tags: '' });
  };

  const deleteBookmark = (bookmarkId: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
  };

  const toggleFavorite = (bookmarkId: string) => {
    setBookmarks(bookmarks.map(bookmark => 
      bookmark.id === bookmarkId ? { ...bookmark, favorite: !bookmark.favorite } : bookmark
    ));
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || bookmark.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
                <Bookmark className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Bookmark Manager</h1>
                  <p className="text-gray-600">Organize and manage your bookmarks with categories and tags</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Add Bookmark Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="h-5 w-5 mr-2" />
                      Add Bookmark
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newBookmark.title}
                        onChange={(e) => setNewBookmark({...newBookmark, title: e.target.value})}
                        placeholder="Bookmark title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="url">URL *</Label>
                      <Input
                        id="url"
                        type="url"
                        value={newBookmark.url}
                        onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newBookmark.description}
                        onChange={(e) => setNewBookmark({...newBookmark, description: e.target.value})}
                        placeholder="Optional description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newBookmark.category} onValueChange={(value) => setNewBookmark({...newBookmark, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="productivity">Productivity</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={newBookmark.tags}
                        onChange={(e) => setNewBookmark({...newBookmark, tags: e.target.value})}
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                    <Button 
                      onClick={addBookmark} 
                      className="w-full" 
                      disabled={!newBookmark.title.trim() || !newBookmark.url.trim()}
                    >
                      Add Bookmark
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Bookmarks List */}
              <div className="lg:col-span-3 space-y-6">
                {/* Search and Filter */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search bookmarks..."
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
                    </div>
                  </CardContent>
                </Card>

                {/* Bookmarks Grid */}
                {filteredBookmarks.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {bookmarks.length === 0 ? 'No bookmarks yet. Add your first bookmark!' : 'No bookmarks match your search criteria.'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredBookmarks.map((bookmark) => (
                      <Card key={bookmark.id} className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="flex-shrink-0">
                                <Globe className="h-8 w-8 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                                      <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                        {bookmark.title}
                                        <ExternalLink className="h-4 w-4 ml-1" />
                                      </a>
                                    </h3>
                                    <p className="text-sm text-blue-600 hover:text-blue-800 truncate">
                                      {bookmark.url}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2 ml-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleFavorite(bookmark.id)}
                                      className={bookmark.favorite ? 'text-yellow-500' : 'text-gray-400'}
                                    >
                                      <Star className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteBookmark(bookmark.id)}
                                      className="text-red-500"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {bookmark.description && (
                                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{bookmark.description}</p>
                                )}

                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline">{bookmark.category}</Badge>
                                    {bookmark.tags.slice(0, 3).map((tag, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        <Tag className="h-3 w-3 mr-1" />
                                        {tag}
                                      </Badge>
                                    ))}
                                    {bookmark.tags.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{bookmark.tags.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-400">
                                    {new Date(bookmark.createdAt).toLocaleDateString()}
                                  </span>
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

export default BookmarkManager;
