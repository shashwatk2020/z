import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

const EmailSecurityChecker = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Mail className="h-12 w-12 mx-auto text-blue-600" />
        <h1 className="text-3xl font-bold">Email Security Checker</h1>
        <p className="text-gray-600">Check email addresses for security risks</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Check Email Security</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Check Email</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default EmailSecurityChecker;