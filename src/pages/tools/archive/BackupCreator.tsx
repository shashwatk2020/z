
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HardDrive, Upload, Download } from 'lucide-react';

const BackupCreator = () => {
  const [backupName, setBackupName] = useState('backup');
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <HardDrive className="h-12 w-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold">Backup Creator</h1>
          <p className="text-gray-600">Create compressed backups of your important files</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Create Backup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Backup Name</Label>
              <Input value={backupName} onChange={(e) => setBackupName(e.target.value)} />
            </div>
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BackupCreator;
