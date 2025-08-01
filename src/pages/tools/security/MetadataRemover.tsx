import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const MetadataRemover = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Trash2 className="h-12 w-12 mx-auto text-red-600" />
        <h1 className="text-3xl font-bold">Metadata Remover</h1>
        <p className="text-gray-600">Remove sensitive metadata from files</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Remove Metadata</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Remove Metadata</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default MetadataRemover;