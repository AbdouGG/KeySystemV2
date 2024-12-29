import { clearVerifications } from './checkpointVerification';
import { resetCheckpoints } from './checkpointManager';

export const isKeyExpired = (expiresAt: string): boolean => {
  const expirationDate = new Date(expiresAt);
  return expirationDate.getTime() <= Date.now();
};

export const handleKeyExpiration = () => {
  clearVerifications();
  localStorage.removeItem('hwid');
  localStorage.removeItem('checkpoint_verifications');
};