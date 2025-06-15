
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  url: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  target: string;
}

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const defaultMenuItem: Omit<MenuItem, 'id'> = {
    title: '',
    url: '',
    parent_id: null,
    sort_order: 0,
    is_active: true,
    target: '_self'
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch menu items",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (item: MenuItem | Omit<MenuItem, 'id'>) => {
    try {
      if ('id' in item) {
        const { error } = await supabase
          .from('menu_items')
          .update(item)
          .eq('id', item.id);

        if (error) throw error;
        toast({ title: "Success", description: "Menu item updated successfully" });
      } else {
        const { error } = await supabase
          .from('menu_items')
          .insert([item]);

        if (error) throw error;
        toast({ title: "Success", description: "Menu item created successfully" });
      }

      fetchMenuItems();
      setEditingItem(null);
      setIsCreating(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Menu item deleted successfully" });
      fetchMenuItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive"
      });
    }
  };

  const MenuItemForm = ({ item, onSave, onCancel }: {
    item: MenuItem | Omit<MenuItem, 'id'>;
    onSave: (item: MenuItem | Omit<MenuItem, 'id'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState(item);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{'id' in item ? 'Edit Menu Item' : 'Create New Menu Item'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="parent_id">Parent Menu Item</Label>
                <Select 
                  value={formData.parent_id || ''} 
                  onValueChange={(value) => setFormData({ ...formData, parent_id: value || null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Parent</SelectItem>
                    {menuItems.filter(mi => mi.id !== ('id' in item ? item.id : '')).map((mi) => (
                      <SelectItem key={mi.id} value={mi.id}>{mi.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <div>
                <Label htmlFor="target">Target</Label>
                <Select 
                  value={formData.target} 
                  onValueChange={(value) => setFormData({ ...formData, target: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_self">Same Window</SelectItem>
                    <SelectItem value="_blank">New Window</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
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
    return <div>Loading menu items...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {isCreating && (
        <MenuItemForm
          item={defaultMenuItem}
          onSave={handleSave}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {editingItem && (
        <MenuItemForm
          item={editingItem}
          onSave={handleSave}
          onCancel={() => setEditingItem(null)}
        />
      )}

      <div className="grid gap-4">
        {menuItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.url}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Order: {item.sort_order}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {item.target}
                    </span>
                    {item.is_active && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        Active
                      </span>
                    )}
                    {item.parent_id && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Child Item
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingItem(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
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

export default MenuManager;
