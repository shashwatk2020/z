import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';

const BackupRestore = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <RotateCw className="h-12 w-12 mx-auto text-green-600" />
        <h1 className="text-3xl font-bold">Backup Restore</h1>
        <p className="text-gray-600">Restore from your backups</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Restore Backup</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Restore Backup</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default BackupRestore;