import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi } from 'lucide-react';

const VpnConnectionTester = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Wifi className="h-12 w-12 mx-auto text-green-600" />
        <h1 className="text-3xl font-bold">VPN Connection Tester</h1>
        <p className="text-gray-600">Test your VPN connection for leaks</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Test VPN</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Test VPN Connection</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default VpnConnectionTester;