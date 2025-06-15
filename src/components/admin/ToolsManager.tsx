
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  path: string;
  is_active: boolean;
  requires_auth: boolean;
  api_dependent: boolean;
  sort_order: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const ToolsManager = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const defaultTool: Omit<Tool, 'id'> = {
    name: '',
    slug: '',
    description: '',
    category: '',
    icon: '',
    path: '',
    is_active: true,
    requires_auth: false,
    api_dependent: false,
    sort_order: 0
  };

  useEffect(() => {
    fetchTools();
    fetchCategories();
  }, []);

  const fetchTools = async () => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTools(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tools",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSave = async (tool: Tool | Omit<Tool, 'id'>) => {
    try {
      if ('id' in tool) {
        // Update existing tool
        const { error } = await supabase
          .from('tools')
          .update(tool)
          .eq('id', tool.id);

        if (error) throw error;
        toast({ title: "Success", description: "Tool updated successfully" });
      } else {
        // Create new tool
        const { error } = await supabase
          .from('tools')
          .insert([tool]);

        if (error) throw error;
        toast({ title: "Success", description: "Tool created successfully" });
      }

      fetchTools();
      setEditingTool(null);
      setIsCreating(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save tool",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;

    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Tool deleted successfully" });
      fetchTools();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tool",
        variant: "destructive"
      });
    }
  };

  const ToolForm = ({ tool, onSave, onCancel }: {
    tool: Tool | Omit<Tool, 'id'>;
    onSave: (tool: Tool | Omit<Tool, 'id'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState(tool);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{'id' in tool ? 'Edit Tool' : 'Create New Tool'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Icon name (e.g., Calculator)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="path">Path</Label>
                <Input
                  id="path"
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  placeholder="/tools/category/tool-name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="requires_auth"
                  checked={formData.requires_auth}
                  onCheckedChange={(checked) => setFormData({ ...formData, requires_auth: checked })}
                />
                <Label htmlFor="requires_auth">Requires Auth</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="api_dependent"
                  checked={formData.api_dependent}
                  onCheckedChange={(checked) => setFormData({ ...formData, api_dependent: checked })}
                />
                <Label htmlFor="api_dependent">API Dependent</Label>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return <div>Loading tools...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tools Management</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Tool
        </Button>
      </div>

      {isCreating && (
        <ToolForm
          tool={defaultTool}
          onSave={handleSave}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {editingTool && (
        <ToolForm
          tool={editingTool}
          onSave={handleSave}
          onCancel={() => setEditingTool(null)}
        />
      )}

      <div className="grid gap-4">
        {tools.map((tool) => (
          <Card key={tool.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{tool.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{tool.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {tool.category}
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {tool.path}
                    </span>
                    {tool.is_active && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        Active
                      </span>
                    )}
                    {tool.requires_auth && (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        Auth Required
                      </span>
                    )}
                    {tool.api_dependent && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        API Dependent
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTool(tool)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(tool.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ToolsManager;
