
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UsernameGenerator = () => {
  const [baseWord, setBaseWord] = useState('');
  const [generatedUsernames, setGeneratedUsernames] = useState<string[]>([]);
  const { toast } = useToast();

  const adjectives = [
    'Cool', 'Epic', 'Swift', 'Bright', 'Bold', 'Smart', 'Quick', 'Wild', 'Free', 'Pure',
    'Dark', 'Fire', 'Ice', 'Storm', 'Star', 'Moon', 'Sun', 'Sky', 'Ocean', 'Mountain',
    'Golden', 'Silver', 'Crystal', 'Diamond', 'Ruby', 'Emerald', 'Neon', 'Cosmic', 'Mystic', 'Shadow'
  ];

  const nouns = [
    'Tiger', 'Eagle', 'Wolf', 'Lion', 'Bear', 'Hawk', 'Shark', 'Phoenix', 'Dragon', 'Falcon',
    'Warrior', 'Knight', 'Hunter', 'Ranger', 'Wizard', 'Ninja', 'Pirate', 'Viking', 'Samurai', 'Guardian',
    'Thunder', 'Lightning', 'Blaze', 'Frost', 'Storm', 'Wind', 'Rain', 'Snow', 'Flame', 'Spark'
  ];

  const suffixes = ['X', 'Pro', 'Max', 'Prime', 'Elite', 'Master', 'King', 'Lord', 'Boss', 'Chief'];

  const generateUsernames = () => {
    const usernames: string[] = [];
    const base = baseWord || getRandomElement(nouns);

    // Style 1: Base + Numbers
    for (let i = 0; i < 3; i++) {
      const randomNum = Math.floor(Math.random() * 9999) + 1;
      usernames.push(`${base}${randomNum}`);
    }

    // Style 2: Adjective + Base
    for (let i = 0; i < 3; i++) {
      const adj = getRandomElement(adjectives);
      usernames.push(`${adj}${base}`);
    }

    // Style 3: Base + Suffix
    for (let i = 0; i < 2; i++) {
      const suffix = getRandomElement(suffixes);
      usernames.push(`${base}${suffix}`);
    }

    // Style 4: Adjective + Base + Numbers
    for (let i = 0; i < 2; i++) {
      const adj = getRandomElement(adjectives);
      const num = Math.floor(Math.random() * 99) + 1;
      usernames.push(`${adj}${base}${num}`);
    }

    // Style 5: Underscore variations
    const adj = getRandomElement(adjectives);
    usernames.push(`${adj}_${base}`);
    usernames.push(`${base}_${Math.floor(Math.random() * 999) + 1}`);

    // Style 6: Mixed case and special characters
    usernames.push(base.toLowerCase() + getRandomElement(suffixes).toLowerCase());
    usernames.push((getRandomElement(adjectives) + base).toLowerCase());

    setGeneratedUsernames(usernames);
  };

  const getRandomElement = (array: string[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const copyUsername = (username: string) => {
    navigator.clipboard.writeText(username);
    toast({
      title: "Copied!",
      description: `Username "${username}" copied to clipboard.`,
    });
  };

  const generateWithoutBase = () => {
    setBaseWord('');
    generateUsernames();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Username Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Generate unique and creative usernames for social media, gaming, and online accounts. Create memorable handles that stand out.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Multiple Styles</Badge>
              <Badge variant="secondary">Custom Base Word</Badge>
              <Badge variant="secondary">Instant Copy</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Generator Settings
                </CardTitle>
                <CardDescription>
                  Customize your username generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="base-word">Base Word (Optional)</Label>
                  <Input
                    id="base-word"
                    placeholder="Enter a word or leave blank"
                    value={baseWord}
                    onChange={(e) => setBaseWord(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use your name, hobby, or any word as a starting point
                  </p>
                </div>

                <div className="space-y-2">
                  <Button onClick={generateUsernames} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate Usernames
                  </Button>
                  <Button onClick={generateWithoutBase} variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Random Generate
                  </Button>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg text-sm">
                  <h4 className="font-semibold mb-2">Generation Styles:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Word + Numbers</li>
                    <li>• Adjective + Word</li>
                    <li>• Word + Suffix</li>
                    <li>• Mixed variations</li>
                    <li>• Underscore styles</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Usernames</CardTitle>
                  <CardDescription>
                    Click any username to copy it to your clipboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedUsernames.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {generatedUsernames.map((username, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors"
                          onClick={() => copyUsername(username)}
                        >
                          <span className="font-medium text-gray-900">{username}</span>
                          <Copy className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Click "Generate Usernames" to create unique username suggestions</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {generatedUsernames.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Username Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">Best Practices:</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Keep it memorable and pronounceable</li>
                          <li>• Avoid confusing characters (0, O, l, I)</li>
                          <li>• Check availability on multiple platforms</li>
                          <li>• Consider trademark issues</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Security Tips:</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Don't use personal information</li>
                          <li>• Avoid sequential numbers (123, 456)</li>
                          <li>• Use different usernames for different purposes</li>
                          <li>• Consider privacy implications</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UsernameGenerator;
