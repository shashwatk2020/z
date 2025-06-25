
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive } from 'lucide-react';

const IncrementalBackup = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Archive className="h-12 w-12 mx-auto text-blue-600" />
        <h1 className="text-3xl font-bold">Incremental Backup</h1>
        <p className="text-gray-600">Create incremental backups to save time and space</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Incremental Backup</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Create Incremental Backup</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default IncrementalBackup;
