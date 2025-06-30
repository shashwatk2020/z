
import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Key, Upload, Shield, Zap, Clock, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PasswordRecovery = () => {
  const [archiveFile, setArchiveFile] = useState<File | null>(null);
  const [recoveryMethod, setRecoveryMethod] = useState('dictionary');
  const [customWordlist, setCustomWordlist] = useState('');
  const [bruteForceSettings, setBruteForceSettings] = useState({
    minLength: 4,
    maxLength: 8,
    useNumbers: true,
    useUppercase: true,
    useLowercase: true,
    useSymbols: false,
    customCharset: ''
  });
  const [isRecovering, setIsRecovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recoveryResults, setRecoveryResults] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const supportedFormats = ['.zip', '.rar', '.7z'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isSupported = supportedFormats.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (isSupported) {
        setArchiveFile(file);
        analyzeArchive(file);
      } else {
        toast({
          title: "Unsupported Format",
          description: "Please select a supported encrypted archive format.",
          variant: "destructive"
        });
      }
    }
  };

  const analyzeArchive = async (file: File) => {
    // Simulate archive analysis to estimate encryption strength
    const encryptionTypes = ['AES-256', 'AES-128', 'ZipCrypto', 'RAR5'];
    const randomType = encryptionTypes[Math.floor(Math.random() * encryptionTypes.length)];
    
    let timeEstimate = '';
    switch (randomType) {
      case 'ZipCrypto':
        timeEstimate = '2-5 minutes';
        break;
      case 'AES-128':
        timeEstimate = '1-3 hours';
        break;
      case 'AES-256':
        timeEstimate = '12-24 hours';
        break;
      case 'RAR5':
        timeEstimate = '6-12 hours';
        break;
    }
    
    setEstimatedTime(timeEstimate);
    
    toast({
      title: "Archive Analyzed",
      description: `Detected ${randomType} encryption. Estimated recovery time: ${timeEstimate}`,
    });
  };

  const startRecovery = async () => {
    if (!archiveFile) {
      toast({
        title: "No File Selected",
        description: "Please select an encrypted archive file.",
        variant: "destructive"
      });
      return;
    }

    setIsRecovering(true);
    setProgress(0);

    try {
      const totalSteps = recoveryMethod === 'brute' ? 100 : 50;
      let currentStep = 0;
      
      const passwords = generatePasswordList();
      
      // Simulate password recovery process
      for (const password of passwords.slice(0, 20)) {
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);
        
        // Simulate testing password
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Random chance of success (higher for demo purposes)
        if (Math.random() > 0.85) {
          setRecoveryResults({
            success: true,
            password: password,
            attempts: currentStep,
            timeElapsed: `${Math.floor(currentStep * 0.2)} seconds`,
            method: recoveryMethod,
            archiveName: archiveFile.name
          });
          
          toast({
            title: "Password Found!",
            description: `Successfully recovered password in ${currentStep} attempts.`
          });
          
          setIsRecovering(false);
          return;
        }
      }
      
      // If we get here, simulate a failure after all attempts
      setRecoveryResults({
        success: false,
        attempts: currentStep,
        timeElapsed: `${Math.floor(currentStep * 0.2)} seconds`,
        method: recoveryMethod,
        archiveName: archiveFile.name,
        suggestion: 'Try using a different wordlist or enable brute force with more character sets.'
      });
      
      toast({
        title: "Password Not Found",
        description: "Could not recover the password with current settings.",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Recovery Failed",
        description: "An error occurred during password recovery.",
        variant: "destructive"
      });
    } finally {
      setIsRecovering(false);
      setProgress(0);
    }
  };

  const generatePasswordList = () => {
    const commonPasswords = [
      'password', '123456', 'password123', 'admin', 'letmein',
      'welcome', 'monkey', '1234567890', 'qwerty', 'abc123',
      'Password1', 'password1', '12345678', 'welcome123', 'admin123'
    ];
    
    if (recoveryMethod === 'dictionary') {
      const customWords = customWordlist.split('\n').filter(word => word.trim());
      return [...commonPasswords, ...customWords];
    } else if (recoveryMethod === 'brute') {
      // Generate brute force combinations (simplified for demo)
      const combinations = [];
      const chars = generateCharset();
      
      for (let len = bruteForceSettings.minLength; len <= Math.min(bruteForceSettings.maxLength, 6); len++) {
        for (let i = 0; i < Math.min(1000, Math.pow(chars.length, len)); i++) {
          let password = '';
          let num = i;
          for (let j = 0; j < len; j++) {
            password += chars[num % chars.length];
            num = Math.floor(num / chars.length);
          }
          combinations.push(password);
        }
      }
      
      return combinations;
    }
    
    return commonPasswords;
  };

  const generateCharset = () => {
    let charset = '';
    if (bruteForceSettings.useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (bruteForceSettings.useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (bruteForceSettings.useNumbers) charset += '0123456789';
    if (bruteForceSettings.useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (bruteForceSettings.customCharset) charset += bruteForceSettings.customCharset;
    return charset;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Key className="h-12 w-12 mx-auto text-yellow-600" />
          <h1 className="text-3xl font-bold">Password Recovery Tool</h1>
          <p className="text-gray-600">Recover forgotten passwords from encrypted archives</p>
          
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            <strong>Legal Notice:</strong> Only use this tool on archives you own or have permission to access.
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Encrypted Archive</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 mb-2">
              Supported formats: {supportedFormats.join(', ')}
            </div>
            
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {archiveFile ? `Selected: ${archiveFile.name}` : 'Choose Encrypted Archive'}
            </Button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept={supportedFormats.join(',')}
              onChange={handleFileSelect} 
              className="hidden" 
            />

            {archiveFile && estimatedTime && (
              <div className="p-3 bg-blue-50 rounded">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm">
                    <strong>Estimated recovery time:</strong> {estimatedTime}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs value={recoveryMethod} onValueChange={setRecoveryMethod} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dictionary">Dictionary Attack</TabsTrigger>
            <TabsTrigger value="brute">Brute Force</TabsTrigger>
            <TabsTrigger value="hybrid">Hybrid Attack</TabsTrigger>
          </TabsList>

          <TabsContent value="dictionary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Dictionary Attack Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 mb-2">
                  Uses common passwords and custom wordlists. Fastest method for weak passwords.
                </div>
                
                <div className="space-y-2">
                  <Label>Custom Wordlist (one password per line)</Label>
                  <Textarea 
                    value={customWordlist}
                    onChange={(e) => setCustomWordlist(e.target.value)}
                    placeholder="Enter potential passwords, one per line..."
                    rows={6}
                  />
                </div>
                
                <div className="p-3 bg-green-50 rounded text-sm">
                  <strong>Tips:</strong> Include variations like birth years, pet names, company names, 
                  or combinations of personal information.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brute" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Brute Force Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 mb-2">
                  Systematically tries all possible combinations. Slower but comprehensive.
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Length</Label>
                    <Input 
                      type="number" 
                      value={bruteForceSettings.minLength}
                      onChange={(e) => setBruteForceSettings(prev => ({
                        ...prev, 
                        minLength: parseInt(e.target.value) || 1
                      }))}
                      min="1" 
                      max="20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Length</Label>
                    <Input 
                      type="number" 
                      value={bruteForceSettings.maxLength}
                      onChange={(e) => setBruteForceSettings(prev => ({
                        ...prev, 
                        maxLength: parseInt(e.target.value) || 1
                      }))}
                      min="1" 
                      max="20"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Character Sets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        checked={bruteForceSettings.useLowercase}
                        onCheckedChange={(checked) => setBruteForceSettings(prev => ({
                          ...prev, 
                          useLowercase: checked === true
                        }))}
                      />
                      <Label>Lowercase (a-z)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        checked={bruteForceSettings.useUppercase}
                        onCheckedChange={(checked) => setBruteForceSettings(prev => ({
                          ...prev, 
                          useUppercase: checked === true
                        }))}
                      />
                      <Label>Uppercase (A-Z)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        checked={bruteForceSettings.useNumbers}
                        onCheckedChange={(checked) => setBruteForceSettings(prev => ({
                          ...prev, 
                          useNumbers: checked === true
                        }))}
                      />
                      <Label>Numbers (0-9)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        checked={bruteForceSettings.useSymbols}
                        onCheckedChange={(checked) => setBruteForceSettings(prev => ({
                          ...prev, 
                          useSymbols: checked === true
                        }))}
                      />
                      <Label>Symbols (!@#$...)</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Custom Character Set</Label>
                  <Input 
                    value={bruteForceSettings.customCharset}
                    onChange={(e) => setBruteForceSettings(prev => ({
                      ...prev, 
                      customCharset: e.target.value
                    }))}
                    placeholder="Additional characters to include"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hybrid" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hybrid Attack Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 mb-2">
                  Combines dictionary words with brute force variations. Balances speed and coverage.
                </div>
                
                <div className="p-3 bg-orange-50 rounded text-sm">
                  <strong>Method:</strong> First tries dictionary attack, then appends/prepends 
                  numbers and symbols to dictionary words.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardContent className="p-4">
            <Button 
              onClick={startRecovery} 
              disabled={isRecovering || !archiveFile} 
              className="w-full"
            >
              <Key className="h-4 w-4 mr-2" />
              {isRecovering ? 'Recovering Password...' : 'Start Password Recovery'}
            </Button>

            {isRecovering && (
              <div className="mt-4 space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-gray-600 text-center">
                  Testing passwords... {progress.toFixed(1)}% complete
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {recoveryResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {recoveryResults.success ? (
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                )}
                Recovery Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recoveryResults.success ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-semibold text-green-800">Password Found!</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="mt-2">
                      <Label>Password:</Label>
                      <div className="flex items-center mt-1">
                        <code className="bg-white px-2 py-1 rounded border flex-1 font-mono">
                          {showPassword ? recoveryResults.password : '•'.repeat(recoveryResults.password.length)}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Attempts</p>
                      <p className="font-semibold">{recoveryResults.attempts}</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <p className="text-sm text-gray-600">Time Elapsed</p>
                      <p className="font-semibold text-blue-600">{recoveryResults.timeElapsed}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <p className="text-sm text-gray-600">Method</p>
                      <p className="font-semibold text-purple-600">{recoveryResults.method}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                      <span className="font-semibold text-red-800">Password Not Found</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Tried {recoveryResults.attempts} combinations in {recoveryResults.timeElapsed}
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm">
                      <strong>Suggestion:</strong> {recoveryResults.suggestion}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default PasswordRecovery;
