
-- Create enhanced_page_contents table for granular content management
CREATE TABLE IF NOT EXISTS public.enhanced_page_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL,
  page_name TEXT NOT NULL,
  page_title TEXT NOT NULL,
  section_name TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'textarea', 'list', 'image_url')),
  content_value TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 1,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enhanced_page_contents_page_name ON public.enhanced_page_contents(page_name);
CREATE INDEX IF NOT EXISTS idx_enhanced_page_contents_page_id ON public.enhanced_page_contents(page_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_page_contents_section_name ON public.enhanced_page_contents(section_name);

-- Add RLS policies
ALTER TABLE public.enhanced_page_contents ENABLE ROW LEVEL SECURITY;

-- Allow public read access for displaying content
CREATE POLICY "Allow public read access" ON public.enhanced_page_contents
FOR SELECT USING (true);

-- Allow admin write access
CREATE POLICY "Allow admin write access" ON public.enhanced_page_contents
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_enhanced_page_contents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_enhanced_page_contents_updated_at
  BEFORE UPDATE ON public.enhanced_page_contents
  FOR EACH ROW
  EXECUTE FUNCTION update_enhanced_page_contents_updated_at();
