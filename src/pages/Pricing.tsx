
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Check, Star, Zap, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: 'Free Forever',
      price: '$0',
      period: 'forever',
      description: 'All 350+ tools completely free with basic storage',
      features: [
        'All 350+ tools included',
        'All features unlocked',
        'Unlimited conversions',
        'No watermarks',
        'Fast processing',
        'Large file support (up to 100MB)',
        'Batch processing',
        'Email support',
        'No registration required',
        '1 week file storage'
      ],
      limitations: [],
      buttonText: 'Start Using Tools',
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      name: 'Premium Monthly',
      price: '$4.99',
      period: 'month',
      description: 'All free features plus extended storage',
      features: [
        'Everything in Free',
        '1 year file storage',
        'Priority support',
        'Advanced file management',
        'Download history',
        'Extended file retention'
      ],
      buttonText: 'Upgrade to Premium',
      buttonVariant: 'default' as const,
      popular: false
    },
    {
      name: 'Premium Yearly',
      price: '$29.99',
      period: 'year',
      originalPrice: '$59.88',
      savings: 'Save $30',
      description: 'Best value with 1 year storage',
      features: [
        'Everything in Premium Monthly',
        '1 year file storage',
        'Priority support',
        'Advanced file management',
        'Download history',
        'Extended file retention',
        '2 months free!'
      ],
      buttonText: 'Get Best Value',
      buttonVariant: 'default' as const,
      popular: true
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
              Choose Your Storage Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              All 350+ tools are completely free. Choose a plan based on how long you want your files stored.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-xl p-8 relative ${plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      Best Value
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
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
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full text-lg py-6 ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  size="lg"
                  variant={plan.buttonVariant}
                  asChild
                >
                  <Link to={plan.name === 'Free Forever' ? "/" : "/auth"}>
                    {plan.buttonText}
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Why Different Plans Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Why Choose Premium Storage?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Extended Storage</h3>
                <p className="text-gray-600 text-sm">Keep your processed files for a full year instead of just one week.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">File Management</h3>
                <p className="text-gray-600 text-sm">Advanced dashboard to organize and manage all your converted files.</p>
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
                  question: 'Are the tools really free?',
                  answer: 'Yes! All 350+ tools are completely free with no hidden fees or limitations. You only pay for extended file storage if you want it.'
                },
                {
                  question: 'What happens to my files with the free plan?',
                  answer: 'With the free plan, your processed files are stored for 1 week, then automatically deleted for privacy and security.'
                },
                {
                  question: 'Can I upgrade or downgrade anytime?',
                  answer: 'Yes! You can upgrade to premium anytime or cancel your subscription. Your files will be retained based on your current plan.'
                },
                {
                  question: 'Is the yearly plan really better value?',
                  answer: 'Absolutely! The yearly plan saves you $30 compared to paying monthly, giving you 2 months free.'
                },
                {
                  question: 'What payment methods do you accept?',
                  answer: 'We accept all major credit cards and PayPal through our secure Stripe payment processing.'
                },
                {
                  question: 'Can I access my files from anywhere?',
                  answer: 'Yes! Your saved files are accessible from any device through your dashboard as long as your subscription is active.'
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
