
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ZipToRar = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <ArrowRight className="h-12 w-12 mx-auto text-red-600" />
        <h1 className="text-3xl font-bold">ZIP to RAR Converter</h1>
        <p className="text-gray-600">Convert ZIP archives to RAR format</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Convert ZIP to RAR</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Convert to RAR</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default ZipToRar;
