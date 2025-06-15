
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, Plus, Trash2, Search, FileText, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: number;
  name: string;
  description: string;
  category: string;
  tags: string[];
  dateAdded: Date;
  lastAccessed: Date;
  size: string;
  type: string;
  location: string;
  important: boolean;
}

const DocumentOrganizer = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [newDocument, setNewDocument] = useState({
    name: '',
    description: '',
    category: 'General',
    tags: '',
    size: '',
    type: 'PDF',
    location: ''
  });
  const { toast } = useToast();

  const documentTypes = ['PDF', 'Word', 'Excel', 'PowerPoint', 'Image', 'Text', 'Other'];

  useEffect(() => {
    const savedDocuments = localStorage.getItem('documentOrganizer');
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('documentOrganizer', JSON.stringify(documents));
  }, [documents]);

  const addDocument = () => {
    if (!newDocument.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a document name",
        variant: "destructive"
      });
      return;
    }

    const document: Document = {
      id: Date.now(),
      name: newDocument.name,
      description: newDocument.description,
      category: newDocument.category,
      tags: newDocument.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      dateAdded: new Date(),
      lastAccessed: new Date(),
      size: newDocument.size || 'Unknown',
      type: newDocument.type,
      location: newDocument.location,
      important: false
    };

    setDocuments([document, ...documents]);
    setNewDocument({
      name: '',
      description: '',
      category: 'General',
      tags: '',
      size: '',
      type: 'PDF',
      location: ''
    });

    toast({
      title: "Success",
      description: "Document added successfully"
    });
  };

  const deleteDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: "Success",
      description: "Document removed from organizer"
    });
  };

  const toggleImportant = (id: number) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, important: !doc.important } : doc
    ));
  };

  const updateLastAccessed = (id: number) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, lastAccessed: new Date() } : doc
    ));
  };

  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || 
        selectedCategory === 'important' ? doc.important : 
        doc.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'lastAccessed':
          return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
        case 'dateAdded':
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

  const categories = ['all', 'important', ...new Set(documents.map(doc => doc.category))];
  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'PDF': 'bg-red-100 text-red-800',
      'Word': 'bg-blue-100 text-blue-800',
      'Excel': 'bg-green-100 text-green-800',
      'PowerPoint': 'bg-orange-100 text-orange-800',
      'Image': 'bg-purple-100 text-purple-800',
      'Text': 'bg-gray-100 text-gray-800',
      'Other': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Document Organizer
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Organize and categorize your digital documents for easy retrieval and management.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
              <div className="text-sm text-gray-600">Total Documents</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {documents.filter(d => d.important).length}
              </div>
              <div className="text-sm text-gray-600">Important</div>
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
                {new Set(documents.map(d => d.type)).size}
              </div>
              <div className="text-sm text-gray-600">File Types</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Document */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Document
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Document Name</Label>
                  <Input
                    placeholder="My Important Document"
                    value={newDocument.name}
                    onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Brief description of the document"
                    value={newDocument.description}
                    onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Input
                      placeholder="Work, Personal..."
                      value={newDocument.category}
                      onChange={(e) => setNewDocument({ ...newDocument, category: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>Type</Label>
                    <Select value={newDocument.type} onValueChange={(value) => setNewDocument({ ...newDocument, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Size</Label>
                    <Input
                      placeholder="2.5 MB"
                      value={newDocument.size}
                      onChange={(e) => setNewDocument({ ...newDocument, size: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>Tags</Label>
                    <Input
                      placeholder="tag1, tag2"
                      value={newDocument.tags}
                      onChange={(e) => setNewDocument({ ...newDocument, tags: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Location/Path</Label>
                  <Input
                    placeholder="/Documents/Work/..."
                    value={newDocument.location}
                    onChange={(e) => setNewDocument({ ...newDocument, location: e.target.value })}
                  />
                </div>

                <Button onClick={addDocument} className="w-full">
                  Add Document
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Document Library
                </CardTitle>
                
                {/* Search and Filter */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search documents..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex gap-2 flex-wrap">
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          className="cursor-pointer capitalize"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category === 'all' ? 'All Documents' : 
                           category === 'important' ? 'Important' : category}
                        </Badge>
                      ))}
                    </div>
                    
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dateAdded">Date Added</SelectItem>
                        <SelectItem value="lastAccessed">Last Accessed</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="type">Type</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredDocuments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No documents found matching your search' : 'No documents organized yet'}
                    </div>
                  ) : (
                    filteredDocuments.map((document) => (
                      <div key={document.id} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <h4 className="font-medium cursor-pointer hover:text-blue-600"
                                onClick={() => updateLastAccessed(document.id)}>
                              {document.name}
                            </h4>
                            {document.important && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              onClick={() => toggleImportant(document.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <Star className={`h-4 w-4 ${document.important ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                            </Button>
                            <Button
                              onClick={() => deleteDocument(document.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        
                        {document.description && (
                          <p className="text-sm text-gray-600 mb-3">
                            {document.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge className={getTypeColor(document.type)}>
                            {document.type}
                          </Badge>
                          <Badge variant="outline">{document.category}</Badge>
                          {document.size && (
                            <Badge variant="outline">{document.size}</Badge>
                          )}
                          {document.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {document.location && (
                          <div className="text-xs text-gray-500 mb-2">
                            Location: {document.location}
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500">
                          Added: {new Date(document.dateAdded).toLocaleDateString()}
                          <span className="ml-4">
                            Last accessed: {new Date(document.lastAccessed).toLocaleDateString()}
                          </span>
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

export default DocumentOrganizer;
