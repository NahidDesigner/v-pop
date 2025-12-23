-- Create samples table for homepage carousel
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

-- Enable RLS
ALTER TABLE public.showcase_samples ENABLE ROW LEVEL SECURITY;

-- Anyone can view active samples (for homepage)
CREATE POLICY "Anyone can view active samples"
ON public.showcase_samples
FOR SELECT
USING (is_active = true);

-- Admins can manage all samples
CREATE POLICY "Admins can manage samples"
ON public.showcase_samples
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_showcase_samples_updated_at
BEFORE UPDATE ON public.showcase_samples
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for sample images
INSERT INTO storage.buckets (id, name, public) VALUES ('samples', 'samples', true);

-- Allow anyone to view sample images
CREATE POLICY "Anyone can view sample images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'samples');

-- Allow admins to upload sample images
CREATE POLICY "Admins can upload sample images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'samples' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update sample images
CREATE POLICY "Admins can update sample images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'samples' AND has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete sample images
CREATE POLICY "Admins can delete sample images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'samples' AND has_role(auth.uid(), 'admin'::app_role));