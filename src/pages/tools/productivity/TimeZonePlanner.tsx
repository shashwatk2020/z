
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, ArrowLeft, Clock, Plus, Trash2, Calendar } from 'lucide-react';

interface TimeZone {
  id: string;
  name: string;
  offset: number;
  city: string;
  country: string;
}

interface ScheduledEvent {
  id: string;
  title: string;
  dateTime: string;
  duration: number;
}

const timeZones: TimeZone[] = [
  { id: 'utc', name: 'UTC', offset: 0, city: 'London', country: 'UK' },
  { id: 'est', name: 'EST', offset: -5, city: 'New York', country: 'USA' },
  { id: 'cst', name: 'CST', offset: -6, city: 'Chicago', country: 'USA' },
  { id: 'mst', name: 'MST', offset: -7, city: 'Denver', country: 'USA' },
  { id: 'pst', name: 'PST', offset: -8, city: 'Los Angeles', country: 'USA' },
  { id: 'cet', name: 'CET', offset: 1, city: 'Berlin', country: 'Germany' },
  { id: 'jst', name: 'JST', offset: 9, city: 'Tokyo', country: 'Japan' },
  { id: 'aest', name: 'AEST', offset: 10, city: 'Sydney', country: 'Australia' },
  { id: 'ist', name: 'IST', offset: 5.5, city: 'Mumbai', country: 'India' },
  { id: 'bst', name: 'BST', offset: 6, city: 'Dhaka', country: 'Bangladesh' },
  { id: 'cat', name: 'CAT', offset: 2, city: 'Cairo', country: 'Egypt' },
  { id: 'brt', name: 'BRT', offset: -3, city: 'São Paulo', country: 'Brazil' },
];

const TimeZonePlanner = () => {
  const [selectedTimeZones, setSelectedTimeZones] = useState<TimeZone[]>([
    timeZones[0], // UTC
    timeZones[1], // EST
    timeZones[6], // JST
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('12:00');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    duration: 60
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const convertTime = (baseTime: Date, fromOffset: number, toOffset: number) => {
    const utcTime = baseTime.getTime() - (fromOffset * 60 * 60 * 1000);
    const targetTime = new Date(utcTime + (toOffset * 60 * 60 * 1000));
    return targetTime;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeWithSeconds = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const addTimeZone = (timeZoneId: string) => {
    const timeZone = timeZones.find(tz => tz.id === timeZoneId);
    if (timeZone && !selectedTimeZones.find(tz => tz.id === timeZoneId)) {
      setSelectedTimeZones([...selectedTimeZones, timeZone]);
    }
  };

  const removeTimeZone = (timeZoneId: string) => {
    setSelectedTimeZones(selectedTimeZones.filter(tz => tz.id !== timeZoneId));
  };

  const addEvent = () => {
    if (!newEvent.title || !selectedTime || !selectedDate) return;

    const eventDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    
    const event: ScheduledEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      dateTime: eventDateTime.toISOString(),
      duration: newEvent.duration
    };

    setEvents([...events, event].sort((a, b) => 
      new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    ));

    setNewEvent({ title: '', duration: 60 });
  };

  const removeEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const getTimeInTimeZone = (baseDateTime: string, targetOffset: number) => {
    const baseDate = new Date(baseDateTime);
    const utcTime = baseDate.getTime();
    const targetTime = new Date(utcTime + (targetOffset * 60 * 60 * 1000));
    return targetTime;
  };

  const isBusinessHours = (time: Date) => {
    const hour = time.getHours();
    return hour >= 9 && hour <= 17;
  };

  const getTimeColor = (time: Date) => {
    const hour = time.getHours();
    if (hour >= 9 && hour <= 17) return 'text-green-600'; // Business hours
    if (hour >= 6 && hour <= 21) return 'text-yellow-600'; // Reasonable hours
    return 'text-red-600'; // Late/early hours
  };

  const findBestMeetingTime = () => {
    const suggestions = [];
    
    for (let hour = 0; hour < 24; hour++) {
      const baseTime = new Date();
      baseTime.setHours(hour, 0, 0, 0);
      
      let businessHourCount = 0;
      let reasonableHourCount = 0;
      
      selectedTimeZones.forEach(tz => {
        const timeInZone = convertTime(baseTime, 0, tz.offset);
        const hourInZone = timeInZone.getHours();
        
        if (hourInZone >= 9 && hourInZone <= 17) {
          businessHourCount++;
        } else if (hourInZone >= 6 && hourInZone <= 21) {
          reasonableHourCount++;
        }
      });
      
      if (businessHourCount >= selectedTimeZones.length * 0.5) {
        suggestions.push({
          time: hour,
          score: businessHourCount + reasonableHourCount * 0.5,
          type: 'excellent'
        });
      } else if (reasonableHourCount >= selectedTimeZones.length * 0.7) {
        suggestions.push({
          time: hour,
          score: reasonableHourCount * 0.5,
          type: 'good'
        });
      }
    }
    
    return suggestions.sort((a, b) => b.score - a.score).slice(0, 3);
  };

  const bestTimes = findBestMeetingTime();

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
                <Globe className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Time Zone Planner</h1>
                  <p className="text-gray-600">Plan activities across multiple time zones</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Time Zone Display */}
              <div className="lg:col-span-3 space-y-6">
                {/* Current Time */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Time Across Time Zones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedTimeZones.map(tz => {
                        const timeInZone = convertTime(currentTime, 0, tz.offset);
                        return (
                          <div key={tz.id} className="bg-white border rounded-lg p-4 relative">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeTimeZone(tz.id)}
                              className="absolute top-2 right-2 h-6 w-6 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                            <div className="mb-2">
                              <h3 className="font-semibold text-gray-900">{tz.city}</h3>
                              <p className="text-sm text-gray-600">{tz.country} ({tz.name})</p>
                            </div>
                            <div className={`text-2xl font-mono font-bold ${getTimeColor(timeInZone)}`}>
                              {formatTimeWithSeconds(timeInZone)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {timeInZone.toLocaleDateString()}
                            </div>
                            <div className="text-xs mt-2">
                              <span className={`px-2 py-1 rounded-full ${
                                isBusinessHours(timeInZone) 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {isBusinessHours(timeInZone) ? 'Business Hours' : 'Off Hours'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Meeting Time Planner */}
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Meeting Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label htmlFor="meeting-date">Date</Label>
                        <Input
                          id="meeting-date"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="meeting-time">Time (UTC)</Label>
                        <Input
                          id="meeting-time"
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                        />
                      </div>
                    </div>

                    {selectedTime && selectedDate && (
                      <div>
                        <h3 className="font-semibold mb-4">Meeting Time Across Time Zones</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedTimeZones.map(tz => {
                            const meetingDateTime = new Date(`${selectedDate}T${selectedTime}:00Z`);
                            const timeInZone = convertTime(meetingDateTime, 0, tz.offset);
                            
                            return (
                              <div key={tz.id} className="bg-gray-50 border rounded-lg p-3">
                                <div className="mb-1">
                                  <h4 className="font-medium text-gray-900">{tz.city}</h4>
                                  <p className="text-xs text-gray-600">{tz.name}</p>
                                </div>
                                <div className={`text-lg font-mono font-bold ${getTimeColor(timeInZone)}`}>
                                  {formatTime(timeInZone)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {timeInZone.toLocaleDateString()}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Best Meeting Times */}
                {bestTimes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Suggested Meeting Times (UTC)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {bestTimes.map((suggestion, index) => (
                          <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-700">
                                {suggestion.time.toString().padStart(2, '0')}:00
                              </div>
                              <div className="text-sm text-green-600 capitalize">
                                {suggestion.type} time
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2"
                                onClick={() => setSelectedTime(`${suggestion.time.toString().padStart(2, '0')}:00`)}
                              >
                                Use This Time
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Scheduled Events */}
                <Card>
                  <CardHeader>
                    <CardTitle>Scheduled Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {events.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No events scheduled. Add your first event!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {events.map(event => (
                          <div key={event.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                                <p className="text-sm text-gray-600">
                                  {new Date(event.dateTime).toLocaleDateString()} • {event.duration} minutes
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeEvent(event.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {selectedTimeZones.map(tz => {
                                const eventTime = getTimeInTimeZone(event.dateTime, tz.offset);
                                return (
                                  <div key={tz.id} className="text-sm bg-gray-50 p-2 rounded">
                                    <div className="font-medium">{tz.city}</div>
                                    <div className={getTimeColor(eventTime)}>
                                      {formatTime(eventTime)}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Controls */}
              <div className="space-y-6">
                {/* Add Time Zone */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add Time Zone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select onValueChange={addTimeZone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeZones
                          .filter(tz => !selectedTimeZones.find(selected => selected.id === tz.id))
                          .map(tz => (
                            <SelectItem key={tz.id} value={tz.id}>
                              {tz.city} ({tz.name})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Add Event */}
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule Event</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="event-title">Event Title</Label>
                      <Input
                        id="event-title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        placeholder="Team meeting"
                      />
                    </div>
                    <div>
                      <Label htmlFor="event-duration">Duration (minutes)</Label>
                      <Input
                        id="event-duration"
                        type="number"
                        value={newEvent.duration}
                        onChange={(e) => setNewEvent({...newEvent, duration: parseInt(e.target.value) || 60})}
                        min={15}
                        step={15}
                      />
                    </div>
                    <Button onClick={addEvent} className="w-full" disabled={!newEvent.title}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const now = new Date();
                          setSelectedDate(now.toISOString().split('T')[0]);
                          setSelectedTime(now.toTimeString().slice(0, 5));
                        }}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Use Current Time
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          setSelectedDate(tomorrow.toISOString().split('T')[0]);
                          setSelectedTime('09:00');
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Tomorrow 9 AM
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Legend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Time Indicators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span>Business hours (9 AM - 5 PM)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span>Reasonable hours (6 AM - 9 PM)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span>Off hours</span>
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

export default TimeZonePlanner;
