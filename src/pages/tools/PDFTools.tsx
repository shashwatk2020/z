import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText, FileSpreadsheet, Image, PenTool, FileLock, Merge, Split, Search, Palette, Hash, Shield, Unlock, Trash2, Info } from 'lucide-react';

const pdfTools = [
  {
    name: 'PDF to Word Converter',
    description: 'Convert your PDF documents to editable Word files.',
    link: '/tools/pdf/pdf-to-word-converter',
    icon: <FileText className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'PDF to Excel Converter',
    description: 'Convert your PDF documents to editable Excel spreadsheets.',
    link: '/tools/pdf/pdf-to-excel-converter',
    icon: <FileSpreadsheet className="h-8 w-8 text-green-500" />
  },
  {
    name: 'PDF to PowerPoint Converter',
    description: 'Convert your PDF documents to editable PowerPoint presentations.',
    link: '/tools/pdf/pdf-to-powerpoint-converter',
    icon: <FileText className="h-8 w-8 text-red-500" />
  },
  {
    name: 'PDF to Images Converter',
    description: 'Convert PDF pages into high-quality image files (PNG, JPEG, WebP).',
    link: '/tools/pdf/pdf-to-images-converter',
    icon: <Image className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'Word to PDF Converter',
    description: 'Convert your Word documents to PDF files.',
    link: '/tools/pdf/word-to-pdf-converter',
    icon: <FileText className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'Excel to PDF Converter',
    description: 'Convert your Excel spreadsheets to PDF files.',
    link: '/tools/pdf/excel-to-pdf-converter',
    icon: <FileSpreadsheet className="h-8 w-8 text-indigo-500" />
  },
  {
    name: 'PowerPoint to PDF Converter',
    description: 'Convert your PowerPoint presentations to PDF files.',
    link: '/tools/pdf/powerpoint-to-pdf-converter',
    icon: <FileText className="h-8 w-8 text-yellow-500" />
  },
  {
    name: 'Images to PDF Converter',
    description: 'Combine multiple image files into a single PDF document.',
    link: '/tools/pdf/images-to-pdf-converter',
    icon: <Image className="h-8 w-8 text-teal-500" />
  },
  {
    name: 'PDF Text Editor',
    description: 'Edit text content directly within your PDF documents.',
    link: '/tools/pdf/pdf-text-editor',
    icon: <PenTool className="h-8 w-8 text-pink-500" />
  },
  {
    name: 'PDF Page Editor',
    description: 'Rotate, crop, or delete individual pages in your PDF.',
    link: '/tools/pdf/pdf-page-editor',
    icon: <FileText className="h-8 w-8 text-cyan-500" />
  },
  {
    name: 'PDF Annotation Tool',
    description: 'Add text, highlights, and notes to your PDF documents.',
    link: '/tools/pdf/pdf-annotation-tool',
    icon: <PenTool className="h-8 w-8 text-lime-500" />
  },
  {
    name: 'PDF Form Filler',
    description: 'Fill out PDF forms quickly and easily.',
    link: '/tools/pdf/pdf-form-filler',
    icon: <FileText className="h-8 w-8 text-amber-500" />
  },
  {
    name: 'PDF Watermark Tool',
    description: 'Add text or image watermarks to your PDF documents.',
    link: '/tools/pdf/pdf-watermark-tool',
    icon: <FileText className="h-8 w-8 text-lightBlue-500" />
  },
  {
    name: 'PDF Header Footer Tool',
    description: 'Add custom headers and footers to your PDF documents.',
    link: '/tools/pdf/pdf-header-footer-tool',
    icon: <FileText className="h-8 w-8 text-deepPurple-500" />
  },
  {
    name: 'PDF Page Numbering',
    description: 'Add page numbers to your PDF documents with customizable formatting and position.',
    link: '/tools/pdf/pdf-page-numbering',
    icon: <Hash className="h-8 w-8 text-blueGray-500" />
  },
  {
    name: 'PDF Background Tool',
    description: 'Add custom backgrounds (color or image) to your PDF documents.',
    link: '/tools/pdf/pdf-background-tool',
    icon: <Palette className="h-8 w-8 text-brown-500" />
  },
  {
    name: 'PDF Merger Tool',
    description: 'Combine multiple PDF files into a single document.',
    link: '/tools/pdf/pdf-merger-tool',
    icon: <Merge className="h-8 w-8 text-gray-500" />
  },
  {
    name: 'PDF Splitter Tool',
    description: 'Split a single PDF document into multiple smaller files.',
    link: '/tools/pdf/pdf-splitter-tool',
    icon: <Split className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'PDF Page Extractor',
    description: 'Extract specific pages from a PDF document to create a new PDF.',
    link: '/tools/pdf/pdf-page-extractor',
    icon: <FileText className="h-8 w-8 text-green-500" />
  },
  {
    name: 'PDF Organizer',
    description: 'Rearrange, delete, or insert pages within your PDF documents.',
    link: '/tools/pdf/pdf-organizer',
    icon: <FileText className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'PDF Bookmark Manager',
    description: 'Add, edit, or remove bookmarks in your PDF documents for easier navigation.',
    link: '/tools/pdf/pdf-bookmark-manager',
    icon: <FileText className="h-8 w-8 text-red-500" />
  },
  {
    name: 'PDF Batch Processor',
    description: 'Apply multiple operations (e.g., convert, watermark, secure) to several PDFs at once.',
    link: '/tools/pdf/pdf-batch-processor',
    icon: <FileText className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'PDF Size Reducer',
    description: 'Compress PDF files to reduce their size for easier sharing and storage.',
    link: '/tools/pdf/pdf-size-reducer',
    icon: <FileText className="h-8 w-8 text-indigo-500" />
  },
  {
    name: 'PDF Repair Tool',
    description: 'Repair corrupted or damaged PDF files to recover their content.',
    link: '/tools/pdf/pdf-repair-tool',
    icon: <Wrench className="h-8 w-8 text-yellow-500" />
  },
  {
    name: 'PDF Password Protector',
    description: 'Add password protection to your PDF documents to restrict access.',
    link: '/tools/pdf/pdf-password-protector',
    icon: <FileLock className="h-8 w-8 text-teal-500" />
  },
  {
    name: 'PDF Unlocker',
    description: 'Remove password protection from PDF documents (requires knowing the password).',
    link: '/tools/pdf/pdf-unlocker',
    icon: <Unlock className="h-8 w-8 text-pink-500" />
  },
  {
    name: 'PDF Encryption Tool',
    description: 'Encrypt PDF files with advanced encryption algorithms for maximum security.',
    link: '/tools/pdf/pdf-encryption-tool',
    icon: <FileLock className="h-8 w-8 text-cyan-500" />
  },
  {
    name: 'PDF Permission Manager',
    description: 'Manage permissions for printing, copying, and editing PDF content.',
    link: '/tools/pdf/pdf-permission-manager',
    icon: <Shield className="h-8 w-8 text-lime-500" />
  },
  {
    name: 'PDF Digital Signature',
    description: 'Apply and verify digital signatures on PDF documents for authenticity and integrity.',
    link: '/tools/pdf/pdf-digital-signature',
    icon: <FileText className="h-8 w-8 text-amber-500" />
  },
  {
    name: 'PDF Redaction Tool',
    description: 'Permanently remove sensitive information from PDF documents.',
    link: '/tools/pdf/pdf-redaction-tool',
    icon: <Trash2 className="h-8 w-8 text-lightBlue-500" />
  },
  {
    name: 'PDF Metadata Remover',
    description: 'Remove hidden metadata from PDF files to protect your privacy.',
    link: '/tools/pdf/pdf-metadata-remover',
    icon: <Trash2 className="h-8 w-8 text-deepPurple-500" />
  },
  {
    name: 'PDF Security Analyzer',
    description: 'Analyze PDF files for security vulnerabilities and potential risks.',
    link: '/tools/pdf/pdf-security-analyzer',
    icon: <Search className="h-8 w-8 text-blueGray-500" />
  },
];

const PDFTools = () => {
  return (
    <Layout>
      <div className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Comprehensive PDF Tools
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
              Create, edit, convert, and secure your PDF documents with our powerful suite of tools.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pdfTools.map((tool) => (
              <Link to={tool.link} key={tool.name} className="block group">
                <Card className="h-full hover:shadow-lg hover:border-blue-500 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center space-x-4">
                    <div>{tool.icon}</div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PDFTools;