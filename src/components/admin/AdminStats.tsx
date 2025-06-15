
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Wrench, 
  FileText, 
  Globe,
  TrendingUp,
  Calendar,
  Activity,
  Shield
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  premiumUsers: number;
  totalTools: number;
  activeTools: number;
  totalPosts: number;
  publishedPosts: number;
  totalPages: number;
  totalCategories: number;
}

const AdminStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    premiumUsers: 0,
    totalTools: 0,
    activeTools: 0,
    totalPosts: 0,
    publishedPosts: 0,
    totalPages: 0,
    totalCategories: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch user stats
      const { data: profiles } = await supabase.from('profiles').select('id');
      const { data: subscribers } = await supabase.from('subscribers').select('subscription_tier').eq('subscription_tier', 'premium');
      
      // Fetch tool stats
      const { data: allTools } = await supabase.from('tools').select('id, is_active');
      const activeTools = allTools?.filter(tool => tool.is_active).length || 0;
      
      // Fetch blog stats
      const { data: allPosts } = await supabase.from('blog_posts').select('id, status');
      const publishedPosts = allPosts?.filter(post => post.status === 'published').length || 0;
      
      // Fetch page stats
      const { data: pages } = await supabase.from('pages').select('id');
      
      // Fetch category stats
      const { data: categories } = await supabase.from('categories').select('id');

      setStats({
        totalUsers: profiles?.length || 0,
        premiumUsers: subscribers?.length || 0,
        totalTools: allTools?.length || 0,
        activeTools,
        totalPosts: allPosts?.length || 0,
        publishedPosts,
        totalPages: pages?.length || 0,
        totalCategories: categories?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: {
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    color: string;
    subtitle?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold">{value.toLocaleString()}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
          subtitle={`${stats.premiumUsers} premium users`}
        />
        
        <StatCard
          title="Total Tools"
          value={stats.totalTools}
          icon={Wrench}
          color="bg-green-500"
          subtitle={`${stats.activeTools} active tools`}
        />
        
        <StatCard
          title="Blog Posts"
          value={stats.totalPosts}
          icon={FileText}
          color="bg-purple-500"
          subtitle={`${stats.publishedPosts} published`}
        />
        
        <StatCard
          title="Pages"
          value={stats.totalPages}
          icon={Globe}
          color="bg-orange-500"
          subtitle={`${stats.totalCategories} categories`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Free Users</span>
                <span className="font-semibold">{stats.totalUsers - stats.premiumUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Premium Users</span>
                <span className="font-semibold text-purple-600">{stats.premiumUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="font-semibold">
                  {stats.totalUsers > 0 ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Content Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Tools</span>
                <span className="font-semibold text-green-600">{stats.activeTools}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Published Posts</span>
                <span className="font-semibold text-blue-600">{stats.publishedPosts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Categories</span>
                <span className="font-semibold">{stats.totalCategories}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-semibold mb-2">Add New Tool</h4>
              <p className="text-sm text-gray-600">Create a new tool for the platform</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-semibold mb-2">Write Blog Post</h4>
              <p className="text-sm text-gray-600">Create new content for the blog</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-semibold mb-2">Manage Categories</h4>
              <p className="text-sm text-gray-600">Organize tools into categories</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
