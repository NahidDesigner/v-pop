-- ==============================================================================
-- VideoPopup - Complete Database Migration
-- ==============================================================================
-- Run this file against your self-hosted Supabase PostgreSQL database
-- psql postgresql://postgres:PASSWORD@HOST:5432/postgres -f complete-migration.sql
-- ==============================================================================

-- ============================================================================
-- PART 1: ENUMS
-- ============================================================================

-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'agency');

-- Create enum for widget status
CREATE TYPE public.widget_status AS ENUM ('active', 'paused', 'draft');

-- Create enum for widget position
CREATE TYPE public.widget_position AS ENUM ('bottom-left', 'bottom-right');

-- Create enum for widget trigger type
CREATE TYPE public.widget_trigger AS ENUM ('time', 'scroll', 'exit_intent');


-- ============================================================================
-- PART 2: CORE TABLES
-- ============================================================================

-- User roles table for RBAC
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Clients table
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    website TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Agency settings table
CREATE TABLE public.agency_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    agency_name TEXT NOT NULL,
    logo_url TEXT,
    branding_text TEXT DEFAULT 'Powered by Agency',
    branding_url TEXT,
    widget_limit INTEGER NOT NULL DEFAULT 5,
    widgets_used INTEGER NOT NULL DEFAULT 0,
    custom_domain TEXT,
    notification_email TEXT,
    webhook_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Widgets table
CREATE TABLE public.widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    agency_id UUID REFERENCES public.agency_settings(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    status widget_status NOT NULL DEFAULT 'draft',
    
    -- Video settings
    video_url TEXT NOT NULL,
    video_type TEXT NOT NULL DEFAULT 'youtube',
    video_orientation TEXT NOT NULL DEFAULT 'vertical',
    
    -- Person info
    person_name TEXT,
    person_title TEXT,
    person_avatar TEXT,
    
    -- CTA settings
    cta_text TEXT DEFAULT 'Learn More',
    cta_url TEXT,
    cta_color TEXT DEFAULT '#3B82F6',
    
    -- Positioning and trigger
    position widget_position NOT NULL DEFAULT 'bottom-right',
    trigger_type widget_trigger NOT NULL DEFAULT 'time',
    trigger_value INTEGER DEFAULT 3,
    
    -- Styling
    primary_color TEXT DEFAULT '#3B82F6',
    background_color TEXT DEFAULT '#FFFFFF',
    text_color TEXT DEFAULT '#1F2937',
    border_radius INTEGER DEFAULT 12,
    custom_css TEXT,
    
    -- Animation
    animation TEXT DEFAULT 'slide-up',
    
    -- Billing
    stripe_subscription_id TEXT,
    price_per_month INTEGER DEFAULT 1000,
    
    -- Analytics sharing
    analytics_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
    analytics_password TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    CONSTRAINT widgets_video_orientation_check CHECK (video_orientation IN ('vertical', 'horizontal'))
);

-- Widget analytics table
CREATE TABLE public.widget_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    widget_id UUID REFERENCES public.widgets(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL,
    visitor_id TEXT,
    page_url TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Site settings table
CREATE TABLE public.site_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    branding_text TEXT NOT NULL DEFAULT 'Powered by Video Popup',
    branding_url TEXT NOT NULL DEFAULT '/',
    logo_url TEXT,
    pricing_enabled BOOLEAN NOT NULL DEFAULT false,
    price_amount INTEGER NOT NULL DEFAULT 1000,
    price_currency TEXT NOT NULL DEFAULT 'USD',
    hero_title TEXT NOT NULL DEFAULT 'Video Popups That Convert',
    hero_subtitle TEXT NOT NULL DEFAULT 'Engage your visitors with beautiful video widgets that boost conversions and capture attention.',
    demo_video_url TEXT DEFAULT 'https://vimeo.com/1146508111',
    admin_email TEXT,
    smtp_host TEXT,
    smtp_port INTEGER DEFAULT 587,
    smtp_user TEXT,
    smtp_from TEXT,
    webhook_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Leads table
CREATE TABLE public.leads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    website TEXT,
    company TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Showcase samples table
CREATE TABLE public.showcase_samples (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    website_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Testimonials table
CREATE TABLE public.testimonials (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    company TEXT,
    avatar_url TEXT,
    quote TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);


-- ============================================================================
-- PART 3: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widget_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcase_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- PART 4: FUNCTIONS
-- ============================================================================

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Function to update agency widget count
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


-- ============================================================================
-- PART 5: TRIGGERS
-- ============================================================================

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_widgets_updated_at
  BEFORE UPDATE ON public.widgets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agency_settings_updated_at
  BEFORE UPDATE ON public.agency_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_showcase_samples_updated_at
  BEFORE UPDATE ON public.showcase_samples
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for agency widget count
CREATE TRIGGER on_widget_agency_change
  AFTER INSERT OR DELETE ON public.widgets
  FOR EACH ROW EXECUTE FUNCTION public.update_agency_widget_count();


-- ============================================================================
-- PART 6: RLS POLICIES - USER ROLES
-- ============================================================================

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert user roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete user roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));


-- ============================================================================
-- PART 7: RLS POLICIES - PROFILES
-- ============================================================================

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));


-- ============================================================================
-- PART 8: RLS POLICIES - CLIENTS
-- ============================================================================

CREATE POLICY "Admins can view all clients"
ON public.clients FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert clients"
ON public.clients FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update clients"
ON public.clients FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete clients"
ON public.clients FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));


-- ============================================================================
-- PART 9: RLS POLICIES - AGENCY SETTINGS
-- ============================================================================

CREATE POLICY "Admins can manage all agency settings"
ON public.agency_settings FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Agencies can view own settings"
ON public.agency_settings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Agencies can update own settings"
ON public.agency_settings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create agency settings"
ON public.agency_settings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);


-- ============================================================================
-- PART 10: RLS POLICIES - WIDGETS
-- ============================================================================

CREATE POLICY "Admins can view all widgets"
ON public.widgets FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert widgets"
ON public.widgets FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update widgets"
ON public.widgets FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete widgets"
ON public.widgets FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Agency policies
CREATE POLICY "Agencies can view own widgets"
ON public.widgets FOR SELECT
TO authenticated
USING (agency_id IN (SELECT id FROM public.agency_settings WHERE user_id = auth.uid()));

CREATE POLICY "Agencies can insert own widgets"
ON public.widgets FOR INSERT
TO authenticated
WITH CHECK (
  agency_id IN (SELECT id FROM public.agency_settings WHERE user_id = auth.uid())
  AND (SELECT widgets_used < widget_limit FROM public.agency_settings WHERE user_id = auth.uid())
);

CREATE POLICY "Agencies can update own widgets"
ON public.widgets FOR UPDATE
TO authenticated
USING (agency_id IN (SELECT id FROM public.agency_settings WHERE user_id = auth.uid()));

CREATE POLICY "Agencies can delete own widgets"
ON public.widgets FOR DELETE
TO authenticated
USING (agency_id IN (SELECT id FROM public.agency_settings WHERE user_id = auth.uid()));


-- ============================================================================
-- PART 11: RLS POLICIES - WIDGET ANALYTICS
-- ============================================================================

CREATE POLICY "Admins can view all analytics"
ON public.widget_analytics FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow anonymous inserts for analytics tracking (done via edge function with service role)
CREATE POLICY "Anyone can insert analytics"
ON public.widget_analytics FOR INSERT
TO anon
WITH CHECK (true);


-- ============================================================================
-- PART 12: RLS POLICIES - SITE SETTINGS
-- ============================================================================

CREATE POLICY "Admins can view settings"
ON public.site_settings FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update settings"
ON public.site_settings FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert settings"
ON public.site_settings FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));


-- ============================================================================
-- PART 13: RLS POLICIES - LEADS
-- ============================================================================

CREATE POLICY "Anyone can submit leads"
ON public.leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view leads"
ON public.leads FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update leads"
ON public.leads FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete leads"
ON public.leads FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));


-- ============================================================================
-- PART 14: RLS POLICIES - SHOWCASE SAMPLES
-- ============================================================================

CREATE POLICY "Anyone can view active samples"
ON public.showcase_samples FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage samples"
ON public.showcase_samples FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));


-- ============================================================================
-- PART 15: RLS POLICIES - TESTIMONIALS
-- ============================================================================

CREATE POLICY "Anyone can view active testimonials"
ON public.testimonials FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage testimonials"
ON public.testimonials FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));


-- ============================================================================
-- PART 16: VIEWS FOR PUBLIC ACCESS
-- ============================================================================

-- Public site settings view (excludes sensitive SMTP fields)
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
FROM public.site_settings;

GRANT SELECT ON public.public_site_settings TO anon, authenticated;

-- Public widgets view (excludes sensitive fields)
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
FROM public.widgets
WHERE status = 'active';

GRANT SELECT ON public.public_widgets TO anon, authenticated;


-- ============================================================================
-- PART 17: STORAGE BUCKETS
-- ============================================================================

-- Create storage bucket for sample images
INSERT INTO storage.buckets (id, name, public) VALUES ('samples', 'samples', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for samples bucket
CREATE POLICY "Anyone can view sample images"
ON storage.objects FOR SELECT
USING (bucket_id = 'samples');

CREATE POLICY "Admins can upload sample images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'samples' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update sample images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'samples' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete sample images"
ON storage.objects FOR DELETE
USING (bucket_id = 'samples' AND has_role(auth.uid(), 'admin'::app_role));


-- ============================================================================
-- PART 18: DEFAULT DATA
-- ============================================================================

-- Insert default site settings
INSERT INTO public.site_settings (branding_text, branding_url, hero_title, hero_subtitle)
VALUES (
  'Powered by Video Popup',
  '/',
  'Video Popups That Convert',
  'Engage your visitors with beautiful video widgets that boost conversions and capture attention.'
)
ON CONFLICT DO NOTHING;


-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- Next steps:
-- 1. Create your first user via the signup form
-- 2. Assign admin role: INSERT INTO public.user_roles (user_id, role) VALUES ('your-user-uuid', 'admin');
-- 3. Configure site settings in the admin dashboard
-- ============================================================================
