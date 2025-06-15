
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WebsiteSecurityScanner = () => {
  const [url, setUrl] = useState('https://example.com');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const scanWebsite = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid URL to scan.",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    
    // Simulate security scan
    setTimeout(() => {
      const mockResults = {
        overall: 'warning',
        score: 75,
        checks: [
          { name: 'HTTPS', status: 'pass', description: 'Website uses HTTPS encryption' },
          { name: 'SSL Certificate', status: 'pass', description: 'Valid SSL certificate found' },
          { name: 'HTTP Headers', status: 'warning', description: 'Some security headers missing' },
          { name: 'Mixed Content', status: 'pass', description: 'No mixed content detected' },
          { name: 'XSS Protection', status: 'warning', description: 'XSS protection could be improved' },
          { name: 'Content Security Policy', status: 'fail', description: 'CSP header not found' },
          { name: 'Clickjacking Protection', status: 'pass', description: 'X-Frame-Options header present' },
          { name: 'HSTS', status: 'warning', description: 'HSTS header not found' }
        ]
      };
      setResults(mockResults);
      setIsScanning(false);
      toast({
        title: "Scan Complete",
        description: "Security scan completed successfully."
      });
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Website Security Scanner
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Scan websites for common security vulnerabilities and best practices. Check HTTPS, headers, and security configurations.
            </p>
          </div>
          
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Security Scan</CardTitle>
                <CardDescription>Enter a website URL to perform a comprehensive security analysis</CardDescription>
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
                    <Button onClick={scanWebsite} disabled={isScanning}>
                      {isScanning ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Scan Website
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {results && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Scan Results</CardTitle>
                  <CardDescription>
                    Overall Security Score: {results.score}/100
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.checks.map((check: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(check.status)}
                          <div>
                            <div className="font-medium">{check.name}</div>
                            <div className="text-sm text-gray-600">{check.description}</div>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          check.status === 'pass' ? 'bg-green-100 text-green-800' :
                          check.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {check.status.toUpperCase()}
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

export default WebsiteSecurityScanner;
