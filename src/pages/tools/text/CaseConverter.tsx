
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const CaseConverter = () => {
  const [text, setText] = useState('');

  const toUpperCase = () => setText(text.toUpperCase());
  const toLowerCase = () => setText(text.toLowerCase());
  const toTitleCase = () => setText(text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
  const toSentenceCase = () => setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()));
  const clearText = () => setText('');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl font-bold">Case Converter</CardTitle>
                    <CardDescription>
                        Easily convert your text between uppercase, lowercase, title case, and sentence case.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Type or paste your text here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="min-h-[200px] text-base"
                    />
                    <div className="flex flex-wrap gap-2 mt-4">
                        <Button onClick={toUpperCase}>Upper Case</Button>
                        <Button onClick={toLowerCase}>Lower Case</Button>
                        <Button onClick={toTitleCase}>Title Case</Button>
                        <Button onClick={toSentenceCase}>Sentence Case</Button>
                        <Button variant="destructive" onClick={clearText}>Clear</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CaseConverter;
