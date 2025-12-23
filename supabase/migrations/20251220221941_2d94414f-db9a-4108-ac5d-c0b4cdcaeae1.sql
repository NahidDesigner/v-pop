-- Fix: Remove the overly permissive widget policy and use the view instead
DROP POLICY IF EXISTS "Anyone can view active widgets for embed" ON public.widgets;

-- Fix: Update the public_widgets view to exclude sensitive fields
DROP VIEW IF EXISTS public.public_widgets;

CREATE VIEW public.public_widgets 
WITH (security_invoker = on)
AS
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
  animation
  -- Explicitly exclude: analytics_token, analytics_password, stripe_subscription_id, agency_id
FROM public.widgets
WHERE status = 'active';

-- Grant access to the view
GRANT SELECT ON public.public_widgets TO anon, authenticated;

-- Fix site_settings: drop the permissive policy and only allow admin access + view access
DROP POLICY IF EXISTS "Anyone can read public settings fields" ON public.site_settings;

-- Update public_site_settings view to ensure it only exposes safe fields
DROP VIEW IF EXISTS public.public_site_settings;

CREATE VIEW public.public_site_settings
WITH (security_invoker = on)
AS
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
  -- Explicitly exclude: smtp_host, smtp_user, smtp_from, smtp_port, admin_email, webhook_url
FROM public.site_settings;

-- Grant access to the view
GRANT SELECT ON public.public_site_settings TO anon, authenticated;