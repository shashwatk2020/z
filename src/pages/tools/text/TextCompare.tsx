
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { diffChars } from 'diff';

const TextCompare = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffResult, setDiffResult] = useState<ReturnType<typeof diffChars> | null>(null);

  const handleCompare = () => {
    const diff = diffChars(text1, text2);
    setDiffResult(diff);
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Text Compare (Diff Checker)</h1>
            <p className="mt-4 text-lg text-gray-600">
              Compare two blocks of text to see the differences between them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the first text here..."
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Changed Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the second text here..."
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-8">
            <Button onClick={handleCompare} size="lg">Compare Texts</Button>
          </div>
          
          {diffResult && (
            <Card>
              <CardHeader>
                <CardTitle>Comparison Result</CardTitle>
                <CardDescription>
                  <span className="text-green-600 bg-green-100 px-2 py-1 rounded">Green</span> indicates additions, and <span className="text-red-600 bg-red-100 px-2 py-1 rounded line-through">Red</span> indicates deletions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap font-mono text-sm">
                  {diffResult.map((part, index) => {
                    const style = part.added
                      ? { backgroundColor: '#dcfce7', color: '#166534' }
                      : part.removed
                      ? { backgroundColor: '#fee2e2', color: '#991b1b', textDecoration: 'line-through' }
                      : {};
                    return (
                      <span key={index} style={style}>
                        {part.value}
                      </span>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TextCompare;
