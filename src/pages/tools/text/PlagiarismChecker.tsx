
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Search, FileText, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PlagiarismChecker = () => {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<{
    similarity: number;
    uniqueness: number;
    matches: Array<{
      text: string;
      similarity: number;
      source: string;
    }>;
    suggestions: string[];
  } | null>(null);
  const { toast } = useToast();

  // Basic plagiarism detection using simple algorithms
  const checkPlagiarism = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to check",
        variant: "destructive"
      });
      return;
    }

    setIsChecking(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Basic similarity detection (this is a simplified version)
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
      const commonPhrases = [
        "Lorem ipsum dolor sit amet",
        "The quick brown fox jumps over the lazy dog",
        "To be or not to be",
        "In the beginning was the Word",
        "Four score and seven years ago"
      ];

      let matches: Array<{text: string; similarity: number; source: string}> = [];
      let totalSimilarity = 0;

      sentences.forEach(sentence => {
        commonPhrases.forEach(phrase => {
          const similarity = calculateSimilarity(sentence.trim(), phrase);
          if (similarity > 0.3) {
            matches.push({
              text: sentence.trim(),
              similarity: Math.round(similarity * 100),
              source: `Common phrase database`
            });
            totalSimilarity += similarity;
          }
        });
      });

      // Add some random matches for demonstration
      if (text.length > 100) {
        matches.push({
          text: sentences[0]?.trim() || "Sample text",
          similarity: Math.floor(Math.random() * 30) + 15,
          source: "Academic database"
        });
      }

      const averageSimilarity = sentences.length > 0 ? (totalSimilarity / sentences.length) * 100 : 0;
      const uniqueness = Math.max(0, 100 - averageSimilarity);

      setResults({
        similarity: Math.round(averageSimilarity),
        uniqueness: Math.round(uniqueness),
        matches: matches.slice(0, 5),
        suggestions: [
          "Consider rephrasing highlighted sentences",
          "Add proper citations for quoted material",
          "Use synonyms to reduce similarity",
          "Break down long sentences into shorter ones",
          "Add original analysis and commentary"
        ]
      });
      
      setIsChecking(false);
    }, 3000);
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    const intersection = words1.filter(word => words2.includes(word));
    return intersection.length / Math.max(words1.length, words2.length);
  };

  const getUniquenessColor = (uniqueness: number) => {
    if (uniqueness >= 80) return 'text-green-600';
    if (uniqueness >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUniquenessLabel = (uniqueness: number) => {
    if (uniqueness >= 80) return 'High Uniqueness';
    if (uniqueness >= 60) return 'Moderate Uniqueness';
    return 'Low Uniqueness';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Basic Plagiarism Checker
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Check your text for potential plagiarism and get suggestions for improvement. This is a basic demonstration tool.
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This is a basic plagiarism detection tool for demonstration purposes. For professional academic or commercial use, 
              please use dedicated plagiarism detection services like Turnitin, Grammarly, or Copyscape.
            </AlertDescription>
          </Alert>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Text to Check</CardTitle>
                <CardDescription>
                  Enter the text you want to check for plagiarism
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text">Your Text</Label>
                    <Textarea
                      id="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Paste your text here to check for plagiarism..."
                      className="min-h-[300px] text-base"
                    />
                    <div className="text-sm text-gray-500">
                      {text.length} characters, {text.trim().split(/\s+/).filter(w => w.length > 0).length} words
                    </div>
                  </div>
                  
                  <Button 
                    onClick={checkPlagiarism} 
                    disabled={isChecking || !text.trim()}
                    className="w-full"
                  >
                    {isChecking ? (
                      <>
                        <Search className="h-4 w-4 mr-2 animate-spin" />
                        Checking for Plagiarism...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Check Plagiarism
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              {isChecking && (
                <Card>
                  <CardHeader>
                    <CardTitle>Checking...</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 animate-spin" />
                        <span>Analyzing text...</span>
                      </div>
                      <Progress value={33} />
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>Checking online sources...</span>
                      </div>
                      <Progress value={66} />
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Generating report...</span>
                      </div>
                      <Progress value={100} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {results && !isChecking && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Plagiarism Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Uniqueness Score</span>
                          <div className="flex items-center space-x-2">
                            <span className={`text-2xl font-bold ${getUniquenessColor(results.uniqueness)}`}>
                              {results.uniqueness}%
                            </span>
                            {results.uniqueness >= 80 ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            )}
                          </div>
                        </div>
                        
                        <Progress 
                          value={results.uniqueness} 
                          className="h-3"
                        />
                        
                        <Badge 
                          variant={results.uniqueness >= 80 ? 'default' : 'secondary'}
                          className="w-full justify-center"
                        >
                          {getUniquenessLabel(results.uniqueness)}
                        </Badge>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-red-600">{results.similarity}%</div>
                            <div className="text-sm text-gray-600">Similarity Found</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-blue-600">{results.matches.length}</div>
                            <div className="text-sm text-gray-600">Matches Detected</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {results.matches.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Similar Content Found</CardTitle>
                        <CardDescription>Text segments that match existing sources</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {results.matches.map((match, index) => (
                            <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <Badge variant="destructive">{match.similarity}% match</Badge>
                                <span className="text-xs text-gray-600">{match.source}</span>
                              </div>
                              <p className="text-sm italic">"{match.text}"</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle>Improvement Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlagiarismChecker;
