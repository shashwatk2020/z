
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Copy, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const TextSummarizer = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [length, setLength] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const summarizeText = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to summarize.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('summarize-text', {
        body: { text, length }
      });

      if (error) throw error;

      setSummary(data.summary);
      toast({
        title: "Success",
        description: "Text summarized successfully!",
      });
    } catch (error) {
      console.error('Error summarizing text:', error);
      toast({
        title: "Error",
        description: "Failed to summarize text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    toast({
      title: "Copied!",
      description: "Summary copied to clipboard.",
    });
  };

  const clearAll = () => {
    setText('');
    setSummary('');
    setLength('medium');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Text Summarizer (AI-Powered)
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Automatically summarize long texts, articles, and documents using advanced AI technology.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">AI Powered</Badge>
              <Badge variant="secondary">Multiple Lengths</Badge>
              <Badge variant="secondary">Instant Results</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Original Text
                </CardTitle>
                <CardDescription>
                  Enter the text you want to summarize
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Paste your long text, article, or document here to summarize..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[300px] text-base"
                />
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Summary Length</label>
                    <Select value={length} onValueChange={setLength}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                        <SelectItem value="medium">Medium (2-3 sentences)</SelectItem>
                        <SelectItem value="long">Long (4-6 sentences)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={summarizeText} 
                      disabled={isLoading || !text.trim()}
                      className="flex-1"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {isLoading ? 'Summarizing...' : 'Generate Summary'}
                    </Button>
                    <Button variant="outline" onClick={clearAll}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>

                {text && (
                  <div className="text-sm text-gray-600">
                    Characters: {text.length} | Words: {text.split(/\s+/).filter(word => word.length > 0).length}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>AI Summary</CardTitle>
                    <CardDescription>
                      Generated summary of your text
                    </CardDescription>
                  </div>
                  {summary && (
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={summary}
                  readOnly
                  placeholder="Summary will appear here..."
                  className="min-h-[300px] text-base bg-gray-50"
                />
                {summary && (
                  <div className="mt-4 text-sm text-gray-600">
                    Summary length: {summary.split(/\s+/).filter(word => word.length > 0).length} words
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Understanding AI text summarization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Smart Analysis</h4>
                  <p className="text-sm text-gray-600">
                    AI analyzes your text to identify main topics, key points, and important information.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Context Preservation</h4>
                  <p className="text-sm text-gray-600">
                    Maintains the original meaning and context while condensing the information.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Customizable Length</h4>
                  <p className="text-sm text-gray-600">
                    Choose from short, medium, or long summaries based on your needs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TextSummarizer;
