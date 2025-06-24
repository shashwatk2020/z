
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Contact, ArrowLeft, Plus, Search, Mail, Phone, Building } from 'lucide-react';

interface ContactInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  category: string;
  tags: string[];
  notes: string;
  dateAdded: string;
}

const ContactManager = () => {
  const [contacts, setContacts] = useState<ContactInfo[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Corp',
      position: 'Senior Developer',
      category: 'work',
      tags: ['developer', 'team-lead'],
      notes: 'Lead developer on the main project',
      dateAdded: '2024-01-10T10:00:00Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 987-6543',
      company: 'Freelance',
      position: 'Designer',
      category: 'client',
      tags: ['designer', 'ui-ux'],
      notes: 'Excellent UI/UX designer, worked on mobile app',
      dateAdded: '2024-01-12T14:30:00Z'
    }
  ]);

  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    category: 'work',
    tags: '',
    notes: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'work', 'client', 'personal', 'vendor', 'other'];

  const addContact = () => {
    if (!newContact.name.trim() || !newContact.email.trim()) return;

    const contact: ContactInfo = {
      id: Date.now().toString(),
      ...newContact,
      tags: newContact.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      dateAdded: new Date().toISOString()
    };

    setContacts([contact, ...contacts]);
    setNewContact({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      category: 'work',
      tags: '',
      notes: ''
    });
  };

  const deleteContact = (contactId: string) => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || contact.category === selectedCategory;
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
                <Contact className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Contact Manager</h1>
                  <p className="text-gray-600">Manage contacts with detailed information and categories</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Add Contact Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="h-5 w-5 mr-2" />
                      Add Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={newContact.name}
                        onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newContact.email}
                        onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={newContact.company}
                        onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={newContact.position}
                        onChange={(e) => setNewContact({...newContact, position: e.target.value})}
                        placeholder="Job title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newContact.category} onValueChange={(value) => setNewContact({...newContact, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="vendor">Vendor</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={newContact.tags}
                        onChange={(e) => setNewContact({...newContact, tags: e.target.value})}
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Input
                        id="notes"
                        value={newContact.notes}
                        onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                        placeholder="Additional notes"
                      />
                    </div>
                    <Button 
                      onClick={addContact} 
                      className="w-full" 
                      disabled={!newContact.name.trim() || !newContact.email.trim()}
                    >
                      Add Contact
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Contact List */}
              <div className="lg:col-span-3 space-y-6">
                {/* Search and Filter */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search contacts..."
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

                {/* Contacts Grid */}
                {filteredContacts.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Contact className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {contacts.length === 0 ? 'No contacts yet. Add your first contact!' : 'No contacts match your search criteria.'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredContacts.map((contact) => (
                      <Card key={contact.id} className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {getInitials(contact.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                                  {contact.position && contact.company && (
                                    <p className="text-sm text-gray-600 truncate">
                                      {contact.position} at {contact.company}
                                    </p>
                                  )}
                                </div>
                                <Badge variant="outline" className="ml-2 flex-shrink-0">
                                  {contact.category}
                                </Badge>
                              </div>
                              
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                                  <span className="truncate">{contact.email}</span>
                                </div>
                                {contact.phone && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <span>{contact.phone}</span>
                                  </div>
                                )}
                                {contact.company && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <span className="truncate">{contact.company}</span>
                                  </div>
                                )}
                              </div>

                              {contact.tags.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1">
                                  {contact.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {contact.notes && (
                                <p className="mt-3 text-sm text-gray-500 line-clamp-2">{contact.notes}</p>
                              )}

                              <div className="mt-4 flex items-center justify-between">
                                <span className="text-xs text-gray-400">
                                  Added {new Date(contact.dateAdded).toLocaleDateString()}
                                </span>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteContact(contact.id)}
                                >
                                  Delete
                                </Button>
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

export default ContactManager;
