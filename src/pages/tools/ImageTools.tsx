
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Image, Crop, Palette, Zap, FileImage, Camera } from 'lucide-react';

const tools = [
  {
    name: 'Image Converter',
    description: 'Convert images between different formats including JPEG, PNG, WebP, GIF, and more. Maintain quality while ensuring compatibility across all platforms and browsers.',
    link: '/tools/image/image-converter',
    icon: <FileImage className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'Image Compressor',
    description: 'Reduce image file sizes without losing quality. Optimize images for web use, faster loading times, and reduced bandwidth consumption while maintaining visual appeal.',
    link: '/tools/image/image-compressor',
    icon: <Zap className="h-8 w-8 text-green-500" />
  },
  {
    name: 'Image Resizer',
    description: 'Resize images to specific dimensions or percentages. Perfect for creating thumbnails, social media images, or fitting images to exact specifications.',
    link: '/tools/image/image-resizer',
    icon: <Crop className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'Background Remover',
    description: 'Remove backgrounds from images automatically using AI technology. Create transparent backgrounds or replace them with solid colors or patterns.',
    link: '/tools/image/background-remover',
    icon: <Image className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'Color Palette Extractor',
    description: 'Extract dominant colors from any image to create beautiful color palettes. Perfect for designers looking to match colors or create cohesive designs.',
    link: '/tools/image/color-palette-extractor',
    icon: <Palette className="h-8 w-8 text-red-500" />
  },
  {
    name: 'Photo Editor',
    description: 'Edit images with filters, adjustments, and effects. Crop, rotate, adjust brightness, contrast, saturation, and apply artistic filters to enhance your photos.',
    link: '/tools/image/photo-editor',
    icon: <Camera className="h-8 w-8 text-indigo-500" />
  },
];

const conversionTools = [
    { name: 'JPEG to PNG Converter', description: 'Convert JPEG images to PNG format with transparency support.', link: '/tools/image/jpeg-to-png' },
    { name: 'PNG to JPEG Converter', description: 'Convert PNG files to JPEG format with compression options.', link: '/tools/image/png-to-jpeg' },
    { name: 'WebP Converter', description: 'Convert images to WebP format for better web performance.', link: '/tools/image/webp-converter' },
    { name: 'GIF to MP4 Converter', description: 'Convert animated GIFs to MP4 videos for better compression.', link: '/tools/image/gif-to-mp4' },
    { name: 'SVG to PNG Converter', description: 'Convert vector SVG files to raster PNG images.', link: '/tools/image/svg-to-png' },
    { name: 'HEIC to JPEG Converter', description: 'Convert iPhone HEIC photos to universal JPEG format.', link: '/tools/image/heic-to-jpeg' },
    { name: 'RAW Image Converter', description: 'Convert RAW camera files to common image formats.', link: '/tools/image/raw-converter' },
    { name: 'Batch Image Converter', description: 'Convert multiple images at once to save time.', link: '/tools/image/batch-converter' },
    { name: 'ICO to PNG Converter', description: 'Convert Windows icon files to PNG format.', link: '/tools/image/ico-to-png' },
    { name: 'TIFF to PDF Converter', description: 'Convert TIFF images to PDF documents.', link: '/tools/image/tiff-to-pdf' },
];

const editingTools = [
    { name: 'Image Resizer', description: 'Resize images to specific dimensions or percentages.', link: '/tools/image/image-resizer' },
    { name: 'Image Cropper', description: 'Crop images to remove unwanted areas or focus on subjects.', link: '/tools/image/image-cropper' },
    { name: 'Image Rotator', description: 'Rotate images by any angle or flip horizontally/vertically.', link: '/tools/image/image-rotator' },
    { name: 'Background Remover', description: 'Remove backgrounds from images automatically.', link: '/tools/image/background-remover' },
    { name: 'Image Filters', description: 'Apply artistic filters and effects to enhance photos.', link: '/tools/image/image-filters' },
    { name: 'Brightness Adjuster', description: 'Adjust image brightness, contrast, and exposure.', link: '/tools/image/brightness-adjuster' },
    { name: 'Color Adjuster', description: 'Modify hue, saturation, and color balance.', link: '/tools/image/color-adjuster' },
    { name: 'Image Blur Tool', description: 'Add blur effects or motion blur to images.', link: '/tools/image/image-blur' },
    { name: 'Image Sharpener', description: 'Enhance image sharpness and detail clarity.', link: '/tools/image/image-sharpener' },
    { name: 'Watermark Adder', description: 'Add text or image watermarks to protect images.', link: '/tools/image/watermark-adder' },
];

const optimizationTools = [
    { name: 'Image Compressor', description: 'Reduce file sizes while maintaining image quality.', link: '/tools/image/image-compressor' },
    { name: 'Lossless Compressor', description: 'Compress images without any quality loss.', link: '/tools/image/lossless-compressor' },
    { name: 'JPEG Optimizer', description: 'Optimize JPEG compression for best quality/size ratio.', link: '/tools/image/jpeg-optimizer' },
    { name: 'PNG Optimizer', description: 'Reduce PNG file sizes with advanced compression.', link: '/tools/image/png-optimizer' },
    { name: 'Image Metadata Remover', description: 'Remove EXIF data and metadata from images.', link: '/tools/image/metadata-remover' },
    { name: 'Batch Compressor', description: 'Compress multiple images simultaneously.', link: '/tools/image/batch-compressor' },
    { name: 'Progressive JPEG Creator', description: 'Create progressive JPEGs for faster web loading.', link: '/tools/image/progressive-jpeg' },
    { name: 'Image Size Analyzer', description: 'Analyze and compare image file sizes.', link: '/tools/image/size-analyzer' },
];

const generatorTools = [
    { name: 'Placeholder Image Generator', description: 'Generate placeholder images for design mockups.', link: '/tools/image/placeholder-generator' },
    { name: 'QR Code to Image', description: 'Convert QR codes to downloadable image files.', link: '/tools/image/qr-code-image' },
    { name: 'Gradient Image Generator', description: 'Create gradient backgrounds as image files.', link: '/tools/image/gradient-generator' },
    { name: 'Color Palette Extractor', description: 'Extract color palettes from uploaded images.', link: '/tools/image/color-extractor' },
    { name: 'Noise Pattern Generator', description: 'Generate noise textures and pattern images.', link: '/tools/image/noise-generator' },
    { name: 'Avatar Generator', description: 'Create unique avatar images and profile pictures.', link: '/tools/image/avatar-generator' },
    { name: 'Favicon Generator', description: 'Create favicons from images in multiple sizes.', link: '/tools/image/favicon-generator' },
    { name: 'Social Media Image Generator', description: 'Create images optimized for social platforms.', link: '/tools/image/social-media-generator' },
];

const ImageTools = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Professional Image Processing Tools
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
                Comprehensive image editing, conversion, and optimization tools for photographers, designers, and content creators. Transform, enhance, and optimize your images with professional-grade utilities.
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
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">All Our Image Tools</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">Everything you need for professional image processing, from basic conversions to advanced editing and optimization techniques.</p>
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Editing & Enhancement</h2>
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Optimization & Compression</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {optimizationTools.map((tool) => (
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Generation & Creation</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {generatorTools.map((tool) => (
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
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Why Use Professional Image Tools?</h2>
                <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
                    <p className="text-xl leading-relaxed">
                        In our visually-driven digital world, images are the cornerstone of effective communication, brand identity, and user engagement. Whether you're a professional photographer managing high-resolution shoots, a web designer optimizing graphics for lightning-fast loading times, a social media manager creating compelling visual content, or a business owner maintaining your brand's visual consistency, the ability to efficiently process, edit, and optimize images is absolutely essential for success.
                    </p>
                    
                    <p className="leading-relaxed">
                        The challenges of image management in the modern digital landscape are more complex than ever before. Different platforms require different formats, sizes, and optimization levels. Mobile users expect fast-loading images, while high-resolution displays demand crisp, detailed graphics. Social media platforms each have their own specific requirements for optimal display. Managing these requirements manually is not only time-consuming but often results in compromised quality or suboptimal performance that can hurt user experience and engagement rates.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Comprehensive Format Conversion & Compatibility</h3>
                    
                    <p className="leading-relaxed">
                        Format compatibility is one of the most fundamental challenges in digital image management. Our <Link to="/tools/image/image-converter" className="text-blue-600 hover:underline font-medium">Image Converter</Link> handles all major formats including JPEG, PNG, WebP, GIF, SVG, TIFF, and even newer formats like HEIC from modern smartphones. This ensures your images display correctly across all devices and platforms, from legacy browsers to cutting-edge mobile devices.
                    </p>
                    
                    <p className="leading-relaxed">
                        The <Link to="/tools/image/webp-converter" className="text-blue-600 hover:underline font-medium">WebP Converter</Link> is particularly valuable for web performance optimization, as WebP images can be 25-50% smaller than equivalent JPEG or PNG files while maintaining the same visual quality. For photographers working with iPhone images, our <Link to="/tools/image/heic-to-jpeg" className="text-blue-600 hover:underline font-medium">HEIC to JPEG Converter</Link> ensures compatibility with older systems and software that don't support Apple's newer format. The <Link to="/tools/image/batch-converter" className="text-blue-600 hover:underline font-medium">Batch Converter</Link> processes multiple images simultaneously, saving hours of manual work when dealing with large image libraries.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Advanced Editing & Enhancement Capabilities</h3>
                    
                    <p className="leading-relaxed">
                        Professional image editing goes far beyond basic cropping and resizing. Our <Link to="/tools/image/background-remover" className="text-blue-600 hover:underline font-medium">Background Remover</Link> uses advanced AI technology to automatically detect and remove backgrounds, creating clean, professional product images perfect for e-commerce or marketing materials. This tool alone can save graphic designers hours of manual work that would traditionally require expensive software and advanced skills.
                    </p>
                    
                    <p className="leading-relaxed">
                        The <Link to="/tools/image/image-resizer" className="text-blue-600 hover:underline font-medium">Image Resizer</Link> and <Link to="/tools/image/image-cropper" className="text-blue-600 hover:underline font-medium">Image Cropper</Link> provide pixel-perfect control over image dimensions, essential for meeting platform-specific requirements. Social media managers particularly benefit from these tools when creating content for multiple platforms with different aspect ratio requirements. Our <Link to="/tools/image/color-adjuster" className="text-blue-600 hover:underline font-medium">Color Adjuster</Link> and <Link to="/tools/image/brightness-adjuster" className="text-blue-600 hover:underline font-medium">Brightness Adjuster</Link> tools allow fine-tuning of image appearance to match brand guidelines or enhance visual appeal.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Performance Optimization & Compression</h3>
                    
                    <p className="leading-relaxed">
                        Website performance directly impacts user experience, search engine rankings, and conversion rates. Studies show that a one-second delay in page load time can reduce conversions by 7% and page views by 11%. Image optimization is often the single most effective way to improve website performance, as images typically account for 60-70% of a webpage's total size.
                    </p>
                    
                    <p className="leading-relaxed">
                        Our <Link to="/tools/image/image-compressor" className="text-blue-600 hover:underline font-medium">Image Compressor</Link> uses advanced algorithms to reduce file sizes by up to 80% while maintaining visual quality that's indistinguishable to the human eye. The <Link to="/tools/image/lossless-compressor" className="text-blue-600 hover:underline font-medium">Lossless Compressor</Link> is perfect for situations where absolute quality preservation is required, such as medical imaging or archival photography. For web-specific optimization, our <Link to="/tools/image/progressive-jpeg" className="text-blue-600 hover:underline font-medium">Progressive JPEG Creator</Link> generates images that load incrementally, providing users with a preview while the full image downloads.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Creative Generation & Design Tools</h3>
                    
                    <p className="leading-relaxed">
                        Beyond editing existing images, our platform offers powerful tools for creating new visual content. The <Link to="/tools/image/color-palette-extractor" className="text-blue-600 hover:underline font-medium">Color Palette Extractor</Link> analyzes uploaded images to identify dominant colors, making it easy to create cohesive design schemes or match brand colors across different materials. This is invaluable for maintaining visual consistency across marketing campaigns, website designs, and brand materials.
                    </p>
                    
                    <p className="leading-relaxed">
                        Our <Link to="/tools/image/placeholder-generator" className="text-blue-600 hover:underline font-medium">Placeholder Image Generator</Link> creates custom placeholder images for design mockups and development projects, while the <Link to="/tools/image/social-media-generator" className="text-blue-600 hover:underline font-medium">Social Media Image Generator</Link> creates properly sized images optimized for each major platform. The <Link to="/tools/image/avatar-generator" className="text-blue-600 hover:underline font-medium">Avatar Generator</Link> creates unique profile images, perfect for user accounts or team pages.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Integration with Complete Digital Workflow</h3>
                    
                    <p className="leading-relaxed">
                        Professional image work rarely exists in isolation—it's part of a larger digital workflow that includes web development, content creation, document management, and more. That's why our image tools are designed to integrate seamlessly with the complete ZipConvert ecosystem, allowing you to move fluidly between different types of tasks without breaking your creative flow.
                    </p>
                    
                    <p className="leading-relaxed">
                        After optimizing images, you might need our <Link to="/tools/web" className="text-blue-600 hover:underline font-medium">Web Tools</Link> to generate responsive HTML or CSS for your optimized images. Creating marketing materials often requires our <Link to="/tools/text" className="text-blue-600 hover:underline font-medium">Text Tools</Link> for content creation and formatting. Project documentation might need our <Link to="/tools/pdf" className="text-blue-600 hover:underline font-medium">PDF Tools</Link> for combining images into presentations or reports.
                    </p>
                    
                    <p className="leading-relaxed">
                        For multimedia projects, seamlessly transition to our <Link to="/tools/video" className="text-blue-600 hover:underline font-medium">Video Tools</Link> for creating animations from your optimized images, or use our <Link to="/tools/audio" className="text-blue-600 hover:underline font-medium">Audio Tools</Link> for adding sound to visual presentations. Our <Link to="/tools/productivity" className="text-blue-600 hover:underline font-medium">Productivity</Link> tools help organize and manage large image libraries, while our <Link to="/tools/calculators" className="text-blue-600 hover:underline font-medium">Calculators</Link> assist with aspect ratio calculations and file size planning.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Professional Results with Intuitive Interfaces</h3>
                    
                    <p className="leading-relaxed">
                        Professional-grade image processing capabilities shouldn't require extensive training or expensive software licenses to access. Every tool in our image processing suite is designed to deliver professional results through intuitive, browser-based interfaces that work on any device. Whether you're working on a high-end desktop workstation or a tablet while traveling, you'll have access to the same powerful capabilities.
                    </p>
                    
                    <p className="leading-relaxed">
                        We prioritize both performance and privacy in our image processing tools. All processing happens securely, with images handled responsibly and never stored longer than necessary for the task at hand. Our tools are optimized for speed, with most operations completing in seconds even for large, high-resolution images. This efficiency allows you to maintain creative momentum without waiting for lengthy processing times that can disrupt your workflow.
                    </p>
                    
                    <p className="text-lg leading-relaxed mt-8 font-medium text-gray-800">
                        Transform your image workflow with professional-grade tools that deliver exceptional results without the complexity. Start exploring our comprehensive image processing suite today and discover how much more efficient and creative your visual projects can become.
                    </p>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ImageTools;
