
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeaturedToolsGrid from '@/components/tools/FeaturedToolsGrid';
import ToolSection from '@/components/tools/ToolSection';
import TextToolsContent from '@/components/tools/TextToolsContent';
import { featuredTools, conversionTools, generationTools, analysisTools, stylingTools } from '@/data/textTools';

const TextTools = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Comprehensive Online Text Tools
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
                Your one-stop destination for manipulating, analyzing, and transforming text. From simple case conversion to complex analysis, our tools are designed to be fast, free, and easy to use.
              </p>
            </div>
          </div>
        </div>

        <FeaturedToolsGrid tools={featuredTools} />

        <div className="py-12 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">All Our Text Tools</h2>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">Explore our full suite of text utilities for any task imaginable, from simple conversions to creative text generation.</p>
            </div>

            <div className="space-y-16">
              <ToolSection title="Conversion & Case" tools={conversionTools} />
              <ToolSection title="Generation" tools={generationTools} />
              <ToolSection title="Analysis & Utilities" tools={analysisTools} />
              <ToolSection title="Styling & Fun" tools={stylingTools} />
            </div>
          </div>
        </div>

        <TextToolsContent />
      </main>
      <Footer />
    </div>
  );
};

export default TextTools;
