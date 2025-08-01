
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart } from 'lucide-react';

const PasswordStrengthAnalyzer = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <BarChart className="h-12 w-12 mx-auto text-purple-600" />
        <h1 className="text-3xl font-bold">Password Strength Analyzer</h1>
        <p className="text-gray-600">Analyze the strength of your passwords</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Analyze Password</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Analyze Password</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default PasswordStrengthAnalyzer;
