
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Monitor, Plus, Trash2, Settings, Folder, Link, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkspaceItem {
  id: number;
  name: string;
  type: 'folder' | 'link' | 'note' | 'tool';
  content: string;
  category: string;
  favorite: boolean;
  position: { x: number; y: number };
  size: 'small' | 'medium' | 'large';
  color: string;
  createdAt: Date;
}

interface Workspace {
  id: number;
  name: string;
  description: string;
  items: WorkspaceItem[];
  background: string;
  layout: 'grid' | 'freeform';
}

const DigitalWorkspace = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<number | null>(null);
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    description: '',
    background: 'bg-gray-50',
    layout: 'grid' as const
  });
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'link' as const,
    content: '',
    category: 'General',
    size: 'medium' as const,
    color: 'bg-blue-100'
  });
  const { toast } = useToast();

  const itemTypes = [
    { value: 'folder', label: 'Folder', icon: Folder },
    { value: 'link', label: 'Link', icon: Link },
    { value: 'note', label: 'Note', icon: Settings },
    { value: 'tool', label: 'Tool', icon: Settings }
  ];

  const colors = [
    'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-red-100',
    'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-gray-100'
  ];

  const backgrounds = [
    { value: 'bg-gray-50', label: 'Light Gray' },
    { value: 'bg-blue-50', label: 'Light Blue' },
    { value: 'bg-green-50', label: 'Light Green' },
    { value: 'bg-gradient-to-br from-blue-100 to-purple-100', label: 'Blue Purple' }
  ];

  useEffect(() => {
    const savedWorkspaces = localStorage.getItem('digitalWorkspaces');
    if (savedWorkspaces) {
      const parsed = JSON.parse(savedWorkspaces);
      setWorkspaces(parsed);
      if (parsed.length > 0) {
        setActiveWorkspace(parsed[0].id);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('digitalWorkspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  const createWorkspace = () => {
    if (!newWorkspace.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workspace name",
        variant: "destructive"
      });
      return;
    }

    const workspace: Workspace = {
      id: Date.now(),
      name: newWorkspace.name,
      description: newWorkspace.description,
      items: [],
      background: newWorkspace.background,
      layout: newWorkspace.layout
    };

    setWorkspaces([workspace, ...workspaces]);
    setActiveWorkspace(workspace.id);
    setNewWorkspace({
      name: '',
      description: '',
      background: 'bg-gray-50',
      layout: 'grid'
    });

    toast({
      title: "Success",
      description: "Workspace created successfully"
    });
  };

  const deleteWorkspace = (id: number) => {
    setWorkspaces(workspaces.filter(ws => ws.id !== id));
    if (activeWorkspace === id) {
      setActiveWorkspace(workspaces.length > 1 ? workspaces[0].id : null);
    }
    toast({
      title: "Success",
      description: "Workspace deleted"
    });
  };

  const addItemToWorkspace = () => {
    if (!activeWorkspace || !newItem.name.trim()) {
      toast({
        title: "Error",
        description: "Please select a workspace and enter item name",
        variant: "destructive"
      });
      return;
    }

    const item: WorkspaceItem = {
      id: Date.now(),
      name: newItem.name,
      type: newItem.type,
      content: newItem.content,
      category: newItem.category,
      favorite: false,
      position: { x: Math.random() * 300, y: Math.random() * 200 },
      size: newItem.size,
      color: newItem.color,
      createdAt: new Date()
    };

    setWorkspaces(workspaces.map(ws => 
      ws.id === activeWorkspace 
        ? { ...ws, items: [...ws.items, item] }
        : ws
    ));

    setNewItem({
      name: '',
      type: 'link',
      content: '',
      category: 'General',
      size: 'medium',
      color: 'bg-blue-100'
    });

    toast({
      title: "Success",
      description: "Item added to workspace"
    });
  };

  const deleteItem = (itemId: number) => {
    if (!activeWorkspace) return;

    setWorkspaces(workspaces.map(ws => 
      ws.id === activeWorkspace 
        ? { ...ws, items: ws.items.filter(item => item.id !== itemId) }
        : ws
    ));

    toast({
      title: "Success",
      description: "Item removed from workspace"
    });
  };

  const toggleFavorite = (itemId: number) => {
    if (!activeWorkspace) return;

    setWorkspaces(workspaces.map(ws => 
      ws.id === activeWorkspace 
        ? { ...ws, items: ws.items.map(item => 
            item.id === itemId ? { ...item, favorite: !item.favorite } : item
          )}
        : ws
    ));
  };

  const handleItemClick = (item: WorkspaceItem) => {
    if (item.type === 'link' && item.content) {
      const url = item.content.startsWith('http') ? item.content : `https://${item.content}`;
      window.open(url, '_blank');
    }
  };

  const getCurrentWorkspace = () => {
    return workspaces.find(ws => ws.id === activeWorkspace);
  };

  const currentWorkspace = getCurrentWorkspace();
  const getSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'w-20 h-20';
      case 'large': return 'w-40 h-32';
      default: return 'w-32 h-24';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Digital Workspace
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create and manage digital workspaces with organized access to your tools, links, and resources.
          </p>
        </div>

        {/* Workspace Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {workspaces.map((workspace) => (
            <Button
              key={workspace.id}
              variant={activeWorkspace === workspace.id ? "default" : "outline"}
              onClick={() => setActiveWorkspace(workspace.id)}
              className="whitespace-nowrap"
            >
              {workspace.name}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Create Workspace */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create Workspace
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    placeholder="My Workspace"
                    value={newWorkspace.name}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Workspace description"
                    value={newWorkspace.description}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Background</Label>
                  <select
                    value={newWorkspace.background}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, background: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    {backgrounds.map((bg) => (
                      <option key={bg.value} value={bg.value}>
                        {bg.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button onClick={createWorkspace} className="w-full">
                  Create Workspace
                </Button>
              </CardContent>
            </Card>

            {/* Add Item */}
            {currentWorkspace && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Item</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      placeholder="Item name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>Type</Label>
                    <select
                      value={newItem.type}
                      onChange={(e) => setNewItem({ ...newItem, type: e.target.value as any })}
                      className="w-full p-2 border rounded-md"
                    >
                      {itemTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label>Content (URL/Path/Note)</Label>
                    <Input
                      placeholder="https://example.com"
                      value={newItem.content}
                      onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Size</Label>
                      <select
                        value={newItem.size}
                        onChange={(e) => setNewItem({ ...newItem, size: e.target.value as any })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label>Color</Label>
                      <select
                        value={newItem.color}
                        onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      >
                        {colors.map((color) => (
                          <option key={color} value={color}>
                            {color.replace('bg-', '').replace('-100', '')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button onClick={addItemToWorkspace} className="w-full">
                    Add Item
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Workspace List */}
            <Card>
              <CardHeader>
                <CardTitle>Workspaces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {workspaces.map((workspace) => (
                    <div key={workspace.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{workspace.name}</div>
                        <div className="text-xs text-gray-500">{workspace.items.length} items</div>
                      </div>
                      <Button
                        onClick={() => deleteWorkspace(workspace.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workspace Canvas */}
          <div className="lg:col-span-3">
            {currentWorkspace ? (
              <Card className="min-h-96">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    {currentWorkspace.name}
                  </CardTitle>
                  {currentWorkspace.description && (
                    <CardDescription>{currentWorkspace.description}</CardDescription>
                  )}
                </CardHeader>
                
                <CardContent>
                  <div className={`${currentWorkspace.background} rounded-lg p-6 min-h-80 relative`}>
                    {currentWorkspace.items.length === 0 ? (
                      <div className="text-center py-16 text-gray-500">
                        <Monitor className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <div>Your workspace is empty</div>
                        <div className="text-sm">Add items using the panel on the left</div>
                      </div>
                    ) : (
                      <div className={currentWorkspace.layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'relative'}>
                        {currentWorkspace.items.map((item) => {
                          const IconComponent = itemTypes.find(t => t.value === item.type)?.icon || Settings;
                          
                          return (
                            <div
                              key={item.id}
                              className={`${item.color} ${getSizeClass(item.size)} border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow relative group`}
                              onClick={() => handleItemClick(item)}
                              style={currentWorkspace.layout === 'freeform' ? {
                                position: 'absolute',
                                left: item.position.x,
                                top: item.position.y
                              } : {}}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <IconComponent className="h-4 w-4" />
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleFavorite(item.id);
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                  >
                                    <Star className={`h-3 w-3 ${item.favorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                                  </Button>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteItem(item.id);
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                  >
                                    <Trash2 className="h-3 w-3 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="text-sm font-medium truncate">{item.name}</div>
                              
                              {item.content && (
                                <div className="text-xs text-gray-600 truncate mt-1">
                                  {item.type === 'link' ? new URL(item.content.startsWith('http') ? item.content : `https://${item.content}`).hostname : item.content}
                                </div>
                              )}
                              
                              <Badge variant="outline" className="text-xs mt-2">
                                {item.category}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="min-h-96">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center text-gray-500">
                    <Monitor className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <div className="text-lg font-medium">No workspace selected</div>
                    <div className="text-sm">Create a workspace to get started</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DigitalWorkspace;
