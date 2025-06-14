
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Lock, Plus, Send } from 'lucide-react';

const FeatureRequest = () => {
  const [formData, setFormData] = useState({
    toolName: '',
    featureName: '',
    description: '',
    useCase: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isSubscribed, subscriptionTier, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSubscribed || subscriptionTier === 'free') {
      toast({
        title: "Premium Required",
        description: "Feature requests are available for Premium users only.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would submit the feature request to your backend
      console.log('Feature request submitted:', formData);
      
      toast({
        title: "Request Submitted!",
        description: "Thank you for your feature request. We'll review it and get back to you soon.",
      });

      // Reset form
      setFormData({
        toolName: '',
        featureName: '',
        description: '',
        useCase: '',
        priority: 'medium'
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const isPremiumUser = isSubscribed && subscriptionTier !== 'free';

  return (
    <Layout>
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Plus className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Request a Feature
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {isPremiumUser 
                ? "Want to enhance an existing tool? Let us know what feature you'd like to see!"
                : "Feature requests are available for Premium users only."
              }
            </p>
          </div>

          {!isPremiumUser ? (
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Lock className="h-16 w-16 text-gray-400" />
                </div>
                <CardTitle className="text-2xl">Premium Feature</CardTitle>
                <CardDescription className="text-lg">
                  Feature requests are available exclusively for Premium users. 
                  Upgrade your account to suggest new features for existing tools.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Premium users can request enhancements to existing tools, 
                    suggest new features, and help improve ZipConvert's functionality.
                  </p>
                  <Button size="lg" onClick={() => navigate('/pricing')}>
                    Upgrade to Premium
                  </Button>
                  <p className="text-sm text-gray-500">
                    Current plan: {subscriptionTier || 'Free'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 text-blue-600 mr-2" />
                  Submit Feature Request
                </CardTitle>
                <CardDescription>
                  Tell us about the feature you'd like us to add to an existing tool. 
                  The more details you provide, the better we can understand your needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="toolName">Existing Tool Name *</Label>
                    <Input
                      id="toolName"
                      type="text"
                      required
                      value={formData.toolName}
                      onChange={(e) => setFormData({ ...formData, toolName: e.target.value })}
                      placeholder="e.g., PDF Converter, Image Resizer"
                    />
                  </div>

                  <div>
                    <Label htmlFor="featureName">Feature Name *</Label>
                    <Input
                      id="featureName"
                      type="text"
                      required
                      value={formData.featureName}
                      onChange={(e) => setFormData({ ...formData, featureName: e.target.value })}
                      placeholder="e.g., Batch Processing, Password Protection"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Feature Description *</Label>
                    <Textarea
                      id="description"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      placeholder="Describe what the feature should do, how it should work, and any specific requirements..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="useCase">Use Case & Why You Need It *</Label>
                    <Textarea
                      id="useCase"
                      required
                      value={formData.useCase}
                      onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                      rows={3}
                      placeholder="Explain your specific use case and why this feature would be valuable..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low - Nice to have</option>
                      <option value="medium">Medium - Would be helpful</option>
                      <option value="high">High - Really need this</option>
                      <option value="urgent">Urgent - Critical for my workflow</option>
                    </select>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting Request...' : 'Submit Feature Request'}
                  </Button>
                </form>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• We'll review your request within 2-3 business days</li>
                    <li>• Popular requests are prioritized for development</li>
                    <li>• You'll be notified when the feature is available</li>
                    <li>• Premium users get early access to new features</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FeatureRequest;
