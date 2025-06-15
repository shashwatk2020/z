
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Copy, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PortScanner = () => {
  const [host, setHost] = useState('example.com');
  const [scanType, setScanType] = useState('common');
  const [customPorts, setCustomPorts] = useState('80,443,22,21,25');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const { toast } = useToast();

  const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3389, 5432, 3306];

  const scanPorts = async () => {
    if (!host) {
      toast({
        title: "Error",
        description: "Please enter a host to scan.",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    
    // Simulate port scan
    setTimeout(() => {
      const portsToScan = scanType === 'common' 
        ? commonPorts 
        : customPorts.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
      
      const mockResults = portsToScan.map(port => ({
        port,
        status: Math.random() > 0.7 ? 'open' : 'closed',
        service: getServiceName(port)
      }));

      setScanResults({
        host,
        timestamp: new Date().toISOString(),
        ports: mockResults
      });
      setIsScanning(false);
      toast({
        title: "Scan Complete",
        description: `Port scan completed for ${host}.`
      });
    }, 3000);
  };

  const getServiceName = (port: number): string => {
    const services: { [key: number]: string } = {
      21: 'FTP',
      22: 'SSH',
      23: 'Telnet',
      25: 'SMTP',
      53: 'DNS',
      80: 'HTTP',
      110: 'POP3',
      143: 'IMAP',
      443: 'HTTPS',
      993: 'IMAPS',
      995: 'POP3S',
      3389: 'RDP',
      5432: 'PostgreSQL',
      3306: 'MySQL'
    };
    return services[port] || 'Unknown';
  };

  const copyResults = () => {
    if (scanResults) {
      const text = `Port Scan Results for ${scanResults.host}
Timestamp: ${new Date(scanResults.timestamp).toLocaleString()}

${scanResults.ports.map((p: any) => 
  `Port ${p.port} (${p.service}): ${p.status.toUpperCase()}`
).join('\n')}`;
      navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Scan results copied to clipboard."
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
              Port Scanner
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Check open ports on servers and websites. Scan common ports or specify custom port ranges for network analysis.
            </p>
          </div>
          
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Port Scan Configuration</CardTitle>
                <CardDescription>Configure your port scan settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Host/IP Address</Label>
                    <Input
                      value={host}
                      onChange={(e) => setHost(e.target.value)}
                      placeholder="example.com or 192.168.1.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Scan Type</Label>
                    <Select value={scanType} onValueChange={setScanType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="common">Common Ports</SelectItem>
                        <SelectItem value="custom">Custom Ports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {scanType === 'custom' && (
                  <div className="space-y-2">
                    <Label>Custom Ports (comma-separated)</Label>
                    <Input
                      value={customPorts}
                      onChange={(e) => setCustomPorts(e.target.value)}
                      placeholder="80,443,22,21,25"
                    />
                  </div>
                )}

                <Button onClick={scanPorts} disabled={isScanning} className="w-full">
                  {isScanning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Scanning Ports...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Start Port Scan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {scanResults && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Scan Results</CardTitle>
                    <CardDescription>
                      Port scan for {scanResults.host} completed at {new Date(scanResults.timestamp).toLocaleString()}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={copyResults}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Results
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scanResults.ports.map((port: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {port.status === 'open' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <div>
                            <div className="font-medium">Port {port.port}</div>
                            <div className="text-sm text-gray-600">{port.service}</div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded text-sm font-medium ${
                          port.status === 'open' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {port.status.toUpperCase()}
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

export default PortScanner;
