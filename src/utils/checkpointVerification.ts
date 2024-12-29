import { CHECKPOINT_LINKS } from './linkConfig';

export interface CheckpointVerificationResult {
  success: boolean;
  timestamp: number;
}

const VERIFICATION_STORAGE_KEY = 'checkpoint_verifications';

export const getVerifications = (): Record<string, CheckpointVerificationResult> => {
  try {
    const stored = localStorage.getItem(VERIFICATION_STORAGE_KEY);
    if (!stored) return {};
    
    const verifications = JSON.parse(stored);
    // Ensure we have valid verification data
    if (typeof verifications !== 'object') return {};
    
    return verifications;
  } catch (error) {
    console.error('Error reading verifications:', error);
    return {};
  }
};

export const clearVerifications = () => {
  localStorage.removeItem(VERIFICATION_STORAGE_KEY);
};

export const saveVerification = (checkpoint: number) => {
  try {
    const verifications = getVerifications();
    const key = `checkpoint${checkpoint}`;
    
    // Update verification
    verifications[key] = {
      success: true,
      timestamp: Date.now()
    };
    
    // Save all verifications
    localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(verifications));
    
    // Force a page reload to update the UI
    window.location.reload();
  } catch (error) {
    console.error('Error saving verification:', error);
  }
};

export const isCheckpointVerified = (checkpoint: number): boolean => {
  try {
    const verifications = getVerifications();
    const key = `checkpoint${checkpoint}`;
    const verification = verifications[key];

    if (!verification?.success) return false;

    // Check if verification is still valid (48 hours)
    const expirationTime = 48 * 60 * 60 * 1000;
    return (Date.now() - verification.timestamp) <= expirationTime;
  } catch (error) {
    console.error('Error checking verification:', error);
    return false;
  }
};