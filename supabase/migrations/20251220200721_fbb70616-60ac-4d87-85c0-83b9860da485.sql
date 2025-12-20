-- Add demo video URL and SMTP settings to site_settings
ALTER TABLE public.site_settings 
ADD COLUMN demo_video_url text DEFAULT 'https://vimeo.com/1146508111',
ADD COLUMN admin_email text,
ADD COLUMN smtp_host text,
ADD COLUMN smtp_port integer DEFAULT 587,
ADD COLUMN smtp_user text,
ADD COLUMN smtp_from text;