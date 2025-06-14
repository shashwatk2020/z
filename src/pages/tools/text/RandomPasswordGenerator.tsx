import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RandomPasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [count, setCount] = useState(1);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [passwords, setPasswords] = useState<string[]>([]);
  const { toast } = useToast();

  const generatePasswords = () => {
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

    let generatedPasswords: string[] = [];
    for (let i = 0; i < count; i++) {
      let password = '';
      for (let j = 0; j < length; j++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      generatedPasswords.push(password);
    }
    setPasswords(generatedPasswords);
  };

  const copyToClipboard = (password: string) => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    });
  };

  const copyAllPasswords = () => {
    navigator.clipboard.writeText(passwords.join('\n'));
    toast({
      title: "Copied!",
      description: "All passwords copied to clipboard",
    });
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Random Password Generator</h1>
            <p className="mt-4 text-lg text-gray-600">
              Generate secure, random passwords with customizable options for maximum security
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Generate Password</CardTitle>
              <CardDescription>
                Customize your password requirements and generate a secure password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length">Password Length</Label>
                    <Input
                      id="length"
                      type="number"
                      min="4"
                      max="100"
                      value={length}
                      onChange={(e) => setLength(parseInt(e.target.value) || 12)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="count">Number of Passwords</Label>
                    <Input
                      id="count"
                      type="number"
                      min="1"
                      max="10"
                      value={count}
                      onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Character Types</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="uppercase"
                        checked={includeUppercase}
                        onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
                      />
                      <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lowercase"
                        checked={includeLowercase}
                        onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
                      />
                      <Label htmlFor="lowercase">Lowercase (a-z)</Label>
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
                  <Label className="text-base font-semibold">Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="excludeSimilar"
                        checked={excludeSimilar}
                        onCheckedChange={(checked) => setExcludeSimilar(checked === true)}
                      />
                      <Label htmlFor="excludeSimilar">Exclude similar characters (i, l, 1, L, o, 0, O)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="excludeAmbiguous"
                        checked={excludeAmbiguous}
                        onCheckedChange={(checked) => setExcludeAmbiguous(checked === true)}
                      />
                      <Label htmlFor="excludeAmbiguous">Exclude ambiguous characters</Label>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={generatePasswords} className="w-full" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Password{count > 1 ? 's' : ''}
              </Button>

              {passwords.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Generated Password{passwords.length > 1 ? 's' : ''}:</h3>
                    <Button onClick={copyAllPasswords} variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {passwords.map((password, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <code className="font-mono text-sm break-all flex-1 mr-4">{password}</code>
                        <Button
                          onClick={() => copyToClipboard(password)}
                          variant="ghost"
                          size="sm"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
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

export default RandomPasswordGenerator;
