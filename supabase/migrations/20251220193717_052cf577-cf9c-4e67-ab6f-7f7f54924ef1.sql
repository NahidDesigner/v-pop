-- Add video_orientation column to widgets table
ALTER TABLE public.widgets 
ADD COLUMN video_orientation TEXT NOT NULL DEFAULT 'vertical';

-- Add a check constraint for valid values
ALTER TABLE public.widgets 
ADD CONSTRAINT widgets_video_orientation_check 
CHECK (video_orientation IN ('vertical', 'horizontal'));