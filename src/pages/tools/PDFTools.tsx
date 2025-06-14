
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText, Merge, Split, Lock, Edit, FileDown } from 'lucide-react';

const tools = [
  {
    name: 'PDF Merger',
    description: 'Combine multiple PDF files into a single document while maintaining formatting and quality. Perfect for consolidating reports, contracts, and documentation.',
    link: '/tools/pdf/pdf-merger',
    icon: <Merge className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'PDF Splitter',
    description: 'Split PDF documents into separate files by page ranges, bookmarks, or custom criteria. Extract specific pages or create individual files from multi-page documents.',
    link: '/tools/pdf/pdf-splitter',
    icon: <Split className="h-8 w-8 text-green-500" />
  },
  {
    name: 'PDF Converter',
    description: 'Convert PDFs to Word, Excel, PowerPoint, images, and other formats. Also convert documents and images to PDF with high-quality results.',
    link: '/tools/pdf/pdf-converter',
    icon: <FileText className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'PDF Editor',
    description: 'Edit PDF content including text, images, and annotations. Add, modify, or remove elements from your PDF documents with professional editing tools.',
    link: '/tools/pdf/pdf-editor',
    icon: <Edit className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'PDF Protector',
    description: 'Add password protection and security to PDF documents. Control printing, copying, editing permissions, and encrypt sensitive information.',
    link: '/tools/pdf/pdf-protector',
    icon: <Lock className="h-8 w-8 text-red-500" />
  },
  {
    name: 'PDF Compressor',
    description: 'Reduce PDF file sizes without losing quality. Optimize PDFs for web sharing, email attachments, and storage while maintaining readability.',
    link: '/tools/pdf/pdf-compressor',
    icon: <FileDown className="h-8 w-8 text-indigo-500" />
  },
];

const conversionTools = [
    { name: 'PDF to Word Converter', description: 'Convert PDF documents to editable Word format.', link: '/tools/pdf/pdf-to-word' },
    { name: 'PDF to Excel Converter', description: 'Convert PDF tables and data to Excel spreadsheets.', link: '/tools/pdf/pdf-to-excel' },
    { name: 'PDF to PowerPoint Converter', description: 'Convert PDF slides to editable PowerPoint presentations.', link: '/tools/pdf/pdf-to-powerpoint' },
    { name: 'PDF to Images Converter', description: 'Convert PDF pages to JPEG, PNG, or other image formats.', link: '/tools/pdf/pdf-to-images' },
    { name: 'Word to PDF Converter', description: 'Convert Word documents to professional PDF format.', link: '/tools/pdf/word-to-pdf' },
    { name: 'Excel to PDF Converter', description: 'Convert Excel spreadsheets to PDF documents.', link: '/tools/pdf/excel-to-pdf' },
    { name: 'PowerPoint to PDF Converter', description: 'Convert presentations to PDF for easy sharing.', link: '/tools/pdf/powerpoint-to-pdf' },
    { name: 'Images to PDF Converter', description: 'Combine multiple images into a single PDF document.', link: '/tools/pdf/images-to-pdf' },
];

const editingTools = [
    { name: 'PDF Text Editor', description: 'Edit and modify text content within PDF documents.', link: '/tools/pdf/pdf-text-editor' },
    { name: 'PDF Page Editor', description: 'Add, remove, rotate, and reorder PDF pages.', link: '/tools/pdf/pdf-page-editor' },
    { name: 'PDF Annotation Tool', description: 'Add comments, highlights, and annotations to PDFs.', link: '/tools/pdf/pdf-annotation' },
    { name: 'PDF Form Filler', description: 'Fill out and edit PDF forms electronically.', link: '/tools/pdf/pdf-form-filler' },
    { name: 'PDF Watermark Tool', description: 'Add text or image watermarks to PDF documents.', link: '/tools/pdf/pdf-watermark' },
    { name: 'PDF Header Footer Tool', description: 'Add headers and footers to PDF pages.', link: '/tools/pdf/pdf-header-footer' },
    { name: 'PDF Page Numbering', description: 'Add page numbers to PDF documents.', link: '/tools/pdf/pdf-page-numbering' },
    { name: 'PDF Background Tool', description: 'Add background colors or images to PDF pages.', link: '/tools/pdf/pdf-background' },
];

const organizationTools = [
    { name: 'PDF Merger Tool', description: 'Combine multiple PDF files into one document.', link: '/tools/pdf/pdf-merger' },
    { name: 'PDF Splitter Tool', description: 'Split PDF documents into separate files.', link: '/tools/pdf/pdf-splitter' },
    { name: 'PDF Page Extractor', description: 'Extract specific pages from PDF documents.', link: '/tools/pdf/pdf-page-extractor' },
    { name: 'PDF Organizer', description: 'Reorder and organize pages within PDF documents.', link: '/tools/pdf/pdf-organizer' },
    { name: 'PDF Bookmark Manager', description: 'Add, edit, and manage PDF bookmarks and navigation.', link: '/tools/pdf/pdf-bookmark-manager' },
    { name: 'PDF Batch Processor', description: 'Process multiple PDF files simultaneously.', link: '/tools/pdf/pdf-batch-processor' },
    { name: 'PDF Size Reducer', description: 'Compress and reduce PDF file sizes efficiently.', link: '/tools/pdf/pdf-size-reducer' },
    { name: 'PDF Repair Tool', description: 'Repair corrupted or damaged PDF files.', link: '/tools/pdf/pdf-repair' },
];

const securityTools = [
    { name: 'PDF Password Protector', description: 'Add password protection to PDF documents.', link: '/tools/pdf/pdf-password-protector' },
    { name: 'PDF Unlocker', description: 'Remove passwords from PDF files you own.', link: '/tools/pdf/pdf-unlocker' },
    { name: 'PDF Encryption Tool', description: 'Encrypt PDF documents with advanced security.', link: '/tools/pdf/pdf-encryption' },
    { name: 'PDF Permission Manager', description: 'Control printing, copying, and editing permissions.', link: '/tools/pdf/pdf-permissions' },
    { name: 'PDF Digital Signature', description: 'Add digital signatures to PDF documents.', link: '/tools/pdf/pdf-signature' },
    { name: 'PDF Redaction Tool', description: 'Permanently remove sensitive information from PDFs.', link: '/tools/pdf/pdf-redaction' },
    { name: 'PDF Metadata Remover', description: 'Remove metadata and hidden information from PDFs.', link: '/tools/pdf/pdf-metadata-remover' },
    { name: 'PDF Security Analyzer', description: 'Analyze PDF security settings and vulnerabilities.', link: '/tools/pdf/pdf-security-analyzer' },
];

const PDFTools = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Professional PDF Management Tools
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
                Comprehensive PDF processing, editing, and management tools for businesses, professionals, and individuals. Create, edit, convert, and secure your PDF documents with ease.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool) => (
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

        <div className="py-12 md:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">All Our PDF Tools</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">Complete PDF management suite covering conversion, editing, organization, and security for all your document processing needs.</p>
                </div>

                <div className="space-y-16">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Conversion & Format</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {conversionTools.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Editing & Modification</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {editingTools.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Organization & Management</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {organizationTools.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Security & Protection</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {securityTools.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PDFTools;
