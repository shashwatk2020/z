
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ArticleSchemaForm = ({ schema, setSchema }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Headline</Label>
      <Input value={schema.headline || ''} onChange={e => setSchema({ ...schema, headline: e.target.value })} placeholder="Article Title" />
    </div>
    <div className="space-y-2">
      <Label>Author Name</Label>
      <Input value={schema.author?.name || ''} onChange={e => setSchema({ ...schema, author: { '@type': 'Person', name: e.target.value } })} placeholder="John Doe"/>
    </div>
    <div className="space-y-2">
      <Label>Publisher Name</Label>
      <Input value={schema.publisher?.name || ''} onChange={e => setSchema({ ...schema, publisher: { '@type': 'Organization', name: e.target.value } })} placeholder="Publisher Inc."/>
    </div>
    <div className="space-y-2">
      <Label>Publisher Logo URL</Label>
      <Input value={schema.publisher?.logo?.url || ''} onChange={e => setSchema({ ...schema, publisher: { ...schema.publisher, logo: { '@type': 'ImageObject', url: e.target.value } } })} placeholder="https://example.com/logo.png"/>
    </div>
    <div className="space-y-2">
      <Label>Date Published (YYYY-MM-DD)</Label>
      <Input type="date" value={schema.datePublished || ''} onChange={e => setSchema({ ...schema, datePublished: e.target.value })} />
    </div>
  </div>
);

const FaqSchemaForm = ({ schema, setSchema }) => {
  const handleQuestionChange = (index, value) => {
    const newQuestions = [...(schema.mainEntity || [])];
    newQuestions[index].name = value;
    setSchema({ ...schema, mainEntity: newQuestions });
  };
  
  const handleAnswerChange = (index, value) => {
    const newQuestions = [...(schema.mainEntity || [])];
    newQuestions[index].acceptedAnswer.text = value;
    setSchema({ ...schema, mainEntity: newQuestions });
  };

  const addQuestion = () => {
    const newQuestions = [...(schema.mainEntity || []), { '@type': 'Question', name: '', acceptedAnswer: { '@type': 'Answer', text: '' } }];
    setSchema({ ...schema, mainEntity: newQuestions });
  };
  
  const removeQuestion = (index) => {
    const newQuestions = [...(schema.mainEntity || [])];
    newQuestions.splice(index, 1);
    setSchema({ ...schema, mainEntity: newQuestions });
  };
  
  useEffect(() => {
    if (!schema.mainEntity || schema.mainEntity.length === 0) {
      addQuestion();
    }
  }, []);

  return (
    <div className="space-y-4">
      {(schema.mainEntity || []).map((faq, index) => (
        <Card key={index} className="p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <Label className="font-semibold">FAQ #{index + 1}</Label>
            <Button variant="ghost" size="icon" onClick={() => removeQuestion(index)}><Trash2 className="h-4 w-4" /></Button>
          </div>
          <div className="space-y-2">
            <Label>Question</Label>
            <Input value={faq.name} onChange={e => handleQuestionChange(index, e.target.value)} placeholder="What is...?"/>
            <Label>Answer</Label>
            <Textarea value={faq.acceptedAnswer.text} onChange={e => handleAnswerChange(index, e.target.value)} placeholder="The answer is..."/>
          </div>
        </Card>
      ))}
      <Button variant="outline" onClick={addQuestion}><PlusCircle className="h-4 w-4 mr-2" />Add FAQ</Button>
    </div>
  );
};

const SchemaMarkupGenerator = () => {
  const [schemaType, setSchemaType] = useState('Article');
  const [schema, setSchema] = useState({ "@context": "https://schema.org", "@type": "Article" });
  const [generatedScript, setGeneratedScript] = useState('');
  const { toast } = useToast();

  const handleSchemaTypeChange = (type) => {
    setSchemaType(type);
    let baseSchema = { "@context": "https://schema.org", "@type": type };
    setSchema(baseSchema);
    setGeneratedScript('');
  };

  const generateSchema = () => {
    const script = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
    setGeneratedScript(script);
    toast({ title: "Schema Markup Generated" });
  };
  
  const copyToClipboard = () => {
    if (!generatedScript) return;
    navigator.clipboard.writeText(generatedScript);
    toast({ title: "Copied!", description: "Schema script copied to clipboard." });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Schema Markup Generator (JSON-LD)</CardTitle>
              <CardDescription>Create structured data for your website to improve SEO.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Select Schema Type</Label>
                <Select value={schemaType} onValueChange={handleSchemaTypeChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Article">Article</SelectItem>
                    <SelectItem value="FAQPage">FAQ Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {schemaType === 'Article' && <ArticleSchemaForm schema={schema} setSchema={setSchema} />}
              {schemaType === 'FAQPage' && <FaqSchemaForm schema={schema} setSchema={setSchema} />}

              <Button onClick={generateSchema} className="w-full">Generate Schema</Button>

              {generatedScript && (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Generated JSON-LD Script</CardTitle>
                      <Button size="sm" variant="outline" onClick={copyToClipboard}><Copy className="h-4 w-4 mr-2" />Copy</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea value={generatedScript} readOnly className="min-h-[300px] font-mono bg-gray-900 text-green-400" />
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

export default SchemaMarkupGenerator;
