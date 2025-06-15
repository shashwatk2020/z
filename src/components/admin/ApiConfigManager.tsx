
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X, Key } from 'lucide-react';

interface ApiConfig {
  id: string;
  service_name: string;
  api_key: string;
  api_secret: string;
  endpoint_url: string;
  config: any;
  is_active: boolean;
}

const ApiConfigManager = () => {
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState<ApiConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const defaultConfig: Omit<ApiConfig, 'id'> = {
    service_name: '',
    api_key: '',
    api_secret: '',
    endpoint_url: '',
    config: {},
    is_active: true
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('api_configs')
        .select('*')
        .order('service_name', { ascending: true });

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch API configurations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (config: ApiConfig | Omit<ApiConfig, 'id'>) => {
    try {
      if ('id' in config) {
        const { error } = await supabase
          .from('api_configs')
          .update(config)
          .eq('id', config.id);

        if (error) throw error;
        toast({ title: "Success", description: "API configuration updated successfully" });
      } else {
        const { error } = await supabase
          .from('api_configs')
          .insert([config]);

        if (error) throw error;
        toast({ title: "Success", description: "API configuration created successfully" });
      }

      fetchConfigs();
      setEditingConfig(null);
      setIsCreating(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API configuration",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API configuration?')) return;

    try {
      const { error } = await supabase
        .from('api_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "API configuration deleted successfully" });
      fetchConfigs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete API configuration",
        variant: "destructive"
      });
    }
  };

  const ConfigForm = ({ config, onSave, onCancel }: {
    config: ApiConfig | Omit<ApiConfig, 'id'>;
    onSave: (config: ApiConfig | Omit<ApiConfig, 'id'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState(config);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{'id' in config ? 'Edit API Configuration' : 'Create New API Configuration'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service_name">Service Name</Label>
                <Input
                  id="service_name"
                  value={formData.service_name}
                  onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                  placeholder="e.g., OpenAI, Stripe, etc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="endpoint_url">Endpoint URL</Label>
                <Input
                  id="endpoint_url"
                  value={formData.endpoint_url}
                  onChange={(e) => setFormData({ ...formData, endpoint_url: e.target.value })}
                  placeholder="https://api.example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="api_key">API Key</Label>
                <Input
                  id="api_key"
                  type="password"
                  value={formData.api_key}
                  onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                  placeholder="Enter API key"
                />
              </div>
              <div>
                <Label htmlFor="api_secret">API Secret (if needed)</Label>
                <Input
                  id="api_secret"
                  type="password"
                  value={formData.api_secret}
                  onChange={(e) => setFormData({ ...formData, api_secret: e.target.value })}
                  placeholder="Enter API secret"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="config">Additional Configuration (JSON)</Label>
              <Textarea
                id="config"
                value={typeof formData.config === 'string' ? formData.config : JSON.stringify(formData.config, null, 2)}
                onChange={(e) => {
                  try {
                    const config = JSON.parse(e.target.value);
                    setFormData({ ...formData, config });
                  } catch {
                    setFormData({ ...formData, config: e.target.value });
                  }
                }}
                rows={5}
                placeholder='{"key": "value"}'
              />
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
    return <div>Loading API configurations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">API Configuration Management</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add API Config
        </Button>
      </div>

      {isCreating && (
        <ConfigForm
          config={defaultConfig}
          onSave={handleSave}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {editingConfig && (
        <ConfigForm
          config={editingConfig}
          onSave={handleSave}
          onCancel={() => setEditingConfig(null)}
        />
      )}

      <div className="grid gap-4">
        {configs.map((config) => (
          <Card key={config.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="h-4 w-4" />
                    <h3 className="font-semibold text-lg">{config.service_name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{config.endpoint_url}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {config.api_key ? `Key: ${config.api_key.substring(0, 8)}...` : 'No API Key'}
                    </span>
                    {config.api_secret && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Has Secret
                      </span>
                    )}
                    {config.is_active && (
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
                    onClick={() => setEditingConfig(config)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(config.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {configs.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No API configurations found. Add one to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApiConfigManager;
