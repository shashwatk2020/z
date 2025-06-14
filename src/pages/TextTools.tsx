
import React from 'react';
import { Link } from 'react-router-dom';

const textTools = [
  {
    name: 'Case Converter',
    slug: 'case-converter',
    description: 'Instantly convert text to upper case, lower case, title case, or sentence case. Save time reformatting documents with this simple tool. Great for editors, students, and digital marketers.',
  },
  {
    name: 'Text Separator',
    slug: 'text-separator',
    description: 'Split or join text using any delimiter (comma, pipe, tab, etc). Perfect for CSV and data cleanup work. Clean, merge, and sort your content easily.',
  },
  {
    name: 'Remove Duplicate Lines',
    slug: 'remove-duplicate-lines',
    description: 'Clean up blocks of text by automatically removing all duplicate lines. Enhances the quality of your notes, data files, and technical documentation.',
  },
  {
    name: 'Word Counter',
    slug: 'word-counter',
    description: 'Count the number of words, characters, sentences, and paragraphs in real time. Useful for writers, students, and social media professionals watching their word limits.',
  },
  {
    name: 'Text Sorter',
    slug: 'text-sorter',
    description: 'Sort lines of text alphabetically or numerically, ascending or descending. Great for preparing lists, reference material, and organizing data.',
  },
  {
    name: 'Text to Speech',
    slug: 'text-to-speech',
    description: 'Convert written text into natural-sounding audio. Improves accessibility and helps with language learning or proofreading.',
  },
  {
    name: 'Speech to Text',
    slug: 'speech-to-text',
    description: 'Transcribe spoken words into text, making note taking and content creation faster and more accessible for everyone.',
  },
  {
    name: 'Text Analyzer',
    slug: 'text-analyzer',
    description: 'Analyze your content for readability, grammar, and keyword density. Optimize your writing for SEO, academic, or business use.',
  },
  {
    name: 'Emoji Remover',
    slug: 'emoji-remover',
    description: 'Quickly strip out all emojis from your text. Ideal for professionalizing messages or prepping content for platforms that restrict emojis.',
  },
  {
    name: 'Whitespace Cleaner',
    slug: 'whitespace-cleaner',
    description: 'Remove extra spaces, tabs, and blank lines from your text to make your documents clean and well-formatted.',
  },
];

const otherCategories = [
  { name: "Web Tools", slug: "/web-tools" },
  { name: "Image Tools", slug: "/image-tools" },
  { name: "Calculators", slug: "/calculators" },
  { name: "Productivity", slug: "/productivity" },
  { name: "Archive Tools", slug: "/archive-tools" },
  { name: "Security", slug: "/security" },
  { name: "Video Tools", slug: "/video-tools" },
  { name: "Audio Tools", slug: "/audio-tools" },
  { name: "PDF Tools", slug: "/pdf-tools" }
];

const TextTools: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Text Tools</h1>
      <p className="mb-4 text-lg text-gray-700">
        Welcome to our comprehensive collection of free online <strong>Text Tools</strong>. Whether you're a professional writer, student, developer, teacher, or everyday user, our toolkit is designed to help you <strong>process, clean, analyze, and manipulate text</strong> efficiently and effectively. From simple converters to advanced analyzers, every tool on this page is crafted for productivity and ease of use.<br/><br/>
        Explore our selection below, each tool described in detail with direct links to get started. Not looking for text utilities? Check out our other categories like <Link to="/web-tools" className="text-blue-600 underline hover:text-blue-800">Web Tools</Link>, <Link to="/image-tools" className="text-blue-600 underline hover:text-blue-800">Image Tools</Link>, or <Link to="/calculators" className="text-blue-600 underline hover:text-blue-800">Calculators</Link>. Every category is interconnected, so you can jump between tools and discover what works best for your workflow.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Popular Text Tools</h2>
        <ul className="space-y-6">
          {textTools.map(tool => (
            <li key={tool.slug} className="border-b pb-4 mb-4">
              <h3 className="text-xl font-bold mb-1">
                <Link
                  to={`/text-tools/${tool.slug}`}
                  className="text-blue-700 hover:underline"
                >
                  {tool.name}
                </Link>
              </h3>
              <p className="text-gray-700 mb-2">{tool.description}</p>
              <div className="text-sm text-gray-500">
                <span>
                  Related:{" "}
                  {otherCategories
                    .filter((cat, idx) => idx < 3)
                    .map(cat => (
                      <Link
                        key={cat.slug}
                        to={cat.slug}
                        className="text-blue-400 hover:text-blue-600 underline mx-1"
                      >
                        {cat.name}
                      </Link>
                    ))}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Why Use Online Text Tools?</h2>
        <p className="mb-3 text-gray-800">
          Manually editing, formatting, or analyzing text can be <strong>tedious and time-consuming</strong>. We built our tools to automate and simplify repetitive tasks, letting you focus on your real work. Whether you need to convert cases, analyze your writing for SEO, or simply clean up some messy text, we have a solution—no downloads and completely free to use.
        </p>
        <p className="mb-3 text-gray-800">
          Text tools are essential for:
          <ul className="list-disc pl-6 mt-2">
            <li>Content creators aiming for perfect formatting.</li>
            <li>Students needing quick references and plagiarism-free assignments.</li>
            <li>Developers working with raw data, logs, or code snippets.</li>
            <li>SEO professionals and digital marketers optimizing content.</li>
          </ul>
        </p>
        <p className="mb-3">
          We regularly update and expand our text utility suite. Check out our <Link to="/web-tools" className="text-blue-600 underline hover:text-blue-800">Web Tools</Link> for URL encoding or <Link to="/image-tools" className="text-blue-600 underline hover:text-blue-800">Image Tools</Link> for working with images online.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Explore Other Tool Categories</h2>
        <div className="flex flex-wrap gap-3">
          {otherCategories.map(cat => (
            <Link
              key={cat.slug}
              to={cat.slug}
              className="inline-block bg-gray-200 px-3 py-1 rounded-full text-gray-800 hover:bg-blue-100 hover:text-blue-700 transition"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">SEO-Friendly Internal Linking</h2>
        <p className="mb-3 text-gray-700">
          For seamless navigation and <strong>SEO value</strong>, every tool in the list above links to its own detail page. Additionally, this page links to all major tool categories. We recommend you bookmark <Link to="/text-tools" className="text-blue-600 underline hover:text-blue-800">Text Tools</Link> for easy access, or jump between pages like <Link to="/web-tools" className="text-blue-600 underline hover:text-blue-800">Web Tools</Link> and <Link to="/image-tools" className="text-blue-600 underline hover:text-blue-800">Image Tools</Link> as your needs evolve.
        </p>
        <p className="text-gray-700">
          Our internal linking strategy gives users and search engines comprehensive access to our broad suite of online utilities.
        </p>
      </section>
    </div>
  );
};

export default TextTools;
