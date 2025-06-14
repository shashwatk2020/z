
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Copy, Link2, RefreshCw } from 'lucide-react';

const SlugGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [separator, setSeparator] = useState('-');
  const [case_type, setCaseType] = useState('lowercase');
  const [maxLength, setMaxLength] = useState(100);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [customReplacements, setCustomReplacements] = useState('');
  const [generatedSlug, setGeneratedSlug] = useState('');
  const [slugHistory, setSlugHistory] = useState<Array<{text: string, slug: string}>>([]);

  const stopWords = [
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with'
  ];

  const generateSlug = () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to convert.",
        variant: "destructive"
      });
      return;
    }

    let slug = inputText.toLowerCase();
    
    // Apply custom replacements
    if (customReplacements) {
      const replacements = customReplacements.split('\n').filter(line => line.includes('='));
      replacements.forEach(replacement => {
        const [from, to] = replacement.split('=').map(s => s.trim());
        if (from && to !== undefined) {
          slug = slug.replace(new RegExp(from, 'g'), to);
        }
      });
    }
    
    // Remove stop words if enabled
    if (removeStopWords) {
      const words = slug.split(/\s+/);
      const filteredWords = words.filter(word => !stopWords.includes(word.toLowerCase()));
      slug = filteredWords.join(' ');
    }
    
    // Replace special characters with spaces
    slug = slug.replace(/[^\w\s-]/g, ' ');
    
    // Replace multiple spaces with single space
    slug = slug.replace(/\s+/g, ' ');
    
    // Trim whitespace
    slug = slug.trim();
    
    // Replace spaces with separator
    slug = slug.replace(/\s/g, separator);
    
    // Remove multiple separators
    const separatorRegex = new RegExp(`\\${separator}+`, 'g');
    slug = slug.replace(separatorRegex, separator);
    
    // Remove leading/trailing separators
    const trimRegex = new RegExp(`^\\${separator}+|\\${separator}+$`, 'g');
    slug = slug.replace(trimRegex, '');
    
    // Apply case transformation
    switch (case_type) {
      case 'uppercase':
        slug = slug.toUpperCase();
        break;
      case 'lowercase':
        slug = slug.toLowerCase();
        break;
      case 'title':
        slug = slug.split(separator).map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(separator);
        break;
    }
    
    // Limit length
    if (slug.length > maxLength) {
      slug = slug.substring(0, maxLength);
      // Remove trailing separator if cut off mid-word
      slug = slug.replace(new RegExp(`\\${separator}+$`), '');
    }
    
    setGeneratedSlug(slug);
    setSlugHistory(prev => [{text: inputText, slug}, ...prev.slice(0, 9)]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Slug copied to clipboard.",
    });
  };

  const presets = {
    'url-friendly': { separator: '-', case_type: 'lowercase', removeStopWords: false },
    'seo-optimized': { separator: '-', case_type: 'lowercase', removeStopWords: true },
    'underscore': { separator: '_', case_type: 'lowercase', removeStopWords: false },
    'camelcase': { separator: '', case_type: 'title', removeStopWords: true },
  };

  const applyPreset = (preset: string) => {
    const config = presets[preset as keyof typeof presets];
    if (config) {
      setSeparator(config.separator);
      setCaseType(config.case_type);
      setRemoveStopWords(config.removeStopWords);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Advanced Slug Generator
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Create SEO-friendly URLs and identifiers from any text with advanced customization options.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link2 className="h-5 w-5" />
                      Slug Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="inputText">Text to Convert</Label>
                      <Textarea
                        id="inputText"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Enter your title, heading, or any text..."
                        className="mt-1 min-h-[100px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="separator">Separator</Label>
                        <Select value={separator} onValueChange={setSeparator}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="-">Hyphen (-)</SelectItem>
                            <SelectItem value="_">Underscore (_)</SelectItem>
                            <SelectItem value=".">Dot (.)</SelectItem>
                            <SelectItem value="">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="case_type">Case Style</Label>
                        <Select value={case_type} onValueChange={setCaseType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lowercase">lowercase</SelectItem>
                            <SelectItem value="uppercase">UPPERCASE</SelectItem>
                            <SelectItem value="title">Title Case</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="maxLength">Maximum Length</Label>
                      <Input
                        id="maxLength"
                        type="number"
                        min="1"
                        max="500"
                        value={maxLength}
                        onChange={(e) => setMaxLength(parseInt(e.target.value) || 100)}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="removeStopWords"
                        checked={removeStopWords}
                        onCheckedChange={setRemoveStopWords}
                      />
                      <Label htmlFor="removeStopWords">Remove stop words (a, an, the, etc.)</Label>
                    </div>

                    <div>
                      <Label htmlFor="customReplacements">Custom Replacements (Optional)</Label>
                      <Textarea
                        id="customReplacements"
                        value={customReplacements}
                        onChange={(e) => setCustomReplacements(e.target.value)}
                        placeholder="Enter replacements (one per line):&#10;& = and&#10;+ = plus&#10;@ = at"
                        className="mt-1 min-h-[80px] text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">Format: original=replacement</p>
                    </div>

                    <div>
                      <Label>Quick Presets</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={() => applyPreset('url-friendly')}>
                          URL Friendly
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyPreset('seo-optimized')}>
                          SEO Optimized
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyPreset('underscore')}>
                          Underscore Style
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyPreset('camelcase')}>
                          Camel Case
                        </Button>
                      </div>
                    </div>

                    <Button onClick={generateSlug} className="w-full" size="lg">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Slug
                    </Button>

                    {generatedSlug && (
                      <div>
                        <Label>Generated Slug</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            value={generatedSlug}
                            readOnly
                            className="font-mono"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(generatedSlug)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Length: {generatedSlug.length} characters
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Slugs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {slugHistory.length === 0 ? (
                      <p className="text-gray-500 text-sm">No slugs generated yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {slugHistory.map((item, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded">
                            <p className="text-xs text-gray-600 mb-1 truncate">{item.text}</p>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-sm truncate flex-1">{item.slug}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(item.slug)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Slug Best Practices</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>• Use hyphens instead of underscores</p>
                    <p>• Keep it under 60 characters</p>
                    <p>• Include target keywords</p>
                    <p>• Avoid special characters</p>
                    <p>• Make it readable and descriptive</p>
                    <p>• Use lowercase for consistency</p>
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

export default SlugGenerator;
