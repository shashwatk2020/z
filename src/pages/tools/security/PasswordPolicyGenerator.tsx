
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const PasswordPolicyGenerator = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <FileText className="h-12 w-12 mx-auto text-green-600" />
        <h1 className="text-3xl font-bold">Password Policy Generator</h1>
        <p className="text-gray-600">Generate a password policy for your organization</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Generate Policy</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Generate Policy</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default PasswordPolicyGenerator;
