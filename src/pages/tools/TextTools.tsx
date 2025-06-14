
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Text, FileText, CaseSensitive, Pilcrow, Type, Hash, IterationCcw, Mic } from 'lucide-react';

const tools = [
  {
    name: 'Case Converter',
    description: 'Easily convert text between different letter cases such as uppercase, lowercase, title case, and sentence case. Perfect for formatting headlines, titles, and other text to meet specific style guides.',
    link: '/tools/text/case-converter',
    icon: <CaseSensitive className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'Word & Character Counter',
    description: 'Instantly get the word count, character count (with and without spaces), and sentence count of any text. An essential tool for writers, students, and social media managers who need to stay within length limits.',
    link: '/tools/text/word-counter',
    icon: <Type className="h-8 w-8 text-green-500" />
  },
  {
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for your designs and mockups. Customize the number of paragraphs, sentences, or words to create the perfect amount of content for your layout needs.',
    link: '/tools/text/lorem-ipsum-generator',
    icon: <Pilcrow className="h-8 w-8 text-yellow-500" />
  },
  {
    name: 'Text Repeater',
    description: 'Duplicate a piece of text multiple times with ease. Specify the text you want to repeat and the number of repetitions to generate a long string of repeating content for testing or other purposes.',
    link: '/tools/text/text-repeater',
    icon: <IterationCcw className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'Remove Line Breaks',
    description: 'Clean up your text by removing unnecessary line breaks and paragraph spacing. This tool is perfect for converting text from emails, PDFs, or other documents into a single, continuous block.',
    link: '/tools/text/remove-line-breaks',
    icon: <Text className="h-8 w-8 text-red-500" />
  },
  {
    name: 'Text to Speech',
    description: 'Convert written text into natural-sounding audio. Listen to articles, proofread your writing, or create voiceovers for videos. A great accessibility tool for users of all abilities.',
    link: '/tools/text/text-to-speech',
    icon: <Mic className="h-8 w-8 text-indigo-500" />
  },
];

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

        <div className="py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Use Online Text Tools?</h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                    <p>
                        In today's digital world, we interact with text constantly. Whether you're a writer, a developer, a student, or a digital marketer, the ability to quickly manipulate and process text is crucial for productivity. Manually performing tasks like changing text case, counting words, or cleaning up formatting is tedious and prone to errors. That's where ZipConvert's suite of text tools comes in. Our collection of utilities is designed to automate these tasks, saving you time and effort so you can focus on what truly matters.
                    </p>
                    <p>
                        Consider our <Link to="/tools/text/case-converter" className="text-blue-600 hover:underline">Case Converter</Link>. It's an indispensable tool for ensuring your titles and headlines adhere to specific style guides like APA or MLA. Instead of manually capitalizing each word, you can do it with a single click. Similarly, our <Link to="/tools/text/word-counter" className="text-blue-600 hover:underline">Word & Character Counter</Link> is essential for anyone writing content with strict length requirements, such as social media posts, academic essays, or SEO meta descriptions.
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-8">Streamline Your Workflow Across Various Fields</h3>
                    <p>
                        Our tools are not just for writers. Developers can benefit greatly from the <Link to="/tools/text/lorem-ipsum-generator" className="text-blue-600 hover:underline">Lorem Ipsum Generator</Link> to create placeholder content for web pages and application mockups. This allows you to focus on design and layout without being distracted by final copy. If you're working with data from different sources, the <Link to="/tools/text/remove-line-breaks" className="text-blue-600 hover:underline">Remove Line Breaks</Link> tool can instantly clean up poorly formatted text, making it ready for analysis or import into a database.
                    </p>
                     <p>
                        These utilities are just the beginning. Our platform also offers powerful <Link to="/tools/image" className="text-blue-600 hover:underline">Image Tools</Link> for editing and converting images, a full suite of <Link to="/tools/pdf" className="text-blue-600 hover:underline">PDF Tools</Link> for managing documents, and various <Link to="/tools/calculators" className="text-blue-600 hover:underline">Calculators</Link> for everyday use. By integrating these different functionalities into one platform, we aim to be your go-to resource for all digital tasks.
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-8">Commitment to Simplicity and Accessibility</h3>
                    <p>
                        At ZipConvert, we believe that powerful tools should be simple and accessible to everyone. All our text utilities are browser-based, meaning there's no software to download or install. They work on any device with an internet connection. We are committed to providing a seamless user experience, with clean interfaces and fast processing speeds. Whether you need to make a quick text edit or perform a more complex transformation, our tools are here to help you get the job done efficiently. Don't forget to explore our other categories like <Link to="/tools/video" className="text-blue-600 hover:underline">Video Tools</Link> and <Link to="/tools/security" className="text-blue-600 hover:underline">Security Tools</Link> to see how else we can help you.
                    </p>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TextTools;

