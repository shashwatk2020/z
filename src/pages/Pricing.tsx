
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Check, Star, Zap, Heart, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: 'Unregistered Users',
      price: '$0',
      period: 'forever',
      description: 'Basic access to all tools with file size limits',
      features: [
        'All 350+ tools included',
        'All features unlocked',
        'Unlimited conversions',
        'No watermarks',
        'Fast processing',
        'File size limit: 5MB',
        'No file backup',
        'No registration required'
      ],
      limitations: [
        'Files not saved after processing',
        'Limited to 5MB file size'
      ],
      buttonText: 'Start Using Tools',
      buttonVariant: 'outline' as const,
      popular: false,
      icon: Users
    },
    {
      name: 'Free (Registered)',
      price: '$0',
      period: 'forever',
      description: 'Enhanced limits and backup for registered users',
      features: [
        'Everything in Unregistered',
        'File size limit: 10MB',
        '12 hours file backup',
        'Download history',
        'Basic file management',
        'Email support',
        'Tool request submissions'
      ],
      buttonText: 'Register Free',
      buttonVariant: 'default' as const,
      popular: false,
      icon: Heart
    },
    {
      name: 'Premium Monthly',
      price: '$4.99',
      period: 'month',
      description: 'Full access with extended storage and priority support',
      features: [
        'Everything in Free',
        'File size limit: 100MB',
        '1 month file backup',
        'Priority support',
        'Advanced file management',
        'Feature request submissions',
        'Priority processing',
        'Extended file retention'
      ],
      buttonText: 'Upgrade to Premium',
      buttonVariant: 'default' as const,
      popular: false,
      icon: Shield
    },
    {
      name: 'Premium Yearly',
      price: '$29.99',
      period: 'year',
      originalPrice: '$59.88',
      savings: 'Save $30',
      description: 'Best value with full premium features',
      features: [
        'Everything in Premium Monthly',
        'File size limit: 100MB',
        '1 month file backup',
        'Priority support',
        'Advanced file management',
        'Feature request submissions',
        'Priority processing',
        '2 months free!'
      ],
      buttonText: 'Get Best Value',
      buttonVariant: 'default' as const,
      popular: true,
      icon: Star
    }
  ];

  return (
    <Layout>
      <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Heart className="h-4 w-4 fill-current" />
              <span>All Tools Are Free</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              All 350+ tools are completely free. Choose a plan based on file size limits and backup duration.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              return (
                <div key={index} className={`bg-white rounded-2xl shadow-xl p-6 relative ${plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-current" />
                        Best Value
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-3">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                        <div className="text-left">
                          <span className="text-gray-500">/{plan.period}</span>
                          {plan.originalPrice && (
                            <div className="text-sm text-gray-400 line-through">{plan.originalPrice}</div>
                          )}
                        </div>
                      </div>
                      {plan.savings && (
                        <div className="text-green-600 font-medium text-sm mt-1">{plan.savings}</div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations && plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-start">
                        <span className="text-red-500 mr-2 text-sm">✗</span>
                        <span className="text-gray-500 text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full text-sm py-4 ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    size="lg"
                    variant={plan.buttonVariant}
                    asChild
                  >
                    <Link to={plan.name.includes('Premium') ? "/auth" : (plan.name === 'Free (Registered)' ? "/auth" : "/")}>
                      {plan.buttonText}
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Features Comparison */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Plan Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">Unregistered</th>
                    <th className="text-center py-3 px-4">Free (Registered)</th>
                    <th className="text-center py-3 px-4">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">File Size Limit</td>
                    <td className="text-center py-3 px-4">5MB</td>
                    <td className="text-center py-3 px-4">10MB</td>
                    <td className="text-center py-3 px-4">100MB</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">File Backup</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">12 hours</td>
                    <td className="text-center py-3 px-4">1 month</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Tool Requests</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">✅</td>
                    <td className="text-center py-3 px-4">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Feature Requests</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">✅</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Priority Support</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Why Different Plans Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Why Upgrade Your Plan?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">File Size & Backup</h3>
                <p className="text-gray-600 text-sm">Higher file size limits and longer backup retention for your processed files.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Request Features</h3>
                <p className="text-gray-600 text-sm">Submit requests for new tools and features to shape the platform.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Priority Support</h3>
                <p className="text-gray-600 text-sm">Get faster response times and dedicated customer support.</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              {[
                {
                  question: 'What are the file size limits?',
                  answer: 'Unregistered users can process files up to 5MB, registered free users up to 10MB, and premium users up to 100MB.'
                },
                {
                  question: 'How long are files backed up?',
                  answer: 'Unregistered users have no backup. Free registered users get 12-hour backup, while premium users get 1-month backup retention.'
                },
                {
                  question: 'Can I request new tools?',
                  answer: 'Free registered users can request new tools, while premium users can request both tools and features. Unregistered users cannot submit requests.'
                },
                {
                  question: 'Can I upgrade or downgrade anytime?',
                  answer: 'Yes! You can upgrade to premium anytime or cancel your subscription. Your files will be retained based on your current plan.'
                },
                {
                  question: 'What payment methods do you accept?',
                  answer: 'We accept all major credit cards and PayPal through our secure Stripe payment processing.'
                },
                {
                  question: 'Is registration really free?',
                  answer: 'Yes! Registration is completely free and gives you higher file limits and 12-hour backup compared to unregistered usage.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
