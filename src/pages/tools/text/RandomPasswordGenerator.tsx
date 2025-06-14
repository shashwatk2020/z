
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { Copy, RefreshCw, Shield, Eye, EyeOff } from 'lucide-react';

const RandomPasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState([12]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [customChars, setCustomChars] = useState('');
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);

  const generatePassword = () => {
    let charset = '';
    
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (customChars) charset += customChars;
    
    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }
    
    if (excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()\/\\'"~,;<>.]/g, '');
    }
    
    if (!charset) {
      toast({
        title: "Error",
        description: "Please select at least one character type.",
        variant: "destructive"
      });
      return;
    }
    
    let result = '';
    const array = new Uint8Array(length[0]);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(array[i] % charset.length);
    }
    
    setPassword(result);
    setPasswordHistory(prev => [result, ...prev.slice(0, 9)]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard.",
    });
  };

  const getStrengthScore = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const getStrengthText = (score: number) => {
    if (score <= 2) return { text: 'Weak', color: 'text-red-500' };
    if (score <= 4) return { text: 'Medium', color: 'text-yellow-500' };
    return { text: 'Strong', color: 'text-green-500' };
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Random Password Generator
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Generate secure, random passwords with customizable options for any use case.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Password Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="length">Password Length: {length[0]}</Label>
                      <Slider
                        id="length"
                        min={4}
                        max={100}
                        step={1}
                        value={length}
                        onValueChange={setLength}
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="uppercase"
                          checked={includeUppercase}
                          onCheckedChange={setIncludeUppercase}
                        />
                        <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="lowercase"
                          checked={includeLowercase}
                          onCheckedChange={setIncludeLowercase}
                        />
                        <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="numbers"
                          checked={includeNumbers}
                          onCheckedChange={setIncludeNumbers}
                        />
                        <Label htmlFor="numbers">Numbers (0-9)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="symbols"
                          checked={includeSymbols}
                          onCheckedChange={setIncludeSymbols}
                        />
                        <Label htmlFor="symbols">Symbols (!@#$...)</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="excludeSimilar"
                          checked={excludeSimilar}
                          onCheckedChange={setExcludeSimilar}
                        />
                        <Label htmlFor="excludeSimilar">Exclude Similar (il1Lo0O)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="excludeAmbiguous"
                          checked={excludeAmbiguous}
                          onCheckedChange={setExcludeAmbiguous}
                        />
                        <Label htmlFor="excludeAmbiguous">Exclude Ambiguous</Label>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="customChars">Custom Characters (Optional)</Label>
                      <Input
                        id="customChars"
                        value={customChars}
                        onChange={(e) => setCustomChars(e.target.value)}
                        placeholder="Add your own characters..."
                        className="mt-1"
                      />
                    </div>

                    <Button onClick={generatePassword} className="w-full" size="lg">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Password
                    </Button>

                    {password && (
                      <div className="space-y-4">
                        <div>
                          <Label>Generated Password</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input
                              value={password}
                              readOnly
                              type={showPassword ? 'text' : 'password'}
                              className="font-mono"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(password)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label>Password Strength</Label>
                          <div className={`mt-1 font-semibold ${getStrengthText(getStrengthScore(password)).color}`}>
                            {getStrengthText(getStrengthScore(password)).text}
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
                    <CardTitle>Password History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {passwordHistory.length === 0 ? (
                      <p className="text-gray-500 text-sm">No passwords generated yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {passwordHistory.map((pwd, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="font-mono text-sm truncate flex-1">{pwd}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(pwd)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Password Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>• Use at least 12 characters</p>
                    <p>• Include multiple character types</p>
                    <p>• Avoid dictionary words</p>
                    <p>• Use unique passwords for each account</p>
                    <p>• Consider using a password manager</p>
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

export default RandomPasswordGenerator;
