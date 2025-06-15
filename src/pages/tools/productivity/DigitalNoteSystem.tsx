
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Trash2, Search, Tag, Star, StarOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  category: string;
  favorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DigitalNoteSystem = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: '',
    category: 'General'
  });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedNotes = localStorage.getItem('digitalNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('digitalNotes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter both title and content",
        variant: "destructive"
      });
      return;
    }

    const note: Note = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      category: newNote.category,
      favorite: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setNotes([note, ...notes]);
    setNewNote({
      title: '',
      content: '',
      tags: '',
      category: 'General'
    });

    toast({
      title: "Success",
      description: "Note added successfully"
    });
  };

  const updateNote = () => {
    if (!editingNote || !editingNote.title.trim() || !editingNote.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter both title and content",
        variant: "destructive"
      });
      return;
    }

    setNotes(notes.map(note => 
      note.id === editingNote.id 
        ? { ...editingNote, updatedAt: new Date() }
        : note
    ));

    setEditingNote(null);
    toast({
      title: "Success",
      description: "Note updated successfully"
    });
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    setEditingNote(null);
    toast({
      title: "Success",
      description: "Note deleted successfully"
    });
  };

  const toggleFavorite = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, favorite: !note.favorite } : note
    ));
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || 
      selectedCategory === 'favorites' ? note.favorite : 
      note.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'favorites', ...new Set(notes.map(note => note.category))];
  const allTags = [...new Set(notes.flatMap(note => note.tags))];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Digital Note System
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create, organize, and search through your digital notes with tags and categories.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{notes.length}</div>
              <div className="text-sm text-gray-600">Total Notes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {notes.filter(n => n.favorite).length}
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
              <div className="text-2xl font-bold text-purple-600">{allTags.length}</div>
              <div className="text-sm text-gray-600">Tags</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add/Edit Note */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {editingNote ? 'Edit Note' : 'Add New Note'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    placeholder="Note title"
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
                
                <div>
                  <Label>Content</Label>
                  <Textarea
                    placeholder="Write your note here..."
                    value={editingNote ? editingNote.content : newNote.content}
                    onChange={(e) => {
                      if (editingNote) {
                        setEditingNote({ ...editingNote, content: e.target.value });
                      } else {
                        setNewNote({ ...newNote, content: e.target.value });
                      }
                    }}
                    className="min-h-32"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Input
                      placeholder="Category"
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
                      placeholder="tag1, tag2"
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

                <div className="flex gap-2">
                  {editingNote ? (
                    <>
                      <Button onClick={updateNote} className="flex-1">
                        Update Note
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
                    <Button onClick={addNote} className="w-full">
                      Add Note
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            {allTags.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {allTags.slice(0, 10).map((tag) => (
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

          {/* Notes List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Your Notes
                </CardTitle>
                
                {/* Search and Filter */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search notes..."
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
                        {category === 'all' ? 'All Notes' : 
                         category === 'favorites' ? 'Favorites' : category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredNotes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No notes found matching your search' : 'No notes yet'}
                    </div>
                  ) : (
                    filteredNotes.map((note) => (
                      <div key={note.id} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium cursor-pointer hover:text-blue-600"
                              onClick={() => setEditingNote(note)}>
                            {note.title}
                          </h4>
                          <div className="flex items-center gap-1">
                            <Button
                              onClick={() => toggleFavorite(note.id)}
                              variant="ghost"
                              size="sm"
                            >
                              {note.favorite ? (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              ) : (
                                <StarOff className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                            <Button
                              onClick={() => deleteNote(note.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                          {note.content}
                        </p>
                        
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
                            <span className="ml-2">
                              • Updated: {new Date(note.updatedAt).toLocaleDateString()}
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

export default DigitalNoteSystem;
