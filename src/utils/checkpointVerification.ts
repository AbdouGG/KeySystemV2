import { CHECKPOINT_LINKS } from './linkConfig';

const VERIFICATION_STORAGE_KEY = 'checkpoint_verifications';

export interface CheckpointVerificationResult {
  success: boolean;
  timestamp: number;
}

export const getVerifications = (): Record<string, CheckpointVerificationResult> => {
  const stored = localStorage.getItem(VERIFICATION_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const clearVerifications = () => {
  localStorage.removeItem(VERIFICATION_STORAGE_KEY);
};

export const saveVerification = (checkpoint: number) => {
  const verifications = getVerifications();
  const checkpointKey = `checkpoint${checkpoint}`;
  
  verifications[checkpointKey] = {
    success: true,
    timestamp: Date.now(),
  };
  
  localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(verifications));
};

export const isCheckpointVerified = (checkpoint: number): boolean => {
  const verifications = getVerifications();
  const checkpointKey = `checkpoint${checkpoint}`;
  const verification = verifications[checkpointKey];

  if (!verification) return false;

  // 24 hours in milliseconds
  const expirationTime = 24 * 60 * 60 * 1000;
  const hasExpired = Date.now() - verification.timestamp > expirationTime;

  return verification.success && !hasExpired;
};