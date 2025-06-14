
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Copy, RefreshCw, Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StrongPasswordGenerator = () => {
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [strength, setStrength] = useState('');
  const { toast } = useToast();

  const generatePassword = () => {
    let charset = '';
    
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }
    
    if (excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()\/\\'"~,;.<>]/g, '');
    }
    
    if (charset === '') {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive"
      });
      return;
    }

    let result = '';
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(result);
    calculateStrength(result);
  };

  const calculateStrength = (pass: string) => {
    let score = 0;
    
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    if (pass.length >= 16) score += 1;
    
    if (score <= 2) setStrength('Weak');
    else if (score <= 4) setStrength('Medium');
    else if (score <= 5) setStrength('Strong');
    else setStrength('Very Strong');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    });
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 'Weak': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Strong': return 'text-blue-600 bg-blue-100';
      case 'Very Strong': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Strong Password Generator</h1>
            <p className="mt-4 text-lg text-gray-600">
              Create secure passwords with custom rules and advanced options
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Generate Strong Password</CardTitle>
              <CardDescription>
                Customize your password requirements for maximum security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Password Length: {length[0]}</Label>
                  <Slider
                    value={length}
                    onValueChange={setLength}
                    max={64}
                    min={4}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>4</span>
                    <span>64</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Include Characters</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="uppercase"
                          checked={includeUppercase}
                          onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
                        />
                        <Label htmlFor="uppercase">Uppercase Letters (A-Z)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="lowercase"
                          checked={includeLowercase}
                          onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
                        />
                        <Label htmlFor="lowercase">Lowercase Letters (a-z)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="numbers"
                          checked={includeNumbers}
                          onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
                        />
                        <Label htmlFor="numbers">Numbers (0-9)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="symbols"
                          checked={includeSymbols}
                          onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
                        />
                        <Label htmlFor="symbols">Symbols (!@#$%^&*)</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Advanced Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="excludeSimilar"
                          checked={excludeSimilar}
                          onCheckedChange={(checked) => setExcludeSimilar(checked === true)}
                        />
                        <Label htmlFor="excludeSimilar">Exclude Similar (i, l, 1, L, o, 0, O)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="excludeAmbiguous"
                          checked={excludeAmbiguous}
                          onCheckedChange={(checked) => setExcludeAmbiguous(checked === true)}
                        />
                        <Label htmlFor="excludeAmbiguous">Exclude Ambiguous ({`{ } [ ] ( ) / \\ ' " ~ , ; . < >`})</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={generatePassword} className="w-full" size="lg">
                <Shield className="mr-2 h-4 w-4" />
                Generate Strong Password
              </Button>

              {password && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Generated Password:</h3>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setShowPassword(!showPassword)}
                        variant="outline"
                        size="sm"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button onClick={copyToClipboard} variant="outline" size="sm">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className={`font-mono text-lg break-all ${showPassword ? '' : 'filter blur-sm'}`}>
                      {password}
                    </p>
                  </div>

                  {strength && (
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">Strength:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStrengthColor()}`}>
                        {strength}
                      </span>
                    </div>
                  )}

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Length: {password.length} characters</p>
                    <p>Entropy: ~{Math.floor(Math.log2(Math.pow(password.length, 4)))} bits</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default StrongPasswordGenerator;
