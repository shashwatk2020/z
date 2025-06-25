
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';

const PasswordRecovery = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Key className="h-12 w-12 mx-auto text-orange-600" />
        <h1 className="text-3xl font-bold">Password Recovery</h1>
        <p className="text-gray-600">Recover passwords from protected archives</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Recover Password</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Start Password Recovery</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default PasswordRecovery;
