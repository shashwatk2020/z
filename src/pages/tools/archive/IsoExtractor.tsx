
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Disc } from 'lucide-react';

const IsoExtractor = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Disc className="h-12 w-12 mx-auto text-blue-600" />
        <h1 className="text-3xl font-bold">ISO File Extractor</h1>
        <p className="text-gray-600">Extract files from ISO disc images</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Extract ISO</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Extract ISO Files</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default IsoExtractor;
