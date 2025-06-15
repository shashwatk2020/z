
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Copy, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const YodaTranslator = () => {
  const [text, setText] = useState('');
  const [yodaText, setYodaText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const translateToYoda = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to translate.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('yoda-translate', {
        body: { text }
      });

      if (error) throw error;

      setYodaText(data.yodaText);
      toast({
        title: "Success",
        description: "Text translated to Yoda speech!",
      });
    } catch (error) {
      console.error('Error translating text:', error);
      toast({
        title: "Error",
        description: "Failed to translate text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(yodaText);
    toast({
      title: "Copied!",
      description: "Yoda translation copied to clipboard.",
    });
  };

  const clearAll = () => {
    setText('');
    setYodaText('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Yoda Translator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transform your text to speak like Master Yoda. Use the Force of language patterns, you will.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">AI Powered</Badge>
              <Badge variant="secondary">Star Wars Style</Badge>
              <Badge variant="secondary">Instant Translation</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Normal Text
                </CardTitle>
                <CardDescription>
                  Enter the text you want to translate to Yoda speech
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Enter the text you want to translate to Yoda speech..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] text-base"
                />
                
                <div className="flex gap-2">
                  <Button 
                    onClick={translateToYoda} 
                    disabled={isLoading || !text.trim()}
                    className="flex-1"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {isLoading ? 'Translating...' : 'Translate to Yoda Speech'}
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>

                {text && (
                  <div className="text-sm text-gray-600">
                    Characters: {text.length}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Yoda Translation</CardTitle>
                    <CardDescription>
                      Your text transformed to Yoda's speech pattern
                    </CardDescription>
                  </div>
                  {yodaText && (
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={yodaText}
                  readOnly
                  placeholder="Yoda translation will appear here..."
                  className="min-h-[200px] text-base bg-green-50 font-mono"
                />
                {yodaText && (
                  <div className="mt-4 text-sm text-gray-600">
                    Translated characters: {yodaText.length}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>How Yoda Speaks</CardTitle>
                <CardDescription>Understanding Yoda's speech patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Object-Subject-Verb sentence restructuring</li>
                  <li>• Wisdom-like phrasing transformations</li>
                  <li>• Proper word inversions and arrangements</li>
                  <li>• Context-aware sentence modifications</li>
                  <li>• Preservation of original meaning</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example Transformations</CardTitle>
                <CardDescription>See how normal text becomes Yoda speech</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Normal: "You will learn the ways of the Force"</p>
                    <p className="text-green-700 font-medium">Yoda: "Learn the ways of the Force, you will"</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Normal: "I am going to the store"</p>
                    <p className="text-green-700 font-medium">Yoda: "To the store, going I am"</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Normal: "The path is difficult"</p>
                    <p className="text-green-700 font-medium">Yoda: "Difficult, the path is"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default YodaTranslator;
