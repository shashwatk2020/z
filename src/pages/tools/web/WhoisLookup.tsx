
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Copy, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WhoisLookup = () => {
  const [domain, setDomain] = useState('example.com');
  const [isLoading, setIsLoading] = useState(false);
  const [whoisData, setWhoisData] = useState<any>(null);
  const { toast } = useToast();

  const lookupDomain = async () => {
    if (!domain) {
      toast({
        title: "Error",
        description: "Please enter a domain name to lookup.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate WHOIS lookup
    setTimeout(() => {
      const mockData = {
        domainName: domain.toLowerCase(),
        registrar: 'Example Registrar Inc.',
        registrarUrl: 'https://www.example-registrar.com',
        creationDate: '2010-03-15T10:30:00Z',
        expirationDate: '2025-03-15T10:30:00Z',
        updatedDate: '2023-02-10T14:20:00Z',
        status: ['clientTransferProhibited', 'clientUpdateProhibited'],
        nameServers: ['ns1.example.com', 'ns2.example.com'],
        registrant: {
          name: 'John Doe',
          organization: 'Example Corp',
          email: 'john@example.com',
          country: 'US'
        },
        admin: {
          name: 'Admin Contact',
          email: 'admin@example.com'
        },
        tech: {
          name: 'Tech Contact',
          email: 'tech@example.com'
        }
      };
      setWhoisData(mockData);
      setIsLoading(false);
      toast({
        title: "Lookup Complete",
        description: "WHOIS information retrieved successfully."
      });
    }, 2000);
  };

  const copyWhoisData = () => {
    if (whoisData) {
      const text = `Domain Name: ${whoisData.domainName}
Registrar: ${whoisData.registrar}
Creation Date: ${whoisData.creationDate}
Expiration Date: ${whoisData.expirationDate}
Updated Date: ${whoisData.updatedDate}
Status: ${whoisData.status.join(', ')}
Name Servers: ${whoisData.nameServers.join(', ')}`;
      navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "WHOIS data copied to clipboard."
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
              WHOIS Lookup
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get domain registration and ownership information. Check expiration dates, registrar details, and contact information.
            </p>
          </div>
          
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Domain Lookup</CardTitle>
                <CardDescription>Enter a domain name to retrieve WHOIS information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Domain Name</Label>
                  <div className="flex gap-3">
                    <Input
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="example.com"
                      className="flex-1"
                    />
                    <Button onClick={lookupDomain} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Looking up...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Lookup
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {whoisData && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>WHOIS Information</CardTitle>
                    <CardDescription>Domain registration details for {whoisData.domainName}</CardDescription>
                  </div>
                  <Button variant="outline" onClick={copyWhoisData}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Data
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Domain Information</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Domain:</span> {whoisData.domainName}</div>
                          <div><span className="font-medium">Registrar:</span> {whoisData.registrar}</div>
                          <div><span className="font-medium">Created:</span> {new Date(whoisData.creationDate).toLocaleDateString()}</div>
                          <div><span className="font-medium">Expires:</span> {new Date(whoisData.expirationDate).toLocaleDateString()}</div>
                          <div><span className="font-medium">Updated:</span> {new Date(whoisData.updatedDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                        <div className="space-y-1">
                          {whoisData.status.map((status: string, index: number) => (
                            <div key={index} className="text-sm bg-gray-100 px-2 py-1 rounded inline-block mr-1">
                              {status}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Name Servers</h4>
                        <div className="space-y-1">
                          {whoisData.nameServers.map((ns: string, index: number) => (
                            <div key={index} className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                              {ns}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Contacts</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <div className="font-medium">Registrant:</div>
                            <div>{whoisData.registrant.name}</div>
                            <div>{whoisData.registrant.organization}</div>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default WhoisLookup;
