
import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Clock, Mic } from 'lucide-react';

const ReadingTimeCalculator = () => {
  const [text, setText] = useState('');
  const [readingSpeed, setReadingSpeed] = useState([225]);

  const stats = useMemo(() => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    if (wordCount === 0) {
      return { readingTime: '0 minutes', speakingTime: '0 minutes' };
    }

    const readingTimeMinutes = wordCount / readingSpeed[0];
    const readingTimeSeconds = Math.round(readingTimeMinutes * 60);
    const readingTimeFormatted = readingTimeSeconds < 60 ? `${readingTimeSeconds} seconds` : `${Math.ceil(readingTimeMinutes)} minutes`;

    const speakingTimeMinutes = wordCount / 150; // Average speaking speed
    const speakingTimeSeconds = Math.round(speakingTimeMinutes * 60);
    const speakingTimeFormatted = speakingTimeSeconds < 60 ? `${speakingTimeSeconds} seconds` : `${Math.ceil(speakingTimeMinutes)} minutes`;

    return { readingTime: readingTimeFormatted, speakingTime: speakingTimeFormatted };
  }, [text, readingSpeed]);

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Reading Time Calculator</h1>
            <p className="mt-4 text-lg text-gray-600">
              Estimate the reading and speaking time for your text.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Text</CardTitle>
                <CardDescription>Paste your content below.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[300px] text-base"
                />
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Estimated Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 mr-4 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Reading Time</p>
                      <p className="text-2xl font-bold">{stats.readingTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mic className="h-8 w-8 mr-4 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Speaking Time</p>
                      <p className="text-2xl font-bold">{stats.speakingTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="reading-speed">Reading Speed (words per minute)</Label>
                  <Slider
                    id="reading-speed"
                    value={readingSpeed}
                    onValueChange={setReadingSpeed}
                    max={400}
                    min={100}
                    step={5}
                    className="my-4"
                  />
                  <div className="text-center text-lg font-bold">{readingSpeed[0]} WPM</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReadingTimeCalculator;
