
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Lock, ArrowLeft, Plus, Search, Eye, EyeOff, Copy, Trash2, Shield, AlertTriangle } from 'lucide-react';

interface PasswordEntry {
  id: string;
  website: string;
  username: string;
  password: string;
  category: string;
  notes: string;
  strength: 'weak' | 'medium' | 'strong';
  lastUpdated: string;
  createdAt: string;
}

const PasswordOrganizer = () => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([
    {
      id: '1',
      website: 'github.com',
      username: 'john.doe@email.com',
      password: 'SecurePass123!',
      category: 'development',
      notes: 'Main GitHub account for work projects',
      strength: 'strong',
      lastUpdated: '2024-01-15T10:00:00Z',
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      id: '2',
      website: 'gmail.com',
      username: 'personal@gmail.com',
      password: 'weakpass',
      category: 'personal',
      notes: 'Personal email account',
      strength: 'weak',
      lastUpdated: '2024-01-12T14:30:00Z',
      createdAt: '2024-01-12T14:30:00Z'
    }
  ]);

  const [newPassword, setNewPassword] = useState({
    website: '',
    username: '',
    password: '',
    category: 'personal',
    notes: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  const categories = ['all', 'personal', 'work', 'development', 'social', 'finance', 'shopping', 'other'];

  const calculatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const criteria = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (criteria >= 3 && password.length >= 12) return 'strong';
    if (criteria >= 2 && password.length >= 8) return 'medium';
    return 'weak';
  };

  const addPassword = () => {
    if (!newPassword.website.trim() || !newPassword.username.trim() || !newPassword.password.trim()) return;

    const passwordEntry: PasswordEntry = {
      id: Date.now().toString(),
      website: newPassword.website,
      username: newPassword.username,
      password: newPassword.password,
      category: newPassword.category,
      notes: newPassword.notes,
      strength: calculatePasswordStrength(newPassword.password),
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setPasswords([passwordEntry, ...passwords]);
    setNewPassword({ website: '', username: '', password: '', category: 'personal', notes: '' });
  };

  const deletePassword = (passwordId: string) => {
    setPasswords(passwords.filter(password => password.id !== passwordId));
  };

  const togglePasswordVisibility = (passwordId: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(passwordId)) {
      newVisible.delete(passwordId);
    } else {
      newVisible.add(passwordId);
    }
    setVisiblePasswords(newVisible);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generatePassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewPassword({...newPassword, password});
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'strong': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredPasswords = passwords.filter(password => {
    const matchesSearch = password.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || password.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link to="/tools/productivity" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Productivity Tools
              </Link>
              <div className="flex items-center space-x-3">
                <Lock className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Password Organizer</h1>
                  <p className="text-gray-600">Securely organize and manage your passwords</p>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 text-sm">
                  <strong>Security Notice:</strong> This is a demo tool. For actual password management, use dedicated password managers like 1Password, Bitwarden, or LastPass.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Add Password Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="h-5 w-5 mr-2" />
                      Add Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="website">Website/Service *</Label>
                      <Input
                        id="website"
                        value={newPassword.website}
                        onChange={(e) => setNewPassword({...newPassword, website: e.target.value})}
                        placeholder="example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username/Email *</Label>
                      <Input
                        id="username"
                        value={newPassword.username}
                        onChange={(e) => setNewPassword({...newPassword, username: e.target.value})}
                        placeholder="username or email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="password"
                          type="password"
                          value={newPassword.password}
                          onChange={(e) => setNewPassword({...newPassword, password: e.target.value})}
                          placeholder="Enter password"
                        />
                        <Button type="button" variant="outline" size="sm" onClick={generatePassword}>
                          <Shield className="h-4 w-4" />
                        </Button>
                      </div>
                      {newPassword.password && (
                        <Badge className={`mt-2 ${getStrengthColor(calculatePasswordStrength(newPassword.password))}`}>
                          {calculatePasswordStrength(newPassword.password)} strength
                        </Badge>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newPassword.category} onValueChange={(value) => setNewPassword({...newPassword, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="shopping">Shopping</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newPassword.notes}
                        onChange={(e) => setNewPassword({...newPassword, notes: e.target.value})}
                        placeholder="Optional notes"
                        rows={3}
                      />
                    </div>
                    <Button 
                      onClick={addPassword} 
                      className="w-full" 
                      disabled={!newPassword.website.trim() || !newPassword.username.trim() || !newPassword.password.trim()}
                    >
                      Add Password
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Passwords List */}
              <div className="lg:col-span-3 space-y-6">
                {/* Search and Filter */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search passwords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Passwords Grid */}
                {filteredPasswords.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {passwords.length === 0 ? 'No passwords yet. Add your first password!' : 'No passwords match your search criteria.'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredPasswords.map((password) => (
                      <Card key={password.id} className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{password.website}</h3>
                                  <p className="text-sm text-gray-600">{password.username}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className={getStrengthColor(password.strength)}>
                                    {password.strength}
                                  </Badge>
                                  <Badge variant="outline">{password.category}</Badge>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 mb-3">
                                <div className="flex-1 flex items-center space-x-2">
                                  <Input
                                    type={visiblePasswords.has(password.id) ? 'text' : 'password'}
                                    value={password.password}
                                    readOnly
                                    className="bg-gray-50 font-mono text-sm"
                                  />
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => togglePasswordVisibility(password.id)}
                                  >
                                    {visiblePasswords.has(password.id) ? 
                                      <EyeOff className="h-4 w-4" /> : 
                                      <Eye className="h-4 w-4" />
                                    }
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => copyToClipboard(password.password)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deletePassword(password.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              {password.notes && (
                                <p className="text-sm text-gray-600 mb-3">{password.notes}</p>
                              )}

                              <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>Created: {new Date(password.createdAt).toLocaleDateString()}</span>
                                <span>Updated: {new Date(password.lastUpdated).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PasswordOrganizer;
