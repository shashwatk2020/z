
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
import { Archive, ArrowLeft, Plus, Search, Download, Trash2, FolderOpen, FileText } from 'lucide-react';

interface ArchiveItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'document' | 'project';
  size: string;
  dateArchived: string;
  originalPath: string;
  tags: string[];
  description: string;
  status: 'active' | 'compressed' | 'encrypted';
}

const ArchiveSystem = () => {
  const [archives, setArchives] = useState<ArchiveItem[]>([
    {
      id: '1',
      name: 'Project Alpha Documents',
      type: 'folder',
      size: '2.4 GB',
      dateArchived: '2024-01-15',
      originalPath: '/projects/alpha/docs',
      tags: ['project', 'documents', 'alpha'],
      description: 'Complete documentation for Project Alpha including specs and designs',
      status: 'compressed'
    },
    {
      id: '2',
      name: 'Old Meeting Recordings',
      type: 'file',
      size: '1.8 GB',
      dateArchived: '2024-01-10',
      originalPath: '/meetings/2023',
      tags: ['meetings', '2023', 'recordings'],
      description: 'All meeting recordings from 2023',
      status: 'active'
    }
  ]);

  const [newArchive, setNewArchive] = useState({
    name: '',
    type: 'file' as const,
    originalPath: '',
    tags: '',
    description: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const addArchive = () => {
    if (!newArchive.name.trim()) return;

    const archive: ArchiveItem = {
      id: Date.now().toString(),
      name: newArchive.name,
      type: newArchive.type,
      size: '0 KB',
      dateArchived: new Date().toISOString().split('T')[0],
      originalPath: newArchive.originalPath,
      tags: newArchive.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      description: newArchive.description,
      status: 'active'
    };

    setArchives([archive, ...archives]);
    setNewArchive({ name: '', type: 'file', originalPath: '', tags: '', description: '' });
  };

  const deleteArchive = (archiveId: string) => {
    setArchives(archives.filter(archive => archive.id !== archiveId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'compressed': return 'bg-blue-100 text-blue-800';
      case 'encrypted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'folder': return <FolderOpen className="h-5 w-5" />;
      case 'document': return <FileText className="h-5 w-5" />;
      default: return <Archive className="h-5 w-5" />;
    }
  };

  const filteredArchives = archives.filter(archive => {
    const matchesSearch = archive.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         archive.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || archive.type === selectedType;
    return matchesSearch && matchesType;
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
                <Archive className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Archive System</h1>
                  <p className="text-gray-600">Organize and manage your archived files and projects</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Add Archive Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="h-5 w-5 mr-2" />
                      Add Archive
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Archive Name *</Label>
                      <Input
                        id="name"
                        value={newArchive.name}
                        onChange={(e) => setNewArchive({...newArchive, name: e.target.value})}
                        placeholder="Archive name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={newArchive.type} onValueChange={(value: any) => setNewArchive({...newArchive, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="file">File</SelectItem>
                          <SelectItem value="folder">Folder</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="originalPath">Original Path</Label>
                      <Input
                        id="originalPath"
                        value={newArchive.originalPath}
                        onChange={(e) => setNewArchive({...newArchive, originalPath: e.target.value})}
                        placeholder="/path/to/original"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={newArchive.tags}
                        onChange={(e) => setNewArchive({...newArchive, tags: e.target.value})}
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newArchive.description}
                        onChange={(e) => setNewArchive({...newArchive, description: e.target.value})}
                        placeholder="Archive description"
                        rows={3}
                      />
                    </div>
                    <Button 
                      onClick={addArchive} 
                      className="w-full" 
                      disabled={!newArchive.name.trim()}
                    >
                      Add Archive
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Archives List */}
              <div className="lg:col-span-3 space-y-6">
                {/* Search and Filter */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search archives..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="file">File</SelectItem>
                          <SelectItem value="folder">Folder</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Archives Grid */}
                {filteredArchives.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {archives.length === 0 ? 'No archives yet. Add your first archive!' : 'No archives match your search criteria.'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredArchives.map((archive) => (
                      <Card key={archive.id} className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="flex-shrink-0 text-blue-600">
                                {getTypeIcon(archive.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{archive.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{archive.originalPath}</p>
                                  </div>
                                  <div className="flex items-center space-x-2 ml-4">
                                    <Button variant="outline" size="sm">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => deleteArchive(archive.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {archive.description && (
                                  <p className="text-gray-600 text-sm mt-2">{archive.description}</p>
                                )}

                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline">{archive.type}</Badge>
                                    <Badge className={getStatusColor(archive.status)}>
                                      {archive.status}
                                    </Badge>
                                    {archive.tags.slice(0, 2).map((tag, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {archive.tags.length > 2 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{archive.tags.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-right text-sm text-gray-500">
                                    <div>{archive.size}</div>
                                    <div>{new Date(archive.dateArchived).toLocaleDateString()}</div>
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

export default ArchiveSystem;
