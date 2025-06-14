
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Check, Star, Zap, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'All tools available with basic features',
      features: [
        'All 150+ tools included',
        'Basic conversion features',
        '5 conversions per day',
        'Standard processing speed',
        'Email support'
      ],
      limitations: [
        'Watermark on outputs',
        'Limited file size (10MB)',
        'No premium features',
        'No batch processing'
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'All tools with premium features unlocked',
      features: [
        'All 150+ tools included',
        'All premium features unlocked',
        'Unlimited conversions',
        'No watermarks',
        'Priority processing',
        'Large file support (1GB)',
        'Batch processing',
        'Priority support',
        'API access'
      ],
      limitations: [],
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'default' as const,
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$49.99',
      period: 'per month',
      description: 'For teams and businesses',
      features: [
        'Everything in Pro',
        'Team management',
        'Custom branding',
        'Dedicated support',
        'SLA guarantee',
        'Custom integrations',
        'Volume discounts',
        'White-label options'
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      popular: false
    }
  ];

  return (
    <Layout>
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              All tools are free to use. Upgrade to unlock premium features and remove limitations.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                  plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-2">/{plan.period}</span>
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
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-center opacity-60">
                      <Lock className="h-4 w-4 mr-3 flex-shrink-0 text-gray-400" />
                      <span className="text-gray-500 text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={plan.buttonVariant}
                  size="lg"
                  asChild
                >
                  <Link to={plan.name === 'Free' ? '/register' : '/register'}>
                    {plan.buttonText}
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              {[
                {
                  question: 'Can I change my plan at any time?',
                  answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and you\'ll be charged or credited on your next billing cycle.'
                },
                {
                  question: 'What happens to my files?',
                  answer: 'All files are automatically deleted from our servers after processing for security and privacy. We never store your personal files permanently.'
                },
                {
                  question: 'Is there a free trial for Pro plans?',
                  answer: 'Yes, we offer a 7-day free trial for all Pro plans. No credit card required to start your trial.'
                },
                {
                  question: 'Do you offer refunds?',
                  answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, contact us for a full refund.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6">
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
