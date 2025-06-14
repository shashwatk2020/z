
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Trash2, 
  Crown, 
  Calendar,
  User,
  Settings,
  CreditCard
} from 'lucide-react';

interface SavedItem {
  id: string;
  tool_name: string;
  original_filename: string;
  processed_filename: string;
  file_url: string;
  file_size: number;
  processing_status: string;
  expires_at: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, loading, signOut, subscriptionTier, isSubscribed, checkSubscription } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchSavedItems();
    }
  }, [user]);

  const fetchSavedItems = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved items:', error);
        toast({
          title: "Error",
          description: "Failed to load saved items",
          variant: "destructive",
        });
      } else {
        setSavedItems(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingItems(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_items')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete item",
          variant: "destructive",
        });
      } else {
        setSavedItems(items => items.filter(item => item.id !== id));
        toast({
          title: "Success",
          description: "Item deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpgrade = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to start checkout process",
          variant: "destructive",
        });
        return;
      }
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process",
        variant: "destructive",
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to open customer portal",
          variant: "destructive",
        });
        return;
      }
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getExpiryStatus = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { status: 'expired', text: 'Expired', color: 'bg-red-500' };
    if (daysLeft <= 1) return { status: 'expiring', text: `${daysLeft} day left`, color: 'bg-orange-500' };
    if (daysLeft <= 7) return { status: 'warning', text: `${daysLeft} days left`, color: 'bg-yellow-500' };
    return { status: 'active', text: `${daysLeft} days left`, color: 'bg-green-500' };
  };

  if (loading || !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={isSubscribed ? "default" : "secondary"} className="text-sm">
                {isSubscribed ? (
                  <>
                    <Crown className="h-4 w-4 mr-1" />
                    Premium
                  </>
                ) : (
                  'Free Plan'
                )}
              </Badge>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="files" className="space-y-6">
          <TabsList>
            <TabsTrigger value="files">My Files</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Saved Files ({savedItems.length})
                </CardTitle>
                <CardDescription>
                  Files are saved for {isSubscribed ? '1 year' : '1 week'} based on your subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingItems ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading files...</p>
                  </div>
                ) : savedItems.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No saved files yet</p>
                    <p className="text-sm text-gray-500">Start using our tools to save your processed files</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedItems.map((item) => {
                      const expiry = getExpiryStatus(item.expires_at);
                      return (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{item.original_filename}</h3>
                              <Badge variant="outline" className="text-xs">
                                {item.tool_name}
                              </Badge>
                              <Badge className={`text-xs text-white ${expiry.color}`}>
                                {expiry.text}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {formatFileSize(item.file_size)} • Processed on {formatDate(item.created_at)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {item.file_url && (
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => deleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Subscription Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">
                        {isSubscribed ? 'Premium Plan' : 'Free Plan'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {isSubscribed 
                          ? 'Files saved for 1 year • Unlimited conversions • Priority support'
                          : 'Files saved for 1 week • Basic features'
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {isSubscribed ? '$9.99/month' : 'Free'}
                      </p>
                      {isSubscribed ? (
                        <Button onClick={handleManageSubscription} variant="outline" size="sm">
                          Manage Subscription
                        </Button>
                      ) : (
                        <Button onClick={handleUpgrade} size="sm">
                          Upgrade to Premium
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {!isSubscribed && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-medium text-blue-900 mb-2">Upgrade to Premium</h4>
                      <ul className="text-sm text-blue-800 space-y-1 mb-4">
                        <li>• Files saved for 1 full year</li>
                        <li>• Unlimited file conversions</li>
                        <li>• Priority customer support</li>
                        <li>• Access to premium tools</li>
                      </ul>
                      <Button onClick={handleUpgrade} className="w-full">
                        Upgrade for $9.99/month
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Member Since</label>
                    <p className="text-gray-900">{formatDate(user.created_at)}</p>
                  </div>
                  <Button variant="outline" className="mt-4">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
