
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const calculateAge = () => {
    if (!birthDate) {
      toast({
        title: "Error",
        description: "Please enter your birth date",
        variant: "destructive"
      });
      return;
    }

    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    
    if (birth > target) {
      toast({
        title: "Error",
        description: "Birth date cannot be in the future",
        variant: "destructive"
      });
      return;
    }

    // Calculate exact age
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total values
    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Calculate next birthday
    const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < target) {
      nextBirthday.setFullYear(target.getFullYear() + 1);
    }
    const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    // Zodiac sign
    const zodiacSigns = [
      { name: 'Capricorn', start: [12, 22], end: [1, 19] },
      { name: 'Aquarius', start: [1, 20], end: [2, 18] },
      { name: 'Pisces', start: [2, 19], end: [3, 20] },
      { name: 'Aries', start: [3, 21], end: [4, 19] },
      { name: 'Taurus', start: [4, 20], end: [5, 20] },
      { name: 'Gemini', start: [5, 21], end: [6, 20] },
      { name: 'Cancer', start: [6, 21], end: [7, 22] },
      { name: 'Leo', start: [7, 23], end: [8, 22] },
      { name: 'Virgo', start: [8, 23], end: [9, 22] },
      { name: 'Libra', start: [9, 23], end: [10, 22] },
      { name: 'Scorpio', start: [10, 23], end: [11, 21] },
      { name: 'Sagittarius', start: [11, 22], end: [12, 21] }
    ];

    const birthMonth = birth.getMonth() + 1;
    const birthDay = birth.getDate();
    
    let zodiac = 'Unknown';
    for (const sign of zodiacSigns) {
      const [startMonth, startDay] = sign.start;
      const [endMonth, endDay] = sign.end;
      
      if ((birthMonth === startMonth && birthDay >= startDay) || 
          (birthMonth === endMonth && birthDay <= endDay)) {
        zodiac = sign.name;
        break;
      }
    }

    const ageResult = {
      exact: { years, months, days },
      total: { days: totalDays, weeks: totalWeeks, months: totalMonths, hours: totalHours, minutes: totalMinutes, seconds: totalSeconds },
      nextBirthday: daysToNextBirthday,
      zodiac,
      dayOfWeek: birth.toLocaleDateString('en-US', { weekday: 'long' })
    };

    setResult(ageResult);
    addToHistory(`Age: ${years}y ${months}m ${days}d (${totalDays} days total)`);
    
    toast({
      title: "Age Calculated",
      description: `You are ${years} years, ${months} months, and ${days} days old`
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Age Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate your exact age in years, months, days, and more with detailed breakdown.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Age Calculator
                </CardTitle>
                <CardDescription>Enter your birth date to calculate your exact age</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Birth Date</Label>
                    <Input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label>Calculate Age On</Label>
                    <Input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={calculateAge} className="w-full" size="lg">
                  Calculate Age
                </Button>

                {result && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-2xl font-bold text-blue-600 mb-4">Your Age</h3>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-3xl font-bold text-blue-600">{result.exact.years}</div>
                          <div className="text-gray-600">Years</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-blue-600">{result.exact.months}</div>
                          <div className="text-gray-600">Months</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-blue-600">{result.exact.days}</div>
                          <div className="text-gray-600">Days</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{result.total.days.toLocaleString()}</div>
                        <div className="text-gray-600">Total Days</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">{result.total.weeks.toLocaleString()}</div>
                        <div className="text-gray-600">Total Weeks</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">{result.total.months}</div>
                        <div className="text-gray-600">Total Months</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-600">{result.total.hours.toLocaleString()}</div>
                        <div className="text-gray-600">Total Hours</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-yellow-600">{result.total.minutes.toLocaleString()}</div>
                        <div className="text-gray-600">Total Minutes</div>
                      </div>
                      <div className="bg-pink-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-pink-600">{result.total.seconds.toLocaleString()}</div>
                        <div className="text-gray-600">Total Seconds</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Additional Information</h4>
                      <div className="space-y-2 text-sm">
                        <div>🎂 Days until next birthday: <strong>{result.nextBirthday}</strong></div>
                        <div>⭐ Zodiac sign: <strong>{result.zodiac}</strong></div>
                        <div>📅 You were born on a <strong>{result.dayOfWeek}</strong></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Calculation History
                </CardTitle>
                <CardDescription>Recent age calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No calculations yet</p>
                  ) : (
                    history.slice().reverse().map((calc, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
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
                <CardTitle>Fun Facts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>🌍 Earth completes one orbit around the sun in 365.25 days</div>
                  <div>🕰️ A leap year occurs every 4 years (with exceptions)</div>
                  <div>⏰ Your heart beats about 100,000 times per day</div>
                  <div>🌙 The moon's cycle is about 29.5 days</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AgeCalculator;
