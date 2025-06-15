
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Copy, RotateCcw, CheckCircle, XCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RegexTester = () => {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  });
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const getFlagsString = () => {
    let flagsStr = '';
    if (flags.global) flagsStr += 'g';
    if (flags.ignoreCase) flagsStr += 'i';
    if (flags.multiline) flagsStr += 'm';
    if (flags.dotAll) flagsStr += 's';
    if (flags.unicode) flagsStr += 'u';
    if (flags.sticky) flagsStr += 'y';
    return flagsStr;
  };

  const testRegex = () => {
    if (!pattern) {
      setMatches([]);
      setIsValid(true);
      setError('');
      return;
    }

    try {
      const regex = new RegExp(pattern, getFlagsString());
      setIsValid(true);
      setError('');

      if (flags.global) {
        const allMatches = [...testString.matchAll(regex)];
        setMatches(allMatches);
      } else {
        const match = testString.match(regex);
        setMatches(match ? [match] : []);
      }
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid regex pattern');
      setMatches([]);
    }
  };

  useEffect(() => {
    testRegex();
  }, [pattern, testString, flags]);

  const copyRegex = () => {
    const regexStr = `/${pattern}/${getFlagsString()}`;
    navigator.clipboard.writeText(regexStr);
    toast({
      title: "Copied!",
      description: "Regex pattern copied to clipboard.",
    });
  };

  const insertSample = () => {
    setPattern('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b');
    setTestString('Contact us at support@example.com or sales@company.org for more information.');
  };

  const clearAll = () => {
    setPattern('');
    setTestString('');
    setMatches([]);
    setError('');
    setIsValid(true);
  };

  const commonPatterns = [
    { name: 'Email', pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b' },
    { name: 'Phone', pattern: '\\b\\d{3}-\\d{3}-\\d{4}\\b' },
    { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
    { name: 'IP Address', pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b' },
    { name: 'Date (MM/DD/YYYY)', pattern: '\\b(0?[1-9]|1[0-2])\\/(0?[1-9]|[12][0-9]|3[01])\\/(19|20)\\d{2}\\b' },
    { name: 'Credit Card', pattern: '\\b(?:\\d{4}[-\\s]?){3}\\d{4}\\b' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Regex Tester & Debugger
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Test and debug regular expressions with real-time matching, detailed results, and helpful pattern examples.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Real-time Testing</Badge>
              <Badge variant="secondary">Pattern Library</Badge>
              <Badge variant="secondary">Match Details</Badge>
              <Badge variant="secondary">Flag Support</Badge>
            </div>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Regular Expression
                  </CardTitle>
                  <CardDescription>
                    Enter your regex pattern and configure flags
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="pattern">Pattern</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">/</span>
                      <Input
                        id="pattern"
                        placeholder="Enter regex pattern..."
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        className={`font-mono ${!isValid ? 'border-red-500' : ''}`}
                      />
                      <span className="text-gray-500">/{getFlagsString()}</span>
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <XCircle className="h-4 w-4" />
                        {error}
                      </div>
                    )}
                    {isValid && pattern && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Valid regex pattern
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label>Flags</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="global"
                          checked={flags.global}
                          onCheckedChange={(checked) => setFlags({...flags, global: checked})}
                        />
                        <Label htmlFor="global">Global (g)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="ignoreCase"
                          checked={flags.ignoreCase}
                          onCheckedChange={(checked) => setFlags({...flags, ignoreCase: checked})}
                        />
                        <Label htmlFor="ignoreCase">Ignore Case (i)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="multiline"
                          checked={flags.multiline}
                          onCheckedChange={(checked) => setFlags({...flags, multiline: checked})}
                        />
                        <Label htmlFor="multiline">Multiline (m)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="dotAll"
                          checked={flags.dotAll}
                          onCheckedChange={(checked) => setFlags({...flags, dotAll: checked})}
                        />
                        <Label htmlFor="dotAll">Dot All (s)</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={copyRegex} variant="outline" className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Regex
                    </Button>
                    <Button onClick={clearAll} variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Test String</CardTitle>
                  <CardDescription>
                    Enter text to test against your regex pattern
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-string">Input Text</Label>
                    <Textarea
                      id="test-string"
                      placeholder="Enter text to test..."
                      value={testString}
                      onChange={(e) => setTestString(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {matches.length} match{matches.length !== 1 ? 'es' : ''} found
                    </div>
                    <Button onClick={insertSample} variant="outline" size="sm">
                      Load Sample
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="matches" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="matches">Matches</TabsTrigger>
                <TabsTrigger value="patterns">Common Patterns</TabsTrigger>
                <TabsTrigger value="reference">Reference</TabsTrigger>
              </TabsList>

              <TabsContent value="matches" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Match Results</CardTitle>
                    <CardDescription>
                      Detailed information about regex matches
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {matches.length > 0 ? (
                      <div className="space-y-4">
                        {matches.map((match, index) => (
                          <div key={index} className="border rounded-lg p-4 bg-green-50">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline">Match {index + 1}</Badge>
                              <span className="text-sm text-gray-600">
                                Index: {match.index}
                              </span>
                            </div>
                            <div className="font-mono text-sm bg-white p-2 rounded border">
                              "{match[0]}"
                            </div>
                            {match.length > 1 && (
                              <div className="mt-2">
                                <div className="text-sm font-medium text-gray-700 mb-1">Groups:</div>
                                {match.slice(1).map((group, groupIndex) => (
                                  <div key={groupIndex} className="text-sm text-gray-600">
                                    Group {groupIndex + 1}: "{group}"
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        {pattern ? 'No matches found' : 'Enter a regex pattern to see matches'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="patterns" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Common Regex Patterns</CardTitle>
                    <CardDescription>
                      Click to use these common patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {commonPatterns.map((item) => (
                        <div
                          key={item.name}
                          className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => setPattern(item.pattern)}
                        >
                          <div className="font-medium mb-2">{item.name}</div>
                          <div className="font-mono text-sm text-gray-600 break-all">
                            {item.pattern}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reference" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Regex Reference</CardTitle>
                    <CardDescription>
                      Quick reference for regex syntax
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-semibold mb-3">Character Classes</h3>
                        <div className="space-y-2 text-sm">
                          <div><code className="bg-gray-100 px-1 rounded">.</code> - Any character</div>
                          <div><code className="bg-gray-100 px-1 rounded">\d</code> - Digit (0-9)</div>
                          <div><code className="bg-gray-100 px-1 rounded">\w</code> - Word character</div>
                          <div><code className="bg-gray-100 px-1 rounded">\s</code> - Whitespace</div>
                          <div><code className="bg-gray-100 px-1 rounded">[abc]</code> - Character set</div>
                          <div><code className="bg-gray-100 px-1 rounded">[^abc]</code> - Negated set</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Quantifiers</h3>
                        <div className="space-y-2 text-sm">
                          <div><code className="bg-gray-100 px-1 rounded">*</code> - 0 or more</div>
                          <div><code className="bg-gray-100 px-1 rounded">+</code> - 1 or more</div>
                          <div><code className="bg-gray-100 px-1 rounded">?</code> - 0 or 1</div>
                          <div><code className="bg-gray-100 px-1 rounded">{`{n}`}</code> - Exactly n</div>
                          <div><code className="bg-gray-100 px-1 rounded">{`{n,m}`}</code> - Between n and m</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Anchors</h3>
                        <div className="space-y-2 text-sm">
                          <div><code className="bg-gray-100 px-1 rounded">^</code> - Start of string</div>
                          <div><code className="bg-gray-100 px-1 rounded">$</code> - End of string</div>
                          <div><code className="bg-gray-100 px-1 rounded">\b</code> - Word boundary</div>
                          <div><code className="bg-gray-100 px-1 rounded">\B</code> - Non-word boundary</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Groups</h3>
                        <div className="space-y-2 text-sm">
                          <div><code className="bg-gray-100 px-1 rounded">(abc)</code> - Capturing group</div>
                          <div><code className="bg-gray-100 px-1 rounded">(?:abc)</code> - Non-capturing</div>
                          <div><code className="bg-gray-100 px-1 rounded">a|b</code> - Alternation</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegexTester;
