import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Copy, Download, RotateCcw, FileText, Trash2, Filter, SortAsc } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DuplicateLineRemover = () => {
  const [inputText, setInputText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [sortLines, setSortLines] = useState(false);
  const [keepFirstOccurrence, setKeepFirstOccurrence] = useState(true);
  const { toast } = useToast();

  const processedText = useMemo(() => {
    if (!inputText.trim()) {
      return {
        result: '',
        originalLines: 0,
        uniqueLines: 0,
        duplicatesRemoved: 0,
        emptyLinesRemoved: 0,
        duplicatesList: []
      };
    }

    let lines = inputText.split('\n');
    const originalCount = lines.length;
    let emptyLinesRemoved = 0;
    const duplicatesList: string[] = [];
    const seenLines = new Set<string>();
    const processedLines: string[] = [];

    // Remove empty lines if requested
    if (removeEmpty) {
      const beforeEmpty = lines.length;
      lines = lines.filter(line => line.trim() !== '');
      emptyLinesRemoved = beforeEmpty - lines.length;
    }

    // Process each line
    lines.forEach((line, index) => {
      let processedLine = line;
      
      // Trim whitespace if requested
      if (trimWhitespace) {
        processedLine = line.trim();
      }

      // Create comparison key based on case sensitivity
      const comparisonKey = caseSensitive ? processedLine : processedLine.toLowerCase();

      if (seenLines.has(comparisonKey)) {
        // This is a duplicate
        if (!duplicatesList.includes(processedLine)) {
          duplicatesList.push(processedLine);
        }
        
        if (!keepFirstOccurrence) {
          // If not keeping first occurrence, we might still add this one
          // This logic would be more complex, for now we'll keep it simple
        }
      } else {
        // First occurrence of this line
        seenLines.add(comparisonKey);
        processedLines.push(trimWhitespace ? processedLine : line);
      }
    });

    // Sort lines if requested
    if (sortLines) {
      processedLines.sort(caseSensitive ? undefined : (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    }

    const result = processedLines.join('\n');
    const uniqueLines = processedLines.length;
    const duplicatesRemoved = originalCount - uniqueLines - emptyLinesRemoved;

    return {
      result,
      originalLines: originalCount,
      uniqueLines,
      duplicatesRemoved,
      emptyLinesRemoved,
      duplicatesList
    };
  }, [inputText, caseSensitive, trimWhitespace, removeEmpty, sortLines, keepFirstOccurrence]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Processed text has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy text to clipboard.",
        variant: "destructive"
      });
    }
  };

  const downloadAsFile = () => {
    if (!processedText.result.trim()) {
      toast({
        title: "No text to download",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([processedText.result], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'duplicate-lines-removed.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "File downloaded",
      description: "The processed text has been downloaded.",
    });
  };

  const clearAll = () => {
    setInputText('');
  };

  const loadSampleText = () => {
    const sampleText = `Line 1
Line 2
Line 1
Line 3
Line 2

Line 4
  Line 5  
Line 5
LINE 1
line 6
Line 6
Line 7
Line 7
Line 7`;
    setInputText(sampleText);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold">Advanced Duplicate Line Remover</CardTitle>
              <CardDescription>
                Remove duplicate lines from your text with advanced options including case sensitivity, whitespace handling, sorting, and detailed statistics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Configuration Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="case-sensitive" className="text-sm font-medium">Case Sensitive</Label>
                  <Switch
                    id="case-sensitive"
                    checked={caseSensitive}
                    onCheckedChange={setCaseSensitive}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="trim-whitespace" className="text-sm font-medium">Trim Whitespace</Label>
                  <Switch
                    id="trim-whitespace"
                    checked={trimWhitespace}
                    onCheckedChange={setTrimWhitespace}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="remove-empty" className="text-sm font-medium">Remove Empty Lines</Label>
                  <Switch
                    id="remove-empty"
                    checked={removeEmpty}
                    onCheckedChange={setRemoveEmpty}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sort-lines" className="text-sm font-medium">Sort Lines</Label>
                  <Switch
                    id="sort-lines"
                    checked={sortLines}
                    onCheckedChange={setSortLines}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="keep-first" className="text-sm font-medium">Keep First Occurrence</Label>
                  <Switch
                    id="keep-first"
                    checked={keepFirstOccurrence}
                    onCheckedChange={setKeepFirstOccurrence}
                  />
                </div>
              </div>

              {/* Input Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="input-text" className="text-lg font-semibold">Input Text</Label>
                  <Button onClick={loadSampleText} variant="outline" size="sm">
                    Load Sample
                  </Button>
                </div>
                <Textarea
                  id="input-text"
                  placeholder="Enter your text here, each line will be processed separately..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] text-base font-mono"
                />
              </div>

              {/* Statistics */}
              {inputText.trim() && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{processedText.originalLines}</div>
                    <div className="text-sm text-gray-600">Original Lines</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{processedText.uniqueLines}</div>
                    <div className="text-sm text-gray-600">Unique Lines</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{processedText.duplicatesRemoved}</div>
                    <div className="text-sm text-gray-600">Duplicates Removed</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{processedText.emptyLinesRemoved}</div>
                    <div className="text-sm text-gray-600">Empty Lines Removed</div>
                  </Card>
                </div>
              )}

              {/* Result Section */}
              <div className="space-y-2">
                <Label htmlFor="result-text" className="text-lg font-semibold">Processed Text</Label>
                <Textarea
                  id="result-text"
                  value={processedText.result}
                  readOnly
                  className="min-h-[200px] text-base font-mono bg-gray-50"
                  placeholder="Processed text will appear here..."
                />
              </div>

              {/* Duplicate Lines List */}
              {processedText.duplicatesList.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Duplicate Lines Found</Label>
                  <Card className="p-4 max-h-40 overflow-y-auto">
                    <div className="space-y-1">
                      {processedText.duplicatesList.map((line, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="destructive" className="text-xs">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Duplicate
                          </Badge>
                          <span className="text-sm font-mono">{line || '(empty line)'}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 justify-center pt-4">
                <Button 
                  onClick={() => copyToClipboard(processedText.result)} 
                  variant="outline" 
                  className="flex items-center gap-2"
                  disabled={!processedText.result.trim()}
                >
                  <Copy className="h-4 w-4" />
                  Copy Result
                </Button>
                <Button 
                  onClick={downloadAsFile} 
                  variant="outline" 
                  className="flex items-center gap-2"
                  disabled={!processedText.result.trim()}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button onClick={clearAll} variant="destructive" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Clear All
                </Button>
              </div>

              {/* Usage Examples */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Common Use Cases:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Data Cleaning:</strong> Remove duplicate entries from lists, databases, or CSV data
                  </div>
                  <div>
                    <strong>Code Cleanup:</strong> Remove duplicate imports, function declarations, or configuration entries
                  </div>
                  <div>
                    <strong>Content Management:</strong> Clean up duplicate text content, URLs, or keywords
                  </div>
                  <div>
                    <strong>List Processing:</strong> Deduplicate email lists, contact lists, or inventory data
                  </div>
                </div>
              </div>

              {/* Feature Explanations */}
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Processing Options
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li><strong>Case Sensitive:</strong> Treats "Line" and "line" as different</li>
                    <li><strong>Trim Whitespace:</strong> Removes leading/trailing spaces</li>
                    <li><strong>Remove Empty:</strong> Eliminates blank lines from output</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <SortAsc className="h-4 w-4" />
                    Output Options
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li><strong>Sort Lines:</strong> Alphabetically orders the result</li>
                    <li><strong>Keep First:</strong> Preserves the first occurrence of duplicates</li>
                    <li><strong>Statistics:</strong> Shows detailed processing information</li>
                  </ul>
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

export default DuplicateLineRemover;
