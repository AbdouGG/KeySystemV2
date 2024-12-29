import { CHECKPOINT_LINKS } from './linkConfig';

export interface CheckpointVerificationResult {
  success: boolean;
  timestamp: number;
}

const VERIFICATION_STORAGE_KEY = 'checkpoint_verifications';

export const getVerifications = (): Record<
  string,
  CheckpointVerificationResult
> => {
  const stored = localStorage.getItem(VERIFICATION_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const clearVerifications = () => {
  localStorage.removeItem(VERIFICATION_STORAGE_KEY);
};

export const saveVerification = (checkpoint: number) => {
  const verifications = getVerifications();
  verifications[`checkpoint${checkpoint}`] = {
    success: true,
    timestamp: Date.now(),
  };
  localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(verifications));
};

export const isCheckpointVerified = (checkpoint: number): boolean => {
  const verifications = getVerifications();
  const verification = verifications[`checkpoint${checkpoint}`];

  if (!verification) return false;

  const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const hasExpired = Date.now() - verification.timestamp > expirationTime;

  return verification.success && !hasExpired;
};
