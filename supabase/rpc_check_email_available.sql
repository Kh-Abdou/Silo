-- FUNCTION: check_email_available
-- PURPOSE: Check if an email is already taken by another user in auth.users
-- SECURITY: STRICT (Security Definer allows checking auth.users without exposing it)

-- Ensure the public schema is usable by the API roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION check_email_available(email_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Check if email exists in auth.users
  -- Returns TRUE if TAKEN (found) -> This matches logic: if (alreadyTaken)
  -- Returns FALSE if AVAILABLE (not found)
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE email = email_input
  );
END;
$$;

-- Grant permissions (Essential!)
GRANT EXECUTE ON FUNCTION check_email_available(text) TO authenticated;
GRANT EXECUTE ON FUNCTION check_email_available(text) TO service_role;
GRANT EXECUTE ON FUNCTION check_email_available(text) TO anon;

COMMENT ON FUNCTION check_email_available IS 'Checks if an email is taken (true) or available (false).';
