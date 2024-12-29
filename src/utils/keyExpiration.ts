import { clearVerifications } from './checkpointVerification';

export const isKeyExpired = (expiresAt: string): boolean => {
  const expirationDate = new Date(expiresAt);
  return expirationDate.getTime() <= Date.now();
};

export const handleKeyExpiration = () => {
  clearVerifications();
  localStorage.removeItem('hwid');
};