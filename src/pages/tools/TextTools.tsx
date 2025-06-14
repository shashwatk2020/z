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

const conversionTools = [
    { name: 'Case Converter', description: 'Change text to uppercase, lowercase, title case, etc.', link: '/tools/text/case-converter' },
    { name: 'Sentence Case Converter', description: 'Format text into proper sentence capitalization.', link: '/tools/text/sentence-case-converter' },
    { name: 'Binary ⇄ Text Converter', description: 'Translate binary code to text and vice versa.', link: '/tools/text/binary-text-converter' },
    { name: 'Text to Hex Converter', description: 'Convert plain text into hexadecimal code.', link: '/tools/text/text-to-hex-converter' },
    { name: 'Hex to Text Converter', description: 'Translate hexadecimal code back into plain text.', link: '/tools/text/hex-to-text-converter' },
    { name: 'Text to ASCII', description: 'Convert text characters to ASCII codes.', link: '/tools/text/text-to-ascii' },
    { name: 'ASCII to Text', description: 'Translate ASCII codes back to text characters.', link: '/tools/text/ascii-to-text' },
    { name: 'Reverse Text Generator', description: 'Flip your text backward instantly.', link: '/tools/text/reverse-text-generator' },
    { name: 'Text to Speech Converter', description: 'Listen to your text read aloud in a natural voice.', link: '/tools/text/text-to-speech' },
    { name: 'Unicode Character Converter', description: 'Convert text to and from Unicode characters.', link: '/tools/text/unicode-character-converter' },
    { name: 'Number to Words Converter', description: 'Convert numbers into their written word form.', link: '/tools/text/number-to-words-converter' },
];

const generationTools = [
    { name: 'Random Password Generator', description: 'Create strong, secure, and random passwords.', link: '/tools/text/random-password-generator' },
    { name: 'Advanced Lorem Ipsum', description: 'Generate customizable placeholder text.', link: '/tools/text/lorem-ipsum-generator' },
    { name: 'Advanced Slug Generator', description: 'Create SEO-friendly URL slugs from text.', link: '/tools/text/slug-generator' },
    { name: 'Random Word Generator', description: 'Get random words for games or creative projects.', link: '/tools/text/random-word-generator' },
    { name: 'Random Letter Generator', description: 'Generate random letters of the alphabet.', link: '/tools/text/random-letter-generator' },
    { name: 'Text Repeater', description: 'Duplicate a piece of text multiple times.', link: '/tools/text/text-repeater' },
    { name: 'Hashtag Generator', description: 'Find relevant hashtags for your social media posts.', link: '/tools/text/hashtag-generator' },
    { name: 'Blog Title Generator', description: 'Generate catchy titles for your blog posts.', link: '/tools/text/blog-title-generator' },
    { name: 'Strong Password Generator', description: 'Create secure passwords based on custom rules.', link: '/tools/text/strong-password-generator' },
    { name: 'Article Title Generator', description: 'Come up with compelling headlines for articles.', link: '/tools/text/article-title-generator' },
    { name: 'Username Generator', description: 'Generate unique usernames for platforms.', link: '/tools/text/username-generator' },
    { name: 'Business Name Generator', description: 'Brainstorm creative names for your new business.', link: '/tools/text/business-name-generator' },
];

const analysisTools = [
    { name: 'Online Word Counter', description: 'Count words, characters, and sentences.', link: '/tools/text/word-counter' },
    { name: 'Character Counter', description: 'Get a precise count of all characters.', link: '/tools/text/character-counter' },
    { name: 'Duplicate Line Remover', description: 'Delete duplicate lines from your text.', link: '/tools/text/duplicate-line-remover' },
    { name: 'Advanced Whitespace Remover', description: 'Clean up extra spaces, tabs, and line breaks.', link: '/tools/text/whitespace-remover' },
    { name: 'Text Compare (Diff Checker)', description: 'Find the differences between two texts.', link: '/tools/text/text-compare' },
    { name: 'Find and Replace Text', description: 'Quickly find and replace text.', link: '/tools/text/find-and-replace' },
    { name: 'Keyword Density Checker', description: 'Analyze the keyword density of content.', link: '/tools/text/keyword-density-checker' },
    { name: 'Meta Description Generator', description: 'Create effective meta descriptions for SEO.', link: '/tools/text/meta-description-generator' },
    { name: 'Text Summarizer', description: 'Summarize long articles into concise text.', link: '/tools/text/text-summarizer' },
    { name: 'Plagiarism Checker (Basic)', description: 'Check for basic plagiarism in your text.', link: '/tools/text/plagiarism-checker' },
    { name: 'Reading Time Calculator', description: 'Estimate the reading time for your text.', link: '/tools/text/reading-time-calculator' },
    { name: 'Language Detector', description: 'Identify the language of any given text.', link: '/tools/text/language-detector' },
];

const stylingTools = [
    { name: 'Bold Text Generator', description: 'Convert normal text into bold text.', link: '/tools/text/bold-text-generator' },
    { name: 'Italic Text Generator', description: 'Convert normal text into italic text.', link: '/tools/text/italic-text-generator' },
    { name: 'Fancy Text Generator', description: 'Create cool and stylish text with symbols.', link: '/tools/text/fancy-text-generator' },
    { name: 'Zalgo Glitch Text', description: 'Generate creepy, corrupted-looking Zalgo text.', link: '/tools/text/zalgo-glitch-text-generator' },
    { name: 'Big Text (ASCII) Generator', description: 'Create large letters out of ASCII characters.', link: '/tools/text/big-text-generator' },
    { name: 'ASCII Art Generator', description: 'Convert images and text into ASCII art.', link: '/tools/text/ascii-art-generator' },
    { name: 'Yoda Translator', description: 'Translate your text into the speech style of Yoda.', link: '/tools/text/yoda-translator' },
    { name: 'Morse Code Translator', description: 'Translate text to Morse code and back.', link: '/tools/text/morse-code-translator' },
    { name: 'Emoji Text Generator', description: 'Convert text into a sequence of emojis.', link: '/tools/text/emoji-text-generator' },
    { name: 'Text Art Generator', description: 'Create art from text characters.', link: '/tools/text/text-art-generator' },
    { name: 'Upside Down Text Generator', description: 'Flip your text upside down instantly.', link: '/tools/text/upside-down-text-generator' },
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

        <div className="py-12 md:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">All Our Text Tools</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">Explore our full suite of text utilities for any task imaginable, from simple conversions to creative text generation.</p>
                </div>

                <div className="space-y-16">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Conversion & Case</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {conversionTools.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Generation</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {generationTools.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Analysis & Utilities</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {analysisTools.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Styling & Fun</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stylingTools.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Use Online Text Tools?</h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                    <p>
                        In today's fast-paced digital world, text is the backbone of communication and information exchange. We interact with it constantly, from writing emails and reports to coding software and crafting social media updates. Whether you're a professional writer, a meticulous developer, a diligent student, or a creative digital marketer, the ability to efficiently manipulate and process text is not just a convenience—it's a critical component of productivity. Manually performing repetitive tasks like changing text case, counting words and characters, or cleaning up inconsistent formatting is not only tedious but also highly prone to errors. That's where ZipConvert's comprehensive suite of text tools comes in. Our collection of powerful, intuitive utilities is designed to automate these tasks, saving you countless hours of effort so you can focus on what truly matters: creating high-quality content and achieving your goals.
                    </p>
                    <p>
                        Consider the practical applications. Our <Link to="/tools/text/case-converter" className="text-blue-600 hover:underline">Case Converter</Link> is an indispensable tool for journalists and editors who need to ensure their headlines and titles strictly adhere to specific style guides like APA or MLA. Instead of manually capitalizing each word, you can convert your text with a single click. Similarly, our <Link to="/tools/text/word-counter" className="text-blue-600 hover:underline">Word & Character Counter</Link> is essential for anyone writing content with strict length requirements, such as SEO meta descriptions, academic essays, or Twitter posts. It provides instant, accurate counts, helping you stay within limits without the guesswork. For those needing to generate placeholder text, the <Link to="/tools/text/lorem-ipsum-generator" className="text-blue-600 hover:underline">Lorem Ipsum Generator</Link> provides customizable blocks of text perfect for design mockups.
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-8">Streamline Your Workflow Across Various Fields</h3>
                    <p>
                        Our tools are designed to serve a wide range of professions, streamlining workflows and boosting efficiency. Developers can benefit greatly from the <Link to="/tools/text/lorem-ipsum-generator" className="text-blue-600 hover:underline">Lorem Ipsum Generator</Link> to create placeholder content for web pages and application mockups, allowing a focus on design and layout without being distracted by final copy. The <Link to="/tools/text/binary-text-converter" className="text-blue-600 hover:underline">Binary ⇄ Text Converter</Link> and <Link to="/tools/text/text-to-hex-converter" className="text-blue-600 hover:underline">Hex Converters</Link> are invaluable for those working with low-level data. If you're working with data from different sources, the <Link to="/tools/text/remove-line-breaks" className="text-blue-600 hover:underline">Remove Line Breaks</Link> and <Link to="/tools/text/whitespace-remover" className="text-blue-600 hover:underline">Advanced Whitespace Remover</Link> can instantly clean up poorly formatted text, making it ready for analysis or import into a database. Digital marketers can use the <Link to="/tools/text/hashtag-generator" className="text-blue-600 hover:underline">Hashtag Generator</Link> and <Link to="/tools/text/meta-description-generator" className="text-blue-600 hover:underline">Meta Description Generator</Link> to optimize their content for better reach and engagement.
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-8">A Universe of Tools Beyond Text</h3>
                    <p>
                        While our text utilities are incredibly powerful, they are just one part of the comprehensive ZipConvert ecosystem. We understand that your needs extend beyond text manipulation. That's why we've built an entire platform of integrated toolkits to handle virtually any digital task you can imagine. Our goal is to be your single, go-to resource, eliminating the need to jump between different websites and services.
                    </p>
                    <p>
                        Seamlessly switch from formatting a blog post to optimizing your website with our <Link to="/tools/web" className="text-blue-600 hover:underline">Web Tools</Link>. Need to resize a photo for that post? Our <Link to="/tools/image" className="text-blue-600 hover:underline">Image Tools</Link> have you covered with conversion, compression, and editing features. Manage your project finances with our suite of <Link to="/tools/calculators" className="text-blue-600 hover:underline">Calculators</Link>, or boost your workflow efficiency using our <Link to="/tools/productivity" className="text-blue-600 hover:underline">Productivity</Link> utilities. We also provide specialized tools for handling files, such as our <Link to="/tools/archive" className="text-blue-600 hover:underline">Archive Tools</Link> for zipping and unzipping files, and our robust <Link to="/tools/pdf" className="text-blue-600 hover:underline">PDF Tools</Link> for merging, splitting, and converting documents. Your digital life also needs protection, which is why we offer <Link to="/tools/security" className="text-blue-600 hover:underline">Security Tools</Link> like password generators. And for multimedia projects, our <Link to="/tools/video" className="text-blue-600 hover:underline">Video Tools</Link> and <Link to="/tools/audio" className="text-blue-600 hover:underline">Audio Tools</Link> provide simple solutions for basic editing and conversion. By integrating these diverse functionalities, ZipConvert provides a holistic solution for your digital needs.
                    </p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-8">Commitment to Simplicity and Accessibility</h3>
                    <p>
                        At ZipConvert, we are driven by a core belief: powerful tools should be simple, intuitive, and accessible to everyone. All our utilities are browser-based, which means there's no complex software to download or install. They work seamlessly on any device with an internet connection, whether you're on a desktop at work or a tablet on the go. We are relentlessly committed to providing a superior user experience, characterized by clean, uncluttered interfaces and lightning-fast processing speeds. We value your privacy and security, ensuring your data is handled responsibly. Whether you need to make a quick text edit or perform a more complex data transformation, our tools are engineered to help you get the job done efficiently and effectively, empowering you to work smarter, not harder.
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
