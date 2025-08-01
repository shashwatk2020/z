import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const BackupScheduler = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Calendar className="h-12 w-12 mx-auto text-blue-600" />
        <h1 className="text-3xl font-bold">Backup Scheduler</h1>
        <p className="text-gray-600">Schedule automatic backups</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Schedule Backup</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Schedule Backup</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default BackupScheduler;