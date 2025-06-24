
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ArrowLeft, Clock, Users, MapPin, Plus, Edit, Trash2 } from 'lucide-react';

interface WorkShift {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  location: string;
  type: 'regular' | 'overtime' | 'remote';
  notes: string;
}

interface WeeklySchedule {
  [key: string]: WorkShift[];
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WorkSchedulePlanner = () => {
  const [schedule, setSchedule] = useState<WeeklySchedule>({});
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [editingShift, setEditingShift] = useState<WorkShift | null>(null);
  const [newShift, setNewShift] = useState<Partial<WorkShift>>({
    title: '',
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 60,
    location: '',
    type: 'regular',
    notes: ''
  });

  const addShift = () => {
    if (!newShift.title || !newShift.startTime || !newShift.endTime) return;

    const shift: WorkShift = {
      id: Date.now().toString(),
      title: newShift.title!,
      startTime: newShift.startTime!,
      endTime: newShift.endTime!,
      breakDuration: newShift.breakDuration || 60,
      location: newShift.location || '',
      type: newShift.type as 'regular' | 'overtime' | 'remote' || 'regular',
      notes: newShift.notes || ''
    };

    setSchedule(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), shift]
    }));

    setNewShift({
      title: '',
      startTime: '09:00',
      endTime: '17:00',
      breakDuration: 60,
      location: '',
      type: 'regular',
      notes: ''
    });
  };

  const updateShift = (updatedShift: WorkShift) => {
    setSchedule(prev => ({
      ...prev,
      [selectedDay]: (prev[selectedDay] || []).map(shift => 
        shift.id === updatedShift.id ? updatedShift : shift
      )
    }));
    setEditingShift(null);
  };

  const deleteShift = (shiftId: string) => {
    setSchedule(prev => ({
      ...prev,
      [selectedDay]: (prev[selectedDay] || []).filter(shift => shift.id !== shiftId)
    }));
  };

  const calculateShiftDuration = (startTime: string, endTime: string, breakDuration: number) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const totalMinutes = endMinutes - startMinutes - breakDuration;
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  const getWeeklyStats = () => {
    let totalHours = 0;
    let totalShifts = 0;
    
    Object.values(schedule).forEach(dayShifts => {
      dayShifts.forEach(shift => {
        const [startHour, startMinute] = shift.startTime.split(':').map(Number);
        const [endHour, endMinute] = shift.endTime.split(':').map(Number);
        
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        const shiftMinutes = endMinutes - startMinutes - shift.breakDuration;
        
        totalHours += shiftMinutes / 60;
        totalShifts++;
      });
    });
    
    return { totalHours: Math.round(totalHours * 10) / 10, totalShifts };
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'regular': return 'bg-blue-100 text-blue-800';
      case 'overtime': return 'bg-orange-100 text-orange-800';
      case 'remote': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const { totalHours, totalShifts } = getWeeklyStats();

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
                  <h1 className="text-3xl font-bold text-gray-900">Work Schedule Planner</h1>
                  <p className="text-gray-600">Plan and optimize your work schedule and shifts</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Schedule View */}
              <div className="lg:col-span-3 space-y-6">
                {/* Day Selector */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map(day => (
                        <Button
                          key={day}
                          variant={day === selectedDay ? "default" : "outline"}
                          onClick={() => setSelectedDay(day)}
                          className="flex-1 min-w-0"
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Shifts for Selected Day */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedDay} Schedule</span>
                      <span className="text-sm font-normal text-gray-600">
                        {(schedule[selectedDay] || []).length} shift(s)
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!schedule[selectedDay] || schedule[selectedDay].length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No shifts scheduled for {selectedDay}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {schedule[selectedDay].map((shift) => (
                          <div key={shift.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold text-gray-900">{shift.title}</h3>
                                  <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(shift.type)}`}>
                                    {shift.type}
                                  </span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    {shift.startTime} - {shift.endTime} 
                                    <span className="ml-2 text-blue-600 font-medium">
                                      ({calculateShiftDuration(shift.startTime, shift.endTime, shift.breakDuration)})
                                    </span>
                                  </div>
                                  {shift.location && (
                                    <div className="flex items-center">
                                      <MapPin className="h-4 w-4 mr-2" />
                                      {shift.location}
                                    </div>
                                  )}
                                  {shift.breakDuration > 0 && (
                                    <div className="text-xs text-gray-500">
                                      Break: {shift.breakDuration} minutes
                                    </div>
                                  )}
                                  {shift.notes && (
                                    <div className="text-xs text-gray-500 mt-2">
                                      {shift.notes}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setEditingShift(shift)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => deleteShift(shift.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Add Shift Form & Stats */}
              <div className="space-y-6">
                {/* Weekly Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{totalHours}h</div>
                        <div className="text-sm text-gray-600">Total Hours</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{totalShifts}</div>
                        <div className="text-sm text-gray-600">Total Shifts</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {totalShifts > 0 ? Math.round((totalHours / totalShifts) * 10) / 10 : 0}h
                        </div>
                        <div className="text-sm text-gray-600">Avg Shift Length</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Add Shift Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {editingShift ? 'Edit Shift' : 'Add New Shift'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="shift-title">Shift Title</Label>
                      <Input
                        id="shift-title"
                        value={editingShift ? editingShift.title : newShift.title}
                        onChange={(e) => editingShift 
                          ? setEditingShift({...editingShift, title: e.target.value})
                          : setNewShift({...newShift, title: e.target.value})
                        }
                        placeholder="e.g., Morning Shift"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={editingShift ? editingShift.startTime : newShift.startTime}
                          onChange={(e) => editingShift 
                            ? setEditingShift({...editingShift, startTime: e.target.value})
                            : setNewShift({...newShift, startTime: e.target.value})
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="end-time">End Time</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={editingShift ? editingShift.endTime : newShift.endTime}
                          onChange={(e) => editingShift 
                            ? setEditingShift({...editingShift, endTime: e.target.value})
                            : setNewShift({...newShift, endTime: e.target.value})
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="break-duration">Break Duration (minutes)</Label>
                      <Input
                        id="break-duration"
                        type="number"
                        value={editingShift ? editingShift.breakDuration : newShift.breakDuration}
                        onChange={(e) => editingShift 
                          ? setEditingShift({...editingShift, breakDuration: parseInt(e.target.value) || 0})
                          : setNewShift({...newShift, breakDuration: parseInt(e.target.value) || 0})
                        }
                        min={0}
                      />
                    </div>

                    <div>
                      <Label htmlFor="shift-type">Shift Type</Label>
                      <Select
                        value={editingShift ? editingShift.type : newShift.type}
                        onValueChange={(value) => editingShift 
                          ? setEditingShift({...editingShift, type: value as any})
                          : setNewShift({...newShift, type: value as any})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="overtime">Overtime</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editingShift ? editingShift.location : newShift.location}
                        onChange={(e) => editingShift 
                          ? setEditingShift({...editingShift, location: e.target.value})
                          : setNewShift({...newShift, location: e.target.value})
                        }
                        placeholder="Office, Home, Site A, etc."
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Input
                        id="notes"
                        value={editingShift ? editingShift.notes : newShift.notes}
                        onChange={(e) => editingShift 
                          ? setEditingShift({...editingShift, notes: e.target.value})
                          : setNewShift({...newShift, notes: e.target.value})
                        }
                        placeholder="Additional notes..."
                      />
                    </div>

                    {editingShift ? (
                      <div className="flex space-x-2">
                        <Button onClick={() => updateShift(editingShift)} className="flex-1">
                          Update Shift
                        </Button>
                        <Button onClick={() => setEditingShift(null)} variant="outline">
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={addShift} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Shift
                      </Button>
                    )}
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

export default WorkSchedulePlanner;
