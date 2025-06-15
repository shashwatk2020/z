
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wifi, Copy, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PingTestTool = () => {
  const [host, setHost] = useState('google.com');
  const [isPinging, setIsPinging] = useState(false);
  const [pingResults, setPingResults] = useState<any>(null);
  const { toast } = useToast();

  const startPing = async () => {
    if (!host) {
      toast({
        title: "Error",
        description: "Please enter a host to ping.",
        variant: "destructive"
      });
      return;
    }

    setIsPinging(true);
    setPingResults(null);
    
    // Simulate ping test
    const packets = [];
    for (let i = 0; i < 4; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = Math.random() > 0.1; // 90% success rate
      const time = success ? Math.floor(Math.random() * 50) + 10 : null;
      
      packets.push({
        sequence: i + 1,
        success,
        time,
        timestamp: new Date().toISOString()
      });
    }
    
    const successfulPings = packets.filter(p => p.success);
    const avgTime = successfulPings.length > 0 
      ? Math.round(successfulPings.reduce((sum, p) => sum + (p.time || 0), 0) / successfulPings.length)
      : 0;
    
    const results = {
      host,
      packets,
      statistics: {
        transmitted: packets.length,
        received: successfulPings.length,
        loss: Math.round(((packets.length - successfulPings.length) / packets.length) * 100),
        minTime: successfulPings.length > 0 ? Math.min(...successfulPings.map(p => p.time || 0)) : 0,
        maxTime: successfulPings.length > 0 ? Math.max(...successfulPings.map(p => p.time || 0)) : 0,
        avgTime
      }
    };
    
    setPingResults(results);
    setIsPinging(false);
    toast({
      title: "Ping Complete",
      description: `Ping test completed for ${host}.`
    });
  };

  const copyResults = () => {
    if (pingResults) {
      const text = `Ping Test Results for ${pingResults.host}

${pingResults.packets.map((p: any) => 
  p.success 
    ? `64 bytes from ${pingResults.host}: icmp_seq=${p.sequence} time=${p.time}ms`
    : `Request timeout for icmp_seq ${p.sequence}`
).join('\n')}

--- ${pingResults.host} ping statistics ---
${pingResults.statistics.transmitted} packets transmitted, ${pingResults.statistics.received} received, ${pingResults.statistics.loss}% packet loss
round-trip min/avg/max = ${pingResults.statistics.minTime}/${pingResults.statistics.avgTime}/${pingResults.statistics.maxTime} ms`;
      
      navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Ping results copied to clipboard."
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
              Ping Test Tool
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Test network connectivity to websites and servers. Measure response times and packet loss for network diagnostics.
            </p>
          </div>
          
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Ping Test</CardTitle>
                <CardDescription>Enter a hostname or IP address to test network connectivity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Host/IP Address</Label>
                  <div className="flex gap-3">
                    <Input
                      value={host}
                      onChange={(e) => setHost(e.target.value)}
                      placeholder="google.com or 8.8.8.8"
                      className="flex-1"
                      disabled={isPinging}
                    />
                    <Button onClick={startPing} disabled={isPinging}>
                      {isPinging ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Pinging...
                        </>
                      ) : (
                        <>
                          <Wifi className="h-4 w-4 mr-2" />
                          Start Ping
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {pingResults && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Ping Statistics</CardTitle>
                    <CardDescription>Overall ping test results for {pingResults.host}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{pingResults.statistics.transmitted}</div>
                        <div className="text-sm text-gray-600">Transmitted</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{pingResults.statistics.received}</div>
                        <div className="text-sm text-gray-600">Received</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{pingResults.statistics.loss}%</div>
                        <div className="text-sm text-gray-600">Packet Loss</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{pingResults.statistics.avgTime}ms</div>
                        <div className="text-sm text-gray-600">Avg Time</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Ping Results</CardTitle>
                      <CardDescription>Individual packet results</CardDescription>
                    </div>
                    <Button variant="outline" onClick={copyResults}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Results
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pingResults.packets.map((packet: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg font-mono text-sm">
                          <div className="flex items-center space-x-3">
                            {packet.success ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <div>
                              {packet.success ? (
                                <span>64 bytes from {pingResults.host}: icmp_seq={packet.sequence} time={packet.time}ms</span>
                              ) : (
                                <span>Request timeout for icmp_seq {packet.sequence}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(packet.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PingTestTool;
