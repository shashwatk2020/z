
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Download, FileText, Crown, Settings, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, signOut, subscriptionTier, isSubscribed, checkSubscription } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const fetchSavedItems = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedItems(data || []);
    } catch (error) {
      console.error('Error fetching saved items:', error);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: selectedPlan }
      });

      if (error) throw error;
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;
      
      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open customer portal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pricingPlans = [
    {
      name: 'Monthly',
      price: '$4.99',
      period: 'month',
      value: 'monthly'
    },
    {
      name: 'Yearly',
      price: '$29.99',
      period: 'year',
      savings: 'Save $30',
      value: 'yearly'
    }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.user_metadata?.first_name || user?.email}</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>

        {/* Subscription Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <CardTitle>Subscription Status</CardTitle>
              </div>
              <Badge variant={isSubscribed ? "default" : "secondary"}>
                {subscriptionTier || 'Free'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isSubscribed ? (
              <div className="space-y-4">
                <p className="text-green-600">✅ You have an active premium subscription!</p>
                <p className="text-sm text-gray-600">
                  Your files are saved for 1 year with premium storage.
                </p>
                <Button onClick={handleManageSubscription} disabled={loading} variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Subscription
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-2">You're currently on the free plan.</p>
                  <p className="text-sm text-gray-500">Files are saved for 1 week. Upgrade for 1-year storage!</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Choose Your Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pricingPlans.map((plan) => (
                      <div
                        key={plan.value}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPlan === plan.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPlan(plan.value as 'monthly' | 'yearly')}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{plan.name}</h4>
                          {plan.savings && (
                            <Badge variant="secondary" className="text-green-600">
                              {plan.savings}
                            </Badge>
                          )}
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {plan.price}
                          <span className="text-sm text-gray-500">/{plan.period}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button onClick={handleUpgrade} disabled={loading} className="w-full">
                    <Crown className="h-4 w-4 mr-2" />
                    {loading ? 'Processing...' : `Upgrade to Premium - ${pricingPlans.find(p => p.value === selectedPlan)?.price}`}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saved Files */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <CardTitle>Saved Files</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={checkSubscription}>
                <Settings className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <CardDescription>
              Files are saved for {isSubscribed ? '1 year' : '1 week'} based on your subscription plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingItems ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading your files...</p>
              </div>
            ) : savedItems.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No saved files yet.</p>
                <p className="text-sm text-gray-500 mt-1">
                  Use any tool and save your processed files to see them here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.original_filename}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span>Tool: {item.tool_name}</span>
                          {item.file_size && <span>Size: {formatFileSize(item.file_size)}</span>}
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Created: {formatDate(item.created_at)}</span>
                          </div>
                          {item.expires_at && (
                            <div className="flex items-center">
                              <span>Expires: {formatDate(item.expires_at)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {item.file_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={item.file_url} download>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Type:</span>
                <Badge variant={isSubscribed ? "default" : "secondary"}>
                  {subscriptionTier || 'Free'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-medium">
                  {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
