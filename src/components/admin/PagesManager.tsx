
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

interface Page {
  id: string;
  title: string;
  slug: string;
  content: any;
  meta_title: string;
  meta_description: string;
  is_active: boolean;
}

const PagesManager = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const defaultPage: Omit<Page, 'id'> = {
    title: '',
    slug: '',
    content: { blocks: [] },
    meta_title: '',
    meta_description: '',
    is_active: true
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (page: Page | Omit<Page, 'id'>) => {
    try {
      if ('id' in page) {
        const { error } = await supabase
          .from('pages')
          .update(page)
          .eq('id', page.id);

        if (error) throw error;
        toast({ title: "Success", description: "Page updated successfully" });
      } else {
        const { error } = await supabase
          .from('pages')
          .insert([page]);

        if (error) throw error;
        toast({ title: "Success", description: "Page created successfully" });
      }

      fetchPages();
      setEditingPage(null);
      setIsCreating(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save page",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Page deleted successfully" });
      fetchPages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive"
      });
    }
  };

  const PageForm = ({ page, onSave, onCancel }: {
    page: Page | Omit<Page, 'id'>;
    onSave: (page: Page | Omit<Page, 'id'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState(page);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{'id' in page ? 'Edit Page' : 'Create New Page'}</CardTitle>
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
              <Label htmlFor="content">Content (JSON/HTML)</Label>
              <Textarea
                id="content"
                value={typeof formData.content === 'string' ? formData.content : JSON.stringify(formData.content, null, 2)}
                onChange={(e) => {
                  try {
                    const content = JSON.parse(e.target.value);
                    setFormData({ ...formData, content });
                  } catch {
                    setFormData({ ...formData, content: e.target.value });
                  }
                }}
                rows={10}
                placeholder="Enter content as JSON or HTML"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Input
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
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
    return <div>Loading pages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pages Management</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Page
        </Button>
      </div>

      {isCreating && (
        <PageForm
          page={defaultPage}
          onSave={handleSave}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {editingPage && (
        <PageForm
          page={editingPage}
          onSave={handleSave}
          onCancel={() => setEditingPage(null)}
        />
      )}

      <div className="grid gap-4">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{page.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">/{page.slug}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {page.slug}
                    </span>
                    {page.is_active && (
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
                    onClick={() => setEditingPage(page)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(page.id)}
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

export default PagesManager;
