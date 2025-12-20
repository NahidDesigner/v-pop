-- Add 'agency' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'agency';

-- Add analytics sharing fields to widgets
ALTER TABLE public.widgets
ADD COLUMN IF NOT EXISTS analytics_token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
ADD COLUMN IF NOT EXISTS analytics_password text;

-- Create agency_settings table
CREATE TABLE public.agency_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  agency_name text NOT NULL,
  logo_url text,
  branding_text text DEFAULT 'Powered by Agency',
  branding_url text,
  widget_limit integer NOT NULL DEFAULT 5,
  widgets_used integer NOT NULL DEFAULT 0,
  custom_domain text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agency_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for agency_settings
CREATE POLICY "Admins can manage all agency settings"
ON public.agency_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Agencies can view own settings"
ON public.agency_settings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Agencies can update own settings"
ON public.agency_settings
FOR UPDATE
USING (auth.uid() = user_id);

-- Add agency_id to widgets for agency-created widgets
ALTER TABLE public.widgets
ADD COLUMN IF NOT EXISTS agency_id uuid REFERENCES public.agency_settings(id) ON DELETE SET NULL;

-- Policy for agencies to manage their own widgets
CREATE POLICY "Agencies can view own widgets"
ON public.widgets
FOR SELECT
USING (agency_id IN (SELECT id FROM public.agency_settings WHERE user_id = auth.uid()));

CREATE POLICY "Agencies can insert own widgets"
ON public.widgets
FOR INSERT
WITH CHECK (
  agency_id IN (SELECT id FROM public.agency_settings WHERE user_id = auth.uid())
  AND (SELECT widgets_used < widget_limit FROM public.agency_settings WHERE user_id = auth.uid())
);

CREATE POLICY "Agencies can update own widgets"
ON public.widgets
FOR UPDATE
USING (agency_id IN (SELECT id FROM public.agency_settings WHERE user_id = auth.uid()));

CREATE POLICY "Agencies can delete own widgets"
ON public.widgets
FOR DELETE
USING (agency_id IN (SELECT id FROM public.agency_settings WHERE user_id = auth.uid()));

-- Allow public access to widgets by analytics_token (for password-protected analytics page)
CREATE POLICY "Anyone can view widget by analytics token"
ON public.widgets
FOR SELECT
USING (analytics_token IS NOT NULL);

-- Allow public to view analytics for widgets they have token for
CREATE POLICY "Anyone can view analytics with valid token"
ON public.widget_analytics
FOR SELECT
USING (
  widget_id IN (SELECT id FROM public.widgets WHERE analytics_token IS NOT NULL)
);

-- Trigger to update widgets_used count
CREATE OR REPLACE FUNCTION public.update_agency_widget_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.agency_id IS NOT NULL THEN
    UPDATE public.agency_settings SET widgets_used = widgets_used + 1 WHERE id = NEW.agency_id;
  ELSIF TG_OP = 'DELETE' AND OLD.agency_id IS NOT NULL THEN
    UPDATE public.agency_settings SET widgets_used = widgets_used - 1 WHERE id = OLD.agency_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_widget_agency_change
AFTER INSERT OR DELETE ON public.widgets
FOR EACH ROW
EXECUTE FUNCTION public.update_agency_widget_count();

-- Trigger for updated_at on agency_settings
CREATE TRIGGER update_agency_settings_updated_at
BEFORE UPDATE ON public.agency_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();