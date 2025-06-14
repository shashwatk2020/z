
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, HelpCircle, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Handle contact form submission
      console.log('Help contact form submitted:', contactForm);
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting support. We'll get back to you soon.",
      });

      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqItems = [
    {
      question: 'How do I convert a file?',
      answer: 'Simply upload your file using our drag-and-drop interface, select your desired output format, and click convert. Your file will be processed and ready for download in seconds.'
    },
    {
      question: 'What file formats do you support?',
      answer: 'We support over 200 file formats including PDF, Word, Excel, PowerPoint, images (JPG, PNG, GIF), videos (MP4, AVI, MOV), audio files, and many more.'
    },
    {
      question: 'Is there a file size limit?',
      answer: 'Free users can convert files up to 25MB. Premium users can convert files up to 100MB per file.'
    },
    {
      question: 'How secure is my data?',
      answer: 'Your files are processed securely using industry-standard encryption. All files are automatically deleted from our servers after processing.'
    },
    {
      question: 'Can I convert multiple files at once?',
      answer: 'Yes! Premium users can batch convert multiple files simultaneously, saving time and effort.'
    },
    {
      question: 'How do I upgrade to Premium?',
      answer: 'You can upgrade to Premium by visiting our Pricing page and selecting the plan that best fits your needs.'
    }
  ];

  const filteredFAQs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions and get the support you need.
            </p>
          </div>

          {/* Search */}
          <div className="mb-12">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                {filteredFAQs.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <HelpCircle className="h-5 w-5 text-blue-600 mr-2" />
                        {faq.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No results found for "{searchQuery}". Try a different search term.</p>
                </div>
              )}
            </div>

            {/* Contact Support */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-600 mr-2" />
                    Contact Support
                  </CardTitle>
                  <CardDescription>
                    Can't find what you're looking for? Send us a message.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="support-name">Name</Label>
                      <Input
                        id="support-name"
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="support-email">Email</Label>
                      <Input
                        id="support-email"
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="support-subject">Subject</Label>
                      <Input
                        id="support-subject"
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="support-message">Message</Label>
                      <Textarea
                        id="support-message"
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        rows={4}
                        placeholder="Describe your issue..."
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
