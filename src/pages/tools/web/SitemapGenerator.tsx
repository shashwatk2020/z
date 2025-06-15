
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Copy, Download, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const SitemapGenerator = () => {
  const [urls, setUrls] = useState('');
  const [lastMod, setLastMod] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [changeFreq, setChangeFreq] = useState('daily');
  const [priority, setPriority] = useState('0.8');
  const [generatedSitemap, setGeneratedSitemap] = useState('');
  const { toast } = useToast();

  const generateSitemap = () => {
    const urlList = urls.split('\n').filter(url => url.trim() !== '');
    if (urlList.length === 0) {
      toast({ title: 'No URLs provided', description: 'Please enter at least one URL.', variant: 'destructive' });
      return;
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urlList.forEach(url => {
      xml += '  <url>\n';
      xml += `    <loc>${url.trim()}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>${changeFreq}</changefreq>\n`;
      xml += `    <priority>${priority}</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    setGeneratedSitemap(xml);
    toast({ title: 'Sitemap Generated', description: 'Your sitemap.xml has been generated.' });
  };
  
  const copyToClipboard = () => {
    if (!generatedSitemap) return;
    navigator.clipboard.writeText(generatedSitemap);
    toast({ title: "Copied!", description: "Sitemap content copied to clipboard." });
  };

  const downloadFile = () => {
    if (!generatedSitemap) return;
    const blob = new Blob([generatedSitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearForm = () => {
    setUrls('');
    setGeneratedSitemap('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Sitemap Generator</CardTitle>
              <CardDescription>Create a simple sitemap.xml by providing a list of your website's URLs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="urls">Enter URLs (one per line)</Label>
                <Textarea id="urls" value={urls} onChange={(e) => setUrls(e.target.value)} placeholder="https://example.com/\nhttps://example.com/about" className="min-h-[200px]" />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="last-mod">Last Modification Date</Label>
                  <Input id="last-mod" type="date" value={lastMod} onChange={(e) => setLastMod(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="change-freq">Change Frequency</Label>
                  <Select value={changeFreq} onValueChange={setChangeFreq}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="always">Always</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (0.0 to 1.0)</Label>
                  <Input id="priority" type="number" step="0.1" min="0" max="1" value={priority} onChange={(e) => setPriority(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={generateSitemap} className="flex-1">Generate Sitemap</Button>
                <Button variant="outline" onClick={clearForm}><RotateCcw className="h-4 w-4 mr-2" />Clear</Button>
              </div>

              {generatedSitemap && (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Generated sitemap.xml</CardTitle>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={copyToClipboard}><Copy className="h-4 w-4 mr-2" />Copy</Button>
                        <Button size="sm" variant="outline" onClick={downloadFile}><Download className="h-4 w-4 mr-2" />Download</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea value={generatedSitemap} readOnly className="min-h-[300px] font-mono bg-gray-900 text-green-400" />
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SitemapGenerator;
