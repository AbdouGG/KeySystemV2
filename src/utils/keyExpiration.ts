import { supabase } from '../config/supabase';
import { clearVerifications } from './checkpointVerification';
import { resetCheckpoints } from './checkpointManager';
import { getHWID } from './hwid';

export const isKeyExpired = (expiresAt: string): boolean => {
  const expirationDate = new Date(expiresAt);
  return expirationDate.getTime() <= Date.now();
};

export const handleKeyExpiration = async (): Promise<void> => {
  try {
    const hwid = getHWID();
    
    // Invalidate expired keys in Supabase
    const { error } = await supabase
      .from('keys')
      .update({ is_valid: false })
      .eq('hwid', hwid)
      .lt('expires_at', new Date().toISOString());

    if (error) {
      console.error('Error invalidating expired keys:', error);
      return;
    }

    // Clear local storage
    clearVerifications();
    localStorage.removeItem('hwid');
    
    // Reset checkpoints
    resetCheckpoints();
  } catch (error) {
    console.error('Error handling key expiration:', error);
  }
};

// Function to check and clean up expired keys periodically
export const startExpirationCheck = (): (() => void) => {
  const checkExpiration = async () => {
    try {
      const hwid = getHWID();
      
      const { data: key, error } = await supabase
        .from('keys')
        .select()
        .eq('hwid', hwid)
        .eq('is_valid', true)
        .maybeSingle();

      if (error) {
        console.error('Error checking key expiration:', error);
        return;
      }

      if (key && isKeyExpired(key.expires_at)) {
        await handleKeyExpiration();
      }
    } catch (error) {
      console.error('Error in expiration check:', error);
    }
  };

  // Check every 5 minutes
  const interval = setInterval(checkExpiration, 5 * 60 * 1000);
  
  // Initial check
  checkExpiration();

  // Return cleanup function
  return () => clearInterval(interval);
};