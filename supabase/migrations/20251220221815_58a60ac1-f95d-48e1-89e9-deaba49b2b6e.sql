-- Fix 1: Restrict site_settings to only expose non-sensitive fields publicly
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can read settings" ON public.site_settings;

-- Create a view for public settings (only non-sensitive fields)
CREATE OR REPLACE VIEW public.public_site_settings AS
SELECT 
  id,
  hero_title,
  hero_subtitle,
  branding_text,
  branding_url,
  logo_url,
  pricing_enabled,
  price_amount,
  price_currency,
  demo_video_url
FROM public.site_settings;

-- Grant access to the view
GRANT SELECT ON public.public_site_settings TO anon, authenticated;

-- Fix 2: Restrict widgets public access to only necessary fields for embed
DROP POLICY IF EXISTS "Anyone can view widget by analytics token" ON public.widgets;

-- Create a view for public widget data (excludes sensitive fields)
CREATE OR REPLACE VIEW public.public_widgets AS
SELECT 
  id,
  name,
  status,
  video_url,
  video_type,
  video_orientation,
  person_name,
  person_title,
  person_avatar,
  cta_text,
  cta_url,
  cta_color,
  position,
  trigger_type,
  trigger_value,
  primary_color,
  background_color,
  text_color,
  border_radius,
  custom_css,
  animation,
  analytics_token
FROM public.widgets
WHERE status = 'active';

-- Grant access to the view
GRANT SELECT ON public.public_widgets TO anon, authenticated;

-- Fix 3: Tighten widget_analytics policy - require matching token in request
DROP POLICY IF EXISTS "Anyone can view analytics with valid token" ON public.widget_analytics;

-- Analytics should only be viewable by admins or via the PublicAnalytics page (which uses edge function)
-- The edge function uses service role, so we don't need public SELECT

-- Fix 4: Add missing INSERT policy for profiles (for new user signup trigger)
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Fix 5: Add missing INSERT policy for agency_settings
CREATE POLICY "Authenticated users can create agency settings"
ON public.agency_settings
FOR INSERT
WITH CHECK (auth.uid() = user_id);