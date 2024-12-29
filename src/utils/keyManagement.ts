import { supabase } from '../config/supabase';
import { getHWID } from './hwid';
import { handleKeyExpiration } from './keyExpiration';
import type { Key } from '../types';

export const getExistingValidKey = async (): Promise<Key | null> => {
  try {
    const hwid = getHWID();
    const now = new Date();

    const { data: existingKeys, error } = await supabase
      .from('keys')
      .select('*')
      .eq('hwid', hwid)
      .eq('is_valid', true)
      .gte('expires_at', now.toISOString())
      .limit(1);

    if (error) throw error;

    if (!existingKeys?.length) return null;

    const key = existingKeys[0];
    
    // Check if key is expired
    if (new Date(key.expires_at) <= now) {
      await handleKeyExpiration();
      return null;
    }

    return key;
  } catch (error) {
    console.error('Error getting existing key:', error);
    return null;
  }
};

export const invalidateExpiredKeys = async () => {
  try {
    const { error } = await supabase
      .from('keys')
      .update({ is_valid: false })
      .lt('expires_at', new Date().toISOString())
      .eq('is_valid', true);

    if (error) {
      console.error('Error invalidating expired keys:', error);
    }
  } catch (error) {
    console.error('Error in invalidateExpiredKeys:', error);
  }
};