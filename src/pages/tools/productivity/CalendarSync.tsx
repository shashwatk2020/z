import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar, ArrowLeft, RotateCw, Check, X, AlertCircle, ExternalLink, Download, Upload } from 'lucide-react';

interface CalendarSource {
  id: string;
  name: string;
  type: 'google' | 'outlook' | 'apple' | 'ical' | 'csv';
  url?: string;
  connected: boolean;
  lastSync?: string;
  eventCount: number;
  syncEnabled: boolean;
  color: string;
}

interface SyncRule {
  id: string;
  name: string;
  sourceCalendar: string;
  targetCalendar: string;
  syncDirection: 'one-way' | 'two-way';
  eventFilter: string;
  enabled: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
  location: string;
  source: string;
  synced: boolean;
}

const CalendarSync = () => {
  const [calendars, setCalendars] = useState<CalendarSource[]>([
    {
      id: 'google-1',
      name: 'Google Calendar - Personal',
      type: 'google',
      connected: true,
      lastSync: '2024-01-15T10:30:00Z',
      eventCount: 45,
      syncEnabled: true,
      color: 'blue'
    },
    {
      id: 'outlook-1',
      name: 'Outlook - Work',
      type: 'outlook',
      connected: true,
      lastSync: '2024-01-15T10:25:00Z',
      eventCount: 23,
      syncEnabled: true,
      color: 'orange'
    }
  ]);

  const [syncRules, setSyncRules] = useState<SyncRule[]>([
    {
      id: 'rule-1',
      name: 'Work to Personal',
      sourceCalendar: 'outlook-1',
      targetCalendar: 'google-1',
      syncDirection: 'one-way',
      eventFilter: 'meeting',
      enabled: true
    }
  ]);

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'event-1',
      title: 'Team Meeting',
      start: '2024-01-16T09:00:00Z',
      end: '2024-01-16T10:00:00Z',
      description: 'Weekly team standup',
      location: 'Conference Room A',
      source: 'outlook-1',
      synced: true
    },
    {
      id: 'event-2',
      title: 'Doctor Appointment',
      start: '2024-01-16T14:00:00Z',
      end: '2024-01-16T15:00:00Z',
      description: 'Annual checkup',
      location: 'Medical Center',
      source: 'google-1',
      synced: false
    }
  ]);

  const [newCalendar, setNewCalendar] = useState({
    name: '',
    type: 'google' as const,
    url: ''
  });

  const [newRule, setNewRule] = useState({
    name: '',
    sourceCalendar: '',
    targetCalendar: '',
    syncDirection: 'one-way' as const,
    eventFilter: '',
    enabled: true
  });

  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState('');

  const addCalendar = () => {
    if (!newCalendar.name) return;

    const calendar: CalendarSource = {
      id: Date.now().toString(),
      name: newCalendar.name,
      type: newCalendar.type,
      url: newCalendar.url || undefined,
      connected: false,
      eventCount: 0,
      syncEnabled: false,
      color: ['blue', 'green', 'purple', 'orange', 'red'][Math.floor(Math.random() * 5)]
    };

    setCalendars([...calendars, calendar]);
    setNewCalendar({ name: '', type: 'google', url: '' });
  };

  const toggleCalendarConnection = (calendarId: string) => {
    setCalendars(calendars.map(cal => 
      cal.id === calendarId 
        ? { ...cal, connected: !cal.connected, lastSync: cal.connected ? undefined : new Date().toISOString() }
        : cal
    ));
  };

  const toggleCalendarSync = (calendarId: string) => {
    setCalendars(calendars.map(cal => 
      cal.id === calendarId ? { ...cal, syncEnabled: !cal.syncEnabled } : cal
    ));
  };

  const addSyncRule = () => {
    if (!newRule.name || !newRule.sourceCalendar || !newRule.targetCalendar) return;

    const rule: SyncRule = {
      id: Date.now().toString(),
      ...newRule
    };

    setSyncRules([...syncRules, rule]);
    setNewRule({
      name: '',
      sourceCalendar: '',
      targetCalendar: '',
      syncDirection: 'one-way',
      eventFilter: '',
      enabled: true
    });
  };

  const toggleRuleEnabled = (ruleId: string) => {
    setSyncRules(syncRules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const performSync = () => {
    // Simulate sync process
    setCalendars(calendars.map(cal => ({
      ...cal,
      lastSync: cal.connected ? new Date().toISOString() : cal.lastSync
    })));
    
    // Update event sync status
    setEvents(events.map(event => ({ ...event, synced: true })));
  };

  const exportCalendar = (format: 'ical' | 'csv') => {
    let content = '';
    
    if (format === 'ical') {
      content = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Calendar Sync Tool//EN
`;
      events.forEach(event => {
        content += `BEGIN:VEVENT
UID:${event.id}
DTSTART:${event.start.replace(/[-:]/g, '').replace(/\.\d{3}/, '')}
DTEND:${event.end.replace(/[-:]/g, '').replace(/\.\d{3}/, '')}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
`;
      });
      content += 'END:VCALENDAR';
    } else {
      content = 'Title,Start Date,End Date,Description,Location\n';
      events.forEach(event => {
        content += `"${event.title}","${event.start}","${event.end}","${event.description}","${event.location}"\n`;
      });
    }
    
    const blob = new Blob([content], { type: format === 'ical' ? 'text/calendar' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendar.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importCalendar = () => {
    if (!importData.trim()) return;
    
    setIsImporting(true);
    
    // Simulate import process
    setTimeout(() => {
      const lines = importData.trim().split('\n');
      const newEvents: CalendarEvent[] = [];
      
      if (lines[0].includes('Title,Start Date')) {
        // CSV format
        lines.slice(1).forEach((line, index) => {
          const [title, start, end, description, location] = line.split(',').map(s => s.replace(/"/g, ''));
          if (title) {
            newEvents.push({
              id: `imported-${Date.now()}-${index}`,
              title,
              start,
              end,
              description: description || '',
              location: location || '',
              source: 'imported',
              synced: false
            });
          }
        });
      }
      
      setEvents([...events, ...newEvents]);
      setImportData('');
      setIsImporting(false);
    }, 2000);
  };

  const getCalendarName = (calendarId: string) => {
    const calendar = calendars.find(cal => cal.id === calendarId);
    return calendar ? calendar.name : 'Unknown Calendar';
  };

  const getStatusIcon = (connected: boolean, syncEnabled: boolean) => {
    if (connected && syncEnabled) return <Check className="h-4 w-4 text-green-600" />;
    if (connected) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return <X className="h-4 w-4 text-red-600" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'google': return 'bg-blue-100 text-blue-800';
      case 'outlook': return 'bg-orange-100 text-orange-800';
      case 'apple': return 'bg-gray-100 text-gray-800';
      case 'ical': return 'bg-green-100 text-green-800';
      case 'csv': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link to="/tools/productivity" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Productivity Tools
              </Link>
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Calendar Sync Tool</h1>
                  <p className="text-gray-600">Synchronize calendars from multiple platforms</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                {/* Connected Calendars */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Connected Calendars</CardTitle>
                    <Button onClick={performSync} className="flex items-center">
                      <RotateCw className="h-4 w-4 mr-2" />
                      Sync All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {calendars.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No calendars connected. Add your first calendar!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {calendars.map((calendar) => (
                          <div key={calendar.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {getStatusIcon(calendar.connected, calendar.syncEnabled)}
                                <div>
                                  <h3 className="font-semibold text-gray-900">{calendar.name}</h3>
                                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(calendar.type)}`}>
                                      {calendar.type.toUpperCase()}
                                    </span>
                                    <span>{calendar.eventCount} events</span>
                                    {calendar.lastSync && (
                                      <span>• Last sync: {new Date(calendar.lastSync).toLocaleString()}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <Label htmlFor={`sync-${calendar.id}`} className="text-sm">Sync</Label>
                                  <Switch
                                    id={`sync-${calendar.id}`}
                                    checked={calendar.syncEnabled}
                                    onCheckedChange={() => toggleCalendarSync(calendar.id)}
                                    disabled={!calendar.connected}
                                  />
                                </div>
                                <Button
                                  variant={calendar.connected ? "destructive" : "default"}
                                  size="sm"
                                  onClick={() => toggleCalendarConnection(calendar.id)}
                                >
                                  {calendar.connected ? 'Disconnect' : 'Connect'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Sync Rules */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sync Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {syncRules.length === 0 ? (
                      <div className="text-center py-8">
                        <RotateCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No sync rules configured. Create your first rule!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {syncRules.map((rule) => (
                          <div key={rule.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                                <div className="text-sm text-gray-600">
                                  {getCalendarName(rule.sourceCalendar)} → {getCalendarName(rule.targetCalendar)}
                                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    {rule.syncDirection}
                                  </span>
                                  {rule.eventFilter && (
                                    <span className="ml-2 text-xs text-gray-500">
                                      Filter: {rule.eventFilter}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={rule.enabled}
                                  onCheckedChange={() => toggleRuleEnabled(rule.id)}
                                />
                                <span className="text-sm text-gray-600">
                                  {rule.enabled ? 'Enabled' : 'Disabled'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Events */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {events.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No events found</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {events.slice(0, 10).map((event) => (
                          <div key={event.id} className="border-l-4 border-blue-500 bg-gray-50 p-3 rounded-r-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{event.title}</h4>
                                <div className="text-sm text-gray-600">
                                  {new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}
                                </div>
                                {event.description && (
                                  <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                                )}
                                {event.location && (
                                  <p className="text-sm text-gray-500">📍 {event.location}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-500">{event.source}</div>
                                <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                                  event.synced ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {event.synced ? 'Synced' : 'Pending'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Import/Export */}
                <Card>
                  <CardHeader>
                    <CardTitle>Import & Export</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Export Calendar</h3>
                        <div className="space-y-2">
                          <Button variant="outline" onClick={() => exportCalendar('ical')} className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Export as iCal
                          </Button>
                          <Button variant="outline" onClick={() => exportCalendar('csv')} className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Export as CSV
                          </Button>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Import Calendar</h3>
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Paste CSV data or iCal content here..."
                            value={importData}
                            onChange={(e) => setImportData(e.target.value)}
                            rows={4}
                          />
                          <Button 
                            onClick={importCalendar} 
                            disabled={!importData.trim() || isImporting}
                            className="w-full"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {isImporting ? 'Importing...' : 'Import Calendar'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Add Calendar */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add Calendar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="calendar-name">Calendar Name</Label>
                      <Input
                        id="calendar-name"
                        value={newCalendar.name}
                        onChange={(e) => setNewCalendar({...newCalendar, name: e.target.value})}
                        placeholder="My Calendar"
                      />
                    </div>
                    <div>
                      <Label htmlFor="calendar-type">Calendar Type</Label>
                      <Select
                        value={newCalendar.type}
                        onValueChange={(value) => setNewCalendar({...newCalendar, type: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google">Google Calendar</SelectItem>
                          <SelectItem value="outlook">Microsoft Outlook</SelectItem>
                          <SelectItem value="apple">Apple Calendar</SelectItem>
                          <SelectItem value="ical">iCal URL</SelectItem>
                          <SelectItem value="csv">CSV Import</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {(newCalendar.type === 'ical' || newCalendar.type === 'csv') && (
                      <div>
                        <Label htmlFor="calendar-url">URL or File Path</Label>
                        <Input
                          id="calendar-url"
                          value={newCalendar.url}
                          onChange={(e) => setNewCalendar({...newCalendar, url: e.target.value})}
                          placeholder="https://calendar.google.com/..."
                        />
                      </div>
                    )}
                    <Button onClick={addCalendar} className="w-full" disabled={!newCalendar.name}>
                      Add Calendar
                    </Button>
                  </CardContent>
                </Card>

                {/* Add Sync Rule */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add Sync Rule</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="rule-name">Rule Name</Label>
                      <Input
                        id="rule-name"
                        value={newRule.name}
                        onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                        placeholder="Work to Personal"
                      />
                    </div>
                    <div>
                      <Label htmlFor="source-calendar">Source Calendar</Label>
                      <Select
                        value={newRule.sourceCalendar}
                        onValueChange={(value) => setNewRule({...newRule, sourceCalendar: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          {calendars.filter(cal => cal.connected).map(cal => (
                            <SelectItem key={cal.id} value={cal.id}>{cal.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="target-calendar">Target Calendar</Label>
                      <Select
                        value={newRule.targetCalendar}
                        onValueChange={(value) => setNewRule({...newRule, targetCalendar: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select target" />
                        </SelectTrigger>
                        <SelectContent>
                          {calendars.filter(cal => cal.connected && cal.id !== newRule.sourceCalendar).map(cal => (
                            <SelectItem key={cal.id} value={cal.id}>{cal.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="sync-direction">Sync Direction</Label>
                      <Select
                        value={newRule.syncDirection}
                        onValueChange={(value) => setNewRule({...newRule, syncDirection: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-way">One Way</SelectItem>
                          <SelectItem value="two-way">Two Way</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="event-filter">Event Filter (optional)</Label>
                      <Input
                        id="event-filter"
                        value={newRule.eventFilter}
                        onChange={(e) => setNewRule({...newRule, eventFilter: e.target.value})}
                        placeholder="meeting, appointment, etc."
                      />
                    </div>
                    <Button 
                      onClick={addSyncRule} 
                      className="w-full" 
                      disabled={!newRule.name || !newRule.sourceCalendar || !newRule.targetCalendar}
                    >
                      Add Sync Rule
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sync Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{calendars.filter(cal => cal.connected).length}</div>
                        <div className="text-sm text-gray-600">Connected Calendars</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{syncRules.filter(rule => rule.enabled).length}</div>
                        <div className="text-sm text-gray-600">Active Sync Rules</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">{events.filter(event => event.synced).length}</div>
                        <div className="text-sm text-gray-600">Synced Events</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CalendarSync;
