import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

const SslCertificateChecker = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <ShieldCheck className="h-12 w-12 mx-auto text-green-600" />
        <h1 className="text-3xl font-bold">SSL Certificate Checker</h1>
        <p className="text-gray-600">Check the validity of SSL certificates</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Check SSL Certificate</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Check Certificate</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default SslCertificateChecker;