
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileArchive } from 'lucide-react';

const CabExtractor = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <FileArchive className="h-12 w-12 mx-auto text-orange-600" />
        <h1 className="text-3xl font-bold">CAB File Extractor</h1>
        <p className="text-gray-600">Extract Microsoft Cabinet archive files</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Extract CAB</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Extract CAB Files</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default CabExtractor;
