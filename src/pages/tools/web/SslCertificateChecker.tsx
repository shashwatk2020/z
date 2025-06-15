
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Shield, Clock, AlertTriangle, CheckCircle, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CertificateInfo {
  domain: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  daysUntilExpiry: number;
  isValid: boolean;
  protocol: string;
  keySize: string;
  signature: string;
  serialNumber: string;
  subjectAltNames: string[];
}

const SslCertificateChecker = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [certificateInfo, setCertificateInfo] = useState<CertificateInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock SSL certificate check function
  const checkSSLCertificate = async (domainName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock certificate data (in real app, this would call an SSL API)
      const mockData: CertificateInfo = {
        domain: domainName,
        issuer: 'Let\'s Encrypt Authority X3',
        validFrom: '2024-01-15T00:00:00Z',
        validTo: '2024-04-15T23:59:59Z',
        daysUntilExpiry: Math.floor(Math.random() * 90) + 1,
        isValid: Math.random() > 0.2, // 80% chance of being valid
        protocol: 'TLS 1.3',
        keySize: '2048 bit RSA',
        signature: 'SHA256-RSA',
        serialNumber: '03:AB:CD:EF:12:34:56:78:90',
        subjectAltNames: [`${domainName}`, `www.${domainName}`]
      };
      
      setCertificateInfo(mockData);
      toast({
        title: "SSL Check Complete",
        description: `Certificate information retrieved for ${domainName}`
      });
    } catch (err) {
      setError('Failed to check SSL certificate. Please verify the domain and try again.');
      toast({
        title: "Error",
        description: "Failed to check SSL certificate",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) {
      setError('Please enter a domain name');
      return;
    }
    
    // Clean domain input
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
    checkSSLCertificate(cleanDomain);
  };

  const getStatusColor = (cert: CertificateInfo) => {
    if (!cert.isValid) return 'destructive';
    if (cert.daysUntilExpiry <= 7) return 'destructive';
    if (cert.daysUntilExpiry <= 30) return 'secondary';
    return 'default';
  };

  const getStatusIcon = (cert: CertificateInfo) => {
    if (!cert.isValid || cert.daysUntilExpiry <= 7) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              SSL Certificate Checker
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Check SSL certificate details, expiration dates, and security information for any domain.
            </p>
          </div>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  SSL Certificate Checker
                </CardTitle>
                <CardDescription>Enter a domain name to check its SSL certificate status</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain Name</Label>
                    <div className="flex gap-2">
                      <Input
                        id="domain"
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="example.com"
                        className="flex-1"
                      />
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Checking...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            Check SSL
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {certificateInfo && (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        {certificateInfo.domain}
                      </span>
                      <Badge variant={getStatusColor(certificateInfo)} className="flex items-center gap-1">
                        {getStatusIcon(certificateInfo)}
                        {certificateInfo.isValid ? 'Valid' : 'Invalid'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">Certificate Authority</h3>
                          <p className="text-gray-900">{certificateInfo.issuer}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">Protocol & Security</h3>
                          <div className="space-y-1">
                            <p className="text-gray-900">{certificateInfo.protocol}</p>
                            <p className="text-gray-600 text-sm">{certificateInfo.keySize}</p>
                            <p className="text-gray-600 text-sm">{certificateInfo.signature}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">Serial Number</h3>
                          <p className="text-gray-900 font-mono text-sm">{certificateInfo.serialNumber}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">Valid From</h3>
                          <p className="text-gray-900">{formatDate(certificateInfo.validFrom)}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">Valid To</h3>
                          <p className="text-gray-900">{formatDate(certificateInfo.validTo)}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">Days Until Expiry</h3>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-900 font-semibold">{certificateInfo.daysUntilExpiry} days</span>
                            {certificateInfo.daysUntilExpiry <= 30 && (
                              <Badge variant="secondary" className="text-xs">
                                Expires Soon
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">Subject Alternative Names</h3>
                          <div className="space-y-1">
                            {certificateInfo.subjectAltNames.map((name, index) => (
                              <p key={index} className="text-gray-900 text-sm">{name}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Security Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {certificateInfo.daysUntilExpiry <= 7 && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 text-red-700">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-semibold">Certificate expires in {certificateInfo.daysUntilExpiry} days</span>
                          </div>
                          <p className="text-red-600 text-sm mt-1">Renew your SSL certificate immediately to avoid service disruption.</p>
                        </div>
                      )}
                      
                      {certificateInfo.daysUntilExpiry > 7 && certificateInfo.daysUntilExpiry <= 30 && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 text-yellow-700">
                            <Clock className="h-4 w-4" />
                            <span className="font-semibold">Certificate expires in {certificateInfo.daysUntilExpiry} days</span>
                          </div>
                          <p className="text-yellow-600 text-sm mt-1">Consider renewing your SSL certificate soon.</p>
                        </div>
                      )}
                      
                      {certificateInfo.isValid && certificateInfo.daysUntilExpiry > 30 && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-semibold">Certificate is valid and secure</span>
                          </div>
                          <p className="text-green-600 text-sm mt-1">Your SSL certificate is properly configured and has plenty of time before expiration.</p>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-2">Best Practices:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Set up automatic renewal to avoid certificate expiration</li>
                          <li>• Monitor certificate expiration dates regularly</li>
                          <li>• Use strong encryption (TLS 1.2 or higher)</li>
                          <li>• Ensure all subdomains are covered by your certificate</li>
                          <li>• Test your SSL configuration periodically</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SslCertificateChecker;
