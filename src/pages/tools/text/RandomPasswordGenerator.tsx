
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Copy, RefreshCw, Shield, Eye, EyeOff, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RandomPasswordGenerator = () => {
  const [length, setLength] = useState([12]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [customChars, setCustomChars] = useState('');
  const [mustInclude, setMustInclude] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');
  const [passwords, setPasswords] = useState<string[]>([]);
  const [batchCount, setBatchCount] = useState('5');
  const { toast } = useToast();

  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const similarChars = 'il1Lo0O';
  const ambiguousChars = '{}[]()/\\\'"`~,;.<>';

  const calculateStrength = (pass: string) => {
    let score = 0;
    const checks = {
      length: pass.length >= 12,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      numbers: /[0-9]/.test(pass),
      symbols: /[^A-Za-z0-9]/.test(pass),
      noRepeats: !/(.)\1{2,}/.test(pass),
      noSequence: !/(?:abc|bcd|cde|123|234|345|qwe|wer|ert)/i.test(pass)
    };

    score += checks.length ? 25 : pass.length >= 8 ? 15 : pass.length >= 6 ? 10 : 5;
    score += checks.uppercase ? 10 : 0;
    score += checks.lowercase ? 10 : 0;
    score += checks.numbers ? 10 : 0;
    score += checks.symbols ? 15 : 0;
    score += checks.noRepeats ? 10 : 0;
    score += checks.noSequence ? 10 : 0;
    score += pass.length >= 16 ? 10 : 0;

    let label = '';
    if (score >= 90) label = 'Very Strong';
    else if (score >= 70) label = 'Strong';
    else if (score >= 50) label = 'Moderate';
    else if (score >= 30) label = 'Weak';
    else label = 'Very Weak';

    return { score: Math.min(100, score), label };
  };

  const generatePassword = () => {
    let charset = '';
    
    if (customChars.trim()) {
      charset = customChars;
    } else {
      if (includeUppercase) charset += uppercase;
      if (includeLowercase) charset += lowercase;
      if (includeNumbers) charset += numbers;
      if (includeSymbols) charset += symbols;
    }

    if (excludeSimilar) {
      charset = charset.split('').filter(char => !similarChars.includes(char)).join('');
    }
    
    if (excludeAmbiguous) {
      charset = charset.split('').filter(char => !ambiguousChars.includes(char)).join('');
    }

    if (!charset) {
      toast({
        title: "No Characters Available",
        description: "Please select at least one character type",
        variant: "destructive"
      });
      return;
    }

    let generatedPassword = '';
    const passwordLength = length[0];

    // Ensure at least one character from each selected type
    const requiredChars = [];
    if (includeUppercase && !customChars) requiredChars.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
    if (includeLowercase && !customChars) requiredChars.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
    if (includeNumbers && !customChars) requiredChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
    if (includeSymbols && !customChars) requiredChars.push(symbols[Math.floor(Math.random() * symbols.length)]);

    // Add must-include characters
    if (mustInclude) {
      requiredChars.push(...mustInclude.split(''));
    }

    // Fill the rest randomly
    for (let i = requiredChars.length; i < passwordLength; i++) {
      requiredChars.push(charset[Math.floor(Math.random() * charset.length)]);
    }

    // Shuffle the array
    for (let i = requiredChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [requiredChars[i], requiredChars[j]] = [requiredChars[j], requiredChars[i]];
    }

    generatedPassword = requiredChars.slice(0, passwordLength).join('');
    
    const strengthResult = calculateStrength(generatedPassword);
    setPassword(generatedPassword);
    setStrength(strengthResult.score);
    setStrengthLabel(strengthResult.label);
  };

  const generateBatch = () => {
    const count = parseInt(batchCount);
    if (isNaN(count) || count < 1 || count > 100) {
      toast({
        title: "Invalid Count",
        description: "Please enter a number between 1 and 100",
        variant: "destructive"
      });
      return;
    }

    const newPasswords = [];
    for (let i = 0; i < count; i++) {
      // Generate password with current settings
      let charset = '';
      if (customChars.trim()) {
        charset = customChars;
      } else {
        if (includeUppercase) charset += uppercase;
        if (includeLowercase) charset += lowercase;
        if (includeNumbers) charset += numbers;
        if (includeSymbols) charset += symbols;
      }

      if (excludeSimilar) {
        charset = charset.split('').filter(char => !similarChars.includes(char)).join('');
      }
      
      if (excludeAmbiguous) {
        charset = charset.split('').filter(char => !ambiguousChars.includes(char)).join('');
      }

      if (charset) {
        let pass = '';
        for (let j = 0; j < length[0]; j++) {
          pass += charset[Math.floor(Math.random() * charset.length)];
        }
        newPasswords.push(pass);
      }
    }
    
    setPasswords(newPasswords);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard"
    });
  };

  const downloadPasswords = () => {
    const content = passwords.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passwords.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStrengthColor = () => {
    if (strength >= 90) return 'bg-green-500';
    if (strength >= 70) return 'bg-blue-500';
    if (strength >= 50) return 'bg-yellow-500';
    if (strength >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Password Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Generate secure, customizable passwords with strength analysis and batch generation capabilities.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password Settings</CardTitle>
                  <CardDescription>Customize your password generation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Password Length</Label>
                      <Badge variant="secondary">{length[0]} characters</Badge>
                    </div>
                    <Slider
                      value={length}
                      onValueChange={setLength}
                      max={128}
                      min={4}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Character Types</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="uppercase"
                          checked={includeUppercase}
                          onCheckedChange={setIncludeUppercase}
                        />
                        <Label htmlFor="uppercase">Uppercase letters (A-Z)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="lowercase"
                          checked={includeLowercase}
                          onCheckedChange={setIncludeLowercase}
                        />
                        <Label htmlFor="lowercase">Lowercase letters (a-z)</Label>
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
                        <Label htmlFor="symbols">Symbols (!@#$%^&*)</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Advanced Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="excludeSimilar"
                          checked={excludeSimilar}
                          onCheckedChange={setExcludeSimilar}
                        />
                        <Label htmlFor="excludeSimilar">Exclude similar characters (i, l, 1, L, o, 0, O)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="excludeAmbiguous"
                          checked={excludeAmbiguous}
                          onCheckedChange={setExcludeAmbiguous}
                        />
                        <Label htmlFor="excludeAmbiguous">Exclude ambiguous characters ( {`{ } [ ] ( ) / \\ ' " \` ~`} )</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mustInclude">Must Include Characters</Label>
                    <Input
                      id="mustInclude"
                      value={mustInclude}
                      onChange={(e) => setMustInclude(e.target.value)}
                      placeholder="Characters that must be included"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customChars">Custom Character Set</Label>
                    <Input
                      id="customChars"
                      value={customChars}
                      onChange={(e) => setCustomChars(e.target.value)}
                      placeholder="Override with custom characters"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Batch Generation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="batchCount">Number of Passwords</Label>
                      <Input
                        id="batchCount"
                        value={batchCount}
                        onChange={(e) => setBatchCount(e.target.value)}
                        type="number"
                        min="1"
                        max="100"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={generateBatch}>
                        Generate Batch
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Password</CardTitle>
                  <CardDescription>Your secure password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button onClick={generatePassword} className="flex-1">
                      <Shield className="h-4 w-4 mr-2" />
                      Generate Password
                    </Button>
                    <Button variant="outline" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Password:</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(password)} disabled={!password}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border font-mono text-lg break-all">
                      {password ? (showPassword ? password : '•'.repeat(password.length)) : 'Click generate to create password'}
                    </div>
                  </div>
                  
                  {password && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Strength:</span>
                        <Badge variant={strength >= 70 ? 'default' : strength >= 50 ? 'secondary' : 'destructive'}>
                          {strengthLabel}
                        </Badge>
                      </div>
                      <Progress value={strength} className={`h-2 ${getStrengthColor()}`} />
                      <div className="text-xs text-gray-500">{strength}/100</div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {passwords.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Batch Passwords</CardTitle>
                    <CardDescription>
                      Generated {passwords.length} passwords
                      <Button variant="outline" size="sm" className="ml-2" onClick={downloadPasswords}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {passwords.map((pass, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <span className="font-mono">{showPassword ? pass : '•'.repeat(pass.length)}</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(pass)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
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

export default RandomPasswordGenerator;
