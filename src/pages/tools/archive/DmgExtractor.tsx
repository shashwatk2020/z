
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HardDrive } from 'lucide-react';

const DmgExtractor = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <HardDrive className="h-12 w-12 mx-auto text-gray-600" />
        <h1 className="text-3xl font-bold">DMG File Extractor</h1>
        <p className="text-gray-600">Extract files from Mac disk image files</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Extract DMG</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Extract DMG Files</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default DmgExtractor;
