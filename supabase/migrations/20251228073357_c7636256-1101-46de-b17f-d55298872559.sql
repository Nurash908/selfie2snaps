-- Update handle_new_user function with input validation for display_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  clean_display_name TEXT;
BEGIN
  -- Sanitize and validate display_name from user metadata
  clean_display_name := TRIM(NEW.raw_user_meta_data ->> 'display_name');
  
  -- Limit length to 100 characters
  IF clean_display_name IS NOT NULL AND LENGTH(clean_display_name) > 100 THEN
    clean_display_name := SUBSTRING(clean_display_name, 1, 100);
  END IF;
  
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NULLIF(clean_display_name, ''));
  RETURN NEW;
END;
$$;

-- Add CHECK constraint to profiles table for display_name length
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS display_name_length;

ALTER TABLE public.profiles
ADD CONSTRAINT display_name_length CHECK (display_name IS NULL OR LENGTH(display_name) <= 100);