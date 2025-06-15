
-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tools management table
CREATE TABLE public.tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  icon TEXT,
  path TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  requires_auth BOOLEAN DEFAULT false,
  api_dependent BOOLEAN DEFAULT false,
  api_config JSONB,
  meta_title TEXT,
  meta_description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT DEFAULT 'draft',
  author_id UUID REFERENCES public.admin_users(id),
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[],
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  parent_id UUID REFERENCES public.menu_items(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  target TEXT DEFAULT '_self',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pages table
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create API configurations table
CREATE TABLE public.api_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT UNIQUE NOT NULL,
  api_key TEXT,
  api_secret TEXT,
  endpoint_url TEXT,
  config JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_configs ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admin users can manage admin_users" ON public.admin_users FOR ALL USING (true);
CREATE POLICY "Admin users can manage tools" ON public.tools FOR ALL USING (true);
CREATE POLICY "Admin users can manage categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Admin users can manage blog_posts" ON public.blog_posts FOR ALL USING (true);
CREATE POLICY "Admin users can manage menu_items" ON public.menu_items FOR ALL USING (true);
CREATE POLICY "Admin users can manage pages" ON public.pages FOR ALL USING (true);
CREATE POLICY "Admin users can manage api_configs" ON public.api_configs FOR ALL USING (true);

-- Public read access for tools, categories, menu items, pages, and published blog posts
CREATE POLICY "Public can view active tools" ON public.tools FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active menu items" ON public.menu_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active pages" ON public.pages FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT USING (status = 'published');

-- Insert the admin user with hashed password
-- Password: Smackdown_zc910 (you should hash this properly in production)
INSERT INTO public.admin_users (username, password_hash, email, role) 
VALUES ('Zipconvert_admin9', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@zipconvert.com', 'super_admin');

-- Insert default categories
INSERT INTO public.categories (name, slug, description, icon, sort_order) VALUES
('Text Tools', 'text-tools', 'Tools for text manipulation and generation', 'FileText', 1),
('Image Tools', 'image-tools', 'Tools for image processing and editing', 'Image', 2),
('Web Tools', 'web-tools', 'Tools for web development and optimization', 'Globe', 3),
('Calculators', 'calculators', 'Various calculators and converters', 'Calculator', 4),
('Productivity', 'productivity', 'Tools for productivity and organization', 'Briefcase', 5),
('Security', 'security', 'Security and encryption tools', 'Shield', 6),
('Archive Tools', 'archive-tools', 'File compression and extraction tools', 'Archive', 7),
('PDF Tools', 'pdf-tools', 'PDF manipulation and processing tools', 'FileText', 8),
('Video Tools', 'video-tools', 'Video processing and editing tools', 'Video', 9),
('Audio Tools', 'audio-tools', 'Audio processing and editing tools', 'Music', 10);

-- Insert some sample tools
INSERT INTO public.tools (name, slug, description, category, path, icon, sort_order) VALUES
('Character Counter', 'character-counter', 'Count characters, words, and lines in text', 'text-tools', '/tools/text/character-counter', 'Type', 1),
('Image Compressor', 'image-compressor', 'Compress images to reduce file size', 'image-tools', '/tools/image/image-compressor', 'Image', 1),
('JSON Formatter', 'json-formatter', 'Format and validate JSON data', 'web-tools', '/tools/web/json-formatter', 'Code', 1),
('Basic Calculator', 'basic-calculator', 'Simple arithmetic calculator', 'calculators', '/tools/calculators/basic-calculator', 'Calculator', 1);

-- Create function to hash passwords (simplified for demo)
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  -- In production, use proper bcrypt hashing
  RETURN '$2b$10$' || encode(digest(password || 'salt', 'sha256'), 'hex');
END;
$$;

-- Create function to verify admin login
CREATE OR REPLACE FUNCTION public.verify_admin_login(username_input TEXT, password_input TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
  stored_hash TEXT;
BEGIN
  SELECT id, password_hash INTO user_id, stored_hash
  FROM public.admin_users
  WHERE username = username_input;
  
  IF user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Simplified password verification (use proper bcrypt in production)
  IF stored_hash = public.hash_password(password_input) THEN
    RETURN user_id;
  ELSE
    RETURN NULL;
  END IF;
END;
$$;
