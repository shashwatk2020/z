
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  LogOut, 
  Settings, 
  Users, 
  FileText, 
  Menu,
  Database,
  Globe,
  BarChart3,
  Wrench
} from 'lucide-react';
import ToolsManager from '@/components/admin/ToolsManager';
import CategoriesManager from '@/components/admin/CategoriesManager';
import BlogManager from '@/components/admin/BlogManager';
import MenuManager from '@/components/admin/MenuManager';
import PagesManager from '@/components/admin/PagesManager';
import UsersManager from '@/components/admin/UsersManager';
import ApiConfigManager from '@/components/admin/ApiConfigManager';
import AdminStats from '@/components/admin/AdminStats';

const AdminPanel = () => {
  const { adminUser, logout, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  if (!isAuthenticated || !adminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">ZipConvert Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {adminUser.username}</span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="tools">
              <Wrench className="h-4 w-4 mr-2" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Database className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="blog">
              <FileText className="h-4 w-4 mr-2" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="menu">
              <Menu className="h-4 w-4 mr-2" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="pages">
              <Globe className="h-4 w-4 mr-2" />
              Pages
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="api">
              <Settings className="h-4 w-4 mr-2" />
              API Config
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminStats />
          </TabsContent>

          <TabsContent value="tools">
            <ToolsManager />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesManager />
          </TabsContent>

          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>

          <TabsContent value="menu">
            <MenuManager />
          </TabsContent>

          <TabsContent value="pages">
            <PagesManager />
          </TabsContent>

          <TabsContent value="users">
            <UsersManager />
          </TabsContent>

          <TabsContent value="api">
            <ApiConfigManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
