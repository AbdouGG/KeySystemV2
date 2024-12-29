import { clearVerifications } from './checkpointVerification';
import { supabase } from '../config/supabase';
import { getHWID } from './hwid';

export const checkKeyStatus = async (): Promise<boolean> => {
  try {
    const hwid = getHWID();
    const now = new Date();

    const { data: key } = await supabase
      .from('keys')
      .select('*')
      .eq('hwid', hwid)
      .eq('is_valid', true)
      .gte('expires_at', now.toISOString())
      .single();

    if (!key) {
      // Key is invalid or expired, clear local data
      clearVerifications();
      localStorage.removeItem('hwid');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking key status:', error);
    return false;
  }
};