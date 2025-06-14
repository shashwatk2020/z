
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Terms of Service
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-700">
                    By accessing and using ZipConvert ("Service"), you accept and agree to be bound by 
                    the terms and provision of this agreement. If you do not agree to abide by the 
                    above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
                  <p className="text-gray-700 mb-4">
                    ZipConvert provides online file conversion, image editing, PDF manipulation, 
                    and other digital tools. Our services include:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>File format conversion tools</li>
                    <li>Image processing and editing</li>
                    <li>PDF manipulation tools</li>
                    <li>Document processing utilities</li>
                    <li>Data conversion and transformation tools</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
                  <p className="text-gray-700 mb-4">
                    To access certain features, you must create an account. You are responsible for:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities under your account</li>
                    <li>Providing accurate and current information</li>
                    <li>Notifying us of any unauthorized use</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
                  <p className="text-gray-700 mb-4">You agree not to use our service to:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Upload illegal, harmful, or copyrighted content without permission</li>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Interfere with or disrupt the service</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Use the service for commercial purposes without a proper license</li>
                    <li>Upload malicious files or malware</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. File Processing and Limitations</h2>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">File Handling:</h3>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                    <li>Files are processed and automatically deleted after completion</li>
                    <li>Maximum file size limits apply based on your subscription tier</li>
                    <li>We reserve the right to refuse processing of certain file types</li>
                  </ul>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Limits:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Free users: Limited daily conversions</li>
                    <li>Premium users: Increased limits and additional features</li>
                    <li>Fair use policy applies to all accounts</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Subscription and Billing</h2>
                  <p className="text-gray-700 mb-4">
                    Premium subscriptions are billed according to your chosen plan:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Subscriptions auto-renew unless cancelled</li>
                    <li>Refunds are handled according to our refund policy</li>
                    <li>Price changes will be communicated in advance</li>
                    <li>You can cancel your subscription at any time</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
                  <p className="text-gray-700 mb-4">
                    The Service and its original content, features, and functionality are owned by 
                    ZipConvert and are protected by international copyright, trademark, and other 
                    intellectual property laws.
                  </p>
                  <p className="text-gray-700">
                    You retain ownership of files you upload, and we claim no ownership rights over your content.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers and Limitations</h2>
                  <p className="text-gray-700 mb-4">
                    The service is provided "as is" without warranties of any kind. We do not guarantee:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Uninterrupted or error-free service</li>
                    <li>Perfect conversion quality for all files</li>
                    <li>Compatibility with all file formats</li>
                    <li>Data recovery if files are lost</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy</h2>
                  <p className="text-gray-700">
                    Your privacy is important to us. Please review our Privacy Policy, which also 
                    governs your use of the Service, to understand our practices.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
                  <p className="text-gray-700">
                    We may terminate or suspend your account and access to the service immediately, 
                    without prior notice, for conduct that we believe violates these Terms or is 
                    harmful to other users, us, or third parties.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
                  <p className="text-gray-700">
                    We reserve the right to modify these terms at any time. We will notify users of 
                    significant changes via email or through the service. Continued use after changes 
                    constitutes acceptance of the new terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
                  <p className="text-gray-700">
                    If you have any questions about these Terms of Service, please contact us:
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

export default TermsOfService;
