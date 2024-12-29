import { CHECKPOINT_LINKS, createReturnUrl } from './linkConfig';
import { saveVerification } from './checkpointVerification';

export const REDIRECT_PARAM = 'checkpoint';
export const TIMESTAMP_PARAM = 't';

// Create the Linkvertise URL with proper destination URL encoding
export const createLinkvertiseUrl = (checkpointNumber: number): string => {
  const baseUrl = CHECKPOINT_LINKS[checkpointNumber as keyof typeof CHECKPOINT_LINKS];
  if (!baseUrl) return '';
  
  // Encode the return URL to ensure it works with Linkvertise
  const returnUrl = encodeURIComponent(createReturnUrl(checkpointNumber));
  
  return baseUrl;
};

// Helper function to validate checkpoint parameter and timestamp
export const validateCheckpoint = (param: string | null): number | null => {
  if (!param) return null;
  
  const num = parseInt(param, 10);
  if (isNaN(num) || num < 1 || num > 3) return null;

  // Save the verification
  saveVerification(num);
  
  return num;
};