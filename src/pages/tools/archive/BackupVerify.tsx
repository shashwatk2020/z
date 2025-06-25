
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const BackupVerify = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
        <h1 className="text-3xl font-bold">Backup Verification</h1>
        <p className="text-gray-600">Verify backup integrity</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Verify Backup</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Verify Backup Files</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default BackupVerify;
