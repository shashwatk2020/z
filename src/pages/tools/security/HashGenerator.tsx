import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hash } from 'lucide-react';

const HashGenerator = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Hash className="h-12 w-12 mx-auto text-orange-600" />
        <h1 className="text-3xl font-bold">Hash Generator</h1>
        <p className="text-gray-600">Generate various cryptographic hashes</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Generate Hash</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Generate Hash</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default HashGenerator;