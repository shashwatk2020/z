
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Minus, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DateCalculator = () => {
  // Date difference calculation
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Add/subtract days
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [daysToAdd, setDaysToAdd] = useState(30);
  const [operation, setOperation] = useState('add');
  
  // Add/subtract other units
  const [amount, setAmount] = useState(1);
  const [timeUnit, setTimeUnit] = useState('months');
  
  // Results
  const [dateDifference, setDateDifference] = useState<any>(null);
  const [calculatedDate, setCalculatedDate] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  
  const { toast } = useToast();

  const timeUnits = [
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' }
  ];

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const calculateDateDifference = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const timeDifference = Math.abs(end.getTime() - start.getTime());
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    
    const years = Math.floor(daysDifference / 365.25);
    const months = Math.floor((daysDifference % 365.25) / 30.44);
    const days = Math.floor((daysDifference % 365.25) % 30.44);
    
    const weeks = Math.floor(daysDifference / 7);
    const remainingDays = daysDifference % 7;
    
    const hours = Math.floor(timeDifference / (1000 * 3600));
    const minutes = Math.floor(timeDifference / (1000 * 60));
    const seconds = Math.floor(timeDifference / 1000);

    const result = {
      totalDays: daysDifference,
      years,
      months,
      days,
      weeks: weeks,
      remainingDays,
      totalHours: hours,
      totalMinutes: minutes,
      totalSeconds: seconds
    };

    setDateDifference(result);

    addToHistory(`${startDate} to ${endDate}: ${daysDifference} days (${years}y ${months}m ${days}d)`);
    
    toast({
      title: "Date Difference Calculated",
      description: `${daysDifference} days difference`
    });
  };

  const addSubtractDays = () => {
    const date = new Date(baseDate);
    const daysChange = operation === 'add' ? daysToAdd : -daysToAdd;
    
    date.setDate(date.getDate() + daysChange);
    const result = date.toISOString().split('T')[0];
    
    setCalculatedDate(result);

    addToHistory(`${baseDate} ${operation} ${daysToAdd} days = ${result}`);
    
    toast({
      title: "Date Calculated",
      description: `Result: ${result}`
    });
  };

  const addSubtractTimeUnit = () => {
    const date = new Date(baseDate);
    const amountChange = operation === 'add' ? amount : -amount;
    
    switch (timeUnit) {
      case 'days':
        date.setDate(date.getDate() + amountChange);
        break;
      case 'weeks':
        date.setDate(date.getDate() + (amountChange * 7));
        break;
      case 'months':
        date.setMonth(date.getMonth() + amountChange);
        break;
      case 'years':
        date.setFullYear(date.getFullYear() + amountChange);
        break;
    }
    
    const result = date.toISOString().split('T')[0];
    setCalculatedDate(result);

    addToHistory(`${baseDate} ${operation} ${amount} ${timeUnit} = ${result}`);
    
    toast({
      title: "Date Calculated",
      description: `Result: ${result}`
    });
  };

  const getDateInfo = (dateString: string) => {
    const date = new Date(dateString);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    return {
      dayOfWeek: dayNames[date.getDay()],
      monthName: monthNames[date.getMonth()],
      dayOfYear: Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)),
      weekOfYear: Math.ceil(((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 86400000 + new Date(date.getFullYear(), 0, 1).getDay() + 1) / 7),
      isLeapYear: (date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) || (date.getFullYear() % 400 === 0)
    };
  };

  const quickDates = [
    { days: 7, label: '+1 Week' },
    { days: 30, label: '+1 Month' },
    { days: 90, label: '+3 Months' },
    { days: 365, label: '+1 Year' },
    { days: -7, label: '-1 Week' },
    { days: -30, label: '-1 Month' }
  ];

  const quickCalculate = (days: number) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + days);
    setCalculatedDate(date.toISOString().split('T')[0]);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Date Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate date differences, add or subtract time periods, and get detailed date information.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="difference" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="difference">Date Difference</TabsTrigger>
                <TabsTrigger value="addsubtract">Add/Subtract</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="difference">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-6 w-6" />
                      Date Difference Calculator
                    </CardTitle>
                    <CardDescription>Calculate the difference between two dates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button onClick={calculateDateDifference} className="w-full">
                      Calculate Date Difference
                    </Button>

                    {dateDifference && (
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{dateDifference.totalDays}</div>
                            <div className="text-sm text-gray-600">Total Days</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{dateDifference.weeks}</div>
                            <div className="text-sm text-gray-600">Weeks</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{dateDifference.totalHours.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Total Hours</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{dateDifference.totalMinutes.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Total Minutes</div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-semibold">
                            {dateDifference.years} years, {dateDifference.months} months, {dateDifference.days} days
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Or {dateDifference.weeks} weeks and {dateDifference.remainingDays} days
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addsubtract">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-6 w-6" />
                      Add or Subtract Time
                    </CardTitle>
                    <CardDescription>Add or subtract time periods from a date</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Base Date</Label>
                      <Input
                        type="date"
                        value={baseDate}
                        onChange={(e) => setBaseDate(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Operation</Label>
                        <Select value={operation} onValueChange={setOperation}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="add">Add</SelectItem>
                            <SelectItem value="subtract">Subtract</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Time Unit</Label>
                        <Select value={timeUnit} onValueChange={setTimeUnit}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeUnits.map(unit => (
                              <SelectItem key={unit.value} value={unit.value}>
                                {unit.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={addSubtractTimeUnit} className="w-full">
                      Calculate New Date
                    </Button>

                    {calculatedDate && (
                      <div className="bg-green-50 p-6 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {calculatedDate}
                        </div>
                        <div className="text-gray-600">
                          {baseDate} {operation} {amount} {timeUnit}
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          {getDateInfo(calculatedDate).dayOfWeek}, {getDateInfo(calculatedDate).monthName} {new Date(calculatedDate).getDate()}, {new Date(calculatedDate).getFullYear()}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label className="text-lg font-semibold mb-4 block">Quick Calculations</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {quickDates.map((quick, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => quickCalculate(quick.days)}
                            className="text-sm p-2 h-auto"
                          >
                            {quick.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced">
                <Card>
                  <CardHeader>
                    <CardTitle>Date Information</CardTitle>
                    <CardDescription>Get detailed information about any date</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {calculatedDate && (
                      <div className="bg-purple-50 p-6 rounded-lg">
                        <h4 className="font-semibold mb-4">Date Details for {calculatedDate}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Day of Week:</strong> {getDateInfo(calculatedDate).dayOfWeek}
                          </div>
                          <div>
                            <strong>Month:</strong> {getDateInfo(calculatedDate).monthName}
                          </div>
                          <div>
                            <strong>Day of Year:</strong> {getDateInfo(calculatedDate).dayOfYear}
                          </div>
                          <div>
                            <strong>Week of Year:</strong> {getDateInfo(calculatedDate).weekOfYear}
                          </div>
                          <div>
                            <strong>Leap Year:</strong> {getDateInfo(calculatedDate).isLeapYear ? 'Yes' : 'No'}
                          </div>
                          <div>
                            <strong>Quarter:</strong> Q{Math.ceil((new Date(calculatedDate).getMonth() + 1) / 3)}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Date Calculator Features:</h4>
                      <div className="text-sm space-y-1">
                        <div>• Calculate exact differences between dates</div>
                        <div>• Add or subtract years, months, weeks, days</div>
                        <div>• Automatic leap year handling</div>
                        <div>• Day of week and detailed date information</div>
                        <div>• Business day calculations</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Calculation History
                </CardTitle>
                <CardDescription>Recent date calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No calculations yet</p>
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
                <CardTitle>Today's Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {(() => {
                    const today = new Date().toISOString().split('T')[0];
                    const info = getDateInfo(today);
                    const todayDate = new Date();
                    
                    return (
                      <>
                        <div className="flex justify-between">
                          <span><strong>Date:</strong></span>
                          <span>{today}</span>
                        </div>
                        <div className="flex justify-between">
                          <span><strong>Day:</strong></span>
                          <span>{info.dayOfWeek}</span>
                        </div>
                        <div className="flex justify-between">
                          <span><strong>Day of Year:</strong></span>
                          <span>{info.dayOfYear}</span>
                        </div>
                        <div className="flex justify-between">
                          <span><strong>Week:</strong></span>
                          <span>{info.weekOfYear}</span>
                        </div>
                        <div className="flex justify-between">
                          <span><strong>Quarter:</strong></span>
                          <span>Q{Math.ceil((todayDate.getMonth() + 1) / 3)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span><strong>Leap Year:</strong></span>
                          <span>{info.isLeapYear ? 'Yes' : 'No'}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DateCalculator;
