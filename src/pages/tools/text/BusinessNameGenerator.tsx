
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Copy, Wand2, Sparkles, Building2, RefreshCw, Download, Heart } from 'lucide-react';

const INDUSTRIES = [
  'technology', 'healthcare', 'finance', 'retail', 'food', 'fashion', 'fitness',
  'education', 'real-estate', 'consulting', 'marketing', 'construction', 'automotive',
  'beauty', 'travel', 'entertainment', 'legal', 'agriculture', 'manufacturing', 'general'
];

const GENERATION_STYLES = {
  'compound': { name: 'Compound Words', description: 'Combine two relevant words' },
  'prefix': { name: 'Prefix + Word', description: 'Add prefixes like Pro, Super, Ultra' },
  'suffix': { name: 'Word + Suffix', description: 'Add suffixes like -ly, -ify, -hub' },
  'portmanteau': { name: 'Portmanteau', description: 'Blend parts of two words' },
  'creative': { name: 'Creative Fusion', description: 'Unique combinations and variations' },
  'brandable': { name: 'Brandable', description: 'Short, memorable made-up words' },
  'descriptive': { name: 'Descriptive', description: 'Clear, descriptive names' },
  'abstract': { name: 'Abstract', description: 'Non-descriptive, unique names' }
};

const WORD_LISTS = {
  technology: ['tech', 'digital', 'cyber', 'smart', 'cloud', 'data', 'AI', 'soft', 'code', 'web', 'app', 'system', 'logic', 'pixel', 'byte'],
  healthcare: ['health', 'care', 'medical', 'wellness', 'vital', 'life', 'healing', 'therapy', 'clinic', 'cure', 'remedy', 'pulse', 'heart', 'med', 'bio'],
  finance: ['capital', 'asset', 'invest', 'wealth', 'money', 'fund', 'bank', 'finance', 'profit', 'gold', 'coin', 'cash', 'credit', 'value', 'trust'],
  retail: ['shop', 'store', 'market', 'buy', 'sell', 'trade', 'commerce', 'bazaar', 'outlet', 'mall', 'goods', 'products', 'sale', 'deal', 'price'],
  food: ['taste', 'flavor', 'fresh', 'cook', 'chef', 'kitchen', 'recipe', 'dish', 'meal', 'bite', 'feast', 'spice', 'herb', 'cafe', 'dine'],
  fashion: ['style', 'trend', 'chic', 'elegant', 'fashion', 'wear', 'cloth', 'fabric', 'design', 'vogue', 'couture', 'boutique', 'dress', 'mode', 'flair'],
  fitness: ['fit', 'strong', 'power', 'muscle', 'gym', 'train', 'energy', 'vitality', 'active', 'sport', 'health', 'body', 'peak', 'force', 'flex'],
  general: ['pro', 'premium', 'elite', 'prime', 'apex', 'peak', 'max', 'ultra', 'super', 'mega', 'rapid', 'swift', 'smart', 'bright', 'bold']
};

const PREFIXES = ['Pro', 'Ultra', 'Super', 'Mega', 'Prime', 'Elite', 'Max', 'Smart', 'Quick', 'Rapid', 'Instant', 'Perfect', 'Supreme', 'Advanced', 'Premium'];
const SUFFIXES = ['ly', 'ify', 'hub', 'lab', 'works', 'solutions', 'systems', 'group', 'corp', 'inc', 'co', 'studio', 'agency', 'partners', 'ventures'];

const BusinessNameGenerator = () => {
  const [keywords, setKeywords] = useState('');
  const [industry, setIndustry] = useState('general');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['compound', 'brandable']);
  const [nameLength, setNameLength] = useState('medium');
  const [generatedNames, setGeneratedNames] = useState<Array<{name: string, style: string}>>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  const generateCompoundName = (words: string[]) => {
    const word1 = words[Math.floor(Math.random() * words.length)];
    const word2 = words[Math.floor(Math.random() * words.length)];
    return word1 !== word2 ? `${capitalize(word1)}${capitalize(word2)}` : null;
  };

  const generatePrefixName = (words: string[]) => {
    const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const word = words[Math.floor(Math.random() * words.length)];
    return `${prefix}${capitalize(word)}`;
  };

  const generateSuffixName = (words: string[]) => {
    const word = words[Math.floor(Math.random() * words.length)];
    const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    return `${capitalize(word)}${suffix}`;
  };

  const generatePortmanteau = (words: string[]) => {
    const word1 = words[Math.floor(Math.random() * words.length)];
    const word2 = words[Math.floor(Math.random() * words.length)];
    if (word1 === word2) return null;
    
    const split1 = Math.floor(word1.length / 2);
    const split2 = Math.floor(word2.length / 2);
    return capitalize(word1.substring(0, split1) + word2.substring(split2));
  };

  const generateBrandableName = () => {
    const vowels = 'aeiou';
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    let name = '';
    const length = nameLength === 'short' ? 4 + Math.floor(Math.random() * 3) : 
                   nameLength === 'medium' ? 6 + Math.floor(Math.random() * 3) : 
                   8 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < length; i++) {
      if (i % 2 === 0) {
        name += consonants[Math.floor(Math.random() * consonants.length)];
      } else {
        name += vowels[Math.floor(Math.random() * vowels.length)];
      }
    }
    return capitalize(name);
  };

  const generateCreativeName = (words: string[]) => {
    const variations = [
      () => generateCompoundName(words),
      () => generatePortmanteau(words),
      () => {
        const word = words[Math.floor(Math.random() * words.length)];
        return word.length > 4 ? capitalize(word.substring(0, -1) + 'x') : null;
      },
      () => {
        const word = words[Math.floor(Math.random() * words.length)];
        return capitalize(word + 'o');
      }
    ];
    
    const generator = variations[Math.floor(Math.random() * variations.length)];
    return generator();
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getIndustryWords = () => {
    const industryWords = WORD_LISTS[industry as keyof typeof WORD_LISTS] || WORD_LISTS.general;
    const keywordList = keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k.length > 0);
    return [...industryWords, ...keywordList, ...WORD_LISTS.general];
  };

  const generateNames = () => {
    if (selectedStyles.length === 0) {
      toast({
        title: "No styles selected",
        description: "Please select at least one generation style.",
        variant: "destructive"
      });
      return;
    }

    const words = getIndustryWords();
    const newNames: Array<{name: string, style: string}> = [];
    const namesPerStyle = Math.ceil(20 / selectedStyles.length);

    selectedStyles.forEach(style => {
      for (let i = 0; i < namesPerStyle; i++) {
        let name = null;
        let attempts = 0;

        while (!name && attempts < 10) {
          switch (style) {
            case 'compound':
              name = generateCompoundName(words);
              break;
            case 'prefix':
              name = generatePrefixName(words);
              break;
            case 'suffix':
              name = generateSuffixName(words);
              break;
            case 'portmanteau':
              name = generatePortmanteau(words);
              break;
            case 'creative':
              name = generateCreativeName(words);
              break;
            case 'brandable':
              name = generateBrandableName();
              break;
            case 'descriptive':
              name = generateSuffixName(words);
              break;
            case 'abstract':
              name = generateBrandableName();
              break;
            default:
              name = generateCompoundName(words);
          }
          attempts++;
        }

        if (name && !newNames.find(n => n.name === name)) {
          newNames.push({
            name,
            style: GENERATION_STYLES[style as keyof typeof GENERATION_STYLES].name
          });
        }
      }
    });

    setGeneratedNames(newNames.slice(0, 20));
    toast({
      title: "Success",
      description: `Generated ${newNames.length} business names!`
    });
  };

  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name);
    toast({
      title: "Copied!",
      description: `"${name}" copied to clipboard.`
    });
  };

  const toggleFavorite = (name: string) => {
    setFavorites(prev => 
      prev.includes(name) 
        ? prev.filter(f => f !== name)
        : [...prev, name]
    );
  };

  const downloadNames = () => {
    if (generatedNames.length === 0) return;

    let content = `Business Name Generator Results\n`;
    content += `Generated on: ${new Date().toLocaleString()}\n`;
    content += `Industry: ${industry}\n`;
    content += `Keywords: ${keywords || 'None'}\n\n`;

    content += `Generated Names:\n`;
    generatedNames.forEach((item, index) => {
      const fav = favorites.includes(item.name) ? '★ ' : '';
      content += `${index + 1}. ${fav}${item.name} (${item.style})\n`;
    });

    if (favorites.length > 0) {
      content += `\nFavorites:\n`;
      favorites.forEach((name, index) => {
        content += `${index + 1}. ${name}\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'business-names.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Business names have been downloaded."
    });
  };

  const handleStyleChange = (styleKey: string, checked: boolean) => {
    setSelectedStyles(prev => 
      checked 
        ? [...prev, styleKey]
        : prev.filter(s => s !== styleKey)
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Advanced Business Name Generator</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Generate creative, brandable business names using AI-powered algorithms. Perfect for startups, brands, and new ventures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Textarea
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="tech, innovation, solutions..."
                  className="mt-2"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">Optional keywords to include in generation</p>
              </div>

              <div>
                <Label>Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map(ind => (
                      <SelectItem key={ind} value={ind}>
                        {ind.charAt(0).toUpperCase() + ind.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Name Length</Label>
                <Select value={nameLength} onValueChange={setNameLength}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (4-6 chars)</SelectItem>
                    <SelectItem value="medium">Medium (6-8 chars)</SelectItem>
                    <SelectItem value="long">Long (8-12 chars)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">Generation Styles</Label>
                <div className="mt-3 space-y-3 max-h-48 overflow-y-auto">
                  {Object.entries(GENERATION_STYLES).map(([key, style]) => (
                    <div key={key} className="flex items-start space-x-3">
                      <Checkbox
                        id={key}
                        checked={selectedStyles.includes(key)}
                        onCheckedChange={(checked) => handleStyleChange(key, checked === true)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={key} className="text-sm font-medium">
                          {style.name}
                        </Label>
                        <p className="text-xs text-gray-500">
                          {style.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={generateNames} className="w-full" size="lg">
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Names
              </Button>

              {generatedNames.length > 0 && (
                <Button onClick={downloadNames} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Results
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-500" />
                Generated Business Names
                {generatedNames.length > 0 && (
                  <span className="text-sm font-normal text-gray-500">
                    ({generatedNames.length} names)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedNames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                  {generatedNames.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(item.name)}
                            className={favorites.includes(item.name) ? 'text-red-500' : 'text-gray-400'}
                          >
                            <Heart className={`h-4 w-4 ${favorites.includes(item.name) ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(item.name)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">{item.style}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        {item.name.toLowerCase()}.com
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Ready to generate business names!</p>
                  <p className="text-sm">Configure your preferences and click "Generate Names" to start.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {favorites.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500 fill-current" />
                Favorites ({favorites.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {favorites.map((name, index) => (
                  <div key={index} className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2">
                    <span className="font-medium text-red-900">{name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(name)}
                      className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Generation Styles</h2>
            <div className="space-y-3">
              {Object.entries(GENERATION_STYLES).map(([key, style]) => (
                <div key={key} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-800">{style.name}</h3>
                  <p className="text-sm text-gray-600">{style.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tips for Great Business Names</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-gray-800">Keep It Short</h3>
                  <p className="text-sm text-gray-600">Shorter names are easier to remember and type</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-gray-800">Make It Memorable</h3>
                  <p className="text-sm text-gray-600">Choose names that stick in people's minds</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-gray-800">Check Domain Availability</h3>
                  <p className="text-sm text-gray-600">Ensure the .com domain is available</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-medium text-gray-800">Avoid Trends</h3>
                  <p className="text-sm text-gray-600">Choose timeless names over trendy ones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessNameGenerator;
