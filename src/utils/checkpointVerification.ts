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
  const key = `checkpoint${checkpoint}`;
  verifications[key] = {
    success: true,
    timestamp: Date.now(),
  };
  localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(verifications));
};

export const isCheckpointVerified = (checkpoint: number): boolean => {
  const verifications = getVerifications();
  const key = `checkpoint${checkpoint}`;
  const verification = verifications[key];

  if (!verification) return false;

  // Increased expiration time to 48 hours to prevent early expiration
  const expirationTime = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
  const hasExpired = Date.now() - verification.timestamp > expirationTime;

  if (hasExpired) {
    // Remove expired verification
    const updatedVerifications = { ...verifications };
    delete updatedVerifications[key];
    localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(updatedVerifications));
    return false;
  }

  return verification.success;
};