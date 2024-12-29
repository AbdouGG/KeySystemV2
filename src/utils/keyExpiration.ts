import { clearVerifications } from './checkpointVerification';
import { supabase } from '../config/supabase';

export const isKeyExpired = (expiresAt: string): boolean => {
  const expirationDate = new Date(expiresAt);
  return expirationDate.getTime() <= Date.now();
};

export const deleteExpiredKey = async (keyId: string) => {
  try {
    const { error } = await supabase
      .from('keys')
      .delete()
      .eq('id', keyId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting expired key:', error);
  }
};

export const handleKeyExpiration = async (keyId?: string) => {
  if (keyId) {
    await deleteExpiredKey(keyId);
  }
  clearVerifications();
  localStorage.removeItem('hwid');
};