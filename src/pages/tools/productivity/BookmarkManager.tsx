
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Plus, Trash2, Search, ExternalLink, Star, Folder } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookmarkItem {
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  favorite: boolean;
  dateAdded: Date;
  lastVisited: Date | null;
  visitCount: number;
}

const BookmarkManager = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newBookmark, setNewBookmark] = useState({
    title: '',
    url: '',
    description: '',
    category: 'General',
    tags: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkManager');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bookmarkManager', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = () => {
    if (!newBookmark.title.trim() || !newBookmark.url.trim()) {
      toast({
        title: "Error",
        description: "Please enter both title and URL",
        variant: "destructive"
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(newBookmark.url.startsWith('http') ? newBookmark.url : `https://${newBookmark.url}`);
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    const bookmark: BookmarkItem = {
      id: Date.now(),
      title: newBookmark.title,
      url: newBookmark.url.startsWith('http') ? newBookmark.url : `https://${newBookmark.url}`,
      description: newBookmark.description,
      category: newBookmark.category,
      tags: newBookmark.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      favorite: false,
      dateAdded: new Date(),
      lastVisited: null,
      visitCount: 0
    };

    setBookmarks([bookmark, ...bookmarks]);
    setNewBookmark({
      title: '',
      url: '',
      description: '',
      category: 'General',
      tags: ''
    });

    toast({
      title: "Success",
      description: "Bookmark added successfully"
    });
  };

  const deleteBookmark = (id: number) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
    toast({
      title: "Success",
      description: "Bookmark deleted successfully"
    });
  };

  const toggleFavorite = (id: number) => {
    setBookmarks(bookmarks.map(bookmark => 
      bookmark.id === id ? { ...bookmark, favorite: !bookmark.favorite } : bookmark
    ));
  };

  const visitBookmark = (id: number, url: string) => {
    setBookmarks(bookmarks.map(bookmark => 
      bookmark.id === id ? { 
        ...bookmark, 
        lastVisited: new Date(),
        visitCount: bookmark.visitCount + 1
      } : bookmark
    ));
    window.open(url, '_blank');
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = 
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || 
      selectedCategory === 'favorites' ? bookmark.favorite : 
      bookmark.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'favorites', ...new Set(bookmarks.map(bookmark => bookmark.category))];
  const popularTags = [...new Set(bookmarks.flatMap(b => b.tags))].slice(0, 10);

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bookmark Manager
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Organize and manage your web bookmarks with categories, tags, and favorites.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{bookmarks.length}</div>
              <div className="text-sm text-gray-600">Total Bookmarks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {bookmarks.filter(b => b.favorite).length}
              </div>
              <div className="text-sm text-gray-600">Favorites</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {categories.length - 2}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {bookmarks.reduce((total, b) => total + b.visitCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Visits</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Bookmark */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Bookmark
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    placeholder="My Favorite Website"
                    value={newBookmark.title}
                    onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>URL *</Label>
                  <Input
                    placeholder="https://example.com"
                    value={newBookmark.url}
                    onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Brief description of the website"
                    value={newBookmark.description}
                    onChange={(e) => setNewBookmark({ ...newBookmark, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Input
                      placeholder="Work, Personal..."
                      value={newBookmark.category}
                      onChange={(e) => setNewBookmark({ ...newBookmark, category: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>Tags</Label>
                    <Input
                      placeholder="tag1, tag2"
                      value={newBookmark.tags}
                      onChange={(e) => setNewBookmark({ ...newBookmark, tags: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={addBookmark} className="w-full">
                  Add Bookmark
                </Button>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            {popularTags.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => setSearchTerm(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Bookmarks List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  Your Bookmarks
                </CardTitle>
                
                {/* Search and Filter */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search bookmarks..."
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
                        {category === 'all' ? 'All Bookmarks' : 
                         category === 'favorites' ? 'Favorites' : category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredBookmarks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No bookmarks found matching your search' : 'No bookmarks added yet'}
                    </div>
                  ) : (
                    filteredBookmarks.map((bookmark) => (
                      <div key={bookmark.id} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Folder className="h-4 w-4 text-gray-400" />
                              <h4 className="font-medium cursor-pointer hover:text-blue-600"
                                  onClick={() => visitBookmark(bookmark.id, bookmark.url)}>
                                {bookmark.title}
                              </h4>
                              {bookmark.favorite && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              onClick={() => visitBookmark(bookmark.id, bookmark.url)}
                              variant="ghost"
                              size="sm"
                            >
                              <ExternalLink className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button
                              onClick={() => toggleFavorite(bookmark.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <Star className={`h-4 w-4 ${bookmark.favorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                            </Button>
                            <Button
                              onClick={() => deleteBookmark(bookmark.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-sm text-blue-600 mb-2 cursor-pointer"
                             onClick={() => visitBookmark(bookmark.id, bookmark.url)}>
                          {getDomainFromUrl(bookmark.url)}
                        </div>
                        
                        {bookmark.description && (
                          <p className="text-sm text-gray-600 mb-3">
                            {bookmark.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant="outline">{bookmark.category}</Badge>
                          {bookmark.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {bookmark.visitCount > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {bookmark.visitCount} visits
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Added: {new Date(bookmark.dateAdded).toLocaleDateString()}
                          {bookmark.lastVisited && (
                            <span className="ml-4">
                              Last visited: {new Date(bookmark.lastVisited).toLocaleDateString()}
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

export default BookmarkManager;
