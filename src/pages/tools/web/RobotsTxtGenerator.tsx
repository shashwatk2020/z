
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RobotsTxtGenerator = () => {
  const [rules, setRules] = useState([{ userAgent: '*', disallow: ['/'], allow: [] }]);
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [generatedRobotsTxt, setGeneratedRobotsTxt] = useState('');
  const { toast } = useToast();

  const handleRuleChange = (index, field, value) => {
    const newRules = [...rules];
    newRules[index][field] = value;
    setRules(newRules);
  };

  const handlePathChange = (ruleIndex, pathType, pathIndex, value) => {
    const newRules = [...rules];
    newRules[ruleIndex][pathType][pathIndex] = value;
    setRules(newRules);
  };

  const addPath = (ruleIndex, pathType) => {
    const newRules = [...rules];
    newRules[ruleIndex][pathType].push('');
    setRules(newRules);
  };

  const removePath = (ruleIndex, pathType, pathIndex) => {
    const newRules = [...rules];
    newRules[ruleIndex][pathType].splice(pathIndex, 1);
    setRules(newRules);
  };

  const addRule = () => {
    setRules([...rules, { userAgent: '', disallow: [], allow: [] }]);
  };

  const removeRule = (index) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);
  };

  const generateRobotsTxt = () => {
    let content = '';
    rules.forEach(rule => {
      content += `User-agent: ${rule.userAgent || '*'}\n`;
      rule.allow.forEach(path => {
        if (path) content += `Allow: ${path}\n`;
      });
      rule.disallow.forEach(path => {
        if (path) content += `Disallow: ${path}\n`;
      });
      content += '\n';
    });

    if (sitemapUrl) {
      content += `Sitemap: ${sitemapUrl}\n`;
    }

    setGeneratedRobotsTxt(content.trim());
    toast({ title: "robots.txt Generated", description: "Your robots.txt file has been generated." });
  };

  const copyToClipboard = () => {
    if (!generatedRobotsTxt) return;
    navigator.clipboard.writeText(generatedRobotsTxt);
    toast({ title: "Copied!", description: "robots.txt content copied to clipboard." });
  };

  const downloadFile = () => {
    if (!generatedRobotsTxt) return;
    const blob = new Blob([generatedRobotsTxt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Robots.txt Generator</CardTitle>
              <CardDescription>Create a robots.txt file to manage search engine crawlers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {rules.map((rule, ruleIndex) => (
                <Card key={ruleIndex} className="p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <Label className="font-semibold">Rule #{ruleIndex + 1}</Label>
                    <Button variant="ghost" size="icon" onClick={() => removeRule(ruleIndex)} disabled={rules.length === 1}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`user-agent-${ruleIndex}`}>User-agent</Label>
                      <Input id={`user-agent-${ruleIndex}`} value={rule.userAgent} onChange={(e) => handleRuleChange(ruleIndex, 'userAgent', e.target.value)} placeholder="e.g. * or Googlebot" />
                    </div>
                    <div>
                      <Label>Allow</Label>
                      {rule.allow.map((path, pathIndex) => (
                        <div key={pathIndex} className="flex items-center gap-2 mb-2">
                          <Input value={path} onChange={(e) => handlePathChange(ruleIndex, 'allow', pathIndex, e.target.value)} placeholder="/allowed-path" />
                          <Button variant="ghost" size="icon" onClick={() => removePath(ruleIndex, 'allow', pathIndex)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addPath(ruleIndex, 'allow')}><PlusCircle className="h-4 w-4 mr-2" />Add Allow Path</Button>
                    </div>
                    <div>
                      <Label>Disallow</Label>
                      {rule.disallow.map((path, pathIndex) => (
                        <div key={pathIndex} className="flex items-center gap-2 mb-2">
                          <Input value={path} onChange={(e) => handlePathChange(ruleIndex, 'disallow', pathIndex, e.target.value)} placeholder="/disallowed-path" />
                          <Button variant="ghost" size="icon" onClick={() => removePath(ruleIndex, 'disallow', pathIndex)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addPath(ruleIndex, 'disallow')}><PlusCircle className="h-4 w-4 mr-2" />Add Disallow Path</Button>
                    </div>
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={addRule}><PlusCircle className="h-4 w-4 mr-2" />Add Another Rule</Button>

              <div className="space-y-2">
                <Label htmlFor="sitemap-url">Sitemap URL (optional)</Label>
                <Input id="sitemap-url" value={sitemapUrl} onChange={(e) => setSitemapUrl(e.target.value)} placeholder="https://example.com/sitemap.xml" />
              </div>
              
              <Button onClick={generateRobotsTxt} className="w-full">Generate robots.txt</Button>

              {generatedRobotsTxt && (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Generated robots.txt</CardTitle>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={copyToClipboard}><Copy className="h-4 w-4 mr-2" />Copy</Button>
                        <Button size="sm" variant="outline" onClick={downloadFile}><Download className="h-4 w-4 mr-2" />Download</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea value={generatedRobotsTxt} readOnly className="min-h-[200px] font-mono bg-gray-900 text-green-400" />
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

export default RobotsTxtGenerator;
