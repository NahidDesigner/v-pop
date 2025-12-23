-- Fix public access for public views and tables
-- This migration ensures anonymous users can access public data

-- 1. Fix public_site_settings view access
-- The view uses security_invoker, so we need a policy on the underlying site_settings table
-- Drop conflicting policies first
DROP POLICY IF EXISTS "Anyone can read settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can read public settings fields" ON public.site_settings;

-- Add policy to allow anon users to read site_settings (needed for the view)
CREATE POLICY "Anon can read site settings for public view"
ON public.site_settings
FOR SELECT
TO anon
USING (true);

-- Ensure authenticated users can also read (for the view)
CREATE POLICY "Authenticated can read site settings"
ON public.site_settings
FOR SELECT
TO authenticated
USING (true);

-- 2. Fix showcase_samples table - ensure anon can read active samples
-- The policy should already exist, but let's ensure it's correct
DROP POLICY IF EXISTS "Anyone can view active samples" ON public.showcase_samples;

CREATE POLICY "Anyone can view active samples"
ON public.showcase_samples
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- 3. Create testimonials table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  avatar_url TEXT,
  quote TEXT NOT NULL,
  rating INTEGER,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view active testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;

-- Allow anyone to view active testimonials (for homepage)
CREATE POLICY "Anyone can view active testimonials"
ON public.testimonials
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Allow admins to manage all testimonials
CREATE POLICY "Admins can manage testimonials"
ON public.testimonials
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at on testimonials
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Ensure the public_site_settings view has proper grants
-- Re-grant access (in case it was lost)
GRANT SELECT ON public.public_site_settings TO anon, authenticated;

-- 5. Ensure site_settings table has at least one row for the view to work
-- Insert default settings if none exist
INSERT INTO public.site_settings (id, hero_title, hero_subtitle, branding_text, branding_url)
SELECT 
  gen_random_uuid(),
  'Video Popups That Convert',
  'Engage your visitors with beautiful video widgets that boost conversions and capture attention.',
  'Powered by Video Popup',
  '/'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

