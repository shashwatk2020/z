
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Globe, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TimeZoneConverter = () => {
  const [inputTime, setInputTime] = useState('12:00');
  const [inputDate, setInputDate] = useState(new Date().toISOString().split('T')[0]);
  const [fromTimeZone, setFromTimeZone] = useState('UTC');
  const [toTimeZone, setToTimeZone] = useState('America/New_York');
  const [convertedTime, setConvertedTime] = useState<string | null>(null);
  const [currentTimes, setCurrentTimes] = useState<{ [key: string]: string }>({});
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const timeZones = [
    // Major zones
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: '+0' },
    { value: 'GMT', label: 'GMT (Greenwich Mean Time)', offset: '+0' },
    
    // Americas
    { value: 'America/New_York', label: 'Eastern Time (New York)', offset: '-5/-4' },
    { value: 'America/Chicago', label: 'Central Time (Chicago)', offset: '-6/-5' },
    { value: 'America/Denver', label: 'Mountain Time (Denver)', offset: '-7/-6' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)', offset: '-8/-7' },
    { value: 'America/Anchorage', label: 'Alaska Time (Anchorage)', offset: '-9/-8' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (Honolulu)', offset: '-10' },
    { value: 'America/Toronto', label: 'Eastern Time (Toronto)', offset: '-5/-4' },
    { value: 'America/Vancouver', label: 'Pacific Time (Vancouver)', offset: '-8/-7' },
    { value: 'America/Mexico_City', label: 'Central Time (Mexico City)', offset: '-6/-5' },
    { value: 'America/Sao_Paulo', label: 'Brasília Time (São Paulo)', offset: '-3' },
    { value: 'America/Buenos_Aires', label: 'Argentina Time (Buenos Aires)', offset: '-3' },
    
    // Europe
    { value: 'Europe/London', label: 'British Time (London)', offset: '+0/+1' },
    { value: 'Europe/Paris', label: 'Central European Time (Paris)', offset: '+1/+2' },
    { value: 'Europe/Berlin', label: 'Central European Time (Berlin)', offset: '+1/+2' },
    { value: 'Europe/Rome', label: 'Central European Time (Rome)', offset: '+1/+2' },
    { value: 'Europe/Madrid', label: 'Central European Time (Madrid)', offset: '+1/+2' },
    { value: 'Europe/Amsterdam', label: 'Central European Time (Amsterdam)', offset: '+1/+2' },
    { value: 'Europe/Zurich', label: 'Central European Time (Zurich)', offset: '+1/+2' },
    { value: 'Europe/Vienna', label: 'Central European Time (Vienna)', offset: '+1/+2' },
    { value: 'Europe/Stockholm', label: 'Central European Time (Stockholm)', offset: '+1/+2' },
    { value: 'Europe/Moscow', label: 'Moscow Time (Moscow)', offset: '+3' },
    { value: 'Europe/Athens', label: 'Eastern European Time (Athens)', offset: '+2/+3' },
    
    // Asia
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (Tokyo)', offset: '+9' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (Shanghai)', offset: '+8' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong Time (Hong Kong)', offset: '+8' },
    { value: 'Asia/Singapore', label: 'Singapore Time (Singapore)', offset: '+8' },
    { value: 'Asia/Seoul', label: 'Korea Standard Time (Seoul)', offset: '+9' },
    { value: 'Asia/Mumbai', label: 'India Standard Time (Mumbai)', offset: '+5:30' },
    { value: 'Asia/Kolkata', label: 'India Standard Time (Kolkata)', offset: '+5:30' },
    { value: 'Asia/Dubai', label: 'Gulf Standard Time (Dubai)', offset: '+4' },
    { value: 'Asia/Bangkok', label: 'Indochina Time (Bangkok)', offset: '+7' },
    { value: 'Asia/Manila', label: 'Philippine Time (Manila)', offset: '+8' },
    { value: 'Asia/Jakarta', label: 'Western Indonesia Time (Jakarta)', offset: '+7' },
    
    // Oceania
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (Sydney)', offset: '+10/+11' },
    { value: 'Australia/Melbourne', label: 'Australian Eastern Time (Melbourne)', offset: '+10/+11' },
    { value: 'Australia/Perth', label: 'Australian Western Time (Perth)', offset: '+8' },
    { value: 'Pacific/Auckland', label: 'New Zealand Time (Auckland)', offset: '+12/+13' },
    
    // Africa
    { value: 'Africa/Cairo', label: 'Eastern European Time (Cairo)', offset: '+2' },
    { value: 'Africa/Lagos', label: 'West Africa Time (Lagos)', offset: '+1' },
    { value: 'Africa/Johannesburg', label: 'South Africa Time (Johannesburg)', offset: '+2' }
  ];

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const convertTime = () => {
    try {
      const dateTimeString = `${inputDate}T${inputTime}:00`;
      const inputDateTime = new Date(dateTimeString);
      
      // Create a formatter for the source timezone
      const sourceFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: fromTimeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      // Create a formatter for the target timezone
      const targetFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: toTimeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      // Get the time offset difference
      const sourceTime = new Date(dateTimeString);
      const targetTime = new Date(sourceTime.toLocaleString('en-US', { timeZone: toTimeZone }));
      
      const converted = targetFormatter.format(sourceTime);
      setConvertedTime(converted);

      const sourceZoneName = timeZones.find(tz => tz.value === fromTimeZone)?.label || fromTimeZone;
      const targetZoneName = timeZones.find(tz => tz.value === toTimeZone)?.label || toTimeZone;

      addToHistory(`${inputTime} ${sourceZoneName} → ${converted} ${targetZoneName}`);
      
      toast({
        title: "Time Converted",
        description: `${inputTime} in ${fromTimeZone} is ${converted} in ${toTimeZone}`
      });
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: "Please check your input time and date",
        variant: "destructive"
      });
    }
  };

  const updateCurrentTimes = () => {
    const majorZones = [
      'UTC',
      'America/New_York',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Paris',
      'Asia/Tokyo',
      'Australia/Sydney'
    ];

    const times: { [key: string]: string } = {};
    const now = new Date();

    majorZones.forEach(zone => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      times[zone] = formatter.format(now);
    });

    setCurrentTimes(times);
  };

  useEffect(() => {
    updateCurrentTimes();
    const interval = setInterval(updateCurrentTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const popularConversions = [
    { from: 'America/New_York', to: 'Europe/London', label: 'NYC → London' },
    { from: 'America/Los_Angeles', to: 'Asia/Tokyo', label: 'LA → Tokyo' },
    { from: 'UTC', to: 'America/New_York', label: 'UTC → EST' },
    { from: 'Europe/Paris', to: 'America/New_York', label: 'Paris → NYC' },
    { from: 'Asia/Singapore', to: 'America/Los_Angeles', label: 'Singapore → LA' },
    { from: 'Australia/Sydney', to: 'Europe/London', label: 'Sydney → London' }
  ];

  const quickConvert = (from: string, to: string) => {
    setFromTimeZone(from);
    setToTimeZone(to);
    
    setTimeout(() => convertTime(), 100);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Time Zone Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Convert time between different time zones around the world with daylight saving time support.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-6 w-6" />
                  Time Zone Converter
                </CardTitle>
                <CardDescription>Convert time between different zones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={inputTime}
                      onChange={(e) => setInputTime(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={inputDate}
                      onChange={(e) => setInputDate(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>From Time Zone</Label>
                    <Select value={fromTimeZone} onValueChange={setFromTimeZone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {timeZones.map(tz => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>To Time Zone</Label>
                    <Select value={toTimeZone} onValueChange={setToTimeZone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {timeZones.map(tz => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={convertTime} className="w-full" size="lg">
                  Convert Time
                </Button>

                {convertedTime && (
                  <div className="bg-blue-50 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {convertedTime}
                    </div>
                    <div className="text-gray-600">
                      {inputTime} in {timeZones.find(tz => tz.value === fromTimeZone)?.label}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      converts to {convertedTime} in {timeZones.find(tz => tz.value === toTimeZone)?.label}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-lg font-semibold mb-4 block">Popular Conversions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {popularConversions.map((conversion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => quickConvert(conversion.from, conversion.to)}
                        className="text-sm p-2 h-auto"
                      >
                        {conversion.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Time Zone Tips:</h4>
                  <div className="text-sm space-y-1">
                    <div>• Times automatically adjust for daylight saving time</div>
                    <div>• UTC is the standard reference time</div>
                    <div>• Some zones have half-hour or quarter-hour offsets</div>
                    <div>• Business hours overlap varies by season</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Conversion History
                </CardTitle>
                <CardDescription>Recent time conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No conversions yet</p>
                  ) : (
                    history.slice().reverse().map((calc, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm break-all">
                        {calc}
                      </div>
                    ))
                  )}
                </div>
                {history.length > 0 && (
                  <Button 
                    onClick={() => setHistory([])} 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                  >
                    Clear History
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Current Times
                </CardTitle>
                <CardDescription>Live times in major cities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {Object.entries(currentTimes).map(([zone, time]) => (
                    <div key={zone} className="flex justify-between">
                      <span className="font-medium">
                        {zone.split('/').pop()?.replace('_', ' ') || zone}:
                      </span>
                      <span className="font-mono">{time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Time Zone Facts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Total Time Zones:</strong> ~24 main zones</div>
                  <div><strong>Largest Gap:</strong> 26 hours (some islands)</div>
                  <div><strong>China:</strong> Uses only 1 time zone</div>
                  <div><strong>India:</strong> UTC+5:30 (half hour offset)</div>
                  <div><strong>DST:</strong> Varies by country and region</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TimeZoneConverter;
