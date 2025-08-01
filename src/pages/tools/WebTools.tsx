
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Globe, Code, Search, Palette, Zap, Shield } from 'lucide-react';

const tools = [
  {
    name: 'HTML Validator',
    description: 'Check your HTML code for errors and ensure it meets web standards. Validate markup, identify issues, and improve your website\'s compatibility across all browsers.',
    link: '/tools/web/HtmlValidator',
    icon: <Code className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'CSS Minifier',
    description: 'Compress your CSS files by removing unnecessary whitespace, comments, and formatting. Reduce file sizes to improve website loading speed and performance.',
    link: '/tools/web/CssMinifier',
    icon: <Zap className="h-8 w-8 text-green-500" />
  },
  {
    name: 'Color Palette Generator',
    description: 'Create beautiful and harmonious color schemes for your website. Generate complementary colors, extract palettes from images, and find the perfect colors for your brand.',
    link: '/tools/web/ColorPaletteGenerator',
    icon: <Palette className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'SEO Meta Tag Generator',
    description: 'Generate optimized meta tags for better search engine visibility. Create title tags, meta descriptions, and Open Graph tags to improve your website\'s SEO performance.',
    link: '/tools/web/SeoMetaTagGenerator',
    icon: <Search className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'Website Speed Test',
    description: 'Analyze your website\'s loading performance and get actionable insights to improve speed. Test page load times, identify bottlenecks, and optimize for better user experience.',
    link: '/tools/web/PageSpeedAnalyzer',
    icon: <Globe className="h-8 w-8 text-red-500" />
  },
  {
    name: 'SSL Certificate Checker',
    description: 'Verify the validity and security of SSL certificates on any website. Check expiration dates, certificate chains, and ensure your site is properly secured.',
    link: '/tools/web/SslCertificateChecker',
    icon: <Shield className="h-8 w-8 text-indigo-500" />
  }
];

const developmentTools = [
    { name: 'HTML Validator', description: 'Validate HTML markup for errors and standards compliance.', link: '/tools/web/HtmlValidator' },
    { name: 'CSS Validator', description: 'Check CSS code for syntax errors and best practices.', link: '/tools/web/CssValidator' },
    { name: 'JavaScript Minifier', description: 'Compress JavaScript files to reduce loading times.', link: '/tools/web/JavaScriptMinifier' },
    { name: 'CSS Minifier', description: 'Minimize CSS files by removing unnecessary characters.', link: '/tools/web/CssMinifier' },
    { name: 'HTML Minifier', description: 'Compress HTML code while preserving functionality.', link: '/tools/web/HtmlMinifier' },
    { name: 'JSON Formatter', description: 'Format and validate JSON data with proper indentation.', link: '/tools/web/JsonFormatter' },
    { name: 'XML Formatter', description: 'Pretty-print XML with proper structure and indentation.', link: '/tools/web/XmlFormatter' },
    { name: 'Base64 Encoder/Decoder', description: 'Convert text to Base64 encoding and vice versa.', link: '/tools/web/Base64EncoderDecoder' },
    { name: 'URL Encoder/Decoder', description: 'Encode and decode URLs for web compatibility.', link: '/tools/web/UrlEncoderDecoder' },
    { name: 'HTML Entity Encoder', description: 'Convert special characters to HTML entities.', link: '/tools/web/HtmlEntityEncoder' },
    { name: 'Regex Tester', description: 'Test and debug regular expressions with live results.', link: '/tools/web/RegexTester' },
];

const seoTools = [
    { name: 'SEO Meta Tag Generator', description: 'Create optimized meta tags for better search rankings.', link: '/tools/web/SeoMetaTagGenerator' },
    { name: 'Open Graph Generator', description: 'Generate Open Graph tags for social media sharing.', link: '/tools/web/OpenGraphGenerator' },
    { name: 'Twitter Card Generator', description: 'Create Twitter Card meta tags for enhanced tweets.', link: '/tools/web/TwitterCardGenerator' },
    { name: 'Robots.txt Generator', description: 'Generate robots.txt files for search engine crawlers.', link: '/tools/web/RobotsTxtGenerator' },
    { name: 'Sitemap Generator', description: 'Create XML sitemaps for better search engine indexing.', link: '/tools/web/SitemapGenerator' },
    { name: 'Schema Markup Generator', description: 'Generate structured data markup for rich snippets.', link: '/tools/web/SchemaMarkupGenerator' },
    { name: 'Keyword Density Analyzer', description: 'Analyze keyword frequency in your web content.', link: '/tools/web/KeywordDensityAnalyzer' },
    { name: 'Page Speed Analyzer', description: 'Analyze website loading speed and performance.', link: '/tools/web/PageSpeedAnalyzer' },
    { name: 'Broken Link Checker', description: 'Find and identify broken links on websites.', link: '/tools/web/BrokenLinkChecker' },
    { name: 'SERP Preview Tool', description: 'Preview how your page appears in search results.', link: '/tools/web/SerpPreviewTool' },
];

const designTools = [
    { name: 'Color Palette Generator', description: 'Create harmonious color schemes for web design.', link: '/tools/web/ColorPaletteGenerator' },
    { name: 'Gradient Generator', description: 'Generate beautiful CSS gradients with live preview.', link: '/tools/web/GradientGenerator' },
    { name: 'Box Shadow Generator', description: 'Create CSS box shadows with visual controls.', link: '/tools/web/BoxShadowGenerator' },
    { name: 'Border Radius Generator', description: 'Generate CSS border-radius properties visually.', link: '/tools/web/BorderRadiusGenerator' },
    { name: 'CSS Grid Generator', description: 'Create CSS Grid layouts with visual interface.', link: '/tools/web/CssGridGenerator' },
    { name: 'Flexbox Generator', description: 'Generate CSS Flexbox layouts with ease.', link: '/tools/web/FlexboxGenerator' },
    { name: 'Font Pairing Tool', description: 'Find perfect font combinations for your website.', link: '/tools/web/FontPairingTool' },
    { name: 'Favicon Generator', description: 'Create favicons in multiple sizes and formats.', link: '/tools/web/FaviconGenerator' },
    { name: 'CSS Animation Generator', description: 'Create CSS animations with keyframes.', link: '/tools/web/CssAnimationGenerator' },
    { name: 'QR Code Generator', description: 'Generate QR codes for websites and content.', link: '/tools/web/QrCodeGenerator' },
];

const securityTools = [
    { name: 'SSL Certificate Checker', description: 'Verify SSL certificate validity and security.', link: '/tools/web/SslCertificateChecker' },
    { name: 'Website Security Scanner', description: 'Scan websites for common security vulnerabilities.', link: '/tools/web/WebsiteSecurityScanner' },
    { name: 'HTTP Header Checker', description: 'Analyze HTTP response headers for security.', link: '/tools/web/HttpHeaderChecker' },
    { name: 'WHOIS Lookup', description: 'Get domain registration and ownership information.', link: '/tools/web/WhoisLookup' },
    { name: 'DNS Lookup Tool', description: 'Query DNS records for any domain name.', link: '/tools/web/DnsLookupTool' },
    { name: 'IP Address Lookup', description: 'Get detailed information about IP addresses.', link: '/tools/web/IpAddressLookup' },
    { name: 'Port Scanner', description: 'Check open ports on servers and websites.', link: '/tools/web/PortScanner' },
    { name: 'Website Uptime Monitor', description: 'Monitor website availability and uptime.', link: '/tools/web/WebsiteUptimeMonitor' },
    { name: 'Ping Test Tool', description: 'Test network connectivity to websites and servers.', link: '/tools/web/PingTestTool' },
];

const WebTools = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Professional Web Development Tools
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
                Essential utilities for web developers, designers, and SEO professionals. Validate code, optimize performance, enhance security, and create stunning designs with our comprehensive web tools.
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
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">All Our Web Tools</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">Comprehensive utilities for every aspect of web development, from coding and debugging to SEO optimization and security analysis.</p>
                </div>

                <div className="space-y-16">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Development & Code</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {developmentTools.map((tool) => (
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">SEO & Marketing</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {seoTools.map((tool) => (
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Design & UI</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {designTools.map((tool) => (
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Security & Analysis</h2>
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

        <div className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Why Use Professional Web Tools?</h2>
                <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
                    <p className="text-xl leading-relaxed">
                        In the rapidly evolving landscape of web development, having the right tools at your disposal can mean the difference between a mediocre website and an exceptional digital experience. Modern web development encompasses far more than just writing code—it requires attention to performance optimization, search engine visibility, security protocols, and user experience design. Our comprehensive suite of web tools empowers developers, designers, and digital marketers to create websites that not only look great but perform exceptionally across all metrics.
                    </p>
                    
                    <p className="leading-relaxed">
                        Whether you're a seasoned developer building complex web applications or a small business owner managing your company's online presence, the challenges remain consistent: ensuring code quality, optimizing for search engines, maintaining security standards, and delivering fast, accessible experiences to users. Manual processes for these tasks are not only time-consuming but often prone to human error, which can result in poor search rankings, security vulnerabilities, or subpar user experiences that drive visitors away.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Essential Development & Code Quality Tools</h3>
                    
                    <p className="leading-relaxed">
                        Code validation and optimization form the foundation of professional web development. Our <Link to="/tools/web/html-validator" className="text-blue-600 hover:underline font-medium">HTML Validator</Link> ensures your markup meets current web standards and maintains compatibility across all browsers and devices. This is crucial for accessibility compliance and SEO performance, as search engines favor well-structured, valid HTML. Similarly, our <Link to="/tools/web/css-validator" className="text-blue-600 hover:underline font-medium">CSS Validator</Link> helps identify syntax errors and non-standard properties that could cause rendering issues.
                    </p>
                    
                    <p className="leading-relaxed">
                        Performance optimization is equally critical in today's speed-conscious web environment. Our <Link to="/tools/web/css-minifier" className="text-blue-600 hover:underline font-medium">CSS Minifier</Link> and <Link to="/tools/web/javascript-minifier" className="text-blue-600 hover:underline font-medium">JavaScript Minifier</Link> tools can significantly reduce file sizes by removing unnecessary whitespace, comments, and formatting—often achieving 20-40% size reductions that translate directly to faster loading times. The <Link to="/tools/web/json-formatter" className="text-blue-600 hover:underline font-medium">JSON Formatter</Link> and <Link to="/tools/web/xml-formatter" className="text-blue-600 hover:underline font-medium">XML Formatter</Link> are indispensable for API development and data processing, making complex data structures readable and debuggable.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Advanced SEO & Marketing Optimization</h3>
                    
                    <p className="leading-relaxed">
                        Search engine optimization has evolved far beyond keyword stuffing and basic meta tags. Modern SEO requires sophisticated understanding of structured data, social media integration, and technical performance factors. Our <Link to="/tools/web/seo-meta-tag-generator" className="text-blue-600 hover:underline font-medium">SEO Meta Tag Generator</Link> creates optimized title tags and meta descriptions that not only appeal to search engines but also maximize click-through rates from search results.
                    </p>
                    
                    <p className="leading-relaxed">
                        Social media visibility is equally important, which is why our <Link to="/tools/web/open-graph-generator" className="text-blue-600 hover:underline font-medium">Open Graph Generator</Link> and <Link to="/tools/web/twitter-card-generator" className="text-blue-600 hover:underline font-medium">Twitter Card Generator</Link> ensure your content displays beautifully when shared across social platforms. The <Link to="/tools/web/schema-markup-generator" className="text-blue-600 hover:underline font-medium">Schema Markup Generator</Link> helps create structured data that enables rich snippets in search results, potentially increasing your visibility and click-through rates significantly.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Creative Design & User Interface Tools</h3>
                    
                    <p className="leading-relaxed">
                        Visual design plays a crucial role in user engagement and brand perception. Our <Link to="/tools/web/color-palette-generator" className="text-blue-600 hover:underline font-medium">Color Palette Generator</Link> uses color theory principles to create harmonious color schemes that enhance readability and user experience. The <Link to="/tools/web/gradient-generator" className="text-blue-600 hover:underline font-medium">Gradient Generator</Link> allows designers to create smooth, professional-looking backgrounds and accents that add visual depth without compromising performance.
                    </p>
                    
                    <p className="leading-relaxed">
                        Modern CSS features like Grid and Flexbox have revolutionized web layout, but they can be complex to master. Our <Link to="/tools/web/css-grid-generator" className="text-blue-600 hover:underline font-medium">CSS Grid Generator</Link> and <Link to="/tools/web/flexbox-generator" className="text-blue-600 hover:underline font-medium">Flexbox Generator</Link> provide visual interfaces for creating responsive layouts, making advanced CSS techniques accessible to developers at all skill levels. These tools generate clean, efficient code that you can customize and integrate into your projects immediately.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Comprehensive Security & Performance Analysis</h3>
                    
                    <p className="leading-relaxed">
                        Website security is not optional in today's digital landscape. Data breaches and security vulnerabilities can destroy user trust and result in significant financial and legal consequences. Our <Link to="/tools/web/ssl-certificate-checker" className="text-blue-600 hover:underline font-medium">SSL Certificate Checker</Link> ensures your site's encryption is properly configured and up-to-date, while the <Link to="/tools/web/website-security-scanner" className="text-blue-600 hover:underline font-medium">Website Security Scanner</Link> identifies common vulnerabilities before they can be exploited.
                    </p>
                    
                    <p className="leading-relaxed">
                        Performance monitoring is equally critical, as even small improvements in loading speed can significantly impact user engagement and search rankings. Studies show that a one-second delay in page load time can reduce conversions by up to 7%. Our <Link to="/tools/web/page-speed-analyzer" className="text-blue-600 hover:underline font-medium">Page Speed Analyzer</Link> provides detailed insights into performance bottlenecks, while the <Link to="/tools/web/broken-link-checker" className="text-blue-600 hover:underline font-medium">Broken Link Checker</Link> helps maintain site integrity by identifying and reporting dead links that could harm user experience and SEO performance.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Integration with the Complete ZipConvert Ecosystem</h3>
                    
                    <p className="leading-relaxed">
                        While our web development tools are comprehensive and powerful, they represent just one facet of the complete ZipConvert toolkit ecosystem. We understand that modern digital projects require diverse capabilities that extend far beyond web development. That's why we've created an integrated platform where you can seamlessly transition between different types of tasks without losing momentum or switching between multiple services.
                    </p>
                    
                    <p className="leading-relaxed">
                        Need to optimize images for your website? Our <Link to="/tools/image" className="text-blue-600 hover:underline font-medium">Image Tools</Link> provide comprehensive conversion, compression, and editing capabilities. Working on content strategy? Switch to our <Link to="/tools/text" className="text-blue-600 hover:underline font-medium">Text Tools</Link> for content optimization and formatting. Managing project budgets and calculations? Our <Link to="/tools/calculators" className="text-blue-600 hover:underline font-medium">Calculators</Link> handle everything from basic math to complex financial projections.
                    </p>
                    
                    <p className="leading-relaxed">
                        For multimedia projects, our <Link to="/tools/video" className="text-blue-600 hover:underline font-medium">Video Tools</Link> and <Link to="/tools/audio" className="text-blue-600 hover:underline font-medium">Audio Tools</Link> provide essential conversion and editing capabilities, while our <Link to="/tools/pdf" className="text-blue-600 hover:underline font-medium">PDF Tools</Link> handle document management tasks. Security-conscious users will appreciate our <Link to="/tools/security" className="text-blue-600 hover:underline font-medium">Security Tools</Link> for password generation and encryption, and our <Link to="/tools/productivity" className="text-blue-600 hover:underline font-medium">Productivity</Link> suite keeps your workflow organized and efficient.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Professional-Grade Results with User-Friendly Interfaces</h3>
                    
                    <p className="leading-relaxed">
                        At ZipConvert, we believe that powerful professional tools shouldn't require extensive training or complex workflows to be effective. Every tool in our web development suite is designed with both novice and expert users in mind, featuring intuitive interfaces that make complex tasks accessible while providing the depth and customization options that professionals demand.
                    </p>
                    
                    <p className="leading-relaxed">
                        Our tools are browser-based and require no downloads or installations, making them accessible from any device with an internet connection. We prioritize user privacy and data security, ensuring that your code, designs, and analysis data are handled responsibly and never stored longer than necessary. Whether you're debugging a complex application, optimizing for search engines, or creating beautiful user interfaces, our web tools are engineered to help you achieve professional results efficiently and effectively.
                    </p>
                    
                    <p className="text-lg leading-relaxed mt-8 font-medium text-gray-800">
                        Elevate your web development workflow with professional-grade tools designed for the modern web. Start exploring our comprehensive collection today and experience the difference that the right utilities can make in your development process.
                    </p>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WebTools;
