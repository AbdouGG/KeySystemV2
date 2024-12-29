import { clearVerifications } from './checkpointVerification';
import { supabase } from '../config/supabase';
import { getHWID } from './hwid';

export const isKeyExpired = (expiresAt: string): boolean => {
  const expirationDate = new Date(expiresAt);
  return expirationDate.getTime() <= Date.now();
};

export const handleKeyExpiration = async () => {
  const hwid = getHWID();
  
  // Invalidate the key in Supabase
  await supabase
    .from('keys')
    .update({ is_valid: false })
    .eq('hwid', hwid)
    .eq('is_valid', true);

  // Clear local verifications and HWID
  clearVerifications();
  localStorage.removeItem('hwid');
};

export const checkKeyStatus = async () => {
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
};