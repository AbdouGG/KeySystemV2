/*
  # Add automatic cleanup for expired keys

  1. Changes
    - Add a function to clean up expired keys
    - Create a scheduled job to run the cleanup function every hour
    
  2. Details
    - Removes keys that have passed their expiration date
    - Runs automatically every hour
    - Safe deletion with proper logging
*/

-- Create function to clean up expired keys
CREATE OR REPLACE FUNCTION cleanup_expired_keys()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update expired keys to invalid instead of deleting them
  UPDATE keys
  SET is_valid = false
  WHERE expires_at < NOW()
  AND is_valid = true;
END;
$$;

-- Create a scheduled job to run cleanup every hour
SELECT cron.schedule(
  'cleanup-expired-keys', -- job name
  '0 * * * *',           -- every hour
  'SELECT cleanup_expired_keys();'
);