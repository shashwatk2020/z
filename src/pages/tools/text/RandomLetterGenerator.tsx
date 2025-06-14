
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RandomLetterGenerator = () => {
  const [count, setCount] = useState(10);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [letters, setLetters] = useState('');
  const { toast } = useToast();

  const generateLetters = () => {
    let characters = '';
    if (includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
    
    if (characters === '') {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive"
      });
      return;
    }

    let result = '';
    for (let i = 0; i < count; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setLetters(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letters);
    toast({
      title: "Copied!",
      description: "Letters copied to clipboard",
    });
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Random Letter Generator</h1>
            <p className="mt-4 text-lg text-gray-600">
              Generate random letters for games, passwords, or testing purposes
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Generate Random Letters</CardTitle>
              <CardDescription>
                Customize your random letter generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="count">Number of Letters</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="1000"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="space-y-4">
                <Label>Character Types</Label>
                <div className="space-y-3">
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
                </div>
              </div>

              <Button onClick={generateLetters} className="w-full" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Letters
              </Button>

              {letters && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Generated Letters:</h3>
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-mono text-lg break-all">{letters}</p>
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

export default RandomLetterGenerator;
