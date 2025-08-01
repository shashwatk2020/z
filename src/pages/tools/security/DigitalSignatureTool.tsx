import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Signature } from 'lucide-react';

const DigitalSignatureTool = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Signature className="h-12 w-12 mx-auto text-blue-600" />
        <h1 className="text-3xl font-bold">Digital Signature Tool</h1>
        <p className="text-gray-600">Create and verify digital signatures</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Sign/Verify</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Use Digital Signature Tool</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default DigitalSignatureTool;