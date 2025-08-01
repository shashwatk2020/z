
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

const PasswordBreachChecker = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Shield className="h-12 w-12 mx-auto text-red-600" />
        <h1 className="text-3xl font-bold">Password Breach Checker</h1>
        <p className="text-gray-600">Check if your password has been breached</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Check Password</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Check Password</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default PasswordBreachChecker;
