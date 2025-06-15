
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Copy, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DnsLookupTool = () => {
  const [domain, setDomain] = useState('example.com');
  const [recordType, setRecordType] = useState('A');
  const [isLoading, setIsLoading] = useState(false);
  const [dnsRecords, setDnsRecords] = useState<any>(null);
  const { toast } = useToast();

  const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA', 'PTR'];

  const lookupDns = async () => {
    if (!domain) {
      toast({
        title: "Error",
        description: "Please enter a domain name to lookup.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate DNS lookup
    setTimeout(() => {
      const mockRecords = {
        A: [
          { type: 'A', name: domain, value: '93.184.216.34', ttl: 3600 },
          { type: 'A', name: domain, value: '93.184.216.35', ttl: 3600 }
        ],
        AAAA: [
          { type: 'AAAA', name: domain, value: '2606:2800:220:1:248:1893:25c8:1946', ttl: 3600 }
        ],
        CNAME: [
          { type: 'CNAME', name: `www.${domain}`, value: domain, ttl: 3600 }
        ],
        MX: [
          { type: 'MX', name: domain, value: 'mail.example.com', priority: 10, ttl: 3600 },
          { type: 'MX', name: domain, value: 'mail2.example.com', priority: 20, ttl: 3600 }
        ],
        NS: [
          { type: 'NS', name: domain, value: 'ns1.example.com', ttl: 3600 },
          { type: 'NS', name: domain, value: 'ns2.example.com', ttl: 3600 }
        ],
        TXT: [
          { type: 'TXT', name: domain, value: 'v=spf1 include:_spf.example.com ~all', ttl: 3600 },
          { type: 'TXT', name: domain, value: 'google-site-verification=abcd1234', ttl: 3600 }
        ]
      };
      
      setDnsRecords(mockRecords[recordType as keyof typeof mockRecords] || []);
      setIsLoading(false);
      toast({
        title: "Lookup Complete",
        description: `${recordType} records retrieved successfully.`
      });
    }, 1500);
  };

  const copyRecords = () => {
    if (dnsRecords) {
      const text = dnsRecords.map((record: any) => 
        `${record.name} ${record.ttl} IN ${record.type} ${record.priority ? record.priority + ' ' : ''}${record.value}`
      ).join('\n');
      navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "DNS records copied to clipboard."
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
              DNS Lookup Tool
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Query DNS records for any domain name. Check A, AAAA, CNAME, MX, NS, TXT, and other DNS record types.
            </p>
          </div>
          
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>DNS Query</CardTitle>
                <CardDescription>Enter a domain name and select the record type to query</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Domain Name</Label>
                    <Input
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Record Type</Label>
                    <Select value={recordType} onValueChange={setRecordType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {recordTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Button onClick={lookupDns} disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Querying...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Lookup DNS
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {dnsRecords && dnsRecords.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>DNS Records</CardTitle>
                    <CardDescription>{recordType} records for {domain}</CardDescription>
                  </div>
                  <Button variant="outline" onClick={copyRecords}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Records
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dnsRecords.map((record: any, index: number) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg font-mono text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                          <div className="font-medium text-blue-600">{record.name}</div>
                          <div className="text-gray-600">{record.ttl}s</div>
                          <div className="font-medium">{record.type}</div>
                          <div className="break-all">
                            {record.priority && <span className="text-orange-600">{record.priority} </span>}
                            {record.value}
                          </div>
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

export default DnsLookupTool;
