import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const PrivacyScanner = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Search className="h-12 w-12 mx-auto text-green-600" />
        <h1 className="text-3xl font-bold">Privacy Scanner</h1>
        <p className="text-gray-600">Scan for privacy vulnerabilities</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Scan for Privacy</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Scan for Privacy</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default PrivacyScanner;