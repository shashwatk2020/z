
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: 'The Ultimate Guide to Image Compression',
      excerpt: 'Learn how to reduce image file sizes without losing quality using our advanced compression algorithms.',
      author: 'Sarah Chen',
      date: '2024-01-15',
      category: 'Image Tools',
      readTime: '5 min read',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'PDF Security: Best Practices for 2024',
      excerpt: 'Discover the latest security features and how to protect your PDF documents effectively.',
      author: 'Mike Johnson',
      date: '2024-01-12',
      category: 'PDF Tools',
      readTime: '8 min read',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'Video Conversion Made Simple',
      excerpt: 'A comprehensive guide to converting videos between different formats while maintaining quality.',
      author: 'Emily Rodriguez',
      date: '2024-01-10',
      category: 'Video Tools',
      readTime: '6 min read',
      image: '/placeholder.svg'
    },
    {
      id: 4,
      title: 'Audio Processing Tips for Content Creators',
      excerpt: 'Professional audio editing techniques to enhance your podcasts and video content.',
      author: 'David Kim',
      date: '2024-01-08',
      category: 'Audio Tools',
      readTime: '7 min read',
      image: '/placeholder.svg'
    },
    {
      id: 5,
      title: 'Text Formatting and SEO Optimization',
      excerpt: 'How proper text formatting can improve your content\'s readability and search engine rankings.',
      author: 'Lisa Wang',
      date: '2024-01-05',
      category: 'Text Tools',
      readTime: '4 min read',
      image: '/placeholder.svg'
    },
    {
      id: 6,
      title: 'Productivity Hacks with ZipConvert',
      excerpt: 'Streamline your workflow with these time-saving tips and tool combinations.',
      author: 'Tom Wilson',
      date: '2024-01-03',
      category: 'Productivity',
      readTime: '5 min read',
      image: '/placeholder.svg'
    }
  ];

  const categories = ['All', 'Image Tools', 'PDF Tools', 'Video Tools', 'Audio Tools', 'Text Tools', 'Productivity'];

  return (
    <Layout>
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ZipConvert Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tips, tutorials, and insights to help you get the most out of your digital tools
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  index === 0
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src="/placeholder.svg"
                  alt="Featured post"
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                  <span className="text-gray-500 text-sm ml-4">Image Tools</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {posts[0].title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {posts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-2" />
                    <span className="mr-4">{posts[0].author}</span>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{posts[0].date}</span>
                  </div>
                  <Link
                    to={`/blog/${posts[0].id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    Read More <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-blue-600 text-sm font-medium">{post.category}</span>
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-2" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-white text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-200">
              Load More Posts
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
