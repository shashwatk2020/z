
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Archive, Plus, Trash2, Search, Download, Upload, FolderOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArchivedItem {
  id: number;
  name: string;
  description: string;
  category: string;
  tags: string[];
  originalLocation: string;
  archiveLocation: string;
  dateArchived: Date;
  size: string;
  type: string;
  reason: string;
  status: 'archived' | 'restored' | 'deleted';
}

const ArchiveSystem = () => {
  const [archivedItems, setArchivedItems] = useState<ArchivedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: 'Documents',
    tags: '',
    originalLocation: '',
    archiveLocation: '',
    size: '',
    type: 'File',
    reason: ''
  });
  const { toast } = useToast();

  const itemTypes = ['File', 'Folder', 'Project', 'Document', 'Media', 'Database', 'Code', 'Other'];
  const archiveReasons = [
    'Project Completed',
    'No Longer Needed',
    'Storage Cleanup',
    'Version Superseded',
    'Legal Requirement',
    'Backup Purpose',
    'Migration',
    'Other'
  ];

  useEffect(() => {
    const savedItems = localStorage.getItem('archiveSystem');
    if (savedItems) {
      setArchivedItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('archiveSystem', JSON.stringify(archivedItems));
  }, [archivedItems]);

  const addToArchive = () => {
    if (!newItem.name.trim() || !newItem.originalLocation.trim()) {
      toast({
        title: "Error",
        description: "Please enter item name and original location",
        variant: "destructive"
      });
      return;
    }

    const item: ArchivedItem = {
      id: Date.now(),
      name: newItem.name,
      description: newItem.description,
      category: newItem.category,
      tags: newItem.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      originalLocation: newItem.originalLocation,
      archiveLocation: newItem.archiveLocation || `/archive/${new Date().getFullYear()}/${newItem.category}/${newItem.name}`,
      dateArchived: new Date(),
      size: newItem.size,
      type: newItem.type,
      reason: newItem.reason,
      status: 'archived'
    };

    setArchivedItems([item, ...archivedItems]);
    setNewItem({
      name: '',
      description: '',
      category: 'Documents',
      tags: '',
      originalLocation: '',
      archiveLocation: '',
      size: '',
      type: 'File',
      reason: ''
    });

    toast({
      title: "Success",
      description: "Item added to archive"
    });
  };

  const updateItemStatus = (id: number, status: ArchivedItem['status']) => {
    setArchivedItems(archivedItems.map(item =>
      item.id === id ? { ...item, status } : item
    ));

    const statusMessages = {
      restored: "Item marked as restored",
      deleted: "Item marked as deleted",
      archived: "Item marked as archived"
    };

    toast({
      title: "Success",
      description: statusMessages[status]
    });
  };

  const deleteItem = (id: number) => {
    setArchivedItems(archivedItems.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Item removed from archive system"
    });
  };

  const exportArchiveList = () => {
    const csv = [
      ['Name', 'Category', 'Original Location', 'Archive Location', 'Date Archived', 'Status', 'Reason', 'Size', 'Type'],
      ...archivedItems.map(item => [
        item.name,
        item.category,
        item.originalLocation,
        item.archiveLocation,
        item.dateArchived.toString(),
        item.status,
        item.reason,
        item.size,
        item.type
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archive-list-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Archive list exported"
    });
  };

  const filteredItems = archivedItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.originalLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['all', ...new Set(archivedItems.map(item => item.category))];
  const statuses = ['all', 'archived', 'restored', 'deleted'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'archived': return 'bg-blue-100 text-blue-800';
      case 'restored': return 'bg-green-100 text-green-800';
      case 'deleted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'File': 'bg-blue-100 text-blue-800',
      'Folder': 'bg-yellow-100 text-yellow-800',
      'Project': 'bg-purple-100 text-purple-800',
      'Document': 'bg-green-100 text-green-800',
      'Media': 'bg-pink-100 text-pink-800',
      'Database': 'bg-indigo-100 text-indigo-800',
      'Code': 'bg-gray-100 text-gray-800',
      'Other': 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const stats = {
    total: archivedItems.length,
    archived: archivedItems.filter(i => i.status === 'archived').length,
    restored: archivedItems.filter(i => i.status === 'restored').length,
    deleted: archivedItems.filter(i => i.status === 'deleted').length
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Archive System
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Archive and organize old files and projects with detailed tracking and easy retrieval.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.archived}</div>
              <div className="text-sm text-gray-600">Archived</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.restored}</div>
              <div className="text-sm text-gray-600">Restored</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.deleted}</div>
              <div className="text-sm text-gray-600">Deleted</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add to Archive */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add to Archive
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Item Name *</Label>
                  <Input
                    placeholder="Project ABC Files"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Brief description of archived item"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Documents">Documents</option>
                      <option value="Projects">Projects</option>
                      <option value="Media">Media</option>
                      <option value="Code">Code</option>
                      <option value="Databases">Databases</option>
                      <option value="Personal">Personal</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label>Type</Label>
                    <select
                      value={newItem.type}
                      onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      {itemTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Original Location *</Label>
                  <Input
                    placeholder="/projects/website-v1/"
                    value={newItem.originalLocation}
                    onChange={(e) => setNewItem({ ...newItem, originalLocation: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Archive Location</Label>
                  <Input
                    placeholder="Auto-generated if empty"
                    value={newItem.archiveLocation}
                    onChange={(e) => setNewItem({ ...newItem, archiveLocation: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Size</Label>
                    <Input
                      placeholder="2.5 GB"
                      value={newItem.size}
                      onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>Reason</Label>
                    <select
                      value={newItem.reason}
                      onChange={(e) => setNewItem({ ...newItem, reason: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select reason</option>
                      {archiveReasons.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Tags</Label>
                  <Input
                    placeholder="project, completed, v1"
                    value={newItem.tags}
                    onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                  />
                </div>

                <Button onClick={addToArchive} className="w-full">
                  Add to Archive
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Archive List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Archive className="h-5 w-5" />
                    Archive Inventory
                  </CardTitle>
                  <Button
                    onClick={exportArchiveList}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                
                {/* Search and Filter */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search archived items..."
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
                          {category === 'all' ? 'All Categories' : category}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      {statuses.map((status) => (
                        <Badge
                          key={status}
                          variant={selectedStatus === status ? "default" : "outline"}
                          className="cursor-pointer capitalize"
                          onClick={() => setSelectedStatus(status)}
                        >
                          {status === 'all' ? 'All Status' : status}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No archived items found matching your search' : 'No items in archive yet'}
                    </div>
                  ) : (
                    filteredItems.map((item) => (
                      <div key={item.id} className="p-4 border rounded-lg bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            )}
                          </div>
                          <Button
                            onClick={() => deleteItem(item.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="text-sm">
                            <span className="font-medium">Original:</span> {item.originalLocation}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Archive:</span> {item.archiveLocation}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge variant="outline">{item.category}</Badge>
                          <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          {item.size && (
                            <Badge variant="outline">{item.size}</Badge>
                          )}
                          {item.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {item.reason && (
                          <div className="text-sm text-gray-600 mb-3">
                            <span className="font-medium">Reason:</span> {item.reason}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Archived: {new Date(item.dateArchived).toLocaleDateString()}
                          </div>
                          
                          <div className="flex gap-2">
                            {item.status === 'archived' && (
                              <>
                                <Button
                                  onClick={() => updateItemStatus(item.id, 'restored')}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Upload className="h-3 w-3 mr-1" />
                                  Restore
                                </Button>
                                <Button
                                  onClick={() => updateItemStatus(item.id, 'deleted')}
                                  variant="outline"
                                  size="sm"
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                            {item.status !== 'archived' && (
                              <Button
                                onClick={() => updateItemStatus(item.id, 'archived')}
                                variant="outline"
                                size="sm"
                              >
                                <Archive className="h-3 w-3 mr-1" />
                                Re-archive
                              </Button>
                            )}
                          </div>
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

export default ArchiveSystem;
