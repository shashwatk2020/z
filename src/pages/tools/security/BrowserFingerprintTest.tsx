import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fingerprint } from 'lucide-react';

const BrowserFingerprintTest = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Fingerprint className="h-12 w-12 mx-auto text-purple-600" />
        <h1 className="text-3xl font-bold">Browser Fingerprint Test</h1>
        <p className="text-gray-600">Test your browser's uniqueness and trackability</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Test Fingerprint</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Run Test</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default BrowserFingerprintTest;