import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scan } from 'lucide-react';

const WebsiteSecurityScanner = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Scan className="h-12 w-12 mx-auto text-red-600" />
        <h1 className="text-3xl font-bold">Website Security Scanner</h1>
        <p className="text-gray-600">Scan websites for vulnerabilities</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Scan Website</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Scan Website</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default WebsiteSecurityScanner;