import { CHECKPOINT_LINKS } from './linkConfig';

const VERIFICATION_STORAGE_KEY = 'checkpoint_verifications';

export interface CheckpointVerificationResult {
  success: boolean;
  timestamp: number;
}

export const getVerifications = (): Record<string, CheckpointVerificationResult> => {
  try {
    const stored = localStorage.getItem(VERIFICATION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading verifications:', error);
    return {};
  }
};

export const clearVerifications = () => {
  try {
    localStorage.removeItem(VERIFICATION_STORAGE_KEY);
    console.log('Verifications cleared successfully');
  } catch (error) {
    console.error('Error clearing verifications:', error);
  }
};

export const saveVerification = (checkpoint: number) => {
  try {
    const verifications = getVerifications();
    verifications[`checkpoint${checkpoint}`] = {
      success: true,
      timestamp: Date.now(),
    };
    localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(verifications));
    console.log(`Checkpoint ${checkpoint} verified and saved`);
  } catch (error) {
    console.error('Error saving verification:', error);
  }
};

export const isCheckpointVerified = (checkpoint: number): boolean => {
  try {
    const verifications = getVerifications();
    const verification = verifications[`checkpoint${checkpoint}`];

    if (!verification) {
      console.log(`Checkpoint ${checkpoint} not found in verifications`);
      return false;
    }

    const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const hasExpired = Date.now() - verification.timestamp > expirationTime;

    if (hasExpired) {
      console.log(`Checkpoint ${checkpoint} has expired`);
      return false;
    }

    return verification.success;
  } catch (error) {
    console.error('Error checking verification:', error);
    return false;
  }
};