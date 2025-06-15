
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Monitor, Play, Pause, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WebsiteUptimeMonitor = () => {
  const [url, setUrl] = useState('https://example.com');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [uptimeData, setUptimeData] = useState<any>(null);
  const { toast } = useToast();

  const startMonitoring = () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid URL to monitor.",
        variant: "destructive"
      });
      return;
    }

    setIsMonitoring(true);
    
    // Simulate uptime monitoring data
    const mockData = {
      url,
      status: 'online',
      uptime: 99.87,
      responseTime: 245,
      lastCheck: new Date().toISOString(),
      checks: [
        { timestamp: new Date(Date.now() - 60000).toISOString(), status: 'online', responseTime: 240 },
        { timestamp: new Date(Date.now() - 120000).toISOString(), status: 'online', responseTime: 250 },
        { timestamp: new Date(Date.now() - 180000).toISOString(), status: 'online', responseTime: 235 },
        { timestamp: new Date(Date.now() - 240000).toISOString(), status: 'offline', responseTime: null },
        { timestamp: new Date(Date.now() - 300000).toISOString(), status: 'online', responseTime: 260 }
      ]
    };
    
    setUptimeData(mockData);
    toast({
      title: "Monitoring Started",
      description: `Now monitoring ${url} for uptime.`
    });
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    toast({
      title: "Monitoring Stopped",
      description: "Uptime monitoring has been stopped."
    });
  };

  const getStatusIcon = (status: string) => {
    return status === 'online' ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Website Uptime Monitor
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Monitor website availability and uptime. Track response times and get notified when your site goes down.
            </p>
          </div>
          
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Uptime Monitoring</CardTitle>
                <CardDescription>Enter a website URL to start monitoring its uptime</CardDescription>
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
                      disabled={isMonitoring}
                    />
                    {!isMonitoring ? (
                      <Button onClick={startMonitoring}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Monitoring
                      </Button>
                    ) : (
                      <Button onClick={stopMonitoring} variant="destructive">
                        <Pause className="h-4 w-4 mr-2" />
                        Stop Monitoring
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {uptimeData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(uptimeData.status)}
                        <div>
                          <div className="text-2xl font-bold">
                            {uptimeData.status === 'online' ? 'Online' : 'Offline'}
                          </div>
                          <div className="text-sm text-gray-600">Current Status</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="text-2xl font-bold">{uptimeData.uptime}%</div>
                          <div className="text-sm text-gray-600">Uptime</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-purple-500" />
                        <div>
                          <div className="text-2xl font-bold">{uptimeData.responseTime}ms</div>
                          <div className="text-sm text-gray-600">Response Time</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Checks</CardTitle>
                    <CardDescription>
                      Last checked: {new Date(uptimeData.lastCheck).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {uptimeData.checks.map((check: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(check.status)}
                            <div>
                              <div className="font-medium">
                                {new Date(check.timestamp).toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">
                                {check.responseTime ? `${check.responseTime}ms` : 'No response'}
                              </div>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded text-sm font-medium ${
                            check.status === 'online' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {check.status.toUpperCase()}
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

export default WebsiteUptimeMonitor;
