
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Trash2, Search, Phone, Mail, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  category: string;
  notes: string;
  favorite: boolean;
  dateAdded: Date;
  lastContacted: Date | null;
}

const ContactManager = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    category: 'Personal',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedContacts = localStorage.getItem('contactManager');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contactManager', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = () => {
    if (!newContact.name.trim() || !newContact.email.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least name and email",
        variant: "destructive"
      });
      return;
    }

    const contact: Contact = {
      id: Date.now(),
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone,
      company: newContact.company,
      position: newContact.position,
      category: newContact.category,
      notes: newContact.notes,
      favorite: false,
      dateAdded: new Date(),
      lastContacted: null
    };

    setContacts([contact, ...contacts]);
    setNewContact({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      category: 'Personal',
      notes: ''
    });

    toast({
      title: "Success",
      description: "Contact added successfully"
    });
  };

  const updateContact = () => {
    if (!editingContact || !editingContact.name.trim() || !editingContact.email.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least name and email",
        variant: "destructive"
      });
      return;
    }

    setContacts(contacts.map(contact => 
      contact.id === editingContact.id ? editingContact : contact
    ));

    setEditingContact(null);
    toast({
      title: "Success",
      description: "Contact updated successfully"
    });
  };

  const deleteContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    setEditingContact(null);
    toast({
      title: "Success",
      description: "Contact deleted successfully"
    });
  };

  const toggleFavorite = (id: number) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, favorite: !contact.favorite } : contact
    ));
  };

  const markAsContacted = (id: number) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, lastContacted: new Date() } : contact
    ));
    toast({
      title: "Success",
      description: "Contact marked as contacted"
    });
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || 
      selectedCategory === 'favorites' ? contact.favorite : 
      contact.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'favorites', ...new Set(contacts.map(contact => contact.category))];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Manager
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Manage your personal and professional contacts with detailed information and organization.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{contacts.length}</div>
              <div className="text-sm text-gray-600">Total Contacts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {contacts.filter(c => c.favorite).length}
              </div>
              <div className="text-sm text-gray-600">Favorites</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {contacts.filter(c => c.company).length}
              </div>
              <div className="text-sm text-gray-600">With Company</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {contacts.filter(c => c.lastContacted).length}
              </div>
              <div className="text-sm text-gray-600">Recently Contacted</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add/Edit Contact */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {editingContact ? 'Edit Contact' : 'Add New Contact'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="John Doe"
                    value={editingContact ? editingContact.name : newContact.name}
                    onChange={(e) => {
                      if (editingContact) {
                        setEditingContact({ ...editingContact, name: e.target.value });
                      } else {
                        setNewContact({ ...newContact, name: e.target.value });
                      }
                    }}
                  />
                </div>
                
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={editingContact ? editingContact.email : newContact.email}
                    onChange={(e) => {
                      if (editingContact) {
                        setEditingContact({ ...editingContact, email: e.target.value });
                      } else {
                        setNewContact({ ...newContact, email: e.target.value });
                      }
                    }}
                  />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={editingContact ? editingContact.phone : newContact.phone}
                    onChange={(e) => {
                      if (editingContact) {
                        setEditingContact({ ...editingContact, phone: e.target.value });
                      } else {
                        setNewContact({ ...newContact, phone: e.target.value });
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company</Label>
                    <Input
                      placeholder="Acme Corp"
                      value={editingContact ? editingContact.company : newContact.company}
                      onChange={(e) => {
                        if (editingContact) {
                          setEditingContact({ ...editingContact, company: e.target.value });
                        } else {
                          setNewContact({ ...newContact, company: e.target.value });
                        }
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label>Position</Label>
                    <Input
                      placeholder="Manager"
                      value={editingContact ? editingContact.position : newContact.position}
                      onChange={(e) => {
                        if (editingContact) {
                          setEditingContact({ ...editingContact, position: e.target.value });
                        } else {
                          setNewContact({ ...newContact, position: e.target.value });
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Label>Category</Label>
                  <Input
                    placeholder="Personal, Work, Client..."
                    value={editingContact ? editingContact.category : newContact.category}
                    onChange={(e) => {
                      if (editingContact) {
                        setEditingContact({ ...editingContact, category: e.target.value });
                      } else {
                        setNewContact({ ...newContact, category: e.target.value });
                      }
                    }}
                  />
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Additional notes about this contact..."
                    value={editingContact ? editingContact.notes : newContact.notes}
                    onChange={(e) => {
                      if (editingContact) {
                        setEditingContact({ ...editingContact, notes: e.target.value });
                      } else {
                        setNewContact({ ...newContact, notes: e.target.value });
                      }
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  {editingContact ? (
                    <>
                      <Button onClick={updateContact} className="flex-1">
                        Update Contact
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingContact(null)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={addContact} className="w-full">
                      Add Contact
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contacts List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contact Directory
                </CardTitle>
                
                {/* Search and Filter */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search contacts..."
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
                        {category === 'all' ? 'All Contacts' : 
                         category === 'favorites' ? 'Favorites' : category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredContacts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No contacts found matching your search' : 'No contacts added yet'}
                    </div>
                  ) : (
                    filteredContacts.map((contact) => (
                      <div key={contact.id} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium cursor-pointer hover:text-blue-600"
                                onClick={() => setEditingContact(contact)}>
                              {contact.name}
                            </h4>
                            {contact.favorite && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              onClick={() => toggleFavorite(contact.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <Star className={`h-4 w-4 ${contact.favorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                            </Button>
                            <Button
                              onClick={() => markAsContacted(contact.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <Phone className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button
                              onClick={() => deleteContact(contact.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                              {contact.email}
                            </a>
                          </div>
                          
                          {contact.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                                {contact.phone}
                              </a>
                            </div>
                          )}
                          
                          {contact.company && (
                            <div className="text-sm text-gray-600">
                              {contact.position && `${contact.position} at `}{contact.company}
                            </div>
                          )}
                        </div>
                        
                        {contact.notes && (
                          <p className="text-sm text-gray-600 mb-3 italic">
                            {contact.notes}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{contact.category}</Badge>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Added: {new Date(contact.dateAdded).toLocaleDateString()}
                          {contact.lastContacted && (
                            <span className="ml-4">
                              Last contacted: {new Date(contact.lastContacted).toLocaleDateString()}
                            </span>
                          )}
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

export default ContactManager;
