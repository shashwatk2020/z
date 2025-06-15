
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X, Eye } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: any;
  excerpt: string;
  status: string;
  meta_title: string;
  meta_description: string;
  tags: string[];
  published_at: string;
  created_at: string;
}

const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const defaultPost: Omit<BlogPost, 'id' | 'created_at'> = {
    title: '',
    slug: '',
    content: { blocks: [] },
    excerpt: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    tags: [],
    published_at: ''
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (post: BlogPost | Omit<BlogPost, 'id' | 'created_at'>) => {
    try {
      if ('id' in post) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(post)
          .eq('id', post.id);

        if (error) throw error;
        toast({ title: "Success", description: "Blog post updated successfully" });
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert([post]);

        if (error) throw error;
        toast({ title: "Success", description: "Blog post created successfully" });
      }

      fetchPosts();
      setEditingPost(null);
      setIsCreating(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Blog post deleted successfully" });
      fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive"
      });
    }
  };

  const BlogPostForm = ({ post, onSave, onCancel }: {
    post: BlogPost | Omit<BlogPost, 'id' | 'created_at'>;
    onSave: (post: BlogPost | Omit<BlogPost, 'id' | 'created_at'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState(post);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{'id' in post ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
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
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="content">Content (Markdown)</Label>
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
                placeholder="Enter content as JSON or markdown"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="published_at">Published At</Label>
                <Input
                  id="published_at"
                  type="datetime-local"
                  value={formData.published_at}
                  onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                />
              </div>
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

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                placeholder="tag1, tag2, tag3"
              />
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
    return <div>Loading blog posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Post
        </Button>
      </div>

      {isCreating && (
        <BlogPostForm
          post={defaultPost}
          onSave={handleSave}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {editingPost && (
        <BlogPostForm
          post={editingPost}
          onSave={handleSave}
          onCancel={() => setEditingPost(null)}
        />
      )}

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className={`px-2 py-1 rounded ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' :
                      post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {post.slug}
                    </span>
                    {post.tags.map((tag, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPost(post)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
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

export default BlogManager;
