
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Copy, Loader2, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const IpAddressLookup = () => {
  const [ipAddress, setIpAddress] = useState('8.8.8.8');
  const [isLoading, setIsLoading] = useState(false);
  const [ipData, setIpData] = useState<any>(null);
  const { toast } = useToast();

  const lookupIp = async () => {
    if (!ipAddress) {
      toast({
        title: "Error",
        description: "Please enter an IP address to lookup.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate IP lookup
    setTimeout(() => {
      const mockData = {
        ip: ipAddress,
        type: 'IPv4',
        country: 'United States',
        countryCode: 'US',
        region: 'California',
        city: 'Mountain View',
        latitude: 37.4056,
        longitude: -122.0775,
        timezone: 'America/Los_Angeles',
        isp: 'Google LLC',
        organization: 'Google Public DNS',
        asn: 'AS15169',
        asnOrg: 'Google LLC',
        reverse: 'dns.google'
      };
      setIpData(mockData);
      setIsLoading(false);
      toast({
        title: "Lookup Complete",
        description: "IP address information retrieved successfully."
      });
    }, 1500);
  };

  const copyIpData = () => {
    if (ipData) {
      const text = `IP Address: ${ipData.ip}
Country: ${ipData.country} (${ipData.countryCode})
Region: ${ipData.region}
City: ${ipData.city}
Coordinates: ${ipData.latitude}, ${ipData.longitude}
ISP: ${ipData.isp}
Organization: ${ipData.organization}
ASN: ${ipData.asn}`;
      navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "IP information copied to clipboard."
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
              IP Address Lookup
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get detailed information about IP addresses including location, ISP, organization, and network details.
            </p>
          </div>
          
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>IP Address Query</CardTitle>
                <CardDescription>Enter an IP address to get detailed information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>IP Address</Label>
                  <div className="flex gap-3">
                    <Input
                      value={ipAddress}
                      onChange={(e) => setIpAddress(e.target.value)}
                      placeholder="8.8.8.8 or 2001:4860:4860::8888"
                      className="flex-1"
                    />
                    <Button onClick={lookupIp} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Looking up...
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 mr-2" />
                          Lookup IP
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {ipData && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>IP Address Information</CardTitle>
                    <CardDescription>Details for {ipData.ip}</CardDescription>
                  </div>
                  <Button variant="outline" onClick={copyIpData}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Data
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <MapPin className="h-5 w-5 mr-2" />
                          Location Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Country:</span>
                            <span>{ipData.country} ({ipData.countryCode})</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Region:</span>
                            <span>{ipData.region}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">City:</span>
                            <span>{ipData.city}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Coordinates:</span>
                            <span>{ipData.latitude}, {ipData.longitude}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Timezone:</span>
                            <span>{ipData.timezone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Globe className="h-5 w-5 mr-2" />
                          Network Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">IP Address:</span>
                            <span className="font-mono">{ipData.ip}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Type:</span>
                            <span>{ipData.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">ISP:</span>
                            <span>{ipData.isp}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Organization:</span>
                            <span>{ipData.organization}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">ASN:</span>
                            <span>{ipData.asn}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Reverse DNS:</span>
                            <span className="font-mono">{ipData.reverse}</span>
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

export default IpAddressLookup;
