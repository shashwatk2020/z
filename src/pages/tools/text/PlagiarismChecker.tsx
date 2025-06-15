
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';

const PlagiarismChecker = () => {
  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Plagiarism Checker</h1>
            <p className="mt-4 text-lg text-gray-600">
              Check your text for potential plagiarism against online sources.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Basic Plagiarism Checker</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Tool Offline</AlertTitle>
                <AlertDescription>
                  We are sorry, but the Plagiarism Checker tool is currently offline for maintenance. We are working to bring it back as soon as possible.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PlagiarismChecker;
