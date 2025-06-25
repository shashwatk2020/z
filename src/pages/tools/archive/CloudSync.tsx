
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cloud } from 'lucide-react';

const CloudSync = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Cloud className="h-12 w-12 mx-auto text-blue-600" />
        <h1 className="text-3xl font-bold">Cloud Backup Sync</h1>
        <p className="text-gray-600">Sync backup archives with cloud storage</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Cloud Sync</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Sync with Cloud</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default CloudSync;
