import { supabase } from '../config/supabase';
import { getHWID } from './hwid';
import { handleKeyExpiration } from './keyExpiration';

export const validateKey = async (): Promise<boolean> => {
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
      await handleKeyExpiration();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating key:', error);
    return false;
  }
};