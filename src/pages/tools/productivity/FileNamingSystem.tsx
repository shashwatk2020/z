
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Trash2, Copy, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NamingRule {
  id: number;
  name: string;
  pattern: string;
  description: string;
  category: string;
  example: string;
  useCase: string;
}

interface NamingExample {
  id: number;
  originalName: string;
  improvedName: string;
  rule: string;
  explanation: string;
}

const FileNamingSystem = () => {
  const [namingRules, setNamingRules] = useState<NamingRule[]>([
    {
      id: 1,
      name: "Date-Based Documents",
      pattern: "YYYY-MM-DD_DocumentType_Description",
      description: "Use for documents that need chronological organization",
      category: "Documents",
      example: "2024-01-15_Invoice_ClientName",
      useCase: "Invoices, reports, meeting notes"
    },
    {
      id: 2,
      name: "Project Files",
      pattern: "ProjectCode_Version_FileType",
      description: "For project-related files with version control",
      category: "Projects",
      example: "WEB001_v2.1_Mockup",
      useCase: "Design files, code, documentation"
    },
    {
      id: 3,
      name: "Media Files",
      pattern: "YYYY-MM-DD_Event_Number",
      description: "For photos and videos from events",
      category: "Media",
      example: "2024-01-15_Birthday_001",
      useCase: "Photos, videos, audio recordings"
    }
  ]);

  const [customRules, setCustomRules] = useState<NamingRule[]>([]);
  const [examples, setExamples] = useState<NamingExample[]>([]);
  const [newRule, setNewRule] = useState({
    name: '',
    pattern: '',
    description: '',
    category: 'Custom',
    example: '',
    useCase: ''
  });

  const [fileNameGenerator, setFileNameGenerator] = useState({
    selectedRule: '',
    inputs: {} as { [key: string]: string },
    generatedName: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    const savedCustomRules = localStorage.getItem('fileNamingCustomRules');
    if (savedCustomRules) {
      setCustomRules(JSON.parse(savedCustomRules));
    }

    const savedExamples = localStorage.getItem('fileNamingExamples');
    if (savedExamples) {
      setExamples(JSON.parse(savedExamples));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fileNamingCustomRules', JSON.stringify(customRules));
  }, [customRules]);

  useEffect(() => {
    localStorage.setItem('fileNamingExamples', JSON.stringify(examples));
  }, [examples]);

  const addCustomRule = () => {
    if (!newRule.name.trim() || !newRule.pattern.trim()) {
      toast({
        title: "Error",
        description: "Please enter rule name and pattern",
        variant: "destructive"
      });
      return;
    }

    const rule: NamingRule = {
      id: Date.now(),
      name: newRule.name,
      pattern: newRule.pattern,
      description: newRule.description,
      category: newRule.category,
      example: newRule.example,
      useCase: newRule.useCase
    };

    setCustomRules([rule, ...customRules]);
    setNewRule({
      name: '',
      pattern: '',
      description: '',
      category: 'Custom',
      example: '',
      useCase: ''
    });

    toast({
      title: "Success",
      description: "Custom naming rule added"
    });
  };

  const deleteCustomRule = (id: number) => {
    setCustomRules(customRules.filter(rule => rule.id !== id));
    toast({
      title: "Success",
      description: "Custom rule deleted"
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Copied to clipboard"
      });
    });
  };

  const generateFileName = (pattern: string, inputs: { [key: string]: string }) => {
    let fileName = pattern;
    
    // Replace common patterns
    const today = new Date();
    fileName = fileName.replace(/YYYY/g, today.getFullYear().toString());
    fileName = fileName.replace(/MM/g, (today.getMonth() + 1).toString().padStart(2, '0'));
    fileName = fileName.replace(/DD/g, today.getDate().toString().padStart(2, '0'));
    
    // Replace custom inputs
    Object.entries(inputs).forEach(([key, value]) => {
      fileName = fileName.replace(new RegExp(key, 'g'), value);
    });
    
    return fileName;
  };

  const extractPatternVariables = (pattern: string) => {
    const variables = [];
    const matches = pattern.match(/[A-Z][a-zA-Z]+/g);
    if (matches) {
      matches.forEach(match => {
        if (!['YYYY', 'MM', 'DD'].includes(match)) {
          variables.push(match);
        }
      });
    }
    return [...new Set(variables)];
  };

  const allRules = [...namingRules, ...customRules];
  const categories = [...new Set(allRules.map(rule => rule.category))];

  const commonMistakes = [
    {
      wrong: "document (1).docx",
      right: "2024-01-15_ProjectProposal_v1.docx",
      issue: "Avoid spaces and generic names"
    },
    {
      wrong: "IMG_001.jpg",
      right: "2024-01-15_TeamMeeting_001.jpg",
      issue: "Add context and date"
    },
    {
      wrong: "new file.pdf",
      right: "ClientContract_ABC_Corp_v2.pdf",
      issue: "Be specific and descriptive"
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            File Naming System
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create consistent file naming conventions for better organization and easier file retrieval.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{allRules.length}</div>
              <div className="text-sm text-gray-600">Naming Rules</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{customRules.length}</div>
              <div className="text-sm text-gray-600">Custom Rules</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{examples.length}</div>
              <div className="text-sm text-gray-600">Examples</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Custom Rule */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Custom Rule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Rule Name</Label>
                  <Input
                    placeholder="My Custom Rule"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Pattern</Label>
                  <Input
                    placeholder="YYYY-MM-DD_Category_Name"
                    value={newRule.pattern}
                    onChange={(e) => setNewRule({ ...newRule, pattern: e.target.value })}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Use YYYY, MM, DD for dates. Custom variables in CamelCase.
                  </div>
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    placeholder="When and how to use this rule"
                    value={newRule.description}
                    onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Input
                      placeholder="Custom"
                      value={newRule.category}
                      onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label>Example</Label>
                    <Input
                      placeholder="2024-01-15_Report_Q1"
                      value={newRule.example}
                      onChange={(e) => setNewRule({ ...newRule, example: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Use Case</Label>
                  <Input
                    placeholder="Reports, presentations, etc."
                    value={newRule.useCase}
                    onChange={(e) => setNewRule({ ...newRule, useCase: e.target.value })}
                  />
                </div>

                <Button onClick={addCustomRule} className="w-full">
                  Add Rule
                </Button>
              </CardContent>
            </Card>

            {/* File Name Generator */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  File Name Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Rule</Label>
                  <select
                    value={fileNameGenerator.selectedRule}
                    onChange={(e) => {
                      const rule = allRules.find(r => r.id.toString() === e.target.value);
                      setFileNameGenerator({
                        selectedRule: e.target.value,
                        inputs: {},
                        generatedName: rule?.example || ''
                      });
                    }}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Choose a rule</option>
                    {allRules.map((rule) => (
                      <option key={rule.id} value={rule.id.toString()}>
                        {rule.name}
                      </option>
                    ))}
                  </select>
                </div>

                {fileNameGenerator.selectedRule && (
                  <>
                    {extractPatternVariables(
                      allRules.find(r => r.id.toString() === fileNameGenerator.selectedRule)?.pattern || ''
                    ).map((variable) => (
                      <div key={variable}>
                        <Label>{variable}</Label>
                        <Input
                          placeholder={`Enter ${variable}`}
                          value={fileNameGenerator.inputs[variable] || ''}
                          onChange={(e) => {
                            const newInputs = {
                              ...fileNameGenerator.inputs,
                              [variable]: e.target.value
                            };
                            const rule = allRules.find(r => r.id.toString() === fileNameGenerator.selectedRule);
                            setFileNameGenerator({
                              ...fileNameGenerator,
                              inputs: newInputs,
                              generatedName: rule ? generateFileName(rule.pattern, newInputs) : ''
                            });
                          }}
                        />
                      </div>
                    ))}

                    {fileNameGenerator.generatedName && (
                      <div>
                        <Label>Generated Name</Label>
                        <div className="flex gap-2">
                          <Input
                            value={fileNameGenerator.generatedName}
                            readOnly
                            className="bg-gray-50"
                          />
                          <Button
                            onClick={() => copyToClipboard(fileNameGenerator.generatedName)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Naming Rules */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Naming Rules
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {categories.map((category) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-3">{category}</h3>
                      <div className="space-y-4">
                        {allRules
                          .filter(rule => rule.category === category)
                          .map((rule) => (
                            <div key={rule.id} className="p-4 border rounded-lg bg-white">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium">{rule.name}</h4>
                                {customRules.find(r => r.id === rule.id) && (
                                  <Button
                                    onClick={() => deleteCustomRule(rule.id)}
                                    variant="ghost"
                                    size="sm"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                )}
                              </div>
                              
                              <div className="space-y-2 mb-3">
                                <div>
                                  <span className="text-sm font-medium text-gray-700">Pattern: </span>
                                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                    {rule.pattern}
                                  </code>
                                  <Button
                                    onClick={() => copyToClipboard(rule.pattern)}
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2 h-6 w-6 p-0"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                                
                                <div>
                                  <span className="text-sm font-medium text-gray-700">Example: </span>
                                  <code className="text-sm bg-blue-50 px-2 py-1 rounded text-blue-800">
                                    {rule.example}
                                  </code>
                                  <Button
                                    onClick={() => copyToClipboard(rule.example)}
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2 h-6 w-6 p-0"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                              
                              {rule.useCase && (
                                <div className="text-xs text-gray-500">
                                  <strong>Use for:</strong> {rule.useCase}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Common Mistakes */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Common File Naming Mistakes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commonMistakes.map((mistake, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="font-medium text-red-600">❌ Wrong:</span>
                          <code className="block bg-red-50 px-2 py-1 rounded mt-1">
                            {mistake.wrong}
                          </code>
                        </div>
                        <div>
                          <span className="font-medium text-green-600">✅ Better:</span>
                          <code className="block bg-green-50 px-2 py-1 rounded mt-1">
                            {mistake.right}
                          </code>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Issue:</span>
                          <div className="text-gray-600 mt-1">{mistake.issue}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FileNamingSystem;
