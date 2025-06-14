
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Shield, 
  Zap, 
  Users, 
  ArrowRight,
  CheckCircle,
  Image,
  FileText,
  Calculator,
  Type,
  Globe
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process files in seconds with our optimized algorithms'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your files are processed securely and deleted automatically'
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Professional-grade tools for all your conversion needs'
    },
    {
      icon: Users,
      title: 'Trusted by Millions',
      description: 'Join over 10 million users who trust ZipConvert'
    }
  ];

  const stats = [
    { number: '10M+', label: 'Happy Users' },
    { number: '500M+', label: 'Files Processed' },
    { number: '99.9%', label: 'Uptime' },
    { number: '350+', label: 'Tools Available' }
  ];

  const popularToolsByCategory = [
    {
      category: 'Image Tools',
      icon: Image,
      tools: [
        { 
          name: 'JPG to PNG Converter', 
          description: 'Convert JPG images to PNG format while preserving quality and transparency support.',
          url: '/tools/jpg-to-png' 
        },
        { 
          name: 'PNG to JPG Converter', 
          description: 'Convert PNG images to JPG format for smaller file sizes and better web compatibility.',
          url: '/tools/png-to-jpg' 
        },
        { 
          name: 'Image Resizer', 
          description: 'Resize images to any dimension while maintaining aspect ratio and quality.',
          url: '/tools/image-resizer' 
        },
        { 
          name: 'Image Compressor', 
          description: 'Reduce image file sizes without losing quality for faster web loading.',
          url: '/tools/image-compressor-multi' 
        },
        { 
          name: 'Background Remover', 
          description: 'Automatically remove backgrounds from images with AI-powered precision.',
          url: '/tools/background-remover' 
        }
      ]
    },
    {
      category: 'PDF Tools',
      icon: FileText,
      tools: [
        { 
          name: 'PDF Merger', 
          description: 'Combine multiple PDF files into a single document with customizable page order.',
          url: '/tools/pdf-merger' 
        },
        { 
          name: 'PDF Splitter', 
          description: 'Split large PDF files into smaller documents or extract specific pages.',
          url: '/tools/pdf-splitter' 
        },
        { 
          name: 'PDF Compressor', 
          description: 'Reduce PDF file size while maintaining document quality and readability.',
          url: '/tools/pdf-compressor' 
        },
        { 
          name: 'Word to PDF', 
          description: 'Convert Microsoft Word documents to PDF format with perfect formatting.',
          url: '/tools/word-to-pdf' 
        },
        { 
          name: 'PDF to Word', 
          description: 'Convert PDF documents to editable Word files while preserving layout.',
          url: '/tools/pdf-to-word' 
        }
      ]
    },
    {
      category: 'Text Tools',
      icon: Type,
      tools: [
        { 
          name: 'Word Counter', 
          description: 'Count words, characters, paragraphs, and reading time for any text content.',
          url: '/tools/word-counter' 
        },
        { 
          name: 'Case Converter', 
          description: 'Convert text between uppercase, lowercase, title case, and sentence case.',
          url: '/tools/case-converter-all' 
        },
        { 
          name: 'Text to Speech', 
          description: 'Convert written text into natural-sounding speech with multiple voice options.',
          url: '/tools/text-to-speech' 
        },
        { 
          name: 'Password Generator', 
          description: 'Generate secure, random passwords with customizable length and complexity.',
          url: '/tools/random-password' 
        },
        { 
          name: 'Lorem Ipsum Generator', 
          description: 'Generate placeholder text for design mockups and content development.',
          url: '/tools/lorem-ipsum-advanced' 
        }
      ]
    },
    {
      category: 'Calculators',
      icon: Calculator,
      tools: [
        { 
          name: 'Percentage Calculator', 
          description: 'Calculate percentages, percentage increase, decrease, and percentage of a number.',
          url: '/tools/percentage-calculator' 
        },
        { 
          name: 'BMI Calculator', 
          description: 'Calculate your Body Mass Index and get health recommendations based on results.',
          url: '/tools/bmi-calculator' 
        },
        { 
          name: 'Age Calculator', 
          description: 'Calculate exact age in years, months, days, hours, and minutes from birth date.',
          url: '/tools/age-calculator' 
        },
        { 
          name: 'Tip Calculator', 
          description: 'Calculate tip amounts and split bills among multiple people easily.',
          url: '/tools/tip-calculator' 
        },
        { 
          name: 'Currency Converter', 
          description: 'Convert between different currencies with real-time exchange rates.',
          url: '/tools/currency-converter-live' 
        }
      ]
    },
    {
      category: 'Web Tools',
      icon: Globe,
      tools: [
        { 
          name: 'QR Code Generator', 
          description: 'Create QR codes for URLs, text, WiFi passwords, and contact information.',
          url: '/tools/qr-generator' 
        },
        { 
          name: 'URL Shortener', 
          description: 'Create short, trackable URLs for social media and marketing campaigns.',
          url: '/tools/url-encoder-decoder' 
        },
        { 
          name: 'JSON Formatter', 
          description: 'Format, validate, and beautify JSON data with syntax highlighting.',
          url: '/tools/json-formatter' 
        },
        { 
          name: 'Base64 Encoder', 
          description: 'Encode and decode text and files to/from Base64 format securely.',
          url: '/tools/base64-encoder-advanced' 
        },
        { 
          name: 'Color Picker', 
          description: 'Pick colors from images or generate color palettes for web design.',
          url: '/tools/hex-color-picker' 
        }
      ]
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Ultimate
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}File Conversion{" "}
            </span>
            Toolkit
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Convert, compress, edit, and optimize your files with our comprehensive suite of 350+ tools. 
            Fast, secure, and completely free to use - all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link to="#popular-tools">
                Explore Tools <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link to="/pricing">100% Free Forever</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ZipConvert?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built the most comprehensive and user-friendly file processing platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section id="popular-tools" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Most Popular Tools
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most-used tools across different categories
            </p>
          </div>
          
          <div className="space-y-16">
            {popularToolsByCategory.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                    <category.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{category.category}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {category.tools.map((tool, toolIndex) => (
                    <Link
                      key={toolIndex}
                      to={tool.url}
                      className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors group border border-gray-200 hover:border-blue-300"
                    >
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {tool.name}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{tool.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Explore all 350+ tools organized by category
            </p>
            <Button size="lg" variant="outline" className="text-lg px-8">
              View All Tools
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
