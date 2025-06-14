import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import slugify from 'slugify';
import { Checkbox } from "@/components/ui/checkbox"

const stopWords = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'of',
]);

const SlugGenerator = () => {
  const [input, setInput] = useState('');
  const [slug, setSlug] = useState('');
  const [caseStyle, setCaseStyle] = useState<'lowercase' | 'uppercase' | 'camelcase' | 'pascalcase'>('lowercase');
  const [separator, setSeparator] = useState('-');
  const [maxLength, setMaxLength] = useState(50);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [removeNumbers, setRemoveNumbers] = useState(false);
  const [transliterate, setTransliterate] = useState(true);
  const [truncateWords, setTruncateWords] = useState(false);
  const [variations, setVariations] = useState<string[]>([]);
  const { toast } = useToast();

  const generateSlug = () => {
    let baseSlug = input;

    if (removeStopWords) {
      baseSlug = baseSlug
        .split(' ')
        .filter(word => !stopWords.has(word.toLowerCase()))
        .join(' ');
    }

    if (removeNumbers) {
      baseSlug = baseSlug.replace(/\d+/g, '');
    }

    let generatedSlug = slugify(baseSlug, {
      replacement: separator,
      remove: transliterate ? undefined : /[^a-zA-Z0-9\s-]/g,
      lower: caseStyle === 'lowercase',
      upper: caseStyle === 'uppercase',
      trim: true,
      locale: 'en',
    });

    if (caseStyle === 'camelcase') {
      generatedSlug = generatedSlug.replace(/[-_\s](.)?/g, (match, chr) => {
        return chr ? chr.toUpperCase() : '';
      }).replace(/^([A-Z])/, (match, chr) => chr.toLowerCase());
    } else if (caseStyle === 'pascalcase') {
      generatedSlug = generatedSlug.replace(/[-_\s](.)?/g, (match, chr) => {
        return chr ? chr.toUpperCase() : '';
      }).replace(/^([a-z])/, (match, chr) => chr.toUpperCase());
    }

    if (truncateWords) {
      generatedSlug = generatedSlug.substring(0, maxLength);
      generatedSlug = generatedSlug.substring(0, generatedSlug.lastIndexOf(separator));
    } else {
      generatedSlug = generatedSlug.substring(0, maxLength);
    }

    setSlug(generatedSlug);

    // Generate variations
    const altVariations = [];
    if (separator !== '_') {
      altVariations.push(slugify(baseSlug, { replacement: '_', remove: /[^a-zA-Z0-9\s-]/g, lower: true, trim: true }).substring(0, maxLength));
    }
    if (separator !== '.') {
      altVariations.push(slugify(baseSlug, { replacement: '.', remove: /[^a-zA-Z0-9\s-]/g, lower: true, trim: true }).substring(0, maxLength));
    }
    setVariations(altVariations);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Slug copied to clipboard",
    });
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Advanced Slug Generator</h1>
            <p className="mt-4 text-lg text-gray-600">
              Create SEO-friendly URL slugs with advanced customization options
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Generate URL Slug</CardTitle>
              <CardDescription>
                Convert your text into clean, SEO-friendly URL slugs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="input">Text to Convert</Label>
                <Textarea
                  id="input"
                  placeholder="Enter your title, headline, or text here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="case">Case Style</Label>
                  <Select value={caseStyle} onValueChange={setCaseStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lowercase">lowercase</SelectItem>
                      <SelectItem value="uppercase">UPPERCASE</SelectItem>
                      <SelectItem value="camelcase">camelCase</SelectItem>
                      <SelectItem value="pascalcase">PascalCase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="separator">Separator</Label>
                  <Select value={separator} onValueChange={setSeparator}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-">Hyphen (-)</SelectItem>
                      <SelectItem value="_">Underscore (_)</SelectItem>
                      <SelectItem value=".">Dot (.)</SelectItem>
                      <SelectItem value="">No Separator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLength">Max Length</Label>
                  <Input
                    id="maxLength"
                    type="number"
                    min="10"
                    max="200"
                    value={maxLength}
                    onChange={(e) => setMaxLength(parseInt(e.target.value) || 50)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Options</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="removeStopWords"
                      checked={removeStopWords}
                      onCheckedChange={(checked) => setRemoveStopWords(checked === true)}
                    />
                    <Label htmlFor="removeStopWords">Remove stop words (a, an, the, etc.)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="removeNumbers"
                      checked={removeNumbers}
                      onCheckedChange={(checked) => setRemoveNumbers(checked === true)}
                    />
                    <Label htmlFor="removeNumbers">Remove numbers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="transliterate"
                      checked={transliterate}
                      onCheckedChange={(checked) => setTransliterate(checked === true)}
                    />
                    <Label htmlFor="transliterate">Transliterate special characters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="truncateWords"
                      checked={truncateWords}
                      onCheckedChange={(checked) => setTruncateWords(checked === true)}
                    />
                    <Label htmlFor="truncateWords">Truncate at word boundaries</Label>
                  </div>
                </div>
              </div>

              <Button onClick={generateSlug} className="w-full" size="lg" disabled={!input.trim()}>
                <Link className="mr-2 h-4 w-4" />
                Generate Slug
              </Button>

              {slug && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Generated Slug:</h3>
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <code className="text-lg font-mono break-all">{slug}</code>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Length: {slug.length} characters</p>
                    <p>Preview URL: https://example.com/{slug}</p>
                    {slug.length > 50 && (
                      <p className="text-yellow-600">⚠️ Consider shortening for better SEO (recommended: &lt;50 characters)</p>
                    )}
                  </div>
                  
                  {variations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-700">Alternative Variations:</h4>
                      <div className="space-y-2">
                        {variations.map((variation, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white border rounded">
                            <code className="text-sm text-gray-700">{variation}</code>
                            <Button
                              onClick={() => copyToClipboard(variation)}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SlugGenerator;
