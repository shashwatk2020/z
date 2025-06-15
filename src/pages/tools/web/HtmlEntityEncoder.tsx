
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, Copy, Download, FileText, RotateCcw, Code, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HtmlEntityEncoder = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodingType, setEncodingType] = useState('named');
  const [encodeAll, setEncodeAll] = useState(false);
  const [preserveLineBreaks, setPreserveLineBreaks] = useState(true);
  const { toast } = useToast();

  // Common HTML entities mapping
  const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '\u0022': '&quot;', // Regular quotation mark
    "'": '&#39;',
    '©': '&copy;',
    '®': '&reg;',
    '™': '&trade;',
    '€': '&euro;',
    '£': '&pound;',
    '¥': '&yen;',
    '¢': '&cent;',
    '§': '&sect;',
    '¶': '&para;',
    '†': '&dagger;',
    '‡': '&Dagger;',
    '•': '&bull;',
    '…': '&hellip;',
    '′': '&prime;',
    '″': '&Prime;',
    '‹': '&lsaquo;',
    '›': '&rsaquo;',
    '‚': '&sbquo;',
    '\u201C': '&ldquo;', // Left double quotation mark
    '\u201D': '&rdquo;', // Right double quotation mark
    '\u2018': '&lsquo;', // Left single quotation mark
    '\u2019': '&rsquo;', // Right single quotation mark
    '–': '&ndash;',
    '—': '&mdash;',
    '\u00A0': '&nbsp;', // Non-breaking space
    '¡': '&iexcl;',
    '¿': '&iquest;',
    'À': '&Agrave;',
    'Á': '&Aacute;',
    'Â': '&Acirc;',
    'Ã': '&Atilde;',
    'Ä': '&Auml;',
    'Å': '&Aring;',
    'Æ': '&AElig;',
    'Ç': '&Ccedil;',
    'È': '&Egrave;',
    'É': '&Eacute;',
    'Ê': '&Ecirc;',
    'Ë': '&Euml;',
    'Ì': '&Igrave;',
    'Í': '&Iacute;',
    'Î': '&Icirc;',
    'Ï': '&Iuml;',
    'Ð': '&ETH;',
    'Ñ': '&Ntilde;',
    'Ò': '&Ograve;',
    'Ó': '&Oacute;',
    'Ô': '&Ocirc;',
    'Õ': '&Otilde;',
    'Ö': '&Ouml;',
    'Ø': '&Oslash;',
    'Ù': '&Ugrave;',
    'Ú': '&Uacute;',
    'Û': '&Ucirc;',
    'Ü': '&Uuml;',
    'Ý': '&Yacute;',
    'Þ': '&THORN;',
    'ß': '&szlig;',
    'à': '&agrave;',
    'á': '&aacute;',
    'â': '&acirc;',
    'ã': '&atilde;',
    'ä': '&auml;',
    'å': '&aring;',
    'æ': '&aelig;',
    'ç': '&ccedil;',
    'è': '&egrave;',
    'é': '&eacute;',
    'ê': '&ecirc;',
    'ë': '&euml;',
    'ì': '&igrave;',
    'í': '&iacute;',
    'î': '&icirc;',
    'ï': '&iuml;',
    'ð': '&eth;',
    'ñ': '&ntilde;',
    'ò': '&ograve;',
    'ó': '&oacute;',
    'ô': '&ocirc;',
    'õ': '&otilde;',
    'ö': '&ouml;',
    'ø': '&oslash;',
    'ù': '&ugrave;',
    'ú': '&uacute;',
    'û': '&ucirc;',
    'ü': '&uuml;',
    'ý': '&yacute;',
    'þ': '&thorn;',
    'ÿ': '&yuml;'
  };

  const encodeHtmlEntities = (text: string) => {
    try {
      let result = text;

      if (encodingType === 'named') {
        // Use named entities where available
        Object.entries(htmlEntities).forEach(([char, entity]) => {
          const regex = new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
          result = result.replace(regex, entity);
        });

        if (encodeAll) {
          // Encode remaining non-ASCII characters as numeric entities
          result = result.replace(/[^\x00-\x7F]/g, (char) => {
            const code = char.charCodeAt(0);
            return `&#${code};`;
          });
        }
      } else if (encodingType === 'numeric') {
        // Encode all special characters as numeric entities
        if (encodeAll) {
          result = result.replace(/[^\x00-\x7F]/g, (char) => {
            const code = char.charCodeAt(0);
            return `&#${code};`;
          });
        } else {
          // Just encode essential HTML characters
          result = result
            .replace(/&/g, '&#38;')
            .replace(/</g, '&#60;')
            .replace(/>/g, '&#62;')
            .replace(/"/g, '&#34;')
            .replace(/'/g, '&#39;');
        }
      } else if (encodingType === 'hex') {
        // Encode as hexadecimal numeric entities
        if (encodeAll) {
          result = result.replace(/[^\x00-\x7F]/g, (char) => {
            const code = char.charCodeAt(0);
            return `&#x${code.toString(16).toUpperCase()};`;
          });
        } else {
          // Just encode essential HTML characters
          result = result
            .replace(/&/g, '&#x26;')
            .replace(/</g, '&#x3C;')
            .replace(/>/g, '&#x3E;')
            .replace(/"/g, '&#x22;')
            .replace(/'/g, '&#x27;');
        }
      }

      if (preserveLineBreaks) {
        result = result.replace(/\n/g, '<br>\n');
      }

      return result;
    } catch (error) {
      throw new Error('Failed to encode HTML entities. Please check your input.');
    }
  };

  const decodeHtmlEntities = (text: string) => {
    try {
      let result = text;

      // Decode named entities
      const reverseEntities = Object.fromEntries(
        Object.entries(htmlEntities).map(([char, entity]) => [entity, char])
      );
      
      Object.entries(reverseEntities).forEach(([entity, char]) => {
        const regex = new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        result = result.replace(regex, char);
      });

      // Decode numeric entities (decimal)
      result = result.replace(/&#(\d+);/g, (match, code) => {
        return String.fromCharCode(parseInt(code, 10));
      });

      // Decode hexadecimal entities
      result = result.replace(/&#x([0-9A-Fa-f]+);/g, (match, code) => {
        return String.fromCharCode(parseInt(code, 16));
      });

      // Handle line breaks
      if (preserveLineBreaks) {
        result = result.replace(/<br\s*\/?>/gi, '\n');
      }

      return result;
    } catch (error) {
      throw new Error('Failed to decode HTML entities. Please check your input.');
    }
  };

  const processText = () => {
    try {
      if (!inputText.trim()) {
        toast({
          title: "Input Required",
          description: "Please enter text to process.",
          variant: "destructive",
        });
        return;
      }

      const result = mode === 'encode' 
        ? encodeHtmlEntities(inputText)
        : decodeHtmlEntities(inputText);
      
      setOutputText(result);
      
      toast({
        title: `HTML Entities ${mode === 'encode' ? 'Encoded' : 'Decoded'}`,
        description: `Successfully ${mode === 'encode' ? 'encoded' : 'decoded'} your text.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Processing failed';
      toast({
        title: "Processing Error",
        description: message,
        variant: "destructive",
      });
      setOutputText('');
    }
  };

  const copyToClipboard = async () => {
    if (!outputText) {
      toast({
        title: "Nothing to Copy",
        description: "Please process text first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: "Copied!",
        description: "Output copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadOutput = () => {
    if (!outputText) {
      toast({
        title: "Nothing to Download",
        description: "Please process text first.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([outputText], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'encoded.html' : 'decoded.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Output file has been downloaded.",
    });
  };

  const swapInputOutput = () => {
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
    setMode(mode === 'encode' ? 'decode' : 'encode');
    
    toast({
      title: "Swapped",
      description: "Input and output have been swapped.",
    });
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };

  const insertSampleText = () => {
    if (mode === 'encode') {
      setInputText('Hello "World" & welcome to HTML encoding!\nSpecial characters: <script>, ©, ®, €, à, ñ, 中文');
    } else {
      setInputText('Hello &quot;World&quot; &amp; welcome to HTML decoding!<br>\nSpecial characters: &lt;script&gt;, &copy;, &reg;, &euro;, &agrave;, &ntilde;, &#20013;&#25991;');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              HTML Entity Encoder/Decoder
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Convert special characters to HTML entities and vice versa. Perfect for web development and content management.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary">Named Entities</Badge>
              <Badge variant="secondary">Numeric Entities</Badge>
              <Badge variant="secondary">Hex Entities</Badge>
              <Badge variant="secondary">Special Characters</Badge>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Tabs value={mode} onValueChange={(value) => setMode(value as 'encode' | 'decode')} className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="encode">Encode</TabsTrigger>
                <TabsTrigger value="decode">Decode</TabsTrigger>
              </TabsList>

              <TabsContent value="encode" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Encode to HTML Entities
                    </CardTitle>
                    <CardDescription>
                      Convert special characters to HTML entities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="input-text">Input Text</Label>
                      <Textarea
                        id="input-text"
                        placeholder="Enter text with special characters..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="encoding-type">Encoding Type</Label>
                        <Select value={encodingType} onValueChange={setEncodingType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="named">Named Entities (&amp;, &lt;, etc.)</SelectItem>
                            <SelectItem value="numeric">Numeric Entities (&#38;, &#60;, etc.)</SelectItem>
                            <SelectItem value="hex">Hex Entities (&#x26;, &#x3C;, etc.)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="encode-all"
                            checked={encodeAll}
                            onCheckedChange={setEncodeAll}
                          />
                          <Label htmlFor="encode-all">Encode All Non-ASCII</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="preserve-breaks"
                            checked={preserveLineBreaks}
                            onCheckedChange={setPreserveLineBreaks}
                          />
                          <Label htmlFor="preserve-breaks">Convert Line Breaks to &lt;br&gt;</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="decode" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      Decode HTML Entities
                    </CardTitle>
                    <CardDescription>
                      Convert HTML entities back to readable text
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="input-entities">HTML with Entities</Label>
                      <Textarea
                        id="input-entities"
                        placeholder="Enter HTML with entities to decode..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="preserve-breaks-decode"
                        checked={preserveLineBreaks}
                        onCheckedChange={setPreserveLineBreaks}
                      />
                      <Label htmlFor="preserve-breaks-decode">Convert &lt;br&gt; to Line Breaks</Label>
                    </div>

                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <strong>Supported Entity Types:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Named entities: &amp;amp;, &amp;lt;, &amp;copy;, etc.</li>
                        <li>• Numeric entities: &amp;#38;, &amp;#60;, &amp;#169;, etc.</li>
                        <li>• Hex entities: &amp;#x26;, &amp;#x3C;, &amp;#xA9;, etc.</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 flex-wrap mb-8">
              <Button onClick={processText} className="flex-1">
                {mode === 'encode' ? 'Encode Entities' : 'Decode Entities'}
              </Button>
              <Button variant="outline" onClick={swapInputOutput}>
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Swap
              </Button>
              <Button variant="outline" onClick={insertSampleText}>
                <FileText className="h-4 w-4 mr-2" />
                Sample
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Output
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadOutput}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  {mode === 'encode' ? 'HTML entities encoded result' : 'Decoded text result'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[200px]">
                  {outputText ? (
                    <div className="space-y-4">
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                          {outputText}
                        </pre>
                      </div>
                      <div className="text-sm text-gray-600">
                        Characters: {outputText.length} | 
                        Original: {inputText.length}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Click "{mode === 'encode' ? 'Encode Entities' : 'Decode Entities'}" to process</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Encoding Features</CardTitle>
                  <CardDescription>Available options</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Named entity encoding (&amp;copy;)</li>
                    <li>• Numeric entity encoding (&#169;)</li>
                    <li>• Hexadecimal encoding (&#xA9;)</li>
                    <li>• Selective or complete encoding</li>
                    <li>• Line break preservation</li>
                    <li>• Unicode character support</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Use Cases</CardTitle>
                  <CardDescription>When to use this tool</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• HTML content preparation</li>
                    <li>• XML document encoding</li>
                    <li>• Email template creation</li>
                    <li>• Web form data handling</li>
                    <li>• Content management systems</li>
                    <li>• Special character display</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Essential Entities</CardTitle>
                  <CardDescription>Most commonly used</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• <strong>&amp;</strong> → &amp;amp;</li>
                    <li>• <strong>&lt;</strong> → &amp;lt;</li>
                    <li>• <strong>&gt;</strong> → &amp;gt;</li>
                    <li>• <strong>"</strong> → &amp;quot;</li>
                    <li>• <strong>'</strong> → &amp;#39;</li>
                    <li>• <strong>©</strong> → &amp;copy;</li>
                  </ul>
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

export default HtmlEntityEncoder;
