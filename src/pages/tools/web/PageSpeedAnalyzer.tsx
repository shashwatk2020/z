
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const PageSpeedAnalyzer = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Page Speed Analyzer
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Analyze your website's loading speed and get optimization recommendations.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Analyze Page Speed</CardTitle>
              <CardDescription>
                Get detailed insights into your website's performance and loading times.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Not Working Right Now</AlertTitle>
                <AlertDescription>
                  This tool is currently under development and requires external API integration. 
                  Please check back later for this functionality.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PageSpeedAnalyzer;
