import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

const CookieAnalyzer = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Cookie className="h-12 w-12 mx-auto text-brown-600" />
        <h1 className="text-3xl font-bold">Cookie Analyzer</h1>
        <p className="text-gray-600">Analyze website cookies for privacy concerns</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Analyze Cookies</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Analyze Cookies</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default CookieAnalyzer;