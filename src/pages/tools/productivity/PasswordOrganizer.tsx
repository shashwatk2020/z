
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus, Trash2, Search, Eye, EyeOff, Copy, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PasswordEntry {
  id: number;
  title: string;
  username: string;
  password: string;
  website: string;
  category: string;
  notes: string;
  dateAdded: Date;
  lastUpdated: Date;
  strength: 'weak' | 'medium' | 'strong';
}

const PasswordOrganizer = () => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});
  const [newPassword, setNewPassword] = useState({
    title: '',
    username: '',
    password: '',
    website: '',
    category: 'Personal',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedPasswords = localStorage.getItem('passwordOrganizer');
    if (savedPasswords) {
      setPasswords(JSON.parse(savedPasswords));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('passwordOrganizer', JSON.stringify(passwords));
  }, [passwords]);

  const calculatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  };

  const generatePassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewPassword({ ...newPassword, password });
  };

  const addPassword = () => {
    if (!newPassword.title.trim() || !newPassword.username.trim() || !newPassword.password.trim()) {
      toast({
        title: "Error",
        description: "Please enter title, username, and password",
        variant: "destructive"
      });
      return;
    }

    const passwordEntry: PasswordEntry = {
      id: Date.now(),
      title: newPassword.title,
      username: newPassword.username,
      password: newPassword.password,
      website: newPassword.website,
      category: newPassword.category,
      notes: newPassword.notes,
      dateAdded: new Date(),
      lastUpdated: new Date(),
      strength: calculatePasswordStrength(newPassword.password)
    };

    setPasswords([passwordEntry, ...passwords]);
    setNewPassword({
      title: '',
      username: '',
      password: '',
      website: '',
      category: 'Personal',
      notes: ''
    });

    toast({
      title: "Success",
      description: "Password entry added successfully"
    });
  };

  const deletePassword = (id: number) => {
    setPasswords(passwords.filter(password => password.id !== id));
    toast({
      title: "Success",
      description: "Password entry deleted successfully"
    });
  };

  const togglePasswordVisibility = (id: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`
      });
    });
  };

  const filteredPasswords = passwords.filter(password => {
    const matchesSearch = 
      password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.website.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || password.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(passwords.map(password => password.category))];
  
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'weak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const weakPasswords = passwords.filter(p => p.strength === 'weak').length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Password Organizer
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Securely organize and manage your passwords with strength analysis and categories.
          </p>
          
          {/* Security Warning */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              <div className="text-sm">
                <strong>Security Notice:</strong> This tool stores passwords locally in your browser. 
                For maximum security, consider using a dedicated password manager.
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{passwords.length}</div>
              <div className="text-sm text-gray-600">Total Passwords</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {passwords.filter(p => p.strength === 'strong').length}
              </div>
              <div className="text-sm text-gray-600">Strong</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {passwords.filter(p => p.strength === 'medium').length}
              </div>
              <div className="text-sm text-gray-600">Medium</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{weakPasswords}</div>
              <div className="text-sm text-gray-600">Weak</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Password */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    placeholder="Gmail Account"
                    value={newPassword.title}
                    onChange={(e) => setNewPassword({ ...newPassword, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Username/Email *</Label>
                  <Input
                    placeholder="user@example.com"
                    value={newPassword.username}
                    onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Password *</Label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={newPassword.password}
                      onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                    />
                    <Button
                      type="button"
                      onClick={generatePassword}
                      variant="outline"
                      size="sm"
                    >
                      Generate
                    </Button>
                  </div>
                  {newPassword.password && (
                    <div className="mt-1">
                      <Badge className={getStrengthColor(calculatePasswordStrength(newPassword.password))}>
                        {calculatePasswordStrength(newPassword.password)} password
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Website</Label>
                    <Input
                      placeholder="gmail.com"
                      value={newPassword.website}
                      onChange={(e) => setNewPassword({ ...newPassword, website: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>Category</Label>
                    <Input
                      placeholder="Personal, Work..."
                      value={newPassword.category}
                      onChange={(e) => setNewPassword({ ...newPassword, category: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Additional notes or security questions"
                    value={newPassword.notes}
                    onChange={(e) => setNewPassword({ ...newPassword, notes: e.target.value })}
                  />
                </div>

                <Button onClick={addPassword} className="w-full">
                  Add Password
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Passwords List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Your Passwords
                </CardTitle>
                
                {/* Search and Filter */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search passwords..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category === 'all' ? 'All Passwords' : category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredPasswords.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No passwords found matching your search' : 'No passwords added yet'}
                    </div>
                  ) : (
                    filteredPasswords.map((password) => (
                      <div key={password.id} className="p-4 border rounded-lg bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium">{password.title}</h4>
                            {password.website && (
                              <div className="text-sm text-gray-600">{password.website}</div>
                            )}
                          </div>
                          <Button
                            onClick={() => deletePassword(password.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Username:</span>
                            <span className="text-sm text-gray-600">{password.username}</span>
                            <Button
                              onClick={() => copyToClipboard(password.username, 'Username')}
                              variant="ghost"
                              size="sm"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Password:</span>
                            <span className="text-sm text-gray-600 font-mono">
                              {showPasswords[password.id] ? password.password : '••••••••'}
                            </span>
                            <Button
                              onClick={() => togglePasswordVisibility(password.id)}
                              variant="ghost"
                              size="sm"
                            >
                              {showPasswords[password.id] ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              onClick={() => copyToClipboard(password.password, 'Password')}
                              variant="ghost"
                              size="sm"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {password.notes && (
                          <p className="text-sm text-gray-600 mb-3 italic">
                            {password.notes}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{password.category}</Badge>
                          <Badge className={getStrengthColor(password.strength)}>
                            {password.strength}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Added: {new Date(password.dateAdded).toLocaleDateString()}
                          <span className="ml-4">
                            Updated: {new Date(password.lastUpdated).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PasswordOrganizer;
