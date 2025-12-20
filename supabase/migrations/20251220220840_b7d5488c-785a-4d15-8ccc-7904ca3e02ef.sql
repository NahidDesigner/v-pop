-- Add webhook_url and notification_email to agency_settings table
ALTER TABLE public.agency_settings 
ADD COLUMN IF NOT EXISTS notification_email text,
ADD COLUMN IF NOT EXISTS webhook_url text;

-- Add logo_url and webhook_url to site_settings table
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS webhook_url text;