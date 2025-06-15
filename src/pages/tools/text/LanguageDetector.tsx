
import React, { useState, useMemo } from 'react';
import { Globe, Search, BarChart3, FileText } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface LanguageResult {
  language: string;
  nativeName: string;
  code: string;
  confidence: number;
  score: number;
}

const LanguageDetector = () => {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<LanguageResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // Language patterns and common words for basic detection
  const languagePatterns = {
    english: {
      name: 'English',
      nativeName: 'English',
      code: 'en',
      commonWords: ['the', 'and', 'to', 'of', 'a', 'in', 'is', 'it', 'you', 'that', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'i'],
      patterns: [/\b(the|and|to|of|a|in|is|it|you|that)\b/gi]
    },
    spanish: {
      name: 'Spanish',
      nativeName: 'Español',
      code: 'es',
      commonWords: ['el', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al'],
      patterns: [/\b(el|de|que|y|a|en|un|es|se|no)\b/gi, /ñ/g, /[áéíóúü]/g]
    },
    french: {
      name: 'French',
      nativeName: 'Français',
      code: 'fr',
      commonWords: ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que', 'pour', 'dans', 'ce', 'son', 'une', 'sur', 'avec', 'ne', 'se'],
      patterns: [/\b(le|de|et|à|un|il|être|en|avoir|que)\b/gi, /[àâäéèêëïîôöùûü]/g, /ç/g]
    },
    german: {
      name: 'German',
      nativeName: 'Deutsch',
      code: 'de',
      commonWords: ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich', 'des', 'auf', 'für', 'ist', 'im', 'dem', 'nicht', 'ein', 'eine', 'als'],
      patterns: [/\b(der|die|und|in|den|von|zu|das|mit)\b/gi, /[äöüß]/g, /\b\w+ung\b/gi, /\b\w+heit\b/gi]
    },
    italian: {
      name: 'Italian',
      nativeName: 'Italiano',
      code: 'it',
      commonWords: ['il', 'di', 'che', 'e', 'la', 'per', 'un', 'in', 'con', 'del', 'da', 'a', 'al', 'sono', 'le', 'più', 'una', 'su', 'anche', 'come'],
      patterns: [/\b(il|di|che|e|la|per|un|in|con|del)\b/gi, /[àèéìíîòóù]/g]
    },
    portuguese: {
      name: 'Portuguese',
      nativeName: 'Português',
      code: 'pt',
      commonWords: ['o', 'de', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos'],
      patterns: [/\b(o|de|e|do|da|em|um|para|é|com)\b/gi, /[àáâãçéêíóôõú]/g, /ção\b/gi]
    },
    dutch: {
      name: 'Dutch',
      nativeName: 'Nederlands',
      code: 'nl',
      commonWords: ['de', 'van', 'het', 'een', 'en', 'in', 'op', 'dat', 'is', 'voor', 'met', 'als', 'zijn', 'er', 'aan', 'te', 'die', 'door', 'bij', 'om'],
      patterns: [/\b(de|van|het|een|en|in|op|dat|is|voor)\b/gi, /ij/g, /\b\w+je\b/gi]
    },
    russian: {
      name: 'Russian',
      nativeName: 'Русский',
      code: 'ru',
      commonWords: ['в', 'и', 'не', 'на', 'я', 'быть', 'то', 'он', 'с', 'а', 'как', 'что', 'это', 'вы', 'мы', 'к', 'из', 'у', 'же', 'от'],
      patterns: [/[а-яё]/gi, /\b(в|и|не|на|я|быть|то|он|с|а)\b/gi]
    },
    chinese: {
      name: 'Chinese',
      nativeName: '中文',
      code: 'zh',
      commonWords: ['的', '是', '在', '了', '不', '和', '有', '大', '这', '主', '国', '一', '人', '我', '们', '中', '来', '时', '到', '地'],
      patterns: [/[\u4e00-\u9fff]/g, /\b(的|是|在|了|不|和|有|大|这|主)\b/gi]
    },
    japanese: {
      name: 'Japanese',
      nativeName: '日本語',
      code: 'ja',
      commonWords: ['の', 'に', 'は', 'を', 'た', 'が', 'で', 'て', 'と', 'し', 'れ', 'さ', 'ある', 'いる', 'も', 'する', 'から', 'な', 'こと', 'として'],
      patterns: [/[\u3040-\u309f]/g, /[\u30a0-\u30ff]/g, /[\u4e00-\u9fff]/g]
    },
    arabic: {
      name: 'Arabic',
      nativeName: 'العربية',
      code: 'ar',
      commonWords: ['في', 'من', 'إلى', 'على', 'هذا', 'هذه', 'التي', 'الذي', 'كان', 'كانت', 'يكون', 'تكون', 'له', 'لها', 'بعد', 'قبل', 'عند', 'لدى', 'أن', 'إن'],
      patterns: [/[\u0600-\u06ff]/g, /\b(في|من|إلى|على|هذا|هذه|التي|الذي)\b/gi]
    }
  };

  const detectLanguage = (text: string): LanguageResult[] => {
    const results: LanguageResult[] = [];
    const cleanText = text.toLowerCase().trim();
    
    if (!cleanText) return results;

    Object.entries(languagePatterns).forEach(([key, lang]) => {
      let score = 0;
      let matches = 0;
      
      // Check common words
      lang.commonWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const wordMatches = (cleanText.match(regex) || []).length;
        matches += wordMatches;
        score += wordMatches * 2; // Higher weight for common words
      });
      
      // Check language-specific patterns
      lang.patterns.forEach(pattern => {
        const patternMatches = (cleanText.match(pattern) || []).length;
        matches += patternMatches;
        score += patternMatches;
      });
      
      // Calculate confidence based on text length and matches
      const confidence = Math.min((matches / Math.max(cleanText.split(/\s+/).length * 0.1, 1)) * 100, 100);
      
      if (score > 0) {
        results.push({
          language: lang.name,
          nativeName: lang.nativeName,
          code: lang.code,
          confidence: Math.round(confidence),
          score
        });
      }
    });
    
    // Sort by score and return top results
    return results.sort((a, b) => b.score - a.score).slice(0, 5);
  };

  const textStats = useMemo(() => {
    if (!inputText.trim()) {
      return {
        characters: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0
      };
    }

    const words = inputText.trim().split(/\s+/);
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = inputText.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    return {
      characters: inputText.length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length
    };
  }, [inputText]);

  const analyzeLanguage = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const detectedLanguages = detectLanguage(inputText);
    setResults(detectedLanguages);
    
    setIsAnalyzing(false);
    
    if (detectedLanguages.length > 0) {
      toast({
        title: "Analysis Complete!",
        description: `Detected ${detectedLanguages.length} possible language${detectedLanguages.length !== 1 ? 's' : ''}.`,
      });
    } else {
      toast({
        title: "No Languages Detected",
        description: "Could not identify the language of the provided text.",
        variant: "destructive",
      });
    }
  };

  const reset = () => {
    setInputText('');
    setResults([]);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    if (confidence >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'Very High';
    if (confidence >= 60) return 'High';
    if (confidence >= 40) return 'Medium';
    if (confidence >= 20) return 'Low';
    return 'Very Low';
  };

  const sampleTexts = [
    {
      language: 'English',
      text: 'Hello, how are you today? This is a sample text in English.',
      flag: '🇺🇸'
    },
    {
      language: 'Spanish',
      text: 'Hola, ¿cómo estás hoy? Este es un texto de muestra en español.',
      flag: '🇪🇸'
    },
    {
      language: 'French',
      text: 'Bonjour, comment allez-vous aujourd\'hui? Ceci est un texte d\'exemple en français.',
      flag: '🇫🇷'
    },
    {
      language: 'German',
      text: 'Hallo, wie geht es dir heute? Dies ist ein Beispieltext auf Deutsch.',
      flag: '🇩🇪'
    },
    {
      language: 'Italian',
      text: 'Ciao, come stai oggi? Questo è un testo di esempio in italiano.',
      flag: '🇮🇹'
    },
    {
      language: 'Portuguese',
      text: 'Olá, como você está hoje? Este é um texto de exemplo em português.',
      flag: '🇵🇹'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Language Detector
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Automatically detect the language of any text using advanced pattern recognition. Supports multiple languages with confidence scoring and detailed analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <FileText className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-xl font-bold">{textStats.characters}</p>
                  <p className="text-sm text-gray-600">Characters</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <BarChart3 className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <p className="text-xl font-bold">{textStats.words}</p>
                  <p className="text-sm text-gray-600">Words</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Search className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                  <p className="text-xl font-bold">{textStats.sentences}</p>
                  <p className="text-sm text-gray-600">Sentences</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Globe className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-xl font-bold">{results.length}</p>
                  <p className="text-sm text-gray-600">Languages Found</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="detector" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="detector">Language Detector</TabsTrigger>
                <TabsTrigger value="results">Detection Results</TabsTrigger>
                <TabsTrigger value="samples">Sample Texts</TabsTrigger>
              </TabsList>

              <TabsContent value="detector" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Text Analysis</span>
                    </CardTitle>
                    <CardDescription>
                      Enter text in any language to detect and analyze it.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="input-text">Text to Analyze</Label>
                      <Textarea
                        id="input-text"
                        placeholder="Enter or paste text in any language here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[200px] mt-2"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={analyzeLanguage} 
                        size="lg" 
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            Detect Language
                          </>
                        )}
                      </Button>
                      <Button onClick={reset} variant="outline" size="lg">
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="results" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detection Results</CardTitle>
                    <CardDescription>
                      Language detection results with confidence scores.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {results.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No language analysis results yet.</p>
                        <p className="text-sm">Enter some text and click "Detect Language" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {results.map((result, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold flex items-center space-x-2">
                                  <span>{result.language}</span>
                                  <Badge variant="outline">{result.code.toUpperCase()}</Badge>
                                </h3>
                                <p className="text-gray-600">{result.nativeName}</p>
                              </div>
                              <div className="text-right">
                                <p className={`text-lg font-bold ${getConfidenceColor(result.confidence)}`}>
                                  {result.confidence}%
                                </p>
                                <p className="text-sm text-gray-600">
                                  {getConfidenceLabel(result.confidence)}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Confidence Level</span>
                                <span>{result.confidence}%</span>
                              </div>
                              <Progress value={result.confidence} className="h-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="samples" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sample Texts</CardTitle>
                    <CardDescription>
                      Click on any sample text to test the language detector.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {sampleTexts.map((sample, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => setInputText(sample.text)}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl">{sample.flag}</span>
                            <div className="flex-1">
                              <h3 className="font-medium mb-1">{sample.language}</h3>
                              <p className="text-gray-600 text-sm">{sample.text}</p>
                              <Badge variant="outline" className="mt-2">Click to test</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LanguageDetector;
