
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book } from 'lucide-react';

const PassphraseGenerator = () => (
  <Layout>
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Book className="h-12 w-12 mx-auto text-green-600" />
        <h1 className="text-3xl font-bold">Passphrase Generator</h1>
        <p className="text-gray-600">Generate memorable passphrases</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Generate Passphrase</CardTitle></CardHeader>
        <CardContent>
          <Button className="w-full">Generate Passphrase</Button>
        </CardContent>
      </Card>
    </div>
  </Layout>
);

export default PassphraseGenerator;
