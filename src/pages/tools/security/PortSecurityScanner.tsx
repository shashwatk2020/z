import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HardDrive } from 'lucide-react';

const PortSecurityScanner = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <HardDrive className="h-12 w-12 mx-auto text-red-600" />
        <h1 className="text-3xl font-bold">Port Security Scanner</h1>
        <p className="text-gray-600">Scan open ports for security vulnerabilities</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Scan Ports</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Scan Ports</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default PortSecurityScanner;