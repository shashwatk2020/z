
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Merge } from 'lucide-react';

const ArchiveMerger = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Merge className="h-12 w-12 mx-auto text-green-600" />
        <h1 className="text-3xl font-bold">Archive Merger</h1>
        <p className="text-gray-600">Merge multi-part archives into single files</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Merge Archives</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Merge Archive Parts</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default ArchiveMerger;
