import { supabase } from '../config/supabase';
import { getHWID } from './hwid';
import { clearVerifications } from './checkpointVerification';
import type { Key } from '../types';

export const getExistingValidKey = async (): Promise<Key | null> => {
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

  // If no valid key is found, clear the checkpoints
  if (!existingKeys || existingKeys.length === 0) {
    clearVerifications();
    return null;
  }

  return existingKeys[0];
};