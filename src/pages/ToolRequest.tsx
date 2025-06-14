
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
import { Lock, Tool, Send } from 'lucide-react';

const ToolRequest = () => {
  const [formData, setFormData] = useState({
    toolName: '',
    category: '',
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
        description: "Tool requests are available for Premium users only.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would submit the tool request to your backend
      console.log('Tool request submitted:', formData);
      
      toast({
        title: "Request Submitted!",
        description: "Thank you for your tool request. We'll review it and get back to you soon.",
      });

      // Reset form
      setFormData({
        toolName: '',
        category: '',
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
              <Tool className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Request a Tool
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {isPremiumUser 
                ? "Have an idea for a new tool? Let us know what you need!"
                : "Tool requests are available for Premium users only."
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
                  Tool requests are available exclusively for Premium users. 
                  Upgrade your account to suggest new tools and features.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Premium users can request custom tools, suggest new features, 
                    and help shape the future of ZipConvert.
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
                  Submit Tool Request
                </CardTitle>
                <CardDescription>
                  Tell us about the tool you'd like us to build. The more details you provide, 
                  the better we can understand your needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="toolName">Tool Name *</Label>
                    <Input
                      id="toolName"
                      type="text"
                      required
                      value={formData.toolName}
                      onChange={(e) => setFormData({ ...formData, toolName: e.target.value })}
                      placeholder="e.g., Excel to JSON Converter"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Data Tools, Image Tools, PDF Tools"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Tool Description *</Label>
                    <Textarea
                      id="description"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      placeholder="Describe what the tool should do, what inputs it should accept, and what outputs it should provide..."
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
                      placeholder="Explain your specific use case and why this tool would be valuable to you and other users..."
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
                    {isSubmitting ? 'Submitting Request...' : 'Submit Tool Request'}
                  </Button>
                </form>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• We'll review your request within 2-3 business days</li>
                    <li>• Popular requests are prioritized for development</li>
                    <li>• You'll be notified when the tool is available</li>
                    <li>• Premium users get early access to new tools</li>
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

export default ToolRequest;
