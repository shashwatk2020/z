import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TwoFactorAuthentication } from 'lucide-react';

const TwoFactorAuthSetup = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <TwoFactorAuthentication className="h-12 w-12 mx-auto text-green-600" />
        <h1 className="text-3xl font-bold">Two-Factor Auth Setup</h1>
        <p className="text-gray-600">Set up two-factor authentication for enhanced security</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Setup 2FA</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Setup 2FA</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default TwoFactorAuthSetup;