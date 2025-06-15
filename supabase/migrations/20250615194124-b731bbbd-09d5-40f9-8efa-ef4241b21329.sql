
-- First, let's check what's in the database and fix the hash function
-- Update the hash_password function to work correctly
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  -- Use a consistent hashing approach
  RETURN '$2b$10$' || encode(digest(password || 'zipconvert_salt_2024', 'sha256'), 'hex');
END;
$$;

-- Update the verify_admin_login function to handle the password correctly
CREATE OR REPLACE FUNCTION public.verify_admin_login(username_input TEXT, password_input TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
  stored_hash TEXT;
  computed_hash TEXT;
BEGIN
  SELECT id, password_hash INTO user_id, stored_hash
  FROM public.admin_users
  WHERE username = username_input;
  
  IF user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Compute the hash for the input password
  computed_hash := public.hash_password(password_input);
  
  -- Compare the hashes
  IF stored_hash = computed_hash THEN
    RETURN user_id;
  ELSE
    RETURN NULL;
  END IF;
END;
$$;

-- Update the admin user with the new hash
UPDATE public.admin_users 
SET password_hash = public.hash_password('Smackdown_zc910')
WHERE username = 'Zipconvert_admin9';
