
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

const CategoriesManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const defaultCategory: Omit<Category, 'id'> = {
    name: '',
    slug: '',
    description: '',
    icon: '',
    is_active: true,
    sort_order: 0
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (category: Category | Omit<Category, 'id'>) => {
    try {
      if ('id' in category) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update(category)
          .eq('id', category.id);

        if (error) throw error;
        toast({ title: "Success", description: "Category updated successfully" });
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert([category]);

        if (error) throw error;
        toast({ title: "Success", description: "Category created successfully" });
      }

      fetchCategories();
      setEditingCategory(null);
      setIsCreating(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Category deleted successfully" });
      fetchCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      });
    }
  };

  const CategoryForm = ({ category, onSave, onCancel }: {
    category: Category | Omit<Category, 'id'>;
    onSave: (category: Category | Omit<Category, 'id'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState(category);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{'id' in category ? 'Edit Category' : 'Create New Category'}</CardTitle>
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
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Icon name (e.g., Calculator)"
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
    return <div>Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categories Management</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Category
        </Button>
      </div>

      {isCreating && (
        <CategoryForm
          category={defaultCategory}
          onSave={handleSave}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {editingCategory && (
        <CategoryForm
          category={editingCategory}
          onSave={handleSave}
          onCancel={() => setEditingCategory(null)}
        />
      )}

      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {category.slug}
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {category.icon}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Order: {category.sort_order}
                    </span>
                    {category.is_active && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        Active
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingCategory(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
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

export default CategoriesManager;
