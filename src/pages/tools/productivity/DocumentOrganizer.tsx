
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, ArrowLeft, Plus, Search, FileText, Image, Archive, Video } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'other';
  category: string;
  size: string;
  tags: string[];
  dateAdded: string;
  lastModified: string;
  url?: string;
}

const DocumentOrganizer = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Project Proposal Q1 2024.pdf',
      type: 'pdf',
      category: 'work',
      size: '2.1 MB',
      tags: ['proposal', 'quarterly', 'important'],
      dateAdded: '2024-01-10T10:00:00Z',
      lastModified: '2024-01-15T14:30:00Z'
    },
    {
      id: '2',
      name: 'Team Photo.jpg',
      type: 'image',
      category: 'personal',
      size: '5.3 MB',
      tags: ['team', 'photo', 'memories'],
      dateAdded: '2024-01-12T16:20:00Z',
      lastModified: '2024-01-12T16:20:00Z'
    }
  ]);

  const [newDocument, setNewDocument] = useState<{
    name: string;
    type: 'pdf' | 'doc' | 'image' | 'video' | 'other';
    category: string;
    tags: string;
  }>({
    name: '',
    type: 'pdf',
    category: 'work',
    tags: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const categories = ['all', 'work', 'personal', 'projects', 'archive'];
  const documentTypes = ['all', 'pdf', 'doc', 'image', 'video', 'other'];

  const addDocument = () => {
    if (!newDocument.name.trim()) return;

    const document: Document = {
      id: Date.now().toString(),
      name: newDocument.name,
      type: newDocument.type,
      category: newDocument.category,
      size: Math.random() > 0.5 ? `${(Math.random() * 10 + 0.1).toFixed(1)} MB` : `${(Math.random() * 999 + 1).toFixed(0)} KB`,
      tags: newDocument.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      dateAdded: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    setDocuments([document, ...documents]);
    setNewDocument({ name: '', type: 'pdf', category: 'work', tags: '' });
  };

  const deleteDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'doc':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-green-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-blue-500" />;
      default:
        return <Archive className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesType = selectedType === 'all' || doc.type === selectedType;
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
                <FolderOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Document Organizer</h1>
                  <p className="text-gray-600">Organize and categorize documents with smart tagging</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Add Document Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="h-5 w-5 mr-2" />
                      Add Document
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="doc-name">Document Name</Label>
                      <Input
                        id="doc-name"
                        value={newDocument.name}
                        onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                        placeholder="Document name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="doc-type">Type</Label>
                      <Select 
                        value={newDocument.type} 
                        onValueChange={(value: string) => setNewDocument({...newDocument, type: value as 'pdf' | 'doc' | 'image' | 'video' | 'other'})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="doc">Document</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="doc-category">Category</Label>
                      <Select value={newDocument.category} onValueChange={(value) => setNewDocument({...newDocument, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="projects">Projects</SelectItem>
                          <SelectItem value="archive">Archive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="doc-tags">Tags (comma separated)</Label>
                      <Input
                        id="doc-tags"
                        value={newDocument.tags}
                        onChange={(e) => setNewDocument({...newDocument, tags: e.target.value})}
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                    <Button onClick={addDocument} className="w-full" disabled={!newDocument.name.trim()}>
                      Add Document
                    </Button>
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Documents</span>
                        <span className="font-semibold">{documents.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Categories</span>
                        <span className="font-semibold">{new Set(documents.map(d => d.category)).size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">File Types</span>
                        <span className="font-semibold">{new Set(documents.map(d => d.type)).size}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Documents List */}
              <div className="lg:col-span-3 space-y-6">
                {/* Search and Filter */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search documents and tags..."
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
                          {documentTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Documents Grid */}
                {filteredDocuments.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {documents.length === 0 ? 'No documents yet. Add your first document!' : 'No documents match your search criteria.'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredDocuments.map((doc) => (
                      <Card key={doc.id} className="hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {getTypeIcon(doc.type)}
                              <div>
                                <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>{doc.size}</span>
                                  <Badge variant="outline">{doc.category}</Badge>
                                  <span>Added {new Date(doc.dateAdded).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex flex-wrap gap-1">
                                {doc.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {doc.tags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{doc.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteDocument(doc.id)}
                              >
                                Delete
                              </Button>
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

export default DocumentOrganizer;
