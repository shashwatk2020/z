
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const SizeAnalyzer = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <FileText className="h-12 w-12 mx-auto text-green-600" />
        <h1 className="text-3xl font-bold">File Size Analyzer</h1>
        <p className="text-gray-600">Analyze file sizes within archives</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Analyze Sizes</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Analyze File Sizes</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default SizeAnalyzer;
