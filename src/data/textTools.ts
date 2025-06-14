
import { Text, FileText, CaseSensitive, Pilcrow, Type, Hash, IterationCcw, Mic } from 'lucide-react';

export const featuredTools = [
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
    link: '/tools/text/text-to-speech-converter',
    icon: <Mic className="h-8 w-8 text-indigo-500" />
  },
];

export const conversionTools = [
  { name: 'Case Converter', description: 'Change text to uppercase, lowercase, title case, etc.', link: '/tools/text/case-converter' },
  { name: 'Sentence Case Converter', description: 'Format text into proper sentence capitalization.', link: '/tools/text/sentence-case-converter' },
  { name: 'Binary ⇄ Text Converter', description: 'Translate binary code to text and vice versa.', link: '/tools/text/binary-text-converter' },
  { name: 'Text to Hex Converter', description: 'Convert plain text into hexadecimal code.', link: '/tools/text/text-to-hex-converter' },
  { name: 'Hex to Text Converter', description: 'Translate hexadecimal code back into plain text.', link: '/tools/text/hex-to-text-converter' },
  { name: 'Text to ASCII', description: 'Convert text characters to ASCII codes.', link: '/tools/text/text-to-ascii-converter' },
  { name: 'ASCII to Text', description: 'Translate ASCII codes back to text characters.', link: '/tools/text/ascii-to-text-converter' },
  { name: 'Reverse Text Generator', description: 'Flip your text backward instantly.', link: '/tools/text/reverse-text-generator' },
  { name: 'Text to Speech Converter', description: 'Listen to your text read aloud in a natural voice.', link: '/tools/text/text-to-speech-converter' },
  { name: 'Unicode Character Converter', description: 'Convert text to and from Unicode characters.', link: '/tools/text/unicode-character-converter' },
  { name: 'Number to Words Converter', description: 'Convert numbers into their written word form.', link: '/tools/text/number-to-words-converter' },
];

export const generationTools = [
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

export const analysisTools = [
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

export const stylingTools = [
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
