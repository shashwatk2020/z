import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

const ROT13Encoder = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <RotateCcw className="h-12 w-12 mx-auto text-purple-600" />
        <h1 className="text-3xl font-bold">ROT13 Encoder</h1>
        <p className="text-gray-600">Encode and decode text using ROT13 cipher</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Encode/Decode ROT13</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Use ROT13 Encoder</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default ROT13Encoder;