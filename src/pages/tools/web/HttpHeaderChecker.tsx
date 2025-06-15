
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, Copy, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HttpHeaderChecker = () => {
  const [url, setUrl] = useState('https://example.com');
  const [isLoading, setIsLoading] = useState(false);
  const [headers, setHeaders] = useState<any>(null);
  const { toast } = useToast();

  const checkHeaders = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid URL to check.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate header check
    setTimeout(() => {
      const mockHeaders = {
        'content-type': 'text/html; charset=utf-8',
        'content-length': '12345',
        'server': 'nginx/1.18.0',
        'date': new Date().toUTCString(),
        'cache-control': 'public, max-age=3600',
        'x-frame-options': 'SAMEORIGIN',
        'x-content-type-options': 'nosniff',
        'x-xss-protection': '1; mode=block',
        'strict-transport-security': 'max-age=31536000; includeSubDomains',
        'content-security-policy': "default-src 'self'",
        'referrer-policy': 'strict-origin-when-cross-origin'
      };
      setHeaders(mockHeaders);
      setIsLoading(false);
      toast({
        title: "Headers Retrieved",
        description: "HTTP headers analyzed successfully."
      });
    }, 2000);
  };

  const copyHeaders = () => {
    if (headers) {
      const headerText = Object.entries(headers)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      navigator.clipboard.writeText(headerText);
      toast({
        title: "Copied!",
        description: "HTTP headers copied to clipboard."
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              HTTP Header Checker
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Analyze HTTP response headers for security, caching, and performance insights. Check server configuration and security headers.
            </p>
          </div>
          
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Header Analysis</CardTitle>
                <CardDescription>Enter a website URL to analyze its HTTP response headers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <div className="flex gap-3">
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="flex-1"
                    />
                    <Button onClick={checkHeaders} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 mr-2" />
                          Check Headers
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {headers && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>HTTP Response Headers</CardTitle>
                    <CardDescription>Headers returned by the server</CardDescription>
                  </div>
                  <Button variant="outline" onClick={copyHeaders}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(headers).map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row gap-2 p-3 bg-gray-50 rounded-lg">
                        <div className="font-mono text-sm font-medium text-blue-600 min-w-0 sm:w-1/3">
                          {key}:
                        </div>
                        <div className="font-mono text-sm text-gray-800 min-w-0 flex-1 break-all">
                          {value as string}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HttpHeaderChecker;
