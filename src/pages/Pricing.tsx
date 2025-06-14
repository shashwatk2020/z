
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
      description: 'All 350+ tools completely free with no limitations',
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
        'Privacy focused - files deleted after processing'
      ],
      limitations: [],
      buttonText: 'Start Using Tools',
      buttonVariant: 'default' as const,
      popular: true
    }
  ];

  return (
    <Layout>
      <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Heart className="h-4 w-4 fill-current" />
              <span>100% Free Forever</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              All Tools Are Completely Free
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We believe powerful tools should be accessible to everyone. That's why all 350+ tools on ZipConvert are completely free with no hidden costs or limitations.
            </p>
          </div>

          {/* Single Pricing Card */}
          <div className="flex justify-center mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 relative max-w-md w-full ring-2 ring-blue-600">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  Best Value
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{plans[0].name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">{plans[0].price}</span>
                  <span className="text-gray-500 ml-2">/{plans[0].period}</span>
                </div>
                <p className="text-gray-600">{plans[0].description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plans[0].features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                size="lg"
                asChild
              >
                <Link to="/">
                  {plans[0].buttonText}
                </Link>
              </Button>
            </div>
          </div>

          {/* Why Free Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Why Are All Tools Free?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Community First</h3>
                <p className="text-gray-600 text-sm">We believe in supporting creators, developers, and professionals by providing free access to essential tools.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No Barriers</h3>
                <p className="text-gray-600 text-sm">Remove financial barriers that prevent people from accessing the tools they need to be productive.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quality Focus</h3>
                <p className="text-gray-600 text-sm">By keeping tools free, we focus on building the best user experience rather than complex pricing models.</p>
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
                  question: 'Are there really no hidden costs?',
                  answer: 'Absolutely not! All tools are completely free with no hidden fees, subscriptions, or premium tiers. You get full access to everything.'
                },
                {
                  question: 'Do I need to create an account?',
                  answer: 'No account required! You can use all tools immediately without signing up. We respect your privacy and don\'t track your usage.'
                },
                {
                  question: 'What happens to my files?',
                  answer: 'All files are automatically deleted from our servers after processing for security and privacy. We never store your personal files permanently.'
                },
                {
                  question: 'Are there any usage limits?',
                  answer: 'No limits! You can use any tool as many times as you want. Process unlimited files with no restrictions on file size (up to 100MB per file).'
                },
                {
                  question: 'How do you keep the service running?',
                  answer: 'We keep costs low through efficient infrastructure and may show non-intrusive ads to cover server costs while keeping all tools free.'
                },
                {
                  question: 'Can I use these tools for commercial projects?',
                  answer: 'Yes! All tools can be used for personal and commercial projects without any restrictions or attribution requirements.'
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
