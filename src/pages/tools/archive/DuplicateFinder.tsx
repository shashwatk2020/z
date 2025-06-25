
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const DuplicateFinder = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Search className="h-12 w-12 mx-auto text-yellow-600" />
        <h1 className="text-3xl font-bold">Duplicate File Finder</h1>
        <p className="text-gray-600">Find duplicate files within archives</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Find Duplicates</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Find Duplicate Files</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default DuplicateFinder;
