import { supabase } from '../config/supabase';
import { clearVerifications } from './checkpointVerification';
import { resetCheckpoints } from './checkpointManager';
import { getHWID } from './hwid';

export const isKeyExpired = (expiresAt: string): boolean => {
  const expirationDate = new Date(expiresAt);
  return expirationDate.getTime() <= Date.now();
};

export const handleKeyExpiration = async () => {
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
    }

    // Clear local storage
    clearVerifications();
    localStorage.removeItem('hwid');
    
    // Reset checkpoints
    resetCheckpoints();
    
    // Force reload to reset the UI state
    window.location.reload();
  } catch (error) {
    console.error('Error handling key expiration:', error);
  }
};

// Function to check and clean up expired keys periodically
export const startExpirationCheck = () => {
  const checkExpiration = async () => {
    try {
      const hwid = getHWID();
      
      // Get current valid key
      const { data: keys, error } = await supabase
        .from('keys')
        .select('*')
        .eq('hwid', hwid)
        .eq('is_valid', true)
        .single();

      if (error) {
        console.error('Error checking key expiration:', error);
        return;
      }

      if (keys && isKeyExpired(keys.expires_at)) {
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

  return () => clearInterval(interval);
};