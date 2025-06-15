
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const SerpPreviewTool = () => {
  const [title, setTitle] = useState('Your Page Title - Up to 60 characters');
  const [url, setUrl] = useState('https://www.yourwebsite.com/your-page');
  const [description, setDescription] = useState('Your meta description goes here. Try to keep it within 160 characters for best results on search engines.');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              SERP Preview Tool
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how your webpage will appear in Google's search results. Optimize your title and meta description for higher click-through rates.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>SERP Data</CardTitle>
                <CardDescription>Enter your page information below.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">SEO Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} />
                  <p className={`text-sm ${title.length > 60 ? 'text-red-500' : 'text-muted-foreground'}`}>{title.length} / 60 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Meta Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={160} className="min-h-[120px]" />
                  <p className={`text-sm ${description.length > 160 ? 'text-red-500' : 'text-muted-foreground'}`}>{description.length} / 160 characters</p>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Live Preview</h2>
              <Card>
                <CardContent className="p-4">
                  <div className="p-4 bg-white">
                    <div>
                      <span className="text-sm text-gray-700">{url.replace(/^(https?:\/\/)/, '').split('/')[0]} › ... › {url.split('/').pop()}</span>
                      <h3 className="text-blue-800 text-xl font-medium hover:underline cursor-pointer truncate pt-1">
                        {title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SerpPreviewTool;
