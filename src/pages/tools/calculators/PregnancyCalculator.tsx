
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Baby, Calendar, Heart, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PregnancyCalculator = () => {
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [calculationMethod, setCalculationMethod] = useState('lmp'); // lmp, conception, due_date
  const [conceptionDate, setConceptionDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const calculatePregnancy = () => {
    let estimatedConception: Date;
    let estimatedDueDate: Date;
    let lmp: Date;

    if (calculationMethod === 'lmp') {
      if (!lastPeriodDate) {
        toast({
          title: "Error",
          description: "Please enter your last menstrual period date",
          variant: "destructive"
        });
        return;
      }
      lmp = new Date(lastPeriodDate);
      estimatedConception = new Date(lmp.getTime() + (cycleLength - 14) * 24 * 60 * 60 * 1000);
      estimatedDueDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
    } else if (calculationMethod === 'conception') {
      if (!conceptionDate) {
        toast({
          title: "Error",
          description: "Please enter the conception date",
          variant: "destructive"
        });
        return;
      }
      estimatedConception = new Date(conceptionDate);
      estimatedDueDate = new Date(estimatedConception.getTime() + 266 * 24 * 60 * 60 * 1000);
      lmp = new Date(estimatedConception.getTime() - (cycleLength - 14) * 24 * 60 * 60 * 1000);
    } else {
      if (!dueDate) {
        toast({
          title: "Error",
          description: "Please enter the due date",
          variant: "destructive"
        });
        return;
      }
      estimatedDueDate = new Date(dueDate);
      lmp = new Date(estimatedDueDate.getTime() - 280 * 24 * 60 * 60 * 1000);
      estimatedConception = new Date(lmp.getTime() + (cycleLength - 14) * 24 * 60 * 60 * 1000);
    }

    const today = new Date();
    const daysSinceConception = Math.floor((today.getTime() - estimatedConception.getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceLMP = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntilDue = Math.floor((estimatedDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate weeks and days
    const weeksPregnant = Math.floor(daysSinceLMP / 7);
    const daysIntoWeek = daysSinceLMP % 7;
    
    // Calculate trimesters
    let trimester = 1;
    if (weeksPregnant >= 27) trimester = 3;
    else if (weeksPregnant >= 13) trimester = 2;

    // Get current week info
    const weekInfo = getWeekInfo(weeksPregnant);

    // Calculate important dates
    const firstTrimesterEnd = new Date(lmp.getTime() + 12 * 7 * 24 * 60 * 60 * 1000);
    const secondTrimesterEnd = new Date(lmp.getTime() + 26 * 7 * 24 * 60 * 60 * 1000);
    const firstAppointment = new Date(lmp.getTime() + 8 * 7 * 24 * 60 * 60 * 1000);
    const anomalyScan = new Date(lmp.getTime() + 20 * 7 * 24 * 60 * 60 * 1000);

    const pregnancyResult = {
      lmp: lmp.toDateString(),
      conception: estimatedConception.toDateString(),
      dueDate: estimatedDueDate.toDateString(),
      weeksPregnant,
      daysIntoWeek,
      trimester,
      daysSinceLMP,
      daysSinceConception,
      daysUntilDue,
      weekInfo,
      milestones: {
        firstTrimesterEnd: firstTrimesterEnd.toDateString(),
        secondTrimesterEnd: secondTrimesterEnd.toDateString(),
        firstAppointment: firstAppointment.toDateString(),
        anomalyScan: anomalyScan.toDateString()
      },
      zodiacSign: getZodiacSign(estimatedDueDate),
      season: getSeason(estimatedDueDate)
    };

    setResult(pregnancyResult);
    addToHistory(`${weeksPregnant}w ${daysIntoWeek}d - Due: ${estimatedDueDate.toDateString()}`);
    
    toast({
      title: "Pregnancy Calculated",
      description: `You are ${weeksPregnant} weeks and ${daysIntoWeek} days pregnant`
    });
  };

  const getWeekInfo = (week: number) => {
    const weeklyInfo: { [key: number]: any } = {
      4: { size: 'Poppy seed', length: '2mm', development: 'Neural tube forms' },
      8: { size: 'Raspberry', length: '16mm', development: 'All organs present' },
      12: { size: 'Lime', length: '5.4cm', development: 'Reflexes develop' },
      16: { size: 'Avocado', length: '11.6cm', development: 'Gender visible' },
      20: { size: 'Banana', length: '16.4cm', development: 'Halfway point!' },
      24: { size: 'Corn', length: '21cm', development: 'Hearing develops' },
      28: { size: 'Eggplant', length: '25cm', development: 'Eyes can open' },
      32: { size: 'Squash', length: '28.9cm', development: 'Bones hardening' },
      36: { size: 'Papaya', length: '32.2cm', development: 'Lungs mature' },
      40: { size: 'Watermelon', length: '36.1cm', development: 'Full term!' }
    };

    // Find the closest week with info
    const availableWeeks = Object.keys(weeklyInfo).map(Number).sort((a, b) => a - b);
    const closestWeek = availableWeeks.reduce((prev, curr) => 
      Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
    );

    return weeklyInfo[closestWeek] || { size: 'Growing', length: 'Developing', development: 'Continuing to grow' };
  };

  const getZodiacSign = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries ♈';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus ♉';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini ♊';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer ♋';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo ♌';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo ♍';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra ♎';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio ♏';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius ♐';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn ♑';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius ♒';
    return 'Pisces ♓';
  };

  const getSeason = (date: Date) => {
    const month = date.getMonth() + 1;
    if (month >= 3 && month <= 5) return 'Spring 🌸';
    if (month >= 6 && month <= 8) return 'Summer ☀️';
    if (month >= 9 && month <= 11) return 'Autumn 🍂';
    return 'Winter ❄️';
  };

  const getTrimesterInfo = (trimester: number) => {
    const info = {
      1: {
        title: 'First Trimester',
        weeks: '1-12 weeks',
        description: 'Major organ development, morning sickness common',
        tips: ['Take folic acid', 'Avoid alcohol', 'Get plenty of rest']
      },
      2: {
        title: 'Second Trimester',
        weeks: '13-26 weeks',
        description: 'Often called the "golden period", energy returns',
        tips: ['Feel baby movements', 'Anatomy scan', 'Consider prenatal classes']
      },
      3: {
        title: 'Third Trimester',
        weeks: '27-40 weeks',
        description: 'Rapid growth, prepare for delivery',
        tips: ['Hospital bag ready', 'Birth plan', 'Baby preparations']
      }
    };
    return info[trimester as keyof typeof info];
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pregnancy Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate your due date, track pregnancy progress, and get weekly development information.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="h-6 w-6" />
                  Pregnancy Calculator
                </CardTitle>
                <CardDescription>Calculate your pregnancy timeline and milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Calculation Method</Label>
                  <Select value={calculationMethod} onValueChange={setCalculationMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lmp">Last Menstrual Period (LMP)</SelectItem>
                      <SelectItem value="conception">Conception Date</SelectItem>
                      <SelectItem value="due_date">Due Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {calculationMethod === 'lmp' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Last Menstrual Period Date</Label>
                      <Input
                        type="date"
                        value={lastPeriodDate}
                        onChange={(e) => setLastPeriodDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label>Cycle Length (days)</Label>
                      <Select value={cycleLength.toString()} onValueChange={(value) => setCycleLength(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 15 }, (_, i) => i + 21).map(days => (
                            <SelectItem key={days} value={days.toString()}>{days} days</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {calculationMethod === 'conception' && (
                  <div>
                    <Label>Conception Date</Label>
                    <Input
                      type="date"
                      value={conceptionDate}
                      onChange={(e) => setConceptionDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}

                {calculationMethod === 'due_date' && (
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}

                <Button onClick={calculatePregnancy} className="w-full" size="lg">
                  Calculate Pregnancy
                </Button>

                {result && (
                  <div className="space-y-6">
                    <div className="bg-pink-50 p-6 rounded-lg text-center">
                      <div className="text-4xl font-bold text-pink-600 mb-2">
                        {result.weeksPregnant}w {result.daysIntoWeek}d
                      </div>
                      <div className="text-xl font-semibold text-pink-600 mb-2">
                        Weeks Pregnant
                      </div>
                      <div className="text-gray-600">
                        Trimester {result.trimester} • {result.daysUntilDue > 0 ? `${result.daysUntilDue} days until due date` : 'Baby is due!'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-600 mb-2">Due Date</h4>
                        <div className="text-lg font-bold text-blue-600">{result.dueDate}</div>
                        <div className="text-sm text-gray-600">{result.zodiacSign}</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-600 mb-2">Baby Size</h4>
                        <div className="text-lg font-bold text-green-600">{result.weekInfo.size}</div>
                        <div className="text-sm text-gray-600">{result.weekInfo.length}</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-600 mb-2">Season</h4>
                        <div className="text-lg font-bold text-purple-600">{result.season}</div>
                        <div className="text-sm text-gray-600">Birth season</div>
                      </div>
                    </div>

                    <Tabs defaultValue="development" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="development">Development</TabsTrigger>
                        <TabsTrigger value="trimester">Trimester</TabsTrigger>
                        <TabsTrigger value="milestones">Milestones</TabsTrigger>
                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                      </TabsList>

                      <TabsContent value="development">
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3">Week {result.weeksPregnant} Development</h4>
                          <div className="space-y-2">
                            <div><strong>Size:</strong> {result.weekInfo.size}</div>
                            <div><strong>Length:</strong> {result.weekInfo.length}</div>
                            <div><strong>Development:</strong> {result.weekInfo.development}</div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="trimester">
                        {(() => {
                          const trimesterInfo = getTrimesterInfo(result.trimester);
                          return (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">{trimesterInfo.title}</h4>
                              <div className="space-y-2">
                                <div><strong>Duration:</strong> {trimesterInfo.weeks}</div>
                                <div><strong>Description:</strong> {trimesterInfo.description}</div>
                                <div><strong>Tips:</strong></div>
                                <ul className="list-disc list-inside space-y-1">
                                  {trimesterInfo.tips.map((tip, index) => (
                                    <li key={index} className="text-sm">{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          );
                        })()}
                      </TabsContent>

                      <TabsContent value="milestones">
                        <div className="space-y-3">
                          <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
                            <span>First Prenatal Visit</span>
                            <span className="font-semibold">{result.milestones.firstAppointment}</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
                            <span>End of First Trimester</span>
                            <span className="font-semibold">{result.milestones.firstTrimesterEnd}</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
                            <span>Anatomy Scan (20 weeks)</span>
                            <span className="font-semibold">{result.milestones.anomalyScan}</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
                            <span>End of Second Trimester</span>
                            <span className="font-semibold">{result.milestones.secondTrimesterEnd}</span>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="timeline">
                        <div className="space-y-3">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between">
                              <span>Last Menstrual Period</span>
                              <span className="font-semibold">{result.lmp}</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between">
                              <span>Estimated Conception</span>
                              <span className="font-semibold">{result.conception}</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between">
                              <span>Days Since LMP</span>
                              <span className="font-semibold">{result.daysSinceLMP} days</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between">
                              <span>Days Since Conception</span>
                              <span className="font-semibold">{result.daysSinceConception} days</span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
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
                <CardDescription>Recent pregnancy calculations</CardDescription>
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
                <CardTitle>Pregnancy Facts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>🤱 Pregnancy lasts about 40 weeks</div>
                  <div>👶 Baby's heart beats at 6 weeks</div>
                  <div>🧠 Brain development peaks in 2nd trimester</div>
                  <div>👁️ Baby can hear sounds at 20 weeks</div>
                  <div>🫁 Lungs mature in 3rd trimester</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PregnancyCalculator;
