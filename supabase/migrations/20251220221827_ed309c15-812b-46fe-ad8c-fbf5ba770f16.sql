-- Fix the SECURITY DEFINER view issue by setting them to SECURITY INVOKER
ALTER VIEW public.public_site_settings SET (security_invoker = on);
ALTER VIEW public.public_widgets SET (security_invoker = on);

-- We need to add back a restricted SELECT policy for site_settings (for public view access)
CREATE POLICY "Anyone can read public settings fields"
ON public.site_settings
FOR SELECT
USING (true);

-- Add a restricted SELECT policy for widgets (for embed script access)
CREATE POLICY "Anyone can view active widgets for embed"
ON public.widgets
FOR SELECT
USING (status = 'active'::widget_status);