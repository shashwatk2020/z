
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Privacy Policy
              </h1>
            </div>
            <p className="text-xl text-gray-600">
              Last updated: December 14, 2024
            </p>
          </div>

          <Card>
            <CardContent className="prose prose-lg max-w-none p-8">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                  <p className="text-gray-700 mb-4">
                    We collect information you provide directly to us, such as when you create an account, 
                    use our services, or contact us for support.
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information:</h3>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                    <li>Name and email address</li>
                    <li>Account credentials</li>
                    <li>Payment information (processed securely through Stripe)</li>
                    <li>Communication preferences</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Information:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Files you upload and process (temporarily stored)</li>
                    <li>Usage patterns and feature preferences</li>
                    <li>Device and browser information</li>
                    <li>IP address and location data</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                  <p className="text-gray-700 mb-4">We use the information we collect to:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process your files and deliver conversion results</li>
                    <li>Handle billing and payment processing</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Analyze usage patterns to improve our tools</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. File Processing and Storage</h2>
                  <p className="text-gray-700 mb-4">
                    <strong>Your files are important to us.</strong> Here's how we handle them:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Files are processed in real-time and automatically deleted after processing</li>
                    <li>We never permanently store your personal files</li>
                    <li>Files are encrypted during transmission and processing</li>
                    <li>Premium users may have longer temporary storage for convenience</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing</h2>
                  <p className="text-gray-700 mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties, except:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>With your explicit consent</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect our rights and prevent fraud</li>
                    <li>With trusted service providers (under strict confidentiality agreements)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
                  <p className="text-gray-700">
                    We implement industry-standard security measures to protect your information, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>SSL encryption for all data transmission</li>
                    <li>Secure server infrastructure</li>
                    <li>Regular security audits and updates</li>
                    <li>Limited access to personal information</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
                  <p className="text-gray-700 mb-4">You have the right to:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Access and update your personal information</li>
                    <li>Delete your account and associated data</li>
                    <li>Opt out of marketing communications</li>
                    <li>Request a copy of your data</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
                  <p className="text-gray-700">
                    We use cookies and similar technologies to improve your experience, analyze usage, 
                    and remember your preferences. You can control cookie settings through your browser.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
                  <p className="text-gray-700">
                    We may update this Privacy Policy from time to time. We will notify you of any 
                    significant changes by posting the new policy on this page and updating the 
                    "Last updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
                  <p className="text-gray-700">
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg mt-4">
                    <p className="text-gray-900 font-medium">Email: contact@zipconvert.com</p>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
