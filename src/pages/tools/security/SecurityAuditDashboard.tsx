import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';

const SecurityAuditDashboard = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <LayoutDashboard className="h-12 w-12 mx-auto text-blue-600" />
        <h1 className="text-3xl font-bold">Security Audit Dashboard</h1>
        <p className="text-gray-600">Monitor and manage your security posture</p>
      </div>
      <Card>
        <CardHeader><CardTitle>View Dashboard</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Go to Dashboard</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default SecurityAuditDashboard;