import { clearVerifications } from './checkpointVerification';

export const isKeyExpired = (expiresAt: string): boolean => {
  const expirationDate = new Date(expiresAt);
  return expirationDate.getTime() <= Date.now();
};

export const handleKeyExpiration = () => {
  clearVerifications();
  // Remove the HWID reset since we don't want to allow new key generation
  // localStorage.removeItem('hwid');
};