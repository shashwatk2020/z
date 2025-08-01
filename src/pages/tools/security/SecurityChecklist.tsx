import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks } from 'lucide-react';

const SecurityChecklist = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <ListChecks className="h-12 w-12 mx-auto text-blue-600" />
        <h1 className="text-3xl font-bold">Security Checklist</h1>
        <p className="text-gray-600">A comprehensive checklist for improving your security</p>
      </div>
      <Card>
        <CardHeader><CardTitle>View Checklist</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">View Security Checklist</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default SecurityChecklist;