import { CHECKPOINT_LINKS } from './linkConfig';

export interface CheckpointVerificationResult {
  success: boolean;
  timestamp: number;
}

// Store checkpoint verification results in localStorage
const VERIFICATION_STORAGE_KEY = 'checkpoint_verifications';

export const getVerifications = (): Record<string, CheckpointVerificationResult> => {
  const stored = localStorage.getItem(VERIFICATION_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const saveVerification = (checkpoint: number) => {
  console.log(`Saving verification for checkpoint ${checkpoint}`);
  const verifications = getVerifications();
  verifications[`checkpoint${checkpoint}`] = {
    success: true,
    timestamp: Date.now()
  };
  localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(verifications));
  console.log('Current verifications:', verifications);
};

export const isCheckpointVerified = (checkpoint: number): boolean => {
  const verifications = getVerifications();
  const verification = verifications[`checkpoint${checkpoint}`];
  
  console.log(`Checking verification for checkpoint ${checkpoint}:`, verification);
  
  if (!verification) {
    console.log(`No verification found for checkpoint ${checkpoint}`);
    return false;
  }
  
  // Verification expires after 24 hours
  const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const hasExpired = Date.now() - verification.timestamp > expirationTime;
  
  const isValid = verification.success && !hasExpired;
  console.log(`Checkpoint ${checkpoint} verification valid:`, isValid);
  
  return isValid;
};