
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
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, ArrowLeft, Copy, RefreshCw, Settings, Download } from 'lucide-react';

interface NamingRule {
  id: string;
  name: string;
  pattern: string;
  description: string;
  example: string;
}

const FileNaming = () => {
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('document');
  const [project, setProject] = useState('');
  const [version, setVersion] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [includeDate, setIncludeDate] = useState(true);
  const [includeVersion, setIncludeVersion] = useState(false);
  const [includeProject, setIncludeProject] = useState(false);
  const [separator, setSeparator] = useState('_');
  const [caseStyle, setCaseStyle] = useState('lowercase');

  const [namingRules, setNamingRules] = useState<NamingRule[]>([
    {
      id: '1',
      name: 'Document Standard',
      pattern: '{type}_{name}_{date}',
      description: 'Standard document naming with type, name and date',
      example: 'doc_meeting_notes_2024-01-15'
    },
    {
      id: '2',
      name: 'Project Files',
      pattern: '{project}_{type}_{name}_v{version}',
      description: 'Project-based naming with version control',
      example: 'webapp_design_mockup_v1.2'
    },
    {
      id: '3',
      name: 'Media Files',
      pattern: '{date}_{name}_{type}',
      description: 'Date-first naming for media organization',
      example: '2024-01-15_team_photo_img'
    }
  ]);

  const [selectedRule, setSelectedRule] = useState<string>('');
  const [customPattern, setCustomPattern] = useState('');

  const fileTypes = [
    { value: 'document', label: 'Document', abbrev: 'doc' },
    { value: 'image', label: 'Image', abbrev: 'img' },
    { value: 'video', label: 'Video', abbrev: 'vid' },
    { value: 'audio', label: 'Audio', abbrev: 'aud' },
    { value: 'spreadsheet', label: 'Spreadsheet', abbrev: 'xls' },
    { value: 'presentation', label: 'Presentation', abbrev: 'ppt' },
    { value: 'code', label: 'Code', abbrev: 'code' },
    { value: 'archive', label: 'Archive', abbrev: 'zip' }
  ];

  const separators = [
    { value: '_', label: 'Underscore (_)' },
    { value: '-', label: 'Hyphen (-)' },
    { value: '.', label: 'Period (.)' },
    { value: '', label: 'No separator' }
  ];

  const caseStyles = [
    { value: 'lowercase', label: 'lowercase' },
    { value: 'uppercase', label: 'UPPERCASE' },
    { value: 'camelCase', label: 'camelCase' },
    { value: 'PascalCase', label: 'PascalCase' },
    { value: 'kebab-case', label: 'kebab-case' }
  ];

  const applyCaseStyle = (text: string, style: string): string => {
    switch (style) {
      case 'lowercase':
        return text.toLowerCase();
      case 'uppercase':
        return text.toUpperCase();
      case 'camelCase':
        return text.charAt(0).toLowerCase() + text.slice(1).replace(/[-_\s]+(.)/g, (_, char) => char.toUpperCase());
      case 'PascalCase':
        return text.charAt(0).toUpperCase() + text.slice(1).replace(/[-_\s]+(.)/g, (_, char) => char.toUpperCase());
      case 'kebab-case':
        return text.toLowerCase().replace(/[_\s]+/g, '-');
      default:
        return text;
    }
  };

  const generateFileName = (): string => {
    if (!fileName.trim()) return '';

    const components: string[] = [];
    const typeAbbrev = fileTypes.find(t => t.value === fileType)?.abbrev || fileType;

    if (includeProject && project.trim()) {
      components.push(applyCaseStyle(project.trim(), caseStyle));
    }

    components.push(applyCaseStyle(typeAbbrev, caseStyle));
    components.push(applyCaseStyle(fileName.trim().replace(/\s+/g, '_'), caseStyle));

    if (includeDate && date) {
      components.push(date);
    }

    if (includeVersion && version.trim()) {
      components.push(`v${version.trim()}`);
    }

    return components.join(separator);
  };

  const generateFromRule = (rule: NamingRule): string => {
    if (!fileName.trim()) return rule.example;

    let pattern = rule.pattern;
    const typeAbbrev = fileTypes.find(t => t.value === fileType)?.abbrev || fileType;

    pattern = pattern.replace('{type}', typeAbbrev);
    pattern = pattern.replace('{name}', fileName.trim().replace(/\s+/g, '_'));
    pattern = pattern.replace('{date}', date);
    pattern = pattern.replace('{project}', project.trim() || 'project');
    pattern = pattern.replace('{version}', version.trim() || '1.0');

    return applyCaseStyle(pattern, caseStyle);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateBulkNames = (): string[] => {
    const baseNames = [
      'meeting_notes', 'project_proposal', 'design_mockup', 
      'user_manual', 'technical_spec', 'presentation_slides'
    ];
    
    return baseNames.map(name => {
      const components: string[] = [];
      const typeAbbrev = fileTypes.find(t => t.value === fileType)?.abbrev || fileType;

      if (includeProject && project.trim()) {
        components.push(applyCaseStyle(project.trim(), caseStyle));
      }

      components.push(applyCaseStyle(typeAbbrev, caseStyle));
      components.push(applyCaseStyle(name, caseStyle));

      if (includeDate && date) {
        components.push(date);
      }

      return components.join(separator);
    });
  };

  const exportNamingRules = () => {
    const data = {
      rules: namingRules,
      settings: {
        separator,
        caseStyle,
        includeDate,
        includeVersion,
        includeProject
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'file_naming_rules.json';
    a.click();
    URL.revokeObjectURL(url);
  };

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
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">File Naming System</h1>
                  <p className="text-gray-600">Generate consistent and organized file names with custom rules</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Configuration Panel */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      File Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="fileName">File Name *</Label>
                      <Input
                        id="fileName"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="Enter file name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fileType">File Type</Label>
                      <Select value={fileType} onValueChange={setFileType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fileTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includeProject" 
                        checked={includeProject}
                        onCheckedChange={(checked) => setIncludeProject(checked === true)}
                      />
                      <Label htmlFor="includeProject">Include Project</Label>
                    </div>

                    {includeProject && (
                      <div>
                        <Label htmlFor="project">Project Name</Label>
                        <Input
                          id="project"
                          value={project}
                          onChange={(e) => setProject(e.target.value)}
                          placeholder="Project name"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includeDate" 
                        checked={includeDate}
                        onCheckedChange={(checked) => setIncludeDate(checked === true)}
                      />
                      <Label htmlFor="includeDate">Include Date</Label>
                    </div>

                    {includeDate && (
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includeVersion" 
                        checked={includeVersion}
                        onCheckedChange={(checked) => setIncludeVersion(checked === true)}
                      />
                      <Label htmlFor="includeVersion">Include Version</Label>
                    </div>

                    {includeVersion && (
                      <div>
                        <Label htmlFor="version">Version</Label>
                        <Input
                          id="version"
                          value={version}
                          onChange={(e) => setVersion(e.target.value)}
                          placeholder="1.0"
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="separator">Separator</Label>
                      <Select value={separator} onValueChange={setSeparator}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {separators.map(sep => (
                            <SelectItem key={sep.value} value={sep.value}>
                              {sep.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="caseStyle">Case Style</Label>
                      <Select value={caseStyle} onValueChange={setCaseStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {caseStyles.map(style => (
                            <SelectItem key={style.value} value={style.value}>
                              {style.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results Panel */}
              <div className="lg:col-span-2 space-y-6">
                {/* Generated Name */}
                <Card>
                  <CardHeader>
                    <CardTitle>Generated File Name</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                      <code className="flex-1 text-lg font-mono">{generateFileName() || 'Enter a file name to see preview'}</code>
                      {generateFileName() && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(generateFileName())}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Naming Rules */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Predefined Naming Rules</CardTitle>
                      <Button variant="outline" size="sm" onClick={exportNamingRules}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Rules
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {namingRules.map((rule) => (
                        <div key={rule.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{rule.name}</h4>
                              <p className="text-sm text-gray-600">{rule.description}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => copyToClipboard(generateFromRule(rule))}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="text-gray-500">Pattern:</span>
                              <code className="ml-2 px-2 py-1 bg-gray-100 rounded">{rule.pattern}</code>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Generated:</span>
                              <code className="ml-2 px-2 py-1 bg-blue-50 rounded font-mono">
                                {generateFromRule(rule)}
                              </code>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Bulk Generation */}
                <Card>
                  <CardHeader>
                    <CardTitle>Bulk Name Generation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {generateBulkNames().map((name, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <code className="font-mono text-sm">{name}</code>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard(name)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FileNaming;
