
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Upload, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SentenceCaseConverter = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const convertToSentenceCase = () => {
    const converted = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    setResult(converted);
  };

  const copyToClipboard = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard successfully.",
      });
    }
  };

  const downloadText = () => {
    if (result) {
      const blob = new Blob([result], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sentence-case-text.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const clearAll = () => {
    setText('');
    setResult('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sentence Case Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Convert your text to proper sentence case format. Capitalize the first letter of each sentence while keeping the rest in lowercase.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Free Tool</Badge>
              <Badge variant="secondary">No Registration</Badge>
              <Badge variant="secondary">Instant Results</Badge>
            </div>
          </div>

          {/* Main Tool */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Sentence Case Converter Tool</CardTitle>
              <CardDescription>
                Enter your text below and convert it to sentence case format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Input Text</label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button variant="outline" size="sm" onClick={clearAll}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Type or paste your text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[300px] text-base"
                  />
                  <div className="flex gap-2">
                    <Button onClick={convertToSentenceCase} className="flex-1">
                      Convert to Sentence Case
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Result</label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        disabled={!result}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadText}
                        disabled={!result}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Your converted text will appear here..."
                    value={result}
                    readOnly
                    className="min-h-[300px] text-base bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>What is Sentence Case?</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p>
                    Sentence case is a capitalization style where only the first letter of each sentence is capitalized, 
                    while all other letters remain in lowercase. This is the standard capitalization used in most written 
                    English text, including books, articles, and formal documents.
                  </p>
                  <p>
                    Our sentence case converter automatically identifies sentence boundaries and applies proper capitalization, 
                    making it perfect for formatting text that may have inconsistent capitalization.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Use the Sentence Case Converter</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <ol>
                    <li><strong>Enter Your Text:</strong> Type or paste your text into the input area, or upload a text file.</li>
                    <li><strong>Convert:</strong> Click the "Convert to Sentence Case" button to process your text.</li>
                    <li><strong>Review Results:</strong> Your converted text will appear in the result area with proper sentence case formatting.</li>
                    <li><strong>Copy or Download:</strong> Use the copy button to copy the result to your clipboard, or download it as a text file.</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Automatic sentence boundary detection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Handles multiple punctuation marks (periods, exclamation marks, question marks)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>File upload support for text files</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Copy to clipboard functionality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Download results as text file</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>No character or word limits</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Input:</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded border">
                        HELLO WORLD! this is A SAMPLE text. how are YOU doing?
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Output:</h4>
                      <p className="text-sm bg-green-50 p-3 rounded border border-green-200">
                        Hello world! This is a sample text. How are you doing?
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Q: Does this tool handle abbreviations correctly?</h4>
                    <p className="text-sm text-gray-600">
                      The tool uses standard sentence boundary detection. It may not handle all abbreviations perfectly, 
                      but it works well for most common text formatting needs.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: Can I process multiple paragraphs at once?</h4>
                    <p className="text-sm text-gray-600">
                      Yes, the tool can handle multiple paragraphs and will apply sentence case formatting to each sentence 
                      throughout the entire text.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: Is there a limit to how much text I can convert?</h4>
                    <p className="text-sm text-gray-600">
                      No, there are no artificial limits. However, very large texts may take a moment to process.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q: Does the tool preserve formatting like line breaks?</h4>
                    <p className="text-sm text-gray-600">
                      Yes, the tool preserves the original structure of your text, including line breaks and spacing.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SentenceCaseConverter;
